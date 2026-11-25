import { useState } from 'react'
import Reveal from '../components/Reveal'
import PacketLab from '../components/PacketLab'
import DnsLab from '../components/DnsLab'

export default function Labs() {
  const [tab, setTab] = useState('packet')
  return (
    <section id="labs" className="section">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Labs</p>
          <h2>Break it. Then fix it.</h2>
          <p className="muted">
            Two small simulators of problems I troubleshoot often. They are simplified models, built to show how I think about a path or a name lookup.
          </p>
        </Reveal>

        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'packet'} className={`tabs__btn${tab === 'packet' ? ' tabs__btn--on' : ''}`} onClick={() => setTab('packet')}>
            📦 Packet Lab · routing
          </button>
          <button role="tab" aria-selected={tab === 'dns'} className={`tabs__btn${tab === 'dns' ? ' tabs__btn--on' : ''}`} onClick={() => setTab('dns')}>
            🔎 DNS Lab · Private Link
          </button>
        </div>

        <div className="panel">{tab === 'packet' ? <PacketLab /> : <DnsLab />}</div>
      </div>
    </section>
  )
}
