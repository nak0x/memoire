import { createHash, timingSafeEqual } from 'node:crypto'

// Authentification HTTP Basic sur /results et /api/admin/*.
// Pas de session, pas de cookie, pas de table utilisateurs : un seul compte,
// lu dans l'environnement.

const digest = (s: string) => createHash('sha256').update(s, 'utf8').digest()

function equals(a: string, b: string): boolean {
  return timingSafeEqual(digest(a), digest(b))
}

export default defineEventHandler((event) => {
  // Le prérendu de la coquille SPA n'est pas une requête réelle : la refuser
  // ferait échouer la construction de l'image.
  if (import.meta.prerender) return

  const path = event.path || ''
  if (!path.startsWith('/results') && !path.startsWith('/api/admin')) return

  // L'administration n'est jamais indexée, jamais mise en cache.
  setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive')
  setResponseHeader(event, 'Cache-Control', 'no-store')

  const login = process.env.ADMIN_LOGIN || ''
  const pass = process.env.ADMIN_PASS || ''
  if (!login || !pass) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Administration non configurée (ADMIN_LOGIN / ADMIN_PASS)'
    })
  }

  const header = getRequestHeader(event, 'authorization') || ''
  const [scheme, encoded] = header.split(' ')
  if (scheme?.toLowerCase() === 'basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8')
    const i = decoded.indexOf(':')
    if (i > -1) {
      const user = decoded.slice(0, i)
      const secret = decoded.slice(i + 1)
      if (equals(user, login) && equals(secret, pass)) return
    }
  }

  setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="Restreint", charset="UTF-8"')
  throw createError({ statusCode: 401, statusMessage: 'Authentification requise' })
})
