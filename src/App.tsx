import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Pages
import LandingPage from './pages/LandingPage'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Dashboard from './pages/Dashboard'
import BusinessProfile from './pages/BusinessProfile'
import MarketAnalysis from './pages/features/MarketAnalysis'
import BusinessPlan from './pages/features/BusinessPlan'
import SchemeFinder from './pages/features/SchemeFinder'
import LoanCalculator from './pages/features/LoanCalculator'
import AIAssistant from './pages/features/AIAssistant'
import InsightsEngine from './pages/features/InsightsEngine'
import FundingAdvisor from './pages/features/FundingAdvisor'
import DocumentVerification from './pages/features/DocumentVerification'
import NearbyCompetitors from './pages/features/NearbyCompetitors'
import WholesaleFinder from './pages/features/WholesaleFinder'
import AdminPanel from './pages/admin/AdminPanel'

// Layout
import Layout from './components/layout/Layout'
import DashboardLayout from './components/layout/DashboardLayout'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
      </div>
    )
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><LandingPage /></Layout>} />

      <Route path="/login" element={<Layout><LoginPage /></Layout>} />
      <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/business-profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BusinessProfile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/market-analysis"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MarketAnalysis />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/business-plan"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BusinessPlan />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/scheme-finder"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SchemeFinder />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/loan-calculator"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LoanCalculator />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-assistant"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AIAssistant />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <InsightsEngine />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/funding-advisor"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FundingAdvisor />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/document-verification"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DocumentVerification />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nearby-competitors"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <NearbyCompetitors />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/wholesale-suppliers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <WholesaleFinder />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <DashboardLayout>
              <AdminPanel />
            </DashboardLayout>
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
