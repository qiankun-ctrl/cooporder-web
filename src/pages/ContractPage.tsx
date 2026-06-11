import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Printer, Download } from 'lucide-react'
import { getProjectById, getUserProfile } from '../data/storage'
import { generateContractText, amountToChinese } from '../utils/contract'

export default function ContractPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const project = id ? getProjectById(id) : null
  const profile = getUserProfile()

  if (!project || !profile) {
    return (
      <div className="card p-12 text-center">
        <p className="text-body text-[#8a8a8a]">项目不存在或用户档案未完善</p>
        <button className="btn-primary mt-4" onClick={() => navigate('/app')}>
          返回首页
        </button>
      </div>
    )
  }

  const contractText = generateContractText(project, profile)
  const lines = contractText.split('\n')

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const blob = new Blob([contractText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.title || '合同'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button className="icon-btn" onClick={() => navigate(`/app/project/${project.id}`)}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-heading-1">服务合同</h1>
        <div className="flex items-center gap-1">
          <button className="icon-btn" onClick={handlePrint} title="打印">
            <Printer size={18} />
          </button>
          <button className="icon-btn" onClick={handleDownload} title="下载">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="card p-10 md:p-12 max-w-4xl mx-auto bg-white">
        {/* Contract Header */}
        <h2 className="text-display font-semibold tracking-tight text-[#1a1a1a] text-center">
          设计服务合同
        </h2>
        <p className="text-sm text-[#8a8a8a] text-center font-mono mt-2">
          项目编号：{project.id}
        </p>
        <p className="text-sm text-[#8a8a8a] text-center mt-1">
          签订日期：{new Date(project.created_at).toLocaleDateString('zh-CN')}
        </p>
        <div className="border-t border-[#e5e0d6] my-6" />

        {/* Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-caption text-[#8a8a8a] mb-1">甲方（委托方）</div>
            <div className="text-body-medium text-[#1a1a1a]">
              {project.client_name || '【甲方公司/个人名称】'}
            </div>
          </div>
          <div>
            <div className="text-caption text-[#8a8a8a] mb-1">乙方（执行方）</div>
            <div className="text-body-medium text-[#1a1a1a]">
              {profile.user_type === 'company'
                ? profile.company_name || profile.contact_name || '【乙方名称】'
                : profile.name || '【乙方姓名】'}
            </div>
            <div className="text-caption text-[#5a5a5a] mt-1">
              联系方式：{profile.contact_info}
            </div>
          </div>
        </div>

        {/* Contract Body */}
        <div className="document-body space-y-4">
          {lines.map((line, idx) => {
            // Highlight amount section
            if (line.includes('设计费用（含税）') || line.includes('人民币¥')) {
              return (
                <div key={idx} className="bg-[#f5f0e8] border border-[#e5e0d6] rounded-lg p-4 inline-block w-full">
                  <p className="text-2xl font-semibold text-[#1a1a1a]">
                    {amountToChinese(project.price || 0)}
                  </p>
                  <p className="text-sm text-[#8a8a8a] mt-1">
                    (¥{(project.price || 0).toLocaleString()})
                  </p>
                </div>
              )
            }
            if (line.trim() === '') return <div key={idx} className="h-2" />
            if (line.match(/^第?[一二三四五六七八九十]+[、.\s]/)) {
              return (
                <h3 key={idx} className="text-body-medium text-[#1a1a1a] font-semibold mt-4">
                  {line}
                </h3>
              )
            }
            return <p key={idx}>{line}</p>
          })}
        </div>

        {/* Signature Area */}
        <div className="mt-12 grid grid-cols-2 gap-10">
          <div>
            <div className="text-body-medium text-[#1a1a1a] mb-8">
              甲方（签章）：
            </div>
            <div className="border-b border-[#1a1a1a] h-8 mb-2" />
            <div className="text-caption text-[#8a8a8a]">
              日期：____年____月____日
            </div>
          </div>
          <div>
            <div className="text-body-medium text-[#1a1a1a] mb-8">
              乙方（签章）：
            </div>
            <div className="border-b border-[#1a1a1a] h-8 mb-2" />
            <div className="text-caption text-[#8a8a8a]">
              日期：____年____月____日
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-sm text-[#a0a0a0] text-center">
          本合同由合作单平台生成，仅供甲乙双方参考使用
        </div>
      </div>
    </div>
  )
}
