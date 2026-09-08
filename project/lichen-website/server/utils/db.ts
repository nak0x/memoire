import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

// SQLite via le module natif de Node : aucune dépendance, aucun binaire à
// compiler, une seule pièce mobile à sauvegarder (le fichier .db).

let db: DatabaseSync | null = null

export function retentionMonths(): number {
  const n = Number(process.env.RETENTION_MONTHS || 6)
  return Number.isFinite(n) && n > 0 ? n : 6
}

export function dbPath(): string {
  return resolve(process.env.DB_PATH || './data/questionnaire.db')
}

export function useDb(): DatabaseSync {
  if (db) return db
  const path = dbPath()
  mkdirSync(dirname(path), { recursive: true })
  db = new DatabaseSync(path)
  db.exec('PRAGMA journal_mode = WAL;')
  db.exec('PRAGMA foreign_keys = ON;')
  db.exec(`
    CREATE TABLE IF NOT EXISTS responses (
      id           TEXT PRIMARY KEY,
      created_at   TEXT NOT NULL,
      cadre        TEXT NOT NULL,
      cadre_autre  TEXT,
      ages         TEXT NOT NULL DEFAULT '[]',
      frequence    TEXT NOT NULL,
      anciennete   TEXT NOT NULL,
      groupe       TEXT NOT NULL,
      emporte      TEXT NOT NULL DEFAULT '[]',
      emporte_autre TEXT,
      q6           TEXT NOT NULL,
      q7           TEXT NOT NULL,
      q8           INTEGER NOT NULL,
      q9           TEXT,
      q10          TEXT,
      q11          TEXT NOT NULL DEFAULT '[]',
      q11_autre    TEXT,
      q12          INTEGER NOT NULL DEFAULT 0,
      q13          TEXT,
      contact      TEXT,
      codes        TEXT NOT NULL DEFAULT '[]',
      notes        TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_responses_created ON responses(created_at);
    CREATE TABLE IF NOT EXISTS purge_log (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      ran_at  TEXT NOT NULL,
      cutoff  TEXT NOT NULL,
      deleted INTEGER NOT NULL
    );
  `)
  return db
}

/** Date limite de conservation : tout ce qui est antérieur doit disparaître. */
export function cutoffISO(): string {
  const d = new Date()
  d.setMonth(d.getMonth() - retentionMonths())
  return d.toISOString()
}

/**
 * Suppression effective des réponses hors délai de conservation.
 * Appelée au démarrage, par la tâche planifiée quotidienne, et en garde-fou
 * à l'écriture : la rétention ne dépend pas d'un seul mécanisme.
 */
export function purgeOldResponses(): { cutoff: string; deleted: number } {
  const d = useDb()
  const cutoff = cutoffISO()
  const res = d.prepare('DELETE FROM responses WHERE created_at < ?').run(cutoff)
  const deleted = Number(res.changes || 0)
  d.prepare('INSERT INTO purge_log (ran_at, cutoff, deleted) VALUES (?, ?, ?)').run(
    new Date().toISOString(),
    cutoff,
    deleted
  )
  // Le journal de purge lui-même reste borné.
  d.exec('DELETE FROM purge_log WHERE id NOT IN (SELECT id FROM purge_log ORDER BY id DESC LIMIT 120)')
  if (deleted > 0) console.info(`[retention] ${deleted} réponse(s) supprimée(s), antérieures à ${cutoff}`)
  return { cutoff, deleted }
}

let lastGuard = 0
/** Garde-fou : au plus une purge par heure, déclenchée par le trafic. */
export function purgeGuard(): void {
  const now = Date.now()
  if (now - lastGuard < 3_600_000) return
  lastGuard = now
  try {
    purgeOldResponses()
  } catch (e) {
    console.error('[retention] purge impossible', e)
  }
}

export function lastPurge(): { ran_at: string; cutoff: string; deleted: number } | null {
  const row = useDb()
    .prepare('SELECT ran_at, cutoff, deleted FROM purge_log ORDER BY id DESC LIMIT 1')
    .get() as any
  return row || null
}
