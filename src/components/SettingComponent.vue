<script setup lang="ts">
import { ref } from "vue"

const notifications = ref(true)
const marketingEmails = ref(false)
const darkMode = ref(true)
</script>

<template>
  <div class="space-y-4 text-white">
    <h2 class="text-3xl font-pragati">Settings</h2>
    <p class="text-white/70">Manage your account preferences.</p>

    <div class="space-y-4">
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
    </div>
  </div>
</template>
