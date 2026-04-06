<script setup lang="ts">
import { onMounted, ref } from "vue"
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  getAllUserTokenRoles,
  setTargetUserRole,
  type UserRole,
} from "@/helper/roleFunction"

type AppUser = {
  id: string
  displayName: string
  email: string
  firestoreRole: UserRole
  tokenRole: UserRole | "loading..." | "unavailable"
  status: string
}

const props = defineProps<{
  isAdmin: boolean
}>()

const users = ref<AppUser[]>([])
const loading = ref(true)
const errorMsg = ref("")
const successMsg = ref("")

const editingUserId = ref("")
const editDisplayName = ref("")
const editRole = ref<UserRole>("")
const editStatus = ref("")

async function loadUsers() {
  loading.value = true
  errorMsg.value = ""
  successMsg.value = ""

  try {
    const snapshot = await getDocs(collection(db, "users"))

    users.value = snapshot.docs.map((snap) => {
      const data = snap.data()
      const firestoreRole =
        data.role === "admin" || data.role === "manager" || data.role === "customer"
          ? data.role
          : "customer"

      return {
        id: snap.id,
        displayName: data.displayName ?? "",
        email: data.email ?? "",
        firestoreRole,
        tokenRole: "loading...",
        status: data.status ?? "active",
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

function startEdit(user: AppUser) {
  if (!props.isAdmin) return

  editingUserId.value = user.id
  editDisplayName.value = user.displayName
  editRole.value =
    user.firestoreRole === "admin" ||
    user.firestoreRole === "manager" ||
    user.firestoreRole === "customer"
      ? user.firestoreRole
      : "customer"
  editStatus.value = user.status
  successMsg.value = ""
  errorMsg.value = ""
}

function cancelEdit() {
  editingUserId.value = ""
  editDisplayName.value = ""
  editRole.value = ""
  editStatus.value = ""
}

async function saveUser(userId: string) {
  if (!props.isAdmin) return

  try {
    errorMsg.value = ""
    successMsg.value = ""

    const existingUser = users.value.find((user) => user.id === userId)
    if (!existingUser) {
      throw new Error("User not found.")
    }

    await updateDoc(doc(db, "users", userId), {
      displayName: editDisplayName.value.trim(),
      status: editStatus.value,
      updatedAt: serverTimestamp(),
    })

    if (existingUser.firestoreRole !== editRole.value) {
      await setTargetUserRole(userId, editRole.value)
    }

    successMsg.value = "User updated successfully."
    cancelEdit()
    await loadUsers()
  } catch (e: any) {
    console.error("Failed to update user:", e)
    errorMsg.value = e?.message ?? "Failed to update user."
  }
}

async function removeUser(userId: string) {
  if (!props.isAdmin) return

  const confirmed = window.confirm("Are you sure you want to delete this user?")
  if (!confirmed) return

  try {
    errorMsg.value = ""
    successMsg.value = ""

    await deleteDoc(doc(db, "users", userId))
    successMsg.value = "User deleted successfully."

    await loadUsers()
  } catch (e: any) {
    console.error("Failed to delete user:", e)
    errorMsg.value = e?.message ?? "Failed to delete user."
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
        View all users. Only admins can edit or delete users.
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
        <div
          v-if="editingUserId !== user.id"
          class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="grid gap-1">
            <p class="text-lg font-medium">{{ user.displayName || "No name" }}</p>
            <p class="text-white/60">{{ user.email || "No email" }}</p>
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
              v-if="isAdmin"
              class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
              @click="startEdit(user)"
            >
              Edit
            </button>

            <button
              v-if="isAdmin"
              class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
              @click="removeUser(user.id)"
            >
              Delete
            </button>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="grid gap-3 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm text-white/70">Display Name</label>
              <input
                v-model="editDisplayName"
                type="text"
                class="w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm text-white/70">Role</label>
              <select
                v-model="editRole"
                class="w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
              >
                <option value="customer">customer</option>
                <option value="manager">manager</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm text-white/70">Status</label>
              <select
                v-model="editStatus"
                class="w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
              >
                <option value="active">active</option>
                <option value="disabled">disabled</option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
              @click="saveUser(user.id)"
            >
              Save
            </button>

            <button
              class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
              @click="cancelEdit"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <p v-if="users.length === 0" class="text-white/70">No users found.</p>
    </div>
  </div>
</template>
