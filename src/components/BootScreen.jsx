import { useEffect, useState } from 'react'

const LINES = [
  'S.H.A.N.S. // Secure Hybrid Azure Network Systems',
  'loading hub vnet ........ ok',
  'peering spokes .......... ok',
  'syncing routes (BGP) .... ok',
  'resolving private dns ... ok',
  'all systems online',
]

export default function BootScreen() {
  const [shown, setShown] = useState(0)
  const [done, setDone] = useState(() => {
    try {
      return (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        sessionStorage.getItem('booted') === '1'
      )
    } catch {
      return false
    }
  })
  const [leaving, setLeaving] = useState(false)

  const finish = () => {
    setLeaving(true)
    try {
      sessionStorage.setItem('booted', '1')
    } catch {
      /* ignore */
    }
    setTimeout(() => setDone(true), 450)
  }

  useEffect(() => {
    if (done) return
    if (shown >= LINES.length) {
      const t = setTimeout(finish, 450)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setShown((s) => s + 1), 330)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, done])

  if (done) return null

  return (
    <div className={`boot${leaving ? ' boot--out' : ''}`} onClick={finish} role="presentation">
      <div className="boot__reactor" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <pre className="boot__log">
        {LINES.slice(0, shown).map((l, i) => (
          <div key={i} className={i === LINES.length - 1 ? 'boot__last' : ''}>
            {'> '}
            {l}
          </div>
        ))}
      </pre>
      <div className="boot__skip">click to skip</div>
    </div>
  )
}
