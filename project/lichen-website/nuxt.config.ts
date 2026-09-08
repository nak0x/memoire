// Configuration volontairement minimale : pas de module UI, pas de police
// distante, pas d'analytics. Le poids de la page publique est un critère du
// projet, pas un détail.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  telemetry: false,

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Surchargeables à l'exécution via NUXT_PUBLIC_*
    public: {
      contactEmail: process.env.NUXT_PUBLIC_CONTACT_EMAIL || 'pro.theolesage@gmail.com',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
      hostName: process.env.NUXT_PUBLIC_HOST_NAME || 'hébergeur situé dans l’Union européenne',
      hostLocation: process.env.NUXT_PUBLIC_HOST_LOCATION || 'Union européenne',
      retentionMonths: Number(process.env.RETENTION_MONTHS || 6)
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'color-scheme', content: 'light dark' },
        {
          name: 'description',
          content:
            'Questionnaire de recherche sur les pratiques d’éducation dehors : ce qui sort avec vous, et ce qui se passe quand un enfant trouve quelque chose qu’il ne connaît pas. 5 minutes, sans compte, sans donnée personnelle obligatoire.'
        }
      ],
      link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }]
    }
  },

  routeRules: {
    // L'administration n'est jamais rendue côté serveur, jamais indexable,
    // jamais mise en cache par un intermédiaire.
    '/results': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Cache-Control': 'no-store' } },
    '/results/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Cache-Control': 'no-store' } },
    '/api/admin/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' } }
  },

  nitro: {
    preset: 'node-server',
    minify: true,
    experimental: { tasks: true },
    // Purge de rétention : tous les jours à 03h17 UTC.
    scheduledTasks: { '17 3 * * *': ['db:purge'] }
  },

  features: {
    // Le CSS de la page est injecté dans le HTML : une requête de moins.
    inlineStyles: true
  },

  experimental: {
    payloadExtraction: false
  }
})
