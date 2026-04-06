<script setup lang="ts">
import { computed, ref, watch } from "vue"
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import OrderHistoryCard from "@/components/OrderHistoryCard.vue"
import OrderViewModal from "@/components/ViewOrderModal.vue"

type OrderItem = {
  id?: string
  name?: string
  qty?: number
  price?: number
  imageUrl?: string
}

type OrderRecord = {
  id: string
  userUid: string
  status: string
  total: number
  createdAt: string
  createdAtMs: number
  items: OrderItem[]
}

const props = defineProps<{
  isOpen: boolean
  userId: string
  userName: string
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()

const loading = ref(false)
const errorMsg = ref("")
const orders = ref<OrderRecord[]>([])

const selectedOrder = ref<OrderRecord | null>(null)
const detailModalOpen = ref(false)

const hasOrders = computed(() => orders.value.length > 0)

function getCreatedAtInfo(value: unknown) {
  if (value instanceof Timestamp) {
    const date = value.toDate()
    return {
      createdAt: date.toLocaleString(),
      createdAtMs: date.getTime(),
    }
  }

  if (
    value &&
    typeof value === "object" &&
    "seconds" in value &&
    typeof (value as { seconds?: unknown }).seconds === "number"
  ) {
    const date = new Date(((value as { seconds: number }).seconds) * 1000)
    return {
      createdAt: date.toLocaleString(),
      createdAtMs: date.getTime(),
    }
  }

  if (typeof value === "string") {
    const parsed = new Date(value)
    return {
      createdAt: value,
      createdAtMs: Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime(),
    }
  }

  return {
    createdAt: "Unknown date",
    createdAtMs: 0,
  }
}

function normalizeItems(value: unknown): OrderItem[] {
  if (!Array.isArray(value)) return []

  return value.map((item) => ({
    id: String(item?.id ?? ""),
    name: String(item?.name ?? ""),
    qty: Number(item?.qty ?? 0),
    price: Number(item?.price ?? 0),
    imageUrl: item?.imageUrl ? String(item.imageUrl) : "",
  }))
}

async function loadOrders() {
  if (!props.userId) {
    orders.value = []
    return
  }

  try {
    loading.value = true
    errorMsg.value = ""

    const q = query(
      collection(db, "orders"),
      where("userUid", "==", props.userId)
    )

    const snapshot = await getDocs(q)

    const mapped: OrderRecord[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      const created = getCreatedAtInfo(data.createdAt)

      return {
        id: docSnap.id,
        userUid: String(data.userUid ?? ""),
        status: String(data.status ?? "processing"),
        total: Number(data.total ?? 0),
        createdAt: created.createdAt,
        createdAtMs: created.createdAtMs,
        items: normalizeItems(data.items),
      }
    })

    orders.value = mapped.sort((a, b) => b.createdAtMs - a.createdAtMs)
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to load order history."
    orders.value = []
  } finally {
    loading.value = false
  }
}

function openDetail(order: OrderRecord) {
  selectedOrder.value = order
  detailModalOpen.value = true
}

function closeDetail() {
  detailModalOpen.value = false
  selectedOrder.value = null
}

async function handleOrderUpdated() {
  await loadOrders()

  if (!selectedOrder.value) return

  const updated = orders.value.find((order) => order.id === selectedOrder.value?.id)
  selectedOrder.value = updated ?? null

  if (!updated) {
    closeDetail()
  }
}

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      await loadOrders()
    } else {
      orders.value = []
      errorMsg.value = ""
      selectedOrder.value = null
      detailModalOpen.value = false
    }
  },
  { immediate: true }
)
</script>

<template>
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4"
    >
      <div
        class="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#272B34] p-6 text-white shadow-xl"
      >
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-2xl font-pragati">Order History</h2>
            <p class="text-sm text-white/60">{{ userName }}</p>
          </div>

          <button
            class="rounded-md border border-white/10 bg-white/10 px-4 py-2 transition hover:bg-white/20"
            @click="emit('close')"
          >
            Close
          </button>
        </div>

        <p v-if="loading" class="text-white/70">Loading orders...</p>
        <p v-else-if="errorMsg" class="text-sm text-red-300">{{ errorMsg }}</p>

        <div v-else-if="hasOrders" class="space-y-3">
          <OrderHistoryCard
            v-for="order in orders"
            :key="order.id"
            :order-id="order.id"
            :status="order.status"
            :date="order.createdAt"
            :total="order.total"
            @view="openDetail(order)"
          />
        </div>

        <p v-else class="text-white/60">No orders found for this user.</p>
      </div>
    </div>

    <OrderViewModal
      :is-open="detailModalOpen"
      :order="selectedOrder"
      @close="closeDetail"
      @updated="handleOrderUpdated"
    />
</template>
