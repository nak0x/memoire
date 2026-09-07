import { useDb } from '../utils/db'

export default defineEventHandler(() => {
  useDb().prepare('SELECT 1').get()
  return { ok: true }
})
