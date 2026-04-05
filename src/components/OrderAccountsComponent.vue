<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { auth } from "@/lib/firebase"
import {
  getUserCart,
  getUserOrders,
  type CartItem,
  type UserOrder,
} from "@/helper/orderFunction"

type OrderTab = "orders" | "past" | "processing" | "cart"

const activeTab = ref<OrderTab>("orders")

const orders = ref<UserOrder[]>([])
const cartItems = ref<CartItem[]>([])

const loading = ref(true)
const errorMsg = ref("")

const pastOrders = computed(() =>
  orders.value.filter(
    (order) =>
      order.status.toLowerCase() === "delivered" ||
      order.status.toLowerCase() === "completed"
  )
)

const processingOrders = computed(() =>
  orders.value.filter(
    (order) =>
      order.status.toLowerCase() === "processing" ||
      order.status.toLowerCase() === "preparing" ||
      order.status.toLowerCase() === "pending"
  )
)

const tabClass = (tab: OrderTab) =>
  [
    "px-2 py-2 text-2xl font-normal font-pragati cursor-pointer border-b-2 transition",
    activeTab.value === tab
      ? "text-white border-[#DBCFB0]"
      : "text-white/70 border-transparent hover:text-white",
  ].join(" ")

onMounted(async () => {
  try {
    loading.value = true
    errorMsg.value = ""

    const user = auth.currentUser
    if (!user) throw new Error("No signed-in user found.")

    const [orderData, cartData] = await Promise.all([
      getUserOrders(user.uid),
      getUserCart(user.uid),
    ])

    orders.value = orderData
    cartItems.value = cartData
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to load orders."
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-4 text-white">
    <h2 class="text-3xl font-pragati">Orders</h2>
    <p class="text-white/70">Manage your orders and cart.</p>

    <div class="flex flex-wrap gap-6 border-b border-white/10 pb-3">
      <button :class="tabClass('orders')" @click="activeTab = 'orders'">
        ORDERS
      </button>

      <button :class="tabClass('past')" @click="activeTab = 'past'">
        PAST ORDERS
      </button>

      <button :class="tabClass('processing')" @click="activeTab = 'processing'">
        PROCESSING
      </button>

      <button :class="tabClass('cart')" @click="activeTab = 'cart'">
        CART
      </button>
    </div>

    <p v-if="loading" class="text-white/70">Loading orders...</p>
    <p v-else-if="errorMsg" class="text-sm text-red-300">{{ errorMsg }}</p>

    <div v-else-if="activeTab === 'orders'" class="space-y-3">
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

      <p v-if="orders.length === 0" class="text-white/70">No orders found.</p>
    </div>

    <div v-else-if="activeTab === 'past'" class="space-y-3">
      <div
        v-for="order in pastOrders"
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

      <p v-if="pastOrders.length === 0" class="text-white/70">No past orders.</p>
    </div>

    <div v-else-if="activeTab === 'processing'" class="space-y-3">
      <div
        v-for="order in processingOrders"
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

      <p v-if="processingOrders.length === 0" class="text-white/70">
        No processing orders.
      </p>
    </div>

    <div v-else-if="activeTab === 'cart'" class="space-y-3">
      <div
        v-for="item in cartItems"
        :key="item.id"
        class="rounded-md border border-white/10 bg-white/5 p-4"
      >
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-lg font-medium">{{ item.name }}</p>
            <p class="text-white/60">Item ID: {{ item.id }}</p>
          </div>

          <div class="text-left md:text-right">
            <p>Qty: {{ item.qty }}</p>
            <p class="text-white/60">{{ item.price }}</p>
          </div>
        </div>
      </div>

      <p v-if="cartItems.length === 0" class="text-white/70">Your cart is empty.</p>
    </div>
  </div>
</template>
