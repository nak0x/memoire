// L'administration n'est volontairement pas mentionnée ici : une ligne
// « Disallow: /results » serait exactement l'indication qu'on veut éviter de
// publier. Elle est protégée par mot de passe et par en-tête X-Robots-Tag.
export default defineEventHandler((event) => {
  const base = useRuntimeConfig().public.siteUrl || `https://${getRequestHost(event)}`
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return ['User-agent: *', 'Allow: /', 'Disallow: /api/', '', `Sitemap: ${base}/sitemap.xml`, ''].join('\n')
})
