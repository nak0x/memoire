import {
  LIENS, AGES_PROCHES, SORTIES, SAVOIRS, ENFANCE, GESTES, APPS, VOIES,
  CONDITIONS, AGES_MINI, values
} from '../../shared/options'

// Non exportées : `validate.ts` porte déjà des constantes de ces noms, et
// l'auto-import de Nitro ne distingue pas deux exports homonymes.
const MAX_TEXT = 4000
const MAX_SHORT = 200

const inSet = (list: { v: string }[], v: unknown): v is string =>
  typeof v === 'string' && values(list).includes(v)

const many = (list: { v: string }[], v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x) => inSet(list, x)).slice(0, list.length) : []

const text = (v: unknown, max = MAX_TEXT): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

export interface CleanPublic {
  lien: string; ages: string[]; sorties: string; savoir: string; enfance: string
  gestes: string[]; gestes_autre: string; apps: string[]; apps_autre: string
  voies: string[]; souvenir: string; position: number; pourquoi: string
  conditions: string[]; conditions_autre: string; age_mini: string
  entretien: number; contradicteur: string; contact: string
}

/** Renvoie la réponse nettoyée, ou la liste des champs invalides. */
export function validatePublic(
  body: any
): { ok: true; data: CleanPublic } | { ok: false; errors: string[] } {
  const errors: string[] = []
  const b = body && typeof body === 'object' ? body : {}

  if (!inSet(LIENS, b.lien)) errors.push('lien')

  // L'âge des enfants n'a de sens que pour qui en côtoie : ne pas l'exiger de
  // quelqu'un qui vient de répondre qu'il n'en côtoie pas.
  const ages = many(AGES_PROCHES, b.ages)
  if (b.lien !== 'sans' && !ages.length) errors.push('ages')

  if (!inSet(SORTIES, b.sorties)) errors.push('sorties')
  if (!inSet(SAVOIRS, b.savoir)) errors.push('savoir')
  if (!inSet(ENFANCE, b.enfance)) errors.push('enfance')

  const gestes = many(GESTES, b.gestes)
  if (!gestes.length) errors.push('gestes')

  const apps = many(APPS, b.apps)
  if (!apps.length) errors.push('apps')

  const voies = many(VOIES, b.voies)
  if (!voies.length) errors.push('voies')

  const position = Number(b.position)
  if (!Number.isInteger(position) || position < 1 || position > 5) errors.push('position')

  // Même règle que la Q9 du questionnaire professionnel : le « pourquoi » n'est
  // exigé que de ceux qui ont déclaré un accord. C'est ce texte qui sera codé.
  const pourquoi = text(b.pourquoi)
  if (position >= 4 && !pourquoi) errors.push('pourquoi')

  const conditions = many(CONDITIONS, b.conditions)
  if (!conditions.length) errors.push('conditions')

  if (!inSet(AGES_MINI, b.age_mini)) errors.push('age_mini')

  if (errors.length) return { ok: false, errors }

  return {
    ok: true,
    data: {
      lien: b.lien,
      ages: b.lien === 'sans' ? [] : ages,
      sorties: b.sorties,
      savoir: b.savoir,
      enfance: b.enfance,
      gestes,
      gestes_autre: gestes.includes('autre') ? text(b.gestes_autre, MAX_SHORT) : '',
      apps,
      apps_autre: apps.includes('autre') ? text(b.apps_autre, MAX_SHORT) : '',
      voies,
      souvenir: text(b.souvenir),
      position,
      pourquoi,
      conditions,
      conditions_autre: conditions.includes('autre') ? text(b.conditions_autre, MAX_SHORT) : '',
      age_mini: b.age_mini,
      entretien: b.entretien ? 1 : 0,
      contradicteur: text(b.contradicteur),
      contact: text(b.contact, 500)
    }
  }
}
