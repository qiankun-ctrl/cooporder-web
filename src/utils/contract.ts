import type { PaymentMethod, Project, UserProfile } from '../types'
import { PAYMENT_METHOD_LABELS } from '../types'

// 金额转中文大写（支持到万级）
export function amountToChinese(amount: number): string {
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const units = ['', '拾', '佰', '仟']

  function convertSection(n: number): string {
    let result = ''
    let zeroFlag = false
    for (let i = 3; i >= 0; i--) {
      const digit = Math.floor(n / Math.pow(10, i)) % 10
      if (digit === 0) {
        if (result.length > 0) zeroFlag = true
      } else {
        if (zeroFlag) {
          result += '零'
          zeroFlag = false
        }
        result += digits[digit] + units[i]
      }
    }
    return result
  }

  const n = Math.round(amount)
  if (n === 0) return '零元整'

  const wan = Math.floor(n / 10000)
  const rest = n % 10000

  let result = ''
  if (wan > 0) {
    result += convertSection(wan) + '万'
    if (rest > 0 && rest < 1000) result += '零'
  }
  if (rest > 0) result += convertSection(rest)
  return result + '元整'
}

// 根据付款方式生成付款条款
function paymentSection(paymentMethod: PaymentMethod | undefined, fee: number): string {
  const fmt = (n: number) => `人民币¥${n}元整（大写：${amountToChinese(n)}）`
  const method = paymentMethod ?? 'half'

  if (method === 'full') {
    return (
      `1、本合同签订后3个工作日内，甲方向乙方一次性支付设计费全额，即${fmt(fee)}。\n` +
      `2、乙方收到全部款项后，项目完成时向甲方交付全套设计电子源文件。`
    )
  }

  if (method === 'half') {
    const half = Math.round(fee / 2)
    const tail = fee - half
    return (
      `1、设计费分2次付清。\n` +
      `2、本合同签订后3个工作日内，甲方向乙方支付合同总费用的50%，即${fmt(half)}，作为项目启动款。\n` +
      `3、设计稿经甲方最终验收合格后，甲方应在2个工作日内支付剩余50%，即${fmt(tail)}。` +
      `乙方收到尾款后向甲方交付全套设计电子版源文件。`
    )
  }

  if (method === 'post') {
    return (
      `1、甲方于设计稿验收通过后3个工作日内，一次性向乙方支付设计费全额，即${fmt(fee)}。\n` +
      `2、乙方在收到全部款项后向甲方交付全套设计电子版源文件。`
    )
  }

  // thirds 分三期
  const first = Math.round(fee * 0.3)
  const second = Math.round(fee * 0.4)
  const third = fee - first - second
  return (
    `1、设计费分3次付清。\n` +
    `2、本合同签订后3个工作日内，甲方向乙方支付合同总费用的30%，即${fmt(first)}，作为项目启动款。\n` +
    `3、设计初稿经甲方验收合格后，甲方应在2个工作日内支付合同总费用的40%，即${fmt(second)}。` +
    `乙方收到该款项后1个工作日内，向甲方交付设计电子版源文件。\n` +
    `4、甲方收到设计电子版源文件后，向乙方支付合同总费用的剩余30%，即${fmt(third)}。`
  )
}

