import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ authLogin: string } | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuth = computed(() => !!user.value);

  function loadUserFromStorage() {
    const stored = localStorage.getItem('authUser');
    user.value = stored ? JSON.parse(stored) : null;
  }

  watch(user, (newUser) => {
    if (newUser) {
      localStorage.setItem('authUser', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('authUser');
    }
  }, { immediate: true });

  async function loginUser(cred: { login: string; password: string }) {
    if (!cred.login || !cred.password) {
      throw new Error('Логин и пароль обязательны');
    }
    loading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      user.value = { authLogin: cred.login };
    }
    catch (e: unknown) {
      error.value = 'Ошибка авторизации';
      user.value = null;
    }
    finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
  }

  return { 
    user, 
    isAuth,
    loginUser,
    loadUserFromStorage,
    loading, 
    logout,
    error,
  };
})