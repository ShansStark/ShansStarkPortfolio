import { useEffect, useState } from 'react'

export default function Typewriter({ lines, speed = 38, hold = 1500 }) {
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  const [erasing, setErasing] = useState(false)

  useEffect(() => {
    const line = lines[i]
    let t
    if (!erasing && n < line.length) t = setTimeout(() => setN(n + 1), speed)
    else if (!erasing) t = setTimeout(() => setErasing(true), hold)
    else if (n > 0) t = setTimeout(() => setN(n - 1), speed / 2)
    else {
      setErasing(false)
      setI((i + 1) % lines.length)
    }
    return () => clearTimeout(t)
  }, [n, erasing, i, lines, speed, hold])

  return (
    <span className="typed">
      {lines[i].slice(0, n)}
      <span className="typed__caret">▌</span>
    </span>
  )
}
