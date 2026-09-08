import { useDb } from '../../../utils/db'
import { parseRowPublic } from '../../../utils/rows-public'

// Liste compacte : de quoi remplir un tableau, pas de quoi lire les réponses
// ouvertes (elles sont sur la page de détail).
export default defineEventHandler(() => {
  const rows = (useDb()
    .prepare('SELECT * FROM responses_public ORDER BY created_at DESC')
    .all() as any[]).map(parseRowPublic)

  return rows.map((r) => ({
    id: r.id,
    created_at: r.created_at,
    lien: r.lien,
    sorties: r.sorties,
    position: r.position,
    apps: r.apps,
    nbApps: r.apps.filter((a) => a !== 'aucune').length,
    voies: r.voies,
    age_mini: r.age_mini,
    aPourquoi: r.pourquoi.length > 0,
    aSouvenir: r.souvenir.length > 0,
    codes: r.codes,
    entretien: r.entretien,
    contact: r.contact,
    aContradicteur: r.contradicteur.length > 0
  }))
})
