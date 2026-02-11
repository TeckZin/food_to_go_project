<script setup lang="ts">
import { ref } from "vue"
import { NAV_ITEMS } from "./nav.ts"
import Account from "./AccountComponent.vue"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"

const currentUser = ref<User | null>(null)
const authReady = ref(false)

onAuthStateChanged(auth, (u) => {
  currentUser.value = u
  authReady.value = true
})

</script>

<template>
  <header class="flex w-full justify-between ">
          <div>
            <img  class="h-25 w-auto px-4 py-4" src="../assets/foodlogo-trans.png" alt="Logo" />
          </div>
          <nav class="flex  justify-center items-center">
              <RouterLink
                      v-for="item in NAV_ITEMS"
                      :key="item.to"
                      :to="item.to"
                      class="px-5 py-2 font-pragati text-xl font-normal"
                      >
                      {{ item.label }}
              </RouterLink>
          </nav>
          <div class="flex justify-center items-center">
                <Account :isAccount="authReady && !!currentUser" />




          </div>

  </header>
</template>

