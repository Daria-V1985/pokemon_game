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

        const userLogin = savedAuth.login;
        const userStore = useUserStore();
        userStore.loadUserData(userLogin);
    }
  };

  const saveAuthData = () => {
    if (user.value) {
      lsHashMap.set('authUser', user.value);
    } else {
      lsHashMap.remove('authUser');
    }
  };

  const findUserByLogin = (login: string): AuthUser | null => {
    const existingUsers = lsHashMap.get('registeredUsers') || [];
    return existingUsers.find((user: any) => user.login === login) || null;
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
      
      const existingUser = findUserByLogin(cred.login.trim());
      if (!existingUser) {
        throw new Error('Пользователь с таким логином не найден');
      }

      if (existingUser) {
        user.value = existingUser;
        isAuth.value = true;
        const userStore = useUserStore();
        userStore.loadUserData(cred.login.trim());
        saveAuthData();

        return existingUser;
      }
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
      userStore.saveUserData(user.value.login);
      userStore.stopPassiveIncome();
      
      setTimeout(() => {
        userStore.initNewUser();
        user.value = null;
        isAuth.value = false;
        saveAuthData();
      }, 100);
    } else {
      user.value = null;
      isAuth.value = false;
      saveAuthData();
    }
  };

  const userLogin = () => user.value?.login || null;

  return { 
    user, 
    isAuth,
    loadAuthData,
    saveAuthData,
    loginUser,
    logoutUser,
    userLogin,
    loading, 
    error
  };
})