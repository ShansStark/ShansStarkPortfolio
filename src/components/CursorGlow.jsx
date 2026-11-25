import { useEffect, useRef, useState } from 'react'

// Warm glow that follows the mouse, plus a small spark burst on every click.
export default function CursorGlow() {
  const glow = useRef(null)
  const [sparks, setSparks] = useState([])
  const id = useRef(0)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const move = (e) => {
      if (glow.current) glow.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }
    const click = (e) => {
      const burst = Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.5
        const dist = 30 + Math.random() * 40
        return {
          key: id.current++,
          x: e.clientX,
          y: e.clientY,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
        }
      })
      setSparks((s) => [...s, ...burst])
      setTimeout(() => setSparks((s) => s.filter((p) => !burst.includes(p))), 650)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('click', click)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('click', click)
    }
  }, [])

  return (
    <>
      <div ref={glow} className="cursor-glow" aria-hidden="true" />
      {sparks.map((p) => (
        <span
          key={p.key}
          className="spark"
          aria-hidden="true"
          style={{ left: p.x, top: p.y, '--dx': `${p.dx}px`, '--dy': `${p.dy}px` }}
        />
      ))}
    </>
  )
}
