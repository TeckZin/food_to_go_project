<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { loginEmail, signUpEmail } from "../lib/authActions"

const route = useRoute()
const router = useRouter()

type Mode = "login" | "signup"

const mode = computed<Mode>(() => {
  return route.query.mode === "signup" ? "signup" : "login"
})

watchEffect(() => {
  if (!route.query.mode) {
    router.replace({ path: "/auth", query: { mode: "login" } })
  }
})

const displayName = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const errorMsg = ref("")

const tabClass = (tab: Mode) =>
  [
    "px-2 py-2 text-3xl font-normal font-pragati cursor-pointer",
    tab === mode.value ? "text-white" : "text-white/70 hover:text-white",
  ].join(" ")

const inputClass =
  "w-full rounded-md bg-white/10 px-3 py-2 outline-none border border-white/10 text-white placeholder:text-white/40"

const btnClass =
  "w-full rounded-md bg-white/10 px-3 py-2 hover:bg-white/15 border border-white/10 text-white"

async function submit() {
  errorMsg.value = ""

  try {
    const trimmedEmail = email.value.trim()
    const trimmedDisplayName = displayName.value.trim()

    if (!trimmedEmail) {
      errorMsg.value = "Email is required."
      return
    }

    if (!password.value) {
      errorMsg.value = "Password is required."
      return
    }

    if (mode.value === "login") {
      await loginEmail(trimmedEmail, password.value)
      router.push("/")
      return
    }

    if (!trimmedDisplayName) {
      errorMsg.value = "Display name is required."
      return
    }

    if (password.value !== confirmPassword.value) {
      errorMsg.value = "Passwords do not match."
      return
    }

    await signUpEmail(trimmedEmail, password.value, trimmedDisplayName)
    router.push("/verify-required")
  } catch (e: any) {
    if (e?.code === "auth/email-not-verified") {
      errorMsg.value = "Email not verified. Check your inbox (verification link sent)."
    } else {
      errorMsg.value = e?.code ? `${e.code}: ${e.message}` : (e?.message ?? "Auth failed")
    }
    console.error("AUTH_ERROR", e)
  }
}
</script>

<template>
  <main class="min-h-screen bg-[#272B34] flex items-center justify-center px-6">
    <div class="w-full max-w-md rounded-lg border border-white/10 bg-white/5 p-6">
      <div class="flex justify-center gap-6">
        <RouterLink :to="{ path: '/auth', query: { mode: 'login' } }" :class="tabClass('login')">
          LOGIN
        </RouterLink>

        <RouterLink :to="{ path: '/auth', query: { mode: 'signup' } }" :class="tabClass('signup')">
          SIGN UP
        </RouterLink>
      </div>

      <div class="mt-6 space-y-3">
        <input
          v-if="mode === 'signup'"
          v-model="displayName"
          type="text"
          placeholder="Display Name / Username"
          :class="inputClass"
        />

        <input
          v-model="email"
          type="email"
          placeholder="Email"
          :class="inputClass"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          :class="inputClass"
        />

        <input
          v-if="mode === 'signup'"
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          :class="inputClass"
        />

        <p v-if="errorMsg" class="text-sm text-red-300">
          {{ errorMsg }}
        </p>

        <button :class="btnClass" @click="submit">
          {{ mode === "login" ? "Log in" : "Create account" }}
        </button>
      </div>
    </div>
  </main>
</template>
