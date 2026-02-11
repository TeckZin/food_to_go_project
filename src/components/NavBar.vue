<script setup lang="ts">
import { NAV_ITEMS } from "./nav.ts"
</script>

<template>
  <header class="flex w-full justify-between ">
          <div>
            <img  class="h-25 w-auto px-4 py-4" src="../assets/foodlogo-trans.png" alt="Logo" />
          </div>
          <nav class="flex w-full justify-center items-center">
              <RouterLink
                      v-for="item in NAV_ITEMS"
                      :key="item.to"
                      :to="item.to"
                      class="px-5 py-2 font-pragati text-3xl font-normal"
                      >
                      {{ item.label }}
              </RouterLink>
          </nav>
          <div>

          </div>

  </header>
</template>

