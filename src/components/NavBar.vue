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
const navItems = ref<HTMLElement[]>([])

let ctx: gsap.Context | null = null

const setNavItemRef = (el: Element | null) => {
  if (el) {
    navItems.value.push(el as HTMLElement)
  }
}

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

onMounted(async () => {
  await nextTick()
  navItems.value = navItems.value.filter(Boolean)

  ctx = gsap.context(() => {
    if (leftRef.value) {
      gsap.fromTo(
        leftRef.value,
        { x: -40, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" }
      )
    }

    if (navItems.value.length) {
      gsap.fromTo(
        navItems.value,
        { x: -30, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out", stagger: 0.1, delay: 0.2 }
      )
    }

    if (rightRef.value) {
      gsap.fromTo(
        rightRef.value,
        { x: 40, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out", delay: 0.3 }
      )
    }
  }, headerRef.value as HTMLElement)
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template>
  <header ref="headerRef" class="relative flex w-full items-center px-6 py-5">
    <div ref="leftRef">
      <RouterLink to="/" class="flex items-center gap-3">
        <img
          class="h-[6rem] w-auto"
          src="../assets/foodlogo-trans.png"
          alt="Logo"
        />
      </RouterLink>
    </div>

    <nav
      class="absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-8 font-inter text-lg font-semibold tracking-[0.18em] text-white"
    >
      <RouterLink to="/" :ref="setNavItemRef" class="hover:text-cream_yellow transition">
        HOME
      </RouterLink>

      <RouterLink to="/store" :ref="setNavItemRef" class="hover:text-cream_yellow transition">
        STORE
      </RouterLink>

      <RouterLink to="/contact" :ref="setNavItemRef" class="hover:text-cream_yellow transition">
        CONTACT
      </RouterLink>

      <button
        v-if="props.includeAbout"
        :ref="setNavItemRef"
        class="hover:text-cream_yellow transition"
        @click="scrollToAbout"
      >
        ABOUT
      </button>
    </nav>

    <div ref="rightRef" class="ml-auto flex items-center">
      <Account :isAccount="authReady && !!currentUser" />
    </div>
  </header>
</template>
