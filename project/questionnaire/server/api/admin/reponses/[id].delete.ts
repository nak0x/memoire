import { useDb } from '../../../utils/db'

// Droit à l'effacement : une demande de suppression doit pouvoir être
// honorée immédiatement, sans attendre la purge de rétention.
export default defineEventHandler((event) => {
  const id = String(getRouterParam(event, 'id'))
  const res = useDb().prepare('DELETE FROM responses WHERE id = ?').run(id)
  if (!Number(res.changes)) throw createError({ statusCode: 404, statusMessage: 'Réponse introuvable' })
  return { ok: true }
})
