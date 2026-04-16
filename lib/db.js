import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'subventia.db')

let db

function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    initSchema()
  }
  return db
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS grants (
      id                   TEXT PRIMARY KEY,
      name                 TEXT NOT NULL,
      description          TEXT NOT NULL,
      eligibility_criteria TEXT NOT NULL,
      max_amount           INTEGER NOT NULL
    )
  `)
  seedIfEmpty()
}

function seedIfEmpty() {
  const { n } = db.prepare('SELECT COUNT(*) as n FROM grants').get()
  if (n > 0) return

  const insert = db.prepare(`
    INSERT INTO grants (id, name, description, eligibility_criteria, max_amount)
    VALUES (@id, @name, @description, @eligibility_criteria, @max_amount)
  `)

  const insertAll = db.transaction((rows) => {
    for (const row of rows) insert.run(row)
  })

  insertAll([
    {
      id: 'mit',
      name: 'MIT Haalbaarheidsproject',
      description: 'Innovation feasibility studies for SMEs.',
      eligibility_criteria:
        'Must be an SME (fewer than 250 employees). Project must involve a technological innovation with demonstrable market potential.',
      max_amount: 20000,
    },
    {
      id: 'wbso',
      name: 'WBSO Speur- en Ontwikkelingswerk',
      description: 'R&D tax credit for technical development work.',
      eligibility_criteria:
        'Must employ technical staff in the Netherlands. Project must involve developing new software, hardware, or processes not previously available.',
      max_amount: 500000,
    },
    {
      id: 'efro',
      name: 'Europees Fonds Regionale Ontwikkeling (EFRO)',
      description: 'Regional development co-funding.',
      eligibility_criteria:
        'Project must create employment in a designated development region. Must contribute to sustainable economic development. Co-funding from applicant required.',
      max_amount: 2000000,
    },
  ])
}

export default getDb
