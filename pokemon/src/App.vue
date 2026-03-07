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
    console.log('Данные авторизации загружены через lsHashMap');
  }

  if (authStore.user?.id) {
    const savedUser = lsHashMap.get(`userData_${authStore.user.id}`);
    if (savedUser) {
      userStore.money = savedUser.money || 0;
      userStore.pokemons = savedUser.pokemons || [];
      userStore.isInitial = true;
      console.log('Данные пользователя загружены для:', authStore.user.login);
    }
  }
});

onBeforeUnmount (() => {
  if (authStore.user?.id && userStore.isInitial) {
    lsHashMap.set(`userData_${authStore.user.id}`, {
      money: userStore.money,
      pokemons: userStore.pokemons,
    });
    console.log('Данные пользователя сохранены для:', authStore.user.login);
    
  }
});

window.addEventListener('beforeunload', () => {
  if (authStore.user) {
    lsHashMap.set('authUser', authStore.user);
  }
  
  if (authStore.user?.id && userStore.isInitial) {
    lsHashMap.set(`userData_${authStore.user.id}`, {
      money: userStore.money,
      pokemons: userStore.pokemons
    });
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
