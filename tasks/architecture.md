# Architecture: Subventia Oracle MVP

**Project**: Subventia Oracle — Grant Eligibility Pre-Screener  
**Date**: 2026-04-16  
**Status**: Approved

## Problem Statement

UWV and Gemeente Amsterdam manually pre-screen hundreds of subsidy applications. This AI layer reduces that effort by ~80%: an applicant pastes a free-text project proposal, and the system scores it against 3 Dutch government grants, returning a ranked result with citations so civil servants can immediately see why a proposal matched or didn't.

## Project Context

Constraints defined in `.claude/CLAUDE.md`:
- **Framework:** Next.js 14 (App Router) — server components by default
- **Styling:** Tailwind CSS + Lucide React
- **Database:** SQLite via `better-sqlite3` — synchronous, no ORM
- **Port:** 3333
- **AI model:** Claude via `@anthropic-ai/sdk` — used only for unstructured text scoring; all financial logic is deterministic
- **API key:** stored in `.env.local` as `ANTHROPIC_API_KEY`, read from `process.env`

## Proposed Solution

A single-page Next.js 14 app with a server-side SQLite database seeded with 3 Dutch grants. The user pastes a proposal into a textarea; the frontend POSTs to `/api/analyze`, which fetches all grants from SQLite, calls Claude using the `financial_analysis` skill prompt, and returns a ranked JSON array. The UI renders one card per grant with a coloured score bar and a one-sentence criterion citation.

## Tech Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14 App Router | Defined in CLAUDE.md; unified server + client, no extra backend |
| Database | SQLite via `better-sqlite3` | Defined in CLAUDE.md; zero-config, local, synchronous |
| AI integration | `@anthropic-ai/sdk` (Anthropic) | Defined in CLAUDE.md; Claude scores the proposals |
| Styling | Tailwind CSS + Lucide React | Defined in CLAUDE.md; utility-first, no extra UI library |
| Port | 3333 | Defined in CLAUDE.md |
| API key storage | `.env.local` → `process.env.ANTHROPIC_API_KEY` | Standard Next.js pattern; never committed |
| DB path | `subventia.db` at project root | Simple, local dev; defined in `nextjs-sqlite` skill |

## File Layout

```
/
├── .env.local                       # ANTHROPIC_API_KEY (not committed)
├── next.config.js                   # serverExternalPackages: ['better-sqlite3']
├── lib/db.js                        # SQLite singleton + schema init + seed
├── app/
│   ├── layout.jsx                   # Stachanov Professional header (#003366 navy)
│   ├── page.jsx                     # Dashboard shell (server component)
│   └── api/analyze/route.js         # POST { proposal } → ranked JSON array
└── components/
    ├── ProposalForm.jsx              # Textarea + Analyze button (client component)
    └── GrantCard.jsx                 # Score bar + citation per grant (client component)
```

## Data Model

```sql
CREATE TABLE IF NOT EXISTS grants (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  description         TEXT NOT NULL,
  eligibility_criteria TEXT NOT NULL,
  max_amount          INTEGER NOT NULL
)
```

Seeded with: `mit`, `wbso`, `efro` (3 Dutch government grants, as per `nextjs-sqlite` skill).

## API Contract

**POST /api/analyze**

Request:
```json
{ "proposal": "free-text project description" }
```

Response (ranked by `matchScore` desc):
```json
[
  {
    "grantId": "wbso",
    "grantName": "WBSO Speur- en Ontwikkelingswerk",
    "matchScore": 87,
    "matchedCriterion": "...",
    "recommendation": "Strong match. Recommend submitting full application."
  }
]
```

Error (400): `{ "error": "proposal is required" }`  
Error (500): `{ "error": "Analysis failed. Please try again." }` — returned on any Claude API failure or JSON parse error. UI renders an inline error message below the button.

## Design System (Stachanov Professional)

All tokens from CLAUDE.md:
- Header background: `#003366` (navy)
- Page background: `#F8FAFC`
- Cards: `rounded-lg border border-[#E2E8F0] bg-white shadow-sm` — no `rounded-xl`, no gradients
- Score bar colours: green (`#16A34A`) ≥ 80, amber (`#D97706`) 40–79, red (`#DC2626`) < 40
- Loading: spinner on Analyze button while request in flight

## Skill Coverage

| Technology | Skill exists? | Action needed |
|------------|--------------|---------------|
| Next.js 14 App Router + SQLite | ✅ `nextjs-sqlite` (local) | None |
| Grant scoring / Claude prompt | ✅ `financial_analysis` (local) | None |
| React components + UI | ✅ `frontend-design` (built-in) | None |
| Git / PR workflow | ✅ `git-workflow` (global) | None |
| Architecture → review → planning | ✅ `architecture`, `review`, `planning` (global) | None |

All technologies are covered by existing skills. No new skills required.

## Open Questions

None. Stack, design system, file layout, and API contract are fully specified in CLAUDE.md and the local skills.

## Next Step

→ Gate 2: Run `review` skill against this document, then present findings to user.
