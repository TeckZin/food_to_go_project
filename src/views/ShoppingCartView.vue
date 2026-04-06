<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import NavBar from "@/components/NavBar.vue"
import { auth } from "@/lib/firebase"
import {
  clearUserCart,
  getCartTotal,
  getUserCart,
  removeCartItem,
  updateCartItemQty,
  type CartItem,
} from "@/helper/cartFunction"

const router = useRouter()

const cartItems = ref<CartItem[]>([])
const loading = ref(true)
const errorMsg = ref("")
const successMsg = ref("")

const total = computed(() => getCartTotal(cartItems.value))

async function loadCart() {
  try {
    loading.value = true
    errorMsg.value = ""
    successMsg.value = ""

    const user = auth.currentUser
    if (!user) {
      router.push({ path: "/auth", query: { mode: "login" } })
      return
    }

    cartItems.value = await getUserCart(user.uid)
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to load cart."
  } finally {
    loading.value = false
  }
}

async function increaseQty(item: CartItem) {
  const user = auth.currentUser
  if (!user) return

  try {
    await updateCartItemQty(user.uid, item.id, item.qty + 1)
    item.qty += 1
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to update quantity."
  }
}

async function decreaseQty(item: CartItem) {
  const user = auth.currentUser
  if (!user) return

  try {
    const newQty = item.qty - 1
    await updateCartItemQty(user.uid, item.id, newQty)

    if (newQty <= 0) {
      cartItems.value = cartItems.value.filter((cartItem) => cartItem.id !== item.id)
    } else {
      item.qty = newQty
    }
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to update quantity."
  }
}

async function removeItem(itemId: string) {
  const user = auth.currentUser
  if (!user) return

  try {
    await removeCartItem(user.uid, itemId)
    cartItems.value = cartItems.value.filter((item) => item.id !== itemId)
    successMsg.value = "Item removed from cart."
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to remove item."
  }
}

async function clearCart() {
  const user = auth.currentUser
  if (!user) return

  try {
    await clearUserCart(user.uid)
    cartItems.value = []
    successMsg.value = "Cart cleared."
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to clear cart."
  }
}

onMounted(() => {
  loadCart()
})
</script>

<template>
  <div class="min-h-screen bg-[#272B34] text-white">
    <NavBar />

    <main class="mx-auto max-w-5xl px-6 py-10">
      <div class="mb-8">
        <h1 class="font-pragati text-4xl">Shopping Cart</h1>
        <p class="mt-2 text-white/70">Review your items before checkout.</p>
      </div>

      <p v-if="loading" class="text-white/70">Loading cart...</p>
      <p v-else-if="errorMsg" class="text-sm text-red-300">{{ errorMsg }}</p>

      <div v-else class="space-y-6">
        <p v-if="successMsg" class="text-sm text-green-300">
          {{ successMsg }}
        </p>

        <div
          v-if="cartItems.length === 0"
          class="rounded-xl border border-white/10 bg-white/5 p-6"
        >
          <p class="text-white/70">Your cart is empty.</p>

          <RouterLink
            to="/store"
            class="mt-4 inline-block rounded-md border border-white/10 bg-white/10 px-5 py-3 text-white transition hover:bg-white/20"
          >
            Go to Store
          </RouterLink>
        </div>

        <div v-else class="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div class="space-y-4">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div class="flex items-center gap-4">
                <img
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="h-24 w-24 rounded-lg object-cover border border-white/10"
                />

                <div>
                  <h2 class="font-pragati text-2xl">{{ item.name }}</h2>
                  <p class="text-white/60">{{ item.category || "Food Item" }}</p>
                  <p class="mt-1 text-lg">${{ item.price.toFixed(2) }}</p>
                </div>
              </div>

              <div class="flex flex-col items-start gap-3 md:items-end">
                <div class="flex items-center gap-3">
                  <button
                    class="rounded-md border border-white/10 bg-white/10 px-3 py-1 hover:bg-white/20"
                    @click="decreaseQty(item)"
                  >
                    -
                  </button>

                  <span class="min-w-[2rem] text-center">{{ item.qty }}</span>

                  <button
                    class="rounded-md border border-white/10 bg-white/10 px-3 py-1 hover:bg-white/20"
                    @click="increaseQty(item)"
                  >
                    +
                  </button>
                </div>

                <p class="text-white/80">
                  Subtotal: ${{ (item.price * item.qty).toFixed(2) }}
                </p>

                <button
                  class="text-sm text-red-300 hover:text-red-200"
                  @click="removeItem(item.id)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <aside class="h-fit rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 class="font-pragati text-3xl">Summary</h2>

            <div class="mt-4 flex items-center justify-between text-white/80">
              <span>Items</span>
              <span>{{ cartItems.length }}</span>
            </div>

            <div class="mt-2 flex items-center justify-between text-xl">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>

            <div class="mt-6 space-y-3">
                <button
  class="w-full rounded-md border border-white/10 bg-white/10 px-5 py-3 text-white transition hover:bg-white/20"
  @click="router.push('/checkout')"
>
  Checkout
</button>

              <button
                class="w-full rounded-md border border-red-400/30 bg-red-400/10 px-5 py-3 text-red-200 transition hover:bg-red-400/20"
                @click="clearCart"
              >
                Clear Cart
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>
