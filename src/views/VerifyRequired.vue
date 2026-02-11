<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getAuth } from "firebase/auth"
import { resendVerificationEmail, logout } from "../lib/authActions"

const router = useRouter()
const auth = getAuth()

const errorMsg = ref("")
const infoMsg = ref("")
const checking = ref(false)

async function resend() {
  errorMsg.value = ""
  infoMsg.value = ""
  try {
    await resendVerificationEmail()
    infoMsg.value = "Verification email sent. Check your inbox (and spam folder)."
  } catch (e: any) {
    errorMsg.value = e?.code ? `${e.code}: ${e.message}` : (e?.message ?? "Failed to resend.")
  }
}

async function iVerified() {
  errorMsg.value = ""
  infoMsg.value = ""
  checking.value = true
  try {
    const user = auth.currentUser
    if (!user) {
      errorMsg.value = "Please log in again, then verify."
      return
    }

    await user.reload()

    if (user.emailVerified) {
      infoMsg.value = "Verified! Redirecting..."
      router.replace("/")
    } else {
      errorMsg.value = "Still not verified yet. Click the link in your email, then try again."
    }
  } finally {
    checking.value = false
  }
}

async function signOut() {
  await logout()
  router.replace({ path: "/auth", query: { mode: "login" } })
}

onMounted(() => {
  // If they are already verified, don’t keep them here
  const user = auth.currentUser
  if (user?.emailVerified) {
    router.replace("/")
  }
})
</script>

<template>
  <main class="min-h-screen bg-[#272B34] flex items-center justify-center px-6">
    <div class="w-full max-w-md rounded-lg border border-white/10 bg-white/5 p-6 text-white">
      <h1 class="text-2xl mb-2">Verify your email</h1>
      <p class="text-white/70 mb-4">
        We sent a verification link to your email. Click it, then come back here and press “I verified”.
      </p>

      <p v-if="infoMsg" class="text-sm text-green-300 mb-2">{{ infoMsg }}</p>
      <p v-if="errorMsg" class="text-sm text-red-300 mb-2">{{ errorMsg }}</p>

      <div class="space-y-3">
        <button class="w-full rounded-md bg-white/10 px-3 py-2 hover:bg-white/15 border border-white/10"
                :disabled="checking"
                @click="iVerified">
          {{ checking ? "Checking..." : "I verified" }}
        </button>

        <button class="w-full rounded-md bg-white/10 px-3 py-2 hover:bg-white/15 border border-white/10"
                @click="resend">
          Resend email
        </button>

        <button class="w-full rounded-md bg-white/5 px-3 py-2 hover:bg-white/10 border border-white/10"
                @click="signOut">
          Back to login
        </button>
      </div>
    </div>
  </main>
</template>

