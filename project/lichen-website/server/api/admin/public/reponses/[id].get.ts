import { useDb } from '../../../../utils/db'
import { parseRowPublic } from '../../../../utils/rows-public'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const row = useDb().prepare('SELECT * FROM responses_public WHERE id = ?').get(String(id)) as any
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Réponse introuvable' })

  // Navigation chronologique, pour dépouiller sans repasser par la liste.
  const prev = useDb()
    .prepare('SELECT id FROM responses_public WHERE created_at < ? ORDER BY created_at DESC LIMIT 1')
    .get(row.created_at) as any
  const next = useDb()
    .prepare('SELECT id FROM responses_public WHERE created_at > ? ORDER BY created_at ASC LIMIT 1')
    .get(row.created_at) as any

  return { reponse: parseRowPublic(row), prev: prev?.id || null, next: next?.id || null }
})
