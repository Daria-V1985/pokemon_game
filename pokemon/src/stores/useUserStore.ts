import { defineStore } from 'pinia';
import { ref } from 'vue';
import { lsHashMap } from './lsHashMap';
import { useAuthStore } from './AuthStore';
import { Pokemon } from '@/types/pokemon';
import { InventoryItem } from '@/types/inventoryItem';

export const useUserStore = defineStore('user', () => {
  const money = ref(0);
  const pokemons = ref<Pokemon[]>([]);
  const inventory = ref<InventoryItem[]>([]);
  const isInitial = ref(false);

  let incomeInterval: ReturnType<typeof setInterval> | null = null;
  const passiveIncomeStep = ref(0);

  const startPassiveIncome = (userLogin: string) => {
    stopPassiveIncome();
    const calculateIncomeStep = () => {
    if (pokemons.value.length > 0) {
      return pokemons.value.reduce((total, pokemon) => {
        const pokemonMoney = (pokemon as any).price || 11200;
        return total + Math.round(pokemonMoney * 0.1);
      }, 0);
    }
    return Math.round(11200 * 0.1); 
  };
    passiveIncomeStep.value = calculateIncomeStep();

    incomeInterval = setInterval(() => {
      if (!isInitial.value) return;
      money.value += passiveIncomeStep.value;
    }, 1000); 
  };

  const stopPassiveIncome = () => {
    if (incomeInterval) {
      clearInterval(incomeInterval);
      incomeInterval = null;
    }
  };

  const loadUserData = (userLogin: string) => {
    const data = lsHashMap.get(`userData_${userLogin}`);
    if (data) {
      try {
        money.value = data.money || 0;
        pokemons.value = data.pokemons || [];
        inventory.value = data.inventory || [];
        isInitial.value = true;
        startPassiveIncome(userLogin);
      } catch (err) {
        console.error('Не удалось обработать данные:', err);
      }
    } else {
      console.warn('Сохраненных данных пользователя не найдено');
    }
  };

  const saveUserData = (userLogin: string) => {
    if (!isInitial.value) return;
      
    const userData = {
      money: money.value,
      pokemons: pokemons.value,
      inventory: inventory.value,
    };
    lsHashMap.set(`userData_${userLogin}`, userData);  
    lsHashMap.flushAllData();
  };

  const initNewUser = (resMoney: boolean = true) => {
    if (resMoney) {
      money.value = 0;
    }
    pokemons.value = [];
    inventory.value = [];
    isInitial.value = true;
    const authStore = useAuthStore();
    if (authStore.user?.login) {
      startPassiveIncome(authStore.user.login);
    }
  };

  const setInitialData = (data: { money: number; pokemons: Pokemon[], inventory: InventoryItem[] }, userLogin: string) => {    
    money.value = data.money;
    pokemons.value = [...data.pokemons];
    inventory.value = [...data.inventory];
    isInitial.value = true;
    saveUserData(userLogin);
    startPassiveIncome(userLogin);

    const checkData = lsHashMap.get(`userData_${userLogin}`);
  };

  const setMoney = (amount: number) => {
    if (amount >= 0) {
      money.value = amount;
    }
  }

  const addMoney = (sum: number) => {
    money.value += sum;
  };

  const incrementMoney = () => {
    money.value++;
  };

  const decrementMoney = () => {
    if (money.value > 0) {
      money.value--;
    }
  };

  const addPokemon = (pokemon: Pokemon) => {
    pokemons.value.push(pokemon);
    const authStore = useAuthStore();
    if (authStore.user?.login) {
      startPassiveIncome(authStore.user.login);
    }
  };

  const clearPokemons = () => {
    pokemons.value = [];
  };

  const deletePokemon = (pokemonId: number) => {
    try {
      const authStore = useAuthStore();
      const currentUser = authStore.user;
      
      if (!currentUser) {
        console.error('Пользователь не авторизован');
        return false;
      }

      const userLogin = currentUser.login;
      const userDataKey = `userData_${userLogin}`;
      const currentUserData = lsHashMap.get(userDataKey);
      
      if (!currentUserData) {
        console.error('Данные пользователя не найдены');
        return false;
      }

      const currentPokemons = currentUserData.pokemons || [];
      const updatedPokemons = currentPokemons.filter((p: Pokemon) => p.id !== pokemonId);

      const updatedUserData = {
        ...currentUserData,
        pokemons: updatedPokemons
      };
      
      lsHashMap.set(userDataKey, updatedUserData);
      pokemons.value = updatedPokemons;

      const aliasKey = `pokemonAlias_${pokemonId}`;
      if (localStorage.getItem(aliasKey)) {
        localStorage.removeItem(aliasKey);
      }
      if (authStore.user?.login) {
        startPassiveIncome(authStore.user.login);
      }
      return true;
    } catch (err) {
      console.error('Ошибка при удалении покемона:', err);
      return false;
    }
  };

  return {
    money,
    pokemons,
    inventory,
    isInitial,
    passiveIncomeStep,
    initNewUser,
    loadUserData,
    saveUserData,
    setInitialData,
    addMoney,
    incrementMoney,
    decrementMoney,
    setMoney,
    addPokemon,
    clearPokemons,
    deletePokemon,
    stopPassiveIncome,
  };
});