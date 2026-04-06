<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import NavBar from "@/components/NavBar.vue"

const route = useRoute()
const router = useRouter()

const fullName = computed(() => String(route.query.fullName ?? "Customer"))
const total = computed(() => String(route.query.total ?? "0.00"))
const itemCount = computed(() => String(route.query.itemCount ?? "0"))
</script>

<template>
  <div class="min-h-screen bg-[#272B34] text-white">
    <NavBar />

    <main class="mx-auto flex max-w-3xl flex-col px-6 py-16">
      <div class="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <h1 class="font-pragati text-5xl">Order Confirmed</h1>
        <p class="mt-4 text-white/70">
          Thank you, {{ fullName }}. Your order has been received.
        </p>

        <div class="mt-8 space-y-3 rounded-lg border border-white/10 bg-white/5 p-6 text-left">
          <div class="flex items-center justify-between">
            <span class="text-white/70">Items</span>
            <span>{{ itemCount }}</span>
          </div>

          <div class="flex items-center justify-between text-xl">
            <span>Total</span>
            <span>${{ total }}</span>
          </div>
        </div>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            class="rounded-md border border-white/10 bg-white/10 px-6 py-3 text-white transition hover:bg-white/20"
            @click="router.push('/store')"
          >
            Back to Store
          </button>

          <button
            class="rounded-md border border-white/10 bg-transparent px-6 py-3 text-white transition hover:bg-white/10"
            @click="router.push('/account')"
          >
            Go to Account
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
