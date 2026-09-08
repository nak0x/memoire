<script setup lang="ts">
/**
 * Page de présentation du projet.
 *
 * Contrainte de fond, identique à /projet et /a-propos : cette page ne décrit
 * aucun objet, aucun prototype, aucune solution. Elle présente une question,
 * une méthode et un terrain. Y annoncer un produit reviendrait à demander aux
 * répondants s'ils aiment une idée — et invaliderait les réponses déjà
 * collectées (voir le README et le protocole d'entretien).
 *
 * C'est aussi la seule page du site qui charge une bibliothèque d'animation ;
 * `/` — le questionnaire — reste sans script d'agrément.
 */
useHead({
  title: 'LICHEN — enquête sur les pédagogies du dehors et les outils numériques',
  meta: [
    {
      name: 'description',
      content:
        'LICHEN : un projet de recherche sur la place, s’il y en a une, des outils numériques dans les pédagogies du dehors. Une enquête de terrain, pas un produit.'
    }
  ]
})

const { contactEmail } = useRuntimeConfig().public

const duel = [
  { l: 'L’attention va à', a: 'l’appareil', b: 'le milieu' },
  { l: 'L’économie', a: 'capter du temps et le revendre', b: 'rendre du temps disponible' },
  { l: 'Le rythme', a: 'immédiat, notifié, infini', b: 'saisonnier, lent, situé' },
  { l: 'La réponse', a: 'donnée avant la question', b: 'cherchée, différée, parfois absente' },
  { l: 'L’enfant est', a: 'consommateur, capteur de données', b: 'auteur, observateur' }
]

const refus = [
  { n: '01', t: 'Le geste et les sens', d: 'Un écran couperait du réel, quel que soit ce qu’il montre. Le refus porterait alors sur la matière même de l’objet.' },
  { n: '02', t: 'La logistique', d: 'Batteries à charger, casse, vol, vingt appareils à gérer pendant qu’on surveille vingt enfants. Un refus pratique, et réversible.' },
  { n: '03', t: 'L’institution', d: 'Ce que le numérique charrie de l’école : l’évaluation, la trace, le contrôle. Le refus viserait le cadre, pas la technique.' },
  { n: '04', t: 'Le modèle économique', d: 'Ce que ces objets cherchent à obtenir de ceux qui les utilisent. Le refus viserait une industrie, et laisserait la porte ouverte à autre chose.' }
]

/** Séparateur de milliers fixe : le rendu serveur et le client doivent coïncider. */
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f')

const chiffres = [
  { v: 79, s: ' %', t: 'de l’empreinte carbone du numérique vient des terminaux — pas des centres de données. L’essentiel est payé à la fabrication, avant le premier allumage.', src: 'ADEME – Arcep, 2023' },
  { v: 45, p: '+', s: ' %', t: 'd’émissions du numérique en plus d’ici 2030 au scénario tendanciel. Des cinq scénarios prospectifs, un seul réduit l’empreinte.', src: 'ADEME – Arcep, 2023' },
  { v: 1116, s: '', t: 'écoles hors contrat dans le premier degré en 2024, contre 502 en 2015. Une population motivée, contrainte, en demande de ressources autonomes.', src: 'DEPP, RERS 2024' },
  { v: 0, s: '', t: 'chiffre national ne recense la classe dehors. Une pratique en expansion rapide, et invisible dans la statistique publique — c’est ce qui justifie une enquête.', src: 'Éducation nationale' }
]

const LETTRES = [...'LICHEN']

const racine = ref<HTMLElement | null>(null)
const titre = ref<HTMLElement | null>(null)
let ctx: { revert: () => void } | null = null
let cleanup: (() => void) | null = null

// Enregistré ici, pas après l'`await` : passé le premier point d'attente,
// Vue n'a plus d'instance courante et le nettoyage ne serait jamais posé.
onBeforeUnmount(() => {
  cleanup?.()
  ctx?.revert()
})

