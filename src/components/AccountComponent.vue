<script setup lang="ts">
const props = defineProps<{
  isAccount?: boolean
}>()


const accClass = "px-2 py-2 text-3xl font-normal font-pragati"
</script>

<template>
    <p v-if="props.isAccount">ACCOUNT</p>
    <div v-else class="flex justify-center">
      <p :class="accClass">LOGIN</p>
      <p :class="accClass">SIGN UP</p>
    </div>
</template>

