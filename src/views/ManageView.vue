<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { auth } from "@/lib/firebase"
import NavBar from "@/components/NavBar.vue"
import AccountSideComponent from "@/components/AccountSideComponent.vue"
import RolePermissionComponent from "@/components/RolePermissionComponent.vue"
import UsersTableComponent from "@/components/UsersTableComponent.vue"
import ManageOrdersTableComponent from "@/components/ManageOrdersTableComponent.vue"
import { watchRoleState, type UserRole } from "@/helper/roleFunction"

type Tab = "role-per" | "users" | "orders"

const activeTab = ref<Tab>("users")
const router = useRouter()

const user = computed(() => auth.currentUser)

const displayName = computed<string>(() => {
  if (user.value?.displayName) return user.value.displayName
  if (user.value?.email) return user.value.email.split("@")[0] ?? "User"
  return "User"
})

const email = computed<string>(() => user.value?.email ?? "No email found")
const emailVerified = computed<boolean>(() => user.value?.emailVerified ?? false)

const role = ref<UserRole>("")
const claimsLoading = ref(true)
const claimsError = ref("")

const isAdmin = computed(() => role.value === "admin")
const isManager = computed(() => role.value === "manager")
const canManageUsers = computed(() => isAdmin.value || isManager.value)

let unsubscribeAuth: (() => void) | null = null

onMounted(() => {
  claimsLoading.value = true
  claimsError.value = ""

  unsubscribeAuth = watchRoleState((state) => {
    role.value = state.role
    claimsLoading.value = false
    claimsError.value = ""

    if (!state.canManageUsers) {
      router.replace("/account")
    }
  })
})

onBeforeUnmount(() => {
  if (unsubscribeAuth) unsubscribeAuth()
})

const roleLabel = computed(() => {
  if (!role.value) return "No role set"
  return role.value.charAt(0).toUpperCase() + role.value.slice(1)
})

const tabClass = (tab: Tab) =>
  [
    "px-2 py-2 text-lg sm:text-2xl font-normal font-pragati cursor-pointer border-b-2 transition",
    activeTab.value === tab
      ? "text-white border-[#DBCFB0]"
      : "text-white/70 border-transparent hover:text-white",
  ].join(" ")
</script>

<template>
  <main v-if="canManageUsers" class="min-h-screen bg-[#272B34]">
    <div class="mb-10">
      <NavBar class="w-full" />
    </div>

    <div class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-10 lg:flex-row">
      <AccountSideComponent
        :display-name="displayName"
        :email="email"
        :email-verified="emailVerified"
        :role="roleLabel"
        :claims-loading="claimsLoading"
        :claims-error="claimsError"
      />

      <section class="w-full flex-1">
        <div class="flex flex-wrap gap-6 border-b border-white/10 pb-3">
          <button :class="tabClass('users')" @click="activeTab = 'users'">
            USERS
          </button>

          <button :class="tabClass('orders')" @click="activeTab = 'orders'">
            ORDERS
          </button>

          <button :class="tabClass('role-per')" @click="activeTab = 'role-per'">
            ROLE PER
          </button>
        </div>

        <div class="mt-6 rounded-lg border border-white/10 bg-white/5 p-6">
          <UsersTableComponent
            v-if="activeTab === 'users'"
            :is-admin="isAdmin"
          />

          <ManageOrdersTableComponent
            v-else-if="activeTab === 'orders'"
            :is-admin="isAdmin"
            :is-manager="isManager"
          />

          <RolePermissionComponent
            v-else-if="activeTab === 'role-per'"
            :current-role="role"
            :can-view-users="isAdmin || isManager"
            :can-edit-users="isAdmin"
            :can-delete-users="isAdmin"
            :can-assign-roles="isAdmin"
            :can-reset-passwords="isAdmin"
          />
        </div>
      </section>
    </div>
  </main>

  <main v-else class="min-h-screen bg-[#272B34] text-white">
    <div class="mb-10">
      <NavBar class="w-full" />
    </div>

    <div class="mx-auto max-w-4xl px-4 pb-10">
      <div class="rounded-lg border border-white/10 bg-white/5 p-6">
        <h1 class="text-3xl font-pragati">Manage</h1>
        <p class="mt-3 text-white/70">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  </main>
</template>