onMounted(async () => {
  const el = racine.value
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // L'état de départ des animations est posé en CSS, tout de suite : sans cela
  // la page s'affiche en clair puis disparaît, le temps que la bibliothèque
  // arrive. Si ce chargement échoue, la classe est retirée et tout reste lisible.
  el.classList.add('anime')

  let gsap: typeof import('gsap')['gsap']
  let ScrollTrigger: typeof import('gsap/ScrollTrigger')['ScrollTrigger']
  try {
    const [a, b] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
    gsap = a.gsap
    ScrollTrigger = b.ScrollTrigger
  } catch {
    el.classList.remove('anime')
    return
  }
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // — Hero : le texte monte doucement. Le titre, lui, est déjà là ; il ne
    //   s'anime qu'à l'approche du curseur (voir plus bas).
    gsap.to('[data-hero]', { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.13 })

    // — Le titre pousse sous la main.
    //
    //   Chaque lettre répond à la distance qui la sépare du curseur, avec un
    //   affaiblissement gaussien : la plus proche grossit et se soulève, ses
    //   voisines s'écartent et s'inclinent vers elle, et le reste ne bouge
    //   presque pas. Tant que le pointeur n'a rien dit — au doigt, ou avant le
    //   premier mouvement — un curseur fantôme fait l'aller-retour, et la
    //   même mécanique suffit à faire respirer le mot.
    const mot = titre.value
    const lettres = mot ? gsap.utils.toArray<HTMLElement>('[data-lettre]', mot) : []

    if (mot && lettres.length) {
      // Position de repos de chaque lettre : `offsetLeft` est une mesure de
      // mise en page, que les transformations appliquées ensuite ne faussent pas.
      let centres: number[] = []
      const mesurer = () => { centres = lettres.map((l) => l.offsetLeft + l.offsetWidth / 2) }
      mesurer()

      const pilote = lettres.map((l) => ({
        e: gsap.quickTo(l, 'scale', { duration: 0.55, ease: 'power3' }),
        x: gsap.quickTo(l, 'x', { duration: 0.55, ease: 'power3' }),
        y: gsap.quickTo(l, 'y', { duration: 0.55, ease: 'power3' }),
        r: gsap.quickTo(l, 'rotation', { duration: 0.7, ease: 'power3' })
      }))

      // `x` suit le curseur, `force` fond l'effet quand il s'éloigne en hauteur.
      const main = { x: 0, force: 0 }
      let balade: { kill: () => void } | null = null

      const flaner = () => {
        balade?.kill()
        const l = mot.offsetWidth
        main.x = -l * 0.12
        balade = gsap.to(main, { x: l * 1.12, duration: 4.6, ease: 'sine.inOut', repeat: -1, yoyo: true })
        gsap.to(main, { force: 0.5, duration: 1.4, ease: 'power2.out' })
      }

      const suivre = (ev: PointerEvent) => {
        const r = mot.getBoundingClientRect()
        balade?.kill()
        balade = null
        main.x = ev.clientX - r.left
        // Au-delà d'une hauteur de titre au-dessus ou en dessous, l'effet s'éteint.
        const h = Math.abs(ev.clientY - (r.top + r.height / 2)) / (r.height * 1.6)
        gsap.to(main, { force: Math.max(0, 1 - h), duration: 0.45, ease: 'power2.out' })
      }

      const rendre = () => {
        const h = mot.offsetHeight
        const rayon = Math.max(90, h * 0.85)
        for (let i = 0; i < lettres.length; i++) {
          const d = ((centres[i] ?? 0) - main.x) / rayon
          const cloche = Math.exp(-d * d)
          const f = cloche * main.force
          // `d * cloche` s'annule sous le curseur : les voisines s'écartent,
          // la lettre visée ne tremble pas.
          const ecart = d * cloche * main.force
          pilote[i]!.e(1 + 0.44 * f)
          pilote[i]!.y(-0.17 * h * f)
          pilote[i]!.x(0.24 * h * ecart)
          pilote[i]!.r(-15 * ecart)
        }
      }

      let tourne = false
      const jouer = (o: boolean) => {
        if (o === tourne) return
        tourne = o
        o ? gsap.ticker.add(rendre) : gsap.ticker.remove(rendre)
      }

      // Rien ne tourne quand le titre est sorti de l'écran.
      ScrollTrigger.create({
        trigger: mot,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => jouer(self.isActive)
      })

      flaner()
      window.addEventListener('pointermove', suivre, { passive: true })
      window.addEventListener('resize', mesurer)

      cleanup = () => {
        jouer(false)
        balade?.kill()
        window.removeEventListener('pointermove', suivre)
        window.removeEventListener('resize', mesurer)
      }
    }

    // — Apparition au défilement, pour tout ce qui est marqué.
    gsap.utils.toArray<HTMLElement>('[data-monte]').forEach((c) => {
      gsap.to(c, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power2.out',
        scrollTrigger: { trigger: c, start: 'top 88%' }
      })
    })

    gsap.utils.toArray<HTMLElement>('[data-serie]').forEach((bloc) => {
      gsap.to(bloc.children, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: { trigger: bloc, start: 'top 82%' }
      })
    })

    // — Le faux débat : les deux colonnes viennent l'une contre l'autre.
    gsap.utils.toArray<HTMLElement>('[data-duel] .a, [data-duel] .b').forEach((c) => {
      gsap.to(c, {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: c, start: 'top 92%' }
      })
    })

    // — Les chiffres se comptent quand ils entrent dans l'écran. La valeur
    //   exacte est déjà dans le HTML : sans script, elle reste juste.
    gsap.utils.toArray<HTMLElement>('[data-compte]').forEach((c) => {
      const cible = Number(c.dataset.compte || 0)
      const etat = { v: 0 }
      gsap.fromTo(
        etat,
        { v: 0 },
        {
          v: cible,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: c, start: 'top 88%' },
          onUpdate: () => { c.textContent = fmt(Math.round(etat.v)) },
          onComplete: () => { c.textContent = fmt(cible) }
        }
      )
    })

    // — Le trait de la chronologie se dessine au défilement.
    gsap.to('[data-trait]', {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: '[data-trait]', start: 'top 78%', end: 'bottom 62%', scrub: 0.4 }
    })
  }, el)
})
</script>

