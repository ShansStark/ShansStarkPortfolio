import { useEffect, useState } from 'react'
import { profile } from '../data/content'

const links = [
  ['about', 'About'],
  ['arsenal', 'Arsenal'],
  ['labs', 'Labs'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['contact', 'Contact'],
]

const SUITS = [
  ['hotrod', 'Hot Rod'],
  ['gold', 'Gold Rush'],
  ['stealth', 'Stealth'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [suit, setSuit] = useState(() => {
    try {
      return localStorage.getItem('suit') || 'hotrod'
    } catch {
      return 'hotrod'
    }
  })

  useEffect(() => {
    document.documentElement.dataset.theme = suit
    try {
      localStorage.setItem('suit', suit)
    } catch {
      /* ignore */
    }
  }, [suit])

  const cycle = () => {
    const i = SUITS.findIndex(([k]) => k === suit)
    setSuit(SUITS[(i + 1) % SUITS.length][0])
  }
  const suitName = SUITS.find(([k]) => k === suit)?.[1]

  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#top" className="nav__brand">
          <span className="nav__logo" aria-hidden="true" />
          {profile.name}
        </a>
        <nav className={`nav__links${open ? ' nav__links--open' : ''}`}>
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <button className="suit" onClick={cycle} title="Switch colour scheme">
            Suit: {suitName}
          </button>
        </nav>
        <button className="nav__toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
