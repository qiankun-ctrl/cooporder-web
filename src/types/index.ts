// 用户类型
export type UserType = 'individual' | 'company'

// 项目状态
export type ProjectStatus = 'draft' | 'pending' | 'in_progress' | 'acceptance' | 'completed'

// 变更状态
export type ChangeStatus = 'pending' | 'confirmed' | 'rejected'

// 里程碑
export interface Milestone {
  id: string
  project_id: string
  name: string
  order: number
  linked_amount?: number
  status: 'pending' | 'confirmed'
  created_at: number
}

// 确认事件
export interface ConfirmationEvent {
  id: string
  project_id: string
  milestone_id?: string
  type: 'milestone' | 'change' | 'final'
  title: string
  content: string
  change_detail?: string
  extra_fee?: number
  extra_days?: number
  status: 'pending' | 'confirmed' | 'rejected'
  confirm_token: string
  sent_at: number
  confirmed_at?: number
  confirmer_label?: string
  reject_reason?: string
  snapshot?: string
}

// 项目变更
export interface ProjectChange {
  id: string
  content: string
  status: ChangeStatus
  created_at: number
  fee?: number
}

// 时间线事件
export interface TimelineEvent {
  id: string
  type: 'create' | 'update' | 'change' | 'acceptance' | 'complete' | 'milestone' | 'edit'
  title: string
  desc?: string
  created_at: number
}

// 用户档案
export interface UserProfile {
  id: string
  user_type: UserType
  name?: string
  company_name?: string
  contact_name?: string
  contact_info: string
  payment_info: string
  created_at: number
}

// 付款方式
export type PaymentMethod = 'full' | 'half' | 'thirds' | 'post'

// 项目
export interface Project {
  id: string
  title: string
  client_name?: string
  price: number
  deadline?: string
  concept_count?: number
  size?: string
  usage?: string
  payment_method?: PaymentMethod
  revision_limit: number
  revision_used: number
  acceptance_rule?: string
  status: ProjectStatus
  risks: string[]
  changes: ProjectChange[]
  timeline: TimelineEvent[]
  milestones: Milestone[]
  confirmations: ConfirmationEvent[]
  acceptance_started_at?: number
  created_at: number
  raw_input?: string
  template_uploaded?: boolean
  feedback_file_name?: string
}

// 状态标签和颜色映射
export const STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: '草稿',
  pending: '待确认',
  in_progress: '进行中',
  acceptance: '待验收',
  completed: '已完成',
}

// 付款方式标签
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  full: '全款预付',
  half: '预付50% + 尾款',
  thirds: '分三期付款',
  post: '验收后付款',
}

// 状态颜色样式映射
export const STATUS_COLORS: Record<ProjectStatus, string> = {
  draft: 'text-ink-subtle bg-surface-2 border-border-default',
  pending: 'text-status-pending bg-status-pending/10 border-status-pending/25',
  in_progress: 'text-status-inprogress bg-accent/10 border-accent/25',
  acceptance: 'text-status-acceptance bg-status-acceptance/10 border-status-acceptance/25',
  completed: 'text-status-success bg-status-success/10 border-status-success/25',
}

// ==== AI 解析相关类型
export interface ParsedProject {
  title?: string
  price?: number
  deadline?: string
  concept_count?: number
  size?: string
  usage?: string
  payment_method?: PaymentMethod
  client_payment?: string
  client_name?: string
  revision_limit?: number
  acceptance_rule?: string
}

export type RequiredField = keyof ParsedProject

// 必填字段列表
export const REQUIRED_FIELDS: RequiredField[] = ['title', 'price', 'deadline', 'concept_count']

// 客户付款方式
export type ClientPayment = 'prepay' | 'half' | 'postpay' | 'full'

// 字段缺失提示信息
export const RISK_MESSAGES: Record<RequiredField, string> = {
  title: '项目名称为空，建议填写明确的设计需求描述',
  price: '未填写金额，建议补充报价信息',
  deadline: '未设置截止日期，建议与客户确认交付时间',
  concept_count: '方案数量未指定',
  size: '未填写设计尺寸',
  usage: '未说明使用场景',
  payment_method: '未选择付款方式',
  client_payment: '未填写客户付款条件',
  client_name: '未填写客户名称',
  revision_limit: '未设置修改次数限制',
  acceptance_rule: '未填写验收标准',
}
