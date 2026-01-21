import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { lsHashMap } from './lsHashMap'; 

export interface AuthUser {
  id: string;
  login: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadAuthData = () => {
    const savedAuth = lsHashMap.get('authUser');
    if (savedAuth) {
        user.value = savedAuth;
    }
  };

  const saveAuthData = () => {
    if (user.value) {
      lsHashMap.set('authUser', user.value);
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