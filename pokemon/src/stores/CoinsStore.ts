import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useCoinsStore = defineStore('coins', () => {
  const coins = ref(0);
  const authLogin = ref<string | null>(null)

  function init(authLoginParam: string) {
    authLogin.value = authLoginParam;
    loadCoinsFromStorage();
  }

  function loadCoinsFromStorage() {
    if (!authLogin.value) return; 
    try {
      const stored = localStorage.getItem(`coins_${authLogin.value}`);
      coins.value = stored ? parseInt(stored, 10) : 0;
    } catch (err) {
      console.error('Ошибка загрузки монет из localStorage:', err);
      coins.value = 0;
    }
  }

  watch(coins, (newCoins) => {
    if (authLogin.value && newCoins >= 0) {
      localStorage.setItem(`coins_${authLogin.value}`, newCoins.toString());
    }
  });

  function increment() {
    coins.value++;
  }

  function decrement() {
    if (coins.value > 0) {
      coins.value--;
    }
  }

  function reset() {
    coins.value = 0;
  }

  return {
    coins,
    init,
    increment,
    decrement,
    reset,
  };
});