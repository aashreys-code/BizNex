# BizNex 🌾

**Hyper-Local Business Advisory & Financial Structuring Assistant for Rural India**

Built for **Smart India Hackathon 2026**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.45-3FCF8E?logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)

---

## 🎯 Problem Statement

Rural India has 63 million MSMEs, but most lack access to:
- **Local market data** for informed business decisions
- **Government scheme information** — ₹3 lakh crore goes unutilized annually
- **Financial advisory** in their local language
- **Business planning** tools designed for rural contexts

## 💡 Our Solution

BizNex is an AI-driven multilingual platform that acts as a **virtual business consultant** for:
- Rural micro-entrepreneurs
- Self-Help Groups (SHGs)
- Women entrepreneurs
- Small business owners

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Market Intelligence** | AI-powered market demand scoring, competition analysis, and revenue forecasts |
| **Business Plan Builder** | Comprehensive plans with executive summaries, cost breakdowns, and growth strategies |
| **Scheme Discovery** | Smart matching with 18+ structured government schemes (PMEGP, MUDRA, Stand-Up India, CGTMSE, PM SVANidhi, NRLM, etc.) |
| **Loan Eligibility Check** | EMI estimates, repayment schedules, and bank comparisons |
| **AI Business Advisor** | Business guidance in English, Hindi, Telugu, Tamil, Kannada, Marathi |
| **Local Market Insights** | District-level Census data on population, literacy, employment, and business opportunities |
| **Funding Strategy** | Personalized funding structures combining loans, subsidies, and self-funding |
| **Competitor Analysis** | Interactive map with nearby competitors, radar charts, and PDF report export |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Router v6** for client-side routing
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **React Leaflet** for interactive maps
- **jsPDF** for PDF report generation
- **i18next** for multilingual support

### Animated Components
- **[React Bits](https://github.com/DavidHDev/react-bits)** — Custom animated components:
  - BlurText, CountUp, ScrollReveal, GradientText
  - GlassSurface, ParticlesBg, MagneticButton
  - GlowCard, TextType, AnimatedList

### Backend & Auth
- **Supabase** for:
  - Authentication (Email/Password)
  - PostgreSQL Database with Row Level Security (RLS)

### AI Integration
- **Groq API** (primary, ultra-fast) and **Google Gemini API** (fallback) for:
  - Market analysis
  - Business plan generation
  - Scheme recommendations
  - Multilingual chat support

---

## 📁 Project Structure

```
biznex/
├── public/
│   ├── favicon.svg
│   ├── logo-dark.svg
│   └── logo-light.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx          # Public page layout
│   │   │   ├── Navbar.tsx          # Navigation bar
│   │   │   ├── Footer.tsx          # Footer
│   │   │   └── DashboardLayout.tsx # Dashboard sidebar layout
│   │   ├── landing/
│   │   │   ├── HeroVisual.tsx      # Landing page hero animation
│   │   │   └── ProductPreview.tsx  # Dashboard preview screenshot
│   │   ├── react-bits/             # Animated UI components
│   │   └── ui/                     # Reusable UI primitives
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Authentication state
│   │   ├── BusinessContext.tsx      # Multi-business profile management
│   │   └── ThemeContext.tsx         # Dark/light theme
│   ├── lib/
│   │   ├── ai.ts                   # AI API integration (Groq + Gemini)
│   │   ├── census-data.ts          # Real district & state demographic data
│   │   ├── chartColors.ts          # Theme-aware chart colors
│   │   ├── i18n.ts                 # Internationalization setup
│   │   ├── schemes-data.ts         # 18+ structured government scheme database
│   │   └── supabase.ts             # Supabase client
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── BusinessProfile.tsx
│   │   ├── Profile.tsx
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
│   │   │   ├── NearbyCompetitors.tsx
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
- npm
- A Supabase account (free tier works)
- Groq API key (optional — free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-team/biznex.git
cd biznex
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
# Primary AI Provider (Fast — recommended)
VITE_GROQ_API_KEY=your_groq_key

# Fallback AI Provider
VITE_GEMINI_API_KEY=your_gemini_key

# Supabase (optional — for auth/database)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Open in Browser**
```
http://localhost:3000
```

> **Note:** The app works without any API keys configured. AI features will use built-in fallback data. Use the **"Try Demo"** button on the login page for instant access.

---

## 🗄️ Database Schema (Optional)

If using Supabase, run `supabase/schema.sql` in the SQL Editor to set up:
- **profiles** — User profiles (extends auth.users)
- **reports** — Generated analysis reports
- **schemes** — Government scheme database
- **business_ideas** — Saved business analyses
- **chat_history** — AI assistant conversations
- **documents** — Uploaded verification documents
- **loan_applications** — Loan application records

All tables have **Row Level Security (RLS)** enabled.

---

## 🌐 Supported Languages

| Language | Code |
|----------|------|
| English | en |
| Hindi | hi |
| Telugu | te |
| Tamil | ta |
| Kannada | kn |
| Marathi | mr |

---

## 🏗️ Deployment

### Frontend (Vercel / Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Supabase)
Fully managed — no separate deployment needed.

---

## 📊 Government Scheme Database

BizNex includes structured data for 18+ real government schemes:
- MUDRA Loan (Shishu, Kishore, Tarun)
- PMEGP (Prime Minister Employment Generation Programme)
- Stand-Up India
- PM SVANidhi
- CGTMSE
- NRLM (DAY-NRLM)
- Startup India Seed Fund
- PMFME
- CLCSS
- PM-KUSUM
- And more...

Each scheme includes eligibility criteria, required documents, application process, and direct portal links.

---

## 🤝 Team

Built with ❤️ for Smart India Hackathon 2026

---

## 📝 License

MIT License — See LICENSE file for details.

---

## 🙏 Acknowledgments

- [React Bits](https://github.com/DavidHDev/react-bits) for animated UI components
- [Supabase](https://supabase.com) for backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Recharts](https://recharts.org) for data visualization
- Government of India for scheme documentation and Census data
