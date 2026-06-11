import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { getEventByToken, submitClientResponse } from '../utils/confirm'
import { getProjectById } from '../data/storage'
import type { ConfirmationEvent } from '../types'

type ConfirmState = 'pending' | 'confirmed' | 'rejected' | 'invalid'

export default function ConfirmPage() {
  const { token } = useParams<{ token: string }>()
  const [state, setState] = useState<ConfirmState>('pending')
  const [event, setEvent] = useState<ConfirmationEvent | null>(null)
  const [projectTitle, setProjectTitle] = useState('')
  const [label, setLabel] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) {
      setState('invalid')
      return
    }
    const result = getEventByToken(token)
    if (!result) {
      setState('invalid')
      return
    }
    setEvent(result.event)
    setProjectTitle(result.projectTitle)
    if (result.event.status !== 'pending') {
      setState(result.event.status)
    }
  }, [token])

  const handleConfirm = () => {
    if (!token || !label.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      const ok = submitClientResponse(token, 'confirmed', label.trim())
      if (ok) {
        setState('confirmed')
      } else {
        setState('invalid')
      }
      setSubmitting(false)
    }, 400)
  }

  const handleReject = () => {
    if (!token || !label.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      const ok = submitClientResponse(token, 'rejected', label.trim(), rejectReason.trim() || undefined)
      if (ok) {
        setState('rejected')
      } else {
        setState('invalid')
      }
      setSubmitting(false)
    }, 400)
  }

  const getHeader = () => {
    switch (state) {
      case 'confirmed':
        return {
          icon: <CheckCircle2 size={32} className="text-[#16a34a]" />,
          title: '已确认通过',
          subtitle: '感谢您的确认，项目将继续推进',
        }
      case 'rejected':
        return {
          icon: <XCircle size={32} className="text-[#dc2626]" />,
          title: '已拒绝',
          subtitle: '您的反馈已记录，将与对方沟通',
        }
      case 'invalid':
        return {
          icon: <AlertCircle size={32} className="text-[#8a8a8a]" />,
          title: '链接已失效',
          subtitle: '该确认链接已过期或不存在',
        }
      default:
        return {
          icon: <Eye size={32} className="text-[#c4850f]" />,
          title: '项目成果确认',
          subtitle: '请仔细核对以下项目信息并确认',
        }
    }
  }

  const header = getHeader()
  const project = event ? getProjectById(event.project_id) : null

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      <div className="max-w-lg mx-auto px-4 pt-16 pb-12">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-[#c4850f] flex items-center justify-center text-white font-bold text-xs">
              合
            </div>
            <span className="text-lg font-semibold text-[#1a1a1a]">合作单</span>
          </div>
          <p className="text-caption text-[#8a8a8a]">设计项目协作平台</p>
        </div>

        {/* Confirm Card */}
        <div className="card p-6">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">{header.icon}</div>
            <h1 className="text-heading-1">{header.title}</h1>
            <p className="text-caption text-[#8a8a8a] mt-1">{header.subtitle}</p>
          </div>

          {state === 'pending' && event && (
            <>
              {/* Project Info */}
              <div className="compact-card mb-4">
                <div className="text-caption text-[#8a8a8a] mb-1">项目</div>
                <div className="text-body-medium text-[#1a1a1a]">{projectTitle}</div>
                {project && (
                  <div className="text-caption text-[#5a5a5a] font-mono mt-1">
                    ¥{project.price.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Confirm Content */}
              <div className="compact-card mb-5">
                <div className="text-caption text-[#8a8a8a] mb-1">确认内容</div>
                <div className="text-body text-[#1a1a1a]">{event.content}</div>
                {event.change_detail && (
                  <div className="mt-2 p-2 bg-[#f5f0e8] rounded-lg text-caption text-[#5a5a5a]">
                    {event.change_detail}
                  </div>
                )}
                {event.extra_fee !== undefined && event.extra_fee > 0 && (
                  <div className="mt-2 text-caption text-[#dc2626] font-mono">
                    额外费用：¥{event.extra_fee.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Label Input */}
              <div className="mb-4">
                <label className="text-caption text-[#8a8a8a] mb-1 block">
                  您的姓名/公司（用于记录）
                </label>
                <input
                  className="input"
                  placeholder="请输入"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>

              {/* Actions */}
              {!showRejectForm ? (
                <div className="flex gap-2">
                  <button
                    className="btn-danger flex-1"
                    onClick={() => setShowRejectForm(true)}
                    disabled={submitting}
                  >
                    需要修改
                  </button>
                  <button
                    className="btn-primary flex-1"
                    onClick={handleConfirm}
                    disabled={submitting || !label.trim()}
                  >
                    {submitting ? '提交中...' : '确认通过'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    className="textarea"
                    placeholder="请输入修改意见或拒绝原因"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      className="btn-ghost flex-1"
                      onClick={() => {
                        setShowRejectForm(false)
                        setRejectReason('')
                      }}
                    >
                      取消
                    </button>
                    <button
                      className="btn-danger flex-1"
                      onClick={handleReject}
                      disabled={submitting || !label.trim()}
                    >
                      {submitting ? '提交中...' : '提交'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {state === 'confirmed' && (
            <div className="text-center py-4">
              <div className="compact-card inline-block">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#8a8a8a]" />
                  <span className="text-caption text-[#5a5a5a]">
                    确认时间：{event?.confirmed_at ? new Date(event.confirmed_at).toLocaleString('zh-CN') : '-'}
                  </span>
                </div>
                {event?.confirmer_label && (
                  <div className="text-caption text-[#8a8a8a] mt-1">
                    确认人：{event.confirmer_label}
                  </div>
                )}
              </div>
            </div>
          )}

          {state === 'rejected' && (
            <div className="text-center py-4">
              <div className="compact-card inline-block text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-[#8a8a8a]" />
                  <span className="text-caption text-[#5a5a5a]">
                    拒绝时间：{event?.confirmed_at ? new Date(event.confirmed_at).toLocaleString('zh-CN') : '-'}
                  </span>
                </div>
                {event?.confirmer_label && (
                  <div className="text-caption text-[#8a8a8a]">
                    确认人：{event.confirmer_label}
                  </div>
                )}
                {event?.reject_reason && (
                  <div className="mt-2 p-2 bg-[rgba(220,38,38,0.06)] rounded-lg text-caption text-[#5a5a5a]">
                    原因：{event.reject_reason}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-caption text-[#a0a0a0] text-center mt-6">
          合作单 · 保护您的设计权益
        </p>
      </div>
    </div>
  )
}