<template>
  <div ref="racine" class="land">
    <!-- Hero ---------------------------------------------------------------->
    <section class="hero">
      <FondLichen />
      <div class="hero-in">
        <p class="sur" data-hero>Projet individuel · 2026 – 2027 · phase de terrain</p>

        <h1 ref="titre" class="titre" aria-label="LICHEN">
          <span v-for="(c, i) in LETTRES" :key="i" data-lettre>{{ c }}</span>
        </h1>

        <p class="accroche" data-hero>
          Quelle place, s’il y en a une, pour les outils numériques dans les pédagogies
          du dehors ? Une enquête de terrain — pas un produit, pas une opinion.
        </p>

        <p class="epi" data-hero>
          Le lichen est une symbiose : une algue et un champignon, que rien ne destinait à
          cohabiter, qui forment un seul être. Il pousse de quelques millimètres par an,
          vit des siècles, et sa seule présence indique la qualité de l’air.
        </p>

        <p class="actions" data-hero>
          <NuxtLink class="btn grand" to="/dehors">Répondre — tout le monde</NuxtLink>
          <NuxtLink class="btn ghost grand" to="/">Répondre — professionnels</NuxtLink>
        </p>
        <p class="fine" data-hero>
          Cinq minutes · sans compte · sans donnée personnelle obligatoire
        </p>
      </div>
      <div class="cue" aria-hidden="true"><span /></div>
    </section>

    <!-- Le nom -------------------------------------------------------------->
    <section class="bloc">
      <div class="wrap-mid">
        <p class="oeil" data-monte>Le nom</p>
        <h2 data-monte>Quatre propriétés d’un lichen, quatre exigences du projet</h2>
        <p class="lede" data-monte>
          Le nom n’est pas décoratif : c’est un cahier des charges tenu en quatre lignes.
        </p>
      </div>
      <div class="wrap-wide">
        <div class="cartes" data-serie>
          <article class="carte">
            <h3>Une alliance improbable</h3>
            <p>
              Une algue et un champignon. Le projet cherche si une alliance du même ordre est
              possible entre un outil numérique et des pédagogies qui, souvent, s’en méfient —
              et pour de bonnes raisons.
            </p>
          </article>
          <article class="carte">
            <h3>Une croissance lente</h3>
            <p>
              Quelques millimètres par an. Ici : écouter d’abord, conclure ensuite. Les
              hypothèses de départ sont écrites pour être mises en danger, pas pour être
              confirmées.
            </p>
          </article>
          <article class="carte">
            <h3>Une longévité anormale</h3>
            <p>
              Des siècles. Comme quatre cinquièmes de l’empreinte d’un appareil sont payés
              avant son premier allumage, la durée n’est pas une qualité optionnelle : c’est
              une condition de validité du discours.
            </p>
          </article>
          <article class="carte">
            <h3>Un indicateur</h3>
            <p>
              Sa présence signale la qualité de l’air. Une chose vaut moins pour ce qu’elle
              fait que pour ce que sa présence rend possible — et parfois, pour ce qu’elle
              révèle d’un milieu.
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- Le faux débat ------------------------------------------------------->
    <section class="bloc sombre">
      <div class="wrap-mid">
        <p class="oeil" data-monte>La tension</p>
        <h2 data-monte>Le faux débat, et le vrai</h2>
        <p class="lede" data-monte>
          On oppose d’ordinaire « écrans » et « pas d’écrans ». Sur le terrain, ce partage
          n’explique presque rien. Le conflit se joue ailleurs — entre deux manières
          d’occuper le temps d’un enfant.
        </p>
      </div>

      <div class="wrap-wide">
        <div class="duel" data-duel>
          <div class="duel-tete">
            <span />
            <span class="a">L’appareil grand public</span>
            <span class="b">La sortie</span>
          </div>
          <div v-for="l in duel" :key="l.l" class="duel-l">
            <span class="lab">{{ l.l }}</span>
            <span class="a">{{ l.a }}</span>
            <span class="b">{{ l.b }}</span>
          </div>
        </div>
      </div>

      <div class="wrap-mid">
        <p data-monte>
          L’hypothèse que je veux mettre à l’épreuve est celle-ci : ce que ces pédagogies
          rejetteraient n’est pas <em>la technologie</em>, mais un modèle — celui d’objets
          conçus pour capter l’attention et la revendre, là où une sortie cherche au contraire
          à rendre du temps et de l’attention disponibles.
        </p>
        <p data-monte>
          <strong>C’est une hypothèse, pas un résultat.</strong> Je n’ai à ce jour aucune
          source solide pour l’affirmer, et tout le terrain est là pour la confirmer ou la
          briser.
        </p>
      </div>
    </section>

    <!-- Les quatre refus ---------------------------------------------------->
    <section class="bloc">
      <div class="wrap-mid">
        <p class="oeil" data-monte>La question centrale</p>
        <h2 data-monte>Quand un éducateur refuse le numérique dehors, que refuse-t-il ?</h2>
        <p class="lede" data-monte>
          Quatre réponses sont possibles. Elles ne se distinguent pas dans les statistiques
          d’usage — seulement dans ce que les gens disent, avec leurs mots. Savoir laquelle
          domine est l’enjeu de ce travail.
        </p>
      </div>
      <div class="wrap-wide">
        <div class="refus" data-serie>
          <article v-for="r in refus" :key="r.n" class="carte">
            <b class="num">{{ r.n }}</b>
            <h3>{{ r.t }}</h3>
            <p>{{ r.d }}</p>
          </article>
        </div>
      </div>
      <div class="wrap-mid">
        <p class="fine centre" data-monte>
          Ces pistes ne s’excluent pas — et l’une d’elles suffirait à condamner l’idée même
          d’un outil numérique dehors.
        </p>
      </div>
    </section>

    <!-- Chiffres ------------------------------------------------------------>
    <section class="bloc sombre">
      <div class="wrap-mid">
        <p class="oeil" data-monte>Le contexte</p>
        <h2 data-monte>Quatre chiffres qui cadrent le travail</h2>
      </div>
      <div class="wrap-wide">
        <div class="chiffres" data-serie>
          <article v-for="c in chiffres" :key="c.src + c.v" class="chiffre">
            <b>
              <span v-if="c.p">{{ c.p }}</span><span :data-compte="c.v">{{ fmt(c.v) }}</span><span v-if="c.s">{{ c.s }}</span>
            </b>
            <p>{{ c.t }}</p>
            <small>{{ c.src }}</small>
          </article>
        </div>
      </div>
    </section>

    <!-- Le précédent -------------------------------------------------------->
    <section class="bloc">
      <div class="wrap-mid">
        <p class="oeil" data-monte>Le précédent</p>
        <h2 data-monte>1924 : une pédagogie alternative adopte une technologie industrielle</h2>
        <p class="lede" data-monte>
          Célestin Freinet fait entrer une presse typographique dans sa classe — la technologie
          de pointe de son temps. Elle est adoptée massivement, et sans conflit. Pourquoi ?
        </p>
      </div>
      <div class="wrap-mid">
        <div class="chrono">
          <span class="trait" data-trait aria-hidden="true" />
          <div class="etapes" data-serie>
            <div class="etape">
              <h3>C’était une technologie de production</h3>
              <p>Pas de diffusion. L’enfant fabrique quelque chose, il ne consulte pas.</p>
            </div>
            <div class="etape">
              <h3>Elle produisait un objet réel, pour des destinataires réels</h3>
              <p>Le journal de classe, et la correspondance entre écoles.</p>
            </div>
            <div class="etape">
              <h3>Elle ne remplaçait pas le maître, et ne surveillait personne</h3>
              <p>Aucune évaluation, aucune trace, aucun tableau de bord.</p>
            </div>
          </div>
        </div>
        <p data-monte>
          Ces trois conditions forment la <strong>grille d’admissibilité</strong> de ce travail.
          Elles rendent la question opérationnelle : qu’est-ce qui, en 2026, jouerait pour
          l’apprentissage du vivant le rôle que l’imprimerie a joué pour l’écrit ?
        </p>
      </div>
    </section>

    <!-- Ce que ce site n'est pas --------------------------------------------->
    <section class="bloc">
      <div class="wrap-mid">
        <div class="note" data-monte>
          <p>
            <strong>Vous ne trouverez ici la description d’aucun outil, d’aucun produit.</strong>
            C’est délibéré. Annoncer une solution avant d’avoir écouté le terrain reviendrait à
            demander aux gens s’ils aiment mon idée : ils répondraient poliment, et la recherche
            perdrait tout intérêt. Le questionnaire mesure l’état d’un terrain, pas l’accueil
            d’un projet — <NuxtLink to="/a-propos">ce qu’il n’est pas</NuxtLink>.
          </p>
        </div>
        <p data-monte>
          Ce sujet est né d’un vécu personnel. Le danger n’est donc pas de mal poser les
          questions : c’est d’<strong>entendre ce que j’ai envie d’entendre</strong>. Je cherche
          activement les cas qui me contredisent, et je demande à chaque personne rencontrée de
          m’orienter vers quelqu’un qui trouverait ma démarche déplacée. S’il ressort du terrain
          que le papier et la loupe font déjà mieux que tout le reste, ce sera écrit tel quel.
          <NuxtLink to="/projet">Le détail de la méthode</NuxtLink>.
        </p>
      </div>
    </section>

    <!-- Appel final ---------------------------------------------------------->
    <section class="bloc final">
      <div class="wrap-mid centre">
        <h2 data-monte>Deux questionnaires, cinq minutes chacun</h2>
        <p class="lede" data-monte>
          L’un s’adresse à celles et ceux qui encadrent des enfants dehors. L’autre est ouvert
          à tout le monde, avec ou sans enfant — parce que ce que pensent les adultes
          ordinaires du numérique et de la nature n’est mesuré nulle part. Aucun des deux ne
          présente d’objet ni ne demande d’adhésion.
        </p>
        <p class="actions centre" data-monte>
          <NuxtLink class="btn grand" to="/dehors">Tout le monde</NuxtLink>
          <NuxtLink class="btn grand" to="/">Professionnels du dehors</NuxtLink>
          <NuxtLink class="btn ghost grand" to="/entretiens">Proposer un entretien</NuxtLink>
        </p>
        <p class="fine" data-monte>
          Une question, une objection —
          <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* La page déborde volontairement le rembourrage de <main>. */
