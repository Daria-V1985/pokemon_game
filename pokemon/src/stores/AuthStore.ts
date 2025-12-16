import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ authLogin: string } | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

   const loginUser = async (cred: { login: string; password: string }) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      user.value = { authLogin: cred.login };
    }
    catch (err) {
      error.value = 'Ошибка авторизации';
      throw err;
    }
    finally {
      loading.value = false;
    }
  }

  const  register = async (cred: {
    login: string;
    password: string;
  }) => { loading.value = true; error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      user.value = { authLogin: cred.login };
      return { 
        success: true, 
        user: { 
          id: Date.now().toString(),
          login: cred.login,
        } 
      };
    } catch (err) {
      error.value = 'Ошибка регистрации';
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Неизвестная ошибка' 
      };
    } finally {
      loading.value = false;
    }
   }

   const logoutUser = () => {
    user.value = null;
    localStorage.removeItem('authUser');
  }

  return { 
    user, 
    loginUser,
    register,
    //logoutUser,
    loading, 
    error
  };
})