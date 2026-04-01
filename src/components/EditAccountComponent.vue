<script setup lang="ts">
import { ref, watch } from "vue"

const props = defineProps<{
  displayName: string
  email: string
}>()

const name = ref(props.displayName)
const userEmail = ref(props.email)
const successMsg = ref("")

watch(
  () => props.displayName,
  (newValue) => {
    name.value = newValue
  }
)

watch(
  () => props.email,
  (newValue) => {
    userEmail.value = newValue
  }
)

const inputClass =
  "w-full rounded-md bg-white/10 px-3 py-2 outline-none border border-white/10 text-white placeholder:text-white/40"

const btnClass =
  "rounded-md bg-white/10 px-4 py-2 hover:bg-white/15 border border-white/10 text-white transition"

function saveProfile() {
  successMsg.value = "Profile updated."
}
</script>

<template>
  <div class="space-y-4 text-white">
    <h2 class="text-3xl font-pragati">Edit Account</h2>
    <p class="text-white/70">Update your account details here.</p>

    <div class="space-y-3">
      <div>
        <label class="mb-1 block text-sm text-white/50">Display Name</label>
        <input v-model="name" type="text" placeholder="Display Name" :class="inputClass" />
      </div>

      <div>
        <label class="mb-1 block text-sm text-white/50">Email</label>
        <input v-model="userEmail" type="email" placeholder="Email" :class="inputClass" />
      </div>
    </div>

    <p v-if="successMsg" class="text-sm text-green-300">
      {{ successMsg }}
    </p>

    <button :class="btnClass" @click="saveProfile">
      Save Changes
    </button>
  </div>
</template>
