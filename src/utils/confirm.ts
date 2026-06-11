import type { ConfirmationEvent } from '../types'
import { genId, getProjectById, getProjects, upsertProject } from '../data/storage'

// 生成确认事件 token
function genToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 20 }, () =>
    chars[Math.floor(Math.random() * chars.length)],
  ).join('')
}

// 创建确认事件
export function createConfirmation(
  projectId: string,
  params: {
    type: ConfirmationEvent['type']
    title: string
    content: string
    milestoneId?: string
    changeDetail?: string
    extraFee?: number
    extraDays?: number
  },
): ConfirmationEvent | null {
  const project = getProjectById(projectId)
  if (!project) return null
  const now = Date.now()
  const event: ConfirmationEvent = {
    id: genId(),
    project_id: projectId,
    milestone_id: params.milestoneId,
    type: params.type,
    title: params.title,
    content: params.content,
    change_detail: params.changeDetail,
    extra_fee: params.extraFee,
    extra_days: params.extraDays,
    status: 'pending',
    confirm_token: genToken(),
    sent_at: now,
    snapshot: JSON.stringify({
      project_title: project.title,
      project_price: project.price,
      ...params,
      captured_at: now,
    }),
  }
  project.confirmations.push(event)
  upsertProject(project)
  return event
}

// 通过 token 查找事件
export function getEventByToken(
  token: string,
): { event: ConfirmationEvent; projectTitle: string } | null {
  for (const project of getProjects()) {
    const event = project.confirmations.find((c) => c.confirm_token === token)
    if (event) return { event, projectTitle: project.title }
  }
  return null
}

// 提交客户响应
export function submitClientResponse(
  token: string,
  action: 'confirmed' | 'rejected',
  label: string,
  rejectReason?: string,
): boolean {
  for (const project of getProjects()) {
    const idx = project.confirmations.findIndex((c) => c.confirm_token === token)
    if (idx < 0) continue
    const event = project.confirmations[idx]
    if (event.status !== 'pending') return false
    const now = Date.now()
    project.confirmations[idx] = {
      ...event,
      status: action,
      confirmed_at: now,
      confirmer_label: label,
      reject_reason: rejectReason,
    }
    // 若是里程碑类型，同步标记里程碑状态
    if (action === 'confirmed' && event.milestone_id) {
      const ms = project.milestones.find((m) => m.id === event.milestone_id)
      if (ms) ms.status = 'confirmed'
    }
    upsertProject(project)
    return true
  }
  return false
}
