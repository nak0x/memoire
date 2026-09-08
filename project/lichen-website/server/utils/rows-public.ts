const arr = (s: unknown): string[] => {
  try {
    const v = JSON.parse(String(s ?? '[]'))
    return Array.isArray(v) ? v.map(String) : []
  } catch {
    return []
  }
}

export interface RowPublic {
  id: string; created_at: string; lien: string; ages: string[]
  sorties: string; savoir: string; enfance: string
  gestes: string[]; gestes_autre: string; apps: string[]; apps_autre: string
  voies: string[]; souvenir: string; position: number; pourquoi: string
  conditions: string[]; conditions_autre: string; age_mini: string
  entretien: boolean; contradicteur: string; contact: string
  codes: string[]; notes: string
}

export const parseRowPublic = (r: any): RowPublic => ({
  id: r.id,
  created_at: r.created_at,
  lien: r.lien,
  ages: arr(r.ages),
  sorties: r.sorties,
  savoir: r.savoir,
  enfance: r.enfance,
  gestes: arr(r.gestes),
  gestes_autre: r.gestes_autre || '',
  apps: arr(r.apps),
  apps_autre: r.apps_autre || '',
  voies: arr(r.voies),
  souvenir: r.souvenir || '',
  position: Number(r.position),
  pourquoi: r.pourquoi || '',
  conditions: arr(r.conditions),
  conditions_autre: r.conditions_autre || '',
  age_mini: r.age_mini,
  entretien: !!r.entretien,
  contradicteur: r.contradicteur || '',
  contact: r.contact || '',
  codes: arr(r.codes),
  notes: r.notes || ''
})

/** Une réponse « utilise une application » si elle en cite au moins une. */
export const usesAppPublic = (r: RowPublic): boolean => r.apps.some((a) => a !== 'aucune')

/** Le geste déclaré trahit-il un recours au téléphone, quoi qu'on en dise ? */
export const reachesForPhone = (r: RowPublic): boolean =>
  r.gestes.some((g) => g === 'photo' || g === 'appli' || g === 'plus-tard')
