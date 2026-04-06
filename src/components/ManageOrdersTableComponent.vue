<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import {
  deleteDoc,
  doc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  getAllOrders,
  updateOrderStatus,
  OrderStatus,
  type UserOrder,
} from "@/helper/orderFunction"

defineProps<{
  isAdmin: boolean
  isManager: boolean
}>()

const router = useRouter()

const orders = ref<UserOrder[]>([])
const loading = ref(true)
const errorMsg = ref("")
const actionLoadingId = ref("")

async function loadOrders() {
  try {
    loading.value = true
    errorMsg.value = ""
    orders.value = await getAllOrders()
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to load orders."
  } finally {
    loading.value = false
  }
}

function statusClass(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-500/15 text-green-300 border border-green-400/20"
    case "rejected":
      return "bg-red-500/15 text-red-300 border border-red-400/20"
    case "completed":
      return "bg-blue-500/15 text-blue-300 border border-blue-400/20"
    default:
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-400/20"
  }
}

async function approveOrder(orderId: string) {
  try {
    actionLoadingId.value = orderId
    await updateOrderStatus(orderId, OrderStatus.APPROVED)
    await loadOrders()
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to approve order."
  } finally {
    actionLoadingId.value = ""
  }
}

async function rejectOrder(orderId: string) {
  try {
    actionLoadingId.value = orderId
    await updateOrderStatus(orderId, OrderStatus.REJECTED)
    await loadOrders()
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to reject order."
  } finally {
    actionLoadingId.value = ""
  }
}

async function completeOrder(orderId: string) {
  try {
    actionLoadingId.value = orderId
    await updateOrderStatus(orderId, OrderStatus.COMPLETED)
    await loadOrders()
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to complete order."
  } finally {
    actionLoadingId.value = ""
  }
}

async function deleteOrder(orderId: string) {
  const confirmed = window.confirm("Delete this order?")
  if (!confirmed) return

  try {
    actionLoadingId.value = orderId
    await deleteDoc(doc(db, "orders", orderId))
    await loadOrders()
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to delete order."
  } finally {
    actionLoadingId.value = ""
  }
}

function viewUser(order: UserOrder) {
  router.push(`/manage-user/${order.userUid}`)
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="text-white">
    <div class="mb-5 flex items-center justify-between gap-4">
      <div>
        <h2 class="font-pragati text-3xl">Orders</h2>
        <p class="mt-1 text-white/60">
          Review, approve, and manage customer orders.
        </p>
      </div>

      <button
        class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
        @click="loadOrders"
      >
        Refresh
      </button>
    </div>

    <p v-if="loading" class="text-white/70">Loading orders...</p>
    <p v-else-if="errorMsg" class="text-sm text-red-300">{{ errorMsg }}</p>

    <div v-else-if="orders.length === 0" class="rounded-lg border border-white/10 bg-white/5 p-5 text-white/70">
      No orders found.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="rounded-xl border border-white/10 bg-white/5 p-5"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <h3 class="font-pragati text-2xl">
                Order #{{ order.id.slice(0, 8) }}
              </h3>

              <span
                :class="statusClass(order.status)"
                class="rounded-full px-3 py-1 text-xs uppercase tracking-wide"
              >
                {{ order.status }}
              </span>
            </div>

            <div class="grid gap-2 text-sm text-white/75">
              <p><span class="text-white">User:</span> {{ order.fullName }}</p>
              <p><span class="text-white">Email:</span> {{ order.userEmail }}</p>
              <p><span class="text-white">Phone:</span> {{ order.phoneNumber }}</p>
              <p><span class="text-white">Address:</span> {{ order.address }}</p>
              <p>
                <span class="text-white">Campus Location:</span>
                {{ order.campusLocation || "Not provided" }}
              </p>
              <p>
                <span class="text-white">Notes:</span>
                {{ order.notes || "No notes" }}
              </p>
              <p><span class="text-white">Created:</span> {{ order.createdAt }}</p>
              <p><span class="text-white">Total:</span> ${{ order.total.toFixed(2) }}</p>
            </div>

            <div>
              <p class="mb-2 text-sm text-white">Items</p>
              <div class="space-y-2">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm text-white/75"
                >
                  {{ item.name }} — {{ item.qty }} × ${{ item.price.toFixed(2) }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex min-w-[220px] flex-col gap-3">
            <button
              class="rounded-md border border-green-400/20 bg-green-500/15 px-4 py-2 text-sm text-green-200 transition hover:bg-green-500/25 disabled:opacity-60"
              :disabled="actionLoadingId === order.id || order.status === 'approved'"
              @click="approveOrder(order.id)"
            >
              {{ actionLoadingId === order.id ? "Working..." : "Approve" }}
            </button>

            <button
              class="rounded-md border border-red-400/20 bg-red-500/15 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/25 disabled:opacity-60"
              :disabled="actionLoadingId === order.id || order.status === 'rejected'"
              @click="rejectOrder(order.id)"
            >
              {{ actionLoadingId === order.id ? "Working..." : "Reject" }}
            </button>

            <button
              class="rounded-md border border-blue-400/20 bg-blue-500/15 px-4 py-2 text-sm text-blue-200 transition hover:bg-blue-500/25 disabled:opacity-60"
              :disabled="actionLoadingId === order.id || order.status === 'completed'"
              @click="completeOrder(order.id)"
            >
              {{ actionLoadingId === order.id ? "Working..." : "Complete" }}
            </button>

            <button
              class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
              @click="viewUser(order)"
            >
              View User
            </button>

            <button
              class="rounded-md border border-red-400/20 bg-transparent px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/10 disabled:opacity-60"
              :disabled="actionLoadingId === order.id"
              @click="deleteOrder(order.id)"
            >
              {{ actionLoadingId === order.id ? "Working..." : "Delete Order" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
