# Create Order Page Design

**Route**: `/create`
**Page Component**: `CreatePage`
**Layout**: Centered content, max-width 720px

---

## Purpose

Create a new cooperation order. Two modes serve different user mindsets:
- **AI Smart Create**: For users who know what they want but don't want to fill forms. Natural language → structured data.
- **Manual Create**: For users who want precise control over every field.

---

## Page Header

- **Left**: Back button (`ChevronLeft` Icon Button) → navigates back
- **Center**: "新建合作" in `heading-1` (24px, weight 600)
- **Below**: Mode switcher (AI / 手动) as a segmented control

### Mode Switcher (Segmented Control)
- **Layout**: Horizontal row, 2 segments, width ~200px, centered
- **Styling**:
  - Container: background `surface-2`, border-radius 8px, padding 4px
  - Active segment: background `surface-3`, text `ink`, font `body-medium`, border-radius 6px
  - Inactive segment: text `ink-subtle`, font `body`
  - Each segment: 36px height, flex center, gap 6px between icon and text
- **Left segment**: `Sparkles` icon + "AI 智能"
- **Right segment**: `Edit3` icon + "手动填写"
- **Default**: AI mode (first-time users prefer speed)

---

## Mode A: AI Smart Create

### 1. Input Area
- **Label**: "描述你的需求" in `heading-3` (15px, weight 600)
- **Sublabel**: "用自然语言描述，AI 会帮你提取关键信息" in `caption` color `ink-subtle`
- **Input**: Large textarea
  - Min-height: 120px
  - Placeholder: "例如：做一个品牌海报，500元，3天交付，需要2个方案，用于线上推广，客户要求先付一半"
  - Font: `body` (14px)
  - Background: `surface-3`
  - Focus: border `accent`, ring `accent-muted`

### 2. Example Chips (Below textarea)
- **Label**: "试试这些例子" in `tiny` color `ink-tertiary`
- **Layout**: Horizontal wrap, gap 8px
- **Chip styling**: background `surface-2`, border `border-default`, border-radius 8px, padding 6px 12px, font `caption` color `ink-subtle`
- **Hover**: border `border-strong`, text `ink-muted`, cursor pointer
- **Click**: Fills textarea with example text
- **Examples**:
  - "LOGO设计，800元，5天，3个初稿，全款预付"
  - "电商详情页，1500元，7天，1个方案，分三期付款"
  - "公众号配图，300元，2天，2个方案，验收后付款"

### 3. Parse Button
- **Position**: Below textarea, right-aligned
- **Styling**: Primary Button "开始解析"
- **Disabled**: Until textarea has content
- **Loading state**: Spinner + "解析中..." (spinner color `accent`, 16px)

### 4. Parsed Result Preview (After parse)
- **Styling**: Standard Card, background `surface-1`, border `border-default`
- **Header**: "解析结果" in `heading-3` + `Check` icon (16px, color `status-success`)
- **Content**: Key-value pairs in a 2-column grid
  - Label: `caption` color `ink-subtle`
  - Value: `body-medium` color `ink`
  - Fields shown: 项目名称, 金额, 截止日期, 方案数量, 尺寸, 用途, 付款方式
- **Edit toggle**: Each field has a small `Edit3` icon button (16px) to switch to manual edit inline
- **Confidence indicator**: Low-confidence fields show a `AlertTriangle` (14px, amber) with tooltip "请核对此项"

### 5. Action Bar (Bottom of preview)
- **Left**: "重新描述" Ghost Button → clears and returns to input
- **Right**: 
  - "保存为草稿" Secondary Button
  - "确认创建" Primary Button → creates project, navigates to `/project/:id`

---

## Mode B: Manual Create

### Form Structure

**Form container**: Standard Card, padding 24px
**Layout**: Single column, gap 20px between sections
**Section grouping**: Related fields grouped with a `heading-3` section title

### Section 1: 基本信息 (Basic Info)

| Field | Type | Required | Placeholder / Notes |
|-------|------|----------|---------------------|
| 项目名称 | Text input | Yes | "品牌海报设计" |
| 客户名称 | Text input | No | "个人客户" if empty |
| 项目金额 (¥) | Number input | Yes | Min 0, step 1, mono font |
| 截止日期 | Date input | Yes | Native date picker styled |

