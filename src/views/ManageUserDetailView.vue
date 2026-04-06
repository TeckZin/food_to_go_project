<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { doc, getDoc } from "firebase/firestore"
import NavBar from "@/components/NavBar.vue"
import { db } from "@/lib/firebase"
import {
  getAllUserTokenRoles,
  type UserRole,
} from "@/helper/roleFunction"
import OrderHistoryModal from "@/components/OrderHistoryModal.vue"
import EditUserModal from "@/components/EditUserModal.vue"

type AppUser = {
  id: string
  uid: string
  displayName: string
  email: string
  phoneNumber: string
  firestoreRole: UserRole
  tokenRole: UserRole | "loading..." | "unavailable" | ""
  status: string
}

const route = useRoute()
const router = useRouter()

const userId = computed(() => String(route.params.userId ?? ""))

const loading = ref(true)
const errorMsg = ref("")
const successMsg = ref("")

const user = ref<AppUser | null>(null)

const orderModalOpen = ref(false)
const editModalOpen = ref(false)

async function loadUser() {
  try {
    loading.value = true
    errorMsg.value = ""
    successMsg.value = ""

    if (!userId.value) {
      throw new Error("Missing user id.")
    }

    const userRef = doc(db, "users", userId.value)
    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
      throw new Error("User not found.")
    }

    const data = snapshot.data()

    const firestoreRole: UserRole =
      data.role === "admin" || data.role === "manager" || data.role === "customer"
        ? data.role
        : "customer"

    user.value = {
      id: snapshot.id,
      uid: String(data.uid ?? snapshot.id),
      displayName: String(data.displayName ?? ""),
      email: String(data.email ?? ""),
      phoneNumber: String(data.phoneNumber ?? ""),
      firestoreRole,
      tokenRole: "loading...",
      status: String(data.status ?? "active"),
    }

    try {
      const tokenRolesMap = await getAllUserTokenRoles()
      const tokenRoleRaw = tokenRolesMap[snapshot.id]?.role
      const tokenRole =
        tokenRoleRaw === "admin" ||
        tokenRoleRaw === "manager" ||
        tokenRoleRaw === "customer"
          ? tokenRoleRaw
          : ""

      if (user.value) {
        user.value = {
          ...user.value,
          tokenRole,
        }
      }
    } catch {
      if (user.value) {
        user.value = {
          ...user.value,
          tokenRole: "unavailable",
        }
      }
    }
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to load user."
    user.value = null
  } finally {
    loading.value = false
  }
}

function openOrders() {
  if (!user.value) return
  orderModalOpen.value = true
}

function closeOrders() {
  orderModalOpen.value = false
}

function openEditUser() {
  if (!user.value) return
  editModalOpen.value = true
}

function closeEditUser() {
  editModalOpen.value = false
}

async function handleSaved() {
  successMsg.value = "User updated successfully."
  await loadUser()
  closeEditUser()
}

async function handleDeleted() {
  successMsg.value = "User deleted successfully."
  closeEditUser()
  router.push("/manage")
}

onMounted(() => {
  loadUser()
})
</script>

<template>
  <main class="min-h-screen bg-[#272B34] text-white">
    <div class="mb-10">
      <NavBar class="w-full" />
    </div>

    <section class="mx-auto max-w-6xl px-4 pb-10">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="font-pragati text-4xl">User Detail</h1>
          <p class="mt-2 text-white/70">
            View full account details and manage this user.
          </p>
        </div>

        <button
          class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
          @click="router.push('/manage')"
        >
          Back to Manage
        </button>
      </div>

      <p v-if="loading" class="text-white/70">Loading user...</p>
      <p v-else-if="errorMsg" class="text-sm text-red-300">{{ errorMsg }}</p>
      <p v-if="successMsg" class="mb-4 text-sm text-green-300">{{ successMsg }}</p>

      <div
        v-if="!loading && user"
        class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div class="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div>
            <h2 class="font-pragati text-3xl">
              {{ user.displayName || "No name" }}
            </h2>
            <p class="mt-1 break-all text-white/60">
              {{ user.email || "No email" }}
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg border border-white/10 bg-black/10 p-4">
              <p class="text-sm text-white/60">Phone Number</p>
              <p class="mt-1 text-lg">{{ user.phoneNumber || "No phone number" }}</p>
            </div>

            <div class="rounded-lg border border-white/10 bg-black/10 p-4">
              <p class="text-sm text-white/60">Status</p>
              <p class="mt-1 text-lg capitalize">{{ user.status }}</p>
            </div>

            <div class="rounded-lg border border-white/10 bg-black/10 p-4">
              <p class="text-sm text-white/60">Firestore Role</p>
              <p class="mt-1 text-lg capitalize">{{ user.firestoreRole }}</p>
            </div>

            <div class="rounded-lg border border-white/10 bg-black/10 p-4">
              <p class="text-sm text-white/60">Token Role</p>
              <p class="mt-1 text-lg capitalize">{{ user.tokenRole }}</p>
            </div>
          </div>
        </div>

        <aside class="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 class="font-pragati text-3xl">Actions</h2>

          <button
            class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-left text-white transition hover:bg-white/20"
            @click="openOrders"
          >
            View Orders
          </button>

          <button
            class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-left text-white transition hover:bg-white/20"
            @click="openEditUser"
          >
            Edit User
          </button>
        </aside>
      </div>
    </section>

    <OrderHistoryModal
      :is-open="orderModalOpen"
      :user-id="user?.id ?? ''"
      :user-uid="user?.uid ?? ''"
      :user-name="user?.displayName || user?.email || 'User'"
      @close="closeOrders"
    />

    <EditUserModal
      :is-open="editModalOpen"
      :user="user"
      @close="closeEditUser"
      @saved="handleSaved"
      @deleted="handleDeleted"
    />
  </main>
</template>
