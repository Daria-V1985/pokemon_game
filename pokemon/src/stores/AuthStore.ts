import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<{ authLogin: string } | null>(null);
    const error = ref<string | null>(null);
    const loading = ref(false);

    const isAuth = computed(() => !!user.value);

    function loadUserFromStorage() {
    const stored = localStorage.getItem('authUser')
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch {
        localStorage.removeItem('authUser')
      }
    }
  }

  function saveUserToStorage(userData: object) {
    console.log('Saving to localStorage:', userData);
    const serialized = JSON.stringify(userData);
    console.log('Serialized:', serialized);
    localStorage.setItem('authUser', JSON.stringify(userData));
    console.log('localStorage after save:', localStorage.getItem('authUser'));
  }

    async function loginUser(cred: { login: string; password: string }) {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('https://9d6066f5473655c8.mokky.dev/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cred),
      });

      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }

      const data = await response.json();
      user.value = { authLogin: data.authLogin };
      saveUserToStorage(user.value);
      return data;
    }
    catch (err: any) { 
      error.value = err.message || 'Неизвестная ошибка';
      throw err;
    } 
    finally {
      loading.value = false;
    }
  }

  loadUserFromStorage();

  function logout() {
    user.value = null;
    error.value = null;
    localStorage.removeItem('authUser');
  }

  return { 
    user, 
    error, 
    loading, 
    isAuth,
    loginUser, 
    logout 
  }
})