import { CADRES, AGES, FREQUENCES, ANCIENNETES, GROUPES, EMPORTE, APPS, values } from '../../shared/options'

export const MAX_TEXT = 4000
export const MAX_SHORT = 200

const inSet = (list: { v: string }[], v: unknown): v is string =>
  typeof v === 'string' && values(list).includes(v)

const many = (list: { v: string }[], v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x) => inSet(list, x)).slice(0, list.length) : []

const text = (v: unknown, max = MAX_TEXT): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

export interface Clean {
  cadre: string; cadre_autre: string; ages: string[]; frequence: string
  anciennete: string; groupe: string; emporte: string[]; emporte_autre: string
  q6: string; q7: string; q8: number; q9: string; q10: string
  q11: string[]; q11_autre: string; q12: number; q13: string; contact: string
}

/** Renvoie la réponse nettoyée, ou la liste des champs invalides. */
export function validate(body: any): { ok: true; data: Clean } | { ok: false; errors: string[] } {
  const errors: string[] = []
  const b = body && typeof body === 'object' ? body : {}

  if (!inSet(CADRES, b.cadre)) errors.push('cadre')
  const ages = many(AGES, b.ages)
  if (!ages.length) errors.push('ages')
  if (!inSet(FREQUENCES, b.frequence)) errors.push('frequence')
  if (!inSet(ANCIENNETES, b.anciennete)) errors.push('anciennete')
  if (!inSet(GROUPES, b.groupe)) errors.push('groupe')
  const emporte = many(EMPORTE, b.emporte)
  if (!emporte.length) errors.push('emporte')

  const q6 = text(b.q6)
  if (!q6) errors.push('q6')
  const q7 = text(b.q7)
  if (!q7) errors.push('q7')

  const q8 = Number(b.q8)
  if (!Number.isInteger(q8) || q8 < 1 || q8 > 5) errors.push('q8')

  // Q9 : le cœur du dépouillement. Obligatoire seulement si la position
  // déclarée est un accord (4 ou 5) — demander « pourquoi » à quelqu'un qui
  // n'est pas d'accord n'a pas de sens.
  const q9 = text(b.q9)
  if (q8 >= 4 && !q9) errors.push('q9')

  const q11 = many(APPS, b.q11)
  if (!q11.length) errors.push('q11')

  if (errors.length) return { ok: false, errors }

  return {
    ok: true,
    data: {
      cadre: b.cadre,
      cadre_autre: b.cadre === 'autre' ? text(b.cadre_autre, MAX_SHORT) : '',
      ages,
      frequence: b.frequence,
      anciennete: b.anciennete,
      groupe: b.groupe,
      emporte,
      emporte_autre: emporte.includes('autre') ? text(b.emporte_autre, MAX_SHORT) : '',
      q6,
      q7,
      q8,
      q9,
      q10: text(b.q10),
      q11,
      q11_autre: q11.includes('autre') ? text(b.q11_autre, MAX_SHORT) : '',
      q12: b.q12 ? 1 : 0,
      q13: text(b.q13),
      contact: text(b.contact, 500)
    }
  }
}
