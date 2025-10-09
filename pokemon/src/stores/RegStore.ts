import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useRegStore = defineStore('register', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function registerUser(data: { login: string; password: string, agPass: string }) {
    if (!data.login || !data.password || !data.agPass) {
      throw new Error('Все поля обязательны');
    }
    loading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err: unknown) {
      error.value = 'Ошибка регистрации';
      throw err; 
    } finally {
      loading.value = false;
    }
  }

  return { 
    registerUser,
    loading,
    error,
  };
});