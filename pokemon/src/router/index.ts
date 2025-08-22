import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import PokemonForms from "../views/PokemonForms.vue";
import MainPage from "@/views/MainPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: PokemonForms,
  },
  {
    path: "/main",
    name: "main",
    component: MainPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
