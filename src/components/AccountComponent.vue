<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { auth } from "@/lib/firebase"
import { logout } from "@/lib/authActions"
import { gsap } from "gsap"
import { watchRoleState, type UserRole } from "@/helper/roleFunction"

const router = useRouter()

const errMsg = ref("")
const isOpen = ref(false)

const menuRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const role = ref<UserRole>("")
let unsubscribeRole: (() => void) | null = null

const isLoggedIn = computed(() => !!auth.currentUser)
const canManage = computed(() => role.value === "admin" || role.value === "manager")

const triggerClass = computed(() =>
  [
    "cursor-pointer select-none bg-transparent font-pragati text-[1.5rem] leading-none text-white/80 transition duration-200 hover:text-white",
    isOpen.value ? "text-white" : "",
  ].join(" "),
)

const itemClass =
  "block w-full whitespace-nowrap bg-transparent px-5 py-3 text-left font-pragati text-[1rem] leading-none text-white/75 transition duration-200 hover:text-white"

unsubscribeRole = watchRoleState((state) => {
  role.value = state.role
})

async function openMenu() {
  isOpen.value = true
  await nextTick()

  if (!panelRef.value) return

  gsap.killTweensOf(panelRef.value)

  gsap.set(panelRef.value, {
    opacity: 0,
    y: -10,
    pointerEvents: "none",
    display: "block",
  })

  gsap.to(panelRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.2,
    ease: "power2.out",
    onComplete: () => {
      if (panelRef.value) panelRef.value.style.pointerEvents = "auto"
    },
  })
}

function closeMenu() {
  if (!panelRef.value) {
    isOpen.value = false
    return
  }

  gsap.killTweensOf(panelRef.value)

  gsap.to(panelRef.value, {
    opacity: 0,
    y: -10,
    duration: 0.16,
    ease: "power2.in",
    onComplete: () => {
      isOpen.value = false
    },
  })
}

function toggleMenu() {
  if (isOpen.value) closeMenu()
  else openMenu()
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node
  if (!menuRef.value) return
  if (!menuRef.value.contains(target)) {
    closeMenu()
  }
}

function goTo(path: string) {
  closeMenu()
  router.push(path)
}

async function submit() {
  errMsg.value = ""

  try {
    closeMenu()
    await logout()
    router.push("/")
  } catch (e: any) {
    errMsg.value = e?.code ? `${e.code}: ${e.message}` : (e?.message ?? "Auth failed")
    console.error("AUTH_ERROR", e)
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
  if (unsubscribeRole) unsubscribeRole()
})
</script>

<template>
  <div ref="menuRef" class="relative z-[300] flex items-center">
    <button
      type="button"
      :class="triggerClass"
      @click.stop="toggleMenu"
    >
      ACCOUNT
    </button>

    <div
      v-if="isOpen"
      ref="panelRef"
      class="absolute right-0 top-[calc(100%+0.85rem)] z-[350] min-w-[13rem] bg-[#272B34] py-2 shadow-[0_1rem_2.5rem_rgba(0,0,0,0.35)]"
    >
      <template v-if="!isLoggedIn">
        <button
          type="button"
          :class="itemClass"
          @click="goTo('/auth?mode=login')"
        >
          SIGN IN
        </button>

        <button
          type="button"
          :class="itemClass"
          @click="goTo('/auth?mode=signup')"
        >
          SIGN UP
        </button>
      </template>

      <template v-else>
        <button
          type="button"
          :class="itemClass"
          @click="goTo('/account')"
        >
          ACCOUNT
        </button>

        <button
          type="button"
          :class="itemClass"
          @click="goTo('/cart')"
        >
          CART
        </button>

        <button
          v-if="canManage"
          type="button"
          :class="itemClass"
          @click="goTo('/manage')"
        >
          MANAGE
        </button>

        <button
          type="button"
          :class="itemClass"
          @click="submit"
        >
          LOG OUT
        </button>
      </template>
    </div>

    <p
      v-if="errMsg"
      class="absolute right-0 top-[calc(100%+12rem)] z-[360] w-64 text-sm text-red-300"
    >
      {{ errMsg }}
    </p>
  </div>
</template>
