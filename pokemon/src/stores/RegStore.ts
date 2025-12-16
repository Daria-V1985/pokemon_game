import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import { useUserStore } from '@/stores/useUserStore';

export const useRegStore = defineStore('register', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();
  const userStore = useUserStore();

  async function registerUser(data: { login: string; password: string, agPass: string }) {
    if (!data.login || !data.password || !data.agPass) {
      throw new Error('Все поля обязательны');
    }
    if (data.password !== data.agPass) {
      throw new Error('Пароли не совпадают')
    }
    loading.value = true;
    error.value = null;
    try {
      const regResult = await authStore.register({
        login: data.login,
        password: data.password,
      })

      if (!regResult.success) {
        throw new Error(regResult.error?.toString() || 'Ошибка регистрации')
      }

      const newUser = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        login: data.login,
        createdAt: new Date(),
      };

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