# Dashboard (Home) Page Design

**Route**: `/`
**Page Component**: `HomePage`
**Layout**: Full-width content area, sidebar on desktop

---

## Purpose

The Dashboard is the command center. It answers three questions at a glance:
1. What is the overall health of my business? (stats)
2. What needs my attention right now? (risks + pending)
3. What am I working on? (project list)

---

## Sections (Top to Bottom)

### 1. Page Header
- **Height**: ~64px
- **Left**: Page title "合作单" in `display` (32px, weight 600, tracking -0.03em)
- **Right**: Primary CTA button "新建合作" (New Order) with `Plus` icon → navigates to `/create`
- **Below title**: Subtitle "管理你的设计项目与合作" in `caption` color `ink-subtle`

### 2. Stats Overview Bar
- **Layout**: Horizontal row of 4 stat cards, gap 16px
- **On mobile**: 2×2 grid
- **Card styling**: Compact Card (14px 16px padding, 10px radius)
- **Each stat card**:
  - Top: Icon (20px) + label in `caption` color `ink-tertiary`
  - Bottom: Value in `heading-2` (18px, weight 600) color `ink`
  - Optional: small delta indicator (e.g., "+2 本周") in `tiny` color `status-completed` or `ink-tertiary`

**Stats**:
| Label | Icon | Value Source | Example |
|-------|------|--------------|---------|
| 进行中 | `PenTool` | Count of `in_progress` + `acceptance` | "3" |
| 待确认 | `Clock` | Count of `pending` | "2" |
| 本月收入 | `DollarSign` | Sum of `price` for `completed` this month | "¥12,500" |
| 风险预警 | `AlertTriangle` | Count of projects with `risks.length > 0` | "1" |

### 3. Risk Warning Banner (Conditional)
- **Shown only if** any project has `risks.length > 0`
- **Styling**: Full-width card, background `danger-bg`, border 1px solid `status-risk` at 25% opacity
- **Padding**: 14px 16px
- **Layout**: `AlertTriangle` icon (16px, color `status-risk`) + risk text + "查看" link
- **Content**: "项目「品牌海报设计」存在风险： deadline 仅剩 1 天，但状态仍在进行中"
- **Action**: Clicking "查看" navigates to that project's detail page
- **Multiple risks**: Show the most urgent one; add a badge "+2 其他风险" linking to a filtered project list

### 4. Project List
- **Section header**: "全部项目" in `heading-2` + count badge "(12)" in `caption` color `ink-tertiary`
- **Filter bar** (below header):
  - Left: Status filter pills (全部 / 进行中 / 待确认 / 已完成)
  - Right: Sort dropdown (最新创建 / 截止日期 / 金额高低)
  - Active filter pill: background `surface-2`, text `ink`, border `border-strong`
  - Inactive filter pill: background transparent, text `ink-subtle`, border `border-default`

**Project Card** (`ProjectCard` component):
- **Layout**: Full-width Compact Card, internal flex row
- **Left column** (flex-1):
  - Title in `body-medium` (14px, weight 500) color `ink`
  - Below: Client name or "个人客户" in `caption` color `ink-subtle`
- **Center column** (hidden on mobile, shown md+):
  - Deadline: `Calendar` icon (14px) + date in `caption` color `ink-subtle`
  - Price: `DollarSign` icon (14px) + "¥500" in `caption` color `ink-muted`
- **Right column** (align right):
  - Status Badge (see design.md mapping)
  - If `changes.length > 0`: Count Badge "+3 变更" below status
  - If `risks.length > 0`: Risk Badge "风险" below status
- **Hover**: Card border becomes `border-strong`, background `surface-2`
- **Click**: Navigates to `/project/:id`
- **Swipe** (mobile): Left swipe reveals quick actions (Archive, Delete) — optional v2

**Empty State** (no projects):
- Centered vertically in available space
- `FolderOpen` icon (48px, color `ink-tertiary`)
- "还没有合作单" in `heading-2` color `ink-muted`
- "点击右上角新建你的第一个项目" in `body` color `ink-subtle`
- CTA: "新建合作" Primary Button

### 5. Floating Action Button (Mobile only)
- **Shown**: Only on mobile (< 1024px), when scrolled down
- **Position**: Fixed bottom-right, 24px from edges, above tab bar
- **Styling**: 56px circle, background `accent`, `Plus` icon 24px in white
- **Shadow**: None (violates design system — use 2px ring `accent-muted` instead for depth)
- **Action**: Navigates to `/create`

---

## Interactions

| Action | Result |
|--------|--------|
| Click project card | Navigate to `/project/:id` |
| Click "新建合作" | Navigate to `/create` |
| Click status filter | Filter list, animate cards out/in (150ms fade) |
| Click sort dropdown | Reorder list |
| Click risk banner | Navigate to affected project |
| Pull down (mobile) | Refresh data from localStorage |

---

## Data Requirements

```typescript
// From localStorage: Project[]
interface Project {
  id: string;
  title: string;
  price: number;
  deadline: string; // ISO date
  concept_count: number;
  size: string;
  usage: string;
  payment_method: 'full' | 'half' | 'thirds' | 'post';
  client_payment: string;
  revision_limit: number;
  revision_used: number;
  acceptance_rule: string;
  status: 'draft' | 'pending' | 'in_progress' | 'acceptance' | 'completed';
  risks: Risk[];
  changes: Change[];
  timeline: TimelineEvent[];
  milestones: Milestone[];
  confirmations: ConfirmationEvent[];
  created_at: string;
}
```

---

## Component Inventory

| Component | Source | Reuse |
|-----------|--------|-------|
| `ProjectCard` | New | Also used in filtered views |
| `StatCard` | New | — |
| `RiskBanner` | New | Could appear on Detail page too |
| `StatusFilterPill` | New | — |
| `EmptyState` | New | Reused on other pages |
