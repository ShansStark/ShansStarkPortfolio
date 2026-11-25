import { experience } from '../data/content'
import Reveal from '../components/Reveal'

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Experience</p>
          <h2>{experience.role}, {experience.company}</h2>
          <p className="muted">
            {experience.period}
            <br />
            {experience.engagement}
          </p>
        </Reveal>
        <ul className="timeline">
          {experience.bullets.map((b, i) => (
            <Reveal key={b} delay={i * 60}>
              <li>{b}</li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
