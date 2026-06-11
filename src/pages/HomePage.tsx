import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  PenTool,
  Clock,
  DollarSign,
  AlertTriangle,
  FolderOpen,
  ChevronDown,
} from 'lucide-react'
import ProjectCard from '../components/ProjectCard'
import { getProjects } from '../data/storage'


type FilterKey = 'all' | 'active' | 'pending' | 'completed' | 'draft'
type SortKey = 'newest' | 'deadline' | 'price_desc' | 'price_asc'

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '进行中' },
  { key: 'pending', label: '待确认' },
  { key: 'completed', label: '已完成' },
  { key: 'draft', label: '草稿' },
]

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'newest', label: '最新创建' },
  { key: 'deadline', label: '截止日期' },
  { key: 'price_desc', label: '金额从高到低' },
  { key: 'price_asc', label: '金额从低到高' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const projects = getProjects()
  const [filter, setFilter] = useState<FilterKey>('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [sortOpen, setSortOpen] = useState(false)

  const stats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const inProgress = projects.filter(
      (p) => p.status === 'in_progress' || p.status === 'acceptance'
    ).length
    const pending = projects.filter((p) => p.status === 'pending').length
    const completedThisMonth = projects
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => {
        const d = new Date(p.created_at)
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          return sum + (p.price || 0)
        }
        return sum
      }, 0)
    const riskCount = projects.filter((p) => p.risks.length > 0).length

    return { inProgress, pending, completedThisMonth, riskCount }
  }, [projects])

  const filteredProjects = useMemo(() => {
    let list = [...projects]

    if (filter === 'active') {
      list = list.filter((p) => p.status === 'in_progress' || p.status === 'acceptance')
    } else if (filter === 'pending') {
      list = list.filter((p) => p.status === 'pending')
    } else if (filter === 'completed') {
      list = list.filter((p) => p.status === 'completed')
    } else if (filter === 'draft') {
      list = list.filter((p) => p.status === 'draft')
    }

    if (sort === 'newest') {
      list.sort((a, b) => b.created_at - a.created_at)
    } else if (sort === 'deadline') {
      list.sort((a, b) => {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return a.deadline.localeCompare(b.deadline)
      })
    } else if (sort === 'price_desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sort === 'price_asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0))
    }

    return list
  }, [projects, filter, sort])

  return (
    <div>
      {/* Page Title */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-display font-semibold tracking-tight text-[#1a1a1a]">
            合作单
          </h1>
          <p className="text-caption text-[#8a8a8a] mt-1">
            管理设计项目，保护知识产权
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/app/create')}
        >
          <Plus size={16} />
          新建合作
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="compact-card">
          <div className="flex items-center gap-2 mb-2">
            <PenTool size={14} className="text-[#2563eb]" />
            <span className="text-caption text-[#8a8a8a]">进行中</span>
          </div>
          <div className="text-heading-2 font-semibold text-[#1a1a1a] font-mono">
            {stats.inProgress}
          </div>
        </div>
        <div className="compact-card">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-[#d97706]" />
            <span className="text-caption text-[#8a8a8a]">待确认</span>
          </div>
          <div className="text-heading-2 font-semibold text-[#1a1a1a] font-mono">
            {stats.pending}
          </div>
        </div>
        <div className="compact-card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={14} className="text-[#16a34a]" />
            <span className="text-caption text-[#8a8a8a]">本月收入</span>
          </div>
          <div className="text-heading-2 font-semibold text-[#1a1a1a] font-mono">
            ¥{stats.completedThisMonth.toLocaleString()}
          </div>
        </div>
        <div className="compact-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-[#dc2626]" />
            <span className="text-caption text-[#8a8a8a]">风险预警</span>
          </div>
          <div className="text-heading-2 font-semibold text-[#1a1a1a] font-mono">
            {stats.riskCount}
          </div>
        </div>
      </div>

      {/* Risk Banner */}
      {stats.riskCount > 0 && (
        <div
          className="mb-5 rounded-xl p-4 flex items-center gap-3"
          style={{
            backgroundColor: 'rgba(220,38,38,0.06)',
            border: '1px solid rgba(220,38,38,0.15)',
          }}
        >
          <AlertTriangle size={16} className="text-[#dc2626] shrink-0" />
          <span className="text-body-medium text-[#5a5a5a]">
            检测到 {stats.riskCount} 个项目存在风险
          </span>
        </div>
      )}

      {/* Filter & Sort */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`filter-pill ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative shrink-0">
          <button
            className="btn-secondary"
            onClick={() => setSortOpen((v) => !v)}
          >
            <span className="text-caption">
              {sortOptions.find((s) => s.key === sort)?.label}
            </span>
            <ChevronDown size={14} />
          </button>
          {sortOpen && (
            <div className="dropdown-menu">
              {sortOptions.map((s) => (
                <button
                  key={s.key}
                  className="dropdown-item"
                  onClick={() => {
                    setSort(s.key)
                    setSortOpen(false)
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project List */}
      {filteredProjects.length === 0 ? (
        <div className="card p-12 text-center">
          <FolderOpen size={40} className="text-[#a0a0a0] mx-auto mb-3" />
          <p className="text-body text-[#8a8a8a]">暂无项目</p>
          <p className="text-caption text-[#a0a0a0] mt-1">
            点击右上角"新建合作"创建您的第一个项目
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => navigate(`/app/project/${project.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
