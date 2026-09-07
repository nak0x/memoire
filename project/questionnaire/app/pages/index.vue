<script setup lang="ts">
import { CADRES, AGES, FREQUENCES, ANCIENNETES, GROUPES, EMPORTE, APPS, ECHELLE } from '~~/shared/options'

// Note méthodologique — à ne pas « améliorer » :
// ce questionnaire ne décrit aucun objet et ne demande à personne si une idée
// lui plaît. Il mesure l'état d'un terrain, pas l'accueil d'un projet.

useHead({ title: 'Ce qui sort avec vous — enquête sur les pratiques d’éducation dehors' })

const { retentionMonths } = useRuntimeConfig().public

const f = reactive({
  cadre: '', cadre_autre: '',
  ages: [] as string[],
  frequence: '', anciennete: '', groupe: '',
  emporte: [] as string[], emporte_autre: '',
  q6: '', q7: '',
  q8: '', q9: '', q10: '',
  q11: [] as string[], q11_autre: '',
  q12: null as boolean | null, q13: '', contact: '',
  site_web: '' // piège à robots
})

const errors = ref<string[]>([])
const sending = ref(false)
const sent = ref(false)
const failed = ref('')
const has = (k: string) => (errors.value.includes(k) ? '1' : '0')

const accord = computed(() => Number(f.q8) >= 4)

// « Aucune » et « rien » sont exclusifs des autres réponses.
watch(() => [...f.q11], (v, old) => {
  if (v.includes('aucune') && !old.includes('aucune')) f.q11 = ['aucune']
  else if (v.length > 1 && v.includes('aucune')) f.q11 = v.filter((x) => x !== 'aucune')
})
watch(() => [...f.emporte], (v, old) => {
  if (v.includes('rien') && !old.includes('rien')) f.emporte = ['rien']
  else if (v.length > 1 && v.includes('rien')) f.emporte = v.filter((x) => x !== 'rien')
})

