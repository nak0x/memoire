<script setup lang="ts">
useHead({ title: 'Conditions d’utilisation' })
const { contactEmail, retentionMonths } = useRuntimeConfig().public
const maj = '7 septembre 2026'
</script>

<template>
  <div class="wrap">
    <h1>Conditions d’utilisation</h1>
    <p class="meta">Dernière mise à jour : {{ maj }}.</p>

    <h2>1. Objet</h2>
    <p>
      Le présent site met à disposition un questionnaire de recherche relatif aux pratiques
      d’éducation et d’animation en extérieur. Il est édité à titre personnel par Théo P. A.
      Lesage dans le cadre d’un travail universitaire, sans finalité commerciale. L’accès et
      l’usage du site valent acceptation des présentes conditions.
    </p>

    <h2>2. Accès</h2>
    <p>
      L’accès est libre, gratuit, et ne requiert ni compte ni inscription. L’éditeur s’efforce
      de maintenir le service accessible mais ne garantit aucune disponibilité : il peut être
      interrompu, restreint ou fermé à tout moment, notamment à l’issue de la période
      d’enquête, sans préavis ni indemnité.
    </p>

    <h2>3. Participation</h2>
    <p>La participation est volontaire, anonyme et sans contrepartie. En envoyant le formulaire, vous déclarez :</p>
    <ul>
      <li>être majeur ;</li>
      <li>répondre en votre nom propre, sincèrement, et dans les limites de ce que votre cadre professionnel vous autorise à divulguer ;</li>
      <li>consentir à ce que vos réponses soient exploitées dans les conditions décrites à la page <NuxtLink to="/donnees">Vos données</NuxtLink>.</li>
    </ul>
    <p>
      Le questionnaire ne s’adresse pas aux enfants et ne doit être rempli ni par eux, ni à leur
      sujet de manière identifiante. Merci de ne mentionner aucun nom d’enfant, d’établissement
      ou de tiers dans les réponses libres. Toute donnée de ce type constatée est supprimée.
    </p>

    <h2>4. Exploitation des réponses</h2>
    <p>
      Vos réponses sont agrégées et analysées à des fins de recherche. Des extraits de réponses
      libres peuvent être cités dans le mémoire et ses annexes, <strong>sous forme anonyme</strong>,
      sans élément permettant d’identifier leur auteur. En participant, vous concédez à
      l’éditeur le droit non exclusif et gratuit de citer et d’analyser vos réponses à cette
      seule fin. Vous conservez tout droit sur vos propos et pouvez en demander le retrait à
      tout moment tant que les données existent, c’est-à-dire pendant {{ retentionMonths }} mois.
    </p>

    <h2>5. Comportements interdits</h2>
    <p>
      Sont notamment interdits : l’envoi automatisé ou massif de réponses, toute tentative
      d’accès aux parties non publiques du service, toute atteinte à son intégrité ou à sa
      disponibilité, ainsi que la transmission de contenus illicites, diffamatoires ou portant
      atteinte à la vie privée d’un tiers. Une limitation du nombre d’envois par réseau est en
      place ; elle ne conserve aucune donnée.
    </p>

    <h2>6. Responsabilité</h2>
    <p>
      Le site est fourni « en l’état ». L’éditeur ne saurait être tenu responsable d’un
      dommage indirect résultant de son utilisation, d’une indisponibilité, ou de la perte de
      réponses en cours de saisie. Les liens externes éventuels n’engagent que leurs auteurs.
    </p>

    <h2>7. Propriété intellectuelle</h2>
    <p>
      Les textes, la mise en forme et le code du site sont protégés et diffusés selon les
      conditions décrites dans les <NuxtLink to="/mentions-legales">mentions légales</NuxtLink>.
    </p>

    <h2>8. Modification et droit applicable</h2>
    <p>
      Les présentes conditions peuvent être modifiées ; la version applicable est celle publiée
      à la date de votre participation. Elles sont soumises au droit français. Toute question :
      <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
    </p>
  </div>
</template>
