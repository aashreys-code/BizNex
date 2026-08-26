# GramVikas AI 🌾

**Hyper-Local Business Advisory & Financial Structuring Assistant for Rural India**

Built for **Smart India Hackathon 2024**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.45-3FCF8E?logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)

---

## 🎯 Problem Statement

Rural India has 63 million MSMEs, but most lack access to:
- **Local market data** for informed business decisions
- **Government scheme information** (₹3 lakh crore goes unutilized annually)
- **Financial advisory** in their local language
- **Business planning** tools designed for rural contexts

## 💡 Our Solution

GramVikas AI is an AI-driven multilingual platform that acts as a **virtual business consultant** for:
- Rural micro-entrepreneurs
- Self-Help Groups (SHGs)
- Women entrepreneurs
- Small business owners

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏪 **Hyper-Local Market Analysis** | AI-powered market demand scoring, competition analysis, and revenue forecasts |
| 📋 **Business Plan Generator** | Comprehensive plans with executive summaries, cost breakdowns, and growth strategies |
| 🏛️ **Government Scheme Finder** | Smart matching with 50+ schemes (PMEGP, MUDRA, Stand-Up India, etc.) |
| 💰 **Loan Eligibility Calculator** | EMI estimates, repayment schedules, and bank comparisons |
| 🤖 **Multilingual AI Assistant** | Business guidance in English, Hindi, Telugu, Tamil, Kannada, Marathi |
| 🗺️ **Local Insights Engine** | Population data, literacy rates, demand trends, and opportunities |
| 💵 **AI Funding Advisor** | Personalized funding structures combining loans, subsidies, and self-funding |
| 📄 **Document Verification** | AI-powered document checking and completeness verification |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** (via react-bits) for animations
- **Recharts** for data visualization
- **React Router v6** for routing
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Animated Components
- **[React Bits](https://github.com/DavidHDev/react-bits)** - Custom animated components:
  - BlurText, CountUp, ScrollReveal, GradientText
  - GlassSurface, ParticlesBg, MagneticButton
  - GlowCard, TextType, AnimatedList

### Backend & Auth
- **Supabase** for:
  - Authentication (Email/Password)
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Realtime subscriptions

### AI Integration
- **OpenAI API** / **Google Gemini API** for:
  - Market analysis
  - Business plan generation
  - Scheme recommendations
  - Multilingual chat support

---

## 📁 Project Structure

```
gramvikas-ai/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── react-bits/
│   │   │   ├── BlurText.tsx
│   │   │   ├── CountUp.tsx
│   │   │   ├── ScrollReveal.tsx
│   │   │   ├── GradientText.tsx
│   │   │   ├── GlassSurface.tsx
│   │   │   ├── ParticlesBg.tsx
│   │   │   ├── MagneticButton.tsx
│   │   │   ├── GlowCard.tsx
│   │   │   ├── TextType.tsx
│   │   │   ├── AnimatedList.tsx
│   │   │   └── index.ts
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── TextArea.tsx
│   │       └── Modal.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── ai.ts
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── features/
│   │   │   ├── MarketAnalysis.tsx
│   │   │   ├── BusinessPlan.tsx
│   │   │   ├── SchemeFinder.tsx
│   │   │   ├── LoanCalculator.tsx
│   │   │   ├── AIAssistant.tsx
│   │   │   ├── InsightsEngine.tsx
│   │   │   ├── FundingAdvisor.tsx
│   │   │   └── DocumentVerification.tsx
│   │   └── admin/
│   │       └── AdminPanel.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   └── schema.sql
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Supabase account (free tier works)
- OpenAI or Gemini API key (optional for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-team/gramvikas-ai.git
cd gramvikas-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_key  # optional
VITE_GEMINI_API_KEY=your_gemini_key  # optional
```

4. **Set up Supabase Database**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor
   - Run the contents of `supabase/schema.sql`

5. **Start Development Server**
```bash
npm run dev
```

6. **Open in Browser**
```
http://localhost:3000
```

---

## 📊 Database Schema

The Supabase database includes:
- **profiles** - User profiles (extends auth.users)
- **reports** - Generated analysis reports
- **schemes** - Government scheme database
- **business_ideas** - Saved business analyses
- **chat_history** - AI assistant conversations
- **documents** - Uploaded verification documents
- **loan_applications** - Loan application records

All tables have **Row Level Security (RLS)** enabled for data protection.

---

## 🌐 Supported Languages

| Language | Code | Script |
|----------|------|--------|
| English | en | Latin |
| Hindi | hi | Devanagari |
| Telugu | te | Telugu |
| Tamil | ta | Tamil |
| Kannada | kn | Kannada |
| Marathi | mr | Devanagari |

---

## 🏗️ Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
npx vercel --prod
```

### Backend (Supabase)
- Fully managed by Supabase
- No separate deployment needed

---

## 🤝 Team

Built with ❤️ for Smart India Hackathon 2024

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- [React Bits](https://github.com/DavidHDev/react-bits) for beautiful animated components
- [Supabase](https://supabase.com) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Recharts](https://recharts.org) for data visualization
- Government of India for scheme documentation
"# BizPulse" 
