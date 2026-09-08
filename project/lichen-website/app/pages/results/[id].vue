<script setup lang="ts">
import { CADRES, AGES, FREQUENCES, ANCIENNETES, GROUPES, EMPORTE, APPS, ECHELLE, CODES, label } from '~~/shared/options'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Réponse' })

const route = useRoute()
const router = useRouter()
const { data, refresh } = await useFetch(() => `/api/admin/reponses/${route.params.id}`)

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

async function save() {
  saving.value = true
  saved.value = false
  try {
    await $fetch(`/api/admin/reponses/${route.params.id}`, {
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
  await $fetch(`/api/admin/reponses/${route.params.id}`, { method: 'DELETE' })
  router.push('/results')
}
</script>

<template>
  <div class="wrap" v-if="r">
    <p class="meta">
      <NuxtLink to="/results">← Toutes les réponses</NuxtLink>
    </p>
    <h1>Réponse du {{ fmt(r.created_at) }}</h1>
    <p class="mono meta">{{ r.id }}</p>

    <div class="actions" style="margin:1rem 0 2rem">
      <NuxtLink v-if="prev" class="btn ghost sm" :to="`/results/${prev}`">← Précédente</NuxtLink>
      <NuxtLink v-if="next" class="btn ghost sm" :to="`/results/${next}`">Suivante →</NuxtLink>
    </div>

    <!-- Codage — le travail réel de dépouillement --------------------------- -->
    <section class="panel" style="border-color:var(--forest)">
      <h3>Codage de la Q9</h3>
      <p class="sub">
        Grille figée avant lecture. Plusieurs codes possibles ; « hors grille » est une
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

    <h2>C. Le moment de la question</h2>
    <p><strong>Un enfant trouve quelque chose qu’il ne connaît pas. Que se passe-t-il ensuite ?</strong></p>
    <p class="answer">{{ r.q6 }}</p>
    <p style="margin-top:1.2rem"><strong>Vous arrive-t-il de ne pas savoir répondre ? Comment faites-vous ?</strong></p>
    <p class="answer">{{ r.q7 }}</p>

    <h2>D. Le numérique</h2>
    <p>
      <strong>« Un outil numérique n’a rien à faire dans une sortie nature. »</strong><br />
      <span class="tag on">{{ r.q8 }} / 5 — {{ label(ECHELLE, String(r.q8)) }}</span>
    </p>
    <p style="margin-top:1rem"><strong>Si vous êtes d’accord, pourquoi ?</strong></p>
    <p class="answer" :class="{ empty: !r.q9 }">{{ r.q9 || 'Non renseigné' }}</p>
    <p style="margin-top:1.2rem"><strong>Conditions dans lesquelles vous l’accepteriez</strong></p>
    <p class="answer" :class="{ empty: !r.q10 }">{{ r.q10 || 'Non renseigné' }}</p>
    <p style="margin-top:1.2rem"><strong>Applications utilisées</strong></p>
    <p>{{ liste(APPS, r.q11, r.q11_autre) }}</p>

    <h2>E. Recrutement</h2>
    <p><strong>Entretien d’une heure :</strong> {{ r.q12 ? 'accepté' : 'non' }}</p>
    <p style="margin-top:1rem"><strong>Quelqu’un qui trouverait la démarche déplacée</strong></p>
    <p class="answer" :class="{ empty: !r.q13 }">{{ r.q13 || 'Non renseigné' }}</p>
    <p style="margin-top:1.2rem"><strong>Contact</strong></p>
    <p class="answer" :class="{ empty: !r.contact }">{{ r.contact || 'Aucun — réponse strictement anonyme' }}</p>

    <h2>A et B. Cadre et matériel</h2>
    <table>
      <tbody>
        <tr><th>Cadre</th><td>{{ r.cadre === 'autre' && r.cadre_autre ? `Autre : ${r.cadre_autre}` : label(CADRES, r.cadre) }}</td></tr>
        <tr><th>Âges</th><td>{{ liste(AGES, r.ages) }}</td></tr>
        <tr><th>Fréquence</th><td>{{ label(FREQUENCES, r.frequence) }}</td></tr>
        <tr><th>Ancienneté</th><td>{{ label(ANCIENNETES, r.anciennete) }}</td></tr>
        <tr><th>Groupe</th><td>{{ label(GROUPES, r.groupe) }}</td></tr>
        <tr><th>Emporte</th><td>{{ liste(EMPORTE, r.emporte, r.emporte_autre) }}</td></tr>
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
