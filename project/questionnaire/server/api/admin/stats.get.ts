import { useDb, lastPurge, cutoffISO, retentionMonths } from '../../utils/db'
import { parseRow, usesApp, type Row } from '../../utils/rows'
import { CADRES, AGES, FREQUENCES, ANCIENNETES, GROUPES, EMPORTE, APPS, CODES, OBJECTIF_REPONSES } from '../../../shared/options'

const tally = (list: { v: string }[], pick: (r: Row) => string[], rows: Row[]) =>
  list.map((o) => ({ v: o.v, l: o.l, n: rows.filter((r) => pick(r).includes(o.v)).length }))

export default defineEventHandler(() => {
  const rows = (useDb().prepare('SELECT * FROM responses ORDER BY created_at').all() as any[]).map(parseRow)

  // Le croisement Q8 × Q11 : combien déclarent que le numérique n'a rien à
  // faire dehors, et utilisent malgré tout une application naturaliste.
  const croisement = [1, 2, 3, 4, 5].map((n) => {
    const sub = rows.filter((r) => r.q8 === n)
    const avec = sub.filter(usesApp).length
    return { position: n, avec, sans: sub.length - avec }
  })

  return {
    total: rows.length,
    objectif: OBJECTIF_REPONSES,
    premiere: rows[0]?.created_at || null,
    derniere: rows[rows.length - 1]?.created_at || null,
    cadres: tally(CADRES, (r) => [r.cadre], rows),
    ages: tally(AGES, (r) => r.ages, rows),
    frequences: tally(FREQUENCES, (r) => [r.frequence], rows),
    anciennetes: tally(ANCIENNETES, (r) => [r.anciennete], rows),
    groupes: tally(GROUPES, (r) => [r.groupe], rows),
    emporte: tally(EMPORTE, (r) => r.emporte, rows),
    apps: tally(APPS, (r) => r.q11, rows),
    codes: tally(CODES, (r) => r.codes, rows),
    q8: [1, 2, 3, 4, 5].map((n) => ({ v: String(n), n: rows.filter((r) => r.q8 === n).length })),
    croisement,
    contradiction: rows.filter((r) => r.q8 >= 4 && usesApp(r)).length,
    accord: rows.filter((r) => r.q8 >= 4).length,
    q9Remplies: rows.filter((r) => r.q9.length > 0).length,
    q9ACoder: rows.filter((r) => r.q9.length > 0 && r.codes.length === 0).length,
    entretiens: rows.filter((r) => r.q12).length,
    contacts: rows.filter((r) => r.contact.length > 0).length,
    contradicteurs: rows.filter((r) => r.q13.length > 0).length,
    retention: {
      mois: retentionMonths(),
      cutoff: cutoffISO(),
      derniere: lastPurge()
    }
  }
})
