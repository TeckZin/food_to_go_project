<script setup lang="ts"></script>

<template>
  <main class="min-h-screen bg-[#272B34] flex items-center justify-center px-6">
    <div class="text-center">
      <div class="text-[120px] italic font-extrabold leading-none tracking-tight text-white sm:text-[160px]">
        404
      </div>

      <p class="mt-3 text-lg text-white/70">
        Page not found.
      </p>

      <RouterLink
        to="/"
        class="mt-6 inline-block rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 border border-white/10"
      >
        Go back to home page
      </RouterLink>
    </div>
  </main>
</template>

