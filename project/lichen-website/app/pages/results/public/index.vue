<script setup lang="ts">
import { LIENS, SORTIES, AGES_MINI, label } from '~~/shared/options'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Dépouillement — grand public' })

const { data: s } = await useFetch('/api/admin/public/stats')
const { data: liste } = await useFetch('/api/admin/public/reponses')

const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—'

const pct = computed(() =>
  s.value ? Math.min(100, Math.round((s.value.total / s.value.objectif) * 100)) : 0
)

const avecContact = computed(() => (liste.value || []).filter((r) => r.contact))

// --- Graphiques ------------------------------------------------------------
// Chart.js est chargé à la demande, uniquement dans l'administration.

const TEINTES = ['#2f5540', '#8ba585', '#b9944a', '#5f7f8c', '#96604f', '#6f6489']
let Chart: any = null
const charts: any[] = []

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

  simple('p-liens', d.liens, TEINTES[0], 'y')
  simple('p-gestes', d.gestes, TEINTES[1], 'y')
  simple('p-apps', d.apps, TEINTES[3], 'y')
  simple('p-conditions', d.conditions, TEINTES[2], 'y')
  simple('p-agesmini', d.agesMini, TEINTES[4], 'y')
  simple('p-codes', d.codes, TEINTES[2], 'y')

  // Les huit propositions de la Q8. La première — « nommer les espèces » — est
  // la seule que Lumber et al. (2017) écartent : elle est peinte à part.
  make('p-voies', {
    type: 'bar',
    data: {
      labels: d.voies.map((r) => r.l),
      datasets: [{
        data: d.voies.map((r) => r.n),
        backgroundColor: d.voies.map((r) => (r.v === 'noms' ? TEINTES[4] : TEINTES[1])),
        borderWidth: 0, barThickness: 14
      }]
    },
    options: { indexAxis: 'y' }
  })

  make('p-sorties', {
    type: 'doughnut',
    data: {
      labels: d.sorties.map((r) => r.l),
      datasets: [{ data: d.sorties.map((r) => r.n), backgroundColor: TEINTES, borderWidth: 0 }]
    },
    options: { cutout: '58%' }
  })

  make('p-position', {
    type: 'bar',
    data: {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [{ data: d.position.map((r) => r.n), backgroundColor: ['#5f7f8c', '#7d9a8a', '#8ba585', '#b9944a', '#96604f'], borderWidth: 0, maxBarThickness: 56 }]
    }
  })

  make('p-crois', {
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
}

onMounted(async () => {
  await draw()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw)
})
onBeforeUnmount(() => charts.forEach((c) => c.destroy()))
watch(s, draw)
</script>