.land { margin: -2.5rem 0 -3.5rem; }

.wrap-mid { max-width: 46rem; margin: 0 auto; padding: 0 1.25rem; }
.centre { text-align: center; }

/* --- Hero ---------------------------------------------------------------- */

.hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  min-height: min(86svh, 44rem);
  padding: 4rem 0 5rem;
  border-bottom: 1px solid var(--line);
  background:
    radial-gradient(120% 90% at 50% 0%, var(--lichen-wash) 0%, transparent 70%),
    var(--bg);
}
.hero-in {
  position: relative;
  z-index: 1;
  max-width: 46rem;
  margin: 0 auto;
  padding: 0 1.25rem;
  text-align: center;
}

.sur {
  font-family: var(--serif);
  font-size: .78rem;
  letter-spacing: .19em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin-bottom: 1.1rem;
}

.titre {
  display: flex;
  justify-content: center;
  gap: clamp(.1rem, 1.1vw, .55rem);
  margin: 0 0 1.4rem;
  font-size: clamp(3.2rem, 15vw, 8.5rem);
  line-height: 1.12;
  letter-spacing: .04em;
  color: var(--forest-ink);
}
[data-lettre] {
  display: block;
  padding: 0 .02em;
  transform-origin: 50% 82%;
  will-change: transform;
}

