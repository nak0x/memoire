<script setup lang="ts">
// Cette page ne décrit volontairement aucun objet ni aucun prototype :
// annoncer une solution avant l'enquête reviendrait à demander aux gens
// s'ils aiment l'idée, et ils répondraient poliment.
useHead({ title: 'À propos de cette enquête' })
const { contactEmail, retentionMonths } = useRuntimeConfig().public
</script>

<template>
  <div class="wrap">
    <h1>À propos</h1>
    <p class="lede">
      Ce questionnaire fait partie d’un travail de recherche de fin d’études sur la place des
      outils numériques dans les éducations alternatives.
    </p>

    <h2>Ce que je cherche</h2>
    <p>
      Le sujet est souvent traité comme une opposition — « écran contre nature » — qui ne
      décrit pas grand-chose de ce que vivent les gens qui emmènent réellement des enfants
      dehors. Ce que je cherche à comprendre est plus précis : ce qui se passe au moment où un
      enfant trouve quelque chose qu’il ne connaît pas, ce que les adultes font de ce moment,
      et sur quoi porte exactement leur réticence quand ils en ont une — le geste, l’écran,
      l’institution, la logistique, ou le modèle économique des applications.
    </p>
    <p>
      Ces quatre hypothèses ne se distinguent pas dans les statistiques d’usage. Elles ne se
      distinguent que dans ce que les gens disent, avec leurs mots. D’où ce questionnaire, et
      surtout les entretiens qu’il sert à préparer.
    </p>

    <h2>Ce que ce questionnaire n’est pas</h2>
    <ul>
      <li><strong>Ce n’est pas une étude de marché.</strong> Aucun produit n’est présenté, aucune intention d’achat n’est mesurée.</li>
      <li><strong>Ce n’est pas une preuve.</strong> Une trentaine de réponses volontaires ne démontrent rien ; elles orientent des entretiens, qui eux produisent la matière.</li>
      <li><strong>Ce n’est pas neutre.</strong> Les personnes qui répondent à un questionnaire sur le numérique et la nature sont celles que le sujet intéresse déjà. Ce biais est assumé et sera écrit dans le mémoire.</li>
    </ul>

    <h2>Ce que deviennent vos réponses</h2>
    <p>
      Elles sont dépouillées par une seule personne, agrégées, et citées le cas échéant sous
      forme anonyme dans un mémoire universitaire. Les réponses libres peuvent être citées
      telles quelles ; elles ne sont jamais accompagnées d’un élément permettant d’identifier
      leur auteur. Tout est supprimé au bout de {{ retentionMonths }} mois — voir
      <NuxtLink to="/donnees">Vos données</NuxtLink>.
    </p>

    <h2>Ce qui aide vraiment</h2>
    <p>
      Transmettre le questionnaire, et accepter un entretien d’une heure. Et, plus que tout :
      me mettre en contact avec quelqu’un qui trouve cette démarche déplacée. Une objection
      argumentée vaut plus qu’une approbation, et un travail qui ne cherche que des accords ne
      vaut rien.
    </p>

    <h2>Me joindre</h2>
    <p>
      Théo P. A. Lesage — <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
      Pour une question sur l’enquête, une objection, un signalement d’erreur, ou une demande
      concernant vos données.
    </p>

    <p><NuxtLink class="btn" to="/">Répondre au questionnaire</NuxtLink></p>
  </div>
</template>
