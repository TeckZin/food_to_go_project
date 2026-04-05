<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import NavBar from "@/components/NavBar.vue"
import AboutComponent from "@/components/AboutComponent.vue"

const router = useRouter()

const buttonClass =
  "inline-flex items-center justify-center rounded-[5rem] border-4 border-cream_yellow px-6 py-3 text-base text-white transition duration-300 hover:bg-cream_yellow hover:text-[#272B34] sm:px-8 sm:py-4 sm:text-lg"

let scrollLock = false
let extraScrollAfterBottom = 0

const EXTRA_SCROLL_THRESHOLD = 180

const isAtBottomOfPage = () => {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
}

const handleWheel = (e: WheelEvent) => {
  if (scrollLock) return

  if (!isAtBottomOfPage()) {
    extraScrollAfterBottom = 0
    return
  }

  if (e.deltaY > 0) {
    extraScrollAfterBottom += e.deltaY
  } else {
    extraScrollAfterBottom = 0
    return
  }

  if (extraScrollAfterBottom >= EXTRA_SCROLL_THRESHOLD) {
    scrollLock = true
    router.push("/store").then(() => {
      window.scrollTo({ top: 0, behavior: "auto" })
    })
  }
}

const handleScroll = () => {
  if (!isAtBottomOfPage()) {
    extraScrollAfterBottom = 0
  }
}

onMounted(() => {
  window.addEventListener("wheel", handleWheel, { passive: true })
  window.addEventListener("scroll", handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener("wheel", handleWheel)
  window.removeEventListener("scroll", handleScroll)
})
</script>

<template>
  <div class="w-full overflow-x-hidden bg-[#272B34]">
    <main class="flex w-full flex-col">
      <NavBar class="w-full" :include-about="true" />

      <div class="flex min-h-screen w-full flex-col overflow-x-hidden lg:flex-row">
        <section
          class="relative z-10 flex w-full flex-col justify-center px-6 py-12 sm:px-10 md:px-14 lg:w-1/2 lg:pl-10 lg:pr-6"
        >
          <div
            class="flex flex-col py-6 font-jacques text-4xl leading-[0.95] text-white sm:text-5xl md:text-6xl lg:py-10 lg:text-7xl xl:text-8xl"
          >
            <p>FRESH,</p>
            <p>MEALS, FAST</p>
            <p>DELIVER TO</p>
            <p>CAMPUS</p>
          </div>

          <div
            class="flex flex-col gap-4 py-5 font-inter text-xl text-white sm:text-2xl md:flex-row md:items-center lg:text-3xl xl:text-4xl"
          >
            <RouterLink to="/store" :class="buttonClass">
              STORE
            </RouterLink>

            <RouterLink to="/contact" :class="buttonClass">
              CONTACT
            </RouterLink>
          </div>
        </section>

        <section
          class="relative flex min-h-[18rem] w-full items-center justify-center overflow-hidden px-4 py-8 lg:min-h-screen lg:w-1/2"
        >
          <div
            class="pointer-events-none select-none font-inter font-extrabold leading-none tracking-tight text-cream_yellow opacity-90 text-[8rem] sm:text-[12rem] md:text-[16rem] lg:absolute lg:left-[2rem] lg:top-1/2 lg:-translate-y-1/2 lg:rotate-[-28deg] lg:text-[20rem] xl:left-[3rem] xl:text-[28rem]"
          >
            FTG
          </div>
        </section>
      </div>

      <AboutComponent />
    </main>
  </div>
</template>
