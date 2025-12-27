import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from './useUserStore';

export interface AuthUser {
  id: string;
  login: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadAuthData = () => {
    const authData = localStorage.getItem('authData');
    if (authData) {
      try {
        user.value = JSON.parse(authData);
        const userStore = useUserStore();
        userStore.loadUserData();
      } catch (err) {
        console.warn('Не удалось обработать данные:', err);
        user.value = null;
      }
    }
  };

  const saveAuthData = () => {
    if (user.value) {
      localStorage.setItem('authData', JSON.stringify(user.value));
    } else {
      localStorage.removeItem('authData');
    }
  };

  const loginUser = async (cred: {login: string; password: string}) => {
    loading.value = true;
    error.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (cred.password.length < 8) {
        throw new Error('Пароль слишком короткий');
      }
      const authUser: AuthUser = {
        id: Date.now().toString(),
        login: cred.login,
      };

      user.value = authUser;
      const userStore = useUserStore();
      userStore.initNewUser();
      saveAuthData();
      userStore.saveUserData();
      return authUser;
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Ошибка авторизации';
        throw err;
    } finally {
        loading.value = false;
    }
  }

  const logoutUser = () => {
    user.value = null;
    const userStore = useUserStore();
    userStore.initNewUser();
    saveAuthData();
    userStore.saveUserData();
  };

  return { 
    user, 
    loadAuthData,
    saveAuthData,
    loginUser,
    logoutUser,
    loading, 
    error
  };
})