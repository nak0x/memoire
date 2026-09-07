import { useDb } from '../../utils/db'
import { parseRow } from '../../utils/rows'

// Liste compacte : de quoi remplir un tableau, pas de quoi lire les réponses
// ouvertes (elles sont sur la page de détail).
export default defineEventHandler(() => {
  const rows = (useDb().prepare('SELECT * FROM responses ORDER BY created_at DESC').all() as any[]).map(parseRow)
  return rows.map((r) => ({
    id: r.id,
    created_at: r.created_at,
    cadre: r.cadre,
    frequence: r.frequence,
    q8: r.q8,
    q11: r.q11,
    nbApps: r.q11.filter((a) => a !== 'aucune').length,
    aQ9: r.q9.length > 0,
    codes: r.codes,
    q12: r.q12,
    contact: r.contact,
    aQ13: r.q13.length > 0
  }))
})