### Section 2: 设计需求 (Design Requirements)

| Field | Type | Required | Options / Notes |
|-------|------|----------|-----------------|
| 方案数量 | Number input | Yes | Min 1, max 10 |
| 设计尺寸 | Text input | No | "A4", "1920×1080", "自定义" |
| 用途说明 | Textarea | No | "线上推广、印刷物料..." |

### Section 3: 付款与验收 (Payment & Acceptance)

| Field | Type | Required | Options |
|-------|------|----------|---------|
| 付款方式 | Select | Yes | 全款预付 / 预付一半 / 分三期 / 验收后付款 |
| 客户付款条件 | Textarea | No | "预付50%开始设计，验收后付尾款" |
| 修改次数限制 | Number input | Yes | Default 3, min 1, max 20 |
| 验收标准 | Textarea | No | "以客户需求确认单为准，大改超出次数另行计费" |

### Section 4: 里程碑 (Milestones)

- **Label**: "项目里程碑" in `heading-3`
- **Sublabel**: "将项目拆分为阶段，方便跟踪进度" in `caption` color `ink-subtle`
- **Default**: One milestone "初稿交付" pre-filled
- **Milestone item** (each row):
  - `GripVertical` icon (drag handle, optional v2)
  - Name input (flex-1)
  - Linked amount input (narrow, placeholder "关联金额 ¥")
  - `Trash2` Icon Button to remove
- **Add button**: Ghost Button "+ 添加里程碑" with `Plus` icon
- **Styling**: Each milestone row is a Compact Card nested inside the form card

### Form Action Bar (Sticky bottom on mobile)
- **Layout**: Fixed bottom on mobile, static on desktop
- **Background**: `surface-1` with 90% opacity, backdrop-filter blur(12px), border-top `border-default`
- **Padding**: 12px 16px
- **Left**: "取消" Ghost Button → navigate back
- **Right**:
  - "保存草稿" Secondary Button
  - "创建合作" Primary Button

### Validation
- Required fields show red border (`status-risk`) and error text below when blurred empty
- Error text: `tiny` color `status-risk`
- Form cannot submit with errors
- Price field: format as ¥X,XXX on blur

---

## Interactions

| Action | Result |
|--------|--------|
| Switch mode | Fade transition (150ms) between AI and Manual panels |
| Click example chip | Fills textarea, auto-focuses parse button |
| Parse | Shows loading → result preview with editable fields |
| Edit parsed field | Inline input replaces read-only value |
| Add milestone | New milestone row animates in (slide down 150ms) |
| Remove milestone | Row fades out (150ms), then removes from DOM |
| Submit | Validates → saves to localStorage → navigates to detail |
| Save draft | Saves with `status: 'draft'` → navigates to home |

---

## Data Requirements

```typescript
// Creates a new Project object
interface CreateProjectPayload {
  title: string;
  price: number;
  deadline: string;
  concept_count: number;
  size?: string;
  usage?: string;
  payment_method: 'full' | 'half' | 'thirds' | 'post';
  client_payment?: string;
  revision_limit: number;
  revision_used: number; // starts at 0
  acceptance_rule?: string;
  status: 'draft' | 'pending'; // pending if submitted, draft if saved
  risks: Risk[];
  changes: Change[];
  timeline: TimelineEvent[]; // initial "项目创建" event
  milestones: Milestone[];
  confirmations: ConfirmationEvent[];
  created_at: string; // ISO now
}
```

---

## Component Inventory

| Component | Source | Notes |
|-----------|--------|-------|
| `ModeSwitcher` | New | Segmented control, reusable |
| `AiCreatePanel` | New | AI mode container |
| `ManualForm` | New | Manual mode container |
| `ParsedResultCard` | New | AI result preview |
| `MilestoneEditor` | New | Add/remove/edit milestones |
| `FormSection` | New | Reusable section wrapper with title |
| `FormInput` | New | Styled input with label, error, icon |
| `ExampleChip` | New | Clickable example text chip |
