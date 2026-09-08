<script setup lang="ts">
import {
  LIENS, AGES_PROCHES, SORTIES, SAVOIRS, ENFANCE, GESTES, APPS, VOIES,
  CONDITIONS, AGES_MINI, ECHELLE, CODES, VOIE_INVALIDEE, label
} from '~~/shared/options'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Réponse — grand public' })

const route = useRoute()
const router = useRouter()
const { data, refresh } = await useFetch(() => `/api/admin/public/reponses/${route.params.id}`)

const codes = ref<string[]>([])
const notes = ref('')
const saved = ref(false)
const saving = ref(false)

watchEffect(() => {
  codes.value = [...(data.value?.reponse.codes || [])]
  notes.value = data.value?.reponse.notes || ''
})

const r = computed(() => data.value?.reponse)
const prev = computed(() => data.value?.prev)
const next = computed(() => data.value?.next)

const fmt = (d?: string) => (d ? new Date(d).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }) : '—')
const liste = (list: any[], vals: string[], autre = '') =>
  vals.map((v) => (v === 'autre' && autre ? `Autre : ${autre}` : label(list, v))).join(' · ') || '—'

// Signale d'un coup d'œil le cas qui intéresse le mémoire : quelqu'un qui ne
// voit la connexion à la nature que par la détermination des espèces.
const nomsSeul = computed(
  () => !!r.value && r.value.voies.length === 1 && r.value.voies[0] === VOIE_INVALIDEE
)

async function save() {
  saving.value = true
  saved.value = false
  try {
    await $fetch(`/api/admin/public/reponses/${route.params.id}`, {
      method: 'PATCH',
      body: { codes: codes.value, notes: notes.value }
    })
    saved.value = true
    await refresh()
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!confirm('Supprimer définitivement cette réponse ? Cette action est irréversible.')) return
  await $fetch(`/api/admin/public/reponses/${route.params.id}`, { method: 'DELETE' })
  router.push('/results/public')
}
</script>

<template>
  <div class="wrap" v-if="r">
    <p class="meta">
      <NuxtLink to="/results/public">← Toutes les réponses du grand public</NuxtLink>
    </p>
    <h1>Réponse du {{ fmt(r.created_at) }}</h1>
    <p class="mono meta">{{ r.id }}</p>

    <div class="actions" style="margin:1rem 0 2rem">
      <NuxtLink v-if="prev" class="btn ghost sm" :to="`/results/public/${prev}`">← Précédente</NuxtLink>
      <NuxtLink v-if="next" class="btn ghost sm" :to="`/results/public/${next}`">Suivante →</NuxtLink>
    </div>

    <!-- Codage — le travail réel de dépouillement --------------------------- -->
    <section class="panel" style="border-color:var(--forest)">
      <h3>Codage du « pourquoi » (Q11)</h3>
      <p class="sub">
        La même grille que le questionnaire professionnel, figée avant lecture — c’est ce qui
        rend les deux corpus comparables. Plusieurs codes possibles ; « hors grille » est une
        information en soi.
      </p>
      <div class="opts">
        <label v-for="c in CODES" :key="c.v" class="opt">
          <input v-model="codes" type="checkbox" :value="c.v" />
          <span>{{ c.l }}</span>
        </label>
      </div>
      <p style="margin:.9rem 0 .3rem"><strong>Notes de dépouillement</strong></p>
      <textarea v-model="notes" rows="3" maxlength="4000" placeholder="Ce qui contredit mes hypothèses, citations à retenir…"></textarea>
      <div class="actions" style="margin-top:.8rem">
        <button class="btn sm" :disabled="saving" @click="save">{{ saving ? 'Enregistrement…' : 'Enregistrer' }}</button>
        <small v-if="saved" class="meta">Enregistré.</small>
      </div>
    </section>

    <h2>D. Le numérique dehors</h2>
    <p>
      <strong>« Un écran n’a rien à faire dans une balade en nature. »</strong><br />
      <span class="tag on">{{ r.position }} / 5 — {{ label(ECHELLE, String(r.position)) }}</span>
    </p>
    <p style="margin-top:1rem"><strong>Si vous êtes d’accord, pourquoi ?</strong></p>
    <p class="answer" :class="{ empty: !r.pourquoi }">{{ r.pourquoi || 'Non renseigné' }}</p>
    <p style="margin-top:1.2rem"><strong>Conditions d’acceptation</strong></p>
    <p>{{ liste(CONDITIONS, r.conditions, r.conditions_autre) }}</p>
    <p style="margin-top:1.2rem"><strong>À partir de quel âge</strong></p>
    <p>{{ label(AGES_MINI, r.age_mini) }}</p>

    <h2>C. Ce qui attache un enfant à la nature</h2>
    <p>{{ liste(VOIES, r.voies) }}</p>
    <div v-if="nomsSeul" class="note" style="margin:.7rem 0">
      <p>
        <strong>Ne cite que « nommer les espèces ».</strong> C’est la seule voie que Lumber et
        al. (2017) écartent — le cas exact que la Q8 cherche à compter.
      </p>
    </div>
    <p style="margin-top:1.2rem"><strong>Un souvenir de nature</strong></p>
    <p class="answer" :class="{ empty: !r.souvenir }">{{ r.souvenir || 'Non renseigné' }}</p>

    <h2>E. Recrutement</h2>
    <p><strong>Entretien d’une heure :</strong> {{ r.entretien ? 'accepté' : 'non' }}</p>
    <p style="margin-top:1rem"><strong>Quelqu’un qui trouverait la démarche déplacée</strong></p>
    <p class="answer" :class="{ empty: !r.contradicteur }">{{ r.contradicteur || 'Non renseigné' }}</p>
    <p style="margin-top:1.2rem"><strong>Contact</strong></p>
    <p class="answer" :class="{ empty: !r.contact }">{{ r.contact || 'Aucun — réponse strictement anonyme' }}</p>

    <h2>A et B. Qui répond, et ce qu’il fait</h2>
    <table>
      <tbody>
        <tr><th>Lien aux enfants</th><td>{{ label(LIENS, r.lien) }}</td></tr>
        <tr><th>Âges côtoyés</th><td>{{ liste(AGES_PROCHES, r.ages) }}</td></tr>
        <tr><th>Sorties nature</th><td>{{ label(SORTIES, r.sorties) }}</td></tr>
        <tr><th>Espèces nommables</th><td>{{ label(SAVOIRS, r.savoir) }}</td></tr>
        <tr><th>Enfance dehors</th><td>{{ label(ENFANCE, r.enfance) }}</td></tr>
        <tr><th>Face à l’inconnu</th><td>{{ liste(GESTES, r.gestes, r.gestes_autre) }}</td></tr>
        <tr><th>Applications</th><td>{{ liste(APPS, r.apps, r.apps_autre) }}</td></tr>
      </tbody>
    </table>

    <hr />
    <div class="actions">
      <button class="btn danger sm" @click="remove">Supprimer cette réponse</button>
      <small class="meta">À utiliser sur demande d’effacement. Sinon, la purge s’en charge.</small>
    </div>
  </div>
  <div class="wrap" v-else><p class="meta">Chargement…</p></div>
</template>
