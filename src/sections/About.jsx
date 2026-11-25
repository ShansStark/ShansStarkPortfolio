import { about, achievements, awards } from '../data/content'
import Reveal from '../components/Reveal'
import Counter from '../components/Counter'

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal>
          <p className="eyebrow">About</p>
          <h2>From escalation to architecture</h2>
        </Reveal>
        <div className="about__grid">
          <Reveal className="about__text">
            {about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
          <div className="stats">
            {achievements.map((a, i) => (
              <Reveal key={a.text} delay={i * 70} className="stat">
                <div className="stat__num">
                  <Counter value={a.value} suffix={a.suffix} />
                </div>
                <div className="stat__label">{a.label}</div>
                <p>{a.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="award">
          <span className="award__icon" aria-hidden="true">★</span>
          <p>{awards[0]}</p>
        </Reveal>
      </div>
    </section>
  )
}
