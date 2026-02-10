import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
// import AboutView from "@/pages/AboutView.vue"
// import InfoView from "@/pages/InfoView.vue"
import NotFoundView from "../views/NotFoundView.vue"


export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "home", component: HomeView },
        // { path: "/about", name: "about", component: AboutView },
        // { path: "/info", name: "info", component: InfoView },
        // { path: "/:pathMatch(.*)*", redirect: "/" }, // optional
        { path: "/:pathMatch(.*)*", name: "not-found", component: NotFoundView },

    ],
})

