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

      localStorage.setItem('authUser', JSON.stringify(user.value));
      console.log('User saved to localStorage:', user.value);
    
    return { success: true };
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

  const loadUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      user.value = JSON.parse(savedUser);
      console.log('User loaded from localStorage:', user.value);
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    user.value = null;
  }
};

  return { 
    user, 
    loginUser,
    register,
    //logoutUser,
    loadUserFromStorage,
    loading, 
    error
  };
})