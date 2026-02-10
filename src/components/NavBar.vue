<script setup lang="ts">
import { NAV_ITEMS } from "./nav.ts"
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">MyApp</RouterLink>
      <span> | </span>

      <RouterLink
        v-for="item in NAV_ITEMS"
        :key="item.to"
        :to="item.to"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>

