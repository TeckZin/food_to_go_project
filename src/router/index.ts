import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import AboutView from "@/views/AboutView.vue"
import StoreView from "@/views/StoreView.vue"
import ContactView from "@/views/ContactView.vue"
import NotFoundView from "../views/NotFoundView.vue"


export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "home", component: HomeView },
        { path: "/about", name: "about", component: AboutView },
        { path: "/contact", name: "contact", component: ContactView },
        { path: "/store", name: "store", component: StoreView },
        { path: "/:pathMatch(.*)*", name: "not-found", component: NotFoundView },

    ],
})

