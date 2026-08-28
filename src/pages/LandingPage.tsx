import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  TrendingUp, FileText, Search, Calculator, MessageSquare,
  MapPin, DollarSign, ArrowRight, CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { ScrollReveal, CountUp, GradientText } from '../components/react-bits'
import Button from '../components/ui/Button'

const features = [
  {
    icon: TrendingUp,
    title: 'Market Intelligence',
    description: 'AI-powered demand scores, competition analysis, and revenue forecasts for your specific location.',
  },
  {
    icon: FileText,
    title: 'Business Plan Builder',
    description: 'Generate comprehensive business plans with executive summaries, cost breakdowns, and growth strategies.',
  },
  {
    icon: Search,
    title: 'Scheme Discovery',
    description: 'Find matching government schemes like PMEGP, MUDRA, Stand-Up India with eligibility scoring.',
  },
  {
    icon: Calculator,
    title: 'Loan Eligibility',
    description: 'Calculate your loan eligibility, EMI estimates, and repayment timelines with detailed charts.',
  },
  {
    icon: MessageSquare,
    title: 'AI Business Advisor',
    description: 'Chat with our AI advisor in English, Hindi, Telugu, Tamil, Kannada, or Marathi.',
  },
  {
    icon: MapPin,
    title: 'Local Market Insights',
    description: 'Access population data, literacy rates, demand trends, and business opportunities for your area.',
  },
  {
    icon: DollarSign,
    title: 'Funding Strategy',
    description: 'Get personalized funding structures combining self-funding, loans, subsidies, and schemes.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Sign Up',
    description: 'Create your free account with basic details like name, location, and preferred language.',
  },
  {
    step: '02',
    title: 'Enter Your Idea',
    description: 'Tell us about your business idea, budget, and location. Our AI analyzes everything.',
  },
  {
    step: '03',
    title: 'Get Insights',
    description: 'Receive market analysis, business plans, scheme recommendations, and funding advice.',
  },
  {
    step: '04',
    title: 'Take Action',
    description: 'Download reports, apply for schemes, and start your entrepreneurial journey.',
  },
]

const schemes = [
  { name: 'PMEGP', maxLoan: '₹25 Lakh', subsidy: '25-35%' },
  { name: 'MUDRA Loan', maxLoan: '₹10 Lakh', subsidy: 'Up to 100%' },
  { name: 'Stand-Up India', maxLoan: '₹1 Crore', subsidy: 'Subsidized Rate' },
  { name: 'PM SVANidhi', maxLoan: '₹50,000', subsidy: 'Interest Subvention' },
  { name: 'NRLM', maxLoan: '₹3 Lakh', subsidy: 'Group Lending' },
  { name: 'CGTMSE', maxLoan: '₹5 Crore', subsidy: 'No Collateral' },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Women Entrepreneur, Rajasthan',
    text: 'BizNex helped me understand which government scheme was best for my tailoring business. I got my MUDRA loan approved in just 2 weeks!',
  },
  {
    name: 'Ravi Kumar',
    role: 'Dairy Farmer, Andhra Pradesh',
    text: 'The market analysis feature showed me exactly what my village needs. My dairy farm is now profitable within 3 months of starting.',
  },
  {
    name: 'Sunita Devi',
    role: 'SHG Leader, Bihar',
    text: 'Being able to use the AI assistant in Hindi made everything so much easier. Our self-help group got PMEGP funding for a food processing unit.',
  },
]

const stats = [
  { label: 'Businesses Analyzed', value: 50000, suffix: '+' },
  { label: 'Schemes Recommended', value: 100000, suffix: '+' },
  { label: 'Villages Covered', value: 5000, suffix: '+' },
  { label: 'Languages Supported', value: 6, suffix: '' },
]

