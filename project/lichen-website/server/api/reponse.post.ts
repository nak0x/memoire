import { randomUUID } from 'node:crypto'
import { useDb, purgeGuard } from '../utils/db'
import { validate } from '../utils/validate'
import { tooMany } from '../utils/rate'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Piège à robots : champ invisible, jamais rempli par un humain.
  if (body?.site_web) return { ok: true, id: null }

  if (tooMany(event)) {
    throw createError({ statusCode: 429, statusMessage: 'Trop de réponses envoyées depuis ce réseau' })
  }

  const result = validate(body)
  if (!result.ok) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Réponse incomplète',
      data: { errors: result.errors }
    })
  }

  const d = result.data
  const id = randomUUID()
  useDb()
    .prepare(
      `INSERT INTO responses (
        id, created_at, cadre, cadre_autre, ages, frequence, anciennete, groupe,
        emporte, emporte_autre, q6, q7, q8, q9, q10, q11, q11_autre, q12, q13, contact
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .run(
      id,
      new Date().toISOString(),
      d.cadre,
      d.cadre_autre,
      JSON.stringify(d.ages),
      d.frequence,
      d.anciennete,
      d.groupe,
      JSON.stringify(d.emporte),
      d.emporte_autre,
      d.q6,
      d.q7,
      d.q8,
      d.q9,
      d.q10,
      JSON.stringify(d.q11),
      d.q11_autre,
      d.q12,
      d.q13,
      d.contact
    )

  purgeGuard()
  return { ok: true, id }
})
