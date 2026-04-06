<script setup lang="ts">
import { onMounted, ref } from "vue"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  getAllUserTokenRoles,
  type UserRole,
} from "@/helper/roleFunction"
import OrderHistoryModal from "@/components/OrderHistoryModal.vue"
import ViewUserModal from "@/components/ViewUserModal.vue"
import EditUserModal from "@/components/EditUserModal.vue"

type AppUser = {
  id: string
  displayName: string
  email: string
  phoneNumber: string
  firestoreRole: UserRole
  tokenRole: UserRole | "loading..." | "unavailable" | ""
  status: string
}

const props = defineProps<{
  isAdmin: boolean
}>()

const users = ref<AppUser[]>([])
const loading = ref(true)
const errorMsg = ref("")
const successMsg = ref("")

const viewModalOpen = ref(false)
const editModalOpen = ref(false)
const orderModalOpen = ref(false)

const selectedUser = ref<AppUser | null>(null)
const selectedUserId = ref("")
const selectedUserName = ref("")

async function loadUsers() {
  loading.value = true
  errorMsg.value = ""
  successMsg.value = ""

  try {
    const snapshot = await getDocs(collection(db, "users"))

    users.value = snapshot.docs.map((snap) => {
      const data = snap.data()

      const firestoreRole: UserRole =
        data.role === "admin" || data.role === "manager" || data.role === "customer"
          ? data.role
          : "customer"

      return {
        id: snap.id,
        displayName: String(data.displayName ?? ""),
        email: String(data.email ?? ""),
        phoneNumber: String(data.phoneNumber ?? ""),
        firestoreRole,
        tokenRole: "loading...",
        status: String(data.status ?? "active"),
      }
    })
  } catch (e: any) {
    console.error("Failed to load Firestore users:", e)
    errorMsg.value = e?.message ?? "Failed to load Firestore users."
    users.value = []
    loading.value = false
    return
  }

  try {
    const tokenRolesMap = await getAllUserTokenRoles()

    users.value = users.value.map((user) => {
      const tokenRoleRaw = tokenRolesMap[user.id]?.role
      const tokenRole =
        tokenRoleRaw === "admin" ||
        tokenRoleRaw === "manager" ||
        tokenRoleRaw === "customer"
          ? tokenRoleRaw
          : ""

      return {
        ...user,
        tokenRole,
      }
    })
  } catch (e: any) {
    console.error("Failed to load token roles:", e)
    errorMsg.value =
      e?.message ??
      "Firestore users loaded, but token roles could not be loaded."

    users.value = users.value.map((user) => ({
      ...user,
      tokenRole: "unavailable",
    }))
  } finally {
    loading.value = false
  }
}

function openViewUser(user: AppUser) {
  selectedUser.value = user
  viewModalOpen.value = true
}

function closeViewUser() {
  viewModalOpen.value = false
}

function openEditUser(user: AppUser) {
  if (!props.isAdmin) return
  selectedUser.value = user
  editModalOpen.value = true
}

function closeEditUser() {
  editModalOpen.value = false
}

function openOrdersFromView(user?: AppUser) {
  const targetUser = user ?? selectedUser.value
  if (!targetUser) return

  selectedUserId.value = targetUser.id
  selectedUserName.value = targetUser.displayName || targetUser.email || "User"
  orderModalOpen.value = true
}

function closeOrders() {
  orderModalOpen.value = false
  selectedUserId.value = ""
  selectedUserName.value = ""
}

async function handleSaved() {
  successMsg.value = "User updated successfully."
  await loadUsers()

  if (selectedUser.value) {
    const updatedUser = users.value.find((user) => user.id === selectedUser.value?.id)
    if (updatedUser) {
      selectedUser.value = updatedUser
    }
  }

  closeEditUser()
}

async function handleUserDeleted(userId: string) {
  successMsg.value = "User deleted successfully."
  await loadUsers()

  if (selectedUser.value?.id === userId) {
    selectedUser.value = null
    closeEditUser()
    closeViewUser()
    closeOrders()
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="space-y-4 text-white">
    <div>
      <h2 class="text-3xl font-pragati">Users</h2>
      <p class="text-white/70">
        View all users. Only admins can edit, disable, reset password, or delete users.
      </p>
    </div>

    <p v-if="loading" class="text-white/70">Loading users...</p>
    <p v-if="errorMsg" class="text-sm text-red-300">{{ errorMsg }}</p>
    <p v-if="successMsg" class="text-sm text-green-300">{{ successMsg }}</p>

    <div v-if="!loading" class="space-y-3">
      <div
        v-for="user in users"
        :key="user.id"
        class="rounded-md border border-white/10 bg-white/5 p-4"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="grid gap-1">
            <p class="text-lg font-medium">{{ user.displayName || "No name" }}</p>
            <p class="text-white/60">{{ user.email || "No email" }}</p>
            <p class="text-white/60">Phone: {{ user.phoneNumber || "No phone number" }}</p>
            <p class="text-white/60">Firestore Role: {{ user.firestoreRole }}</p>
            <p class="text-white/60">Token Role: {{ user.tokenRole }}</p>
            <p class="text-white/60">Status: {{ user.status }}</p>

            <p
              v-if="
                user.tokenRole !== 'loading...' &&
                user.tokenRole !== 'unavailable' &&
                user.firestoreRole !== user.tokenRole
              "
              class="text-sm text-yellow-300"
            >
              Role mismatch between Firestore and token claims
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
              @click="openViewUser(user)"
            >
              View User
            </button>

            <button
              v-if="isAdmin"
              class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
              @click="openEditUser(user)"
            >
              Edit User
            </button>
          </div>
        </div>
      </div>

      <p v-if="users.length === 0" class="text-white/70">No users found.</p>
    </div>

    <ViewUserModal
      :is-open="viewModalOpen"
      :user="selectedUser"
      :is-admin="isAdmin"
      @close="closeViewUser"
      @edit="openEditUser"
      @view-orders="openOrdersFromView"
    />

    <EditUserModal
      :is-open="editModalOpen"
      :user="selectedUser"
      @close="closeEditUser"
      @saved="handleSaved"
      @deleted="handleUserDeleted"
    />

    <OrderHistoryModal
      :is-open="orderModalOpen"
      :user-id="selectedUserId"
      :user-name="selectedUserName"
      @close="closeOrders"
    />
  </div>
</template>
