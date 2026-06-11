import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, FileText, Settings } from 'lucide-react'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/create', label: '新建', icon: Plus },
  { path: '/settings', label: '设置', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-60 bg-surface-1 border-r border-border-default flex flex-col shrink-0">
      <div className="h-14 flex items-center px-4 border-b border-border-default">
        <FileText className="w-5 h-5 text-accent mr-2" />
        <span className="font-semibold text-ink text-sm tracking-tight">合作单</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 h-9 px-3 rounded-button text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-surface-2 text-ink border-l-2 border-accent'
                  : 'text-ink-subtle hover:bg-surface-2 hover:text-ink-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
