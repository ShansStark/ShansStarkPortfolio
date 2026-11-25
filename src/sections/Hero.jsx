import { Suspense, lazy, useState } from 'react'
import { profile, typedLines, networkNodes } from '../data/content'
import Typewriter from '../components/Typewriter'

const NetworkScene = lazy(() => import('../components/NetworkScene'))

export default function Hero() {
  const [selected, setSelected] = useState(null)
  const info = selected ? networkNodes[selected] : null

  return (
    <section id="top" className="hero">
      <div className="hero__scene">
        <Suspense fallback={<div className="hero__loading">Powering up the network…</div>}>
          <NetworkScene selected={selected} onSelect={setSelected} />
        </Suspense>
      </div>
      <div className="hero__overlay" />
      <div className="container hero__content">
        <p className="status">
          <i /> Systems online · {profile.years} yrs Azure networking
        </p>
        <h1 className="glitch" data-text={profile.name}>
          {profile.name}
        </h1>
        <p className="hero__role">{profile.title}</p>
        <p className="hero__tagline">{profile.tagline}</p>
        <p className="hero__typed">
          <span className="prompt">&gt;</span> <Typewriter lines={typedLines} />
        </p>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#labs">Try the labs</a>
          <a className="btn" href="#contact">Hire me</a>
        </div>
      </div>

      <aside className={`hud${info ? ' hud--on' : ''}`} aria-live="polite">
        <div className="hud__tag">SCANNER</div>
        {info ? (
          <>
            <h3>{info.label}</h3>
            <p>{info.blurb}</p>
          </>
        ) : (
          <p>Click any node in the network to scan it. Drag to rotate.</p>
        )}
      </aside>
    </section>
  )
}
