import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { lsHashMap } from './lsHashMap';
import { pokemonService, type Pokemon } from '@/services/pokemonService';

export const useRegStore = defineStore('register', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isUserUnique = (login: string): boolean => {
    const existingUsers = lsHashMap.get('registeredUsers') || [];
    return !existingUsers.some((user: any) => user.login === login);
  };

  const registerUserData = (userData: any) => {
    const existingUsers = lsHashMap.get('registeredUsers') || [];
    const updatedUsers = [...existingUsers, userData];
    lsHashMap.set('registeredUsers', updatedUsers);
  }

  const getRandomPokemon = () => {
    const allPokemons = pokemonService.getAllPokemons();
    if (allPokemons.length === 0) {
      console.warn('Нет доступных покемонов для выбора');
      return null;
    }
    const randomIndex = Math.floor(Math.random() * allPokemons.length);
    return {...allPokemons[randomIndex]};
  };

  const initializeNewUser = (userLogin: string) => {
    const userStore = useUserStore();
    
    const initData = {
      money: 100,
      pokemons: [] as Pokemon[],
    };
    
    const randomPokemon = getRandomPokemon();
    if (randomPokemon) {
      initData.pokemons.push(randomPokemon);
      console.log(`Новому пользователю добавлен покемон: ${randomPokemon.name}`);
    }
    userStore.setInitialData(initData, userLogin);
    console.log(`✅ Инициализирован новый пользователь ID: ${userLogin}`);
  };

  const registerUser = async (cred: { login: string; password: string; agPass: string }) => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log("1. Начало регистрации...");
      if (cred.password !== cred.agPass) {
        throw new Error('Пароли не совпадают');
      }

      if (!cred.login.trim()) {
        throw new Error('Логин не может быть пустым');
      }

      console.log("2. Проверяем уникальность...");
      if (!isUserUnique(cred.login.trim())) {
        throw new Error('Пользователь с таким логином уже существует');
      }

      console.log("3. Создаем пользователя...");
      const newUser = {
        id: Date.now().toString(),
        login: cred.login.trim()
      };

      console.log("4. Регистрируем в системе...");
      registerUserData(newUser);

      console.log("5. Инициализируем данные...");
      initializeNewUser(newUser.id);

      console.log(`✅ Новый пользователь зарегистрирован: ${newUser.login}`);
      return newUser;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Ошибка регистрации';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { 
    registerUser,
    loading,
    error,
  };
});