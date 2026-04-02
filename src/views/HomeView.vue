<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import NavBar from "@/components/NavBar.vue"
import AboutComponent from "@/components/AboutComponent.vue"

const router = useRouter()
const heroRef = ref<HTMLElement | null>(null)

const buttonClass =
  "mr-5 inline-flex rounded-[5rem] border-4 border-cream_yellow px-8 py-4 text-white transition duration-300 hover:bg-cream_yellow hover:text-[#272B34]"

let scrollLock = false
let downScrollTotal = 0
let navigateTimeout: ReturnType<typeof setTimeout> | null = null

const SCROLL_THRESHOLD = 220
const NAV_BUFFER_MS = 350

const resetNavigationBuffer = () => {
  if (navigateTimeout) {
    clearTimeout(navigateTimeout)
    navigateTimeout = null
  }
}

const handleWheel = (e: WheelEvent) => {
  if (!heroRef.value || scrollLock) return

  const rect = heroRef.value.getBoundingClientRect()
  const heroMostlyVisible = rect.top <= 0 && rect.bottom > window.innerHeight * 0.4

  if (!heroMostlyVisible) {
    downScrollTotal = 0
    resetNavigationBuffer()
    return
  }

  if (e.deltaY > 0) {
    downScrollTotal += e.deltaY
  } else {
    downScrollTotal = 0
    resetNavigationBuffer()
    return
  }

  if (downScrollTotal > SCROLL_THRESHOLD && !navigateTimeout) {
    navigateTimeout = setTimeout(() => {
      scrollLock = true
      router.push("/store").then(() => {
        window.scrollTo({ top: 0, behavior: "auto" })
      })
    }, NAV_BUFFER_MS)
  }
}

onMounted(() => {
  window.addEventListener("wheel", handleWheel, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener("wheel", handleWheel)
  resetNavigationBuffer()
})
</script>

<template>
  <div class="w-full overflow-x-hidden bg-[#272B34]">
    <main class="flex w-full flex-col">
      <NavBar class="w-full" :include-about="true" />

      <div
        ref="heroRef"
        class="flex min-h-screen w-full flex-row overflow-x-hidden"
      >
        <section class="relative z-10 flex w-1/2 flex-col justify-center pl-10">
          <div class="flex flex-col py-10 font-jacques text-8xl leading-[0.95] text-white">
            <p>FRESH,</p>
            <p>MEALS, FAST</p>
            <p>DELIVER TO</p>
            <p>CAMPUS</p>
          </div>

          <div class="flex flex-row items-center py-5 font-inter text-4xl text-white">
            <RouterLink to="/store" :class="buttonClass">
              STORE
            </RouterLink>

            <RouterLink to="/contact" :class="buttonClass">
              CONTACT
            </RouterLink>
          </div>
        </section>

        <section class="relative w-1/2 overflow-hidden">
          <div
            class="pointer-events-none absolute left-[3rem] top-1/4 translate-y-1/8 rotate-[-28deg] font-inter text-[35rem] font-extrabold leading-none tracking-tight text-cream_yellow"
          >
            FTG
          </div>
        </section>
      </div>

      <AboutComponent />
    </main>
  </div>
</template>
