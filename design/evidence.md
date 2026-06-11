# Evidence Chain Page Design

**Route**: `/evidence/:id`
**Page Component**: `EvidencePage`
**Layout**: Full-width, max-width 800px centered

---

## Purpose

An immutable, chronological record of all operations on a project. This is the "audit trail" — every status change, milestone completion, change request, confirmation, and edit is recorded with a snapshot. The page must convey trustworthiness and permanence.

---

## Page Header

- **Left**: Back button (`ChevronLeft` Icon Button) → back to project detail
- **Center**: "证据链" in `heading-1`
- **Right**: `Lock` icon (18px, color `ink-tertiary`) with tooltip "不可篡改的操作记录"

---

## Sections

### 1. Evidence Summary Bar
- **Styling**: Compact Card, horizontal flex, gap 24px
- **Items**:
  - `Fingerprint` icon + "{timeline.length} 条记录" in `body-medium`
  - `ShieldCheck` icon + "{confirmations.filter(c=>c.status==='confirmed').length} 次确认" in `body-medium`
  - `Camera` icon + "首条记录于 {project.created_at}" in `body-medium`
- **Color**: `ink-subtle` for icons, `ink-muted` for text

### 2. Timeline
- **Layout**: Vertical, single column
- **Gap**: 0 (items connect visually)

**Timeline Entry** (`EvidenceTimelineItem`):
- **Layout**: Flex row, padding 16px 0
- **Left column** (80px width, right-aligned on desktop, left-aligned on mobile):
  - Date: `caption` color `ink-subtle`, mono font — "01-20"
  - Time: `tiny` color `ink-tertiary`, mono font — "14:32"
- **Center column** (40px width, flex center):
  - Vertical line: 2px wide, full height, color `border-default`
  - Node: 10px circle, centered on the line
    - Node colors by event type:
      - `create`: `accent`
      - `status_change`: `status-pending` or target status color
      - `milestone_complete`: `status-completed`
      - `change_request`: `status-acceptance`
      - `confirmation`: `status-completed` (confirmed) or `status-risk` (rejected)
      - `edit`: `ink-subtle`
      - `risk`: `status-risk`
  - First item: line starts from node (no upward extension)
  - Last item: line ends at node (no downward extension)
- **Right column** (flex-1):
  - **Event Card** (Compact Card styling):
    - **Header row**: 
      - Event type badge (tiny, pill, color matches node)
      - Event title in `body-medium` color `ink`
    - **Description**: `body` color `ink-muted` — human-readable description
    - **Snapshot toggle**: "查看快照" in `tiny` color `accent`, clickable
      - Click: expands inline to show JSON snapshot (formatted, mono, 13px)
      - Snapshot container: background `surface-2`, border-radius 8px, padding 12px, max-height 300px, overflow auto
    - **Hash** (optional v2): "记录哈希：a1b2c3..." in `tiny` color `ink-tertiary`, mono font

**Event Type Mapping**:

| Type | Badge Text | Badge Color | Icon | Example Title |
|------|-----------|-------------|------|---------------|
| `project_created` | 创建 | `accent` | `FileText` | 项目创建 |
| `status_changed` | 状态 | target status color | `GitCommit` | 状态变更：进行中 → 验收中 |
| `milestone_completed` | 里程碑 | `status-completed` | `CheckCircle2` | 里程碑完成：初稿交付 |
| `change_proposed` | 变更 | `status-acceptance` | `GitBranch` | 变更申请：增加方案数量 |
| `change_resolved` | 变更 | `status-completed`/`status-risk` | `GitCommit` | 变更已同意 |
| `confirmation_sent` | 确认 | `accent` | `Send` | 发送客户确认 |
| `confirmation_confirmed` | 确认 | `status-completed` | `CheckCircle2` | 客户已确认 |
| `confirmation_rejected` | 确认 | `status-risk` | `X` | 客户退回修改 |
| `project_edited` | 编辑 | `ink-subtle` | `Edit3` | 项目信息修改 |
| `risk_added` | 风险 | `status-risk` | `AlertTriangle` | 风险预警：deadline 临近 |
| `contract_generated` | 合同 | `accent` | `FileCheck` | 生成服务合同 |

### 3. Empty State (should never happen, but defensive)
- "暂无记录" in `heading-2` color `ink-muted`
- "项目创建后将自动生成证据链" in `body` color `ink-subtle`

---

## Interactions

| Action | Result |
|--------|--------|
| Click "查看快照" | Expands/collapses JSON snapshot inline |
| Click timeline item | Nothing (read-only) |
| Scroll | Standard scroll, no virtual scrolling needed (data is small) |

---

## Data Requirements

```typescript
interface TimelineEvent {
  id: string;
  project_id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  snapshot: object; // Project state at this moment
  created_at: string; // ISO
  // Optional metadata:
  previous_status?: string;
  new_status?: string;
  milestone_id?: string;
  change_id?: string;
  confirmation_id?: string;
}

type TimelineEventType = 
  | 'project_created'
  | 'status_changed'
  | 'milestone_completed'
  | 'change_proposed'
  | 'change_resolved'
  | 'confirmation_sent'
  | 'confirmation_confirmed'
  | 'confirmation_rejected'
  | 'project_edited'
  | 'risk_added'
  | 'contract_generated';
```

---

## Component Inventory

| Component | Source | Notes |
|-----------|--------|-------|
| `EvidenceSummaryBar` | New | Stats row at top |
| `EvidenceTimeline` | New | Vertical connected list |
| `EvidenceTimelineItem` | New | Single entry with node + card |
| `EventBadge` | New | Type badge with color mapping |
| `SnapshotViewer` | New | Collapsible JSON display |
| `TimelineNode` | New | Colored circle + connecting line |
