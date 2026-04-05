<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue"
import { auth } from "@/lib/firebase"
import NavBar from "@/components/NavBar.vue"
import AccountSideComponent from "@/components/AccountSideComponent.vue"
import EditAccountComponent from "@/components/EditAccountComponent.vue"
import SettingComponent from "@/components/SettingComponent.vue"
import OrderAccountsComponent from "@/components/OrderAccountsComponent.vue"
import RolePermissionComponent from "@/components/RolePermissionComponent.vue"
import UsersTableComponent from "@/components/UsersTableComponent.vue"
import { watchRoleState, type UserRole } from "@/helper/roleFunction.ts"

type Tab = "edit" | "settings" | "orders" | "role-per" | "users"

const activeTab = ref<Tab>("edit")

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

    if (!state.canManageUsers && activeTab.value === "role-per") {
      activeTab.value = "edit"
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
    "px-2 py-2 text-2xl font-normal font-pragati cursor-pointer border-b-2 transition",
    activeTab.value === tab
      ? "text-white border-[#DBCFB0]"
      : "text-white/70 border-transparent hover:text-white",
  ].join(" ")
</script>

<template>
  <main class="min-h-screen bg-[#272B34]">
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
          <button :class="tabClass('edit')" @click="activeTab = 'edit'">
            EDIT ACCOUNT
          </button>

          <button :class="tabClass('settings')" @click="activeTab = 'settings'">
            SETTINGS
          </button>

          <button :class="tabClass('orders')" @click="activeTab = 'orders'">
            ORDERS
          </button>

          <button
            v-if="canManageUsers"
            :class="tabClass('role-per')"
            @click="activeTab = 'role-per'"
          >
            ROLE PER
          </button>
          <button
          v-if="canManageUsers"
          :class="tabClass('users')"
          @click="activeTab = 'users'"
        >
          USERS
        </button>
        </div>

        <div class="mt-6 rounded-lg border border-white/10 bg-white/5 p-6">
          <EditAccountComponent
            v-if="activeTab === 'edit'"
            :display-name="displayName"
            :email="email"
          />

          <SettingComponent v-else-if="activeTab === 'settings'" />

          <OrderAccountsComponent v-else-if="activeTab === 'orders'" />

          <RolePermissionComponent
            v-else-if="activeTab === 'role-per' && canManageUsers"
            :current-role="role"
            :can-view-users="isAdmin || isManager"
            :can-edit-users="isAdmin"
            :can-delete-users="isAdmin"
            :can-assign-roles="isAdmin"
            :can-reset-passwords="isAdmin"
          />
         <UsersTableComponent
            v-else-if="activeTab === 'users' && canManageUsers"
            :is-admin="isAdmin"
          />
        </div>
      </section>
    </div>
  </main>
</template>
