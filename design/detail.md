# Project Detail Page Design

**Route**: `/project/:id`
**Page Component**: `ProjectDetailPage`
**Layout**: Full-width, max-width 960px centered

---

## Purpose

The single source of truth for a project. Shows current status, full specifications, milestone progress, change history, and provides actions to advance the project.

---

## Page Header

- **Left**: Back button (`ChevronLeft` Icon Button) → navigates to `/`
- **Center**: Project title in `heading-1` (24px, weight 600), truncated with ellipsis if too long
- **Right**: `MoreHorizontal` Icon Button → opens action dropdown
  - Dropdown items: 编辑项目, 生成合同, 发送确认, 删除项目
  - Delete shows in `status-risk` color with confirmation

---

## Sections (Top to Bottom)

### 1. Status Hero Card
- **Styling**: Standard Card, padding 24px
- **Layout**: Flex row, space-between, align-center
- **Left**:
  - Large status badge (scaled up: padding 6px 14px, font `body-medium`)
  - Status icon (20px) + status name
  - Below: "创建于 2024-01-15" in `caption` color `ink-tertiary`
- **Center** (hidden on mobile):
  - Progress indicator: horizontal bar, 4 segments (draft→pending→in_progress→acceptance→completed)
  - Current segment filled with status color, past segments in `status-completed`, future in `surface-3`
  - Height: 4px, border-radius 2px, gap 4px between segments
- **Right**:
  - Primary action button (contextual by status):
    - `draft` → "提交项目" (→ pending)
    - `pending` → "提醒客户" (→ sends notification)
    - `in_progress` → "提交验收" (→ acceptance)
    - `acceptance` → "查看确认" (→ confirmation panel)
    - `completed` → "查看合同" (→ contract)

### 2. Project Spec Card
- **Styling**: Standard Card
- **Header**: "项目信息" in `heading-2` + `PenTool` icon (18px)
- **Content**: 2-column grid on desktop, single column on mobile
  - Each field: label in `caption` color `ink-subtle` above, value in `body-medium` color `ink`
  - Fields: 项目金额, 截止日期, 方案数量, 设计尺寸, 用途, 付款方式, 修改限制, 已用修改, 验收标准
  - Amount: mono font, prefixed with ¥
  - Deadline: mono font, color `status-risk` if within 3 days and not completed
  - Revision used/limit: "2 / 3" with progress bar (thin, 4px, `accent` for used, `surface-3` for remaining)

### 3. Milestone Timeline
- **Styling**: Standard Card
- **Header**: "项目进度" in `heading-2` + milestone count
- **Layout**: Vertical timeline

**Timeline Item** (`MilestoneTimelineItem`):
- **Left**: Vertical line (2px) connecting items. Line color: `surface-3` for future, `status-completed` for completed, `accent` for current
- **Node**: 12px circle at top of item
  - Completed: `status-completed` fill, `Check` icon (8px) inside
  - Current: `accent` fill, white dot inside
  - Future: `surface-3` fill, no icon
- **Right content**:
  - Milestone name in `body-medium` color `ink` (current/future) or `ink-subtle` (completed)
  - Linked amount in `caption` mono color `ink-subtle` if present
  - Status text: "已完成" / "进行中" / "待开始" in `tiny` with appropriate color
- **Click**: Current milestone shows action buttons ("标记完成" / "添加变更")

### 4. Change Requests Panel
- **Styling**: Standard Card
- **Header**: "变更记录" in `heading-2` + count badge
- **Shown**: Only if `changes.length > 0`, else collapsed with "暂无变更" in `ink-tertiary`

**Change Item**:
- **Layout**: Compact Card nested inside, margin-bottom 12px
- **Top row**: Change title in `body-medium` + status badge (待确认 / 已同意 / 已拒绝)
- **Description**: `body` color `ink-muted`
- **Meta**: "提出于 2024-01-20 · 影响金额 ¥200" in `caption` color `ink-tertiary`
- **Actions** (if status is pending):
  - "同意" Ghost Button → status `accepted`, adds timeline event
  - "拒绝" Ghost Button → opens reason input

**Add Change Button**:
- "+ 新增变更" Ghost Button at bottom of panel
- Opens inline form: title input + description textarea + amount impact input

### 5. Risk Panel (Conditional)
- **Styling**: Standard Card with left border 3px `status-risk`
- **Header**: `AlertTriangle` (16px) + "风险预警" in `heading-3` color `status-risk`
- **Risk Item**:
  - Risk text in `body` color `ink-muted`
  - Severity: "高" / "中" / "低" badge
  - "已处理" checkbox (if handled)
- **Add Risk**: "+ 添加风险" Ghost Button

### 6. Quick Actions Bar (Bottom)
- **Styling**: Fixed bottom on mobile, static card on desktop
- **Background**: `surface-1` with backdrop blur, border-top `border-default`
- **Actions** (contextual, 2-3 visible):
  - Primary: Status-advancing action (same as hero card)
  - Secondary: "查看合同" → `/project/:id/contract`
  - Secondary: "证据链" → `/evidence/:id`
  - Ghost: "发送确认链接" → opens share modal with copyable link

---

## Interactions

| Action | Result |
|--------|--------|
| Click status action | Confirmation modal → updates status → adds timeline event |
| Mark milestone complete | Updates milestone status, may advance project status |
| Add change | Inline form → saves → adds to list + timeline |
| Confirm/reject change | Updates change status, adds timeline event |
| Click "查看合同" | Navigate to contract page |
| Click "证据链" | Navigate to evidence page |
| Click "发送确认链接" | Copies `/confirm/:token` URL to clipboard, shows toast |
| Click "删除项目" | Confirm dialog → delete → navigate home |

---

## Data Requirements

```typescript
// Full Project object (same as home.md) + related data
interface ProjectDetail extends Project {
  // All fields from Project
  // Plus computed:
  days_remaining: number;
  is_overdue: boolean;
  revision_percentage: number; // revision_used / revision_limit
}
```

---

## Component Inventory

| Component | Source | Notes |
|-----------|--------|-------|
| `StatusHeroCard` | New | Large status + progress + action |
| `ProjectSpecCard` | New | Key-value grid |
| `MilestoneTimeline` | New | Vertical connected timeline |
| `ChangeRequestPanel` | New | Expandable change list |
| `RiskPanel` | New | Warning panel with severity |
| `QuickActionBar` | New | Bottom sticky actions |
| `ProgressBar` | New | Thin segmented progress |
| `ShareModal` | New | Copy confirmation link |
