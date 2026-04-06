<script setup lang="ts">
import { computed, ref, watch } from "vue"
import {
  setTargetUserRole,
  updateTargetUserAccount,
  generateTargetUserPasswordReset,
  deleteTargetUserAccount,
} from "@/helper/roleFunction"

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
}>()

const emit = defineEmits<{
  close: []
  saved: []
  deleted: [userId: string]
}>()

const submitting = ref(false)
const deleting = ref(false)
const resettingPassword = ref(false)
const errorMsg = ref("")
const successMsg = ref("")

const displayName = ref("")
const phoneNumber = ref("")
const role = ref<UserRole>("customer")
const status = ref("active")

const canRender = computed(() => props.isOpen && !!props.user)

watch(
  () => props.user,
  (user) => {
    displayName.value = user?.displayName ?? ""
    phoneNumber.value = user?.phoneNumber ?? ""
    role.value = user?.firestoreRole || "customer"
    status.value = user?.status || "active"
    errorMsg.value = ""
    successMsg.value = ""
  },
  { immediate: true },
)

function closeModal() {
  if (submitting.value || deleting.value || resettingPassword.value) return
  emit("close")
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    closeModal()
  }
}

async function saveUser() {
  if (!props.user) return

  try {
    submitting.value = true
    errorMsg.value = ""
    successMsg.value = ""

    await updateTargetUserAccount({
      uid: props.user.id,
      displayName: displayName.value.trim(),
      phoneNumber: phoneNumber.value.trim(),
      disabled: status.value === "disabled",
    })

    if (props.user.firestoreRole !== role.value) {
      await setTargetUserRole(props.user.id, role.value)
    }

    successMsg.value = "User updated successfully."
    emit("saved")
  } catch (e: any) {
    console.error("Failed to update user:", e)
    errorMsg.value = e?.message ?? "Failed to update user."
  } finally {
    submitting.value = false
  }
}

async function resetPassword() {
  if (!props.user) return

  try {
    resettingPassword.value = true
    errorMsg.value = ""
    successMsg.value = ""

    const result = await generateTargetUserPasswordReset(props.user.id)
    successMsg.value = `Password reset link created for ${result.email}`
    console.log("Reset link:", result.resetLink)
  } catch (e: any) {
    console.error("Failed to reset password:", e)
    errorMsg.value = e?.message ?? "Failed to generate password reset link."
  } finally {
    resettingPassword.value = false
  }
}

async function removeUser() {
  if (!props.user) return

  const confirmed = window.confirm("Are you sure you want to delete this user?")
  if (!confirmed) return

  try {
    deleting.value = true
    errorMsg.value = ""
    successMsg.value = ""

    await deleteTargetUserAccount(props.user.id)
    emit("deleted", props.user.id)
  } catch (e: any) {
    console.error("Failed to delete user:", e)
    errorMsg.value = e?.message ?? "Failed to delete user."
  } finally {
    deleting.value = false
  }
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
            <h3 class="font-pragati text-3xl">Edit User</h3>
            <p class="mt-1 text-white/60">
              Update account info, role, status, and password access.
            </p>
          </div>

          <button
            class="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm transition hover:bg-white/20"
            @click="closeModal"
          >
            Close
          </button>
        </div>

        <div v-if="user" class="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
          <p class="text-sm text-white/60">Editing</p>
          <p class="mt-1 text-lg">{{ user.displayName || "No name" }}</p>
          <p class="text-white/60">{{ user.email || "No email" }}</p>
        </div>

        <p v-if="errorMsg" class="mt-4 text-sm text-red-300">{{ errorMsg }}</p>
        <p v-if="successMsg" class="mt-4 text-sm text-green-300">{{ successMsg }}</p>

        <div class="mt-6 grid gap-3 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm text-white/70">Display Name</label>
            <input
              v-model="displayName"
              type="text"
              class="w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-white/70">Phone Number</label>
            <input
              v-model="phoneNumber"
              type="text"
              placeholder="+16175551234"
              class="w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-white/70">Role</label>
            <select
              v-model="role"
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
              v-model="status"
              class="w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
            >
              <option value="active">active</option>
              <option value="disabled">disabled</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <button
            class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20 disabled:opacity-60"
            :disabled="submitting || deleting || resettingPassword"
            @click="saveUser"
          >
            {{ submitting ? "Saving..." : "Save" }}
          </button>

          <button
            class="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20 disabled:opacity-60"
            :disabled="submitting || deleting || resettingPassword"
            @click="resetPassword"
          >
            {{ resettingPassword ? "Generating..." : "Reset Password" }}
          </button>

          <button
            class="rounded-md border border-red-400/20 bg-red-500/10 px-4 py-2 text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
            :disabled="submitting || deleting || resettingPassword"
            @click="removeUser"
          >
            {{ deleting ? "Deleting..." : "Delete User" }}
          </button>

          <button
            class="rounded-md border border-white/10 bg-transparent px-4 py-2 text-white transition hover:bg-white/10 disabled:opacity-60"
            :disabled="submitting || deleting || resettingPassword"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
