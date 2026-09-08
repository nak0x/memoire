<script setup lang="ts">
import {
  LIENS, AGES_PROCHES, SORTIES, SAVOIRS, ENFANCE, GESTES, APPS, VOIES,
  CONDITIONS, AGES_MINI, ECHELLE
} from '~~/shared/options'

// Note méthodologique — à ne pas « améliorer » :
// ce questionnaire ne décrit aucun objet et ne demande à personne si une idée
// lui plaît. Il mesure des positions et des pratiques déclarées, pas l'accueil
// d'un projet. Voir ../../../terrain/questionnaire-public.md
//
// L'ordre des questions 11 et 12 est méthodologique, pas esthétique : la
// question ouverte « pourquoi » vient AVANT la liste fermée de conditions,
// pour recueillir l'argument spontané avant de suggérer des réponses.

useHead({
  title: 'Les enfants, la nature et les écrans — enquête ouverte à tous',
  meta: [
    {
      name: 'description',
      content:
        'Un questionnaire de cinq minutes, ouvert à tout le monde, avec ou sans enfant : ce que vous faites dehors face à ce que vous ne connaissez pas, et ce que vous pensez des appareils numériques pour apprendre la nature.'
    }
  ]
})

const { retentionMonths } = useRuntimeConfig().public

const f = reactive({
  lien: '',
  ages: [] as string[],
  sorties: '', savoir: '', enfance: '',
  gestes: [] as string[], gestes_autre: '',
  apps: [] as string[], apps_autre: '',
  voies: [] as string[],
  souvenir: '',
  position: '', pourquoi: '',
  conditions: [] as string[], conditions_autre: '',
  age_mini: '',
  entretien: null as boolean | null,
  contradicteur: '', contact: '',
  site_web: '' // piège à robots
})

const errors = ref<string[]>([])
const sending = ref(false)
const sent = ref(false)
const failed = ref('')
const has = (k: string) => (errors.value.includes(k) ? '1' : '0')

const accord = computed(() => Number(f.position) >= 4)
const cotoie = computed(() => f.lien !== '' && f.lien !== 'sans')
const pro = computed(() => f.lien === 'metier')

// Les réponses exclusives : cocher « rien » ou « aucune » efface le reste.
const exclusif = (cle: 'gestes' | 'apps' | 'conditions', mot: string) =>
  watch(() => [...f[cle]], (v, old) => {
    if (v.includes(mot) && !old.includes(mot)) f[cle] = [mot]
    else if (v.length > 1 && v.includes(mot)) f[cle] = v.filter((x) => x !== mot)
  })
exclusif('gestes', 'rien')
exclusif('apps', 'aucune')
exclusif('conditions', 'jamais')

// « Sans objet » vaut pour toute la question.
watch(() => [...f.ages], (v, old) => {
  if (v.includes('sans-objet') && !old.includes('sans-objet')) f.ages = ['sans-objet']
  else if (v.length > 1 && v.includes('sans-objet')) f.ages = v.filter((x) => x !== 'sans-objet')
})

