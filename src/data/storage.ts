import type { Project, UserProfile } from '../types'

const PROJECTS_KEY = 'coop_projects'
const PROFILE_KEY = 'coop_profile'

// 生成唯一ID
export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// ==== UserProfile ====
export function getUserProfile(): UserProfile | null {
  try {
    const data = localStorage.getItem(PROFILE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function hasProfile(): boolean {
  return !!getUserProfile()
}

export function getOrCreateProfile(): UserProfile {
  const existing = getUserProfile()
  if (existing) return existing
  const newProfile: UserProfile = {
    id: genId(),
    user_type: 'individual',
    name: '',
    contact_info: '',
    payment_info: '',
    created_at: Date.now(),
  }
  saveUserProfile(newProfile)
  return newProfile
}

export function hasOnboarded(): boolean {
  return !!getUserProfile()
}

// ==== Projects ====
export function getProjects(): Project[] {
  try {
    const data = localStorage.getItem(PROJECTS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getProjectById(id: string): Project | null {
  return getProjects().find((p) => p.id === id) || null
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function upsertProject(project: Project): Project {
  const projects = getProjects()
  const idx = projects.findIndex((p) => p.id === project.id)
  if (idx >= 0) {
    projects[idx] = project
  } else {
    projects.unshift(project)
  }
  saveProjects(projects)
  return project
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id)
  saveProjects(projects)
}

// 初始化示例数据
export function seedDemoData(): void {
  if (getProjects().length > 0) return
  const now = Date.now()
  const demoProjects: Project[] = [
    {
      id: 'demo1',
      title: '品牌LOGO设计',
      client_name: 'ABC科技有限公司',
      price: 5000,
      deadline: '2024-02-28',
      concept_count: 3,
      size: '矢量文件',
      usage: '品牌宣传、网站、名片',
      payment_method: 'half',
      revision_limit: 3,
      revision_used: 1,
      acceptance_rule: '以甲方书面确认为准',
      status: 'in_progress',
      risks: ['deadline 临近，建议提前准备初稿'],
      changes: [],
      timeline: [
        {
          id: 't1',
          type: 'create',
          title: '项目创建',
          created_at: now - 7 * 24 * 60 * 60 * 1000,
        },
        {
          id: 't2',
          type: 'update',
          title: '提交初稿供审核',
          created_at: now - 3 * 24 * 60 * 60 * 1000,
        },
      ],
      milestones: [
        {
          id: 'm1',
          project_id: 'demo1',
          name: '初稿交付',
          order: 0,
          linked_amount: 2500,
          status: 'pending',
          created_at: now - 7 * 24 * 60 * 60 * 1000,
        },
        {
          id: 'm2',
          project_id: 'demo1',
          name: '修改与终稿',
          order: 1,
          linked_amount: 2500,
          status: 'pending',
          created_at: now - 7 * 24 * 60 * 60 * 1000,
        },
      ],
      confirmations: [],
      created_at: now - 7 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'demo2',
      title: '电商详情页设计',
      client_name: '时尚生活旗舰店',
      price: 8000,
      deadline: '2024-03-15',
      concept_count: 2,
      size: '750x1000px (5屏)',
      usage: '淘宝/天猫店铺',
      payment_method: 'full',
      revision_limit: 3,
      revision_used: 0,
      acceptance_rule: '以甲方需求确认单为准',
      status: 'pending',
      risks: [],
      changes: [],
      timeline: [
        {
          id: 't3',
          type: 'create',
          title: '项目创建',
          created_at: now - 2 * 24 * 60 * 60 * 1000,
        },
      ],
      milestones: [
        {
          id: 'm3',
          project_id: 'demo2',
          name: '首屏设计',
          order: 0,
          status: 'pending',
          created_at: now - 2 * 24 * 60 * 60 * 1000,
        },
        {
          id: 'm4',
          project_id: 'demo2',
          name: '完整详情页',
          order: 1,
          status: 'pending',
          created_at: now - 2 * 24 * 60 * 60 * 1000,
        },
      ],
      confirmations: [],
      created_at: now - 2 * 24 * 60 * 60 * 1000,
    },
  ]
  saveProjects(demoProjects)
}
