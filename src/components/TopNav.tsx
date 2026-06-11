import { Link, useLocation } from 'react-router-dom'
import { Plus, User } from 'lucide-react'

export default function TopNav() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="h-14 bg-canvas/80 backdrop-blur-xl border-b border-border-default sticky top-0 z-50 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-ink text-sm tracking-tight lg:hidden">合作单</span>
        {isHome && (
          <span className="hidden lg:block text-ink-subtle text-sm">管理你的设计项目与合作</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isHome && (
          <Link to="/create" className="btn-primary flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">新建合作</span>
          </Link>
        )}
        <button className="icon-btn">
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
