import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from '@/stores/useUserStore';

export const useRegStore = defineStore('register', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const registerUser = async (cred: { login: string; password: string, agPass: string }) => {
    loading.value = true;
    error.value = null;
    try {
      if (cred.password !== cred.agPass) {
        throw new Error('Пароли не совпадают');
      }
      const newUser = {
        id: Date.now().toString(),
        login: cred.login
      };

      const userStore = useUserStore();
      userStore.initNewUser();
      return newUser;
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