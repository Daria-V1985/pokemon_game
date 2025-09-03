<template>
  <main class="page">
    <section class="form">
      <div class="form__logo">
        <Logo />
      </div>
      <div class="form__container">
        <Tabs 
          :names="tabs"
          :selectedTab="selectedTab"
          @changeTab="changeTab"
        >
          <component :is="currentComponent" />
        </Tabs>
      </div>
    </section>
  </main>
</template>  

<script lang="ts" setup>
import { ref, computed } from "vue";

import Tabs from "@/components/Tabs.vue";
import Logo from "@/components/Logo.vue";
import SignIn from "@/components/auth/SignIn.vue";
import SignUp from "@/components/auth/SignUp.vue";

const tabs = [
  {name: "/auth/signup", label: "Регистрация"},
  {name: "/auth/signin", label: "Вход"},
];

const selectedTab = ref("/auth/signin");

const changeTab = (tabName: string) => {
  selectedTab.value = tabName;
}

const currentComponent = computed(() => {
  return selectedTab.value === "/auth/signin" ? SignIn : SignUp;
});

</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  &__logo {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
	}
	&__container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
    padding: 24px;
    max-width: 400px;
    width: 100%;
	}
}

</style>