const teamMembers = [
  { name: 'S. Aashrey' },
  { name: 'P. Ramcharan' },
  { name: 'A. Varshitha' },
  { name: 'A. Geetha' },
  { name: 'A. Divya' },
]

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-primary)' }} className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        {/* Subtle background accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.03]"
            style={{ background: 'radial-gradient(circle, var(--accent-bright), transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.02]"
            style={{ background: 'radial-gradient(circle, var(--accent-bright), transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="badge badge-accent mb-4 inline-flex">For Rural Entrepreneurs</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] mb-5"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.025em' }}
              >
                Turn local opportunities into{' '}
                <span style={{ color: 'var(--accent-bright)' }}>better business decisions</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg mb-8 max-w-lg leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                BizNex analyzes your location, business idea, market conditions and financial profile to create a personalized growth and funding roadmap.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link to="/register">
                  <Button size="lg">
                    Explore your opportunity
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right: Product Visualization */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="surface-elevated p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}>
                      <TrendingUp size={16} style={{ color: 'var(--accent-bright)' }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Business Intelligence</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>ECIL, Hyderabad · Cyber Cafe</p>
                    </div>
                  </div>
                  <span className="badge badge-success">Active</span>
                </div>

                {/* Score Row */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Market Opportunity', value: '72/100', color: 'var(--accent-bright)' },
                    { label: 'Competition', value: 'Medium', color: 'var(--warning)' },
                    { label: 'Eligible Schemes', value: '5', color: 'var(--info)' },
                    { label: 'Funding Potential', value: '₹30L', color: 'var(--success)' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <p className="text-[11px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                      <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Insight */}
                <div className="p-3 rounded-lg" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--accent-bright)' }}>BizNex Insight</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Demand is strong for cyber cafe services near ECIL. Competition is moderate — consider offering document printing and online form filling to differentiate.
                  </p>
                </div>

                {/* CTA */}
                <Link to="/register" className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-bright)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
                  >
                    <span className="text-sm font-semibold" style={{ color: 'var(--accent-bright)' }}>Explore your opportunity</span>
                    <ArrowRight size={16} style={{ color: 'var(--accent-bright)' }} />
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--accent-bright)' }}>
                  <CountUp to={stat.value} duration={2} delay={0.6 + i * 0.1} />
                  <span>{stat.suffix}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="section-title mb-3" style={{ color: 'var(--text-primary)' }}>
                The challenge we're solving
              </h2>
              <p className="section-subtitle mx-auto">
                Rural India has 63 million MSMEs, but most lack access to business intelligence,
                market data, and government scheme information.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📊', title: 'No Local Market Data', desc: 'Entrepreneurs make decisions without understanding local demand and competition.' },
              { icon: '🏛️', title: 'Scheme Awareness Gap', desc: '₹3 lakh crore in government schemes go unutilized annually due to lack of awareness.' },
              { icon: '🌐', title: 'Language Barriers', desc: 'Most digital tools are in English, excluding 90% of rural entrepreneurs.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="h-full">
                <div className="card h-full p-6">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="section-title mb-3" style={{ color: 'var(--text-primary)' }}>
                Your AI-powered business consultant
              </h2>
              <p className="section-subtitle mx-auto">
                BizNex combines artificial intelligence, local market data, and multilingual support
                to provide hyper-local business advisory for rural India.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="surface-elevated p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="space-y-3">
                    {[
                      'Analyze market demand for any business in your village',
                      'Get personalized government scheme recommendations',
                      'Generate professional business plans in minutes',
                      'Calculate loan eligibility and repayment schedules',
                      'Chat with AI in your preferred Indian language',
                      'Access local demographic and economic data',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={18} style={{ color: 'var(--accent-bright)' }} className="mt-0.5 flex-shrink-0" />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="surface p-5 space-y-3">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                      <MessageSquare size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>BizNex Assistant</span>
                  </div>
                  <div className="p-3 rounded-lg max-w-[80%]" style={{ background: 'var(--accent-dim)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>मैं अपने गांव में डेयरी फार्म शुरू करना चाहता हूं।</p>
                  </div>
                  <div className="p-3 rounded-lg max-w-[80%] ml-auto" style={{ background: 'var(--bg-surface)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>बिल्कुल! आपके क्षेत्र में डेयरी फार्मिंग की मांग बहुत अच्छी है। आइए मैं आपके लिए एक विस्तृत विश्लेषण करता हूं...</p>
                  </div>
                  <div className="flex gap-1.5 mt-1">
                    {['English', 'हिन्दी', 'తెలుగు', 'தமிழ்'].map(lang => (
                      <span key={lang} className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: 'var(--accent-dim)', color: 'var(--text-muted)' }}>{lang}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="section-title mb-3" style={{ color: 'var(--text-primary)' }}>
                Everything you need to grow
              </h2>
              <p className="section-subtitle mx-auto">
                Powerful features designed for the real challenges of rural entrepreneurship.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <ScrollReveal key={i} delay={i * 0.06} className="h-full">
                <div className="card card-interactive h-full p-5">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--accent-dim)' }}>
                    <feature.icon size={20} style={{ color: 'var(--accent-bright)' }} />
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="section-title mb-3" style={{ color: 'var(--text-primary)' }}>
                Get started in 4 steps
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="text-center relative">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 text-lg font-bold"
                    style={{ background: 'var(--accent)', color: 'white' }}>
                    {step.step}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px" style={{ background: 'var(--border-strong)' }} />
                  )}
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Government Schemes */}
      <section id="schemes" className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="section-title mb-3" style={{ color: 'var(--text-primary)' }}>
                Government schemes you're eligible for
              </h2>
              <p className="section-subtitle mx-auto">
                We help you discover and apply for government schemes matched to your profile.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5">
            {schemes.map((scheme, i) => (
              <ScrollReveal key={i} delay={i * 0.06} className="h-full">
                <div className="card h-full p-5 text-center">
                  <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{scheme.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Max Loan</span>
                      <span className="font-semibold" style={{ color: 'var(--accent-bright)' }}>{scheme.maxLoan}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Subsidy</span>
                      <span className="font-semibold" style={{ color: 'var(--accent-bright)' }}>{scheme.subsidy}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-8">
              <Link to="/scheme-finder">
                <Button>
                  Find Your Eligible Schemes
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="section-title mb-3" style={{ color: 'var(--text-primary)' }}>
                Success stories
              </h2>
              <p className="section-subtitle mx-auto">
                Hear from entrepreneurs who transformed their businesses with BizNex.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="h-full">
                <div className="card h-full p-5">
                  <p className="text-sm italic mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--accent-dim)', color: 'var(--accent-bright)' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="section-title mb-3" style={{ color: 'var(--text-primary)' }}>
                Meet the team
              </h2>
              <p className="section-subtitle mx-auto">
                A passionate team of developers and problem solvers building for rural India.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 max-w-3xl mx-auto">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <span className="text-lg font-bold" style={{ color: 'var(--accent-bright)' }}>{member.name[0]}</span>
                  </div>
                  <h4 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{member.name}</h4>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="surface-elevated p-8 md:p-14 text-center">
              <h2 className="text-2xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Ready to transform your business?
              </h2>
              <p className="text-base max-w-xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
                Join thousands of rural entrepreneurs who are using AI to make smarter business decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register">
                  <Button size="lg" className="min-w-[200px]">
                    Get Started
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" className="min-w-[200px]">
                  Contact Us
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
