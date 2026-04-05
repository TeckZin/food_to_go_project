<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { auth } from "@/lib/firebase"
import { addItemToCart, getUserCart } from "@/helper/cartFunction"

const props = defineProps<{
  isOpen: boolean
  item: {
    id: string
    name: string
    price: number
    imageUrl?: string
    category?: string
  } | null
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "added"): void
}>()

const qty = ref(1)
const loading = ref(false)
const successMsg = ref("")
const errorMsg = ref("")

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      qty.value = 1
      successMsg.value = ""
      errorMsg.value = ""
    }
  },
)

const subtotal = computed(() => {
  if (!props.item) return 0
  return props.item.price * qty.value
})

function increaseQty() {
  qty.value += 1
}

function decreaseQty() {
  if (qty.value > 1) qty.value -= 1
}

function closeModal() {
  if (loading.value) return
  emit("close")
}

async function submitAddToCart() {
  if (!props.item) return

  try {
    loading.value = true
    errorMsg.value = ""
    successMsg.value = ""

    const user = auth.currentUser
    if (!user) throw new Error("Please log in before adding items to your cart.")

    const currentCart = await getUserCart(user.uid)
    const existingItem = currentCart.find((cartItem) => cartItem.id === props.item?.id)

    const mergedQty = existingItem ? existingItem.qty + qty.value : qty.value

    await addItemToCart(user.uid, {
      id: props.item.id,
      name: props.item.name,
      price: props.item.price,
      imageUrl: props.item.imageUrl ?? "",
      category: props.item.category ?? "",
      qty: mergedQty,
    })

    successMsg.value = "Item added to cart."
    emit("added")

    setTimeout(() => {
      emit("close")
    }, 500)
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to add item to cart."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="isOpen && item"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      @click.self="closeModal"
    >
      <div class="w-full max-w-lg rounded-2xl border border-white/10 bg-[#272B34] p-6 text-white shadow-2xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="font-pragati text-3xl">Add to Cart</h2>
            <p class="mt-1 text-white/70">Choose how many you want to add.</p>
          </div>

          <button
            class="rounded-md px-3 py-1 text-white/70 hover:bg-white/10 hover:text-white"
            @click="closeModal"
          >
            ✕
          </button>
        </div>

        <div class="mt-6 flex flex-col gap-4 md:flex-row">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.name"
            class="h-32 w-32 rounded-xl border border-white/10 object-cover"
          />

          <div class="flex-1">
            <h3 class="font-pragati text-2xl">{{ item.name }}</h3>
            <p class="text-white/60">{{ item.category || "Food Item" }}</p>
            <p class="mt-2 text-lg">${{ item.price.toFixed(2) }}</p>
          </div>
        </div>

        <div class="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <label class="mb-3 block text-white/70">Quantity</label>

          <div class="flex items-center gap-4">
            <button
              class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-lg hover:bg-white/20"
              @click="decreaseQty"
            >
              -
            </button>

            <span class="min-w-[3rem] text-center text-xl">{{ qty }}</span>

            <button
              class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-lg hover:bg-white/20"
              @click="increaseQty"
            >
              +
            </button>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
          <span class="text-white/70">Subtotal</span>
          <span class="text-xl font-semibold">${{ subtotal.toFixed(2) }}</span>
        </div>

        <p v-if="errorMsg" class="mt-4 text-sm text-red-300">
          {{ errorMsg }}
        </p>

        <p v-if="successMsg" class="mt-4 text-sm text-green-300">
          {{ successMsg }}
        </p>

        <div class="mt-6 flex gap-3">
          <button
            class="flex-1 rounded-md border border-white/10 bg-white/10 px-5 py-3 text-white transition hover:bg-white/20"
            @click="closeModal"
          >
            Cancel
          </button>

          <button
            class="flex-1 rounded-md border border-[#DBCFB0] bg-[#DBCFB0] px-5 py-3 text-[#272B34] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loading"
            @click="submitAddToCart"
          >
            {{ loading ? "Adding..." : "Add to Cart" }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
