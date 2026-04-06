<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import OrderHistoryCard from "@/components/OrderHistoryCard.vue"
import {
  getUserCart,
  getUserOrders,
  type CartItem,
  type UserOrder,
} from "@/helper/orderFunction"

type OrderTab = "orders" | "past" | "processing" | "cart"

const activeTab = ref<OrderTab>("orders")

const currentUser = ref<User | null>(null)
const authReady = ref(false)

const orders = ref<UserOrder[]>([])
const cartItems = ref<CartItem[]>([])

const loading = ref(false)
const errorMsg = ref("")

const pastOrders = computed(() =>
  orders.value.filter((order) => {
    const status = String(order.status ?? "").toLowerCase()
    return status === "delivered" || status === "completed"
  })
)

const processingOrders = computed(() =>
  orders.value.filter((order) => {
    const status = String(order.status ?? "").toLowerCase()
    return (
      status === "processing" ||
      status === "preparing" ||
      status === "pending" ||
      status === "approved"
    )
  })
)

const tabClass = (tab: OrderTab) =>
  [
    "px-2 py-2 text-lg sm:text-xl font-normal font-pragati cursor-pointer border-b-2 transition",
    activeTab.value === tab
      ? "text-white border-[#DBCFB0]"
      : "text-white/70 border-transparent hover:text-white",
  ].join(" ")

async function loadData(uid: string) {
  try {
    loading.value = true
    errorMsg.value = ""

    const [orderData, cartData] = await Promise.all([
      getUserOrders(uid),
      getUserCart(uid),
    ])

    orders.value = Array.isArray(orderData) ? orderData : []
    cartItems.value = Array.isArray(cartData) ? cartData : []
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to load orders."
    orders.value = []
    cartItems.value = []
  } finally {
    loading.value = false
  }
}

let unsubscribeAuth: (() => void) | null = null

onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    authReady.value = true

    if (!user) {
      orders.value = []
      cartItems.value = []
      errorMsg.value = "No signed-in user found."
      return
    }

    await loadData(user.uid)
  })
})

onBeforeUnmount(() => {
  unsubscribeAuth?.()
})
</script>

<template>
  <div class="space-y-4 text-white">
    <h2 class="text-3xl font-pragati">Orders</h2>
    <p class="text-white/70">Manage your orders and cart.</p>

    <div class="flex flex-wrap gap-4 border-b border-white/10 pb-3">
      <button :class="tabClass('orders')" @click="activeTab = 'orders'">ORDERS</button>
      <button :class="tabClass('past')" @click="activeTab = 'past'">PAST ORDERS</button>
      <button :class="tabClass('processing')" @click="activeTab = 'processing'">PROCESSING</button>
      <button :class="tabClass('cart')" @click="activeTab = 'cart'">CART</button>
    </div>

    <p v-if="!authReady" class="text-white/70">Checking account...</p>
    <p v-else-if="loading" class="text-white/70">Loading orders...</p>
    <p v-else-if="errorMsg" class="text-sm text-red-300">{{ errorMsg }}</p>

    <div v-else-if="activeTab === 'orders'" class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="rounded-2xl border border-white/10 bg-white/5 p-1"
      >
        <OrderHistoryCard
          :order-id="order.id"
          :status="order.status"
          :date="order.createdAt"
          :total="order.total"
        />
      </div>

      <p v-if="orders.length === 0" class="text-white/70">No orders found.</p>
    </div>

    <div v-else-if="activeTab === 'past'" class="space-y-4">
      <div
        v-for="order in pastOrders"
        :key="order.id"
        class="rounded-2xl border border-white/10 bg-white/5 p-1"
      >
        <OrderHistoryCard
          :order-id="order.id"
          :status="order.status"
          :date="order.createdAt"
          :total="order.total"
        />
      </div>

      <p v-if="pastOrders.length === 0" class="text-white/70">No past orders.</p>
    </div>

    <div v-else-if="activeTab === 'processing'" class="space-y-4">
      <div
        v-for="order in processingOrders"
        :key="order.id"
        class="rounded-2xl border border-white/10 bg-white/5 p-1"
      >
        <OrderHistoryCard
          :order-id="order.id"
          :status="order.status"
          :date="order.createdAt"
          :total="order.total"
        />
      </div>

      <p v-if="processingOrders.length === 0" class="text-white/70">
        No processing orders.
      </p>
    </div>

    <div v-else-if="activeTab === 'cart'" class="space-y-3">
      <div
        v-for="item in cartItems"
        :key="item.id"
        class="rounded-xl border border-white/10 bg-white/5 p-4"
      >
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-lg font-medium">{{ item.name }}</p>
            <p class="text-white/60">Item ID: {{ item.id }}</p>
          </div>

          <div class="text-left md:text-right">
            <p>Qty: {{ item.qty }}</p>
            <p class="text-white/60">${{ Number(item.price ?? 0).toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <p v-if="cartItems.length === 0" class="text-white/70">Your cart is empty.</p>
    </div>
  </div>
</template>
