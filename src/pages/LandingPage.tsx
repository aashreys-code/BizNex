import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  TrendingUp,
  FileText,
  Search,
  Calculator,
  MessageSquare,
  MapPin,
  DollarSign,
  Upload,
  ArrowRight,
  CheckCircle2,
  Globe,
  Shield,
  Users,
  Star,
  ChevronRight,
} from 'lucide-react'
import {
  BlurText,
  CountUp,
  ScrollReveal,
  GradientText,
  ParticlesBg,
  MagneticButton,
  GlowCard,
  TextType,
} from '../components/react-bits'
import Button from '../components/ui/Button'

const features = [
  {
    icon: TrendingUp,
    title: 'Hyper-Local Market Analysis',
    description: 'Get AI-powered market demand scores, competition analysis, and revenue forecasts for your specific location.',
    color: 'from-moss-400 to-moss-500',
  },
  {
    icon: FileText,
    title: 'Business Plan Generator',
    description: 'Generate comprehensive business plans with executive summaries, cost breakdowns, and growth strategies.',
    color: 'from-moss-400 to-moss-600',
  },
  {
    icon: Search,
    title: 'Government Scheme Finder',
    description: 'Discover matching government schemes like PMEGP, MUDRA, Stand-Up India with eligibility scoring.',
    color: 'from-moss-300 to-moss-400',
  },
  {
    icon: Calculator,
    title: 'Loan Eligibility Calculator',
    description: 'Calculate your loan eligibility, EMI estimates, and repayment timelines with detailed charts.',
    color: 'from-moss-400 to-moss-500',
  },
  {
    icon: MessageSquare,
    title: 'Multilingual AI Assistant',
    description: 'Chat with our AI advisor in English, Hindi, Telugu, Tamil, Kannada, or Marathi with voice support.',
    color: 'from-moss-400 to-moss-500',
  },
  {
    icon: MapPin,
    title: 'Local Insights Engine',
    description: 'Access population data, literacy rates, demand trends, and business opportunities for your area.',
    color: 'from-moss-300 to-moss-400',
  },
  {
    icon: DollarSign,
    title: 'AI Funding Advisor',
    description: 'Get personalized funding structures combining self-funding, loans, subsidies, and government schemes.',
    color: 'from-moss-400 to-moss-500',
  },
  {
    icon: Upload,
    title: 'Document Verification',
    description: 'Upload Aadhaar, PAN, and business documents for AI-powered verification and completeness checks.',
    color: 'from-moss-400 to-moss-500',
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
    description: 'Tell us about your business idea, budget, and location. Our AI will analyze everything.',
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
    text: 'BizPulse helped me understand which government scheme was best for my tailoring business. I got my MUDRA loan approved in just 2 weeks!',
    rating: 5,
  },
  {
    name: 'Ravi Kumar',
    role: 'Dairy Farmer, Andhra Pradesh',
    text: 'The market analysis feature showed me exactly what my village needs. My dairy farm is now profitable within 3 months of starting.',
    rating: 5,
  },
  {
    name: 'Sunita Devi',
    role: 'SHG Leader, Bihar',
    text: 'Being able to use the AI assistant in Hindi made everything so much easier. Our self-help group got PMEGP funding for a food processing unit.',
    rating: 5,
  },
]

const stats = [
  { label: 'Businesses Analyzed', value: 50000, suffix: '+' },
  { label: 'Schemes Recommended', value: 100000, suffix: '+' },
  { label: 'Villages Covered', value: 5000, suffix: '+' },
  { label: 'Languages Supported', value: 6, suffix: '' },
]

const teamMembers = [
  { name: 'S. Aashrey', role: 'Team Lead & Developer' },
  { name: 'P. Ramcharan', role: 'AI/ML Engineer' },
  { name: 'A. Varshitha', role: 'Frontend Developer' },
  { name: 'A. Geetha', role: 'Backend Developer' },
  { name: 'A. Divya', role: 'UI/UX Designer' },
]

