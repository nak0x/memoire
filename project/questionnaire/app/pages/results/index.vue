<script setup lang="ts">
import { CADRES, FREQUENCES, label } from '~~/shared/options'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Dépouillement' })

const { data: s, refresh } = await useFetch('/api/admin/stats')
const { data: liste, refresh: refreshList } = await useFetch('/api/admin/reponses')

const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—'

const pct = computed(() =>
  s.value ? Math.min(100, Math.round((s.value.total / s.value.objectif) * 100)) : 0
)

const avecContact = computed(() => (liste.value || []).filter((r) => r.contact))

// --- Graphiques ------------------------------------------------------------
// Chart.js est chargé à la demande, uniquement ici : les pages publiques ne
// téléchargent jamais cette bibliothèque.

const TEINTES = ['#2f5540', '#8ba585', '#b9944a', '#5f7f8c', '#96604f', '#6f6489']
let Chart: any = null
const charts: any[] = []
const pending = ref(true)

async function lib() {
  if (Chart) return Chart
  const m: any = await import('chart.js')
  m.Chart.register(
    m.BarController, m.BarElement, m.DoughnutController, m.ArcElement,
    m.CategoryScale, m.LinearScale, m.Tooltip, m.Legend
  )
  Chart = m.Chart
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily
  Chart.defaults.animation = false
  Chart.defaults.maintainAspectRatio = false
  return Chart
}

function theme() {
  const c = getComputedStyle(document.documentElement)
  return {
    ink: c.getPropertyValue('--ink-soft').trim() || '#666',
    line: c.getPropertyValue('--line').trim() || '#ddd'
  }
}

function make(id: string, cfg: any) {
  const el = document.getElementById(id) as HTMLCanvasElement | null
  if (!el) return
  const { ink, line } = theme()
  const horizontal = cfg.options?.indexAxis === 'y'
  const base = {
    plugins: { legend: { display: false }, tooltip: { displayColors: false } },
    scales: cfg.type === 'doughnut' ? undefined : {
      x: {
        stacked: !!cfg.stacked, ticks: { color: ink, autoSkip: false },
        grid: { color: horizontal ? line : 'transparent' }, border: { color: line }
      },
      y: {
        stacked: !!cfg.stacked, beginAtZero: true,
        ticks: { color: ink, precision: 0 },
        grid: { color: horizontal ? 'transparent' : line }, border: { color: line }
      }
    }
  }
  if (cfg.type === 'doughnut') base.plugins.legend = { display: true, position: 'right', labels: { color: ink, boxWidth: 10, font: { size: 11 } } } as any
  charts.push(new Chart(el, { ...cfg, options: { ...base, ...cfg.options, plugins: { ...base.plugins, ...cfg.options?.plugins } } }))
}

async function draw() {
  if (!s.value) return
  await lib()
  charts.forEach((c) => c.destroy())
  charts.length = 0
  const d = s.value

  const simple = (id: string, rows: { l: string; n: number }[], color = TEINTES[0], axis?: 'y') =>
    make(id, {
      type: 'bar',
      data: { labels: rows.map((r) => r.l), datasets: [{ data: rows.map((r) => r.n), backgroundColor: color, borderWidth: 0, barThickness: axis ? 14 : undefined, maxBarThickness: 42 }] },
      options: { indexAxis: axis }
    })

  simple('c-cadres', d.cadres, TEINTES[0], 'y')
  simple('c-ages', d.ages, TEINTES[1])
  simple('c-emporte', d.emporte, TEINTES[1], 'y')
  simple('c-apps', d.apps, TEINTES[3], 'y')
  simple('c-codes', d.codes, TEINTES[2], 'y')

  make('c-freq', {
    type: 'doughnut',
    data: {
      labels: d.frequences.map((r) => r.l),
      datasets: [{ data: d.frequences.map((r) => r.n), backgroundColor: TEINTES, borderWidth: 0 }]
    },
    options: { cutout: '58%' }
  })

  make('c-q8', {
    type: 'bar',
    data: {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [{ data: d.q8.map((r) => r.n), backgroundColor: ['#5f7f8c', '#7d9a8a', '#8ba585', '#b9944a', '#96604f'], borderWidth: 0, maxBarThickness: 56 }]
    }
  })

  make('c-crois', {
    type: 'bar',
    stacked: true,
    data: {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [
        { label: 'Utilise au moins une application', data: d.croisement.map((r) => r.avec), backgroundColor: TEINTES[2], borderWidth: 0, maxBarThickness: 56 },
        { label: 'Aucune application', data: d.croisement.map((r) => r.sans), backgroundColor: TEINTES[1], borderWidth: 0, maxBarThickness: 56 }
      ]
    },
    options: { plugins: { legend: { display: true, labels: { boxWidth: 10, font: { size: 11 } } } } }
  })

  pending.value = false
}

