<script setup lang="ts">
import { computed, ref } from "vue"
import { auth } from "@/lib/firebase"
import NavBar from "@/components/NavBar.vue"
import AccountSideComponent from "@/components/AccountSideComponent.vue"
import EditAccountComponent from "@/components/EditAccountComponent.vue"
import SettingComponent from "@/components/SettingComponent.vue"
import OrderAccountsComponent from "@/components/OrderAccountsComponent.vue"

type Tab = "edit" | "settings" | "orders"

const activeTab = ref<Tab>("edit")

const user = computed(() => auth.currentUser)

const displayName = computed<string>(() => {
  if (user.value?.displayName) return user.value.displayName
  if (user.value?.email) return user.value.email.split("@")[0] ?? "User"
  return "User"
})

const email = computed<string>(() => user.value?.email ?? "No email found")
const emailVerified = computed<boolean>(() => user.value?.emailVerified ?? false)

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
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
      <AccountSideComponent
        :display-name="displayName"
        :email="email"
        :email-verified="emailVerified"
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
        </div>

        <div class="mt-6 rounded-lg border border-white/10 bg-white/5 p-6">
          <EditAccountComponent
            v-if="activeTab === 'edit'"
            :display-name="displayName"
            :email="email"
          />

          <SettingComponent v-else-if="activeTab === 'settings'" />

          <OrderAccountsComponent v-else-if="activeTab === 'orders'" />
        </div>
      </section>
    </div>
  </main>
</template>
