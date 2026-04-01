<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { logout, resendVerificationEmail } from "@/lib/authActions"

const props = defineProps<{
  displayName: string
  email: string
  emailVerified: boolean
}>()

const router = useRouter()
const message = ref("")
const errorMsg = ref("")

const btnClass =
  "w-full rounded-md bg-white/10 px-3 py-2 hover:bg-white/15 border border-white/10 text-white"

async function handleLogout() {
  errorMsg.value = ""

  try {
    await logout()
    router.push({ path: "/auth", query: { mode: "login" } })
  } catch (e: any) {
    errorMsg.value = e?.message ?? "Failed to log out."
  }
}

async function handleResendVerification() {
  message.value = ""
  errorMsg.value = ""

  try {
    await resendVerificationEmail()
    message.value = "Verification email sent. Check your inbox."
  } catch (e: any) {
    errorMsg.value = e?.code
      ? `${e.code}: ${e.message}`
      : (e?.message ?? "Failed to send email.")
  }
}
</script>

<template>
  <section
    class="w-full rounded-lg border border-white/10 bg-white/5 p-6 lg:w-[320px] lg:self-start"
  >
    <h1 class="text-4xl font-pragati text-white">ACCOUNT</h1>

    <div class="mt-6 space-y-4 text-left">
      <div>
        <p class="text-sm text-white/50">Name</p>
        <p class="text-lg font-medium text-white">{{ props.displayName }}</p>
      </div>

      <div>
        <p class="text-sm text-white/50">Email</p>
        <p class="text-lg font-medium text-white">{{ props.email }}</p>
      </div>

      <div>
        <p class="text-sm text-white/50">Status</p>
        <p class="text-lg font-medium text-white">
          {{ props.emailVerified ? "Verified" : "Not Verified" }}
        </p>
      </div>
    </div>

    <p v-if="message" class="mt-4 text-sm text-green-300">
      {{ message }}
    </p>

    <p v-if="errorMsg" class="mt-4 text-sm text-red-300">
      {{ errorMsg }}
    </p>

    <div class="mt-6 space-y-3">
      <button
        v-if="!props.emailVerified"
        :class="btnClass"
        @click="handleResendVerification"
      >
        Resend Verification Email
      </button>

      <button :class="btnClass" @click="router.push('/')">
        Back Home
      </button>

      <button :class="btnClass" @click="handleLogout">
        Log Out
      </button>
    </div>
  </section>
</template>
