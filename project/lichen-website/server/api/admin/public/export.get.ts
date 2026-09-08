import { useDb } from '../../../utils/db'
import { parseRowPublic } from '../../../utils/rows-public'

// Export CSV du questionnaire grand public.
// ⚠️ Le fichier contient la colonne « contact » : il relève du même délai de
// conservation que la base, et ne doit pas quitter un support chiffré.
const cell = (v: unknown) => {
  const s = Array.isArray(v) ? v.join('|') : v === true ? 'oui' : v === false ? 'non' : String(v ?? '')
  return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

export default defineEventHandler((event) => {
  const rows = (useDb()
    .prepare('SELECT * FROM responses_public ORDER BY created_at')
    .all() as any[]).map(parseRowPublic)

  const cols = [
    'id', 'created_at', 'lien', 'ages', 'sorties', 'savoir', 'enfance',
    'gestes', 'gestes_autre', 'apps', 'apps_autre', 'voies', 'souvenir',
    'position', 'pourquoi', 'conditions', 'conditions_autre', 'age_mini',
    'entretien', 'contradicteur', 'contact', 'codes', 'notes'
  ] as const

  // Séparateur point-virgule et BOM : ouverture directe dans un tableur FR.
  const csv = '﻿' + [cols.join(';'), ...rows.map((r) => cols.map((c) => cell((r as any)[c])).join(';'))].join('\r\n')

  setResponseHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setResponseHeader(
    event,
    'Content-Disposition',
    `attachment; filename="questionnaire-public-${new Date().toISOString().slice(0, 10)}.csv"`
  )
  return csv
})