.accroche {
  font-family: var(--serif);
  font-size: clamp(1.1rem, 2.4vw, 1.42rem);
  line-height: 1.45;
  margin: 0 auto 1.6rem;
  max-width: 34rem;
}

.epi {
  max-width: 33rem;
  margin: 0 auto 2rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--line-strong);
  font-size: .92rem;
  font-style: italic;
  color: var(--ink-soft);
}

.actions { display: flex; gap: .8rem; flex-wrap: wrap; justify-content: center; margin-bottom: .9rem; }
.btn.grand { font-size: 1rem; padding: .78rem 1.5rem; }

.fine { font-size: .82rem; color: var(--ink-soft); }

.cue {
  position: absolute;
  left: 50%;
  bottom: 1.5rem;
  width: 1px;
  height: 2.6rem;
  overflow: hidden;
  background: var(--line-strong);
}
.cue span {
  position: absolute;
  inset: 0;
  background: var(--forest);
  animation: descend 2.6s ease-in-out infinite;
}
@keyframes descend {
  0% { transform: translateY(-100%); }
  60%, 100% { transform: translateY(100%); }
}

/* --- Blocs --------------------------------------------------------------- */

.bloc { padding: 5rem 0; }
.bloc.sombre { background: var(--paper); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.bloc.final { padding: 5.5rem 0 6.5rem; }

.oeil {
  font-family: var(--serif);
  font-size: .74rem;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--lichen);
  margin-bottom: .5rem;
}
.bloc h2 { font-size: clamp(1.45rem, 3.4vw, 2.05rem); margin: 0 0 .9rem; }
.bloc .lede { margin-bottom: 2rem; }

