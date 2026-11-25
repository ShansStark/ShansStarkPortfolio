import { useEffect, useRef, useState } from 'react'
import { profile, arsenal, experience } from '../data/content'

const HELP = [
  'Commands:',
  '  help                              this list',
  '  whoami                            who is Shans',
  '  skills                            what I work on',
  '  experience                        where I have worked',
  '  contact                           email, LinkedIn, GitHub',
  '  az network vnet peering list      try an Azure command',
  '  az network route-table route list',
  '  nslookup <name>                   try a DNS lookup',
  '  clear                             clear the screen',
]

function run(raw) {
  const cmd = raw.trim()
  const lower = cmd.toLowerCase()
  if (!cmd) return []
  if (lower === 'help') return HELP
  if (lower === 'whoami')
    return [`${profile.name} — ${profile.title}`, `${profile.years} years in Azure networking`, profile.location]
  if (lower === 'skills') return arsenal.map((a) => `• ${a.title}`)
  if (lower === 'experience')
    return [`${experience.role}, ${experience.company} (${experience.period})`, experience.engagement]
  if (lower === 'contact')
    return [`email     ${profile.email}`, `linkedin  ${profile.linkedin}`, `github    ${profile.github}`]
  if (lower.startsWith('az network vnet peering list'))
    return [
      'Name            PeeringState  AllowForwardedTraffic  UseRemoteGateways',
      'hub-to-spokeA   Connected     True                   False',
      'hub-to-spokeB   Connected     True                   False',
      'spokeA-to-hub   Connected     True                   True',
      '(sample output)',
    ]
  if (lower.startsWith('az network route-table route list'))
    return [
      'Name            AddressPrefix   NextHopType        NextHopIpAddress',
      'to-spokeB       10.20.0.0/16    VirtualAppliance   10.0.1.4',
      'default-via-fw  0.0.0.0/0       VirtualAppliance   10.0.1.4',
      '(sample output — spoke to spoke goes through the firewall)',
    ]
  if (lower.startsWith('nslookup')) {
    const name = cmd.split(/\s+/)[1] || 'mystorage.blob.core.windows.net'
    return [
      `Name:    ${name}`,
      'Address: 10.0.4.5',
      '(sample — with the privatelink zone linked and DNS proxy on, you get the private IP)',
    ]
  }
  if (lower.startsWith('sudo')) return ['Nice try. Access level: visitor.']
  if (lower === 'ls') return ['about/  arsenal/  labs/  experience/  projects/  contact/']
  if (lower === 'ping') return ['Reply from hub: time<1ms. (Your packet was allowed by the firewall.)']
  return [`${cmd.split(' ')[0]}: command not found. Type 'help'.`]
}

export default function Terminal() {
  const [lines, setLines] = useState([{ t: 'out', v: "Welcome. Type 'help' to start." }])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [hi, setHi] = useState(-1)
  const box = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight
  }, [lines])

  const submit = (e) => {
    e.preventDefault()
    const cmd = input
    if (cmd.trim().toLowerCase() === 'clear') {
      setLines([])
    } else {
      setLines((l) => [...l, { t: 'in', v: cmd }, ...run(cmd).map((v) => ({ t: 'out', v }))])
    }
    if (cmd.trim()) setHistory((h) => [cmd, ...h])
    setHi(-1)
    setInput('')
  }

  const onKey = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(hi + 1, history.length - 1)
      if (history[next] !== undefined) {
        setHi(next)
        setInput(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = hi - 1
      setHi(next)
      setInput(next >= 0 ? history[next] : '')
    }
  }

  return (
    <div className="term" onClick={() => inputRef.current?.focus()}>
      <div className="term__bar">
        <i /> <i /> <i /> <span>shans@azure-hub:~</span>
      </div>
      <div className="term__body" ref={box}>
        {lines.map((l, i) => (
          <div key={i} className={l.t === 'in' ? 'term__in' : 'term__out'}>
            {l.t === 'in' ? <span className="term__prompt">$ </span> : null}
            {l.v}
          </div>
        ))}
        <form onSubmit={submit} className="term__form">
          <span className="term__prompt">$ </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Terminal input"
          />
        </form>
      </div>
    </div>
  )
}
