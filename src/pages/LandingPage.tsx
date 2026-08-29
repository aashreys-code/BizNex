import { Link } from 'react-router-dom'
import { useRef, useState, useEffect, ReactNode } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight, ChevronRight, TrendingUp, FileText, Search, Calculator,
  MessageSquare, MapPin, DollarSign, Globe, Languages, BarChart3,
  Shield, Sparkles, Users, Building2, Zap, Target,
} from 'lucide-react'
import Button from '../components/ui/Button'
import ScrollReveal from '../components/react-bits/ScrollReveal'
import MagneticButton from '../components/react-bits/MagneticButton'
import CountUp from '../components/react-bits/CountUp'
import HeroVisual from '../components/landing/HeroVisual'
import ProductPreview from '../components/landing/ProductPreview'

/* ─── Hook: Intersection Observer ──────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ─── Staggered Reveal Wrapper ────────────────── */
function StaggerReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <div style={{
      opacity: 0,
      transform: 'translateY(16px)',
      animation: `slideUp 0.5s ease-out ${delay}s forwards`,
    }}>
      {children}
    </div>
  )
}

/* ─── Data ────────────────────────────────────── */
const workflows = [
  {
    num: '01',
    title: 'Tell Us About Your Business',
    desc: 'Share your idea, location, budget, and goals. We understand the local context.',
    icon: Building2,
  },
  {
    num: '02',
    title: 'Understand Your Local Market',
    desc: 'Get demand scores, competition analysis, and revenue forecasts for your area.',
    icon: BarChart3,
  },
  {
    num: '03',
    title: 'Receive AI-Powered Recommendations',
    desc: 'Personalized business plans, growth strategies, and smart financial guidance.',
    icon: Sparkles,
  },
  {
    num: '04',
    title: 'Discover Government Support',
    desc: 'Find schemes you qualify for — PMEGP, MUDRA, Stand-Up India and more.',
    icon: Shield,
  },
]

const credibilityItems = [
  { icon: Target, title: 'Data-Driven Methodology', desc: 'Analysis built on regional market data, demographic insights, and real demand indicators.' },
  { icon: Sparkles, title: 'AI-Powered Analysis', desc: 'Intelligent recommendations tailored to your specific business idea and local context.' },
  { icon: Languages, title: 'Multilingual Access', desc: 'Available in English, Hindi, Telugu, Tamil, Kannada, and Marathi for inclusivity.' },
  { icon: MapPin, title: 'Hyper-Local Insights', desc: 'Village and district-level data on population, literacy, demand trends, and opportunities.' },
  { icon: Shield, title: 'Transparent Guidance', desc: 'Clear eligibility criteria and honest recommendations — no hidden agendas.' },
  { icon: Globe, title: 'Government Scheme Discovery', desc: 'Automated matching with PMEGP, MUDRA, Stand-Up India, and 20+ other schemes.' },
]

const features = [
  { icon: TrendingUp, title: 'Market Intelligence', desc: 'Demand scores, competition analysis, and revenue forecasts for your specific location.' },
  { icon: FileText, title: 'Business Plan Builder', desc: 'Generate business plans with cost breakdowns and growth strategies.' },
  { icon: Search, title: 'Scheme Discovery', desc: 'Find PMEGP, MUDRA, Stand-Up India with eligibility scoring.' },
  { icon: Calculator, title: 'Loan Eligibility', desc: 'Calculate eligibility, EMI estimates, and repayment timelines.' },
  { icon: MessageSquare, title: 'AI Business Advisor', desc: 'Chat in English, Hindi, Telugu, Tamil, Kannada, or Marathi.' },
  { icon: MapPin, title: 'Local Market Insights', desc: 'Population data, literacy rates, demand trends, and opportunities.' },
  { icon: DollarSign, title: 'Funding Strategy', desc: 'Personalized funding combining self-funding, loans, and subsidies.' },
  { icon: Zap, title: 'Real-Time Signals', desc: 'Live market signals and opportunity indicators for your area.' },
]

