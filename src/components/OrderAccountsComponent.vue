<script setup lang="ts">
type Order = {
  id: string
  date: string
  total: string
  status: string
}

const orders: Order[] = [
  { id: "FTG-001", date: "2026-04-01", total: "$18.99", status: "Delivered" },
  { id: "FTG-002", date: "2026-03-28", total: "$24.50", status: "Completed" },
  { id: "FTG-003", date: "2026-03-21", total: "$12.75", status: "Completed" },
]
</script>

<template>
  <div class="space-y-4 text-white">
    <h2 class="text-3xl font-pragati">Orders</h2>
    <p class="text-white/70">Your recent orders.</p>

    <div class="space-y-3">
      <div
        v-for="order in orders"
        :key="order.id"
        class="rounded-md border border-white/10 bg-white/5 p-4"
      >
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-lg font-medium">{{ order.id }}</p>
            <p class="text-white/60">{{ order.date }}</p>
          </div>

          <div class="text-left md:text-right">
            <p>{{ order.total }}</p>
            <p class="text-white/60">{{ order.status }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
