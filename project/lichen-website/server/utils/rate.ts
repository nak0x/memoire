import { createHash } from 'node:crypto'

// Limitation de débit strictement en mémoire : l'adresse IP est hachée, jamais
// écrite en base, et disparaît au redémarrage. Aucune trace.
//
// Le compteur est commun aux deux questionnaires : un robot ne gagne rien à
// alterner les formulaires, et six envois par heure laissent largement la
// place à quelqu'un qui répondrait honnêtement aux deux.

const seen = new Map<string, number[]>()
const WINDOW = 3_600_000
const MAX_PER_WINDOW = 6

export function tooMany(event: any): boolean {
  const ip =
    getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
    event.node?.req?.socket?.remoteAddress ||
    'inconnu'
  const key = createHash('sha256').update(ip).digest('hex').slice(0, 16)
  const now = Date.now()
  const hits = (seen.get(key) || []).filter((t) => now - t < WINDOW)
  hits.push(now)
  seen.set(key, hits)
  if (seen.size > 5000) seen.clear()
  return hits.length > MAX_PER_WINDOW
}