// 生成完整合同文本
export function generateContractText(project: Project, profile: UserProfile): string {
  const clientName = project.client_name || '【甲方公司/个人名称】'

  const partyB =
    profile.user_type === 'company'
      ? profile.company_name || profile.contact_name || '【乙方名称】'
      : profile.name || '【乙方姓名】'

  const fee = project.price || 0
  const feeStr = `人民币¥${fee}元整（大写：${amountToChinese(fee)}）`
  const planCount = project.concept_count ?? '__'
  const deadline = project.deadline || '【待定】'
  const revisionLimit = project.revision_limit ?? 3
  const usageParts = [project.usage, project.size].filter(Boolean).join('；')
  const designTitle = project.title || '设计项目'
  const paymentLabel = PAYMENT_METHOD_LABELS[project.payment_method ?? 'half']

  const partyBInfo =
    profile.user_type === 'company'
      ? [
          `公司名称：${profile.company_name || ''}`,
          `联系人：${profile.contact_name || ''}`,
          `联系方式：${profile.contact_info}`,
        ].join('\n')
      : `姓名：${profile.name || ''}\n联系方式：${profile.contact_info}`

  return `${designTitle}合同

甲方（委托方）：${clientName}
乙方（执行方）：${partyB}

根据《中华人民共和国民法典》及国家有关法规规定，就甲方委托乙方设计${designTitle}事宜，经甲乙双方协商一致，签订本合同，共同遵守。

一、设计内容及方案数
1、设计内容：${designTitle}${usageParts ? `（${usageParts}）` : ''}。

2、乙方提供 ${planCount} 个设计方案备选，直至甲方满意为止。

二、设计周期
1、乙方应在合同签订后 ${deadline} 内完成设计初稿并提交甲方。甲方需在7个工作日内验收，因甲方内部原因推迟验收的，与乙方无关，甲方不得以此推迟付款进度；若甲方验收后不满意，乙方修改或重新创作直到甲方通过为止。

三、设计费用
设计费用（含税）：${feeStr}。

四、付款方式
转账方式：${paymentLabel}

${paymentSection(project.payment_method, fee)}

五、关于版权
1、本合同版权约定以《中华人民共和国著作权法》、《商标法》及其实施条例为依据。

2、甲方支付完毕全部费用后，最终设计稿的一切版权转移至甲方所有。乙方在设计过程中产生的非最终稿件及其设计理念版权归乙方所有，甲方不得以任何方式进行出售、挪用或篡改。

3、本合同项下设计成果的著作权（含复制权、修改权、信息网络传播权、商业使用权等全部权项）在甲方支付完全部合同款项前，独家归乙方所有。甲方在支付各阶段约定款项后，仅享有对应阶段设计成果的临时使用权，不得用于商业推广或向第三方披露。

4、甲方按合同约定支付完全部设计费用后，本合同项下设计成果的著作权自动转移至甲方，乙方仅保留署名权（若双方另有约定除外）。

六、关于初稿提供
1、所有稿件通过互联网提供（如需实体寄送，费用由甲方自付），乙方收到启动款后开始设计工作。

2、提供初稿后，甲方单方面取消设计任务，乙方不退还任何已收费用，版权及使用权仍归乙方所有。

3、如乙方单方面取消设计任务，乙方无条件返还本项目所有已收费用。

七、关于稿件修订及验收标准
1、乙方免费提供最多 ${revisionLimit} 次修改（因版权/商标注册问题引起的修改不计入次数），后续每次修改需额外支付500元/次，确认修改后甲方即支付修改费用。

2、修改周期视复杂程度而定，最多不超过3个工作日。

3、甲方收到稿件后，如在7日内未提出修改请求，视为甲方已确认该设计稿为最终版本，项目完成。

4、验收标准：甲方对乙方提交的初稿或修改稿作出书面确认（包括但不限于邮件、电话、微信确认）的，视为验收通过。

八、关于最终稿的提供
1、设计方案经甲方确定后，乙方向甲方提供AI及PSD格式电子文件各一份。

2、乙方收到甲方全部款项后，设计成果的知识产权与使用权自动转移甲方，乙方不得以任何方式出售或挪用。

九、双方的权利与义务
9.1 甲方的权利、义务：
（1）甲方有权对乙方设计提出建议和思路；
（2）甲方有权提出合理修改意见，乙方按合理意见修改；
（3）甲方有义务按合同约定支付设计费用；
（4）甲方有义务提供与本设计项目有关的企业资料。

9.2 乙方的权利、义务：
（1）乙方有权要求甲方提供企业资料供设计参考；
（2）乙方有义务按合同要求进行作品设计；
（3）乙方有义务按合同约定按时交付设计作品；
（4）乙方有义务合理安排设计工作进度。

十、合同生效
1、甲乙双方如因履行本合同发生纠纷，应友好协商解决；协商不成，任何一方均可向原告所在地法院提起诉讼。

2、本合同由甲乙双方签字盖章后生效，以双方最终签字日期为准。

3、本合同一式两份，甲乙双方各持一份，具有同等法律效力。


乙方信息：
${partyBInfo}
收款方式：${profile.payment_info}


甲方（盖章）：_____________________    乙方（盖章）：_____________________
甲方代表签名：____________________    乙方代表签名：____________________
电话：____________________________    电话：${profile.contact_info}
支付账号：________________________    收款账号：${profile.payment_info}
日期：____年____月____日              日期：____年____月____日`
}
