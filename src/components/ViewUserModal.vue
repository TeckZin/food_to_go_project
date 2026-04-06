<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

type UserRole = "admin" | "manager" | "customer" | ""
type TokenRole = UserRole | "loading..." | "unavailable"

type AppUser = {
  id: string
  displayName: string
  email: string
  phoneNumber: string
  firestoreRole: UserRole
  tokenRole: TokenRole
  status: string
}

const props = defineProps<{
  isOpen: boolean
  user: AppUser | null
  isAdmin?: boolean
}>()

const emit = defineEmits<{
  close: []
  edit: [user: AppUser]
  viewOrders: [user: AppUser]
}>()

const router = useRouter()

const canRender = computed(() => props.isOpen && !!props.user)

function closeModal() {
  emit("close")
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    closeModal()
  }
}

function editUser() {
  if (!props.user) return
  emit("edit", props.user)
}

function viewOrders() {
  if (!props.user) return
  emit("viewOrders", props.user)
}

function goToMoreDetail() {
  if (!props.user) return

  emit("close")
  router.push(`/manage-user/${props.user.id}`)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="canRender"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      @click="handleBackdropClick"
    >
      <div
        class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#272B34] p-6 text-white shadow-2xl"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-pragati text-3xl">View User</h3>
            <p class="mt-1 text-white/60">
              User details and account overview.
            </p>
          </div>

          <button
            class="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm transition hover:bg-white/20"
            @click="closeModal"
          >
            Close
          </button>
        </div>

        <div v-if="user" class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-lg border border-white/10 bg-white/5 p-4">
            <p class="text-sm text-white/60">Display Name</p>
            <p class="mt-1 text-lg">{{ user.displayName || "No name" }}</p>
          </div>

          <div class="rounded-lg border border-white/10 bg-white/5 p-4">
            <p class="text-sm text-white/60">Email</p>
            <p class="mt-1 break-all text-lg">{{ user.email || "No email" }}</p>
          </div>

          <div class="rounded-lg border border-white/10 bg-white/5 p-4">
            <p class="text-sm text-white/60">Phone Number</p>
            <p class="mt-1 text-lg">{{ user.phoneNumber || "No phone number" }}</p>
          </div>

          <div class="rounded-lg border border-white/10 bg-white/5 p-4">
            <p class="text-sm text-white/60">Status</p>
            <p class="mt-1 text-lg capitalize">{{ user.status || "active" }}</p>
          </div>

          <div class="rounded-lg border border-white/10 bg-white/5 p-4">
            <p class="text-sm text-white/60">Firestore Role</p>
            <p class="mt-1 text-lg capitalize">
              {{ user.firestoreRole || "customer" }}
            </p>
          </div>

          <div class="rounded-lg border border-white/10 bg-white/5 p-4">
            <p class="text-sm text-white/60">Token Role</p>
            <p class="mt-1 text-lg capitalize">{{ user.tokenRole }}</p>
          </div>

          <div
            v-if="
              user.tokenRole !== 'loading...' &&
              user.tokenRole !== 'unavailable' &&
              user.firestoreRole !== user.tokenRole
            "
            class="md:col-span-2 rounded-lg border border-yellow-400/20 bg-yellow-500/10 p-4 text-yellow-200"
          >
            Role mismatch between Firestore and token claims.
          </div>
        </div>

        <div v-if="user" class="mt-6 flex flex-wrap gap-3">
          <button
            class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
            @click="viewOrders"
          >
            View Orders
          </button>

          <button
            class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
            @click="goToMoreDetail"
          >
            More Detail
          </button>

          <button
            v-if="isAdmin"
            class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
            @click="editUser"
          >
            Edit User
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
