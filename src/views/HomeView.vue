<script setup lang="ts">
import { ref } from "vue"
import { RouterLink } from "vue-router"

const count = ref(0)
</script>

<template>
  <main class="min-h-screen grid place-items-center px-8 bg-slate-950 text-white">
    <section class="w-full max-w-2xl text-center">
      <!-- Title like HelloWorld -->
      <h1
        class="text-5xl font-semibold tracking-tight bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-300 bg-clip-text text-transparent"
      >
        Food To Go (FTG)
      </h1>

      <p class="mt-3 text-white/70">
        Quick starter page for routing, styling, and basic interactivity.
      </p>

      <!-- Card like the Vite starter -->
      <div
        class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur"
      >
        <button
          type="button"
          @click="count++"
          class="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-white/90 hover:bg-white/15 hover:border-white/15 transition"
        >
          count is {{ count }}
        </button>

        <p class="mt-4 text-white/70">
          Edit <code class="rounded bg-white/10 px-2 py-1">views/HomeView.vue</code> to
          test HMR
        </p>

      </div>

      <!-- Links like the starter -->
      <p class="mt-8 text-white/70">
        Check out
        <a
          class="font-medium text-sky-300 hover:text-sky-200 underline underline-offset-4"
          href="https://vuejs.org/guide/quick-start.html#local"
          target="_blank"
          rel="noreferrer"
        >
          create-vue
        </a>
        to learn the official Vue starter workflow.
      </p>

      <p class="mt-3 text-white/70">
        Learn more about tooling in the
        <a
          class="font-medium text-sky-300 hover:text-sky-200 underline underline-offset-4"
          href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
          target="_blank"
          rel="noreferrer"
        >
          Vue Docs (Scaling Up)
        </a>
        .
      </p>

      <p class="mt-6 text-white/45">
        FTG tip: add your real Home content once routes are wired up.
      </p>
    </section>
  </main>
</template>

