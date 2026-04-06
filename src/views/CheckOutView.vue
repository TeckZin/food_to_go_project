<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import NavBar from "@/components/NavBar.vue"
import { auth } from "@/lib/firebase"
import {
  getCartTotal,
  getUserCart,
  type CartItem,
} from "@/helper/cartFunction"
import { clearUserCart, createOrder } from "@/helper/orderFunction"

const router = useRouter()

const cartItems = ref<CartItem[]>([])
const loading = ref(true)
const submitting = ref(false)
const errorMsg = ref("")
const successMsg = ref("")

const fullName = ref("")
const phoneNumber = ref("")

const street = ref("")
const apartment = ref("")
const city = ref("")
const state = ref("")
const postalCode = ref("")
const country = ref("United States")

const campusLocation = ref("")
const notes = ref("")

const total = computed(() => getCartTotal(cartItems.value))
const itemCount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.qty, 0),
)

const fullAddress = computed(() =>
  [
    street.value.trim(),
    apartment.value.trim(),
    city.value.trim(),
    state.value.trim(),
    postalCode.value.trim(),
    country.value.trim(),
  ]
    .filter(Boolean)
    .join(", "),
)

const mapSrc = computed(() => {
  const query = fullAddress.value || campusLocation.value.trim() || "Boston"
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
})

async function loadCheckout() {
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

    if (cartItems.value.length === 0) {
      router.push("/cart")
      return
    }
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to load checkout."
  } finally {
    loading.value = false
  }
}

function validateForm() {
  if (!fullName.value.trim()) return "Full name is required."
  if (!phoneNumber.value.trim()) return "Phone number is required."
  if (!street.value.trim()) return "Street address is required."
  if (!city.value.trim()) return "City is required."
  if (!state.value.trim()) return "State is required."
  if (!postalCode.value.trim()) return "Postal code is required."
  if (!country.value.trim()) return "Country is required."
  if (!campusLocation.value.trim()) return "Campus location is required."
  if (cartItems.value.length === 0) return "Your cart is empty."
  return ""
}

async function placeOrder() {
  const validationError = validateForm()
  if (validationError) {
    errorMsg.value = validationError
    return
  }

  try {
    submitting.value = true
    errorMsg.value = ""
    successMsg.value = ""

    const user = auth.currentUser
    if (!user) {
      router.push({ path: "/auth", query: { mode: "login" } })
      return
    }

    const orderId = await createOrder({
      userUid: user.uid,
      userEmail: user.email ?? "",
      fullName: fullName.value.trim(),
      phoneNumber: phoneNumber.value.trim(),
      address: fullAddress.value,
      campusLocation: campusLocation.value.trim(),
      notes: notes.value.trim(),
      items: cartItems.value.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: Number(item.price),
        imageUrl: "imageUrl" in item ? item.imageUrl : undefined,
      })),
    })

    await clearUserCart(user.uid)

    successMsg.value = "Order placed successfully."

    router.push({
      path: "/confirm",
      query: {
        orderId,
        fullName: fullName.value.trim(),
        total: total.value.toFixed(2),
        itemCount: String(itemCount.value),
      },
    })
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to place order."
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadCheckout()
})
</script>

<template>
  <div class="min-h-screen bg-[#272B34] text-white">
    <NavBar />

    <main class="mx-auto max-w-6xl px-6 py-10">
      <div class="mb-8">
        <h1 class="font-pragati text-4xl">Checkout</h1>
        <p class="mt-2 text-white/70">
          Enter your delivery details and confirm your order.
        </p>
      </div>

      <p v-if="loading" class="text-white/70">Loading checkout...</p>
      <p v-else-if="errorMsg" class="text-sm text-red-300">{{ errorMsg }}</p>

      <div v-else class="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section class="space-y-6 rounded-xl border border-white/10 bg-white/5 p-6">
          <div>
            <h2 class="font-pragati text-3xl">Delivery Information</h2>
            <p class="mt-1 text-white/60">Fill out your order details below.</p>
          </div>

          <div v-if="successMsg" class="text-sm text-green-300">
            {{ successMsg }}
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm text-white/70">Full Name</label>
              <input
                v-model="fullName"
                type="text"
                placeholder="Enter your full name"
                class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-white/70">Phone Number</label>
              <input
                v-model="phoneNumber"
                type="text"
                placeholder="Enter your phone number"
                class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              />
            </div>

            <div class="md:col-span-2">
              <label class="mb-2 block text-sm text-white/70">Street Address</label>
              <input
                v-model="street"
                type="text"
                placeholder="123 Main Street"
                class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-white/70">Apartment / Unit</label>
              <input
                v-model="apartment"
                type="text"
                placeholder="Apt 4B"
                class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-white/70">City</label>
              <input
                v-model="city"
                type="text"
                placeholder="Boston"
                class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-white/70">State</label>
              <input
                v-model="state"
                type="text"
                placeholder="MA"
                class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-white/70">Postal Code</label>
              <input
                v-model="postalCode"
                type="text"
                placeholder="02115"
                class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              />
            </div>

            <div class="md:col-span-2">
              <label class="mb-2 block text-sm text-white/70">Country</label>
              <input
                v-model="country"
                type="text"
                placeholder="United States"
                class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              />
            </div>

            <div class="md:col-span-2">
              <label class="mb-2 block text-sm text-white/70">Campus Location</label>
              <input
                v-model="campusLocation"
                type="text"
                placeholder="Example: Student Center, Library, Dorm Hall"
                class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              />
            </div>

            <div class="md:col-span-2">
              <label class="mb-2 block text-sm text-white/70">Map Preview</label>
              <div class="overflow-hidden rounded-xl border border-white/10 bg-white/10">
                <iframe
                  class="h-[320px] w-full"
                  :src="mapSrc"
                  loading="lazy"
                  allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <p class="mt-2 text-sm text-white/50">
                The map updates from the address you enter above.
              </p>
            </div>

            <div class="md:col-span-2">
              <label class="mb-2 block text-sm text-white/70">Notes</label>
              <textarea
                v-model="notes"
                rows="4"
                placeholder="Optional delivery notes"
                class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              />
            </div>
          </div>
        </section>

        <aside class="h-fit rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 class="font-pragati text-3xl">Order Summary</h2>

          <div class="mt-5 space-y-4">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex items-center justify-between gap-4 border-b border-white/10 pb-3"
            >
              <div>
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-sm text-white/60">
                  {{ item.qty }} × ${{ Number(item.price).toFixed(2) }}
                </p>
              </div>

              <p class="text-white/80">
                ${{ (item.qty * Number(item.price)).toFixed(2) }}
              </p>
            </div>
          </div>

          <div class="mt-6 space-y-2">
            <div class="flex items-center justify-between text-white/70">
              <span>Total Items</span>
              <span>{{ itemCount }}</span>
            </div>

            <div class="flex items-center justify-between text-xl">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <div class="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <p class="font-medium text-white">Delivery Address</p>
            <p class="mt-2">{{ fullAddress || "Address will appear here." }}</p>
            <p class="mt-2">
              <span class="text-white/60">Campus Location:</span>
              {{ campusLocation || "Not provided yet." }}
            </p>
          </div>

          <div class="mt-6 space-y-3">
            <button
              class="w-full rounded-md border border-white/10 bg-white/10 px-5 py-3 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="submitting"
              @click="placeOrder"
            >
              {{ submitting ? "Placing Order..." : "Place Order" }}
            </button>

            <button
              class="w-full rounded-md border border-white/10 bg-transparent px-5 py-3 text-white transition hover:bg-white/10"
              @click="router.push('/cart')"
            >
              Back to Cart
            </button>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>
