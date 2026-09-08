<script setup lang="ts">
useHead({ title: 'Vos données — enquête sur les pratiques d’éducation dehors' })
const { contactEmail, hostName, hostLocation, retentionMonths } = useRuntimeConfig().public
</script>

<template>
  <div class="wrap">
    <h1>Vos données</h1>
    <p class="lede">
      Le sujet de cette recherche porte en partie sur le traitement des données par les
      applications. Il serait malvenu de faire ici ce que j’interroge ailleurs.
    </p>

    <div class="note">
      <p>
        <strong>En une phrase :</strong> les deux questionnaires de ce site — celui destiné
        aux professionnels et celui ouvert à tous — ne demandent aucune information
        personnelle, tout est hébergé dans l’Union européenne, rien n’est utilisé en dehors de
        cette recherche, rien n’est transmis à qui que ce soit, et tout est effacé
        automatiquement au bout de {{ retentionMonths }} mois.
      </p>
    </div>

    <h2>Ce qui est collecté</h2>
    <ul>
      <li>Vos réponses aux questions, telles que vous les avez écrites.</li>
      <li>La date et l’heure de l’envoi.</li>
      <li>
        Le moyen de vous joindre, <strong>uniquement si vous l’avez saisi</strong> dans le
        dernier champ. C’est le seul élément du questionnaire susceptible de vous identifier,
        et il est facultatif.
      </li>
    </ul>

    <h2>Ce qui n’est pas collecté</h2>
    <ul>
      <li>Aucun compte, aucune inscription, aucune connexion.</li>
      <li>Aucun cookie, aucun traceur, aucun outil de mesure d’audience.</li>
      <li>Aucune adresse IP enregistrée. Une empreinte technique temporaire est gardée en mémoire vive quelques heures pour limiter les envois automatisés, puis disparaît ; elle n’est jamais écrite sur disque.</li>
      <li>Aucun service tiers appelé par la page : ni police distante, ni carte, ni vidéo, ni bouton de réseau social.</li>
    </ul>

    <h2>Base légale et finalité</h2>
    <p>
      Le traitement repose sur votre <strong>consentement</strong>, donné par l’envoi du
      formulaire. La finalité est unique : la réalisation d’un mémoire de recherche
      universitaire sur les pratiques d’éducation en extérieur. Les données ne sont ni vendues,
      ni cédées, ni utilisées pour vous adresser quoi que ce soit d’autre qu’une proposition
      d’entretien si vous l’avez acceptée.
    </p>

    <h2>Hébergement</h2>
    <p>
      L’application et sa base de données sont hébergées chez <strong>{{ hostName }}</strong>,
      {{ hostLocation }}. Les données ne quittent pas l’Union européenne et ne sont transférées
      vers aucun pays tiers.
    </p>

    <h2>Durée de conservation</h2>
    <p>
      <strong>{{ retentionMonths }} mois à compter de l’envoi</strong>, sans exception et sans
      prolongation. La suppression n’est pas une intention : une tâche automatique s’exécute
      chaque jour, ainsi qu’à chaque démarrage du serveur, et efface définitivement toute
      réponse dont la date dépasse ce délai — champ de contact compris. Seules subsistent des
      statistiques agrégées, qui ne contiennent aucune réponse individuelle.
    </p>

    <h2>Vos droits</h2>
    <p>
      Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation et
      d’opposition. Écrivez à
      <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a> : une demande d’effacement est
      honorée immédiatement, sans justification à fournir.
    </p>
    <p class="meta">
      Une difficulté : puisque le questionnaire est anonyme, je n’ai aucun moyen de retrouver
      votre réponse si vous n’avez pas laissé de contact. Indiquez alors la date approximative
      de votre envoi et quelques mots de vos réponses libres, ou considérez que la suppression
      automatique s’en chargera au terme des {{ retentionMonths }} mois.
    </p>
    <p>
      Vous pouvez également introduire une réclamation auprès de la
      <a href="https://www.cnil.fr" rel="noopener">CNIL</a>.
    </p>

    <h2>Responsable du traitement</h2>
    <p>
      Théo P. A. Lesage, étudiant, à titre personnel dans le cadre d’un travail universitaire —
      <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
      Voir <NuxtLink to="/mentions-legales">les mentions légales</NuxtLink>.
    </p>
  </div>
</template>
