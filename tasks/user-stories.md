# User Stories — Subventia Oracle MVP

**Architecture ref**: `tasks/architecture.md`  
**Date**: 2026-04-16

---

### US-1: Project scaffolding

**As a** developer  
**I want** a correctly configured Next.js 14 project with all dependencies installed  
**So that** the app can be built and run locally without configuration errors

**Acceptance criteria:**
- [ ] `npm run dev` starts without errors on port 3333
- [ ] `better-sqlite3`, `@anthropic-ai/sdk`, `lucide-react`, and Tailwind CSS are installed
- [ ] `next.config.js` contains `serverExternalPackages: ['better-sqlite3']`
- [ ] `.env.local` exists at the project root with `ANTHROPIC_API_KEY` defined
- [ ] `.gitignore` excludes `.env.local` and `subventia.db`

**Linked tasks:** T-1, T-2, T-3, T-4, T-5  
**Architecture ref:** Tech Decisions, File Layout  
**Priority:** Must

---

### US-2: Grant database

**As a** developer  
**I want** a SQLite database initialised with 3 Dutch government grants on first run  
**So that** the API route has structured grant data to score proposals against

**Acceptance criteria:**
- [ ] `lib/db.js` exports a singleton `getDb()` — no new connection opened on hot reload
- [ ] The `grants` table is created automatically if it doesn't exist
- [ ] On first run, exactly 3 rows are seeded: `mit`, `wbso`, `efro`
- [ ] Re-running the server does not duplicate rows (seed is idempotent)

**Linked tasks:** T-6  
**Architecture ref:** Data Model, File Layout  
**Priority:** Must

---

### US-3: Grant analysis API

**As a** frontend client  
**I want** to POST a free-text proposal to `/api/analyze` and receive a ranked JSON array  
**So that** each grant can be scored and displayed with a citation

**Acceptance criteria:**
- [ ] `POST /api/analyze` with `{ proposal: "..." }` returns a JSON array ranked by `matchScore` descending
- [ ] Every grant in the database appears in the response (no omissions)
- [ ] Each response item contains: `grantId`, `grantName`, `matchScore`, `matchedCriterion`, `recommendation`
- [ ] Empty or missing `proposal` returns `400 { "error": "proposal is required" }`
- [ ] Claude API failure or JSON parse error returns `500 { "error": "Analysis failed. Please try again." }`
- [ ] The `financial_analysis` skill scoring rules and citation format are applied via the prompt

**Linked tasks:** T-7, T-8, T-9, T-10  
**Architecture ref:** API Contract, Proposed Solution  
**Priority:** Must

---

### US-4: Grant eligibility dashboard

**As an** applicant  
**I want** to paste my project proposal into a dashboard and see ranked grant matches with scores  
**So that** I can quickly understand which grants are most relevant to my project

**Acceptance criteria:**
- [ ] Page renders at `localhost:3333` with a navy `#003366` header containing "Subventia Oracle"
- [ ] Page background is `#F8FAFC`; no gradients anywhere on the page
- [ ] A full-width textarea (8 rows) accepts the proposal text
- [ ] Clicking "Analyze" shows a loading spinner on the button while the request is in flight
- [ ] Results render one card per grant: name, coloured score bar, numeric score, and `matchedCriterion` sentence
- [ ] Score bar is green (`#16A34A`) for ≥ 80, amber (`#D97706`) for 40–79, red (`#DC2626`) for < 40
- [ ] Cards use `rounded-lg border border-[#E2E8F0] bg-white shadow-sm` — no `rounded-xl`
- [ ] On API error, an inline error message appears below the button (no console-only handling)

**Linked tasks:** T-11, T-12, T-13, T-14, T-15, T-16  
**Architecture ref:** Design System, File Layout  
**Priority:** Must

---

### US-5: Committed and published to GitHub

**As a** stakeholder  
**I want** the working app committed and a PR opened on GitHub  
**So that** the code is version-controlled and reviewable

**Acceptance criteria:**
- [ ] All source files are staged and committed with a conventional commit message
- [ ] `.env.local` and `subventia.db` are NOT committed
- [ ] A feature branch is pushed to the remote `aukehofman97/stachanov-claude-workshop` repo
- [ ] A pull request is opened on GitHub using the `git-workflow` skill

**Linked tasks:** T-17, T-18, T-19, T-20  
**Architecture ref:** Next Step (git-workflow)  
**Priority:** Must
