import { useDb } from '../../../utils/db'
import { parseRowPublic, usesAppPublic, reachesForPhone, type RowPublic } from '../../../utils/rows-public'
import {
  LIENS, AGES_PROCHES, SORTIES, SAVOIRS, ENFANCE, GESTES, APPS, VOIES,
  CONDITIONS, AGES_MINI, CODES, VOIE_INVALIDEE, VOIES_ETABLIES,
  AGES_MINI_DIFFERENCIES, CONDITION_HYPOTHESE, OBJECTIF_REPONSES_PUBLIC
} from '../../../../shared/options'

const tally = (list: { v: string; l: string }[], pick: (r: RowPublic) => string[], rows: RowPublic[]) =>
  list.map((o) => ({ v: o.v, l: o.l, n: rows.filter((r) => pick(r).includes(o.v)).length }))

export default defineEventHandler(() => {
  const rows = (useDb()
    .prepare('SELECT * FROM responses_public ORDER BY created_at')
    .all() as any[]).map(parseRowPublic)

  // Le croisement central, identique à celui du questionnaire professionnel :
  // position déclarée sur l'échelle 1-5 × usage réel d'une application.
  const croisement = [1, 2, 3, 4, 5].map((n) => {
    const sub = rows.filter((r) => r.position === n)
    const avec = sub.filter(usesAppPublic).length
    return { position: n, avec, sans: sub.length - avec }
  })

  // Ce que le public croit VS ce que la littérature établit (§4.3).
  const citeNoms = rows.filter((r) => r.voies.includes(VOIE_INVALIDEE)).length
  const citeSensible = rows.filter((r) => r.voies.some((v) => VOIES_ETABLIES.includes(v))).length
  const nomsSeul = rows.filter(
    (r) => r.voies.includes(VOIE_INVALIDEE) && !r.voies.some((v) => VOIES_ETABLIES.includes(v))
  ).length

  // Lecture fermée des conditions, rattachées aux quatre hypothèses de rejet.
  const hypotheses = ['sensoriel', 'pratique', 'institutionnel', 'economique'].map((h) => ({
    v: h,
    n: rows.filter((r) => r.conditions.some((c) => CONDITION_HYPOTHESE[c] === h)).length
  }))

  return {
    total: rows.length,
    objectif: OBJECTIF_REPONSES_PUBLIC,
    premiere: rows[0]?.created_at || null,
    derniere: rows[rows.length - 1]?.created_at || null,
    liens: tally(LIENS, (r) => [r.lien], rows),
    ages: tally(AGES_PROCHES, (r) => r.ages, rows),
    sorties: tally(SORTIES, (r) => [r.sorties], rows),
    savoirs: tally(SAVOIRS, (r) => [r.savoir], rows),
    enfance: tally(ENFANCE, (r) => [r.enfance], rows),
    gestes: tally(GESTES, (r) => r.gestes, rows),
    apps: tally(APPS, (r) => r.apps, rows),
    voies: tally(VOIES, (r) => r.voies, rows),
    conditions: tally(CONDITIONS, (r) => r.conditions, rows),
    agesMini: tally(AGES_MINI, (r) => [r.age_mini], rows),
    codes: tally(CODES, (r) => r.codes, rows),
    position: [1, 2, 3, 4, 5].map((n) => ({ v: String(n), n: rows.filter((r) => r.position === n).length })),
    croisement,
    hypotheses,

    // Les trois écarts qui font l'intérêt de ce questionnaire.
    contradiction: rows.filter((r) => r.position >= 4 && usesAppPublic(r)).length,
    telephone: rows.filter((r) => r.position >= 4 && reachesForPhone(r)).length,
    accord: rows.filter((r) => r.position >= 4).length,
    citeNoms,
    citeSensible,
    nomsSeul,
    differencie: rows.filter((r) => AGES_MINI_DIFFERENCIES.includes(r.age_mini)).length,
    seuil: rows.filter((r) => !AGES_MINI_DIFFERENCIES.includes(r.age_mini)).length,

    parents: rows.filter((r) => r.lien === 'parent' || r.lien === 'grand-parent').length,
    sansEnfant: rows.filter((r) => r.lien === 'sans' || r.lien === 'entourage').length,
    pros: rows.filter((r) => r.lien === 'metier').length,

    pourquoiRemplies: rows.filter((r) => r.pourquoi.length > 0).length,
    pourquoiACoder: rows.filter((r) => r.pourquoi.length > 0 && r.codes.length === 0).length,
    souvenirs: rows.filter((r) => r.souvenir.length > 0).length,
    entretiens: rows.filter((r) => r.entretien).length,
    contacts: rows.filter((r) => r.contact.length > 0).length,
    contradicteurs: rows.filter((r) => r.contradicteur.length > 0).length
  }
})
