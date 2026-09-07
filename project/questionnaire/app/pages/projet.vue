<script setup lang="ts">
// Comme /a-propos, cette page ne décrit volontairement aucun objet ni aucun
// prototype. Présenter une solution avant d'avoir écouté le terrain reviendrait
// à demander aux gens s'ils aiment l'idée — ils répondraient poliment, et
// l'enquête ne vaudrait plus rien (voir le README et le protocole d'entretien).
useHead({ title: 'Le projet de recherche — pédagogies du dehors et outils numériques' })
const { contactEmail } = useRuntimeConfig().public
</script>

<template>
  <div class="wrap">
    <h1>Le projet de recherche</h1>
    <p class="lede">
      Ce site héberge un questionnaire. Voici le travail auquel il appartient : la question
      qu’il pose, la manière dont j’essaie d’y répondre, et ce dont je me méfie.
    </p>

    <div class="note">
      <p>
        Vous ne trouverez ici la description d’aucun outil ni d’aucun produit, et c’est
        délibéré. Annoncer une solution avant d’avoir écouté le terrain reviendrait à demander
        aux gens s’ils aiment mon idée : ils répondraient poliment, et la recherche perdrait
        tout intérêt.
      </p>
    </div>

    <h2>La question</h2>
    <p>
      Le point de départ est large : quelle place, s’il y en a une, pour les outils numériques
      dans les <strong>pédagogies du dehors</strong> — ces pratiques où des enfants apprennent
      dehors régulièrement, le milieu servant de support et non de décor ? Posée ainsi, la
      question est trop vaste pour être travaillée. Je la resserre sur un moment précis : ce qui
      se passe quand un enfant, en sortie, trouve quelque chose qu’il ne connaît pas, et ce que
      l’adulte fait — ou choisit de ne pas faire — de ce moment.
    </p>

    <h2>Le faux débat, et le vrai</h2>
    <p>
      On oppose d’ordinaire « écrans » et « pas d’écrans ». Sur le terrain, ce partage
      n’explique presque rien. L’hypothèse que je veux mettre à l’épreuve est différente : ce
      que les pédagogies du dehors rejetteraient ne serait pas la technologie en soi, mais un
      certain modèle — celui d’objets conçus pour capter l’attention et la revendre, là où une
      sortie cherche au contraire à rendre du temps et de l’attention disponibles.
    </p>
    <p>
      C’est une hypothèse, pas un résultat. Je n’ai à ce jour aucune source solide pour
      l’affirmer, et tout le terrain est là pour la confirmer ou la briser.
    </p>

    <h2>Quatre hypothèses, aucune tranchée</h2>
    <p>
      Quand un éducateur refuse le numérique dehors, sur quoi porte exactement son refus ?
      Quatre réponses sont possibles. Elles ne se distinguent pas dans les statistiques
      d’usage, mais seulement dans ce que les gens disent, avec leurs mots :
    </p>
    <ul>
      <li><strong>Le geste et les sens</strong> — un écran couperait du réel quel que soit son contenu.</li>
      <li><strong>La logistique</strong> — batteries, casse, vol, gestion d’un parc d’appareils.</li>
      <li><strong>L’institution</strong> — ce que le numérique charrie de l’école : l’évaluation, la trace, le contrôle.</li>
      <li><strong>Le modèle économique</strong> — ce que ces objets cherchent à obtenir de ceux qui les utilisent.</li>
    </ul>
    <p>
      Ces pistes ne s’excluent pas, et l’une d’elles suffirait à condamner l’idée même d’un
      outil numérique dehors. Savoir laquelle domine est l’enjeu central de ce travail.
    </p>

    <h2>Comment je m’y prends</h2>
    <ul>
      <li>
        <strong>Ce questionnaire</strong>, pour prendre le pouls d’un terrain et préparer les
        entretiens. Il ne présente aucun objet et ne mesure l’adhésion à aucune idée —
        <NuxtLink to="/a-propos">ce qu’il n’est pas</NuxtLink>.
      </li>
      <li>
        <strong>Des entretiens qualitatifs</strong>, une heure chacun, avec des professionnels
        du dehors et des écoles. C’est là que se joue l’essentiel —
        <NuxtLink to="/entretiens">comment y participer</NuxtLink>.
      </li>
      <li><strong>De l’observation</strong> de sorties réelles, pour vérifier ce que les mots ne disent pas.</li>
      <li><strong>Un examen des outils existants</strong> — carnets, loupes, herbiers, applications — pour savoir ce qui manque, ou ne manque pas.</li>
    </ul>

    <h2>Le biais que je surveille</h2>
    <p>
      Ce sujet est né d’un vécu personnel. Le danger n’est donc pas de mal poser les questions :
      c’est d’<strong>entendre ce que j’ai envie d’entendre</strong>. Toute ma méthode est
      construite contre ça. À chaque entretien, je cherche activement ce qui contredit ce que je
      croyais le matin même, et je demande à chaque personne rencontrée de m’orienter vers
      quelqu’un qui trouverait ma démarche déplacée. Un désaccord argumenté m’est plus utile
      qu’un accord, et un travail qui ne récolte que des approbations ne vaut rien. S’il ressort
      du terrain que le papier et la loupe font déjà mieux que tout le reste, ce sera écrit tel
      quel.
    </p>

    <h2>Me joindre</h2>
    <p>
      Théo P. A. Lesage — <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
      Pour une question, une objection, ou pour proposer un entretien.
    </p>

    <p class="actions">
      <NuxtLink class="btn" to="/">Répondre au questionnaire</NuxtLink>
      <NuxtLink class="btn ghost" to="/entretiens">Participer à un entretien</NuxtLink>
    </p>
  </div>
</template>
