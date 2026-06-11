import type {
  ChangeStatus,
  Milestone,
  ParsedProject,
  PaymentMethod,
  Project,
  ProjectChange,
  ProjectStatus,
  TimelineEvent,
} from '../types'
import {
  deleteProject,
  genId,
  getProjectById,
  getProjects,
  saveProjects,
  upsertProject,
} from '../data/storage'

const ACCEPTANCE_MS = 72 * 60 * 60 * 1000

// 创建时间线事件
export function createTimeline(
  type: TimelineEvent['type'],
  title: string,
  desc?: string,
): TimelineEvent {
  return {
    id: genId(),
    type,
    title,
    desc,
    created_at: Date.now(),
  }
}

// 创建新项目
export function createProject(input: {
  title: string
  client_name?: string
  price?: number
  deadline?: string
  concept_count?: number
  size?: string
  usage?: string
  payment_method?: PaymentMethod
  revision_limit?: number
  acceptance_rule?: string
  status?: ProjectStatus
  raw_input?: string
  risks?: string[]
}): Project {
  const now = Date.now()
  const project: Project = {
    id: genId(),
    title: input.title || '未命名项目',
    client_name: input.client_name,
    price: input.price ?? 0,
    deadline: input.deadline,
    concept_count: input.concept_count,
    size: input.size,
    usage: input.usage,
    payment_method: input.payment_method,
    revision_limit: input.revision_limit ?? 3,
    revision_used: 0,
    acceptance_rule: input.acceptance_rule,
    status: input.status ?? 'in_progress',
    risks: input.risks ?? [],
    changes: [],
    timeline: [
      createTimeline('create', '创建合作单', input.raw_input),
    ],
    milestones: [],
    confirmations: [],
    created_at: now,
    raw_input: input.raw_input,
  }
  upsertProject(project)
  return project
}

// 添加里程碑
export function addMilestone(
  projectId: string,
  name: string,
  linkedAmount?: number,
): Milestone | null {
  const project = getProjectById(projectId)
  if (!project) return null
  const ms: Milestone = {
    id: genId(),
    project_id: projectId,
    name: name.trim(),
    order: project.milestones.length,
    linked_amount: linkedAmount,
    status: 'pending',
    created_at: Date.now(),
  }
  project.milestones.push(ms)
  project.timeline.unshift(createTimeline('milestone', '新增里程碑', name))
  upsertProject(project)
  return ms
}

// 删除里程碑
export function deleteMilestone(
  projectId: string,
  milestoneId: string,
): Project | null {
  const project = getProjectById(projectId)
  if (!project) return null
  const target = project.milestones.find((m) => m.id === milestoneId)
  project.milestones = project.milestones.filter((m) => m.id !== milestoneId)
  project.milestones.forEach((m, idx) => {
    m.order = idx
  })
  if (target) {
    project.timeline.unshift(createTimeline('edit', '删除里程碑', target.name))
  }
  upsertProject(project)
  return project
}

// 添加变更
export function addChange(
  projectId: string,
  content: string,
  fee?: number,
): Project | null {
  const project = getProjectById(projectId)
  if (!project) return null
  const change: ProjectChange = {
    id: genId(),
    content,
    status: 'pending',
    created_at: Date.now(),
    fee,
  }
  project.changes.unshift(change)
  project.timeline.unshift(
    createTimeline('change', '新增变更单', content),
  )
  upsertProject(project)
  return project
}

// 更新变更状态
export function updateChangeStatus(
  projectId: string,
  changeId: string,
  status: ChangeStatus,
): Project | null {
  const project = getProjectById(projectId)
  if (!project) return null
  const change = project.changes.find((c) => c.id === changeId)
  if (!change) return null
  const original = change.status
  change.status = status
  if (status === 'confirmed' && original !== 'confirmed') {
    project.revision_used = Math.min(project.revision_limit, project.revision_used + 1)
  }
  const label =
    status === 'confirmed'
      ? '已确认'
      : status === 'rejected'
        ? '已拒绝'
        : '待确认'
  project.timeline.unshift(createTimeline('update', `变更单${label}`, change.content))
  upsertProject(project)
  return project
}

// 判断是否有待处理变更
export function hasPendingChanges(project: Project): boolean {
  return project.changes.some((c) => c.status === 'pending')
}

// 发起验收
export function startAcceptance(projectId: string): Project | null {
  const project = getProjectById(projectId)
  if (!project || project.status !== 'in_progress') return null
  project.status = 'acceptance'
  project.acceptance_started_at = Date.now()
  project.timeline.unshift(
    createTimeline('acceptance', '发起验收', '72小时未确认将自动完成'),
  )
  upsertProject(project)
  return project
}

// 刷新验收截止日期（超时自动完成）
export function refreshAcceptanceDeadlines(): void {
  const now = Date.now()
  const projects = getProjects()
  let changed = false
  for (const p of projects) {
    if (
      p.status === 'acceptance' &&
      p.acceptance_started_at &&
      now - p.acceptance_started_at >= ACCEPTANCE_MS
    ) {
      p.status = 'completed'
      p.timeline.unshift(
        createTimeline('complete', '验收自动完成', '72小时未确认，已自动完成'),
      )
      changed = true
    }
  }
  if (changed) saveProjects(projects)
}

// 移除项目（别名，避免其他文件的 import 报错）
export { deleteProject }

// 统计数据
export interface ProjectStats {
  total: number
  in_progress: number
  acceptance: number
  completed: number
  pending: number
  draft: number
  total_price: number
}

export function getProjectStats(): ProjectStats {
  const projects = getProjects()
  const stats: ProjectStats = {
    total: projects.length,
    in_progress: 0,
    acceptance: 0,
    completed: 0,
    pending: 0,
    draft: 0,
    total_price: 0,
  }
  for (const p of projects) {
    if (p.status === 'in_progress') stats.in_progress += 1
    else if (p.status === 'acceptance') stats.acceptance += 1
    else if (p.status === 'completed') stats.completed += 1
    else if (p.status === 'pending') stats.pending += 1
    else if (p.status === 'draft') stats.draft += 1
    stats.total_price += p.price ?? 0
  }
  return stats
}

// 格式化状态文本
export function formatStatus(status: Project['status']): string {
  const map: Record<Project['status'], string> = {
    draft: '草稿',
    pending: '待确认',
    in_progress: '进行中',
    acceptance: '待验收',
    completed: '已完成',
  }
  return map[status]
}

// 从解析结果创建项目
export function createProjectFromParsed(
  parsed: ParsedProject,
  rawInput?: string,
): Project {
  return createProject({
    title: parsed.title || '未命名项目',
    client_name: parsed.client_name,
    price: parsed.price ?? 0,
    deadline: parsed.deadline,
    concept_count: parsed.concept_count,
    size: parsed.size,
    usage: parsed.usage,
    payment_method: parsed.payment_method,
    revision_limit: parsed.revision_limit ?? 3,
    acceptance_rule: parsed.acceptance_rule,
    status: 'in_progress',
    raw_input: rawInput,
    risks: [],
  })
}