async function submit() {
  failed.value = ''
  sending.value = true
  try {
    await $fetch('/api/reponse-publique', {
      method: 'POST',
      body: { ...f, position: Number(f.position) }
    })
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
        Votre réponse est enregistrée. Elle sera lue une par une, à la main : ce questionnaire
        est trop court pour prouver quoi que ce soit, mais il oriente des entretiens, et ce
        sont eux qui produisent la matière.
      </p>
      <div class="note">
        <p v-if="f.entretien">
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
        <strong>Ce qui aide le plus, maintenant :</strong> transmettre ce questionnaire à
        quelqu’un dont vous savez qu’il ne pense pas comme vous. Un désaccord argumenté vaut
        plus qu’une approbation.
      </p>
      <p class="actions">
        <NuxtLink class="btn ghost" to="/lichen">Découvrir la recherche</NuxtLink>
        <NuxtLink class="btn ghost" to="/entretiens">Participer à un entretien</NuxtLink>
      </p>
    </section>

    <!-- Questionnaire ----------------------------------------------------- -->
    <template v-else>
      <h1>Les enfants, la nature et les écrans</h1>
      <p class="lede">
        Un questionnaire de cinq minutes, ouvert à tout le monde — que vous ayez des enfants
        ou non, que vous alliez dehors souvent ou jamais. Sans compte, sans inscription.
      </p>

      <p>
        Il fait partie d’un mémoire de fin d’études sur les pédagogies du dehors. Un autre
        questionnaire s’adresse aux professionnels ; celui-ci s’adresse à tout le monde,
        parce que ce que pensent les adultes ordinaires du numérique et de la nature compte
        autant que ce qu’en disent les spécialistes — et n’est mesuré nulle part.
      </p>

      <div class="note">
        <p>
          <strong>Il n’y a pas de bonne réponse, et rien à connaître.</strong> Répondre
          « je ne remarque pas », « presque jamais » ou « aucune » est une donnée aussi utile
          que le contraire — plus utile, même, parce que ce sont les réponses que ce genre
          d’enquête recueille le moins.
        </p>
      </div>

      <div class="note">
        <p>
          <strong>Aucune information personnelle n’est requise.</strong> Ni nom, ni âge, ni
          adresse. Les réponses sont hébergées dans l’Union européenne, utilisées uniquement
          pour cette recherche, et supprimées automatiquement au bout de {{ retentionMonths }} mois.
          Un moyen de vous joindre n’est demandé qu’à la toute fin, et seulement si vous le
          souhaitez. <NuxtLink to="/donnees">Le détail</NuxtLink>.
        </p>
      </div>

      <form novalidate @submit.prevent="submit">
        <!-- A ------------------------------------------------------------- -->
        <fieldset>
          <legend class="sec"><b>Partie A</b><span class="t">Vous</span></legend>

          <div class="q" :data-err="has('lien')">
            <span class="q-title">1. Côtoyez-vous des enfants ? <span class="req">*</span></span>
            <div class="opts">
              <label v-for="o in LIENS" :key="o.v" class="opt">
                <input v-model="f.lien" type="radio" name="lien" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <div v-if="pro" class="note" style="margin-top:.7rem">
              <p>
                Un questionnaire plus précis existe pour les personnes qui encadrent des
                enfants dans leur métier — <NuxtLink to="/">celui-ci</NuxtLink>. Vous pouvez
                répondre aux deux : ils ne posent pas les mêmes questions.
              </p>
            </div>
            <p v-if="has('lien') === '1'" class="err">Merci de choisir une réponse.</p>
          </div>

          <div v-if="cotoie" class="q" :data-err="has('ages')">
            <span class="q-title">2. Quel âge ont-ils ? <span class="req">*</span></span>
            <span class="q-hint">Plusieurs réponses possibles.</span>
            <div class="opts row">
              <label v-for="o in AGES_PROCHES" :key="o.v" class="opt">
                <input v-model="f.ages" type="checkbox" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <p v-if="has('ages') === '1'" class="err">Choisissez au moins une réponse.</p>
          </div>

          <div class="q" :data-err="has('sorties')">
            <span class="q-title">
              3. À quelle fréquence allez-vous dans un espace naturel ? <span class="req">*</span>
            </span>
            <span class="q-hint">Forêt, campagne, bord de mer, montagne, grand parc — pour vous, pas pour les enfants.</span>
            <div class="opts row">
              <label v-for="o in SORTIES" :key="o.v" class="opt">
                <input v-model="f.sorties" type="radio" name="sorties" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <p v-if="has('sorties') === '1'" class="err">Merci d’indiquer une fréquence.</p>
          </div>

          <div class="q" :data-err="has('savoir')">
            <span class="q-title">
              4. Combien d’espèces sauvages sauriez-vous nommer autour de chez vous ?
              <span class="req">*</span>
            </span>
            <span class="q-hint">Plantes, oiseaux, insectes confondus. À vue de nez, sans vous relire.</span>
            <div class="opts row">
              <label v-for="o in SAVOIRS" :key="o.v" class="opt">
                <input v-model="f.savoir" type="radio" name="savoir" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <p v-if="has('savoir') === '1'" class="err">Merci de répondre.</p>
          </div>

          <div class="q" :data-err="has('enfance')">
            <span class="q-title">
              5. Enfant, passiez-vous du temps dehors sans adulte ? <span class="req">*</span>
            </span>
            <div class="opts row">
              <label v-for="o in ENFANCE" :key="o.v" class="opt">
                <input v-model="f.enfance" type="radio" name="enfance" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <p v-if="has('enfance') === '1'" class="err">Merci de répondre.</p>
          </div>
        </fieldset>

        <!-- B ------------------------------------------------------------- -->
        <fieldset>
          <legend class="sec"><b>Partie B</b><span class="t">Ce que vous faites, vous</span></legend>

          <div class="q" :data-err="has('gestes')">
            <span class="q-title">
              6. Dehors, vous voyez une plante ou un animal que vous ne connaissez pas.
              Que faites-vous ? <span class="req">*</span>
            </span>
            <span class="q-hint">Plusieurs réponses possibles. Répondez ce que vous faites vraiment, pas ce qu’il faudrait faire.</span>
            <div class="opts">
              <label v-for="o in GESTES" :key="o.v" class="opt">
                <input v-model="f.gestes" type="checkbox" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <input v-if="f.gestes.includes('autre')" v-model="f.gestes_autre" class="inline-other" type="text" placeholder="Précisez" maxlength="200" />
            <p v-if="has('gestes') === '1'" class="err">Choisissez au moins une réponse.</p>
          </div>

          <div class="q" :data-err="has('apps')">
            <span class="q-title">
              7. Utilisez-vous une application pour identifier ce que vous voyez ?
              <span class="req">*</span>
            </span>
            <span class="q-hint">Plusieurs réponses possibles. « Aucune » est une réponse.</span>
            <div class="opts row">
              <label v-for="o in APPS" :key="o.v" class="opt">
                <input v-model="f.apps" type="checkbox" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <input v-if="f.apps.includes('autre')" v-model="f.apps_autre" class="inline-other" type="text" placeholder="Laquelle ?" maxlength="200" />
            <p v-if="has('apps') === '1'" class="err">Choisissez au moins une réponse, « aucune » comprise.</p>
          </div>
        </fieldset>

        <!-- C ------------------------------------------------------------- -->
        <fieldset>
          <legend class="sec"><b>Partie C</b><span class="t">Ce qui attache un enfant à la nature</span></legend>

          <div class="q" :data-err="has('voies')">
            <span class="q-title">
              8. À votre avis, qu’est-ce qui donne à un enfant l’envie de protéger la nature,
              plus tard ? <span class="req">*</span>
            </span>
            <span class="q-hint">Plusieurs réponses possibles — mais si vous deviez n’en garder que deux ou trois, lesquelles ?</span>
            <div class="opts">
              <label v-for="o in VOIES" :key="o.v" class="opt">
                <input v-model="f.voies" type="checkbox" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <p v-if="has('voies') === '1'" class="err">Choisissez au moins une réponse.</p>
          </div>

          <div class="q">
            <label for="souvenir">9. Un souvenir de nature qui vous a marqué ?</label>
            <span class="q-hint">
              Enfant ou adulte, banal ou non. Facultatif — mais ce sont ces réponses-là qui
              apprennent le plus.
            </span>
            <textarea id="souvenir" v-model="f.souvenir" maxlength="4000" rows="4"></textarea>
          </div>
        </fieldset>

        <!-- D ------------------------------------------------------------- -->
        <fieldset>
          <legend class="sec"><b>Partie D</b><span class="t">Le numérique dehors</span></legend>

          <div class="q" :data-err="has('position')">
            <span class="q-title">
              10. « Un écran n’a rien à faire dans une balade en nature. » <span class="req">*</span>
            </span>
            <span class="q-hint">Où vous situez-vous ?</span>
            <div class="echelle">
              <label v-for="o in ECHELLE" :key="o.v" class="opt">
                <input v-model="f.position" type="radio" name="position" :value="o.v" />
                <b>{{ o.v }}</b>
                <span>{{ o.l }}</span>
              </label>
            </div>
            <p v-if="has('position') === '1'" class="err">Merci de choisir une position.</p>
          </div>

          <div class="q" :data-err="has('pourquoi')">
            <label for="pourquoi">
              11. Si vous êtes d’accord avec cette affirmation, pourquoi ?
              <span v-if="accord" class="req">*</span>
            </label>
            <span class="q-hint">
              C’est la question qui compte le plus. Dites-le avec vos mots, sans chercher à
              être nuancé — et avant de lire la question suivante.
            </span>
            <textarea id="pourquoi" v-model="f.pourquoi" maxlength="4000" rows="5"></textarea>
            <p v-if="has('pourquoi') === '1'" class="err">
              Vous vous êtes déclaré d’accord : merci d’expliquer pourquoi, c’est le cœur de l’enquête.
            </p>
          </div>

          <div class="q" :data-err="has('conditions')">
            <span class="q-title">
              12. À quelles conditions accepteriez-vous qu’un enfant se serve d’un appareil
              numérique pour apprendre la nature, dehors ? <span class="req">*</span>
            </span>
            <span class="q-hint">Plusieurs réponses possibles. « Aucune » est une réponse pleine et entière.</span>
            <div class="opts">
              <label v-for="o in CONDITIONS" :key="o.v" class="opt">
                <input v-model="f.conditions" type="checkbox" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <input v-if="f.conditions.includes('autre')" v-model="f.conditions_autre" class="inline-other" type="text" placeholder="Précisez" maxlength="200" />
            <p v-if="has('conditions') === '1'" class="err">Choisissez au moins une réponse.</p>
          </div>

          <div class="q" :data-err="has('age_mini')">
            <span class="q-title">13. À partir de quel âge, si jamais ? <span class="req">*</span></span>
            <div class="opts">
              <label v-for="o in AGES_MINI" :key="o.v" class="opt">
                <input v-model="f.age_mini" type="radio" name="age_mini" :value="o.v" />
                <span>{{ o.l }}</span>
              </label>
            </div>
            <p v-if="has('age_mini') === '1'" class="err">Merci de choisir une réponse.</p>
          </div>
        </fieldset>

        <!-- E ------------------------------------------------------------- -->
        <fieldset>
          <legend class="sec"><b>Partie E</b><span class="t">Aller plus loin — facultatif</span></legend>

          <div class="q">
            <span class="q-title">14. Accepteriez-vous d’en parler une heure ?</span>
            <span class="q-hint">
              En visio ou autour d’un café. Aucune compétence requise : c’est justement le
              point de vue de quelqu’un qui n’est pas du métier qui manque.
            </span>
            <div class="opts row">
              <label class="opt"><input v-model="f.entretien" type="radio" name="entretien" :value="true" /><span>Oui, pourquoi pas</span></label>
              <label class="opt"><input v-model="f.entretien" type="radio" name="entretien" :value="false" /><span>Non</span></label>
            </div>
          </div>

          <div class="q">
            <label for="contradicteur">
              15. Connaissez-vous quelqu’un qui trouverait cette démarche déplacée, et à qui je
              pourrais parler ?
            </label>
            <span class="q-hint">
              La question est inhabituelle, et sérieuse : les objections valent plus que les
              approbations. Décrivez la personne, ou dites simplement en quoi elle s’y opposerait.
            </span>
            <textarea id="contradicteur" v-model="f.contradicteur" maxlength="4000" rows="4"></textarea>
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
