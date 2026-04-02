# Stachanov Engineering Standards

This file defines the architecture and coding standards for the **Subventia Oracle** project.
Claude Code reads this file before every session. Do not deviate from these standards without explicit instruction.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router) — use server components by default, client components only when interactivity is required
- **Styling:** Tailwind CSS + Lucide React icons — no other UI libraries, no custom CSS files
- **Database:** SQLite via `better-sqlite3` — synchronous queries only, no ORMs, no Prisma
- **AI layer:** Claude handles unstructured text analysis only. All financial/scoring logic is deterministic code.

---

## Design System: "Stachanov Professional"

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#003366` | Header background, primary buttons |
| Secondary | `#1A56DB` | Links, active states |
| Background | `#F8FAFC` | Page background |
| Surface | `#FFFFFF` | Cards, panels |
| Text | `#1E293B` | Body copy |
| Muted | `#64748B` | Labels, secondary text |
| Border | `#E2E8F0` | Dividers, card borders |
| Success | `#16A34A` | High match scores |
| Warning | `#D97706` | Medium match scores |
| Danger | `#DC2626` | Low match scores |

**Visual rules:**
- No gradients. No animations beyond subtle hover state transitions (`transition-colors duration-150`).
- Cards use `rounded-lg border border-[#E2E8F0] bg-white shadow-sm` — not `rounded-xl`, not `shadow-lg`.
- Typography: `font-sans`, headings `font-semibold`, body `font-normal`. No display fonts.
- Buttons: solid fill for primary actions, outlined for secondary. No ghost buttons on white backgrounds.

---

## Architecture

```
/
├── lib/
│   └── db.js                    # SQLite connection + schema + seed data
├── app/
│   ├── layout.jsx               # Root layout: Stachanov header + global styles
│   ├── page.jsx                 # Main dashboard (server component shell)
│   └── api/
│       └── analyze/
│           └── route.js         # POST { proposal } → { matches[] }
└── components/
    ├── ProposalForm.jsx          # Textarea + submit button (client component)
    └── GrantCard.jsx             # Single grant match result card
```

---

## Engineering Rules

1. **Data layer is dumb.** `lib/db.js` only reads and writes. No business logic lives here.
2. **API layer is thin.** `/api/analyze/route.js` calls the `financial_analysis` skill prompt, parses the response, and returns JSON. No UI logic.
3. **UI layer is presentational.** Components receive props and render markup. No direct DB access from components.
4. **AI citation is mandatory.** Every grant match result MUST include a `matchedCriterion` field explaining which specific grant rule triggered the score. "Good fit" is not acceptable.
5. **Deterministic fallback.** If AI analysis fails, fall back to keyword-match scoring. Never return an empty result set to the user.
6. **No hallucination tolerance.** If the proposal contains no evidence for a criterion, the score cannot exceed 40. Be conservative — false positives waste civil servants' time.

---

## Sample Grants (Seed Data)

Seed the database with these three grants:

1. **MIT Haalbaarheidsproject** — Innovation feasibility studies for SMEs. Eligibility: must be an SME, project must involve a technological innovation with demonstrable market potential. Max: €20,000.
2. **WBSO Speur- en Ontwikkelingswerk** — R&D tax credit for technical development work. Eligibility: must employ technical staff in the Netherlands, project must involve developing new software, hardware, or processes. Max: €500,000.
3. **Europees Fonds Regionale Ontwikkeling (EFRO)** — Regional development co-funding. Eligibility: project must create employment in a designated region, contribute to sustainable economic development. Max: €2,000,000.
