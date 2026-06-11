# Contract Preview Page Design

**Route**: `/project/:id/contract`
**Page Component**: `ContractPage`
**Layout**: Centered document, max-width 720px

---

## Purpose

Display an auto-generated design service contract that feels like a formal legal document while maintaining the app's dark aesthetic. The contract is read-only but can be "printed" or shared.

---

## Page Header

- **Left**: Back button (`ChevronLeft` Icon Button) → back to project detail
- **Center**: "服务合同" in `heading-1`
- **Right**: 
  - `Printer` Icon Button → triggers browser print
  - `Download` Icon Button → exports as text/Markdown (optional v2)

---

## Document Container

**Styling**: Document Card (see design.md)
- Background: `surface-1`
- Border: 1px solid `border-default`
- Border-radius: 12px
- Padding: 40px 48px (desktop), 24px (mobile)
- Max-width: 720px, centered
- On mobile: full-width with 16px padding

**Document Typography Overrides**:
- Body text inside document: 15px (slightly larger than app standard), line-height 1.7
- Paragraph spacing: 16px
- Section headings inside document: 16px weight 600, margin-top 24px, margin-bottom 12px
- Chinese text optimized: tracking 0, line-height ≥ 1.7

---

## Contract Content Structure

### Header Block
- **Title**: "设计服务合同" — centered, `display` (32px, weight 600, tracking -0.03em)
- **Subtitle**: "项目编号：{project.id}" — centered, `mono` color `ink-tertiary`
- **Date**: "签订日期：{created_at}" — centered, `caption` color `ink-subtle`
- **Separator**: 1px border `border-default`, margin 24px 0

### Party Block
- **Layout**: 2-column flex, gap 32px
- **Left (Service Provider)**:
  - "乙方（服务方）" in `heading-3`
  - Name: `{UserProfile.name || UserProfile.company_name}`
  - Contact: `{UserProfile.contact_info}`
  - Payment: `{UserProfile.payment_info}`
- **Right (Client)**:
  - "甲方（委托方）" in `heading-3`
  - Name: `{project.client_name || "___________"}` (blank if unknown)
  - Contact: `{project.client_contact || "___________"}`

### Project Scope
- **Section title**: "一、项目内容"
- **Content**:
  - 项目名称：{project.title}
  - 设计内容：{project.usage || "详见双方沟通确认的需求文档"}
  - 交付规格：{project.size || "双方协商确定"}
  - 方案数量：{project.concept_count} 个

### Payment Terms
- **Section title**: "二、费用及支付方式"
- **Content**:
  - 项目总金额：¥{project.price}（人民币 {chinese_amount} 元整）
  - **Chinese Amount Display**: This is visually prominent
    - Large mono text: "伍佰元整"
    - Below: "（¥500）" in `caption` color `ink-subtle`
    - Styling: background `surface-2`, border `border-default`, border-radius 8px, padding 12px 16px, inline-block
  - 付款方式：{payment_method_label}
    - `full` → "甲方应于合同签订后一次性支付全部费用"
    - `half` → "甲方应于合同签订后支付 50% 作为预付款，验收合格后支付剩余 50%"
    - `thirds` → "甲方分三期支付：合同签订后 30%，中期确认后 40%，验收合格后 30%"
    - `post` → "甲方于项目验收合格后一次性支付全部费用"
  - 乙方收款账户：{UserProfile.payment_info}

### Timeline & Milestones
- **Section title**: "三、项目进度"
- **Content**:
  - 项目周期：自合同签订之日起至 {project.deadline} 完成
  - 里程碑列表 (if any):
    - Table format: 序号 | 里程碑名称 | 预计时间 | 关联金额
    - Table styling: no outer border, row borders 1px `border-default`, header background `surface-2`, padding 8px 12px

### Revisions & Acceptance
- **Section title**: "四、修改与验收"
- **Content**:
  - 修改次数：乙方提供不超过 {project.revision_limit} 次免费修改
  - 超出修改：超出次数的修改双方另行协商费用
  - 验收标准：{project.acceptance_rule || "以甲方书面确认为准"}
  - 验收期限：甲方应在收到初稿后 3 个工作日内提出修改意见，逾期未提出视为验收合格

### Copyright
- **Section title**: "五、知识产权"
- **Content**:
  - 最终交付物著作权归甲方所有，乙方保留署名权及作品集展示权
  - 未经乙方同意，甲方不得将中间稿、过程稿用于商业用途
  - 源文件交付以双方约定为准

### Liability & Termination
- **Section title**: "六、违约责任"
- **Content**: Standard clauses (boilerplate text, not data-driven)
  - 甲方逾期付款：每逾期一日按未付金额的 0.5% 支付违约金
  - 乙方逾期交付：每逾期一日按合同总额的 0.5% 支付违约金
  - 不可抗力：双方协商解决

### Signature Block
- **Layout**: 2-column flex, margin-top 48px
- **Left**: "甲方（签章）：" + blank line (border-bottom 1px `border-default`, width 200px)
- **Right**: "乙方（签章）：" + blank line
- **Below each**: "日期：____年____月____日" in `caption` color `ink-subtle`

### Footer
- "本合同一式两份，甲乙双方各执一份，自双方签字盖章之日起生效。"
- Centered, `caption` color `ink-tertiary`, margin-top 32px

---

## Print Styles

When printing (or print preview):
- Background becomes white (`#ffffff`)
- Text becomes black (`#000000`)
- Borders become `#cccccc`
- Document card border-radius becomes 0
- Padding reduces to 24px
- All app chrome (nav, buttons) hidden via `display: none`
- Page margins: 20mm

---

## Interactions

| Action | Result |
|--------|--------|
| Click Print icon | `window.print()` |
| Click Download icon | Generates .md file download (optional) |
| Click back | Returns to project detail |

---

## Data Requirements

```typescript
// Requires: Project + UserProfile
interface ContractData {
  project: Project;
  profile: UserProfile;
  chinese_amount: string; // "伍佰元整"
  payment_method_label: string;
  milestone_table: Array<{
    order: number;
    name: string;
    deadline?: string;
    amount?: number;
  }>;
}
```

---

## Component Inventory

| Component | Source | Notes |
|-----------|--------|-------|
| `ContractDocument` | New | Main document renderer |
| `ChineseAmountBlock` | New | Prominent Chinese numeral display |
| `ContractTable` | New | Milestone table with print styling |
| `SignatureBlock` | New | Two-column signature lines |
| `PrintStyles` | New | CSS print media query block |
