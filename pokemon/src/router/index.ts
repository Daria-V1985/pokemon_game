import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import SignUp from '@/components/auth/SignUp.vue';
import SignIn from '@/components/auth/SignIn.vue';
import PokemonForms from "../views/PokemonForms.vue";
import MainPage from "@/views/MainPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: PokemonForms,
  },
  {
    path: '/auth/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/auth/signin',
    name: 'SignIn',
    component: SignIn,
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
