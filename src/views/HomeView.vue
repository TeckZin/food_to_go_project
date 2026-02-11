<script setup lang="ts">
import NavBar from "@/components/NavBar.vue"

const buttonClass = "p-5 border-4 border-[#DBCFB0] rounded-[5rem] mr-5"
</script>

<template>
  <div class="min-h-screen w-full overflow-x-hidden bg-[#272B34]">
    <main class="flex min-h-screen w-full flex-col">
      <NavBar class="w-full" />

      <div class="flex flex-1 w-full flex-row overflow-x-hidden">
        <section class="flex w-1/2 flex-col justify-center pl-10 relative z-10">
          <div class="font-jacques text-8xl flex-col py-10 text-white leading-[0.95]">
            <p>FRESH,</p>
            <p>MEALS, FAST</p>
            <p>DELIVER TO</p>
            <p>CAMPUS</p>
          </div>

          <div class="flex font-inter text-4xl flex-row py-5 text-white">
            <p :class="buttonClass">ORDER</p>
            <p :class="buttonClass">CONTACT</p>
          </div>
        </section>

        <section class="relative w-1/2 overflow-hidden">
          <div
            class="pointer-events-none absolute left-[3rem] top-1/4 translate-y-1/8 rotate-[-28deg]
                   font-inter font-extrabold text-[35rem] leading-none tracking-tight "
          >
            FTG
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

