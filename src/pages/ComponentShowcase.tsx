import { useState } from 'react'
import { motion } from 'motion/react'
import {
  BlurText,
  TextType,
  CountUp,
  ScrollReveal,
  MagneticButton,
  GlowCard,
  AnimatedList,
} from '../components/react-bits'
import { Sparkles, Zap, TrendingUp, ArrowRight, MousePointer2, Play, RotateCcw, Box } from 'lucide-react'

const floatingCards = [
  { icon: '🛒', title: 'Local Shop', desc: 'Grocery store in Secunderabad', color: '#21F1A8' },
  { icon: '🏭', title: 'Small Factory', desc: 'Textile unit in Warangal', color: '#3b82f6' },
  { icon: '🏪', title: 'Kirana Store', desc: 'General store in ECIL', color: '#f59e0b' },
  { icon: '💇', title: 'Salon', desc: 'Beauty parlour in Ameerpet', color: '#ec4899' },
  { icon: '🔧', title: 'Workshop', desc: 'Repair shop in Dilsukhnagar', color: '#8b5cf6' },
  { icon: '🍽️', title: 'Restaurant', desc: 'Food corner in Madhapur', color: '#ef4444' },
]

export default function ComponentShowcase() {
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [rotated, setRotated] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Hero */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <BlurText
            text="Interactive Motion Components"
            className="text-4xl md:text-5xl font-bold mb-4"
            animateBy="words"
            direction="top"
          />
          <TextType
            text={['Magnetic Buttons', 'Blur Text Reveals', 'Scroll Animations', 'Floating Cards', 'Count-Up Numbers']}
            className="text-xl md:text-2xl font-medium"
            speed={80}
            deleteSpeed={40}
            pauseTime={1500}
          />
          <p className="mt-6 text-lg opacity-60 max-w-2xl mx-auto">
            Explore the interactive motion components available in the BizNex design system.
            Each component is purpose-built for specific UX patterns.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 space-y-24 pb-32">

        {/* 1. Magnetic Button */}
        <ScrollReveal direction="up">
          <section>
            <SectionHeader icon={<MousePointer2 size={20} />} title="Magnetic Button" description="Cursor-following magnetic pull effect. Move your mouse over the buttons." />
            <div className="flex flex-wrap gap-6 justify-center mt-8">
              <MagneticButton strength={0.3}>
                <motion.button
                  className="px-8 py-4 rounded-xl font-semibold text-base"
                  style={{
                    background: 'linear-gradient(135deg, #21F1A8, #004741)',
                    color: '#fff',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={18} /> Get Started Free
                  </span>
                </motion.button>
              </MagneticButton>

              <MagneticButton strength={0.5}>
                <motion.button
                  className="px-8 py-4 rounded-xl font-semibold text-base border-2"
                  style={{
                    borderColor: '#21F1A8',
                    color: '#21F1A8',
                    background: 'transparent',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <Play size={18} /> Watch Demo
                  </span>
                </motion.button>
              </MagneticButton>

              <MagneticButton strength={0.2}>
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: 'var(--surface-secondary)' }}
                  whileHover={{ rotate: 90 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <RotateCcw size={24} style={{ color: '#21F1A8' }} />
                </motion.div>
              </MagneticButton>
            </div>
          </section>
        </ScrollReveal>

        {/* 2. Blur Text Reveal */}
        <ScrollReveal direction="left">
          <section>
            <SectionHeader icon={<Sparkles size={20} />} title="Blur Text Reveal" description="Words animate in with a blur-to-focus effect as they enter the viewport." />
            <div className="mt-8 space-y-6">
              <div className="p-8 rounded-2xl" style={{ background: 'var(--surface-primary)' }}>
                <BlurText
                  text="Every business deserves intelligent guidance powered by hyper-local data and AI."
                  className="text-2xl md:text-3xl font-semibold leading-relaxed"
                  animateBy="words"
                  direction="top"
                  delay={150}
                  stepDuration={0.4}
                />
              </div>
              <div className="p-8 rounded-2xl" style={{ background: 'var(--surface-primary)' }}>
                <BlurText
                  text="From market analysis to government scheme discovery — all in one platform."
                  className="text-lg opacity-70"
                  animateBy="characters"
                  direction="bottom"
                  delay={30}
                  stepDuration={0.2}
                />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 3. CountUp Numbers */}
        <ScrollReveal direction="right">
          <section>
            <SectionHeader icon={<TrendingUp size={20} />} title="Count-Up Numbers" description="Animated number counters that trigger when scrolled into view." />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { value: 63, suffix: 'M+', label: 'MSMEs in India' },
                { value: 3, suffix: 'L Cr', label: 'Schemes Unutilized' },
                { value: 94, suffix: '%', label: 'AI Accuracy' },
                { value: 12, suffix: '+', label: 'Languages Supported' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl text-center"
                  style={{ background: 'var(--surface-primary)' }}
                >
                  <div className="text-3xl md:text-4xl font-bold" style={{ color: '#21F1A8' }}>
                    <CountUp to={stat.value} duration={2} delay={i * 0.2} separator="" />
                    <span>{stat.suffix}</span>
                  </div>
                  <p className="text-sm mt-2 opacity-60">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 4. Floating Interactive Cards */}
        <ScrollReveal direction="up">
          <section>
            <SectionHeader icon={<Box size={20} />} title="Floating Interactive Cards" description="Cards with hover lift, magnetic pull, and click-to-expand interactions." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {floatingCards.map((card, i) => (
                <MagneticButton key={i} strength={0.15}>
                  <motion.div
                    className="p-6 rounded-2xl cursor-pointer relative overflow-hidden"
                    style={{ background: 'var(--surface-primary)' }}
                    whileHover={{ y: -8, boxShadow: `0 20px 40px ${card.color}15` }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveCard(activeCard === i ? null : i)}
                    layout
                  >
                    {/* Glow accent on hover */}
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                      style={{ background: card.color }}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{card.icon}</span>
                      <div>
                        <h3 className="font-semibold text-base">{card.title}</h3>
                        <p className="text-sm opacity-60 mt-1">{card.desc}</p>
                      </div>
                    </div>
                    {/* Expandable detail */}
                    {activeCard === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t"
                        style={{ borderColor: 'var(--border-primary)' }}
                      >
                        <p className="text-sm opacity-70">
                          This business could benefit from <strong style={{ color: card.color }}>3 government schemes</strong> and
                          shows <strong style={{ color: '#21F1A8' }}>18% growth potential</strong> in the local market.
                        </p>
                        <button
                          className="mt-3 text-sm font-medium flex items-center gap-1"
                          style={{ color: card.color }}
                        >
                          View Recommendations <ArrowRight size={14} />
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </MagneticButton>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 5. Glow Card */}
        <ScrollReveal direction="left">
          <section>
            <SectionHeader icon={<Zap size={20} />} title="Glow Card" description="Subtle border glow effect on hover — adds depth to content cards." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { title: 'Market Intelligence', desc: 'Real-time demand signals from your local market area.', accent: '#21F1A8' },
                { title: 'AI Recommendations', desc: 'Personalized business advice based on your profile and location.', accent: '#3b82f6' },
                { title: 'Scheme Discovery', desc: 'Find government schemes you qualify for automatically.', accent: '#f59e0b' },
              ].map((item, i) => (
                <GlowCard key={i}>
                  <motion.div
                    className="p-6 rounded-2xl"
                    style={{ background: 'var(--surface-primary)' }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.accent}15` }}>
                      <Zap size={20} style={{ color: item.accent }} />
                    </div>
                    <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                    <p className="text-sm opacity-60">{item.desc}</p>
                  </motion.div>
                </GlowCard>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 6. Animated List */}
        <ScrollReveal direction="right">
          <section>
            <SectionHeader icon={<Sparkles size={20} />} title="Animated List" description="Items animate in sequentially with staggered delays." />
            <div className="mt-8 p-8 rounded-2xl max-w-lg mx-auto" style={{ background: 'var(--surface-primary)' }}>
              <h3 className="font-semibold text-lg mb-4">Your Business Recommendations</h3>
              <AnimatedList className="space-y-2">
                {[
                  '📊 Expand into healthcare services — 34% local demand growth',
                  '💰 Apply for MUDRA Loan — 92% eligibility match',
                  '🏪 Open branch in ECIL — underserved market detected',
                  '📈 Increase inventory by 20% — festive season approaching',
                  '🤝 Partner with local cooperative — shared distribution model',
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg text-sm" style={{ background: 'var(--surface-secondary)' }}>
                    {item}
                  </div>
                ))}
              </AnimatedList>
            </div>
          </section>
        </ScrollReveal>

        {/* 7. Scroll Reveal Directions */}
        <ScrollReveal direction="up">
          <section>
            <SectionHeader icon={<TrendingUp size={20} />} title="Scroll Reveal Directions" description="Content reveals from different directions as you scroll." />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {(['up', 'down', 'left', 'right'] as const).map((dir, i) => (
                <ScrollReveal key={dir} direction={dir} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl text-center" style={{ background: 'var(--surface-primary)' }}>
                    <div className="text-2xl mb-2">{['⬆️', '⬇️', '⬅️', '➡️'][i]}</div>
                    <p className="text-sm font-medium capitalize">From {dir}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 8. Micro-interactions */}
        <ScrollReveal direction="up">
          <section>
            <SectionHeader icon={<MousePointer2 size={20} />} title="Micro-Interactions" description="Subtle hover, tap, and toggle animations for UI elements." />
            <div className="flex flex-wrap gap-6 justify-center mt-8">
              {/* Toggle */}
              <motion.button
                className="w-16 h-8 rounded-full relative"
                style={{
                  background: rotated ? '#21F1A8' : 'var(--surface-secondary)',
                }}
                onClick={() => setRotated(!rotated)}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="w-6 h-6 rounded-full absolute top-1"
                  style={{ background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                  animate={{ left: rotated ? 34 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>

              {/* Tap to expand */}
              <motion.div
                className="px-6 py-3 rounded-xl cursor-pointer font-medium text-sm"
                style={{ background: 'var(--surface-primary)' }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                Tap Me
              </motion.div>

              {/* Ripple effect button */}
              <motion.button
                className="px-6 py-3 rounded-xl font-medium text-sm relative overflow-hidden"
                style={{ background: '#21F1A8', color: '#000' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Hover & Tap
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.3)' }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.5, opacity: 0.1 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.button>

              {/* Bounce icon */}
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ background: 'var(--surface-primary)' }}
                whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
              >
                <Zap size={20} style={{ color: '#f59e0b' }} />
              </motion.div>

              {/* Color shift card */}
              <motion.div
                className="px-6 py-3 rounded-xl cursor-pointer font-medium text-sm"
                style={{ background: 'var(--surface-primary)', border: '2px solid transparent' }}
                whileHover={{ borderColor: '#21F1A8', color: '#21F1A8' }}
              >
                Border Glow
              </motion.div>
            </div>
          </section>
        </ScrollReveal>

      </div>
    </div>
  )
}

function SectionHeader({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#21F1A815', color: '#21F1A8' }}>
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm opacity-60 mt-1">{description}</p>
      </div>
    </div>
  )
}
