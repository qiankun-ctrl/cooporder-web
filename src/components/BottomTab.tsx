import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, Settings } from 'lucide-react'

const tabs = [
  { path: '/', label: '首页', icon: Home },
  { path: '/create', label: '新建', icon: Plus },
  { path: '/settings', label: '设置', icon: Settings },
]

export default function BottomTab() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-1/90 backdrop-blur-xl border-t border-border-default z-50 flex items-center justify-around">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path
        const Icon = tab.icon
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center gap-0.5 py-2 px-4 ${
              isActive ? 'text-accent' : 'text-ink-tertiary'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[11px] font-medium">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
