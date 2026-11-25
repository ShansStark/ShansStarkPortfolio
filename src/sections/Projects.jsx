import { projects, caseStudies, services } from '../data/content'
import Reveal from '../components/Reveal'

export default function Projects() {
  return (
    <section id="projects" className="section section--alt">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Projects</p>
          <h2>Open-source tooling and playbooks</h2>
        </Reveal>
        <div className="cards">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <a className="card" href={p.url} target="_blank" rel="noreferrer">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <ul className="chips">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <span className="card__link">View on GitHub →</span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h3 className="subhead">Case studies</h3>
          <p className="muted">Realistic troubleshooting scenarios using fictional environments.</p>
        </Reveal>
        <div className="cards">
          {caseStudies.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="card card--static">
                <h3>{c.title}</h3>
                <p>{c.summary}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h3 className="subhead">Services</h3>
        </Reveal>
        <div className="cards">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="card card--static">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
