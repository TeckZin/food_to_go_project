<script setup lang="ts">
import { onMounted, ref } from "vue"
import { auth } from "@/lib/firebase"
import { getUserSettings, updateUserSettings } from "@/helper/userFunction"

const fullName = ref("")
const phoneNumber = ref("")
const deliveryAddress = ref("")
const campusLocation = ref("")

const notifications = ref(true)
const marketingEmails = ref(false)
const darkMode = ref(true)

const loading = ref(true)
const successMsg = ref("")
const errorMsg = ref("")

onMounted(async () => {
  try {
    loading.value = true
    errorMsg.value = ""
    successMsg.value = ""

    const user = auth.currentUser
    if (!user) throw new Error("No signed-in user found.")

    const settings = await getUserSettings(user.uid)

    if (settings) {
      fullName.value = settings.displayName
      phoneNumber.value = settings.phoneNumber
      deliveryAddress.value = settings.deliveryAddress
      campusLocation.value = settings.campusLocation
      notifications.value = settings.notifications
      marketingEmails.value = settings.marketingEmails
      darkMode.value = settings.darkMode
    }
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to load settings."
  } finally {
    loading.value = false
  }
})

async function saveSettings() {
  try {
    errorMsg.value = ""
    successMsg.value = ""

    const user = auth.currentUser
    if (!user) throw new Error("No signed-in user found.")

    await updateUserSettings(user.uid, {
      displayName: fullName.value,
      phoneNumber: phoneNumber.value,
      deliveryAddress: deliveryAddress.value,
      campusLocation: campusLocation.value,
      notifications: notifications.value,
      marketingEmails: marketingEmails.value,
      darkMode: darkMode.value,
    })

    successMsg.value = "Settings saved."
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to save settings."
  }
}
</script>

<template>
  <div class="space-y-4 text-white">
    <h2 class="text-3xl font-pragati">Settings</h2>
    <p class="text-white/70">Manage your account preferences.</p>

    <p v-if="loading" class="text-white/70">Loading settings...</p>
    <p v-else-if="errorMsg" class="text-sm text-red-300">{{ errorMsg }}</p>

    <div v-else class="space-y-4">
      <div class="rounded-md border border-white/10 bg-white/5 p-4">
        <label class="mb-2 block text-white/70">Full Name</label>
        <input
          v-model="fullName"
          type="text"
          placeholder="Enter your full name"
          class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
        />
      </div>

      <div class="rounded-md border border-white/10 bg-white/5 p-4">
        <label class="mb-2 block text-white/70">Phone Number</label>
        <input
          v-model="phoneNumber"
          type="text"
          placeholder="Enter your phone number"
          class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
        />
      </div>

      <div class="rounded-md border border-white/10 bg-white/5 p-4">
        <label class="mb-2 block text-white/70">Delivery Address</label>
        <input
          v-model="deliveryAddress"
          type="text"
          placeholder="Enter your delivery address"
          class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
        />
      </div>

      <div class="rounded-md border border-white/10 bg-white/5 p-4">
        <label class="mb-2 block text-white/70">Campus / Building</label>
        <input
          v-model="campusLocation"
          type="text"
          placeholder="Example: Student Center"
          class="w-full rounded-md border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
        />
      </div>

      <label class="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-4 py-3">
        <span>Email Notifications</span>
        <input v-model="notifications" type="checkbox" class="h-4 w-4" />
      </label>

      <label class="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-4 py-3">
        <span>Marketing Emails</span>
        <input v-model="marketingEmails" type="checkbox" class="h-4 w-4" />
      </label>

      <label class="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-4 py-3">
        <span>Dark Mode</span>
        <input v-model="darkMode" type="checkbox" class="h-4 w-4" />
      </label>

      <div class="flex items-center gap-4">
        <button
          class="rounded-md border border-white/10 bg-white/10 px-5 py-3 text-white transition hover:bg-white/20"
          @click="saveSettings"
        >
          Save Settings
        </button>

        <p v-if="successMsg" class="text-sm text-green-300">
          {{ successMsg }}
        </p>
      </div>
    </div>
  </div>
</template>
