<script setup lang="ts">
import { Github, Linkedin } from "lucide-vue-next"

const engineers = [
  {
    name: "Teck Zin Tan",
    github: "https://github.com/TeckZin",
    linkedin: "https://www.linkedin.com/in/teckzintan/",
  },
  {
    name: "Engineer Two",
    github: "https://github.com/dot11atwit",
    linkedin: "https://linkedin.com/in/engineer-two",
  },
  {
    name: "Thomas Do",
    github: "https://github.com/engineer-three",
    linkedin: "https://www.linkedin.com/in/thomas-do-342492330/",
  },
]
</script>

<template>
  <footer class="mt-8 w-full border-t border-cream_yellow/30 bg-[#1f232b] px-5 py-8 sm:px-8 md:px-10">
    <div class="mx-auto max-w-6xl">
      <div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div
          class="flex flex-wrap items-center justify-center gap-3 text-center font-inter text-sm text-white/70 sm:text-base md:justify-start md:text-left"
        >
          <span>© 2026 Food To Go</span>

          <a
            href="https://github.com/TeckZin/food_to_go_project"
            target="_blank"
            rel="noopener noreferrer"
            class="transition hover:text-cream_yellow"
            aria-label="Food To Go GitHub Repository"
          >
            <Github class="h-5 w-5" />
          </a>
        </div>

        <div
          class="grid grid-cols-1 gap-3 sm:gap-4 md:max-w-[70%] md:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="engineer in engineers"
            :key="engineer.name"
            class="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
          >
            <span class="pr-3 font-inter text-sm text-white/75 sm:text-base">
              {{ engineer.name }}
            </span>

            <div class="flex shrink-0 items-center gap-3">
              <a
                :href="engineer.github"
                target="_blank"
                rel="noopener noreferrer"
                class="transition hover:text-cream_yellow"
                :aria-label="`${engineer.name} GitHub`"
              >
                <Github class="h-5 w-5" />
              </a>

              <a
                :href="engineer.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="transition hover:text-cream_yellow"
                :aria-label="`${engineer.name} LinkedIn`"
              >
                <Linkedin class="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
