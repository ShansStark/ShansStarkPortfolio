import { skillGroups, certifications } from '../data/content'
import Reveal from '../components/Reveal'

export default function Expertise() {
  return (
    <section id="expertise" className="section section--alt">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Expertise</p>
          <h2>Azure networking, end to end</h2>
        </Reveal>
        <div className="skills">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} delay={(i % 3) * 80} className="skill-card">
              <h3>{g.title}</h3>
              <ul className="chips">
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

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
