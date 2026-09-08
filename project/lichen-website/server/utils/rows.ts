const arr = (s: unknown): string[] => {
  try {
    const v = JSON.parse(String(s ?? '[]'))
    return Array.isArray(v) ? v.map(String) : []
  } catch {
    return []
  }
}

export interface Row {
  id: string; created_at: string; cadre: string; cadre_autre: string
  ages: string[]; frequence: string; anciennete: string; groupe: string
  emporte: string[]; emporte_autre: string; q6: string; q7: string
  q8: number; q9: string; q10: string; q11: string[]; q11_autre: string
  q12: boolean; q13: string; contact: string; codes: string[]; notes: string
}

export const parseRow = (r: any): Row => ({
  id: r.id,
  created_at: r.created_at,
  cadre: r.cadre,
  cadre_autre: r.cadre_autre || '',
  ages: arr(r.ages),
  frequence: r.frequence,
  anciennete: r.anciennete,
  groupe: r.groupe,
  emporte: arr(r.emporte),
  emporte_autre: r.emporte_autre || '',
  q6: r.q6 || '',
  q7: r.q7 || '',
  q8: Number(r.q8),
  q9: r.q9 || '',
  q10: r.q10 || '',
  q11: arr(r.q11),
  q11_autre: r.q11_autre || '',
  q12: !!r.q12,
  q13: r.q13 || '',
  contact: r.contact || '',
  codes: arr(r.codes),
  notes: r.notes || ''
})

/** Une réponse « utilise une application » si elle en cite au moins une. */
export const usesApp = (r: Row): boolean => r.q11.some((a) => a !== 'aucune')