async function submit() {
  failed.value = ''
  sending.value = true
  try {
    await $fetch('/api/reponse', { method: 'POST', body: { ...f, q8: Number(f.q8) } })
    errors.value = []
    sent.value = true
    await nextTick()
    document.getElementById('haut')?.scrollIntoView()
  } catch (e: any) {
    errors.value = e?.data?.data?.errors || []
    if (errors.value.length) {
      await nextTick()
      document.querySelector('[data-err="1"]')?.scrollIntoView({ block: 'center' })
    } else {
      failed.value = e?.statusMessage || 'L’envoi a échoué. Réessayez dans un instant.'
    }
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="wrap" id="haut">
    <!-- Confirmation ------------------------------------------------------ -->
    <section v-if="sent">
      <h1>C’est envoyé. Merci.</h1>
      <p class="lede">
        Votre réponse est enregistrée. Elle rejoint une trentaine d’autres qui serviront à
        préparer des entretiens — c’est là que se fait le vrai travail.
      </p>
      <div class="note">
        <p v-if="f.q12">
          <strong>Vous avez accepté un entretien.</strong> Si vous avez laissé un moyen de vous
          joindre, je vous écris dans les jours qui viennent. Sinon, écrivez-moi : la démarche
          reste ouverte.
        </p>
        <p>
          Votre réponse sera <strong>supprimée automatiquement au bout de {{ retentionMonths }} mois</strong>.
          Pour la faire retirer avant, voir <NuxtLink to="/donnees">Vos données</NuxtLink>.
        </p>
      </div>
      <p style="margin-top:1.6rem">
        <strong>Ce qui aide le plus, maintenant :</strong> transmettre ce questionnaire à une
        collègue, et surtout à quelqu’un dont vous savez qu’il ou elle n’est pas d’accord avec
        la démarche.
      </p>
      <p><NuxtLink to="/a-propos">En savoir plus sur cette recherche</NuxtLink></p>
    </section>

    <!-- Questionnaire ----------------------------------------------------- -->
    <template v-else>
      <h1>Ce qui sort avec vous</h1>
      <p class="lede">
        Une enquête sur les pratiques d’éducation et d’animation en extérieur, menée dans le
        cadre d’un mémoire de fin d’études. Cinq minutes, sans compte, sans inscription.
      </p>

      <p>
        Elle cherche à décrire ce qui se passe réellement pendant une sortie : ce que vous
        emportez, et ce qui arrive quand un enfant trouve quelque chose que personne ne sait
        nommer. Elle ne présente aucun produit et ne vous demande pas si une idée vous plaît.
      </p>

      <div class="note">
        <p>
          <strong>Aucune information personnelle n’est requise.</strong> Ni nom, ni structure, ni
          adresse. Les réponses sont hébergées dans l’Union européenne, utilisées uniquement
          pour cette recherche, et supprimées automatiquement au bout de {{ retentionMonths }} mois.
          Un moyen de vous joindre n’est demandé qu’à la toute fin, et seulement si vous le
          souhaitez. <NuxtLink to="/donnees">Le détail</NuxtLink>.
        </p>
      </div>

      <form novalidate @submit.prevent="submit">
        <!-- A ------------------------------------------------------------- -->
        <fieldset>
          <legend class="sec"><b>Partie A</b><span class="t">Vous et votre pratique</span></legend>

          <div class="q" :data-err="has('cadre')">
            <span class="q-title">1. Dans quel cadre encadrez-vous des enfants ? <span class="req">*</span></span>
            <div class="opts">
              <label v-for="o in CADRES" :key="o.v" class="opt">
                <input v-model="f.cadre" type="radio" name="cadre" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <input v-if="f.cadre === 'autre'" v-model="f.cadre_autre" class="inline-other" type="text" placeholder="Précisez" maxlength="200" />
            <p v-if="has('cadre') === '1'" class="err">Merci d’indiquer votre cadre.</p>
          </div>

          <div class="q" :data-err="has('ages')">
            <span class="q-title">2. Âge des enfants que vous encadrez <span class="req">*</span></span>
            <span class="q-hint">Plusieurs réponses possibles.</span>
            <div class="opts row">
              <label v-for="o in AGES" :key="o.v" class="opt">
                <input v-model="f.ages" type="checkbox" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <p v-if="has('ages') === '1'" class="err">Choisissez au moins une tranche d’âge.</p>
          </div>

          <div class="q" :data-err="has('frequence')">
            <span class="q-title">3. Fréquence des sorties <span class="req">*</span></span>
            <div class="opts row">
              <label v-for="o in FREQUENCES" :key="o.v" class="opt">
                <input v-model="f.frequence" type="radio" name="frequence" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <p v-if="has('frequence') === '1'" class="err">Merci d’indiquer une fréquence.</p>
          </div>

          <div class="q" :data-err="has('anciennete')">
            <span class="q-title">4. Depuis combien de temps ? <span class="req">*</span></span>
            <div class="opts row">
              <label v-for="o in ANCIENNETES" :key="o.v" class="opt">
                <input v-model="f.anciennete" type="radio" name="anciennete" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <p v-if="has('anciennete') === '1'" class="err">Merci de répondre.</p>
          </div>

          <div class="q" :data-err="has('groupe')">
            <span class="q-title">5. Taille habituelle du groupe <span class="req">*</span></span>
            <div class="opts row">
              <label v-for="o in GROUPES" :key="o.v" class="opt">
                <input v-model="f.groupe" type="radio" name="groupe" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <p v-if="has('groupe') === '1'" class="err">Merci de répondre.</p>
          </div>
        </fieldset>

        <!-- B ------------------------------------------------------------- -->
        <fieldset>
          <legend class="sec"><b>Partie B</b><span class="t">Ce qui sort avec vous</span></legend>

          <div class="q" :data-err="has('emporte')">
            <span class="q-title">
              Qu’emportez-vous, ou laissez-vous emporter aux enfants ? <span class="req">*</span>
            </span>
            <span class="q-hint">Plusieurs réponses possibles.</span>
            <div class="opts row">
              <label v-for="o in EMPORTE" :key="o.v" class="opt">
                <input v-model="f.emporte" type="checkbox" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <input v-if="f.emporte.includes('autre')" v-model="f.emporte_autre" class="inline-other" type="text" placeholder="Précisez" maxlength="200" />
            <p v-if="has('emporte') === '1'" class="err">Choisissez au moins une réponse.</p>
          </div>
        </fieldset>

        <!-- C ------------------------------------------------------------- -->
        <fieldset>
          <legend class="sec"><b>Partie C</b><span class="t">Le moment de la question</span></legend>

          <div class="q" :data-err="has('q6')">
            <label for="q6">
              6. Un enfant trouve quelque chose qu’il ne connaît pas. Que se passe-t-il ensuite ?
              <span class="req">*</span>
            </label>
            <span class="q-hint">Racontez comme cela se passe chez vous, même si c’est banal.</span>
            <textarea id="q6" v-model="f.q6" maxlength="4000" rows="5"></textarea>
            <p v-if="has('q6') === '1'" class="err">Cette question est la plus utile du questionnaire ; quelques mots suffisent.</p>
          </div>

          <div class="q" :data-err="has('q7')">
            <label for="q7">7. Vous arrive-t-il de ne pas savoir répondre ? Comment faites-vous ? <span class="req">*</span></label>
            <textarea id="q7" v-model="f.q7" maxlength="4000" rows="4"></textarea>
            <p v-if="has('q7') === '1'" class="err">Merci de répondre, même brièvement.</p>
          </div>
        </fieldset>

        <!-- D ------------------------------------------------------------- -->
        <fieldset>
          <legend class="sec"><b>Partie D</b><span class="t">Le numérique</span></legend>

          <div class="q" :data-err="has('q8')">
            <span class="q-title">
              8. « Un outil numérique n’a rien à faire dans une sortie nature. » <span class="req">*</span>
            </span>
            <span class="q-hint">Où vous situez-vous ?</span>
            <div class="echelle">
              <label v-for="o in ECHELLE" :key="o.v" class="opt">
                <input v-model="f.q8" type="radio" name="q8" :value="o.v" />
                <b>{{ o.v }}</b>
                <span>{{ o.l }}</span>
              </label>
            </div>
            <p v-if="has('q8') === '1'" class="err">Merci de choisir une position.</p>
          </div>

          <div class="q" :data-err="has('q9')">
            <label for="q9">
              9. Si vous êtes d’accord avec cette affirmation, pourquoi ?
              <span v-if="accord" class="req">*</span>
            </label>
            <span class="q-hint">
              C’est la question qui compte le plus. Dites-le avec vos mots, sans chercher à être
              nuancé.
            </span>
            <textarea id="q9" v-model="f.q9" maxlength="4000" rows="5"></textarea>
            <p v-if="has('q9') === '1'" class="err">
              Vous vous êtes déclaré d’accord : merci d’expliquer pourquoi, c’est le cœur de l’enquête.
            </p>
          </div>

          <div class="q">
            <label for="q10">10. Y a-t-il des conditions dans lesquelles vous l’accepteriez ?</label>
            <textarea id="q10" v-model="f.q10" maxlength="4000" rows="4"></textarea>
          </div>

          <div class="q" :data-err="has('q11')">
            <span class="q-title">
              11. Utilisez-vous déjà une application naturaliste, à titre personnel ou professionnel ?
              <span class="req">*</span>
            </span>
            <span class="q-hint">Plusieurs réponses possibles.</span>
            <div class="opts row">
              <label v-for="o in APPS" :key="o.v" class="opt">
                <input v-model="f.q11" type="checkbox" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <input v-if="f.q11.includes('autre')" v-model="f.q11_autre" class="inline-other" type="text" placeholder="Laquelle ?" maxlength="200" />
            <p v-if="has('q11') === '1'" class="err">Choisissez au moins une réponse, « aucune » comprise.</p>
          </div>
        </fieldset>

        <!-- E ------------------------------------------------------------- -->
        <fieldset>
          <legend class="sec"><b>Partie E</b><span class="t">Aller plus loin — facultatif</span></legend>

          <div class="q">
            <span class="q-title">12. Accepteriez-vous un entretien d’une heure ?</span>
            <span class="q-hint">
              En visio ou sur le terrain, à votre convenance. Un entretien vaut trente questionnaires.
            </span>
            <div class="opts row">
              <label class="opt"><input v-model="f.q12" type="radio" name="q12" :value="true" /><span>Oui, pourquoi pas</span></label>
              <label class="opt"><input v-model="f.q12" type="radio" name="q12" :value="false" /><span>Non</span></label>
            </div>
          </div>

          <div class="q">
            <label for="q13">
              13. Connaissez-vous quelqu’un qui trouverait cette démarche déplacée, et à qui je
              pourrais parler ?
            </label>
            <span class="q-hint">
              La question est inhabituelle, et sérieuse : les objections valent plus que les
              approbations. Décrivez la personne, ou dites simplement en quoi elle s’y opposerait.
            </span>
            <textarea id="q13" v-model="f.q13" maxlength="4000" rows="4"></textarea>
          </div>

          <div class="q">
            <label for="contact">Un moyen de vous joindre, si vous le souhaitez</label>
            <span class="q-hint">
              Adresse électronique, téléphone, ou rien du tout. Ce champ est le seul du
              questionnaire qui puisse vous identifier : il est facultatif, il ne sert qu’à
              convenir d’un entretien, et il est supprimé avec le reste au bout de
              {{ retentionMonths }} mois.
            </span>
            <input id="contact" v-model="f.contact" type="text" maxlength="500" autocomplete="off" placeholder="Facultatif" />
          </div>

          <div class="hp" aria-hidden="true">
            <label>Ne pas remplir<input v-model="f.site_web" type="text" tabindex="-1" autocomplete="off" /></label>
          </div>
        </fieldset>

        <div class="actions">
          <button class="btn" type="submit" :disabled="sending">
            {{ sending ? 'Envoi…' : 'Envoyer ma réponse' }}
          </button>
          <small class="meta">Aucun compte, aucun traceur, aucun cookie.</small>
        </div>
        <p v-if="errors.length" class="err">
          Il manque {{ errors.length }} réponse{{ errors.length > 1 ? 's' : '' }} ci-dessus.
        </p>
        <p v-if="failed" class="err">{{ failed }}</p>
      </form>
    </template>
  </div>
</template>
