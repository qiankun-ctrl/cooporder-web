import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  MoreHorizontal,
  PenTool,
  Check,
  Clock,
  FileText,
  Plus,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-react'
import {
  getProjectById,
  upsertProject,
  deleteProject,
} from '../data/storage'
import {
  addMilestone,
  deleteMilestone,
  addChange,
  updateChangeStatus,
  startAcceptance,
  formatStatus,
  createTimeline,
} from '../utils/project'
import { createConfirmation } from '../utils/confirm'
import type { Project, ProjectStatus, Milestone, ProjectChange } from '../types'
import { STATUS_LABELS, PAYMENT_METHOD_LABELS } from '../types'

const statusOrder: ProjectStatus[] = [
  'draft',
  'pending',
  'in_progress',
  'acceptance',
  'completed',
]

const statusBadgeClass: Record<ProjectStatus, string> = {
  draft: 'badge-draft',
  pending: 'badge-pending',
  in_progress: 'badge-inprogress',
  acceptance: 'badge-acceptance',
  completed: 'badge-completed',
}

function getStatusIndex(status: ProjectStatus): number {
  return statusOrder.indexOf(status)
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(() =>
    id ? getProjectById(id) : null
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const [newMilestoneName, setNewMilestoneName] = useState('')
  const [showAddMilestone, setShowAddMilestone] = useState(false)
  const [newChangeContent, setNewChangeContent] = useState('')
  const [showAddChange, setShowAddChange] = useState(false)
  const [rejectFormOpen, setRejectFormOpen] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const refresh = () => {
    if (id) setProject(getProjectById(id))
  }

  if (!project || !id) {
    return (
      <div className="card p-12 text-center">
        <p className="text-body text-[#8a8a8a]">项目不存在或已被删除</p>
        <button className="btn-primary mt-4" onClick={() => navigate('/app')}>
          返回首页
        </button>
      </div>
    )
  }

  const statusIdx = getStatusIndex(project.status)

  const handleDelete = () => {
    if (confirm('确定要删除这个项目吗？此操作不可撤销。')) {
      deleteProject(project.id)
      navigate('/app')
    }
  }

  const handleGenerateContract = () => {
    navigate(`/app/project/${project.id}/contract`)
  }

  const handleSendConfirm = () => {
    const event = createConfirmation(project.id, {
      type: 'final',
      title: '项目成果确认',
      content: `请确认「${project.title}」项目成果是否符合要求。`,
    })
    if (event) {
      alert(`确认链接已生成，token: ${event.confirm_token}`)
      refresh()
    }
  }

  const handleAddMilestone = () => {
    if (!newMilestoneName.trim()) return
    addMilestone(project.id, newMilestoneName.trim())
    setNewMilestoneName('')
    setShowAddMilestone(false)
    refresh()
  }

  const handleDeleteMilestone = (milestoneId: string) => {
    if (confirm('确定删除此里程碑？')) {
      deleteMilestone(project.id, milestoneId)
      refresh()
    }
  }

  const handleCompleteMilestone = (milestone: Milestone) => {
    const updated = { ...project }
    const ms = updated.milestones.find((m) => m.id === milestone.id)
    if (ms) {
      ms.status = 'confirmed'
      updated.timeline.unshift(
        createTimeline('milestone', `完成里程碑：${ms.name}`)
      )
      upsertProject(updated)
      refresh()
    }
  }

  const handleAddChange = () => {
    if (!newChangeContent.trim()) return
    addChange(project.id, newChangeContent.trim())
    setNewChangeContent('')
    setShowAddChange(false)
    refresh()
  }

  const handleChangeStatus = (changeId: string, status: 'confirmed' | 'rejected') => {
    if (status === 'rejected') {
      setRejectFormOpen(changeId)
      return
    }
    updateChangeStatus(project.id, changeId, status)
    refresh()
  }

  const handleRejectSubmit = (changeId: string) => {
    updateChangeStatus(project.id, changeId, 'rejected')
    setRejectFormOpen(null)
    setRejectReason('')
    refresh()
  }

  const handleStartAcceptance = () => {
    startAcceptance(project.id)
    refresh()
  }

  const handleCompleteProject = () => {
    const updated = { ...project }
    updated.status = 'completed'
    updated.timeline.unshift(createTimeline('complete', '项目已完成'))
    upsertProject(updated)
    refresh()
  }

  const primaryAction = useMemo(() => {
    if (project.status === 'draft') {
      return { label: '启动项目', action: () => {
        const updated = { ...project, status: 'in_progress' as ProjectStatus }
        updated.timeline.unshift(createTimeline('update', '项目已启动'))
        upsertProject(updated)
        refresh()
      }}
    }
    if (project.status === 'pending') {
      return { label: '确认并开始', action: () => {
        const updated = { ...project, status: 'in_progress' as ProjectStatus }
        updated.timeline.unshift(createTimeline('update', '项目已确认并启动'))
        upsertProject(updated)
        refresh()
      }}
    }
    if (project.status === 'in_progress') {
      return { label: '发起验收', action: handleStartAcceptance }
    }
    if (project.status === 'acceptance') {
      return { label: '标记完成', action: handleCompleteProject }
    }
    return null
  }, [project])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button className="icon-btn" onClick={() => navigate('/app')}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-heading-1 truncate px-2">{project.title}</h1>
        <div className="relative">
          <button className="icon-btn" onClick={() => setMenuOpen((v) => !v)}>
            <MoreHorizontal size={20} />
          </button>
          {menuOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  handleGenerateContract()
                  setMenuOpen(false)
                }}
              >
                <FileText size={16} />
                生成合同
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  handleSendConfirm()
                  setMenuOpen(false)
                }}
              >
                <Clock size={16} />
                发送确认
              </button>
              <button
                className="dropdown-item danger"
                onClick={() => {
                  handleDelete()
                  setMenuOpen(false)
                }}
              >
                <Trash2 size={16} />
                删除项目
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Hero Card */}
      <div className="card p-5 mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`badge ${statusBadgeClass[project.status]} text-sm`}>
              {STATUS_LABELS[project.status]}
            </span>
            <div>
              <div className="text-body-medium text-[#1a1a1a]">
                状态 · {formatStatus(project.status)}
              </div>
              <div className="text-caption text-[#8a8a8a]">
                创建于 {new Date(project.created_at).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="hidden md:flex items-center gap-1">
            {statusOrder.map((s, i) => {
              const done = i <= statusIdx
              const current = i === statusIdx
              return (
                <div key={s} className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: done
                        ? current
                          ? '#c4850f'
                          : '#16a34a'
                        : '#e5e0d6',
                    }}
                  />
                  {i < statusOrder.length - 1 && (
                    <div
                      className="w-6 h-0.5"
                      style={{
                        backgroundColor: i < statusIdx ? '#16a34a' : '#e5e0d6',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {primaryAction && (
            <button className="btn-primary" onClick={primaryAction.action}>
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>

      {/* Project Info Card */}
      <div className="card p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <PenTool size={18} className="text-[#c4850f]" />
          <h2 className="text-heading-2">项目信息</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="项目金额" value={`¥${project.price.toLocaleString()}`} mono />
          <InfoField label="截止日期" value={project.deadline || '未设置'} />
          <InfoField label="方案数量" value={project.concept_count ? `${project.concept_count} 个` : '未设置'} />
          <InfoField label="设计尺寸" value={project.size || '未设置'} />
          <InfoField label="使用场景" value={project.usage || '未设置'} />
          <InfoField label="付款方式" value={project.payment_method ? PAYMENT_METHOD_LABELS[project.payment_method] : '未设置'} />
          <InfoField label="修改限制" value={`${project.revision_limit} 次`} />
          <InfoField label="已用修改" value={`${project.revision_used} 次`} />
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="card p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-heading-2">项目进度</h2>
            {project.milestones.length > 0 && (
              <span className="badge badge-count">{project.milestones.length}</span>
            )}
          </div>
          <button
            className="btn-ghost"
            onClick={() => setShowAddMilestone((v) => !v)}
          >
            <Plus size={16} />
            添加里程碑
          </button>
        </div>

        {showAddMilestone && (
          <div className="flex gap-2 mb-4">
            <input
              className="input flex-1"
              placeholder="里程碑名称"
              value={newMilestoneName}
              onChange={(e) => setNewMilestoneName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone()}
            />
            <button className="btn-primary" onClick={handleAddMilestone}>
              添加
            </button>
          </div>
        )}

        <div className="flex flex-col gap-0">
          {project.milestones.map((ms, idx) => {
            const isCompleted = ms.status === 'confirmed'
            const isCurrent = !isCompleted && idx === project.milestones.findIndex((m) => m.status !== 'confirmed')
            return (
              <div key={ms.id} className="timeline-item pb-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`timeline-node ${isCompleted ? 'completed' : isCurrent ? 'current' : 'future'}`}
                  >
                    {isCompleted && <Check size={8} className="text-white" />}
                    {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  {idx < project.milestones.length - 1 && (
                    <div
                      className={`timeline-line ${isCompleted ? 'completed' : 'future'}`}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="compact-card">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-body-medium text-[#1a1a1a]">{ms.name}</div>
                        {ms.linked_amount !== undefined && (
                          <div className="text-caption text-[#5a5a5a] font-mono mt-0.5">
                            ¥{ms.linked_amount.toLocaleString()}
                          </div>
                        )}
                        <div className="mt-1">
                          <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-pending'}`}>
                            {isCompleted ? '已完成' : '待完成'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!isCompleted && (
                          <button
                            className="icon-btn"
                            onClick={() => handleCompleteMilestone(ms)}
                            title="标记完成"
                          >
                            <Check size={16} className="text-[#16a34a]" />
                          </button>
                        )}
                        <button
                          className="icon-btn"
                          onClick={() => handleDeleteMilestone(ms.id)}
                          title="删除"
                        >
                          <Trash2 size={16} className="text-[#dc2626]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {project.milestones.length === 0 && (
            <p className="text-caption text-[#8a8a8a] text-center py-4">
              暂无里程碑，点击上方按钮添加
            </p>
          )}
        </div>
      </div>

      {/* Changes */}
      {project.changes.length > 0 && (
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-2">变更记录</h2>
            <button
              className="btn-ghost"
              onClick={() => setShowAddChange((v) => !v)}
            >
              <Plus size={16} />
              新增变更
            </button>
          </div>

          {showAddChange && (
            <div className="flex gap-2 mb-4">
              <input
                className="input flex-1"
                placeholder="变更内容描述"
                value={newChangeContent}
                onChange={(e) => setNewChangeContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddChange()}
              />
              <button className="btn-primary" onClick={handleAddChange}>
                添加
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {project.changes.map((change) => (
              <ChangeItem
                key={change.id}
                change={change}
                onConfirm={() => handleChangeStatus(change.id, 'confirmed')}
                onReject={() => handleChangeStatus(change.id, 'rejected')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      {project.risks.length > 0 && (
        <div
          className="card p-5 mb-5 border-l-4"
          style={{ borderLeftColor: '#dc2626' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-[#dc2626]" />
            <h2 className="text-heading-2 text-[#dc2626]">风险预警</h2>
          </div>
          <div className="flex flex-col gap-2">
            {project.risks.map((risk, idx) => (
              <div
                key={idx}
                className="compact-card flex items-center justify-between gap-2"
              >
                <span className="text-body text-[#5a5a5a]">{risk}</span>
                <button
                  className="icon-btn shrink-0"
                  onClick={() => {
                    const updated = { ...project }
                    updated.risks.splice(idx, 1)
                    upsertProject(updated)
                    refresh()
                  }}
                >
                  <X size={16} className="text-[#8a8a8a]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card p-4 flex justify-end gap-2">
        <button
          className="btn-secondary"
          onClick={() => navigate(`/app/evidence/${project.id}`)}
        >
          <Clock size={16} />
          证据链
        </button>
        <button
          className="btn-secondary"
          onClick={() => navigate(`/app/project/${project.id}/contract`)}
        >
          <FileText size={16} />
          查看合同
        </button>
        {primaryAction && (
          <button className="btn-primary" onClick={primaryAction.action}>
            {primaryAction.label}
          </button>
        )}
      </div>

      {/* Reject Modal */}
      {rejectFormOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 className="text-heading-2 mb-3">拒绝变更</h3>
            <textarea
              className="textarea mb-4"
              placeholder="请输入拒绝原因（可选）"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="btn-ghost"
                onClick={() => {
                  setRejectFormOpen(null)
                  setRejectReason('')
                }}
              >
                取消
              </button>
              <button
                className="btn-danger"
                onClick={() => handleRejectSubmit(rejectFormOpen)}
              >
                提交拒绝
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoField({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <div className="text-caption text-[#8a8a8a] mb-0.5">{label}</div>
      <div className={`text-body-medium text-[#1a1a1a] ${mono ? 'font-mono' : ''}`}>
        {value}
      </div>
    </div>
  )
}

function ChangeItem({
  change,
  onConfirm,
  onReject,
}: {
  change: ProjectChange
  onConfirm: () => void
  onReject: () => void
}) {
  const statusClass =
    change.status === 'confirmed'
      ? 'badge-completed'
      : change.status === 'rejected'
      ? 'badge-risk'
      : 'badge-pending'
  const statusText =
    change.status === 'confirmed' ? '已确认' : change.status === 'rejected' ? '已拒绝' : '待确认'

  return (
    <div className="compact-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-body-medium text-[#1a1a1a]">变更单</span>
            <span className={`badge ${statusClass}`}>{statusText}</span>
          </div>
          <p className="text-body text-[#5a5a5a]">{change.content}</p>
          <div className="text-caption text-[#a0a0a0] mt-1">
            {new Date(change.created_at).toLocaleString('zh-CN')}
            {change.fee !== undefined && (
              <span className="ml-2 font-mono">¥{change.fee.toLocaleString()}</span>
            )}
          </div>
        </div>
        {change.status === 'pending' && (
          <div className="flex items-center gap-1 shrink-0">
            <button className="btn-danger" onClick={onReject}>
              拒绝
            </button>
            <button className="btn-primary" onClick={onConfirm}>
              同意
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
