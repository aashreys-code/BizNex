import { useEffect, useRef, useCallback } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  type: 'business' | 'market' | 'ai' | 'scheme'
  alpha: number
  targetAlpha: number
  pulse: number
  label: string
}

interface Connection {
  from: number
  to: number
  alpha: number
  flow: number
}

interface Particle {
  x: number
  y: number
  progress: number
  speed: number
  connIdx: number
  alpha: number
}

const NODE_TYPES = {
  business: { color: '#21F1A8', label: 'Business' },
  market: { color: '#3b82f6', label: 'Market' },
  ai: { color: '#a78bfa', label: 'AI' },
  scheme: { color: '#f59e0b', label: 'Scheme' },
} as const

const LABELS = {
  business: ['Kirana Store', 'Tailoring Shop', 'Dairy Farm', 'Food Stall', 'Hardware Store', 'Rice Mill'],
  market: ['Demand: High', 'Competition', 'Revenue Est.', 'Growth ↑', 'Season Data'],
  ai: ['Analysis', 'Insights', 'Scoring', 'Predict'],
  scheme: ['PMEGP', 'MUDRA', 'Stand-Up', 'CGTMSE', 'SVANidhi'],
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const nodesRef = useRef<Node[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const particlesRef = useRef<Particle[]>([])
  const frameRef = useRef(0)
  const timeRef = useRef(0)

  const initNodes = useCallback((w: number, h: number) => {
    const cx = w / 2
    const cy = h / 2
    const r = Math.min(w, h) * 0.32

    const nodes: Node[] = []

    // Central AI node
    nodes.push({
      x: cx, y: cy,
      vx: 0, vy: 0,
      radius: 6, type: 'ai', alpha: 0, targetAlpha: 0.9,
      pulse: 0, label: '',
    })

    // Inner ring: market signals
    const marketCount = 5
    for (let i = 0; i < marketCount; i++) {
      const angle = (Math.PI * 2 / marketCount) * i - Math.PI / 2
      const dist = r * 0.5
      nodes.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: 0, vy: 0,
        radius: 3.5, type: 'market', alpha: 0, targetAlpha: 0.7,
        pulse: Math.random() * Math.PI * 2,
        label: '',
      })
    }

    // Outer ring: business nodes
    const bizCount = 6
    for (let i = 0; i < bizCount; i++) {
      const angle = (Math.PI * 2 / bizCount) * i - Math.PI / 4
      nodes.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 4.5, type: 'business', alpha: 0, targetAlpha: 0.85,
        pulse: Math.random() * Math.PI * 2,
        label: '',
      })
    }

    // Outer ring: scheme nodes
    const schemeCount = 5
    for (let i = 0; i < schemeCount; i++) {
      const angle = (Math.PI * 2 / schemeCount) * i + Math.PI / 6
      const dist = r * 1.25
      nodes.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        radius: 3, type: 'scheme', alpha: 0, targetAlpha: 0.6,
        pulse: Math.random() * Math.PI * 2,
        label: '',
      })
    }

    // Assign labels
    const bizIdx = nodes.filter(n => n.type === 'business').length
    const mktIdx = nodes.filter(n => n.type === 'market').length
    const schIdx = nodes.filter(n => n.type === 'scheme').length
    let bi = 0, mi = 0, si = 0
    nodes.forEach(n => {
      if (n.type === 'business') { n.label = LABELS.business[bi++ % LABELS.business.length] }
      else if (n.type === 'market') { n.label = LABELS.market[mi++ % LABELS.market.length] }
      else if (n.type === 'scheme') { n.label = LABELS.scheme[si++ % LABELS.scheme.length] }
    })

    nodesRef.current = nodes

    // Create connections
    const connections: Connection[] = []
    const businessStart = 1 + marketCount
    const schemeStart = businessStart + bizCount

    // Business → Market
    for (let i = 0; i < bizCount; i++) {
      const bIdx = businessStart + i
      const mIdx = 1 + (i % marketCount)
      connections.push({ from: bIdx, to: mIdx, alpha: 0, flow: 0 })
      connections.push({ from: bIdx, to: 1 + ((i + 1) % marketCount), alpha: 0, flow: Math.random() })
    }

    // Market → AI
    for (let i = 0; i < marketCount; i++) {
      connections.push({ from: 1 + i, to: 0, alpha: 0, flow: Math.random() })
    }

    // AI → Scheme
    for (let i = 0; i < schemeCount; i++) {
      connections.push({ from: 0, to: schemeStart + i, alpha: 0, flow: Math.random() })
    }

    connectionsRef.current = connections

    // Initialize particles on some connections
    const particles: Particle[] = []
    connections.forEach((conn, idx) => {
      if (Math.random() > 0.4) {
        particles.push({
          x: 0, y: 0,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          connIdx: idx,
          alpha: 0,
        })
      }
    })
    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = prefersReducedMotion()
    let dpr = window.devicePixelRatio || 1

    const resize = () => {
      dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initNodes(rect.width, rect.height)
    }

    resize()

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    canvas.addEventListener('mousemove', handleMouse)
    window.addEventListener('resize', resize)

    let animId: number
    const startTime = performance.now()

    const animate = () => {
      const now = performance.now()
      timeRef.current = (now - startTime) / 1000
      const t = timeRef.current

      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)

      const nodes = nodesRef.current
      const connections = connectionsRef.current
      const particles = particlesRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Fade in nodes
      nodes.forEach(n => {
        n.alpha += (n.targetAlpha - n.alpha) * 0.03
      })

      // Gentle ambient drift for business/scheme nodes
      if (!reduced) {
        nodes.forEach(n => {
          if (n.type === 'business' || n.type === 'scheme') {
            n.x += n.vx
            n.y += n.vy
            if (Math.abs(n.x - w / 2) > w * 0.4) n.vx *= -1
            if (Math.abs(n.y - h / 2) > h * 0.4) n.vy *= -1
          }
          n.pulse += 0.015
        })
      } else {
        nodes.forEach(n => { n.pulse += 0.005 })
      }

      // Draw connections
      connections.forEach((conn, ci) => {
        const from = nodes[conn.from]
        const to = nodes[conn.to]
        if (!from || !to) return

        conn.alpha += (Math.min(from.alpha, to.alpha) * 0.5 - conn.alpha) * 0.05

        const dx = to.x - from.x
        const dy = to.y - from.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Mouse proximity effect
        const midX = (from.x + to.x) / 2
        const midY = (from.y + to.y) / 2
        const mouseDist = Math.sqrt((mx - midX) ** 2 + (my - midY) ** 2)
        const mouseBoost = Math.max(0, 1 - mouseDist / 150) * 0.3

        const alpha = Math.min(1, (conn.alpha + mouseBoost) * 0.6)

        // Draw line
        const fromColor = NODE_TYPES[from.type].color
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = fromColor
        ctx.globalAlpha = alpha * 0.15
        ctx.lineWidth = 1
        ctx.stroke()

        // Flow animation on connection
        if (!reduced) {
          conn.flow += 0.002
          if (conn.flow > 1) conn.flow = 0

          const fx = from.x + dx * conn.flow
          const fy = from.y + dy * conn.flow
          ctx.beginPath()
          ctx.arc(fx, fy, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = fromColor
          ctx.globalAlpha = alpha * 0.4
          ctx.fill()
        }
      })

      // Draw particles
      if (!reduced) {
        particles.forEach(p => {
          const conn = connections[p.connIdx]
          if (!conn) return
          const from = nodes[conn.from]
          const to = nodes[conn.to]
          if (!from || !to) return

          p.progress += p.speed
          if (p.progress > 1) p.progress = 0

          p.x = from.x + (to.x - from.x) * p.progress
          p.y = from.y + (to.y - from.y) * p.progress

          p.alpha = Math.sin(p.progress * Math.PI) * Math.min(from.alpha, to.alpha)

          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2)
          ctx.fillStyle = NODE_TYPES[from.type].color
          ctx.globalAlpha = p.alpha * 0.6
          ctx.fill()
        })
      }

      // Draw nodes
      nodes.forEach(n => {
        const color = NODE_TYPES[n.type].color
        const pulseR = reduced ? 0 : Math.sin(n.pulse) * 1.5

        // Outer glow ring
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius + 8 + pulseR, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = n.alpha * 0.06
        ctx.fill()

        // Inner glow
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius + 3 + pulseR * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = n.alpha * 0.12
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = n.alpha * 0.9
        ctx.fill()

        // Center bright spot
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.globalAlpha = n.alpha * 0.3
        ctx.fill()
      })

      // Draw labels for business nodes
      ctx.globalAlpha = 1
      ctx.font = '500 9px Manrope, system-ui, sans-serif'
      ctx.textAlign = 'center'
      nodes.forEach(n => {
        if ((n.type === 'business' || n.type === 'scheme') && n.alpha > 0.3) {
          const color = NODE_TYPES[n.type].color
          ctx.fillStyle = color
          ctx.globalAlpha = n.alpha * 0.55
          ctx.fillText(n.label, n.x, n.y + n.radius + 14)
        }
      })

      // Reset alpha
      ctx.globalAlpha = 1

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
      canvas.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('resize', resize)
    }
  }, [initNodes])

  return (
    <div className="relative w-full h-full" style={{ minHeight: 340 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      {/* Subtle gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, var(--bg-primary) 75%)',
        }}
      />
    </div>
  )
}
