<script setup lang="ts">
const annee = new Date().getFullYear()
const { retentionMonths } = useRuntimeConfig().public
</script>

<template>
  <div>
    <header class="top">
      <div class="wrap top-in">
        <NuxtLink to="/lichen" class="brand">Lichen <span>· enquête sur les pédagogies du dehors</span></NuxtLink>
        <nav>
          <NuxtLink to="/">Professionnels</NuxtLink>
          <NuxtLink to="/dehors">Grand public</NuxtLink>
          <NuxtLink to="/lichen">Le projet</NuxtLink>
          <NuxtLink to="/entretiens">Entretiens</NuxtLink>
          <NuxtLink to="/a-propos">À propos</NuxtLink>
          <NuxtLink to="/donnees">Vos données</NuxtLink>
        </nav>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="foot">
      <div class="wrap">
        <nav>
          <NuxtLink to="/">Questionnaire — professionnels</NuxtLink>
          <NuxtLink to="/dehors">Questionnaire — grand public</NuxtLink>
          <NuxtLink to="/lichen">Le projet</NuxtLink>
          <NuxtLink to="/projet">La démarche en détail</NuxtLink>
          <NuxtLink to="/entretiens">Participer à un entretien</NuxtLink>
          <NuxtLink to="/a-propos">À propos</NuxtLink>
          <NuxtLink to="/donnees">Données personnelles</NuxtLink>
          <NuxtLink to="/cgu">Conditions d’utilisation</NuxtLink>
          <NuxtLink to="/mentions-legales">Mentions légales et licence</NuxtLink>
        </nav>
        <p>
          Enquête universitaire · Données hébergées dans l’Union européenne ·
          Conservation limitée à {{ retentionMonths }} mois · Aucun traceur, aucun cookie.
        </p>
        <p>© {{ annee }} Théo P. A. Lesage · Contenu sous licence CC BY 4.0.</p>
      </div>
    </footer>
  </div>
</template>
