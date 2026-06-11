import { useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ContractPage from './pages/ContractPage'
import EvidencePage from './pages/EvidencePage'
import ConfirmPage from './pages/ConfirmPage'
import SettingsPage from './pages/SettingsPage'
import OnboardingPage from './pages/OnboardingPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import { seedDemoData, getUserProfile, getOrCreateProfile } from './data/storage'

// 受保护路由 — 检查登录状态和用户档案
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = localStorage.getItem('coop-auth')
  const isLoggedIn = auth ? JSON.parse(auth)?.loggedIn : false
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  if (!getUserProfile()) {
    getOrCreateProfile()
  }
  return <>{children}</>
}

export default function App() {
  useEffect(() => {
    seedDemoData()
  }, [])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/confirm/:token" element={<ConfirmPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<HomePage />} />
          <Route path="create" element={<CreatePage />} />
          <Route path="project/:id" element={<ProjectDetailPage />} />
          <Route path="project/:id/contract" element={<ContractPage />} />
          <Route path="evidence/:id" element={<EvidencePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
