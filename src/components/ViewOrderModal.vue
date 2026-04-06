<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { updateOrderStatus, OrderStatus } from "@/helper/orderFunction"

type OrderItem = {
  id?: string
  name?: string
  qty?: number
  price?: number
  imageUrl?: string
}

type OrderRecord = {
  id: string
  status: string
  total: number
  createdAt: string
  createdAtMs?: number
  items: OrderItem[]
  fullName?: string
  userEmail?: string
  phoneNumber?: string
  address?: string
  campusLocation?: string
  notes?: string
}

const props = defineProps<{
  isOpen: boolean
  order: OrderRecord | null
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "updated"): void
}>()

const actionLoading = ref(false)
const errorMsg = ref("")

const hasOrder = computed(() => !!props.order)

const canApprove = computed(
  () => props.order?.status?.toLowerCase() !== "approved"
)

const canReject = computed(
  () => props.order?.status?.toLowerCase() !== "rejected"
)

const canComplete = computed(
  () => props.order?.status?.toLowerCase() !== "completed"
)

function formatStatus(value?: string) {
  if (!value) return "Unknown"

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function closeModal() {
  if (actionLoading.value) return
  emit("close")
}

async function runStatusUpdate(status: OrderStatus) {
  if (!props.order) return

  try {
    actionLoading.value = true
    errorMsg.value = ""

    await updateOrderStatus(props.order.id, status)
    emit("updated")
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to update order."
  } finally {
    actionLoading.value = false
  }
}

async function approveOrder() {
  await runStatusUpdate(OrderStatus.APPROVED)
}

async function rejectOrder() {
  await runStatusUpdate(OrderStatus.REJECTED)
}

async function completeOrder() {
  await runStatusUpdate(OrderStatus.COMPLETED)
}

async function deleteOrder() {
  if (!props.order) return

  const confirmed = window.confirm("Delete this order?")
  if (!confirmed) return

  try {
    actionLoading.value = true
    errorMsg.value = ""

    await deleteDoc(doc(db, "orders", props.order.id))
    emit("updated")
    emit("close")
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to delete order."
  } finally {
    actionLoading.value = false
  }
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      errorMsg.value = ""
      actionLoading.value = false
    }
  }
)
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4"
  >
    <div
      class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#272B34] p-6 text-white shadow-xl"
    >
      <div class="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-2xl font-pragati text-white">View Order</h2>
          <p class="text-sm text-white/60">
            Review order details and manage status.
          </p>
        </div>

        <button
          class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20 disabled:opacity-60"
          :disabled="actionLoading"
          @click="closeModal"
        >
          Close
        </button>
      </div>

      <p v-if="errorMsg" class="mb-4 text-sm text-red-300">{{ errorMsg }}</p>

      <div v-if="hasOrder" class="space-y-5">
        <div class="rounded-xl border border-white/10 bg-white/5 p-4">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div class="space-y-2">
              <p class="text-lg font-medium text-white">
                Order #{{ order?.id }}
              </p>

              <p class="text-sm text-white/70">
                Status:
                <span class="text-white">{{ formatStatus(order?.status) }}</span>
              </p>

              <p class="text-sm text-white/70">
                Date:
                <span class="text-white">{{ order?.createdAt || "Unknown date" }}</span>
              </p>

              <p class="text-sm text-white/70">
                Total:
                <span class="text-white">
                  ${{ Number(order?.total ?? 0).toFixed(2) }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="
            order?.fullName ||
            order?.userEmail ||
            order?.phoneNumber ||
            order?.address ||
            order?.campusLocation ||
            order?.notes
          "
          class="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <h3 class="mb-3 text-lg font-medium text-white">Customer Info</h3>

          <div class="grid gap-2 text-sm text-white/75">
            <p v-if="order?.fullName">
              <span class="text-white">User:</span> {{ order.fullName }}
            </p>

            <p v-if="order?.userEmail">
              <span class="text-white">Email:</span> {{ order.userEmail }}
            </p>

            <p v-if="order?.phoneNumber">
              <span class="text-white">Phone:</span> {{ order.phoneNumber }}
            </p>

            <p v-if="order?.address">
              <span class="text-white">Address:</span> {{ order.address }}
            </p>

            <p v-if="order?.campusLocation">
              <span class="text-white">Campus Location:</span>
              {{ order.campusLocation }}
            </p>

            <p v-if="order?.notes">
              <span class="text-white">Notes:</span> {{ order.notes }}
            </p>
          </div>
        </div>

        <div class="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 class="mb-3 text-lg font-medium text-white">Items</h3>

          <div v-if="order?.items?.length" class="space-y-2">
            <div
              v-for="item in order.items"
              :key="item.id || `${item.name}-${item.qty}-${item.price}`"
              class="rounded-lg border border-white/10 bg-black/10 px-3 py-3 text-sm text-white/75"
            >
              <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="text-white">{{ item.name || "Unnamed item" }}</p>
                  <p class="text-white/60">Qty: {{ Number(item.qty ?? 0) }}</p>
                </div>

                <div class="text-left md:text-right">
                  <p class="text-white/60">
                    ${{ Number(item.price ?? 0).toFixed(2) }} each
                  </p>
                  <p class="text-white">
                    ${{ (Number(item.qty ?? 0) * Number(item.price ?? 0)).toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p v-else class="text-sm text-white/60">No items found for this order.</p>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <button
            class="rounded-md border border-green-400/20 bg-green-500/15 px-4 py-3 text-sm text-green-200 transition hover:bg-green-500/25 disabled:opacity-60"
            :disabled="actionLoading || !canApprove"
            @click="approveOrder"
          >
            {{ actionLoading ? "Working..." : "Approve Order" }}
          </button>

          <button
            class="rounded-md border border-red-400/20 bg-red-500/15 px-4 py-3 text-sm text-red-200 transition hover:bg-red-500/25 disabled:opacity-60"
            :disabled="actionLoading || !canReject"
            @click="rejectOrder"
          >
            {{ actionLoading ? "Working..." : "Reject Order" }}
          </button>

          <button
            class="rounded-md border border-blue-400/20 bg-blue-500/15 px-4 py-3 text-sm text-blue-200 transition hover:bg-blue-500/25 disabled:opacity-60"
            :disabled="actionLoading || !canComplete"
            @click="completeOrder"
          >
            {{ actionLoading ? "Working..." : "Complete Order" }}
          </button>

          <button
            class="rounded-md border border-red-400/20 bg-transparent px-4 py-3 text-sm text-red-200 transition hover:bg-red-500/10 disabled:opacity-60"
            :disabled="actionLoading"
            @click="deleteOrder"
          >
            {{ actionLoading ? "Working..." : "Delete Order" }}
          </button>
        </div>
      </div>

      <p v-else class="text-white/60">No order selected.</p>
    </div>
  </div>
</template>
