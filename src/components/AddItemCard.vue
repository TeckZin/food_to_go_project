<script setup lang="ts">
defineProps<{
  canManage: boolean
}>()

const emit = defineEmits<{
  (e: "open"): void
}>()
</script>

<template>
  <div
    v-if="canManage"
    class="store-card overflow-hidden rounded-[2rem] border border-dashed border-[#DBCFB0]/40 bg-[#1F232B] shadow-[0_0.625rem_2.5rem_rgba(0,0,0,0.25)]"
  >
    <div
      class="flex min-h-[22rem] flex-col items-center justify-center border-b border-white/10 bg-[#303642] px-6 py-6"
    >
      <div
        class="flex h-[8rem] w-[8rem] items-center justify-center rounded-full border-2 border-[#DBCFB0] text-6xl font-light text-[#DBCFB0]"
      >
        +
      </div>

      <h2 class="mt-6 font-inter text-3xl font-bold text-white">Add Item</h2>
      <p class="mt-3 max-w-[18rem] text-center font-inter text-base leading-7 text-white/70">
        Create a new food item for the store menu.
      </p>
    </div>

    <div class="px-6 py-6">
      <p class="font-inter text-sm font-semibold uppercase tracking-[0.2em] text-[#DBCFB0]">
        Admin / Manager
      </p>

      <button
        @click="emit('open')"
        class="mt-6 w-full rounded-full bg-[#DBCFB0] px-6 py-4 font-inter text-sm font-extrabold uppercase tracking-[0.18em] text-[#272B34] transition hover:scale-[1.01]"
      >
        Add New Item
      </button>

      <p
        class="mt-4 text-center font-inter text-sm font-medium uppercase tracking-[0.05em] text-white/50"
      >
        Restricted access
      </p>
    </div>
  </div>
</template>
