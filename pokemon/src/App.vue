<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/AuthStore';
import { lsHashMap } from '@/stores/lsHashMap';

const userStore = useUserStore();
const authStore = useAuthStore();

onMounted(() => {
  authStore.loadAuthData();

  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('unload', handleUnload);
});

onBeforeUnmount (() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
  window.removeEventListener('unload', handleUnload);
});

const handleBeforeUnload = () => {
  if (authStore.user) {
    authStore.saveAuthData();
    userStore.saveUserData();
  }
};

const handleUnload = () => {
  lsHashMap.flushAllData();
};

</script>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">

</style>
