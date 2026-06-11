# 合作单 (CoopOrder) — Global Design System

## Visual Concept & Atmosphere

合作单 is a professional tool for freelance designers to manage client projects, contracts, and milestones. The visual language borrows from Linear's disciplined dark aesthetic: a near-black canvas with a single chromatic accent (lavender-blue), aggressive information density, and zero decorative noise. Every pixel serves productivity.

- **Mood**: Serious, trustworthy, precise, calm under pressure
- **Metaphor**: A clean desk in a dimly lit studio — everything has its place
- **No light mode**: The app is dark-mode only. No toggle, no dual palettes.
- **No drop shadows**: Depth is conveyed through surface layers and hairline borders only.

---

## Color Palette

### Canvas & Surfaces
| Token | Hex | Usage |
|-------|-----|-------|
| `canvas` | `#010102` | Deepest background, page root |
| `surface-1` | `#0f1011` | Primary content panels, cards |
| `surface-2` | `#141516` | Secondary panels, hover states, badge backgrounds |
| `surface-3` | `#18191a` | Tertiary panels, active states, input backgrounds |
| `surface-4` | `#191a1b` | Highest surface, modals, dropdowns |

### Borders
| Token | Hex | Usage |
|-------|-----|-------|
| `border-default` | `#23252a` | Default 1px hairlines (cards, dividers) |
| `border-strong` | `#34343a` | Focused/selected borders, strong separators |
| `border-tertiary` | `#3e3e44` | Hover borders, subtle emphasis |

### Text (Ink Hierarchy)
| Token | Hex | Usage |
|-------|-----|-------|
| `ink` | `#f7f8f8` | Primary text, headings, critical data |
| `ink-muted` | `#d0d6e0` | Body text, descriptions |
| `ink-subtle` | `#8a8f98` | Secondary labels, placeholders, timestamps |
| `ink-tertiary` | `#62666d` | Disabled, metadata, tertiary info |

### Accent
| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | `#5e6ad2` | Primary CTA, focus rings, active nav, links, interactive highlights |
| `accent-hover` | `#6b77d9` | Accent hover state |
| `accent-muted` | `#5e6ad233` | Accent backgrounds (tags, subtle highlights) |

### Semantic Status Colors
| Status | Token | Hex | Usage |
|--------|-------|-----|-------|
| Draft | `status-draft` | `#62666d` | Gray — unpublished, internal only |
| Pending | `status-pending` | `#d9a23e` | Amber/Yellow — waiting for client action |
| In Progress | `status-inprogress` | `#5e6ad2` | Lavender — actively working |
| Acceptance | `status-acceptance` | `#e06c45` | Orange — under client review |
| Completed | `status-completed` | `#27a644` | Green — done, paid, closed |
| Risk | `status-risk` | `#e06c45` | Orange — risk warnings (shares acceptance color) |
| Success | `status-success` | `#27a644` | Green — confirmations, success states |

### Overlay & Utilities
| Token | Hex | Usage |
|-------|-----|-------|
| `overlay` | `rgba(1, 1, 2, 0.72)` | Modal backdrop |
| `scrim` | `rgba(1, 1, 2, 0.48)` | Subtle overlays |
| `danger` | `#e06c45` | Destructive actions (shares orange) |
| `danger-bg` | `#e06c451a` | Danger subtle background |

---

## Typography

**Font Family**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `display` | 32px | 600 | 1.1 | -0.03em | Page titles, empty states |
| `heading-1` | 24px | 600 | 1.2 | -0.02em | Section headers |
| `heading-2` | 18px | 600 | 1.3 | -0.01em | Card titles, subsections |
| `heading-3` | 15px | 600 | 1.4 | -0.01em | List headers, form group labels |
| `body` | 14px | 400 | 1.5 | 0 | Primary body text |
| `body-medium` | 14px | 500 | 1.5 | 0 | Emphasized body, labels |
| `caption` | 13px | 400 | 1.4 | 0 | Metadata, timestamps |
| `caption-medium` | 13px | 500 | 1.4 | 0 | Emphasized captions |
| `tiny` | 12px | 500 | 1.3 | 0.01em | Badges, tags, micro labels |
| `mono` | 13px | 400 | 1.4 | 0 | Code, IDs, amounts, dates |

