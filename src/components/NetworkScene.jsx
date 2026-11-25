import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Line, OrbitControls, Float } from '@react-three/drei'
import * as THREE from 'three'
import { networkNodes } from '../data/content'

// ---- Scene definition: edit these to change the network ---------------------
const GOLD = '#ffb703'
const HUB = { id: 'hub', color: GOLD, pos: [0, 0, 0], size: 0.6 }

const SPOKE_DEFS = [
  { id: 'fw', color: '#ff2d3d' },
  { id: 'vpn', color: '#ff7a1a' },
  { id: 'rs', color: '#ffd166' },
  { id: 'pe', color: '#ff5d8f' },
  { id: 'lb', color: '#ff9f1c' },
  { id: 'nat', color: '#ff4d2e' },
  { id: 'bas', color: '#ffcf56' },
  { id: 'dns', color: '#ff6b6b' },
]

const OUTER_DEFS = [
  { id: 'onprem', color: '#ffe8cc', via: 'vpn' },
  { id: 'net', color: '#ffe8cc', via: 'nat' },
]

const RING = 3.1

function buildGraph() {
  const nodes = [HUB]
  const byId = { hub: HUB }

  SPOKE_DEFS.forEach((s, i) => {
    const a = (i / SPOKE_DEFS.length) * Math.PI * 2
    const node = { ...s, size: 0.28, pos: [Math.cos(a) * RING, Math.sin(i * 1.7) * 0.45, Math.sin(a) * RING] }
    nodes.push(node)
    byId[s.id] = node
  })

  OUTER_DEFS.forEach((o) => {
    const via = byId[o.via]
    const node = { ...o, size: 0.22, pos: [via.pos[0] * 1.75, via.pos[1] + 0.3, via.pos[2] * 1.75] }
    nodes.push(node)
    byId[o.id] = node
  })

  const links = [...SPOKE_DEFS.map((s) => ['hub', s.id]), ...OUTER_DEFS.map((o) => [o.via, o.id])]
  return { nodes, byId, links }
}

// ---- Pieces -----------------------------------------------------------------
function Packet({ a, b, speed, offset, color }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = (clock.elapsedTime * speed + offset) % 1
    ref.current.position.lerpVectors(a, b, t)
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.055, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// Glowing reactor-style core for the hub: spinning rings around a hot centre.
function ReactorCore({ active }) {
  const r1 = useRef()
  const r2 = useRef()
  const r3 = useRef()
  const core = useRef()
  useFrame(({ clock }, dt) => {
    if (r1.current) r1.current.rotation.z += dt * 0.9
    if (r2.current) r2.current.rotation.x += dt * 0.7
    if (r3.current) r3.current.rotation.y -= dt * 0.5
    if (core.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 3) * 0.08 + (active ? 0.15 : 0)
      core.current.scale.setScalar(s)
    }
  })
  return (
    <group>
      <mesh ref={core}>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshBasicMaterial color="#fff4d6" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshBasicMaterial color="#ffb703" transparent opacity={0.35} />
      </mesh>
      <mesh ref={r1}>
        <torusGeometry args={[0.62, 0.025, 12, 64]} />
        <meshBasicMaterial color="#ff2d3d" />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[0.78, 0.02, 12, 64]} />
        <meshBasicMaterial color="#ffb703" />
      </mesh>
      <mesh ref={r3}>
        <torusGeometry args={[0.94, 0.015, 12, 64]} />
        <meshBasicMaterial color="#ff7a1a" />
      </mesh>
    </group>
  )
}

function Node({ node, selected, onSelect }) {
  const [hover, setHover] = useState(false)
  const mesh = useRef()
  const isHub = node.id === 'hub'
  const label = networkNodes[node.id]?.label ?? node.id
  const on = hover || selected

  useFrame((_, dt) => {
    if (!mesh.current) return
    mesh.current.rotation.y += dt * (isHub ? 0.4 : 0.8)
    const target = on ? 1.3 : 1
    mesh.current.scale.x += (target - mesh.current.scale.x) * 0.15
    mesh.current.scale.y = mesh.current.scale.z = mesh.current.scale.x
  })

  return (
    <Float speed={isHub ? 0.8 : 1.6} floatIntensity={isHub ? 0.15 : 0.35} rotationIntensity={0}>
      <group position={node.pos}>
        <mesh
          ref={mesh}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(node.id)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHover(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHover(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {isHub ? <icosahedronGeometry args={[node.size + 0.55, 1]} /> : <octahedronGeometry args={[node.size, 0]} />}
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={on ? 1.4 : 0.6}
            metalness={0.5}
            roughness={0.25}
            wireframe={isHub}
            transparent={isHub}
            opacity={isHub ? 0.55 : 1}
          />
        </mesh>
        {isHub && <ReactorCore active={on} />}
        {selected && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[node.size + (isHub ? 1.2 : 0.35), 0.015, 8, 48]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        )}
        <Html center position={[0, node.size + (isHub ? 1.2 : 0.35), 0]} distanceFactor={9} style={{ pointerEvents: 'none' }}>
          <div className={`node-label${on || isHub ? ' node-label--active' : ''}`}>{label}</div>
        </Html>
      </group>
    </Float>
  )
}

function Graph({ selected, onSelect }) {
  const { nodes, byId, links } = useMemo(buildGraph, [])

  const segments = useMemo(
    () =>
      links.map(([from, to], i) => {
        const a = new THREE.Vector3(...byId[from].pos)
        const b = new THREE.Vector3(...byId[to].pos)
        return { key: `${from}-${to}`, from, to, a, b, color: byId[to].color, i }
      }),
    [links, byId]
  )

  return (
    <group>
      {segments.map((s) => {
        const hot = selected && (selected === s.from || selected === s.to)
        return (
          <group key={s.key}>
            <Line points={[s.a, s.b]} color={s.color} lineWidth={hot ? 2.5 : 1} transparent opacity={hot ? 0.9 : 0.35} />
            <Packet a={s.a} b={s.b} speed={0.22 + (s.i % 3) * 0.06} offset={(s.i * 0.37) % 1} color={s.color} />
            <Packet a={s.b} b={s.a} speed={0.18 + (s.i % 4) * 0.04} offset={(s.i * 0.61 + 0.5) % 1} color="#fff4d6" />
          </group>
        )
      })}
      {nodes.map((n) => (
        <Node key={n.id} node={n} selected={selected === n.id} onSelect={onSelect} />
      ))}
    </group>
  )
}

export default function NetworkScene({ selected, onSelect }) {
  const [interactive, setInteractive] = useState(true)

  // On touch devices let the page scroll instead of the canvas capturing drags.
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const update = () => setInteractive(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 3.2, 9.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
      onPointerMissed={() => onSelect(null)}
    >
      <fog attach="fog" args={['#0b0507', 10, 22]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[0, 4, 0]} intensity={30} color="#ffb703" />
      <pointLight position={[6, 2, 6]} intensity={14} color="#ff2d3d" />
      <gridHelper args={[26, 26, '#4a1a12', '#2a0e0c']} position={[0, -1.7, 0]} />
      <Graph selected={selected} onSelect={onSelect} />
      <OrbitControls
        enabled={interactive}
        enableZoom={false}
        enablePan={false}
        autoRotate={!selected}
        autoRotateSpeed={0.7}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  )
}