onMounted(async () => {
  await draw()
  // Le thème suit la préférence système : les couleurs des axes aussi.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw)
})
onBeforeUnmount(() => charts.forEach((c) => c.destroy()))
watch(s, draw)

// --- Rétention -------------------------------------------------------------
const purging = ref(false)
async function purge() {
  purging.value = true
  try {
    const r: any = await $fetch('/api/admin/purge', { method: 'POST' })
    await Promise.all([refresh(), refreshList()])
    alert(`Purge exécutée. ${r.deleted} réponse(s) supprimée(s).`)
  } finally {
    purging.value = false
  }
}
</script>

<template>
  <div class="wrap-wide" v-if="s">
    <h1>Dépouillement</h1>
    <p class="meta">
      Première réponse {{ fmt(s.premiere) }} · dernière {{ fmt(s.derniere) }} ·
      objectif {{ s.objectif }} réponses.
    </p>

    <div class="kpis" style="margin:1.4rem 0 2rem">
      <div class="kpi mark"><b>{{ s.total }}</b><span>réponses · {{ pct }} % de l’objectif</span></div>
      <div class="kpi mark"><b>{{ s.contradiction }}</b><span>d’accord (4-5) <em>et</em> utilisent une application</span></div>
      <div class="kpi"><b>{{ s.q9ACoder }}</b><span>Q9 à coder</span></div>
      <div class="kpi"><b>{{ s.entretiens }}</b><span>entretiens acceptés</span></div>
      <div class="kpi"><b>{{ s.contacts }}</b><span>contacts laissés</span></div>
      <div class="kpi"><b>{{ s.contradicteurs }}</b><span>contradicteurs signalés</span></div>
    </div>

    <div class="grid">
      <section class="panel wide">
        <h3>Position déclarée × usage réel d’une application</h3>
        <p class="sub">
          « Un outil numérique n’a rien à faire dans une sortie nature », de 1 (pas du tout
          d’accord) à 5. Le croisement le plus important du questionnaire :
          <strong>{{ s.contradiction }}</strong> personne(s) sur {{ s.accord }} déclarant un accord
          (4-5) utilisent malgré tout une application naturaliste.
        </p>
        <div class="chart"><canvas id="c-crois"></canvas></div>
      </section>

      <section class="panel">
        <h3>Codage de la Q9</h3>
        <p class="sub">
          Les quatre hypothèses de rejet. {{ s.q9Remplies }} réponse(s) à coder au total,
          {{ s.q9ACoder }} en attente.
        </p>
        <div class="chart"><canvas id="c-codes"></canvas></div>
      </section>

      <section class="panel">
        <h3>Position sur l’échelle 1-5</h3>
        <p class="sub">Distribution brute de la Q8.</p>
        <div class="chart"><canvas id="c-q8"></canvas></div>
      </section>

      <section class="panel">
        <h3>Cadres d’exercice</h3>
        <p class="sub">Rappel : échantillon auto-sélectionné, non représentatif.</p>
        <div class="chart"><canvas id="c-cadres"></canvas></div>
      </section>

      <section class="panel">
        <h3>Fréquence des sorties</h3>
        <p class="sub">Une réponse par personne.</p>
        <div class="chart"><canvas id="c-freq"></canvas></div>
      </section>

      <section class="panel">
        <h3>Ce qui sort avec eux</h3>
        <p class="sub">Réponses multiples.</p>
        <div class="chart tall"><canvas id="c-emporte"></canvas></div>
      </section>

      <section class="panel">
        <h3>Applications utilisées</h3>
        <p class="sub">Réponses multiples.</p>
        <div class="chart"><canvas id="c-apps"></canvas></div>
      </section>

      <section class="panel">
        <h3>Âges encadrés</h3>
        <p class="sub">Réponses multiples.</p>
        <div class="chart"><canvas id="c-ages"></canvas></div>
      </section>

      <section class="panel">
        <h3>Ancienneté et taille des groupes</h3>
        <p class="sub">Variables de contrôle.</p>
        <table>
          <tbody>
            <tr><th colspan="2">Depuis combien de temps</th></tr>
            <tr v-for="r in s.anciennetes" :key="r.v"><td>{{ r.l }}</td><td style="text-align:right">{{ r.n }}</td></tr>
            <tr><th colspan="2">Taille habituelle du groupe</th></tr>
            <tr v-for="r in s.groupes" :key="r.v"><td>{{ r.l }}</td><td style="text-align:right">{{ r.n }}</td></tr>
          </tbody>
        </table>
      </section>
    </div>

    <h2>Réponses</h2>
    <div class="panel scroll">
      <table>
        <thead>
          <tr>
            <th>Reçue</th><th>Cadre</th><th>Fréq.</th><th>Q8</th><th>Apps</th>
            <th>Q9</th><th>Codage</th><th>Entretien</th><th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in liste" :key="r.id">
            <td class="meta">{{ fmt(r.created_at) }}</td>
            <td>{{ label(CADRES, r.cadre) }}</td>
            <td class="meta">{{ label(FREQUENCES, r.frequence) }}</td>
            <td><strong>{{ r.q8 }}</strong></td>
            <td>{{ r.nbApps || '—' }}</td>
            <td>{{ r.aQ9 ? 'oui' : '—' }}</td>
            <td>
              <span v-if="r.codes.length" class="tag on">{{ r.codes.length }} code(s)</span>
              <span v-else-if="r.aQ9" class="tag">à coder</span>
              <span v-else class="meta">—</span>
            </td>
            <td>{{ r.q12 ? (r.contact ? 'oui + contact' : 'oui') : '—' }}</td>
            <td><NuxtLink class="btn ghost sm" :to="`/results/${r.id}`">Ouvrir</NuxtLink></td>
          </tr>
          <tr v-if="!liste?.length"><td colspan="9" class="meta">Aucune réponse pour le moment.</td></tr>
        </tbody>
      </table>
    </div>

    <h2>Contacts pour entretiens</h2>
    <div class="panel">
      <table v-if="avecContact.length">
        <tbody>
          <tr v-for="r in avecContact" :key="r.id">
            <td>{{ r.contact }}</td>
            <td class="meta">{{ r.q12 ? 'a accepté un entretien' : 'n’a pas coché l’entretien' }}</td>
            <td><NuxtLink class="btn ghost sm" :to="`/results/${r.id}`">Réponse</NuxtLink></td>
          </tr>
        </tbody>
      </table>
      <p v-else class="meta">Aucun contact laissé pour l’instant.</p>
    </div>

    <h2>Conservation</h2>
    <div class="panel">
      <p class="sub">
        Rétention : <strong>{{ s.retention.mois }} mois</strong>. Tout enregistrement antérieur au
        {{ fmt(s.retention.cutoff) }} est supprimé automatiquement — au démarrage du serveur,
        chaque nuit à 03h17 UTC, et en garde-fou au fil des envois.
      </p>
      <p class="meta" v-if="s.retention.derniere">
        Dernière exécution : {{ fmt(s.retention.derniere.ran_at) }} —
        {{ s.retention.derniere.deleted }} suppression(s).
      </p>
      <div class="actions" style="margin-top:.9rem">
        <button class="btn ghost sm" :disabled="purging" @click="purge">
          {{ purging ? 'Purge…' : 'Exécuter la purge maintenant' }}
        </button>
        <a class="btn ghost sm" href="/api/admin/export">Export CSV</a>
        <small class="meta">L’export contient la colonne « contact » : à traiter comme la base elle-même.</small>
      </div>
    </div>
  </div>
  <div class="wrap" v-else>
    <p class="meta">Chargement…</p>
  </div>
</template>
