import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from './AuthStore';
import { useUserStore } from './useUserStore';

export const useGardenStore = defineStore('garden', () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const gardenSlots = computed(() => userStore.gardenSlots);

  const buyExtension = (): boolean => {
    const EXTENSION_PRICE = 1000;

    if (userStore.money < EXTENSION_PRICE) {
      alert('Недостаточно монет для расширения грядки!');
      return false;
    }
    userStore.money -= EXTENSION_PRICE;
    userStore.gardenSlots += 2;

    const login = authStore.user?.login;
    if (login) {
      userStore.saveUserData(login);
    }

    return true;
  };

  return {
    gardenSlots,
    buyExtension,
  };
});