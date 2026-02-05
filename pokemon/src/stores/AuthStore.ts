import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from './useUserStore';
import { lsHashMap } from './lsHashMap'; 

export interface AuthUser {
  id: string;
  login: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const loading = ref(false);
  const isAuth = ref(false);
  const error = ref<string | null>(null);

  const loadAuthData = () => {
    const savedAuth = lsHashMap.get('authUser');
    if (savedAuth) {
        user.value = savedAuth;
        isAuth.value = true;

        const userId = savedAuth.id;
        const userStore = useUserStore();
        userStore.loadUserData(userId);
    }
  };

  const saveAuthData = () => {
    if (user.value) {
      lsHashMap.set('authUser', user.value);
    } else {
      lsHashMap.remove('authUser');
    }
  };

  const loginUser = async (cred: {login: string; password: string}) => {
    loading.value = true;
    error.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!cred.login.trim()) {
        throw new Error('Логин не может быть пустым');
      }

      if (cred.password.length < 8) {
        throw new Error('Пароль слишком короткий');
      }
      const authUser: AuthUser = {
        id: Date.now().toString(),
        login: cred.login.trim(),
      };

      user.value = authUser;
      isAuth.value = true;
      
      const userStore = useUserStore();
      userStore.initNewUser();
      userStore.saveUserData(authUser.id);
      saveAuthData();
      
      return authUser;
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Ошибка авторизации';
        isAuth.value = false;
        throw err;
    } finally {
        loading.value = false;
    }
  }

  const logoutUser = () => {
    if (user.value) {
      const userStore = useUserStore();
      userStore.initNewUser();
      lsHashMap.remove(`userData_${user.value.id}`);
    }

    user.value = null;
    isAuth.value = false;
    saveAuthData();
  };

  const userId = () => user.value?.id || null;
  const userLogin = () => user.value?.login || null;

  return { 
    user, 
    isAuth,
    loadAuthData,
    saveAuthData,
    loginUser,
    logoutUser,
    userId,
    userLogin,
    loading, 
    error
  };
})