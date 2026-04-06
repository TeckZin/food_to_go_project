<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, nextTick } from "vue"
import { gsap } from "gsap"
import NavBar from "@/components/NavBar.vue"
import AddItemCard from "@/components/AddItemCard.vue"
import AddItemModal from "@/components/AddItemModal.vue"
import EditItemModal from "@/components/EditItemModal.vue"
import AddToCartModal from "@/components/AddToCartModal.vue"
import { getItems, type StoreItem } from "@/helper/itemsFunction"
import { watchRoleState } from "@/helper/roleFunction"

const pageRef = ref<HTMLElement | null>(null)

const items = ref<StoreItem[]>([])
const loading = ref(true)
const errorMsg = ref("")

const isAddModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isCartModalOpen = ref(false)

const selectedItem = ref<StoreItem | null>(null)
const selectedCartItem = ref<StoreItem | null>(null)

const canManageItems = ref(false)
const userRole = ref("")

let unsubscribeAuth: (() => void) | null = null
let ctx: gsap.Context | null = null

async function loadItems() {
  try {
    loading.value = true
    errorMsg.value = ""

    items.value = await getItems()
    await nextTick()

    if (ctx) ctx.revert()

    ctx = gsap.context(() => {
      gsap.from(".store-card", {
        opacity: 0,
        y: 60,
        scale: 0.85,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.15,
        clearProps: "transform,opacity",
      })
    }, pageRef.value as Element)
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to load items."
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  if (!canManageItems.value) return
  isAddModalOpen.value = true
}

function closeAddModal() {
  isAddModalOpen.value = false
}

async function handleCreated() {
  await loadItems()
  closeAddModal()
}

function openEditModal(item: StoreItem) {
  if (!canManageItems.value) return
  selectedItem.value = { ...item }
  isEditModalOpen.value = true
}

function closeEditModal() {
  isEditModalOpen.value = false
  selectedItem.value = null
}

async function handleUpdated() {
  await loadItems()
  closeEditModal()
}

function openCartModal(item: StoreItem) {
  selectedCartItem.value = { ...item }
  isCartModalOpen.value = true
}

function closeCartModal() {
  isCartModalOpen.value = false
  selectedCartItem.value = null
}

function handleAddedToCart() {
  closeCartModal()
}

onMounted(() => {
  unsubscribeAuth = watchRoleState((state) => {
    userRole.value = state.role
    canManageItems.value = state.canManageItems
  })

  loadItems()
})

onBeforeUnmount(() => {
  unsubscribeAuth?.()
  ctx?.revert()
})
</script>

<template>
  <div ref="pageRef" class="min-h-screen w-full overflow-x-hidden bg-[#272B34] text-white">
    <div class="relative z-[200] mb-10">
      <NavBar class="w-full" />
    </div>

    <section class="relative z-0 mx-auto w-full max-w-[1600px] px-6 py-10 md:px-10">
      <p v-if="loading" class="font-inter text-lg text-white/70">
        Loading items...
      </p>

      <p v-else-if="errorMsg" class="font-inter text-lg text-red-300">
        {{ errorMsg }}
      </p>

      <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div
          v-for="item in items"
          :key="item.id"
          class="store-card relative z-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#1F232B] shadow-[0_0.625rem_2.5rem_rgba(0,0,0,0.25)]"
        >
          <div class="relative border-b border-white/10 bg-[#303642] px-6 py-6">
            <div
              v-if="item.tag"
              class="absolute left-5 top-5 rounded-full border border-[#DBCFB0]/60 px-3 py-1 font-inter text-xs font-semibold tracking-[0.08em] text-[#DBCFB0]"
            >
              {{ item.tag }}
            </div>

            <div class="flex min-h-[20rem] items-center justify-center pt-10">
              <img
                :src="item.image_url"
                :alt="item.name"
                class="h-[15rem] w-[15rem] rounded-[1.5rem] object-cover shadow-lg"
              />
            </div>
          </div>

          <div class="px-6 py-6">
            <p class="font-inter text-sm font-semibold uppercase tracking-[0.2em] text-[#DBCFB0]">
              {{ item.category }}
            </p>

            <h2 class="mt-3 font-inter text-3xl font-bold text-white">
              {{ item.name }}
            </h2>

            <p class="mt-3 min-h-[4.5rem] font-inter text-base leading-7 text-white/70">
              {{ item.description }}
            </p>

            <p class="mt-2 font-inter text-sm text-white/50">
              {{ item.calories }} cal · Qty: {{ item.qty }}
            </p>

            <div class="mt-5 flex items-center gap-3 font-inter">
              <span
                v-if="item.old_price"
                class="text-2xl font-semibold text-white/35 line-through"
              >
                ${{ item.old_price.toFixed(2) }}
              </span>

              <span class="text-3xl font-bold text-[#DBCFB0]">
                ${{ item.price.toFixed(2) }}
              </span>
            </div>

            <button
              type="button"
              @click="openCartModal(item)"
              class="mt-6 w-full rounded-full bg-[#DBCFB0] px-6 py-4 font-inter text-sm font-extrabold uppercase tracking-[0.18em] text-[#272B34] transition hover:scale-[1.01]"
            >
              Order Now
            </button>

            <button
              v-if="canManageItems"
              type="button"
              @click="openEditModal(item)"
              class="mt-3 w-full rounded-full border border-white/15 px-6 py-4 font-inter text-sm font-extrabold uppercase tracking-[0.18em] text-white transition hover:bg-white/5"
            >
              Edit Item
            </button>

            <p
              class="mt-4 text-center font-inter text-sm font-medium uppercase tracking-[0.05em] text-white/50"
            >
              Fast pickup on campus
            </p>
          </div>
        </div>

        <AddItemCard :can-manage="canManageItems" @open="openAddModal" />
      </div>
    </section>

    <AddItemModal
      :open="isAddModalOpen"
      @close="closeAddModal"
      @created="handleCreated"
    />

    <EditItemModal
      v-if="selectedItem"
      :open="isEditModalOpen"
      :item="selectedItem"
      @close="closeEditModal"
      @updated="handleUpdated"
    />

    <AddToCartModal
      :is-open="isCartModalOpen"
      :item="
        selectedCartItem
          ? {
              id: selectedCartItem.id,
              name: selectedCartItem.name,
              price: selectedCartItem.price,
              imageUrl: selectedCartItem.image_url,
              category: selectedCartItem.category,
            }
          : null
      "
      @close="closeCartModal"
      @added="handleAddedToCart"
    />
  </div>
</template>
