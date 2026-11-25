import { arsenal, toolkit, certifications } from '../data/content'
import Reveal from '../components/Reveal'

export default function Arsenal() {
  return (
    <section id="arsenal" className="section section--alt">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Arsenal</p>
          <h2>What I build and fix</h2>
          <p className="muted">Hover a card. These are the areas I work in every week.</p>
        </Reveal>
        <div className="skills">
          {arsenal.map((a, i) => (
            <Reveal key={a.title} delay={(i % 3) * 70}>
              <article className="skill-card">
                <div className="skill-card__icon" aria-hidden="true">{a.icon}</div>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                <ul className="chips">
                  {a.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h3 className="subhead">Also in the toolkit</h3>
          <ul className="chips chips--big">
            {toolkit.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <h3 className="subhead">Certifications</h3>
        </Reveal>
        <div className="certs">
          {certifications.map((c, i) => (
            <Reveal key={c.name} delay={i * 80} className="cert">
              <strong>{c.name}</strong>
              <span>{c.issuer}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
