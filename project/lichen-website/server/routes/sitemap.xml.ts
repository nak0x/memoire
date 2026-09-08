// Seules les pages publiques. L'administration n'y figure pas.
const PAGES = ['/', '/lichen', '/projet', '/entretiens', '/a-propos', '/donnees', '/cgu', '/mentions-legales']

export default defineEventHandler((event) => {
  const base = (useRuntimeConfig().public.siteUrl || `https://${getRequestHost(event)}`).replace(/\/$/, '')
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    PAGES.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n') +
    '\n</urlset>\n'
  )
})