export default function LandingPage() {
  return (
    <div className="bg-charcoal-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <ParticlesBg particleCount={80} color="#2BEE34" />

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-moss-400/10 rounded-full blur-3xl animate-liquid" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-moss-400/5 rounded-full blur-3xl animate-liquid-fast" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BlurText
            text="Empowering Rural India with AI-Driven Business Intelligence"
            className="text-4xl sm:text-5xl md:text-7xl font-bold font-display text-white mb-6 leading-tight"
            delay={100}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10"
          >
            Your virtual business consultant for evaluating opportunities, analyzing markets,
            and accessing government funding — all in your local language.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/register">
              <MagneticButton>
                <Button size="lg" className="min-w-[200px]">
                  Start Free
                  <ArrowRight size={18} />
                </Button>
              </MagneticButton>
            </Link>
            <MagneticButton>
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                Watch Demo
              </Button>
            </MagneticButton>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <GlowCard key={i} className="text-center p-4">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  <CountUp to={stat.value} duration={2.5} delay={1.5 + i * 0.2} />
                  <span className="text-moss-400">{stat.suffix}</span>
                </div>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </GlowCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="section-title text-white mb-4">
                The <GradientText text="Challenge" /> We're Solving
              </h2>
              <p className="section-subtitle mx-auto">
                Rural India has 63 million MSMEs, but most lack access to business intelligence,
                market data, and government scheme information.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: 'No Local Market Data', desc: 'Entrepreneurs make decisions without understanding local demand and competition.' },
              { icon: Shield, title: 'Scheme Awareness Gap', desc: '₹3 lakh crore in government schemes go unutilized annually due to lack of awareness.' },
              { icon: Users, title: 'Language Barriers', desc: 'Most digital tools are in English, excluding 90% of rural entrepreneurs.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.15} className="h-full">
                <GlowCard className="text-center p-8 h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-moss-400/10 border border-moss-400/20 flex items-center justify-center mx-auto mb-4">
                    <item.icon size={28} className="text-moss-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-moss-400/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="section-title text-white mb-4">
                Our <GradientText text="Solution" />
              </h2>
              <p className="section-subtitle mx-auto">
                BizPulse combines artificial intelligence, local market data, and multilingual support
                to provide hyper-local business advisory for rural India.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="glass-strong rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Your AI-Powered Business Consultant
                  </h3>
                  <div className="space-y-4">
                    {[
                      'Analyze market demand for any business in your village',
                      'Get personalized government scheme recommendations',
                      'Generate professional business plans in minutes',
                      'Calculate loan eligibility and repayment schedules',
                      'Chat with AI in your preferred Indian language',
                      'Access local demographic and economic data',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-moss-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="glass rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-moss-400 flex items-center justify-center">
                        <MessageSquare size={16} className="text-charcoal-900" />
                      </div>
                      <span className="font-semibold text-white">BizPulse Assistant</span>
                    </div>
                    <div className="bg-moss-400/10 rounded-xl p-3 max-w-[80%]">
                      <p className="text-sm text-gray-300">मैं अपने गांव में डेयरी फार्म शुरू करना चाहता हूं। क्या आप मेरी मदद कर सकते हैं?</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 max-w-[80%] ml-auto">
                      <p className="text-sm text-gray-300">बिल्कुल! आपके क्षेत्र में डेयरी फार्मिंग की मांग बहुत अच्छी है। आइए मैं आपके लिए एक विस्तृत विश्लेषण करता हूं...</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {['English', 'हिन्दी', 'తెలుగు', 'தமிழ்'].map(lang => (
                        <span key={lang} className="text-xs px-2 py-1 rounded-full glass text-moss-400/70">{lang}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="section-title text-white mb-4">
                Powerful <GradientText text="Features" />
              </h2>
              <p className="section-subtitle mx-auto">
                Everything you need to start, grow, and manage your rural business.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <GlowCard className="h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-moss-400/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="section-title text-white mb-4">
                How It <GradientText text="Works" />
              </h2>
              <p className="section-subtitle mx-auto">
                Get started in 4 simple steps.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="text-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-moss-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-charcoal-900">
                    {step.step}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-moss-400/50 to-transparent" />
                  )}
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Government Schemes */}
      <section id="schemes" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="section-title text-white mb-4">
                Government <GradientText text="Schemes" />
              </h2>
              <p className="section-subtitle mx-auto">
                We help you discover and apply for government schemes you're eligible for.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {schemes.map((scheme, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="h-full">
                <GlowCard className="text-center p-6 h-full">
                  <h3 className="text-lg font-bold text-white mb-2">{scheme.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Max Loan:</span>
                      <span className="text-moss-400 font-semibold">{scheme.maxLoan}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subsidy:</span>
                      <span className="text-moss-300 font-semibold">{scheme.subsidy}</span>
                    </div>
                  </div>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-10">
              <Link to="/scheme-finder">
                <Button>
                  Find Your Eligible Schemes
                  <ChevronRight size={18} />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="section-title text-white mb-4">
                Success <GradientText text="Stories" />
              </h2>
              <p className="section-subtitle mx-auto">
                Hear from entrepreneurs who transformed their businesses with BizPulse.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <GlowCard className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={16} className="fill-moss-400 text-moss-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-moss-400 flex items-center justify-center text-charcoal-900 font-semibold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-moss-400/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="section-title text-white mb-4">
                Meet the <GradientText text="Team" />
              </h2>
              <p className="section-subtitle mx-auto">
                A passionate team of developers and problem solvers building for rural India.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-charcoal-800 border border-moss-400/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-moss-400">{member.name[0]}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">{member.name}</h4>
                  <p className="text-xs text-gray-400">{member.role}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="glass-strong rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-moss-400/10 rounded-full blur-3xl animate-liquid" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
                  Ready to <GradientText text="Transform" /> Your Business?
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                  Join thousands of rural entrepreneurs who are using AI to make smarter business decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <MagneticButton>
                      <Button size="lg" className="min-w-[220px]">
                        Get Started Free
                        <ArrowRight size={18} />
                      </Button>
                    </MagneticButton>
                  </Link>
                  <MagneticButton>
                    <Button variant="secondary" size="lg" className="min-w-[220px]">
                      Contact Us
                    </Button>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
