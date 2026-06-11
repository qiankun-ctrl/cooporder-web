import { CalendarDays, DollarSign } from 'lucide-react'
import type { Project } from '../types'
import { STATUS_LABELS } from '../types'

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

const statusBadgeClass: Record<Project['status'], string> = {
  draft: 'badge-draft',
  pending: 'badge-pending',
  in_progress: 'badge-inprogress',
  acceptance: 'badge-acceptance',
  completed: 'badge-completed',
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const statusLabel = STATUS_LABELS[project.status]
  const badgeClass = statusBadgeClass[project.status]

  return (
    <div
      className="card card-hover cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.()
      }}
    >
      <div className="flex items-start justify-between gap-3 p-4">
        {/* Left */}
        <div className="flex-1 min-w-0">
          <div className="text-body-medium text-[#1a1a1a] truncate">
            {project.title}
          </div>
          {project.client_name && (
            <div className="text-caption text-[#8a8a8a] mt-0.5 truncate">
              {project.client_name}
            </div>
          )}
        </div>

        {/* Middle */}
        <div className="hidden md:flex items-center gap-4">
          {project.deadline && (
            <div className="flex items-center gap-1.5 text-caption text-[#8a8a8a]">
              <CalendarDays size={14} />
              <span>{project.deadline}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-caption text-[#5a5a5a] font-mono">
            <DollarSign size={14} />
            <span>¥{project.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`badge ${badgeClass}`}>{statusLabel}</span>
          {project.risks.length > 0 && (
            <span className="badge badge-risk">{project.risks.length}</span>
          )}
          {project.changes.length > 0 && (
            <span className="badge badge-count">{project.changes.length}</span>
          )}
        </div>
      </div>
    </div>
  )
}
