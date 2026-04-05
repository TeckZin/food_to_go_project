<script setup lang="ts">
import { ref } from "vue"
import { logout } from "@/lib/authActions"
import { useRouter } from "vue-router"

const router = useRouter()

const props = defineProps<{
  isAccount?: boolean
}>()

const errMsg = ref("")

const linkClass =
  "px-2 py-2 text-xl font-normal font-pragati cursor-pointer text-white/70 hover:text-white"

async function submit() {
  errMsg.value = ""

  try {
    await logout()
    router.push("/")
  } catch (e: any) {
    errMsg.value = e?.code ? `${e.code}: ${e.message}` : (e?.message ?? "Auth failed")
    console.error("AUTH_ERROR", e)
  }
}
</script>

<template>
  <div class="flex items-center px-3 text-lg gap-2">
    <div v-if="props.isAccount" class="flex items-center gap-2">
      <RouterLink to="/account" :class="linkClass">
        ACCOUNT
      </RouterLink>

      <RouterLink to="/cart" :class="linkClass">
        CART
      </RouterLink>

      <button :class="linkClass" @click="submit">
        LOG OUT
      </button>
    </div>

    <template v-else>
      <RouterLink :to="{ path: '/auth', query: { mode: 'login' } }" :class="linkClass">
        LOGIN
      </RouterLink>

      <RouterLink :to="{ path: '/auth', query: { mode: 'signup' } }" :class="linkClass">
        SIGN UP
      </RouterLink>
    </template>
  </div>

  <p v-if="errMsg" class="px-3 pt-2 text-sm text-red-300">
    {{ errMsg }}
  </p>
</template>
