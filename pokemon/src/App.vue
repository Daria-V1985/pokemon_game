<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/AuthStore';
import { lsHashMap } from '@/stores/lsHashMap';

const userStore = useUserStore();
const authStore = useAuthStore();

onMounted(() => {
  const savedAuth = lsHashMap.get('authUser');
  if (savedAuth) {
    authStore.user = savedAuth;
    authStore.isAuth = true;
  }

  if (authStore.user?.login) {
    userStore.loadUserData(authStore.user.login);
  }
});

onBeforeUnmount (() => {
  userStore.stopPassiveIncome();
  if (authStore.user?.login && userStore.isInitial) {
    userStore.loadUserData(authStore.user.login);
  }
});

window.addEventListener('beforeunload', () => {
  userStore.stopPassiveIncome();

  if (authStore.user) {
    lsHashMap.set('authUser', authStore.user);
  }
  
  if (authStore.user?.login && userStore.isInitial) {
    userStore.saveUserData(authStore.user.login);
  }
});

</script>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">

</style>
