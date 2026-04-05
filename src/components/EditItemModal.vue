<script setup lang="ts">
import { computed, ref, watch } from "vue"
import {
  ItemCategory,
  ItemTag,
  updateItem,
  deleteItem,
  type StoreItem,
  type ItemCategory as ItemCategoryType,
  type ItemTag as ItemTagType,
} from "@/helper/itemsFunction"


const props = defineProps<{
  open: boolean
  item: StoreItem | null
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "updated"): void
}>()

const saving = ref(false)
const deleting = ref(false)
const errorMsg = ref("")
const imageFile = ref<File | null>(null)
const imagePreview = ref("")

const localItem = ref<StoreItem | null>(null)

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
    !!localItem.value &&
    form.value.name.trim().length > 0 &&
    form.value.description.trim().length > 0 &&
    Number(form.value.price) > 0 &&
    Number(form.value.calories) >= 0 &&
    Number(form.value.qty) >= 0
  )
})
async function submitDelete() {
  if (!localItem.value) return

  const confirmed = window.confirm(`Delete "${localItem.value.name}"?`)
  if (!confirmed) return

  try {
    errorMsg.value = ""
    deleting.value = true

    await deleteItem(localItem.value.id)

    emit("updated")
    emit("close")
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to delete item."
  } finally {
    deleting.value = false
  }
}

function clearPreview() {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = ""
}

function resetFormFromItem(item: StoreItem) {
  localItem.value = item

  form.value = {
    name: item.name ?? "",
    category: item.category ?? ItemCategory.BURGERS,
    description: item.description ?? "",
    price: Number(item.price ?? 0),
    calories: Number(item.calories ?? 0),
    qty: Number(item.qty ?? 0),
    old_price: item.old_price ?? undefined,
    tag: (item.tag ?? "") as "" | ItemTagType,
  }

  imageFile.value = null
  clearPreview()
  errorMsg.value = ""
}

watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      resetFormFromItem(newItem)
    } else {
      localItem.value = null
    }
  },
  { immediate: true }
)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      imageFile.value = null
      clearPreview()
      errorMsg.value = ""
    }
  }
)

function closeModal() {
  if (saving.value) return
  emit("close")
}

function onImageChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null

  clearPreview()
  errorMsg.value = ""
  imageFile.value = null

  if (!file) return

  if (!file.type.startsWith("image/")) {
    errorMsg.value = "Please choose a valid image file."
    return
  }

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function removeImageSelection() {
  imageFile.value = null
  clearPreview()
}

async function submitUpdate() {
  if (!localItem.value) return

  try {
    errorMsg.value = ""
    saving.value = true

    await updateItem(localItem.value.id, {
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
      imageFile: imageFile.value,
    })

    emit("updated")
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to update item."
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div
    v-if="open && localItem"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
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
            Edit Item
          </h2>
        </div>

        <button
          type="button"
          @click="closeModal"
          class="rounded-full border border-white/15 px-4 py-2 font-inter text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          Close
        </button>
      </div>

      <p
        v-if="errorMsg"
        class="mt-5 rounded-xl bg-red-500/10 px-4 py-3 font-inter text-sm text-red-300"
      >
        {{ errorMsg }}
      </p>

      <div class="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="mb-2 block font-inter text-sm font-semibold text-white/80">
            Item Name
          </label>
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-2xl border border-white/10 bg-[#303642] px-5 py-4 font-inter text-white outline-none focus:border-[#DBCFB0]"
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
            class="w-full rounded-2xl border border-white/10 bg-[#303642] px-5 py-4 font-inter text-white outline-none focus:border-[#DBCFB0]"
          ></textarea>
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

        <div class="md:col-span-2">
          <label class="mb-2 block font-inter text-sm font-semibold text-white/80">
            Replace Image
          </label>

          <input
            type="file"
            accept="image/*"
            @change="onImageChange"
            class="w-full rounded-2xl border border-white/10 bg-[#303642] px-5 py-4 font-inter text-white file:mr-4 file:rounded-full file:border-0 file:bg-[#DBCFB0] file:px-4 file:py-2 file:font-semibold file:text-[#272B34]"
          />

          <p class="mt-2 font-inter text-sm text-white/50">
            Leave empty to keep the current image.
          </p>

          <img
            v-if="imagePreview"
            :src="imagePreview"
            alt="Preview"
            class="mt-4 h-[14rem] w-full rounded-[1rem] object-cover"
          />

          <button
            v-if="imagePreview"
            type="button"
            @click="removeImageSelection"
            class="mt-4 rounded-full border border-white/15 px-4 py-2 font-inter text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Remove New Image
          </button>
        </div>
      </div>

      <div class="sticky bottom-0 mt-8 flex flex-col gap-4 border-t border-white/10 bg-[#1F232B] pt-6">
  <div class="flex gap-4">
    <button
      type="button"
      @click="closeModal"
      :disabled="saving || deleting"
      class="w-1/2 rounded-full border border-white/15 px-6 py-4 font-inter text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Cancel
    </button>

    <button
      type="button"
      @click="submitUpdate"
      :disabled="!canSubmit || saving || deleting"
      class="w-1/2 rounded-full bg-[#DBCFB0] px-6 py-4 font-inter text-sm font-extrabold uppercase tracking-[0.18em] text-[#272B34] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {{ saving ? "Saving..." : "Save Changes" }}
    </button>
  </div>

  <button
    type="button"
    @click="submitDelete"
    :disabled="saving || deleting"
    class="w-full rounded-full border border-red-400/30 px-6 py-4 font-inter text-sm font-extrabold uppercase tracking-[0.18em] text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {{ deleting ? "Deleting..." : "Delete Item" }}
  </button>
</div>
    </div>
  </div>
</template>
