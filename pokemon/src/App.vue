<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();

onMounted(() => {
  authStore.loadUserFromStorage(); 
});

</script>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">

</style>
