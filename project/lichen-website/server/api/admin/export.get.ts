import { useDb } from '../../utils/db'
import { parseRow } from '../../utils/rows'

// Export CSV pour le dépouillement hors ligne.
// ⚠️ Le fichier contient la colonne « contact » : il relève du même délai de
// conservation que la base, et ne doit pas quitter un support chiffré.
const cell = (v: unknown) => {
  const s = Array.isArray(v) ? v.join('|') : v === true ? 'oui' : v === false ? 'non' : String(v ?? '')
  return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

export default defineEventHandler((event) => {
  const rows = (useDb().prepare('SELECT * FROM responses ORDER BY created_at').all() as any[]).map(parseRow)
  const cols = [
    'id', 'created_at', 'cadre', 'cadre_autre', 'ages', 'frequence', 'anciennete', 'groupe',
    'emporte', 'emporte_autre', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q11_autre',
    'q12', 'q13', 'contact', 'codes', 'notes'
  ] as const

  // Séparateur point-virgule et BOM : ouverture directe dans un tableur FR.
  const csv = '﻿' + [cols.join(';'), ...rows.map((r) => cols.map((c) => cell((r as any)[c])).join(';'))].join('\r\n')

  setResponseHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setResponseHeader(
    event,
    'Content-Disposition',
    `attachment; filename="questionnaire-${new Date().toISOString().slice(0, 10)}.csv"`
  )
  return csv
})
