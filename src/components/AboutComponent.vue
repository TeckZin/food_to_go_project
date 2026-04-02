<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const lineRef = ref<HTMLElement | null>(null)

let tween: gsap.core.Tween | null = null

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
</template>
