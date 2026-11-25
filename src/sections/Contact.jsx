import { profile } from '../data/content'
import Reveal from '../components/Reveal'
import Terminal from '../components/Terminal'

export default function Contact() {
  return (
    <section id="contact" className="section section--alt">
      <div className="container contact">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2>Got a network that won’t behave?</h2>
          <p className="muted">
            Architecture review, routing, VPN, firewall or DNS troubleshooting. Available for international clients.
          </p>
          <div className="hero__cta">
            <a className="btn btn--primary" href={`mailto:${profile.email}`}>{profile.email}</a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </Reveal>

        <Reveal>
          <h3 className="subhead">Or poke around in the terminal</h3>
          <Terminal />
        </Reveal>
      </div>
      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </div>
      </footer>
    </section>
  )
}