/* ─── Main Component ──────────────────────────── */
export default function LandingPage() {
  const heroStats = useInView(0.2)
  const workflow = useInView(0.1)

  return (
    <div style={{ background: 'var(--bg-primary)' }} className="overflow-hidden">

      {/* ═══════════════════════════════════════════ HERO ═══════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center pt-20 pb-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)`,
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Content */}
            <div className="max-w-xl">
              <ScrollReveal delay={0} distance={24}>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase mb-5"
                  style={{
                    background: 'var(--accent-dim)',
                    color: 'var(--accent-bright)',
                    border: '1px solid rgba(33, 241, 168, 0.12)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-bright)' }} />
                  For Rural Entrepreneurs
                </span>
              </ScrollReveal>

              <ScrollReveal delay={0.1} distance={28}>
                <h1
                  className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.08] mb-5"
                  style={{ color: 'var(--text-primary)', letterSpacing: '-0.035em' }}
                >
                  Business advisory
                  <br />
                  built for{' '}
                  <span style={{ color: 'var(--accent-bright)' }}>rural India</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2} distance={24}>
                <p
                  className="text-base sm:text-lg mb-8 max-w-md leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Market data, government schemes, loan guidance, and multilingual AI —
                  everything a rural entrepreneur needs in one place.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3} distance={20}>
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <MagneticButton>
                    <Link to="/register">
                      <Button size="lg" className="min-w-[180px]">
                        Get started free
                        <ArrowRight size={18} />
                      </Button>
                    </Link>
                  </MagneticButton>
                  <Link to="/login">
                    <Button variant="secondary" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>

              {/* Stats row */}
              <ScrollReveal delay={0.4} distance={16}>
                <div ref={heroStats.ref} className="flex gap-8">
                  {[
                    { value: 63, suffix: 'M+', label: 'MSMEs in India' },
                    { value: 3, suffix: 'L Cr', label: 'Schemes unutilized' },
                    { value: 6, suffix: '', label: 'Languages supported' },
                  ].map((stat, i) => (
                    <div key={i}>
                      <p className="text-xl font-bold" style={{ color: 'var(--accent-bright)' }}>
                        {heroStats.visible ? (
                          <CountUp to={stat.value} duration={1.8} delay={i * 0.15} />
                        ) : '0'}
                        <span className="text-sm font-semibold">{stat.suffix}</span>
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Visual */}
            <ScrollReveal delay={0.2} direction="right" distance={30}>
              <div className="relative w-full h-[380px] sm:h-[420px] lg:h-[480px]">
                <HeroVisual />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ PROBLEM ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-bright)' }}>
                The Problem
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-4"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              >
                Rural India has 63 million MSMEs.
                <br />
                <span style={{ color: 'var(--text-secondary)' }}>Most lack access to business intelligence.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Entrepreneurs make critical decisions without understanding local demand, competition,
                or the government schemes they qualify for.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: 'No Local Market Data',
                desc: 'Entrepreneurs make decisions without understanding local demand and competition.',
                icon: BarChart3,
              },
              {
                title: 'Scheme Awareness Gap',
                desc: '₹3 lakh crore in government schemes go unutilized annually due to lack of awareness.',
                icon: AlertTriangleIcon,
              },
              {
                title: 'Language Barriers',
                desc: 'Most digital tools are in English, excluding 90% of rural entrepreneurs.',
                icon: Languages,
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div
                  className="p-6 rounded-xl h-full"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    transition: 'border-color 0.2s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-strong)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: 'var(--accent-dim)' }}
                  >
                    <item.icon size={20} style={{ color: 'var(--accent-bright)' }} />
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ HOW IT WORKS ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-bright)' }}>
                How It Works
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-4"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              >
                From idea to action in four steps
              </h2>
            </ScrollReveal>
          </div>

          <div ref={workflow.ref} className="relative">
            {/* Connecting line (desktop) */}
            <div
              className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
              style={{
                background: 'var(--border-strong)',
                opacity: workflow.visible ? 0.5 : 0,
                transition: 'opacity 0.6s ease 0.3s',
              }}
            />

            <div className="grid md:grid-cols-4 gap-8 md:gap-6">
              {workflows.map((step, i) => (
                <div
                  key={i}
                  className="relative text-center"
                  style={{
                    opacity: workflow.visible ? 1 : 0,
                    transform: workflow.visible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.5s ease ${0.15 + i * 0.12}s`,
                  }}
                >
                  {/* Step number circle */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 relative z-10"
                    style={{
                      background: 'var(--accent)',
                      boxShadow: '0 4px 16px rgba(0, 71, 65, 0.3)',
                    }}
                  >
                    <span className="text-lg font-bold text-white">{step.num}</span>
                  </div>
                  <h3
                    className="text-sm font-semibold mb-1.5"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed max-w-[200px] mx-auto"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ FEATURES ═══════════════════════════════════════════ */}
      <section id="features" className="py-20 sm:py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-bright)' }}>
                Features
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-4"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              >
                Everything you need to grow
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                Powerful tools designed for the real challenges of rural entrepreneurship.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div
                  className="p-5 rounded-xl h-full group cursor-default"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-bright)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: 'var(--accent-dim)' }}
                  >
                    <feature.icon size={18} style={{ color: 'var(--accent-bright)' }} />
                  </div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {feature.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ PRODUCT PREVIEW ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-bright)' }}>
                Product
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-4"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              >
                See what you'll get
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                Real market insights, scheme recommendations, and actionable guidance — all in one dashboard.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.1} distance={30}>
            <ProductPreview />
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ CREDIBILITY ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-bright)' }}>
                Why BizNex
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-4"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              >
                Built on real methodology
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                Every recommendation is grounded in data, not guesswork.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {credibilityItems.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.07}>
                <div
                  className="p-5 rounded-xl h-full"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: 'var(--accent-dim)' }}
                  >
                    <item.icon size={18} style={{ color: 'var(--accent-bright)' }} />
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ TEAM ═══════════════════════════════════════════ */}
      <section id="team" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-bright)' }}>
                Team
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-3"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              >
                Built by developers who care
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                A team building technology for rural India.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.1}>
            <div className="flex justify-center gap-5 flex-wrap max-w-2xl mx-auto">
              {[
                { name: 'S. Aashrey' },
                { name: 'P. Ramcharan' },
                { name: 'A. Varshitha' },
                { name: 'A. Geetha' },
                { name: 'A. Divya' },
              ].map((member, i) => (
                <div
                  key={i}
                  className="text-center group"
                  style={{
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-2 transition-all duration-200"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span className="text-lg font-bold" style={{ color: 'var(--accent-bright)' }}>
                      {member.name[0]}
                    </span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {member.name}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ CTA ═══════════════════════════════════════════ */}
      <section
        id="contact"
        className="py-20 sm:py-24"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div
              className="relative rounded-2xl p-10 sm:p-14 text-center overflow-hidden"
              style={{
                background: 'var(--accent)',
                border: '1px solid rgba(33, 241, 168, 0.15)',
              }}
            >
              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                  backgroundSize: '32px 32px',
                }}
              />
              <div className="relative z-10">
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-3 text-white"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Ready to grow your business?
                </h2>
                <p className="text-sm sm:text-base mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Join entrepreneurs across rural India using BizNex to make smarter business decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <MagneticButton>
                    <Link to="/register">
                      <Button
                        size="lg"
                        className="min-w-[180px]"
                        style={{
                          background: 'white',
                          color: 'var(--accent)',
                        }}
                      >
                        Get Started Free
                        <ArrowRight size={18} />
                      </Button>
                    </Link>
                  </MagneticButton>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="lg"
                      style={{
                        color: 'rgba(255,255,255,0.85)',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

/* ─── Alert Triangle Icon (inline for the problem section) ── */
function AlertTriangleIcon({ size = 20, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
