<script setup lang="ts">
import { ref } from "vue"
import { RouterLink } from "vue-router"
import Account from "./AccountComponent.vue"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"

const props = defineProps<{
  includeAbout?: boolean
}>()

const currentUser = ref<User | null>(null)
const authReady = ref(false)

onAuthStateChanged(auth, (u) => {
  currentUser.value = u
  authReady.value = true
})

const scrollToAbout = () => {
  const aboutSection = document.getElementById("about")
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: "smooth" })
  }
}
</script>

<template>
  <header class="flex w-full items-center justify-between px-4 py-4">
    <div>
        <RouterLink to="/" :class="buttonClass">
          <img
            class="h-20 w-auto"
            src="../assets/foodlogo-trans.png"
            alt="Logo"
          />
        </RouterLink>
    </div>

    <nav class="flex items-center justify-center gap-6">
      <RouterLink to="/" class="font-pragati text-xl font-normal text-white">
        HOME
      </RouterLink>

      <RouterLink to="/store" class="font-pragati text-xl font-normal text-white">
        STORE
      </RouterLink>

      <RouterLink to="/contact" class="font-pragati text-xl font-normal text-white">
        CONTACT
      </RouterLink>

      <button
        v-if="props.includeAbout"
        class="font-pragati text-xl font-normal text-white"
        @click="scrollToAbout"
      >
        ABOUT
      </button>
    </nav>

    <div class="flex items-center justify-center">
      <Account :isAccount="authReady && !!currentUser" />
    </div>
  </header>
</template>
