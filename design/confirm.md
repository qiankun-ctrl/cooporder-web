# Client Confirmation Page Design

**Route**: `/confirm/:token`
**Page Component**: `ConfirmPage`
**Layout**: Centered content, max-width 560px, generous vertical padding

---

## Purpose

A client-facing page (no login required) where clients can confirm or reject milestones, change requests, or final deliverables. This page must feel trustworthy and professional — the client's first impression of the designer's professionalism.

**Important**: This page works without authentication. It reads the confirmation token from the URL, looks up the associated `ConfirmationEvent` in localStorage, and displays the relevant project snapshot.

---

## Page Structure

### 1. Brand Header
- **Layout**: Centered, padding-top 48px
- **Content**:
  - App name "合作单" in `heading-2` (18px, weight 600, tracking -0.01em) color `accent`
  - Below: "设计项目协作平台" in `caption` color `ink-subtle`
- **No navigation**: This is a standalone page, no sidebar or top nav

### 2. Confirmation Card
- **Styling**: Standard Card, padding 32px (desktop), 24px (mobile)
- **Max-width**: 560px, centered
- **Border**: 1px solid `border-default`

#### Card Header
- **Icon**: Large status icon (32px) centered above title
  - `Eye` for milestone review
  - `GitCommit` for change request
  - `CheckCircle2` for final acceptance
  - Icon color: `accent` for pending, `status-completed` for confirmed, `status-risk` for rejected
- **Title**: "{confirmation.title}" in `heading-1` (24px, weight 600), centered
- **Subtitle**: "来自 {designer_name}" in `body` color `ink-subtle`, centered

#### Project Snapshot
- **Label**: "项目信息" in `heading-3`, margin-top 24px
- **Styling**: Compact Card inside, background `surface-2`, padding 16px
- **Fields** (read-only):
  - 项目名称: {project.title}
  - 项目金额: ¥{project.price}
  - 当前阶段: {milestone_name || "项目整体"}
  - 提交时间: {confirmation.created_at}
- **Font**: `body` for labels, `body-medium` for values

#### Content Block
- **Label**: "确认内容" in `heading-3`
- **Content**: `{confirmation.content}` rendered as paragraphs in `body` color `ink-muted`, line-height 1.6
- **If milestone**: Show milestone details + deliverable description
- **If change request**: Show change description + price impact ("+¥200" or "-¥100") in `mono` color `status-risk` or `status-completed`

#### Action Area (Pending State)
- **Shown only if** `confirmation.status === 'pending'`
- **Layout**: 2 buttons, side by side, gap 12px
- **Left button — Reject**:
  - Secondary Button styling but with `status-risk` border and text
  - Label: "需要修改"
  - Click: reveals rejection reason textarea
- **Right button — Confirm**:
  - Primary Button, full style
  - Label: "确认通过"
  - Icon: `Check` (16px)
  - Click: shows confirmation modal, then marks confirmed

#### Rejection Form (Revealed on click)
- **Animation**: Slide down 150ms ease
- **Textarea**: "请说明需要修改的地方..."
  - Min-height: 80px
  - Required before submit
- **Submit**: "提交反馈" Secondary Button
- **Cancel**: "取消" Ghost Button → hides form

#### Confirmed State
- **Shown if** `confirmation.status === 'confirmed'`
- **Icon**: `CheckCircle2` (48px, color `status-completed`) centered
- **Text**: "已确认通过" in `heading-2` color `status-completed`, centered
- **Timestamp**: "确认于 2024-01-20 14:32" in `caption` color `ink-subtle`, centered

#### Rejected State
- **Shown if** `confirmation.status === 'rejected'`
- **Icon**: `XCircle` (48px, color `status-risk`) centered — note: use `X` in circle or `AlertTriangle` if `XCircle` unavailable in Lucide
- **Text**: "已退回修改" in `heading-2` color `status-risk`, centered
- **Reason**: "反馈：{confirmation.rejection_reason}" in `body` color `ink-muted`, centered, max-width 100%
- **Timestamp**: "退回于 2024-01-20 14:32" in `caption` color `ink-subtle`

### 3. Footer
- **Layout**: Centered, margin-top 48px, padding-bottom 48px
- **Content**: 
  - "此确认单由 合作单 生成，具有项目协作记录效力" in `tiny` color `ink-tertiary`
  - "项目编号：{project.id}" in `tiny` color `ink-tertiary`, mono font

---

## Invalid / Expired State

If token not found or confirmation already resolved:
- **Icon**: `ShieldCheck` or `FileX` (48px, color `ink-tertiary`) centered
- **Title**: "确认单无效或已过期" in `heading-2` color `ink-muted`
- **Message**: "该确认链接可能已被使用，或项目状态已更新。请联系服务方获取新的确认链接。" in `body` color `ink-subtle`
- **Action**: None (or "返回首页" if we had a marketing site)

---

## Interactions

| Action | Result |
|--------|--------|
| Click "确认通过" | Modal: "确认后将不可撤销，是否继续？" → Yes → updates status, shows confirmed state |
| Click "需要修改" | Reveals rejection textarea |
| Submit rejection | Validates reason > 0 chars → updates status, shows rejected state |
| Cancel rejection | Hides textarea |

---

## Data Requirements

```typescript
// ConfirmationEvent lookup by token
interface ConfirmationEvent {
  id: string;
  project_id: string;
  milestone_id?: string;
  type: 'milestone' | 'change' | 'final';
  title: string;
  content: string;
  status: 'pending' | 'confirmed' | 'rejected';
  confirm_token: string; // URL param
  rejection_reason?: string;
  snapshot: ProjectSnapshot; // immutable copy at creation time
  created_at: string;
  resolved_at?: string;
}

interface ProjectSnapshot {
  title: string;
  price: number;
  status: string;
  milestone_name?: string;
}
```

---

## Component Inventory

| Component | Source | Notes |
|-----------|--------|-------|
| `ConfirmCard` | New | Main confirmation container |
| `ProjectSnapshot` | New | Read-only project info block |
| `ConfirmActions` | New | Confirm/reject buttons + forms |
| `ResolvedState` | New | Confirmed or rejected display |
| `InvalidTokenState` | New | Error state for bad tokens |
| `ConfirmModal` | New | Final confirmation dialog |
