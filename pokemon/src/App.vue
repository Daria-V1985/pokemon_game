<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/AuthStore';

const userStore = useUserStore();
const authStore = useAuthStore();

onMounted(() => {
  if (authStore.user?.authLogin) {
    userStore.initStore();
  }
});

watch(() => authStore.user, (newUser, oldUser) => {
  if (newUser?.authLogin) {
    userStore.initStore();
  } else if (oldUser) {
    userStore.resetUserData();
  }
});

watch(() => userStore.money, (newMoney) => {
  localStorage.setItem('userMoney', JSON.stringify(newMoney));
}, { deep: true });

</script>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">

</style>
