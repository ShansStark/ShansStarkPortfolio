import { useEffect, useRef, useState } from 'react'

const NODES = {
  net: { x: 95, y: 70, w: 130, label: 'Internet', kind: 'ext' },
  onprem: { x: 95, y: 350, w: 130, label: 'On-Premises', kind: 'ext' },
  hub: { x: 400, y: 210, w: 210, label: 'Hub · Firewall + VPN GW', kind: 'hub' },
  A: { x: 700, y: 70, w: 160, label: 'Spoke A · Web VM', kind: 'spoke' },
  B: { x: 700, y: 210, w: 160, label: 'Spoke B · App VM', kind: 'spoke' },
  C: { x: 700, y: 350, w: 160, label: 'Spoke C · PaaS (PE)', kind: 'spoke' },
}
const LINKS = [
  ['net', 'hub'],
  ['onprem', 'hub'],
  ['hub', 'A'],
  ['hub', 'B'],
  ['hub', 'C'],
]
const OPTIONS = [
  { key: 'udr', label: 'UDR → Firewall', hint: 'Route tables send spoke traffic to the firewall' },
  { key: 'fw', label: 'Firewall rule allows', hint: 'A network / DNAT rule matches this flow' },
  { key: 'nsg', label: 'NSG allows', hint: 'NSG on the Azure endpoint permits the flow' },
  { key: 'gw', label: 'Gateway transit', hint: 'Hub allows gateway transit, spoke uses remote gateway' },
]
const PRESETS = [
  { label: 'Why can’t spokes talk?', src: 'A', dst: 'B', o: { udr: false } },
  { label: 'Fix it with a UDR', src: 'A', dst: 'B', o: { udr: true } },
  { label: 'On-prem → Private Endpoint', src: 'onprem', dst: 'C', o: {} },
  { label: 'Gateway transit missing', src: 'onprem', dst: 'A', o: { gw: false } },
  { label: 'Outbound via NAT Gateway', src: 'A', dst: 'net', o: { udr: false } },
  { label: 'Firewall blocks it', src: 'net', dst: 'B', o: { fw: false } },
]
const DEFAULTS = { udr: true, fw: true, nsg: true, gw: true }

const isSpoke = (id) => NODES[id].kind === 'spoke'
const nm = (id) => NODES[id].label

// Pure routing model: returns the path, where (if anywhere) it is blocked, and a log.
export function simulate(src, dst, o) {
  if (src === dst) return { error: 'Pick two different endpoints.' }
  if (!isSpoke(src) && !isSpoke(dst)) return { error: 'Both ends are outside Azure. Pick at least one spoke.' }

  const path = [src]
  const logs = []
  let blocked = null
  let fix = null

  const hop = (id, msg) => {
    path.push(id)
    if (msg) logs.push(msg)
  }
  const block = (id, msg, f) => {
    if (!path.includes(id)) path.push(id)
    blocked = id
    fix = f
    logs.push(msg)
  }
  const nsgAt = (id, dir) => {
    if (o.nsg) {
      logs.push(`NSG on ${nm(id)} allows ${dir}.`)
      return true
    }
    block(id, `Denied by NSG on ${nm(id)} (${dir}).`, 'Add an allow rule with a lower priority number than the deny, on the subnet or NIC NSG.')
    return false
  }
  const fwCheck = (what) => {
    if (o.fw) {
      logs.push(`Azure Firewall: ${what} allowed.`)
      return true
    }
    block('hub', `Azure Firewall dropped it: no ${what} rule matches (default is deny).`, 'Add the matching network rule (or DNAT rule for inbound Internet) in a rule collection.')
    return false
  }

  logs.push(`${nm(src)} → ${nm(dst)}`)

  // Spoke to spoke
  if (isSpoke(src) && isSpoke(dst)) {
    logs.push('Both VNets are peered to the hub only.')
    if (!o.udr) {
      hop('hub')
      block('hub', 'Dropped. Peering is not transitive: the hub will not forward spoke traffic by itself.', 'Add UDRs in each spoke with next hop = Azure Firewall private IP, and enable forwarded traffic on the peerings.')
    } else {
      logs.push('UDR next hop = Azure Firewall (10.0.1.4).')
      hop('hub')
      if (fwCheck('spoke-to-spoke network')) {
        hop(dst)
        nsgAt(dst, 'inbound')
      }
    }
  }
  // On-prem to spoke
  else if (src === 'onprem') {
    hop('hub', 'Tunnel ends on the VPN Gateway in the hub.')
    if (!o.gw) {
      block('hub', 'Dropped. The spoke prefix is not reachable through the gateway.', 'On the hub peering enable "Allow gateway transit", on the spoke peering enable "Use remote gateway", then check learned routes.')
    } else {
      logs.push('Gateway transit on: spoke prefix is advertised to on-prem.')
      if (!o.udr || fwCheck('on-prem to spoke network')) {
        if (!o.udr) logs.push('No UDR on the gateway subnet: traffic goes straight to the spoke.')
        hop(dst)
        nsgAt(dst, 'inbound')
      }
    }
  }
  // Spoke to on-prem
  else if (dst === 'onprem') {
    if (nsgAt(src, 'outbound')) {
      hop('hub')
      if (!o.gw) {
        block('hub', 'Dropped. The spoke has no route to the on-prem prefix.', 'Enable "Use remote gateway" on the spoke peering so it learns routes from the VPN Gateway.')
      } else if (!o.udr || fwCheck('spoke to on-prem network')) {
        hop('onprem', 'Out through the VPN Gateway tunnel.')
      }
    }
  }
  // Internet to spoke
  else if (src === 'net') {
    hop('hub', 'Arrives at the firewall public IP.')
    if (fwCheck('DNAT')) {
      logs.push('DNAT translates to the private IP in the spoke.')
      hop(dst)
      nsgAt(dst, 'inbound')
    }
  }
  // Spoke to Internet
  else if (dst === 'net') {
    if (nsgAt(src, 'outbound')) {
      if (o.udr) {
        hop('hub', 'UDR 0.0.0.0/0 sends it to the firewall.')
        if (fwCheck('outbound application / network')) hop('net', 'SNAT to the firewall public IP.')
      } else {
        hop('net', 'No UDR: leaves via the NAT Gateway static public IP (better than default outbound access).')
      }
    }
  }

  const ok = !blocked
  if (ok) logs.push('✔ Delivered.')
  return { path, blocked, ok, logs, fix }
}

