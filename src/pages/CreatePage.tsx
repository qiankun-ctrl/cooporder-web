import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Sparkles,
  Edit3,
  Check,
  Plus,
  Trash2,
} from 'lucide-react'
import { parseNaturalLanguage, getMissingFields } from '../utils/ai-parser'
import { createProjectFromParsed, createProject, addMilestone } from '../utils/project'
import type { ParsedProject, PaymentMethod } from '../types'
import { PAYMENT_METHOD_LABELS } from '../types'

type CreateMode = 'ai' | 'manual'

const quickChips = [
  '帮我设计一个品牌LOGO，5000元，3个方案，7天交付',
  '电商详情页设计，8000元，2个方案，15天',
  '海报设计，1500元，1个方案，3天急单',
]

const paymentOptions: { value: PaymentMethod; label: string }[] = [
  { value: 'full', label: PAYMENT_METHOD_LABELS.full },
  { value: 'half', label: PAYMENT_METHOD_LABELS.half },
  { value: 'thirds', label: PAYMENT_METHOD_LABELS.thirds },
  { value: 'post', label: PAYMENT_METHOD_LABELS.post },
]

export default function CreatePage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<CreateMode>('ai')
  const [aiInput, setAiInput] = useState('')
  const [parsed, setParsed] = useState<ParsedProject | null>(null)
  const [parsing, setParsing] = useState(false)

  // Manual form state
  const [title, setTitle] = useState('')
  const [clientName, setClientName] = useState('')
  const [price, setPrice] = useState('')
  const [deadline, setDeadline] = useState('')
  const [conceptCount, setConceptCount] = useState('')
  const [size, setSize] = useState('')
  const [usage, setUsage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('half')
  const [revisionLimit, setRevisionLimit] = useState('3')
  const [acceptanceRule, setAcceptanceRule] = useState('')
  const [milestones, setMilestones] = useState<{ name: string; amount?: number }[]>([])
  const [newMsName, setNewMsName] = useState('')
  const [newMsAmount, setNewMsAmount] = useState('')

  const handleParse = () => {
    if (!aiInput.trim()) return
    setParsing(true)
    setTimeout(() => {
      const result = parseNaturalLanguage(aiInput)
      setParsed(result)
      setParsing(false)
    }, 600)
  }

  const handleCreateFromParsed = () => {
    if (!parsed) return
    const project = createProjectFromParsed(parsed, aiInput)
    navigate(`/app/project/${project.id}`)
  }

  const handleManualCreate = (asDraft: boolean) => {
    const project = createProject({
      title: title.trim() || '未命名项目',
      client_name: clientName.trim() || undefined,
      price: parseFloat(price) || 0,
      deadline: deadline.trim() || undefined,
      concept_count: parseInt(conceptCount, 10) || undefined,
      size: size.trim() || undefined,
      usage: usage.trim() || undefined,
      payment_method: paymentMethod,
      revision_limit: parseInt(revisionLimit, 10) || 3,
      acceptance_rule: acceptanceRule.trim() || undefined,
      status: asDraft ? 'draft' : 'in_progress',
    })

    milestones.forEach((ms) => {
      addMilestone(project.id, ms.name, ms.amount)
    })

    navigate(`/app/project/${project.id}`)
  }

  const addManualMilestone = () => {
    if (!newMsName.trim()) return
    setMilestones((prev) => [
      ...prev,
      { name: newMsName.trim(), amount: newMsAmount ? parseFloat(newMsAmount) : undefined },
    ])
    setNewMsName('')
    setNewMsAmount('')
  }

  const removeManualMilestone = (idx: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== idx))
  }

  const missingFields = parsed ? getMissingFields(parsed) : []

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button className="icon-btn" onClick={() => navigate('/app')}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-heading-1">新建合作</h1>
      </div>

      {/* Mode Switcher */}
      <div className="segmented-control mb-6">
        <button
          className={`segmented-control-item ${mode === 'ai' ? 'active' : ''}`}
          onClick={() => setMode('ai')}
        >
          <Sparkles size={16} />
          智能创建
        </button>
        <button
          className={`segmented-control-item ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => setMode('manual')}
        >
          <Edit3 size={16} />
          手动填写
        </button>
      </div>

      {mode === 'ai' ? (
        <div>
          {/* AI Description */}
          <div className="compact-card mb-4">
            <p className="text-body text-[#5a5a5a]">
              用自然语言描述您的设计需求，AI 将自动提取关键信息并创建项目。
            </p>
          </div>

          <textarea
            className="textarea card p-5 min-h-[140px] mb-4"
            placeholder="例如：帮我设计一个品牌LOGO，预算5000元，需要3个方案，7天内交付..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
          />

          {/* Quick Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickChips.map((chip) => (
              <button
                key={chip}
                className="chip"
                onClick={() => setAiInput(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          <button
            className="btn-primary w-full mb-6"
            onClick={handleParse}
            disabled={parsing || !aiInput.trim()}
          >
            {parsing ? '解析中...' : '开始解析'}
          </button>

          {/* Parse Result */}
          {parsed && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Check size={18} className="text-[#c4850f]" />
                <h2 className="text-heading-2">解析结果</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <ResultField label="项目名称" value={parsed.title} />
                <ResultField label="客户名称" value={parsed.client_name} />
                <ResultField label="金额" value={parsed.price !== undefined ? `¥${parsed.price}` : undefined} />
                <ResultField label="截止日期" value={parsed.deadline} />
                <ResultField label="方案数量" value={parsed.concept_count !== undefined ? `${parsed.concept_count} 个` : undefined} />
                <ResultField label="设计尺寸" value={parsed.size} />
                <ResultField label="使用场景" value={parsed.usage} />
                <ResultField label="付款方式" value={parsed.payment_method ? PAYMENT_METHOD_LABELS[parsed.payment_method] : undefined} />
              </div>

              {missingFields.length > 0 && (
                <div className="bg-[#f5f0e8] rounded-lg p-3 mb-4">
                  <p className="text-caption text-[#8a8a8a] mb-1">以下信息未识别到，创建后可补充：</p>
                  <div className="flex flex-wrap gap-1">
                    {missingFields.map((f) => (
                      <span key={f} className="badge badge-draft">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button className="btn-ghost" onClick={() => setParsed(null)}>
                  重新描述
                </button>
                <button className="btn-primary" onClick={handleCreateFromParsed}>
                  创建项目
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-5 space-y-5">
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-heading-3 mb-3">基本信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-caption text-[#8a8a8a] mb-1 block">项目名称</label>
                <input
                  className="input"
                  placeholder="输入项目名称"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-caption text-[#8a8a8a] mb-1 block">客户名称</label>
                <input
                  className="input"
                  placeholder="输入客户名称"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-caption text-[#8a8a8a] mb-1 block">项目金额</label>
                <input
                  className="input font-mono"
                  placeholder="¥0"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="text-caption text-[#8a8a8a] mb-1 block">截止日期</label>
                <input
                  className="input"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Design Requirements */}
          <div>
            <h3 className="text-heading-3 mb-3">设计需求</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-caption text-[#8a8a8a] mb-1 block">方案数量</label>
                <input
                  className="input"
                  type="number"
                  placeholder="例如：3"
                  value={conceptCount}
                  onChange={(e) => setConceptCount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-caption text-[#8a8a8a] mb-1 block">设计尺寸</label>
                <input
                  className="input"
                  placeholder="例如：1920×1080px"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-caption text-[#8a8a8a] mb-1 block">使用场景</label>
                <input
                  className="input"
                  placeholder="例如：品牌宣传、网站、社交媒体"
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment & Acceptance */}
          <div>
            <h3 className="text-heading-3 mb-3">付款与验收</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-caption text-[#8a8a8a] mb-1 block">付款方式</label>
                <select
                  className="input"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                >
                  {paymentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-caption text-[#8a8a8a] mb-1 block">修改次数限制</label>
                <input
                  className="input"
                  type="number"
                  value={revisionLimit}
                  onChange={(e) => setRevisionLimit(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-caption text-[#8a8a8a] mb-1 block">验收标准</label>
                <textarea
                  className="textarea"
                  placeholder="描述验收标准..."
                  value={acceptanceRule}
                  onChange={(e) => setAcceptanceRule(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Milestones */}
          <div>
            <h3 className="text-heading-3 mb-3">里程碑</h3>
            <div className="flex gap-2 mb-3">
              <input
                className="input flex-1"
                placeholder="里程碑名称"
                value={newMsName}
                onChange={(e) => setNewMsName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addManualMilestone()}
              />
              <input
                className="input w-28 font-mono"
                placeholder="金额"
                type="number"
                value={newMsAmount}
                onChange={(e) => setNewMsAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addManualMilestone()}
              />
              <button className="btn-primary" onClick={addManualMilestone}>
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {milestones.map((ms, idx) => (
                <div key={idx} className="compact-card flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-body-medium text-[#1a1a1a]">{ms.name}</span>
                    {ms.amount !== undefined && (
                      <span className="text-caption text-[#5a5a5a] font-mono">
                        ¥{ms.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button className="icon-btn" onClick={() => removeManualMilestone(idx)}>
                    <Trash2 size={16} className="text-[#dc2626]" />
                  </button>
                </div>
              ))}
              {milestones.length === 0 && (
                <p className="text-caption text-[#8a8a8a] text-center py-2">
                  暂无里程碑，可点击上方添加
                </p>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-[#e5e0d6]">
            <button className="btn-ghost" onClick={() => navigate('/app')}>
              取消
            </button>
            <button className="btn-secondary" onClick={() => handleManualCreate(true)}>
              保存草稿
            </button>
            <button className="btn-primary" onClick={() => handleManualCreate(false)}>
              创建项目
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ResultField({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <div className="text-caption text-[#8a8a8a] mb-0.5">{label}</div>
      <div className={`text-body-medium ${value ? 'text-[#1a1a1a]' : 'text-[#a0a0a0]'}`}>
        {value || '未识别'}
      </div>
    </div>
  )
}
