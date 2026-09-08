<script setup lang="ts">
// Interface de dépouillement. Aucun lien ne pointe vers elle depuis le site
// public, et elle n'y renvoie pas non plus.
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow, noarchive' }] })
</script>

<template>
  <div>
    <header class="top">
      <div class="wrap-wide top-in">
        <NuxtLink to="/results" class="brand">Dépouillement <span>· accès restreint</span></NuxtLink>
        <nav>
          <NuxtLink to="/results">Professionnels</NuxtLink>
          <NuxtLink to="/results/public">Grand public</NuxtLink>
          <a href="/api/admin/export">CSV pro</a>
          <a href="/api/admin/public/export">CSV public</a>
        </nav>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