function pointAt(pts, t) {
  const lens = []
  let total = 0
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    lens.push(l)
    total += l
  }
  let d = t * total
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const k = lens[i] === 0 ? 0 : d / lens[i]
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]
    }
    d -= lens[i]
  }
  return pts[pts.length - 1]
}

export default function PacketLab() {
  const [src, setSrc] = useState('A')
  const [dst, setDst] = useState('B')
  const [o, setO] = useState({ ...DEFAULTS, udr: false })
  const [result, setResult] = useState(null)
  const [pos, setPos] = useState(null)
  const [finished, setFinished] = useState(false)
  const raf = useRef(0)

  const reset = () => {
    cancelAnimationFrame(raf.current)
    setResult(null)
    setPos(null)
    setFinished(false)
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const send = () => {
    cancelAnimationFrame(raf.current)
    const r = simulate(src, dst, o)
    setResult(r)
    setFinished(false)
    if (r.error) {
      setPos(null)
      return
    }
    const pts = r.path.map((id) => [NODES[id].x, NODES[id].y])
    const start = performance.now()
    const dur = 650 * Math.max(1, pts.length - 1) + 300
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1)
      setPos(pointAt(pts, t))
      if (t < 1) raf.current = requestAnimationFrame(tick)
      else setFinished(true)
    }
    raf.current = requestAnimationFrame(tick)
  }

  const preset = (p) => {
    reset()
    setSrc(p.src)
    setDst(p.dst)
    setO({ ...DEFAULTS, ...p.o })
  }

  const toggle = (key) => {
    reset()
    setO((s) => ({ ...s, [key]: !s[key] }))
  }

  const blocked = finished && result && !result.error ? result.blocked : null
  const delivered = finished && result?.ok ? dst : null

  return (
    <div className="lab">
      <div className="lab__presets">
        {PRESETS.map((p) => (
          <button key={p.label} className="chip-btn" onClick={() => preset(p)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="lab__controls">
        <label>
          From
          <select value={src} onChange={(e) => { reset(); setSrc(e.target.value) }}>
            {Object.keys(NODES).filter((k) => k !== 'hub').map((k) => (
              <option key={k} value={k}>{nm(k)}</option>
            ))}
          </select>
        </label>
        <label>
          To
          <select value={dst} onChange={(e) => { reset(); setDst(e.target.value) }}>
            {Object.keys(NODES).filter((k) => k !== 'hub').map((k) => (
              <option key={k} value={k}>{nm(k)}</option>
            ))}
          </select>
        </label>
        <div className="lab__toggles">
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`toggle${o[opt.key] ? ' toggle--on' : ''}`}
              onClick={() => toggle(opt.key)}
              title={opt.hint}
              aria-pressed={o[opt.key]}
            >
              <span className="toggle__dot" /> {opt.label}
            </button>
          ))}
        </div>
        <button className="btn btn--primary" onClick={send}>Send packet ▶</button>
      </div>

      <div className="lab__stage">
        <svg viewBox="0 0 800 420" role="img" aria-label="Hub and spoke network diagram">
          {LINKS.map(([a, b]) => (
            <line key={a + b} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} className="lab__link" />
          ))}
          {Object.entries(NODES).map(([id, n]) => {
            const h = n.kind === 'hub' ? 56 : 44
            const cls = ['lab__node', `lab__node--${n.kind}`]
            if (blocked === id) cls.push('lab__node--bad')
            if (delivered === id) cls.push('lab__node--good')
            return (
              <g key={id} className={cls.join(' ')}>
                <rect x={n.x - n.w / 2} y={n.y - h / 2} width={n.w} height={h} rx="10" />
                <text x={n.x} y={n.y + 4} textAnchor="middle">{n.label}</text>
                {blocked === id && <text x={n.x + n.w / 2 - 6} y={n.y - h / 2 - 6} className="lab__mark" textAnchor="middle">✖</text>}
                {delivered === id && <text x={n.x + n.w / 2 - 6} y={n.y - h / 2 - 6} className="lab__mark lab__mark--ok" textAnchor="middle">✔</text>}
              </g>
            )
          })}
          {pos && !finished && <circle cx={pos[0]} cy={pos[1]} r="8" className="lab__packet" />}
        </svg>
      </div>

      <div className="lab__log" aria-live="polite">
        {!result && <p className="muted">Pick a scenario above (or set your own) and press <strong>Send packet</strong>.</p>}
        {result?.error && <p className="lab__bad">{result.error}</p>}
        {result && !result.error && (
          <>
            <ol>
              {result.logs.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ol>
            {result.fix && <p className="lab__fix"><strong>Fix:</strong> {result.fix}</p>}
          </>
        )}
      </div>
    </div>
  )
}
