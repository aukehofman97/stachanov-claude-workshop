# Stachanov × Claude Code Workshop

> **Live demo repo.** This folder is the *starting point* — it contains the standards and skills. Claude Code builds the app.

---

## What Is Claude Code?

Claude Code is Anthropic's agentic CLI. It runs in your terminal and has direct access to your file system, shell, and Git. You talk to it like a senior engineer: describe what you want, and it reads, writes, and edits code across your entire project.

Unlike a chat interface, Claude Code:

- **Reads your codebase** before suggesting changes
- **Executes commands** — tests, builds, Git operations
- **Follows project-specific instructions** via `.claude/CLAUDE.md`
- **Uses skills** — reusable instruction sets that shape how it approaches specific tasks

---

## Why Use It?

- Eliminate the copy-paste loop between chat and editor
- Enforce your team's standards automatically — the AI reads your rules before every session
- Go from a blank folder to a working full-stack app in minutes
- Every step is visible in the terminal — reviewable, auditable output

---

## Prerequisites

### 1. Node.js ≥ 18

```bash
node --version
```

### 2. Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
```

### 3. Anthropic Account

Claude Code requires a **Claude.ai Pro subscription (~$20/month)** or an Anthropic API key with credits.

Sign up at: [https://claude.ai](https://claude.ai)

### 4. Authenticate

```bash
claude
# Follow the browser login prompt on first run
```

### 5. GitHub CLI (optional, for this repo setup only)

```bash
brew install gh && gh auth login
```

---

## Global Skills vs Local Skills

This is one of the most powerful — and least understood — features of Claude Code.

|  | **Global Skills** | **Local Skills** |
|---|---|---|
| **Location** | `~/.claude/skills/` | `.claude/skills/` ← this repo |
| **Scope** | Every project on your machine | Only this project |
| **Use case** | Workflow gates, architecture, review, git | Domain-specific logic (grant analysis, etc.) |
| **Examples** | `/architecture`, `/review`, `/planning`, `/git-workflow` | `/financial_analysis`, `/nextjs-sqlite` |

The global `git-workflow` skill is already configured and covers branching strategy, commit conventions, PR rules, and release tagging. It activates automatically whenever you mention "commit", "branch", "PR", or "release".

### The Global Workflow — Four Gates

A well-configured global `~/.claude/CLAUDE.md` can enforce a structured process for every non-trivial feature. The presenter's global setup enforces these four gates before any implementation code is written:

```
Gate 1 → /architecture    Produces tasks/architecture.md
Gate 2 → /review          STOP. Present to user. Wait for approval.
Gate 3 → /planning        Produces tasks/todo-YYYY-MM-DD.md
Gate 4 → /review          STOP. Present to user. Wait for approval.
                          → Only now write implementation code.
```

This prevents Claude from "just vibing" and producing unmaintainable code. Every significant change goes through a structured approval loop — defined once, applied everywhere.

> **The local `CLAUDE.md` in this repo** defines the project-specific rules (stack, design system, architecture). The global one defines *how Claude works as an engineer*. Together they form a complete SOP.

---

## How to Create a Skill

Skills are Markdown files that tell Claude *how* to approach a specific task. To create a new local skill, run this inside Claude Code:

```
/skill-creator
```

Claude will ask clarifying questions, generate the skill file in `.claude/skills/`, and run evaluations to verify it behaves as intended. Both skills in this repo (`financial_analysis` and `nextjs-sqlite`) were created using this process.

---

## The Demo Project: Subventia Oracle

**Goal:** Build a grant eligibility pre-screener in one shot — a full-stack app from zero.

**The pitch:** UWV and Gemeente Amsterdam manage hundreds of subsidy applications manually. This AI layer reduces manual pre-screening by ~80% by matching unstructured proposal text against structured grant criteria.

**Stack** (defined in `.claude/CLAUDE.md`, so Claude already knows):

- **Next.js 14** (App Router) + Tailwind CSS + Lucide Icons
- **SQLite** via `better-sqlite3` — 3 sample Dutch government grants
- Runs locally — requires an **Anthropic API key** stored in `.env.local`
- AI is used *only* for unstructured text analysis; all financial logic is deterministic

---

## Running the Demo

### 1. Clone and open

```bash
git clone https://github.com/aukehofman97/stachanov-claude-workshop
cd stachanov-claude-workshop
claude
```

Claude Code automatically picks up `.claude/CLAUDE.md` and the skills in `.claude/skills/`.

### 2. Paste the demo prompt

```
Based on our project standards in CLAUDE.md, build the Subventia Oracle MVP.