/* --- Cartes -------------------------------------------------------------- */

.cartes, .refus {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(15.5rem, 1fr));
}
.carte {
  background: var(--bg);
  border: 1px solid var(--line);
  border-left: 2px solid var(--lichen);
  border-radius: var(--radius);
  padding: 1.2rem 1.3rem;
}
.bloc.sombre .carte { background: var(--paper); }
.carte h3 { margin: 0 0 .4rem; font-size: 1.02rem; }
.carte p { margin: 0; font-size: .93rem; color: var(--ink-soft); }
.num {
  display: block;
  font-family: var(--mono);
  font-size: .74rem;
  letter-spacing: .1em;
  color: var(--lichen);
  margin-bottom: .5rem;
}

/* --- Le faux débat ------------------------------------------------------- */

.duel {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--bg);
  margin-bottom: 2.2rem;
  overflow: hidden;
}
.duel > * {
  display: grid;
  grid-template-columns: 9.5rem 1fr 1fr;
  gap: 1rem;
  padding: .85rem 1.15rem;
  align-items: baseline;
}
.duel > * + * { border-top: 1px solid var(--line); }
.duel-tete {
  font-family: var(--serif);
  font-size: .78rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  background: var(--lichen-wash);
  color: var(--forest-ink);
}
.duel .lab { font-size: .82rem; color: var(--ink-soft); }
.duel .a { color: var(--ink-soft); }
.duel .b { color: var(--forest-ink); font-weight: 500; }
.duel-l .b { border-left: 2px solid var(--lichen); padding-left: .8rem; margin-left: -.8rem; }

