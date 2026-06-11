import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  User,
  Save,
  Trash2,
  Download,
  AlertTriangle,
} from 'lucide-react'
import {
  getUserProfile,
  saveUserProfile,
  saveProjects,
  seedDemoData,
} from '../data/storage'
import type { UserType } from '../types'

export default function SettingsPage() {
  const navigate = useNavigate()
  const profile = getUserProfile()

  const [userType, setUserType] = useState<UserType>(profile?.user_type || 'individual')
  const [name, setName] = useState(profile?.name || '')
  const [companyName, setCompanyName] = useState(profile?.company_name || '')
  const [contactName, setContactName] = useState(profile?.contact_name || '')
  const [contactInfo, setContactInfo] = useState(profile?.contact_info || '')
  const [paymentInfo, setPaymentInfo] = useState(profile?.payment_info || '')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSaveProfile = () => {
    const updated = {
      ...(profile || {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        created_at: Date.now(),
      }),
      user_type: userType,
      name: name.trim() || undefined,
      company_name: userType === 'company' ? companyName.trim() || undefined : undefined,
      contact_name: userType === 'company' ? contactName.trim() || undefined : undefined,
      contact_info: contactInfo.trim(),
      payment_info: paymentInfo.trim(),
    }
    saveUserProfile(updated)
    showToast('档案已保存')
  }

  const handleClearProjects = () => {
    if (confirm('确定要清空所有项目吗？此操作不可撤销。')) {
      saveProjects([])
      showToast('所有项目已清空')
    }
  }

  const handleSeedData = () => {
    seedDemoData()
    showToast('示例数据已导入')
  }

  const handleResetAll = () => {
    if (
      confirm('警告：这将清空所有数据并重置应用。此操作不可撤销！') &&
      confirm('再次确认：确定要清空所有数据吗？')
    ) {
      localStorage.removeItem('coop_projects')
      localStorage.removeItem('coop_profile')
      window.location.href = '/onboarding'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button className="icon-btn" onClick={() => navigate('/app')}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-heading-1">设置</h1>
      </div>

      {/* Profile Card */}
      <div className="card p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-[#c4850f]" />
          <h2 className="text-heading-2">个人档案</h2>
        </div>

        <div className="space-y-4">
          {/* User Type */}
          <div>
            <label className="text-caption text-[#8a8a8a] mb-1 block">用户类型</label>
            <div className="segmented-control">
              <button
                className={`segmented-control-item ${userType === 'individual' ? 'active' : ''}`}
                onClick={() => setUserType('individual')}
              >
                个人
              </button>
              <button
                className={`segmented-control-item ${userType === 'company' ? 'active' : ''}`}
                onClick={() => setUserType('company')}
              >
                企业
              </button>
            </div>
          </div>

          {userType === 'individual' ? (
            <div>
              <label className="text-caption text-[#8a8a8a] mb-1 block">姓名</label>
              <input
                className="input"
                placeholder="您的姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          ) : (
            <>
              <div>
                <label className="text-caption text-[#8a8a8a] mb-1 block">公司名称</label>
                <input
                  className="input"
                  placeholder="公司名称"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-caption text-[#8a8a8a] mb-1 block">联系人</label>
                <input
                  className="input"
                  placeholder="联系人姓名"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
            </>
          )}

          <div>
            <label className="text-caption text-[#8a8a8a] mb-1 block">联系方式</label>
            <input
              className="input"
              placeholder="手机号 / 微信号 / 邮箱"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
            />
          </div>

          <div>
            <label className="text-caption text-[#8a8a8a] mb-1 block">收款信息</label>
            <textarea
              className="textarea"
              placeholder="银行卡号 / 支付宝 / 微信支付等收款方式"
              value={paymentInfo}
              onChange={(e) => setPaymentInfo(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <button className="btn-primary" onClick={handleSaveProfile}>
            <Save size={16} />
            保存
          </button>
        </div>
      </div>

      {/* Project Management */}
      <div className="card p-5 mb-5">
        <h2 className="text-heading-2 mb-4">项目数据</h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn-danger" onClick={handleClearProjects}>
            <Trash2 size={16} />
            清空所有项目
          </button>
          <button className="btn-secondary" onClick={handleSeedData}>
            <Download size={16} />
            导入示例数据
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div
        className="card p-5 border-l-4"
        style={{ borderLeftColor: '#dc2626' }}
      >
        <h2 className="text-heading-2 text-[#dc2626] mb-4">危险操作区</h2>
        <button className="btn-danger w-full" onClick={handleResetAll}>
          <AlertTriangle size={16} />
          清空所有数据并重置
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 card p-3 z-50 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
          <span className="text-body-medium text-[#1a1a1a]">{toast}</span>
        </div>
      )}
    </div>
  )
}