Requirements:
- Create a .env.local file at the project root and store the Anthropic API key there as ANTHROPIC_API_KEY. Read it from process.env in the API route.
- SQLite database (lib/db.js) with a 'grants' table seeded with 3 sample Dutch government grants. Each grant has: id, name, description, eligibility_criteria, max_amount.
- A Next.js API route at /api/analyze that accepts POST { proposal: string }, uses the financial_analysis skill to score the proposal against each grant, and returns a ranked JSON array.
- A React dashboard at localhost:3333: navy (#003366) header with "Subventia Oracle" title, full-width textarea (8 rows) for the proposal, an "Analyze" button, and a results section below showing one card per grant with: grant name, a colored score bar (green ≥80, amber 40–79, red <40), the numeric score, and one sentence citing the matched criterion. Show a loading spinner on the button while the request is in flight.
- Use the frontend-design skill for all React components and UI work.
- Follow the Stachanov Professional design system and architecture defined in CLAUDE.md exactly.

Build the whole thing now.
```

### 3. Four gates — plan before building

Before writing a single line of code, the global `~/.claude/CLAUDE.md` enforces four mandatory gates:

```
Gate 1 → /architecture    Produces tasks/architecture.md — tech choices, file layout, trade-offs
Gate 2 → /review          STOP. Claude presents findings. You approve or push back.
Gate 3 → /planning        Produces tasks/todo-YYYY-MM-DD.md — block-structured task breakdown
Gate 4 → /review          STOP. Claude validates the plan is complete and implementable. You approve.
                          → Only now does implementation code get written.
```

These gates are non-negotiable: Claude names any gate it wants to skip and waits for explicit permission. This prevents unreviewed, unmaintainable output — every significant change goes through a structured approval loop defined once, applied everywhere.

### 4. Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3333](http://localhost:3333).

### 5. Push to GitHub with git-workflow

Once the app is running, use the `git-workflow` skill to commit and push. The skill handles branch naming, commit message conventions, PR creation, and release tagging automatically. Just tell Claude:

```
Commit and push the Subventia Oracle MVP to GitHub.
```

Claude will invoke `/git-workflow`, stage the files, write a conventional commit message, create a feature branch, open a PR, and merge it — all without you touching git directly.

---

## Expected End Result

A running Next.js app with:

- Clean dashboard — Navy `#003366` header, `#F8FAFC` background, no gradients
- Textarea for pasting a project proposal
- **Analyze** button → calls `/api/analyze`
- Results panel: ranked grant cards showing name, match score, and a one-sentence explanation citing the specific grant criterion

**Total demo time: ~5 minutes.**

---

## Sample Demo Proposal

Paste this into the app during the demo to show a realistic match against the seeded grants:

```
Organisation: Dataflow Solutions B.V. (SME, 18 employees, Amsterdam)

Project: AI-Assisted Invoice Reconciliation Engine

We are developing a machine learning system that automatically matches incoming invoices against purchase orders and flags discrepancies for human review. The core innovation is a custom transformer model trained on Dutch-language financial documents — existing off-the-shelf OCR tools fail on Dutch accounting terminology and multi-column VAT breakdowns.

The project involves 12 months of software development by 4 FTE developers and 1 FTE data scientist, all employed in the Netherlands. We are building novel software from scratch with no existing open-source equivalent. Total R&D payroll cost: €320,000.

We will apply the system internally first, then license it to mid-market accountancy firms in the Netherlands and Belgium. Expected first commercial release: Q3 2026.

We are seeking co-funding to cover 50% of the R&D payroll cost (€160,000) and have secured a €40,000 commitment from a strategic partner. No physical relocation is required; all work happens at our Amsterdam HQ.
```

This proposal is designed to score strongly on **WBSO** (NL-based tech staff, novel software development) and reasonably on **MIT Haalbaarheidsproject** (SME + technology innovation), while scoring low on EFRO (no designated region requirement met).

---

## Repo Structure

```
stachanov-claude-workshop/
├── .claude/
│   ├── CLAUDE.md                    # Project-specific standards (stack, design tokens, architecture)
│   └── skills/
│       ├── financial_analysis.md    # Local skill: grant scoring, JSON output contract, citation rules
│       └── nextjs-sqlite.md         # Local skill: Next.js App Router + better-sqlite3 patterns
├── .gitignore                       # Next.js + SQLite + Claude workspace exclusions
└── README.md                        # This file
```

> The global `~/.claude/CLAUDE.md` handles engineering workflow (four gates, bug triage, planning). The local `CLAUDE.md` only adds what's project-specific: stack, design tokens, file layout, and which skills to activate.

The app files (`lib/`, `app/`, `components/`) are generated live during the demo.
