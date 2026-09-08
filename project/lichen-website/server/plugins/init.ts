import { useDb, purgeOldResponses } from '../utils/db'

// Le schéma est créé et la rétention appliquée dès le démarrage : un
// conteneur redémarré est un conteneur purgé.
export default defineNitroPlugin(() => {
  try {
    useDb()
    purgeOldResponses()
  } catch (e) {
    console.error('[init] base indisponible', e)
  }
})
