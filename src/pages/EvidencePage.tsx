import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Fingerprint, FileText, CheckCircle2, Clock } from 'lucide-react'
import { getProjectById } from '../data/storage'

interface EvidenceEvent {
  id: string
  type: string
  title: string
  desc?: string
  created_at: number
}

const EVENT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  create: { label: '创建项目', color: '#c4850f' },
  confirm_sent: { label: '发送确认', color: '#c4850f' },
  contract_generated: { label: '生成合同', color: '#c4850f' },
  milestone_complete: { label: '里程碑完成', color: '#16a34a' },
  confirm_approved: { label: '确认通过', color: '#16a34a' },
  change_confirmed: { label: '变更确认', color: '#16a34a' },
  change_proposed: { label: '变更提议', color: '#dc2626' },
  risk_added: { label: '风险预警', color: '#dc2626' },
  confirm_rejected: { label: '确认拒绝', color: '#dc2626' },
  edit: { label: '编辑项目', color: '#8a8a8a' },
  update: { label: '项目更新', color: '#8a8a8a' },
  acceptance: { label: '发起验收', color: '#2563eb' },
  complete: { label: '项目完成', color: '#16a34a' },
}

function getEventConfig(type: string) {
  return EVENT_TYPE_CONFIG[type] || { label: type, color: '#8a8a8a' }
}

function formatEventDate(timestamp: number): { date: string; time: string } {
  const d = new Date(timestamp)
  return {
    date: d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  }
}

export default function EvidencePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const project = id ? getProjectById(id) : null

  const events = useMemo<EvidenceEvent[]>(() => {
    if (!project) return []
    const list: EvidenceEvent[] = []

    // Project creation
    list.push({
      id: `create-${project.id}`,
      type: 'create',
      title: '项目创建',
      desc: `项目「${project.title}」已创建`,
      created_at: project.created_at,
    })

    // Timeline events
    project.timeline.forEach((t) => {
      list.push({
        id: t.id,
        type: t.type,
        title: t.title,
        desc: t.desc,
        created_at: t.created_at,
      })
    })

    // Confirmations
    project.confirmations.forEach((c) => {
      list.push({
        id: c.id,
        type: c.status === 'confirmed' ? 'confirm_approved' : c.status === 'rejected' ? 'confirm_rejected' : 'confirm_sent',
        title: c.title,
        desc: c.content,
        created_at: c.sent_at,
      })
      if (c.confirmed_at) {
        list.push({
          id: `${c.id}-resolved`,
          type: c.status === 'confirmed' ? 'confirm_approved' : 'confirm_rejected',
          title: c.status === 'confirmed' ? '确认已通过' : '确认已拒绝',
          desc: c.reject_reason || '',
          created_at: c.confirmed_at,
        })
      }
    })

    // Changes
    project.changes.forEach((c) => {
      list.push({
        id: c.id,
        type: c.status === 'confirmed' ? 'change_confirmed' : 'change_proposed',
        title: '项目变更',
        desc: c.content,
        created_at: c.created_at,
      })
    })

    // Sort by time desc
    list.sort((a, b) => b.created_at - a.created_at)
    return list
  }, [project])

  const summary = useMemo(() => {
    if (!project) return { total: 0, confirmed: 0, startDate: '-' }
    const total = events.length
    const confirmed = project.confirmations.filter((c) => c.status === 'confirmed').length
    const startDate = new Date(project.created_at).toLocaleDateString('zh-CN')
    return { total, confirmed, startDate }
  }, [project, events])

  if (!project) {
    return (
      <div className="card p-12 text-center">
        <p className="text-body text-[#8a8a8a]">项目不存在</p>
        <button className="btn-primary mt-4" onClick={() => navigate('/app')}>
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button className="icon-btn" onClick={() => navigate(`/app/project/${project.id}`)}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-heading-1">履约证据链</h1>
        <button className="icon-btn" title="指纹验证">
          <Fingerprint size={18} />
        </button>
      </div>

      {/* Summary */}
      <div className="card p-4 mb-5 grid grid-cols-3 gap-4 text-center">
        <div>
          <FileText size={20} className="text-[#8a8a8a] mx-auto mb-1" />
          <div className="text-heading-2 font-semibold text-[#1a1a1a] font-mono">{summary.total}</div>
          <div className="text-caption text-[#8a8a8a]">总记录数</div>
        </div>
        <div>
          <CheckCircle2 size={20} className="text-[#8a8a8a] mx-auto mb-1" />
          <div className="text-heading-2 font-semibold text-[#1a1a1a] font-mono">{summary.confirmed}</div>
          <div className="text-caption text-[#8a8a8a]">确认次数</div>
        </div>
        <div>
          <Clock size={20} className="text-[#8a8a8a] mx-auto mb-1" />
          <div className="text-heading-2 font-semibold text-[#1a1a1a] font-mono">{summary.startDate}</div>
          <div className="text-caption text-[#8a8a8a]">开始日期</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-5">
        <h2 className="text-heading-2 mb-4">操作记录</h2>
        <div className="flex flex-col">
          {events.map((event, idx) => {
            const config = getEventConfig(event.type)
            const { date, time } = formatEventDate(event.created_at)
            const isLast = idx === events.length - 1

            return (
              <div key={event.id} className="flex">
                {/* Time column */}
                <div className="w-24 shrink-0 text-right pr-4 border-r border-[#e5e0d6] pb-4">
                  <div className="text-xs font-mono text-[#5a5a5a]">{date}</div>
                  <div className="text-[11px] font-mono text-[#a0a0a0]">{time}</div>
                </div>

                {/* Content */}
                <div className="flex-1 pl-4 pb-4 relative">
                  {/* Node */}
                  <div
                    className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full -translate-x-[5px]"
                    style={{ backgroundColor: config.color }}
                  />
                  {!isLast && (
                    <div className="absolute left-0 top-4 bottom-0 w-px bg-[#e5e0d6] -translate-x-[1px]" />
                  )}

                  <div className="compact-card">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: `${config.color}15`,
                          color: config.color,
                          borderColor: `${config.color}30`,
                        }}
                      >
                        {config.label}
                      </span>
                      <span className="text-body-medium text-[#1a1a1a]">{event.title}</span>
                    </div>
                    {event.desc && (
                      <p className="text-body text-[#5a5a5a] mt-1">{event.desc}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {events.length === 0 && (
            <p className="text-caption text-[#8a8a8a] text-center py-8">暂无操作记录</p>
          )}
        </div>
      </div>
    </div>
  )
}
