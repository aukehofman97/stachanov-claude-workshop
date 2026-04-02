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
| **Use case** | Workflow gates, architecture, review | Domain-specific logic (grant analysis, etc.) |
| **Examples** | `/architecture`, `/review`, `/planning` | `/financial_analysis` |

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

Claude will ask clarifying questions, generate the skill file in `.claude/skills/`, and run evaluations to verify it behaves as intended. The `financial_analysis` skill in this repo was created this way.

---

## The Demo Project: Subventia Oracle

**Goal:** Build a grant eligibility pre-screener in one shot — a full-stack app from zero.

**The pitch:** UWV and Gemeente Amsterdam manage hundreds of subsidy applications manually. This AI layer reduces manual pre-screening by ~80% by matching unstructured proposal text against structured grant criteria.

**Stack** (defined in `.claude/CLAUDE.md`, so Claude already knows):

- **Next.js 14** (App Router) + Tailwind CSS + Lucide Icons
- **SQLite** via `better-sqlite3` — 3 sample Dutch government grants
- **No cloud, no API keys** — runs entirely locally
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
- SQLite database (lib/db.js) with a 'grants' table seeded with 3 sample Dutch government grants. Each grant has: id, name, description, eligibility_criteria, max_amount.
- A Next.js API route at /api/analyze that accepts POST { proposal: string }, uses the financial_analysis skill to score the proposal against each grant, and returns a ranked JSON array.
- A professional React dashboard at localhost:3000 where users paste their project proposal and see a ranked list of matching grants with a Match Score (0-100%) and one sentence citing the specific matched criterion.
- Follow the Stachanov Professional design system and architecture defined in CLAUDE.md exactly.

Build the whole thing now.
```

### 3. Approve the plan

Claude will generate a multi-step plan. Type `y` to approve. Watch it build.

### 4. Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Expected End Result

A running Next.js app with:

- Clean dashboard — Navy `#003366` header, `#F8FAFC` background, no gradients
- Textarea for pasting a project proposal
- **Analyze** button → calls `/api/analyze`
- Results panel: ranked grant cards showing name, match score, and a one-sentence explanation citing the specific grant criterion

**Total demo time: ~5 minutes.**

---

## Repo Structure

```
stachanov-claude-workshop/
├── .claude/
│   ├── CLAUDE.md                    # Project standards — Claude reads this first
│   └── skills/
│       └── financial_analysis.md    # Local skill: grant eligibility scoring
└── README.md                        # This file
```

The app files (`lib/`, `app/`, `components/`) are generated live during the demo.
