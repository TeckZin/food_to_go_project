<script setup lang="ts"></script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-[#272B34] px-[1.5rem]">
    <div class="text-center">
      <div
        class="text-[7.5rem] italic font-extrabold leading-none tracking-tight text-white sm:text-[10rem]"
      >
        404
      </div>

      <p class="mt-[0.75rem] text-lg text-white/70">
        Page not found.
      </p>

      <RouterLink
        to="/"
        class="mt-[1.5rem] inline-block rounded-md border border-white/10 bg-white/10 px-[1rem] py-[0.5rem] text-sm font-medium text-white hover:bg-white/15"
      >
        Go back to home page
      </RouterLink>
    </div>
  </main>
</template>
