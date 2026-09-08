import { randomUUID } from 'node:crypto'
import { useDb, purgeGuard } from '../utils/db'
import { validatePublic } from '../utils/validate-public'
import { tooMany } from '../utils/rate'

// Second questionnaire — grand public. Mêmes règles que le premier : piège à
// robots, limitation en mémoire, aucune adresse IP écrite, purge déclenchée au
// fil des envois.

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Piège à robots : champ invisible, jamais rempli par un humain.
  if (body?.site_web) return { ok: true, id: null }

  if (tooMany(event)) {
    throw createError({ statusCode: 429, statusMessage: 'Trop de réponses envoyées depuis ce réseau' })
  }

  const result = validatePublic(body)
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
      `INSERT INTO responses_public (
        id, created_at, lien, ages, sorties, savoir, enfance,
        gestes, gestes_autre, apps, apps_autre, voies, souvenir,
        position, pourquoi, conditions, conditions_autre, age_mini,
        entretien, contradicteur, contact
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .run(
      id,
      new Date().toISOString(),
      d.lien,
      JSON.stringify(d.ages),
      d.sorties,
      d.savoir,
      d.enfance,
      JSON.stringify(d.gestes),
      d.gestes_autre,
      JSON.stringify(d.apps),
      d.apps_autre,
      JSON.stringify(d.voies),
      d.souvenir,
      d.position,
      d.pourquoi,
      JSON.stringify(d.conditions),
      d.conditions_autre,
      d.age_mini,
      d.entretien,
      d.contradicteur,
      d.contact
    )

  purgeGuard()
  return { ok: true, id }
})
