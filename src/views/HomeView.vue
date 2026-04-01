<script setup lang="ts">
import NavBar from "@/components/NavBar.vue"
import AboutComponent from "@/components/AboutComponent.vue"

const buttonClass =
  "mr-5 rounded-[5rem] border-4 border-[#DBCFB0] px-8 py-4 text-white"

</script>

<template>
  <div class="w-full overflow-x-hidden bg-[#272B34]">
    <main class="flex w-full flex-col">
    <NavBar class="w-full" :include-about="true" />

      <div class="flex min-h-screen w-full flex-row overflow-x-hidden">
        <section class="relative z-10 flex w-1/2 flex-col justify-center pl-10">
          <div class="flex flex-col py-10 font-jacques text-8xl leading-[0.95] text-white">
            <p>FRESH,</p>
            <p>MEALS, FAST</p>
            <p>DELIVER TO</p>
            <p>CAMPUS</p>
          </div>

          <div class="flex flex-row items-center py-5 font-inter text-4xl text-white">
            <RouterLink to="/store" :class="buttonClass">STORE</RouterLink>
            <RouterLink to="/contact" :class="buttonClass">CONTACT</RouterLink>
          </div>
        </section>

        <section class="relative w-1/2 overflow-hidden">
          <div
            class="pointer-events-none absolute left-[3rem] top-1/4 translate-y-1/8 rotate-[-28deg] font-inter text-[35rem] font-extrabold leading-none tracking-tight text-[#DBCFB0]"
          >
            FTG
          </div>
        </section>
      </div>

      <AboutComponent />
    </main>
  </div>
</template>