/* --- Chiffres ------------------------------------------------------------ */

.chiffres {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
}
.chiffre {
  border-top: 2px solid var(--forest);
  padding-top: .9rem;
}
.chiffre b {
  display: block;
  font-family: var(--serif);
  font-size: clamp(2.4rem, 5.5vw, 3.4rem);
  line-height: 1;
  color: var(--forest);
  margin-bottom: .6rem;
  font-variant-numeric: tabular-nums;
}
.chiffre p { font-size: .9rem; margin-bottom: .5rem; }
.chiffre small { color: var(--ink-soft); font-style: italic; }

/* --- Chronologie Freinet ------------------------------------------------- */

.chrono { position: relative; padding-left: 1.9rem; margin-bottom: 2rem; }
.chrono .trait {
  position: absolute;
  left: .32rem;
  top: .55rem;
  bottom: .55rem;
  width: 1px;
  background: var(--lichen);
}
.etape { position: relative; padding-bottom: 1.6rem; }
.etape::before {
  content: '';
  position: absolute;
  left: -1.9rem;
  top: .55rem;
  width: .5rem;
  height: .5rem;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--forest);
  transform: translateX(.075rem);
}
.etape h3 { margin: 0 0 .25rem; font-size: 1rem; }
.etape p { margin: 0; font-size: .93rem; color: var(--ink-soft); }

.bloc .note { margin-bottom: 1.6rem; }

/* --- État de départ des animations ---------------------------------------
   Posé seulement quand le script a pris la main : sans JavaScript, ou si le
   système demande moins d'animation, la page est intégralement visible.      */

.anime [data-hero] { opacity: 0; transform: translateY(22px); }
.anime [data-monte],
.anime [data-serie] > * { opacity: 0; transform: translateY(34px); }
.anime [data-duel] .a { opacity: 0; transform: translateX(-26px); }
.anime [data-duel] .b { opacity: 0; transform: translateX(26px); }
.anime [data-trait] { transform: scaleY(0); transform-origin: top center; }

@media (max-width: 46rem) {
  .duel > * { grid-template-columns: 1fr; gap: .3rem; padding: .9rem 1rem; }
  .duel-tete { display: none; }
  .duel .lab { font-size: .74rem; text-transform: uppercase; letter-spacing: .1em; }
  .duel .a::before { content: 'Appareil — '; color: var(--lichen); }
  .duel .b::before { content: 'Sortie — '; color: var(--lichen); }
  .duel-l .b { border-left: 0; padding-left: 0; margin-left: 0; }
  .bloc { padding: 3.5rem 0; }
}

@media (prefers-reduced-motion: reduce) {
  .cue span { animation: none; }
}
</style>
