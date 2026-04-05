<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue"
import { RouterLink } from "vue-router"
import Account from "./AccountComponent.vue"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { gsap } from "gsap"

const props = defineProps<{
  includeAbout?: boolean
}>()

const currentUser = ref<User | null>(null)
const authReady = ref(false)

const headerRef = ref<HTMLElement | null>(null)
const leftRef = ref<HTMLElement | null>(null)
const rightRef = ref<HTMLElement | null>(null)

let ctx: gsap.Context | null = null
let unsubscribeAuth: (() => void) | null = null

const scrollToAbout = () => {
  const aboutSection = document.getElementById("about")
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: "smooth" })
  }
}

onMounted(async () => {
  unsubscribeAuth = onAuthStateChanged(auth, (u) => {
    currentUser.value = u
    authReady.value = true
  })

  await nextTick()

  ctx = gsap.context(() => {
    if (leftRef.value) {
      gsap.fromTo(
        leftRef.value,
        { x: -40, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
      )
    }

    if (rightRef.value) {
      gsap.fromTo(
        rightRef.value,
        { x: 40, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out", delay: 0.3 },
      )
    }
  }, headerRef.value as HTMLElement)
})

onBeforeUnmount(() => {
  unsubscribeAuth?.()
  ctx?.revert()
})
</script>

<template>
  <header
    ref="headerRef"
    class="relative flex w-full flex-col gap-4 px-4 py-4 sm:px-6 md:gap-5 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-5"
  >
    <div ref="leftRef" class="flex justify-center lg:justify-start">
      <RouterLink to="/" class="flex items-center gap-3">
        <img
          class="h-[4.5rem] w-auto sm:h-[5rem] md:h-[5.5rem] lg:h-[6rem]"
          src="../assets/foodlogo-trans.png"
          alt="Logo"
        />
      </RouterLink>
    </div>

    <nav
      class="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 font-inter text-sm font-semibold tracking-[0.12em] text-white sm:gap-x-6 sm:text-base md:text-lg lg:absolute lg:left-1/2 lg:top-1/2 lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2 lg:flex-nowrap lg:gap-8 lg:tracking-[0.18em]"
    >
      <RouterLink to="/" class="transition hover:text-cream_yellow">
        HOME
      </RouterLink>

      <RouterLink to="/store" class="transition hover:text-cream_yellow">
        STORE
      </RouterLink>

      <RouterLink to="/contact" class="transition hover:text-cream_yellow">
        CONTACT
      </RouterLink>

      <button
        v-if="props.includeAbout"
        type="button"
        class="transition hover:text-cream_yellow"
        @click="scrollToAbout"
      >
        ABOUT
      </button>
    </nav>

    <div
      ref="rightRef"
      class="flex justify-center lg:ml-auto lg:justify-end"
    >
      <Account :isAccount="authReady && !!currentUser" />
    </div>
  </header>
</template>
