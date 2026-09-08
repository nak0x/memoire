<script setup lang="ts">
// Page de recrutement d'entretiens. Elle suit le protocole
// (terrain/protocole-entretien.md) mais respecte sa règle première :
// ne pas décrire l'objet. Le déroulé est présenté dans son ordre — pratique,
// outils, place du numérique, et l'objet seulement en toute fin — sans jamais
// dire ce sur quoi je travaille.
useHead({ title: 'Participer à un entretien — recherche sur les pédagogies du dehors' })
const { contactEmail } = useRuntimeConfig().public
</script>

<template>
  <div class="wrap">
    <h1>Participer à un entretien</h1>
    <p class="lede">
      Le cœur de cette recherche, ce ne sont pas les réponses au questionnaire : ce sont
      quelques entretiens menés en profondeur, avec des personnes qui emmènent vraiment des
      enfants dehors. Si c’est votre cas, votre heure vaut de l’or.
    </p>

    <h2>Ce que c’est</h2>
    <ul>
      <li>
        Un entretien <strong>semi-directif d’environ une heure</strong>. Ni interrogatoire, ni
        conversation qui part dans tous les sens : on suit un fil, mais c’est vous qui parlez.
      </li>
      <li>En personne de préférence, à distance si besoin. Je peux me déplacer.</li>
      <li>
        <strong>Enregistré uniquement avec votre accord explicite</strong>, pour ne pas avoir à
        tout noter. L’enregistrement sert à ma seule analyse et à la soutenance ; il n’est ni
        diffusé ni publié. Vous pouvez refuser l’enregistrement, demander une pause ou l’arrêt à
        tout moment.
      </li>
      <li>
        <strong>Anonyme dans le mémoire :</strong> vos propos peuvent être cités, jamais votre
        nom ni celui de votre structure — voir <NuxtLink to="/donnees">Vos données</NuxtLink>.
      </li>
    </ul>

    <h2>Comment ça se passe</h2>
    <p>L’entretien avance dans un ordre précis, et j’y tiens :</p>
    <ul>
      <li>On parle d’abord de <strong>votre pratique</strong> — une sortie type, ce que font les enfants, ce qui rate quand une sortie rate. Rien d’abstrait.</li>
      <li>Puis de votre <strong>rapport aux outils</strong>, quels qu’ils soient, papier compris.</li>
      <li>Puis, seulement, de la <strong>place du numérique</strong> dans tout cela, et de ce que vous en pensez.</li>
      <li>En toute fin d’entretien, je vous montre <strong>ce sur quoi je travaille</strong>, et je recueille vos objections — surtout les plus dures.</li>
    </ul>
    <p>
      Si je garde ce dernier point pour la fin, c’est exprès : décrire d’emblée ce que je
      fabrique orienterait tout le reste, et je perdrais précisément ce que je viens chercher.
    </p>

    <div class="note">
      <p>
        <strong>Ce que je ne viens pas faire.</strong> Je ne viens rien vendre et ne défendrai
        aucune idée pendant l’entretien. Si vous trouvez ma démarche absurde ou déplacée,
        dites-le : je vous demanderai pourquoi, je ne chercherai pas à vous convaincre. Mon
        hypothèse de départ est peut-être fausse, et c’est exactement ce que je cherche à
        savoir.
      </p>
    </div>

    <h2>Vous êtes éducateur, animateur, professionnel du dehors</h2>
    <p>
      Animateur nature, éducateur à l’environnement, encadrant en forêt-école, membre d’un
      réseau (GRAINE, FRENE, et d’autres) : vous êtes au cœur de cette recherche. Ce qui
      m’intéresse, c’est votre pratique concrète, pas votre avis sur la technologie en
      général — et tout particulièrement la façon dont vous répondez, ou choisissez de ne pas
      répondre, quand un enfant vous demande « c’est quoi, ça ? ».
    </p>

    <h2>Vous êtes une école, un enseignant en classe dehors</h2>
    <p>
      Les écoles qui pratiquent la classe dehors m’importent particulièrement : elles touchent
      un public d’enfants qui ne se sont pas choisis, contrairement aux familles déjà
      convaincues. Un entretien avec un enseignant, ou l’autorisation d’observer une sortie,
      change la valeur de tout ce travail. Une contrainte, dont j’ai conscience : vos semaines
      sont bloquées et les vacances scolaires vous ferment. Dites-moi vos créneaux, je m’aligne.
    </p>

    <h2>Se porter volontaire</h2>
    <p>Un message suffit. Pour gagner du temps, voici mes disponibilités :</p>
    <ul>
      <li>Journées complètes possibles sur certaines semaines.</li>
      <li>Vendredis après-midi, à caler selon les emplois du temps.</li>
      <li>Pendant les vacances scolaires, pour les structures qui restent ouvertes — centres de loisirs notamment.</li>
    </ul>
    <p>
      Écrivez-moi : Théo P. A. Lesage — <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
      Précisez votre structure, votre rôle, et deux ou trois créneaux qui vous arrangent.
    </p>

    <h2>Le service que je demande vraiment</h2>
    <p>
      Si vous ne voyez qu’une seule chose à faire pour m’aider : mettez-moi en contact avec
      quelqu’un de votre réseau qui trouverait cette démarche déplacée. Ces voix-là sont les
      plus difficiles à atteindre et les plus utiles à mon travail. Sans elles, je ne fais que
      m’écouter penser.
    </p>

    <p class="actions">
      <a class="btn" :href="`mailto:${contactEmail}?subject=Entretien%20%E2%80%94%20p%C3%A9dagogies%20du%20dehors`">Proposer un entretien</a>
      <NuxtLink class="btn ghost" to="/projet">Lire la description du projet</NuxtLink>
    </p>
  </div>
</template>
