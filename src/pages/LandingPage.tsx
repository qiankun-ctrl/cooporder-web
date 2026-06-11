import { useNavigate } from 'react-router-dom'
import { FileText, Share2, Shield, Scale, Eye, Wallet } from 'lucide-react'

/* ============ CSS Keyframes (injected via style tag) ============ */
const landingKeyframes = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.animate-fade-in-up {
  animation: fadeInUp 600ms ease-out forwards;
  opacity: 0;
}
.animate-scale-in {
  animation: scaleIn 500ms ease-out forwards;
  opacity: 0;
}
.animate-delay-1 { animation-delay: 0.1s; }
.animate-delay-2 { animation-delay: 0.2s; }
.animate-delay-3 { animation-delay: 0.3s; }
.animate-delay-4 { animation-delay: 0.4s; }
.animate-delay-5 { animation-delay: 0.5s; }
`

export default function LandingPage() {
  const navigate = useNavigate()

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans">
      <style>{landingKeyframes}</style>

      {/* ============ Navigation ============ */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-border-default">
        <div className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2.5">
            <img
              src="/logo-mark.jpg"
              alt="合作单"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-lg font-semibold text-ink">合作单</span>
          </div>

          {/* Center: Nav links (md+) */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              功能
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              工作流程
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              定价
            </button>
          </div>

          {/* Right: Auth buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app')}
              className="btn-ghost text-sm"
            >
              登录
            </button>
            <button
              onClick={() => navigate('/app')}
              className="btn-primary text-sm"
            >
              免费开始
            </button>
          </div>
        </div>
      </nav>

      {/* ============ Hero Section ============ */}
      <section className="relative min-h-[calc(100svh-56px)] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        {/* Full-bleed background */}
        <img
          src="/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="animate-fade-in-up inline-block text-xs text-white/70 uppercase tracking-widest mb-4">
            为自由设计师打造
          </span>
          <h1 className="animate-fade-in-up animate-delay-1 text-5xl md:text-6xl font-bold text-white tracking-tight">
            让每一次设计合作
          </h1>
          <h1 className="animate-fade-in-up animate-delay-2 text-5xl md:text-6xl font-bold text-white tracking-tight mt-1">
            都有据可依
          </h1>
          <p className="animate-fade-in-up animate-delay-3 text-lg text-white/80 mt-4">
            智能合同 · 里程碑追踪 · 证据保全
          </p>
          <div className="animate-fade-in-up animate-delay-4 flex gap-3 mt-8 justify-center">
            <button
              onClick={() => navigate('/app')}
              className="bg-accent hover:bg-accent-hover text-white font-medium text-base px-6 py-3 rounded-lg transition-colors"
            >
              免费开始使用
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="bg-white/10 hover:bg-white/20 text-white font-medium text-base px-6 py-3 rounded-lg border border-white/20 transition-colors"
            >
              了解更多
            </button>
          </div>
        </div>
      </section>

      {/* ============ Features Section ============ */}
      <section id="features" className="py-20 px-4 md:px-8 bg-canvas">
        <div className="text-center mb-12">
          <h2 className="text-heading-1 font-semibold text-ink">
            保护你的创意劳动
          </h2>
          <p className="text-body text-ink-muted mt-2">
            从项目启动到交付收款，全程留痕
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="card card-hover overflow-hidden">
            <img
              src="/feature-dashboard.jpg"
              alt="智能项目管理"
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-5">
              <h3 className="text-heading-3 font-semibold mt-1">
                智能项目管理
              </h3>
              <p className="text-body text-ink-muted mt-2">
                创建项目、设定里程碑、追踪进度，一目了然
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card card-hover overflow-hidden">
            <img
              src="/feature-contract.jpg"
              alt="自动生成合同"
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-5">
              <h3 className="text-heading-3 font-semibold mt-1">
                自动生成合同
              </h3>
              <p className="text-body text-ink-muted mt-2">
                根据项目信息一键生成专业设计服务合同，金额自动转大写
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card card-hover overflow-hidden">
            <img
              src="/feature-timeline.jpg"
              alt="完整证据链"
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-5">
              <h3 className="text-heading-3 font-semibold mt-1">
                完整证据链
              </h3>
              <p className="text-body text-ink-muted mt-2">
                每一次确认、每一个变更都有记录，保护你的知识产权
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Workflow Section ============ */}
      <section id="workflow" className="py-20 px-4 md:px-8 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-heading-1 font-semibold text-ink">
            三步开始保护
          </h2>
          <p className="text-body text-ink-muted mt-2">
            简单、快速、专业
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto relative">
          {/* Dashed connector line (md+) */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px border-t-2 border-dashed border-border-default" />

          {/* Step 1 */}
          <div className="flex-1 text-center relative z-10">
            <div className="animate-scale-in text-4xl font-bold text-accent/30">
              01
            </div>
            <div className="mt-3 flex justify-center">
              <FileText size={32} className="text-accent" />
            </div>
            <h3 className="text-heading-3 font-semibold mt-2">创建项目</h3>
            <p className="text-body text-ink-muted mt-2">
              填写项目信息，AI 自动提取关键条款
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex-1 text-center relative z-10">
            <div className="animate-scale-in text-4xl font-bold text-accent/30">
              02
            </div>
            <div className="mt-3 flex justify-center">
              <Share2 size={32} className="text-accent" />
            </div>
            <h3 className="text-heading-3 font-semibold mt-2">发送确认</h3>
            <p className="text-body text-ink-muted mt-2">
              生成确认链接发送给客户，电子留痕
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex-1 text-center relative z-10">
            <div className="animate-scale-in text-4xl font-bold text-accent/30">
              03
            </div>
            <div className="mt-3 flex justify-center">
              <Shield size={32} className="text-accent" />
            </div>
            <h3 className="text-heading-3 font-semibold mt-2">安全交付</h3>
            <p className="text-body text-ink-muted mt-2">
              里程碑确认、合同归档、证据链保全
            </p>
          </div>
        </div>
      </section>

      {/* ============ Trust Section ============ */}
      <section className="py-20 px-4 md:px-8 bg-canvas">
        <h2 className="text-heading-1 font-semibold text-center text-ink">
          为什么设计师选择合作单
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10">
          {/* Item 1 */}
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <Scale size={28} className="text-accent" />
            </div>
            <h3 className="text-heading-3 font-semibold">法律保护</h3>
            <p className="text-body text-ink-muted mt-2">
              自动生成具有法律效力的服务合同
            </p>
          </div>

          {/* Item 2 */}
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <Eye size={28} className="text-accent" />
            </div>
            <h3 className="text-heading-3 font-semibold">透明协作</h3>
            <p className="text-body text-ink-muted mt-2">
              客户实时查看项目进度和变更记录
            </p>
          </div>

          {/* Item 3 */}
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <Wallet size={28} className="text-accent" />
            </div>
            <h3 className="text-heading-3 font-semibold">收入保障</h3>
            <p className="text-body text-ink-muted mt-2">
              里程碑付款，避免尾款拖欠
            </p>
          </div>
        </div>
      </section>

      {/* ============ CTA Section ============ */}
      <section id="pricing" className="py-20 px-4 bg-accent">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white">
            开始保护你的设计项目
          </h2>
          <p className="text-lg text-white/80 mt-2">
            免费使用，无需信用卡
          </p>
          <button
            onClick={() => navigate('/app')}
            className="mt-6 bg-white text-accent font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            立即开始
          </button>
        </div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="py-10 px-4 bg-white border-t border-border-default">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-2.5">
            <img
              src="/logo-mark.jpg"
              alt="合作单"
              className="w-6 h-6 rounded-md object-cover"
            />
            <span className="text-sm font-medium text-ink">合作单</span>
            <span className="text-sm text-ink-subtle ml-1">
              © 2024 CoopOrder
            </span>
          </div>

          {/* Center */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              功能
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              定价
            </button>
            <span className="text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer">
              关于
            </span>
            <span className="text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer">
              联系
            </span>
          </div>

          {/* Right */}
          <div className="text-sm text-ink-subtle">
            Made for designers
          </div>
        </div>
      </footer>
    </div>
  )
}
