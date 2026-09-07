import { purgeOldResponses, retentionMonths } from '../../utils/db'

// Tâche planifiée Nitro — voir nitro.scheduledTasks dans nuxt.config.ts.
// Elle tourne dans le processus applicatif : pas de crond dans l'image.
export default defineTask({
  meta: {
    name: 'db:purge',
    description: 'Supprime les réponses au-delà du délai de conservation'
  },
  run() {
    const { cutoff, deleted } = purgeOldResponses()
    return { result: { cutoff, deleted, retentionMonths: retentionMonths() } }
  }
})
