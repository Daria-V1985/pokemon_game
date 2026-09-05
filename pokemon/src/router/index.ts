import { createRouter, createWebHistory } from "vue-router";
import SignUp from '@/components/auth/SignUp.vue';
import SignIn from '@/components/auth/SignIn.vue';
import PokemonForms from "../views/PokemonForms.vue";
import MainPage from "@/views/MainPage.vue";
import Feed from "@/components/popup/Feed.vue";
import Statistics from "@/components/popup/Statistics.vue";

const routes = [
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
  {
    path: '/popup/feed',
    name: 'Feed',
    component: Feed,
  },
  {
    path: '/popup/statistics',
    name: 'Statistics',
    component: Statistics,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
