import { purgeOldResponses, retentionMonths } from '../../utils/db'

// Déclenchement manuel de la purge, en plus de la tâche quotidienne.
export default defineEventHandler(() => {
  const { cutoff, deleted } = purgeOldResponses()
  return { ok: true, cutoff, deleted, mois: retentionMonths() }
})
