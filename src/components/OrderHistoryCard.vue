<script setup lang="ts">
const props = defineProps<{
  orderId: string
  status: string
  date: string
  total: number
}>()

const emit = defineEmits<{
  (e: "view"): void
}>()

function formatStatus(value: string) {
  if (!value) return "Unknown"

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function shortOrderId(value: string) {
  if (!value) return "Unknown"
  return value.slice(0, 8)
}
</script>

<template>
  <div class="rounded-xl border border-white/10 bg-white/5 p-4">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="space-y-1">
        <p class="text-lg font-medium text-white">
          Order #{{ shortOrderId(orderId) }}
        </p>

        <p class="text-sm text-white/70">
          Status:
          <span class="text-white">{{ formatStatus(status) }}</span>
        </p>

        <p class="text-sm text-white/70">
          Date:
          <span class="text-white">{{ date || "Unknown date" }}</span>
        </p>

        <p class="text-sm text-white/70">
          Total:
          <span class="text-white">${{ Number(total ?? 0).toFixed(2) }}</span>
        </p>
      </div>

      <div class="flex justify-start md:justify-end">
        <button
          class="rounded-md border border-[#DBCFB0] px-4 py-2 text-sm text-[#DBCFB0] transition hover:bg-[#DBCFB0] hover:text-[#272B34]"
          @click="emit('view')"
        >
          View Order
        </button>
      </div>
    </div>
  </div>
</template>
