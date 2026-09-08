import { useDb } from '../../../../utils/db'
import { CODES, values } from '../../../../../shared/options'

// Seul le dépouillement est modifiable : codage du « pourquoi » et notes de
// lecture. Les réponses elles-mêmes ne sont jamais réécrites.
export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const codes = Array.isArray(body?.codes)
    ? body.codes.filter((c: unknown) => typeof c === 'string' && values(CODES).includes(c))
    : []
  const notes = typeof body?.notes === 'string' ? body.notes.trim().slice(0, 4000) : ''

  const res = useDb()
    .prepare('UPDATE responses_public SET codes = ?, notes = ? WHERE id = ?')
    .run(JSON.stringify(codes), notes, id)
  if (!Number(res.changes)) throw createError({ statusCode: 404, statusMessage: 'Réponse introuvable' })

  return { ok: true, codes, notes }
})
