<script setup lang="ts">
import { computed, ref, watch } from "vue"
import {
  ItemCategory,
  ItemTag,
  createItem,
  type ItemCategory as ItemCategoryType,
  type ItemTag as ItemTagType,
} from "@/helper/itemsFunction"

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "created"): void
}>()

const saving = ref(false)
const errorMsg = ref("")
const successMsg = ref("")

const form = ref({
  name: "",
  category: ItemCategory.BURGERS as ItemCategoryType,
  description: "",
  price: 0,
  calories: 0,
  qty: 0,
  old_price: undefined as number | undefined,
  tag: "" as "" | ItemTagType,
})

const categories = Object.values(ItemCategory)
const tags = Object.values(ItemTag)

const canSubmit = computed(() => {
  return (
    form.value.name.trim().length > 0 &&
    form.value.description.trim().length > 0 &&
    Number(form.value.price) > 0 &&
    Number(form.value.calories) >= 0 &&
    Number(form.value.qty) >= 0
  )
})

function resetForm() {
  form.value = {
    name: "",
    category: ItemCategory.BURGERS,
    description: "",
    price: 0,
    calories: 0,
    qty: 0,
    old_price: undefined,
    tag: "",
  }
  errorMsg.value = ""
  successMsg.value = ""
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      errorMsg.value = ""
      successMsg.value = ""
    }
  }
)

function closeModal() {
  if (saving.value) return
  resetForm()
  emit("close")
}

async function submitItem() {
  try {
    errorMsg.value = ""
    successMsg.value = ""
    saving.value = true

    await createItem({
      name: form.value.name.trim(),
      category: form.value.category,
      description: form.value.description.trim(),
      price: Number(form.value.price),
      calories: Number(form.value.calories),
      qty: Number(form.value.qty),
      old_price:
        form.value.old_price != null && form.value.old_price !== 0
          ? Number(form.value.old_price)
          : undefined,
      tag: form.value.tag || undefined,
    })

    successMsg.value = "Item created successfully."
    emit("created")
    closeModal()
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to create item."
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    @click.self="closeModal"
  >
    <div
      class="max-h-[90vh] w-full max-w-[42rem] overflow-y-auto rounded-[2rem] border border-white/10 bg-[#1F232B] p-8 shadow-2xl"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="font-inter text-sm font-semibold uppercase tracking-[0.2em] text-[#DBCFB0]">
            Admin / Manager
          </p>
          <h2 class="mt-2 font-inter text-3xl font-bold text-white">
            Create New Item
          </h2>
        </div>

        <button
          @click="closeModal"
          class="rounded-full border border-white/15 px-4 py-2 font-inter text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          Close
        </button>
      </div>

      <p v-if="errorMsg" class="mt-5 rounded-xl bg-red-500/10 px-4 py-3 font-inter text-sm text-red-300">
        {{ errorMsg }}
      </p>

      <p v-if="successMsg" class="mt-5 rounded-xl bg-green-500/10 px-4 py-3 font-inter text-sm text-green-300">
        {{ successMsg }}
      </p>

      <div class="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="mb-2 block font-inter text-sm font-semibold text-white/80">
            Item Name
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Cheese Burger"
            class="w-full rounded-2xl border border-white/10 bg-[#303642] px-5 py-4 font-inter text-white outline-none placeholder:text-white/35 focus:border-[#DBCFB0]"
          />
        </div>

        <div>
          <label class="mb-2 block font-inter text-sm font-semibold text-white/80">
            Category
          </label>
          <select
            v-model="form.category"
            class="w-full rounded-2xl border border-white/10 bg-[#303642] px-5 py-4 font-inter text-white outline-none focus:border-[#DBCFB0]"
          >
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block font-inter text-sm font-semibold text-white/80">
            Tag
          </label>
          <select
            v-model="form.tag"
            class="w-full rounded-2xl border border-white/10 bg-[#303642] px-5 py-4 font-inter text-white outline-none focus:border-[#DBCFB0]"
          >
            <option value="">none</option>
            <option v-for="tag in tags" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="mb-2 block font-inter text-sm font-semibold text-white/80">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Write item description..."
            class="w-full rounded-2xl border border-white/10 bg-[#303642] px-5 py-4 font-inter text-white outline-none placeholder:text-white/35 focus:border-[#DBCFB0]"
          />
        </div>

        <div>
          <label class="mb-2 block font-inter text-sm font-semibold text-white/80">
            Price
          </label>
          <input
            v-model.number="form.price"
            type="number"
            min="0"
            step="0.01"
            class="w-full rounded-2xl border border-white/10 bg-[#303642] px-5 py-4 font-inter text-white outline-none focus:border-[#DBCFB0]"
          />
        </div>

        <div>
          <label class="mb-2 block font-inter text-sm font-semibold text-white/80">
            Old Price
          </label>
          <input
            v-model.number="form.old_price"
            type="number"
            min="0"
            step="0.01"
            class="w-full rounded-2xl border border-white/10 bg-[#303642] px-5 py-4 font-inter text-white outline-none focus:border-[#DBCFB0]"
          />
        </div>

        <div>
          <label class="mb-2 block font-inter text-sm font-semibold text-white/80">
            Calories
          </label>
          <input
            v-model.number="form.calories"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-white/10 bg-[#303642] px-5 py-4 font-inter text-white outline-none focus:border-[#DBCFB0]"
          />
        </div>

        <div>
          <label class="mb-2 block font-inter text-sm font-semibold text-white/80">
            Quantity
          </label>
          <input
            v-model.number="form.qty"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-white/10 bg-[#303642] px-5 py-4 font-inter text-white outline-none focus:border-[#DBCFB0]"
          />
        </div>
      </div>

      <div class="mt-8 flex gap-4">
        <button
          @click="closeModal"
          type="button"
          class="w-1/2 rounded-full border border-white/15 px-6 py-4 font-inter text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/5"
        >
          Cancel
        </button>

        <button
          @click="submitItem"
          :disabled="!canSubmit || saving"
          type="button"
          class="w-1/2 rounded-full bg-[#DBCFB0] px-6 py-4 font-inter text-sm font-extrabold uppercase tracking-[0.18em] text-[#272B34] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ saving ? "Saving..." : "Create Item" }}
        </button>
      </div>
    </div>
  </div>
</template>
