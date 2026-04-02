---
name: nextjs-sqlite
description: |
  Guides correct Next.js 14 App Router + better-sqlite3 implementation patterns.

  Use this skill whenever writing or reviewing any Next.js App Router code that touches SQLite in this project — including route handlers, DB initialization, server components reading from the DB, and next.config.js setup. Invoke it even if the user just says "set up the database" or "create the API route" — the patterns here prevent the most common live-demo-breaking mistakes with better-sqlite3 in Next.js.
---

# Next.js 14 + better-sqlite3 Skill

## Why this skill exists

`better-sqlite3` is a **synchronous** SQLite library. This is unusual in Node.js and catches people out constantly — including Claude. The patterns below prevent the most common failure modes when combining Next.js App Router with SQLite.

## 1. next.config.js — required, non-negotiable

`better-sqlite3` is a native Node.js module (compiled C++). Next.js tries to bundle server code by default and **will fail** when it encounters native modules. Add this to `next.config.js` before writing any other code:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3'],
}

module.exports = nextConfig
```

Without this, the build crashes with a `Module parse failed` or `Cannot find module` error on `better-sqlite3`.

## 2. DB initialization — singleton pattern

Next.js in development mode hot-reloads modules, which would open a new DB connection on every change and leak handles. Use a module-level singleton:

```js
// lib/db.js
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'subventia.db')

// Module-level singleton — survives hot reloads in dev
let db

function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL') // safer for concurrent reads
    initSchema()
  }
  return db
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS grants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      eligibility_criteria TEXT NOT NULL,
      max_amount INTEGER NOT NULL
    )
  `)
  seedIfEmpty()
}

function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) as n FROM grants').get()
  if (count.n > 0) return

  const insert = db.prepare(`
    INSERT INTO grants (id, name, description, eligibility_criteria, max_amount)
    VALUES (@id, @name, @description, @eligibility_criteria, @max_amount)
  `)

  const grants = db.transaction((rows) => {
    for (const row of rows) insert.run(row)
  })

  grants([
    {
      id: 'mit',
      name: 'MIT Haalbaarheidsproject',
      description: 'Innovation feasibility studies for SMEs.',
      eligibility_criteria: 'Must be an SME (fewer than 250 employees). Project must involve a technological innovation with demonstrable market potential.',
      max_amount: 20000,
    },
    {
      id: 'wbso',
      name: 'WBSO Speur- en Ontwikkelingswerk',
      description: 'R&D tax credit for technical development work.',
      eligibility_criteria: 'Must employ technical staff in the Netherlands. Project must involve developing new software, hardware, or processes not previously available.',
      max_amount: 500000,
    },
    {
      id: 'efro',
      name: 'Europees Fonds Regionale Ontwikkeling (EFRO)',
      description: 'Regional development co-funding.',
      eligibility_criteria: 'Project must create employment in a designated development region. Must contribute to sustainable economic development. Co-funding from applicant required.',
      max_amount: 2000000,
    },
  ])
}

export default getDb
```

## 3. Route handler — synchronous DB, async Claude call

The route handler is `async` (because the Claude API call is async), but all DB operations are synchronous — no `await` on DB calls:

```js
// app/api/analyze/route.js
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import getDb from '@/lib/db'

const client = new Anthropic()

export async function POST(request) {
  const { proposal } = await request.json()

  if (!proposal?.trim()) {
    return NextResponse.json({ error: 'proposal is required' }, { status: 400 })
  }

  // Synchronous — no await
  const db = getDb()
  const grants = db.prepare('SELECT * FROM grants').all()

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a grant eligibility analyst. Score this proposal against the grants below using the financial_analysis skill rules.

Proposal:
${proposal}

Grants:
${JSON.stringify(grants, null, 2)}

Return only a valid JSON array, sorted by matchScore descending.`,
      },
    ],
  })

  const text = message.content[0].text
  // Strip any accidental markdown fences before parsing
  const json = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()

  return NextResponse.json(JSON.parse(json))
}
```

## 4. Common mistakes to avoid

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| `await db.prepare(...).all()` | TypeError — `.all()` is sync, not a Promise | Remove `await` |
| Missing `serverExternalPackages` in next.config.js | Build fails with native module error | See section 1 |
| Opening DB in component body | New connection on every render | Use singleton in lib/db.js |
| Not handling JSON parse failure | 500 error when Claude response has extra text | Strip markdown fences before `JSON.parse` |
| `new Database()` on every request | File handle leak, "database is locked" errors | Use module-level singleton |

## 5. Package versions (known-working)

```json
{
  "better-sqlite3": "^9.4.3",
  "next": "^14.2.0",
  "@anthropic-ai/sdk": "^0.39.0"
}
```
