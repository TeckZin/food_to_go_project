<script setup lang="ts">
import FooterComponent from "@/components/FooterComponent.vue"
</script>

<template>
  <div class="min-h-screen w-full overflow-x-hidden bg-[#272B34] text-white">
    <RouterView />
    <FooterComponent />
  </div>
</template>
