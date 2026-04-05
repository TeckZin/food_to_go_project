<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Github, Linkedin } from "lucide-vue-next"

gsap.registerPlugin(ScrollTrigger)

const lineRef = ref<HTMLElement | null>(null)

let tween: gsap.core.Tween | null = null

const engineers = [
  {
    name: "Teck Zin Tan",
    github: "https://github.com/TeckZin",
    linkedin: "https://www.linkedin.com/in/teckzintan/",
  },
  {
    name: "Engineer Two",
    github: "https://github.com/engineer-two",
    linkedin: "https://linkedin.com/in/engineer-two",
  },
  {
    name: "Engineer Three",
    github: "https://github.com/engineer-three",
    linkedin: "https://linkedin.com/in/engineer-three",
  },
]

onMounted(() => {
  if (!lineRef.value) return

  tween = gsap.fromTo(
    lineRef.value,
    {
      scaleX: 0,
      opacity: 0.5,
      transformOrigin: "center center",
    },
    {
      scaleX: 1,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: lineRef.value,
        start: "top 85%",
        end: "bottom-=80px 15%",
        toggleActions: "play reverse play reverse",
      },
    }
  )
})

onBeforeUnmount(() => {
  tween?.scrollTrigger?.kill()
  tween?.kill()
})
</script>

<template>
  <div class="mx-auto my-6 w-full">
    <div
      ref="lineRef"
      class="h-[0.2rem] w-full rounded-full bg-cream_yellow"
    ></div>
  </div>

  <section id="about" class="w-full px-10 py-20">
    <div class="mx-auto max-w-6xl">
      <h2 class="mb-6 font-jacques text-6xl text-white">About</h2>
      <p class="font-inter text-2xl leading-relaxed text-white">
        this is about us
      </p>
    </div>
  </section>

  <footer class="border-t border-white/10 px-10 py-8">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-6 text-white md:flex-row md:items-center md:justify-between"
    >
      <div class="flex items-center gap-4 font-inter text-lg text-white/80">
        <span>© 2026 Food To Go</span>

        <a
          href="https://github.com/TeckZin/food_to_go_project"
          target="_blank"
          rel="noopener noreferrer"
          class="transition hover:text-cream_yellow"
        >
          <Github class="h-6 w-6" />
        </a>

             </div>

      <div class="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-6">
        <div
          v-for="engineer in engineers"
          :key="engineer.name"
          class="flex items-center gap-3 font-inter text-lg text-white/80"
        >
          <span>{{ engineer.name }}</span>

          <a
            :href="engineer.github"
            target="_blank"
            rel="noopener noreferrer"
            class="transition hover:text-cream_yellow"
          >
            <Github class="h-5 w-5" />
          </a>

          <a
            :href="engineer.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="transition hover:text-cream_yellow"
          >
            <Linkedin class="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
