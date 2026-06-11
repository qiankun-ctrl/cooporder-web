import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket } from 'lucide-react'
import { saveUserProfile } from '../data/storage'
import type { UserType } from '../types'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [userType, setUserType] = useState<UserType>('individual')
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [paymentInfo, setPaymentInfo] = useState('')

  const handleSubmit = () => {
    if (!contactInfo.trim()) {
      alert('请填写联系方式')
      return
    }

    const profile = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      user_type: userType,
      name: name.trim() || undefined,
      company_name: userType === 'company' ? companyName.trim() || undefined : undefined,
      contact_name: userType === 'company' ? contactName.trim() || undefined : undefined,
      contact_info: contactInfo.trim(),
      payment_info: paymentInfo.trim(),
      created_at: Date.now(),
    }

    saveUserProfile(profile)
    navigate('/app')
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      <div className="max-w-md mx-auto px-4 pt-20 pb-12">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-[#c4850f] flex items-center justify-center text-white font-bold text-2xl mx-auto">
            合
          </div>
          <h1 className="text-3xl font-semibold text-[#1a1a1a] mt-4 tracking-tight">
            合作单
          </h1>
          <p className="text-sm text-[#8a8a8a] mt-2">
            管理设计项目，保护知识产权
          </p>
        </div>

        {/* Onboarding Card */}
        <div className="card p-6">
          <h2 className="text-heading-2 text-center mb-6">完善您的信息</h2>

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
              <label className="text-caption text-[#8a8a8a] mb-1 block">
                联系方式 <span className="text-[#dc2626]">*</span>
              </label>
              <input
                className="input"
                placeholder="手机号 / 微信号 / 邮箱"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </div>

            <div>
              <label className="text-caption text-[#8a8a8a] mb-1 block">收款账户</label>
              <textarea
                className="textarea"
                placeholder="银行卡号 / 支付宝 / 微信支付等"
                value={paymentInfo}
                onChange={(e) => setPaymentInfo(e.target.value)}
              />
            </div>
          </div>

          <button
            className="btn-primary w-full mt-6"
            onClick={handleSubmit}
          >
            <Rocket size={16} />
            开始使用
          </button>
        </div>
      </div>
    </div>
  )
}