<template>
  <div class="wrap-wide" v-if="s">
    <p class="meta"><NuxtLink to="/results">← Questionnaire professionnel</NuxtLink></p>
    <h1>Dépouillement — grand public</h1>
    <p class="meta">
      Première réponse {{ fmt(s.premiere) }} · dernière {{ fmt(s.derniere) }} ·
      objectif {{ s.objectif }} réponses.
    </p>

    <div class="kpis" style="margin:1.4rem 0 2rem">
      <div class="kpi mark"><b>{{ s.total }}</b><span>réponses · {{ pct }} % de l’objectif</span></div>
      <div class="kpi mark"><b>{{ s.contradiction }}</b><span>d’accord (4-5) <em>et</em> utilisent une application</span></div>
      <div class="kpi mark"><b>{{ s.nomsSeul }}</b><span>ne citent <em>que</em> « nommer les espèces »</span></div>
      <div class="kpi"><b>{{ s.differencie }}</b><span>refusent un seuil d’âge unique</span></div>
      <div class="kpi"><b>{{ s.pourquoiACoder }}</b><span>« pourquoi » à coder</span></div>
      <div class="kpi"><b>{{ s.entretiens }}</b><span>entretiens acceptés</span></div>
    </div>

    <div class="grid">
      <section class="panel wide">
        <h3>Position déclarée × usage réel d’une application</h3>
        <p class="sub">
          « Un écran n’a rien à faire dans une balade en nature », de 1 (pas du tout d’accord)
          à 5. Le croisement à comparer avec celui du questionnaire professionnel :
          <strong>{{ s.contradiction }}</strong> personne(s) sur {{ s.accord }} déclarant un accord
          (4-5) utilisent malgré tout une application. Et
          <strong>{{ s.telephone }}</strong> déclarent sortir leur téléphone d’une manière ou
          d’une autre face à ce qu’elles ne connaissent pas.
        </p>
        <div class="chart"><canvas id="p-crois"></canvas></div>
      </section>

      <section class="panel wide">
        <h3>Ce qui attache un enfant à la nature — d’après les répondants</h3>
        <p class="sub">
          Réponses multiples. La barre en rouge est <strong>« apprendre à nommer les
          espèces »</strong> : c’est la seule proposition dont Lumber, Richardson &amp;
          Sheffield (2017) établissent qu’elle <em>n’augmente pas</em> la connexion à la
          nature. {{ s.citeNoms }} répondant(s) la citent, {{ s.citeSensible }} citent au moins
          une des voies sensibles, et <strong>{{ s.nomsSeul }}</strong> ne citent qu’elle.
          L’écart entre ce que le public croit et ce que la littérature établit est le
          résultat que cette question cherche à produire.
        </p>
        <div class="chart tall"><canvas id="p-voies"></canvas></div>
      </section>

      <section class="panel wide">
        <h3>Conditions d’acceptation</h3>
        <p class="sub">
          Réponses multiples, posées <em>après</em> la question ouverte pour ne pas souffler
          les arguments. Lecture par hypothèse de rejet :
          <template v-for="(h, i) in s.hypotheses" :key="h.v">
            <span v-if="i"> · </span><strong>{{ h.n }}</strong> {{ h.v }}
          </template>.
        </p>
        <div class="chart tall"><canvas id="p-conditions"></canvas></div>
      </section>

      <section class="panel">
        <h3>À partir de quel âge</h3>
        <p class="sub">
          Une réponse par personne. <strong>{{ s.differencie }}</strong> refusent un seuil
          d’âge et renvoient à l’enfant ou à l’usage, contre {{ s.seuil }} qui fixent un seuil —
          c’est exactement le partage de la décision n° 2026-911 DC.
        </p>
        <div class="chart tall"><canvas id="p-agesmini"></canvas></div>
      </section>

      <section class="panel">
        <h3>Position sur l’échelle 1-5</h3>
        <p class="sub">Distribution brute.</p>
        <div class="chart"><canvas id="p-position"></canvas></div>
      </section>

      <section class="panel">
        <h3>Codage du « pourquoi »</h3>
        <p class="sub">
          La même grille que le questionnaire professionnel. {{ s.pourquoiRemplies }} réponse(s)
          à coder au total, {{ s.pourquoiACoder }} en attente.
        </p>
        <div class="chart"><canvas id="p-codes"></canvas></div>
      </section>

      <section class="panel">
        <h3>Qui répond</h3>
        <p class="sub">
          {{ s.parents }} parent(s) ou grand-parent(s), {{ s.sansEnfant }} sans enfant,
          {{ s.pros }} au contact d’enfants par métier.
        </p>
        <div class="chart"><canvas id="p-liens"></canvas></div>
      </section>

      <section class="panel">
        <h3>Fréquence des sorties</h3>
        <p class="sub">Pour eux-mêmes, pas pour les enfants.</p>
        <div class="chart"><canvas id="p-sorties"></canvas></div>
      </section>

      <section class="panel">
        <h3>Face à ce qu’on ne connaît pas</h3>
        <p class="sub">Réponses multiples.</p>
        <div class="chart tall"><canvas id="p-gestes"></canvas></div>
      </section>

      <section class="panel">
        <h3>Applications utilisées</h3>
        <p class="sub">Réponses multiples.</p>
        <div class="chart"><canvas id="p-apps"></canvas></div>
      </section>

      <section class="panel">
        <h3>Variables de contrôle</h3>
        <p class="sub">Rapport personnel à la nature, et enfance dehors.</p>
        <table>
          <tbody>
            <tr><th colspan="2">Espèces nommables autour de chez soi</th></tr>
            <tr v-for="r in s.savoirs" :key="r.v"><td>{{ r.l }}</td><td style="text-align:right">{{ r.n }}</td></tr>
            <tr><th colspan="2">Enfant, du temps dehors sans adulte</th></tr>
            <tr v-for="r in s.enfance" :key="r.v"><td>{{ r.l }}</td><td style="text-align:right">{{ r.n }}</td></tr>
            <tr><th colspan="2">Âge des enfants côtoyés</th></tr>
            <tr v-for="r in s.ages" :key="r.v"><td>{{ r.l }}</td><td style="text-align:right">{{ r.n }}</td></tr>
          </tbody>
        </table>
      </section>
    </div>

    <h2>Réponses</h2>
    <div class="panel scroll">
      <table>
        <thead>
          <tr>
            <th>Reçue</th><th>Lien</th><th>Sorties</th><th>Éch.</th><th>Apps</th>
            <th>Âge min.</th><th>Pourquoi</th><th>Codage</th><th>Entretien</th><th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in liste" :key="r.id">
            <td class="meta">{{ fmt(r.created_at) }}</td>
            <td>{{ label(LIENS, r.lien) }}</td>
            <td class="meta">{{ label(SORTIES, r.sorties) }}</td>
            <td><strong>{{ r.position }}</strong></td>
            <td>{{ r.nbApps || '—' }}</td>
            <td class="meta">{{ label(AGES_MINI, r.age_mini) }}</td>
            <td>{{ r.aPourquoi ? 'oui' : '—' }}</td>
            <td>
              <span v-if="r.codes.length" class="tag on">{{ r.codes.length }} code(s)</span>
              <span v-else-if="r.aPourquoi" class="tag">à coder</span>
              <span v-else class="meta">—</span>
            </td>
            <td>{{ r.entretien ? (r.contact ? 'oui + contact' : 'oui') : '—' }}</td>
            <td><NuxtLink class="btn ghost sm" :to="`/results/public/${r.id}`">Ouvrir</NuxtLink></td>
          </tr>
          <tr v-if="!liste?.length"><td colspan="10" class="meta">Aucune réponse pour le moment.</td></tr>
        </tbody>
      </table>
    </div>

    <h2>Contacts pour entretiens</h2>
    <div class="panel">
      <table v-if="avecContact.length">
        <tbody>
          <tr v-for="r in avecContact" :key="r.id">
            <td>{{ r.contact }}</td>
            <td class="meta">{{ r.entretien ? 'a accepté un entretien' : 'n’a pas coché l’entretien' }}</td>
            <td><NuxtLink class="btn ghost sm" :to="`/results/public/${r.id}`">Réponse</NuxtLink></td>
          </tr>
        </tbody>
      </table>
      <p v-else class="meta">Aucun contact laissé pour l’instant.</p>
    </div>

    <div class="panel" style="margin-top:1.5rem">
      <p class="sub">
        La conservation est commune aux deux questionnaires : la purge et son journal se
        pilotent depuis <NuxtLink to="/results">le tableau de bord professionnel</NuxtLink>.
      </p>
      <div class="actions">
        <a class="btn ghost sm" href="/api/admin/public/export">Export CSV — grand public</a>
        <small class="meta">L’export contient la colonne « contact » : à traiter comme la base elle-même.</small>
      </div>
    </div>
  </div>
  <div class="wrap" v-else>
    <p class="meta">Chargement…</p>
  </div>
</template>