**Rules**:
- Display sizes use aggressive negative tracking (-0.03em to -0.01em)
- Body text never goes below 14px for readability
- Monospace used for all numeric data (prices, dates, IDs)
- Chinese text: use default tracking (0), ensure `line-height` ≥ 1.5 for CJK readability

---

## Component Stylings

### Buttons

**Primary Button**
- Background: `accent` (#5e6ad2)
- Text: `ink` (#f7f8f8), weight 500, 14px
- Padding: 8px 14px
- Border-radius: 8px (md)
- Border: none
- Hover: background `accent-hover`, transition 150ms ease
- Active: scale(0.98), transition 100ms ease
- Disabled: opacity 0.4, cursor not-allowed

**Secondary Button**
- Background: `surface-2` (#141516)
- Text: `ink-muted` (#d0d6e0), weight 500, 14px
- Padding: 8px 14px
- Border-radius: 8px
- Border: 1px solid `border-default`
- Hover: background `surface-3`, border `border-strong`

**Ghost Button**
- Background: transparent
- Text: `ink-subtle` (#8a8f98), weight 500, 14px
- Padding: 8px 14px
- Border-radius: 8px
- Border: none
- Hover: background `surface-2`, text `ink-muted`

**Icon Button**
- Size: 32px × 32px
- Background: transparent
- Border-radius: 8px
- Icon color: `ink-subtle`
- Hover: background `surface-2`, icon `ink-muted`
- Active: background `surface-3`, icon `ink`

### Cards

**Standard Card**
- Background: `surface-1` (#0f1011)
- Border: 1px solid `border-default` (#23252a)
- Border-radius: 12px (lg)
- Padding: 20px 24px
- No shadow
- Hover (interactive cards): border `border-strong`, background `surface-2`, transition 150ms ease

**Compact Card**
- Padding: 14px 16px
- Border-radius: 10px
- Used for list items, timeline entries

**Document Card** (Contract Preview)
- Background: `surface-1`
- Border: 1px solid `border-default`
- Border-radius: 12px
- Padding: 40px 48px
- Max-width: 720px, centered
- Inner typography mimics formal document (slightly larger body, more line-height)

### Inputs

**Text Input**
- Background: `surface-3` (#18191a)
- Border: 1px solid `border-default`
- Border-radius: 8px
- Padding: 8px 12px
- Font: `body` (14px, weight 400)
- Color: `ink-muted`
- Placeholder: `ink-tertiary`
- Focus: border `accent`, ring 2px `accent-muted`
- Hover: border `border-strong`
- Disabled: opacity 0.5

**Textarea**
- Same as text input
- Min-height: 96px
- Resize: vertical only

**Select / Dropdown**
- Same styling as text input
- Dropdown panel: `surface-4`, border `border-default`, border-radius 10px, shadow none
- Option hover: `surface-2`
- Selected option: background `accent-muted`, text `accent`

### Badges & Status Pills

**Status Badge**
- Background: `surface-2`
- Text: status color token
- Font: `tiny` (12px, weight 500)
- Padding: 3px 10px
- Border-radius: 9999px (full pill)
- Border: 1px solid status color at 20% opacity

**Count Badge** (pending changes, revisions)
- Background: `accent-muted`
- Text: `accent`
- Font: `tiny`, weight 600
- Padding: 2px 8px
- Border-radius: 9999px

**Risk Badge**
- Background: `danger-bg` (#e06c451a)
- Text: `status-risk`
- Border: 1px solid `status-risk` at 25% opacity
- Font: `tiny`, weight 500
- Padding: 3px 10px
- Border-radius: 9999px

### Navigation

**Top Navigation Bar**
- Height: 56px
- Background: `canvas` with 80% opacity, backdrop-filter blur(12px)
- Border-bottom: 1px solid `border-default`
- Position: sticky top-0, z-index 50
- Left: Logo + app name
- Center: Page title (contextual)
- Right: User avatar / settings icon button

**Bottom Tab Bar** (Mobile only)
- Height: 64px + safe-area-inset-bottom
- Background: `surface-1` with 90% opacity, backdrop-filter blur(12px)
- Border-top: 1px solid `border-default`
- 4 tabs: Home, Create, Evidence, Settings
- Active: icon + label in `accent`
- Inactive: icon + label in `ink-tertiary`

**Sidebar** (Desktop ≥ 1024px)
- Width: 240px
- Background: `surface-1`
- Border-right: 1px solid `border-default`
- Padding: 16px 12px
- Nav items: 36px height, border-radius 8px, padding 0 12px
- Active: background `surface-2`, left border 2px `accent`, text `ink`
- Inactive: text `ink-subtle`, hover background `surface-2`

---

## Layout Principles & Spacing

### Spacing Scale
| Token | Value |
|-------|-------|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |

### Layout Grid
- Mobile: single column, padding 16px
- Tablet (≥ 768px): max-width 720px, centered
- Desktop (≥ 1024px): sidebar + content area, content max-width 960px
- Large (≥ 1280px): content max-width 1120px

### Page Structure
```
[Top Nav: 56px]
[Main Content: min-height calc(100vh - 56px)]
  - Padding: 24px (mobile: 16px)
  - Gap between major sections: 24px
  - Gap between cards in grid: 16px
```

### Z-Index Scale
| Layer | Z-Index | Usage |
|-------|---------|-------|
| Base | 0 | Content |
| Sticky | 10 | Sticky headers |
| Nav | 50 | Top nav, bottom tab |
| Dropdown | 100 | Select menus, popovers |
| Modal | 200 | Dialogs, drawers |
| Toast | 300 | Notifications |

---

## Elevation & Depth System

合作单 uses **zero drop shadows**. Depth is achieved through:

1. **Surface layering**: `canvas` → `surface-1` → `surface-2` → `surface-3` → `surface-4`
2. **Border contrast**: `border-default` separates layers; `border-strong` elevates
3. **Backdrop blur**: Navigation bars use `backdrop-filter: blur(12px)` with semi-transparent backgrounds
4. **Opacity overlays**: Modal backdrops use `overlay` (rgba black 72%)

No `box-shadow` declarations anywhere in the app.

---

## Status Color Mapping

| Status | Color Token | Badge Style | Icon | Usage Context |
|--------|-------------|-------------|------|---------------|
| `draft` | `status-draft` (#62666d) | Gray pill | `FileText` | Unpublished orders, internal drafts |
| `pending` | `status-pending` (#d9a23e) | Amber pill | `Clock` | Waiting for client deposit or response |
| `in_progress` | `status-inprogress` (#5e6ad2) | Lavender pill | `PenTool` | Actively designing, in revision |
| `acceptance` | `status-acceptance` (#e06c45) | Orange pill | `Eye` | Client reviewing deliverables |
| `completed` | `status-completed` (#27a644) | Green pill | `CheckCircle2` | Project done, payment received |

**Status Transitions** (visual):
- Status changes trigger a subtle pulse animation on the badge (scale 1 → 1.05 → 1, 300ms)
- Timeline entries show the old → new status with a small arrow icon

---

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| `sm` | 640px | Minor adjustments |
| `md` | 768px | Tablet layout, 2-column grids appear |
| `lg` | 1024px | Desktop sidebar replaces bottom tab |
| `xl` | 1280px | Wider content area, 3-column grids |

### Mobile-First Rules
- All pages work on 375px width
- Touch targets minimum 44px × 44px
- Bottom tab bar on mobile; sidebar on desktop
- Cards stack vertically on mobile, grid on desktop
- Font sizes do not scale down below token values
- Horizontal padding reduces from 24px to 16px on mobile

---

## Page / Route Map

| Route | Page Name | File | Description |
|-------|-----------|------|-------------|
| `/` | Dashboard (Home) | `home.md` | Project list, stats, risk warnings |
| `/onboarding` | Onboarding | — | First-time user profile setup |
| `/create` | Create Order | `create.md` | AI + manual order creation |
| `/project/:id` | Project Detail | `detail.md` | Full project view, timeline, milestones |
| `/project/:id/contract` | Contract Preview | `contract.md` | Auto-generated service contract |
| `/confirm/:token` | Client Confirmation | `confirm.md` | External client-facing confirmation page |
| `/evidence/:id` | Evidence Chain | `evidence.md` | Immutable operation timeline |
| `/settings` | Settings | — | Profile, payment info, preferences |

**Route Guards**:
- `/onboarding` redirects to `/` if `UserProfile` exists in localStorage
- All project routes show 404-like empty state if project ID not found
- `/confirm/:token` works without authentication (client-facing)

---

## Asset Manifest

### Icons (Lucide React)
All icons from `lucide-react` package. Key icons by page:

**Global / Navigation**:
- `Home`, `Plus`, `FileText`, `Settings`, `User`, `Bell`, `Search`, `Menu`, `X`, `ChevronLeft`, `ChevronRight`, `ChevronDown`, `MoreHorizontal`

**Dashboard**:
- `FolderOpen`, `Clock`, `AlertTriangle`, `TrendingUp`, `DollarSign`, `Calendar`, `ArrowUpRight`, `Filter`, `SortAsc`

**Create / Forms**:
- `Sparkles` (AI mode), `Edit3` (Manual mode), `Check`, `Trash2`, `Upload`, `Link`, `Copy`, `RefreshCw`

**Project Detail**:
- `PenTool`, `Eye`, `CheckCircle2`, `MessageSquare`, `GitCommit`, `GitBranch`, `Lock`, `Unlock`, `Download`, `Share2`

**Contract**:
- `FileCheck`, `Stamp`, `Shield`, `Scale`, `Printer`, `Download`

**Evidence**:
- `History`, `Camera`, `Fingerprint`, `Lock`, `Unlock`, `ShieldCheck`, `Archive`

**Status Icons** (mapped to statuses):
- `FileText` (draft), `Clock` (pending), `PenTool` (in_progress), `Eye` (acceptance), `CheckCircle2` (completed), `AlertTriangle` (risk)

### No Image Assets Required
The app is icon-only. No logos, illustrations, or photographs. The "证明.png" from the mini-program is not carried over.

---

## Worker Grouping Suggestions

### Group A: Foundation & Shell
- **Scope**: Design system implementation, routing, layout shell, navigation
- **Files**: `App.tsx`, `main.tsx`, router config, `TopNav`, `Sidebar`, `BottomTabBar`, layout wrappers
- **Dependencies**: React Router, Tailwind config with custom tokens
- **Key Deliverable**: A runnable app shell with all routes wired and navigation working

### Group B: Data Layer & State
- **Scope**: localStorage persistence, data models, hooks, context providers
- **Files**: `storage.ts`, `types.ts`, `useProjects.ts`, `useProfile.ts`, `ProjectContext`
- **Dependencies**: None beyond React
- **Key Deliverable**: All CRUD operations working via hooks with localStorage backing

### Group C: Dashboard & Onboarding
- **Scope**: Home page, onboarding flow, project list cards, stats overview
- **Files**: `HomePage.tsx`, `OnboardingPage.tsx`, `ProjectCard`, `StatCard`, `RiskBanner`
- **Dependencies**: Group A + Group B
- **Key Deliverable**: Dashboard displaying real projects with status, risks, and pending counts

### Group D: Create & Detail
- **Scope**: Create order (AI + manual), project detail view, milestone management
- **Files**: `CreatePage.tsx`, `ProjectDetailPage.tsx`, `AiCreatePanel`, `ManualForm`, `MilestoneList`, `Timeline`, `ChangeRequestPanel`
- **Dependencies**: Group A + Group B
- **Key Deliverable**: Can create projects via both modes and view full project details

### Group E: Contract & Confirmation
- **Scope**: Contract preview/generation, client confirmation flow
- **Files**: `ContractPage.tsx`, `ConfirmPage.tsx`, `ContractDocument`, `AmountConverter`, `ConfirmationCard`
- **Dependencies**: Group A + Group B
- **Key Deliverable**: Contract renders with Chinese amounts; confirmation links work externally

### Group F: Evidence & Polish
- **Scope**: Evidence chain timeline, settings, toast notifications, empty states, loading states
- **Files**: `EvidencePage.tsx`, `SettingsPage.tsx`, `EvidenceTimeline`, `SnapshotCard`, `Toast`, `EmptyState`
- **Dependencies**: All other groups
- **Key Deliverable**: Complete evidence viewing, settings editable, all edge states handled
