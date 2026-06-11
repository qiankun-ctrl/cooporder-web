import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom'
import {
  Home,
  Plus,
  FolderOpen,
  History,
  Settings,
  Search,
  Bell,
} from 'lucide-react'
import { getProjectById, getUserProfile } from '../data/storage'
import { SessionNavBar } from './ui/sidebar'

function usePageTitle(pathname: string): string {
  return useMemo(() => {
    if (pathname === '/app' || pathname === '/app/') return '首页'
    if (pathname === '/app/create') return '新建合作'
    if (pathname === '/app/settings') return '设置'

    const projectMatch = pathname.match(/^\/app\/project\/([^/]+)$/)
    if (projectMatch) {
      const id = projectMatch[1]
      const project = getProjectById(id)
      return project?.title || '项目详情'
    }

    const contractMatch = pathname.match(/^\/app\/project\/([^/]+)\/contract$/)
    if (contractMatch) return '服务合同'

    const evidenceMatch = pathname.match(/^\/app\/evidence\/([^/]+)$/)
    if (evidenceMatch) return '履约证据链'

    return ''
  }, [pathname])
}

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const pageTitle = usePageTitle(location.pathname)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const profile = getUserProfile()
    if (!profile && !location.pathname.startsWith('/onboarding') && !location.pathname.startsWith('/confirm/')) {
      navigate('/onboarding', { replace: true })
    }
  }, [location.pathname, navigate])

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] flex">
      {/* Animated Sidebar — 鼠标悬停展开 */}
      <SessionNavBar />

      {/* Main Content — 左侧留出 sidebar 宽度 */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#faf8f5] ml-[3.05rem]">
        {/* Top Nav */}
        <header className="top-nav flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-heading-2">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="icon-btn"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="搜索"
            >
              <Search size={18} />
            </button>
            <button className="icon-btn" aria-label="通知">
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* Search bar (conditional) */}
        {searchOpen && (
          <div className="px-4 md:px-6 py-2 bg-white/80 backdrop-blur border-b border-[#e5e0d6]">
            <input
              type="text"
              placeholder="搜索项目..."
              className="input"
              autoFocus
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#faf8f5]">
          <div className="px-4 md:px-6 py-6 pb-24 lg:pb-6 max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Tab */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur border-t border-[#e5e0d6] z-50 flex items-center">
        <NavLink to="/app" end className={({ isActive }) => `bottom-tab-item ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span className="text-[11px]">首页</span>
        </NavLink>
        <NavLink to="/app/create" className={({ isActive }) => `bottom-tab-item ${isActive ? 'active' : ''}`}>
          <Plus size={20} />
          <span className="text-[11px]">新建</span>
        </NavLink>
        <NavLink to="/app/project" className={({ isActive }) => `bottom-tab-item ${isActive ? 'active' : ''}`}>
          <FolderOpen size={20} />
          <span className="text-[11px]">项目</span>
        </NavLink>
        <NavLink to="/app/evidence" className={({ isActive }) => `bottom-tab-item ${isActive ? 'active' : ''}`}>
          <History size={20} />
          <span className="text-[11px]">证据</span>
        </NavLink>
        <NavLink to="/app/settings" className={({ isActive }) => `bottom-tab-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          <span className="text-[11px]">设置</span>
        </NavLink>
      </nav>
    </div>
  )
}
