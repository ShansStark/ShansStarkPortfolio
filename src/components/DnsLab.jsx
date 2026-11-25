import { useMemo, useState } from 'react'

const NAME = 'mystorage.blob.core.windows.net'
const PRIVATE_IP = '10.0.4.5'
const PUBLIC_IP = '20.209.10.6'

function resolve({ client, pe, zone, proxy, fwd }) {
  const steps = []
  let kind = 'public'
  let fix = null
  const who = client === 'spoke' ? 'VM in Spoke A' : 'On-prem server'
  steps.push(`${who} asks for ${NAME}.`)

  if (!pe) {
    steps.push('No Private Endpoint exists for this storage account.')
    steps.push('Public DNS answers with the service public IP.')
    return { steps, kind, fix: 'Create a Private Endpoint and a privatelink.blob.core.windows.net private DNS zone.' }
  }

  steps.push(`Public DNS would return a CNAME to mystorage.privatelink.blob.core.windows.net. Whether you get the private IP depends on who answers that name.`)

  if (client === 'spoke') {
    if (proxy) {
      steps.push('The spoke VNet DNS points at the Azure Firewall (10.0.1.4). DNS proxy forwards the query to Azure DNS (168.63.129.16) from the hub VNet.')
      if (zone !== 'none') {
        steps.push('The hub VNet is linked to the privatelink zone, so Azure DNS answers with the private A record.')
        kind = 'private'
      } else {
        steps.push('The privatelink zone is not linked to the hub VNet, where the query leaves from. The zone is ignored.')
        fix = 'Link the privatelink zone to the hub VNet.'
      }
    } else {
      steps.push('The spoke uses Azure-provided DNS (168.63.129.16) from the spoke VNet itself.')
      if (zone === 'both') {
        steps.push('The privatelink zone is linked to the spoke VNet, so the private A record is returned.')
        kind = 'private'
      } else {
        steps.push('The privatelink zone is not linked to the spoke VNet, so the private zone is ignored.')
        fix = 'Link the zone to the spoke VNet, or point spoke DNS at the firewall DNS proxy and link the zone to the hub.'
      }
    }
  } else {
    if (!fwd) {
      steps.push('On-prem DNS has no conditional forwarder for blob.core.windows.net, so it asks public DNS.')
      fix = 'Add a conditional forwarder for blob.core.windows.net to a DNS entry point in Azure (firewall DNS proxy or a DNS private resolver inbound endpoint).'
    } else {
      steps.push(`On-prem DNS forwards over the VPN to ${proxy ? 'the Azure Firewall DNS proxy (10.0.1.4)' : 'a DNS forwarder in the hub'}.`)
      if (zone !== 'none') {
        steps.push('Hub VNet is linked to the privatelink zone, so the private A record comes back.')
        kind = 'private'
      } else {
        steps.push('The privatelink zone is not linked to the hub VNet, so the answer is the public IP.')
        fix = 'Link the privatelink zone to the hub VNet.'
      }
    }
  }

  steps.push(kind === 'private' ? `Answer: ${PRIVATE_IP} (private).` : `Answer: ${PUBLIC_IP} (public).`)
  return { steps, kind, fix }
}

function Seg({ value, options, onChange }) {
  return (
    <div className="seg" role="group">
      {options.map(([v, label]) => (
        <button key={v} className={`seg__btn${value === v ? ' seg__btn--on' : ''}`} onClick={() => onChange(v)} aria-pressed={value === v}>
          {label}
        </button>
      ))}
    </div>
  )
}

export default function DnsLab() {
  const [s, setS] = useState({ client: 'spoke', pe: true, zone: 'hub', proxy: false, fwd: false })
  const set = (k) => (v) => setS((p) => ({ ...p, [k]: v }))
  const r = useMemo(() => resolve(s), [s])

  return (
    <div className="lab">
      <p className="muted lab__intro">
        Resolving <code>{NAME}</code>. Change the setup and watch which answer you get. The default is a classic: the zone exists but the VM still gets the public IP.
      </p>

      <div className="dns__grid">
        <div className="dns__ctl">
          <h4>Who is asking?</h4>
          <Seg value={s.client} onChange={set('client')} options={[['spoke', 'VM in a spoke'], ['onprem', 'On-prem server']]} />

          <h4>Private Endpoint</h4>
          <Seg value={s.pe} onChange={set('pe')} options={[[true, 'Created'], [false, 'Not created']]} />

          <h4>privatelink zone linked to</h4>
          <Seg value={s.zone} onChange={set('zone')} options={[['none', 'Nothing'], ['hub', 'Hub VNet'], ['both', 'Hub + spoke']]} />

          <h4>Firewall DNS proxy</h4>
          <Seg value={s.proxy} onChange={set('proxy')} options={[[true, 'On'], [false, 'Off']]} />

          <h4>On-prem conditional forwarder</h4>
          <Seg value={s.fwd} onChange={set('fwd')} options={[[true, 'Configured'], [false, 'Missing']]} />
        </div>

        <div className="dns__out">
          <ol className="dns__steps" key={JSON.stringify(s)}>
            {r.steps.map((t, i) => (
              <li key={i} style={{ animationDelay: `${i * 90}ms` }}>{t}</li>
            ))}
          </ol>
          <div className={`dns__result dns__result--${r.kind}`}>
            <span>{r.kind === 'private' ? '🔒 Private IP' : '🌍 Public IP'}</span>
            <strong>{r.kind === 'private' ? PRIVATE_IP : PUBLIC_IP}</strong>
          </div>
          {r.fix && <p className="lab__fix"><strong>Fix:</strong> {r.fix}</p>}
          <p className="muted dns__note">Example addresses for illustration.</p>
        </div>
      </div>
    </div>
  )
}
