import { createRouter, createWebHistory } from "vue-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"

import HomeView from "../views/HomeView.vue"
import AboutView from "@/views/AboutView.vue"
import StoreView from "@/views/StoreView.vue"
import ContactView from "@/views/ContactView.vue"
import AuthView from "@/views/AuthView.vue"
import AccountView from "@/views/AccountView.vue"
import VerifyView from "@/views/VerifyRequired.vue"
import NotFoundView from "../views/NotFoundView.vue"

const routes = [
    { path: "/", name: "home", component: HomeView },
    { path: "/about", name: "about", component: AboutView },
    { path: "/contact", name: "contact", component: ContactView },
    { path: "/store", name: "store", component: StoreView },
    { path: "/auth", name: "auth", component: AuthView },
    { path: "/verify-required", name: "verify-required", component: VerifyView },
    { path: "/account", name: "account", component: AccountView, meta: { requiresVerified: true } },
    { path: "/:pathMatch(.*)*", name: "not-found", component: NotFoundView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

function waitForAuthReady() {
    const auth = getAuth()
    return new Promise<void>((resolve) => {
        const unsub = onAuthStateChanged(auth, () => {
            unsub()
            resolve()
        })
    })
}

router.beforeEach(async (to) => {
    if (to.name === "auth" || to.name === "verify-required" || to.name === "not-found") {
        return true
    }

    const needsVerified = to.matched.some((r) => r.meta.requiresVerified)
    if (!needsVerified) return true

    const auth = getAuth()
    await waitForAuthReady()

    const user = auth.currentUser
    if (!user) {
        return { path: "/auth", query: { mode: "login" } }
    }

    await user.reload()

    if (!user.emailVerified) {
        return { path: "/verify-required" }
    }

    return true
})

