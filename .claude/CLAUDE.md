# Subventia Oracle — Project Standards

## Stack
- **Framework:** Next.js 14 (App Router) — server components by default
- **Styling:** Tailwind CSS + Lucide React — no other UI libraries
- **Database:** SQLite via `better-sqlite3` — synchronous, no ORM
- **Port:** `3333`

## Skills — read before writing code

| Task | Skill |
|------|-------|
| DB setup, API routes, `next.config.js` | `nextjs-sqlite` (local) |
| Grant scoring, `/api/analyze` | `financial_analysis` (local) |
| Any React component or UI work | `frontend-design` (built-in) |
| Commits, branches, PRs | `git-workflow` (global) |

## Design system: Stachanov Professional

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#003366` | Header, primary buttons |
| Secondary | `#1A56DB` | Links, active states |
| Background | `#F8FAFC` | Page background |
| Surface | `#FFFFFF` | Cards |
| Text | `#1E293B` | Body |
| Muted | `#64748B` | Labels |
| Border | `#E2E8F0` | Dividers |
| Success | `#16A34A` | Score ≥ 80 |
| Warning | `#D97706` | Score 40–79 |
| Danger | `#DC2626` | Score < 40 |

No gradients. No `rounded-xl`. Cards: `rounded-lg border border-[#E2E8F0] bg-white shadow-sm`.

## Architecture

```
/
├── lib/db.js                        # SQLite singleton + seed (see nextjs-sqlite skill)
├── next.config.js                   # serverExternalPackages for better-sqlite3
├── app/
│   ├── layout.jsx                   # Stachanov header
│   ├── page.jsx                     # Dashboard shell (server component)
│   └── api/analyze/route.js         # POST { proposal } → { matches[] }
└── components/
    ├── ProposalForm.jsx              # Textarea + submit (client component)
    └── GrantCard.jsx                 # Single result card
```
