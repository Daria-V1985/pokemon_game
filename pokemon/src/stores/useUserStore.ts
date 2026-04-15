import { defineStore } from 'pinia';
import { ref } from 'vue';
import { lsHashMap } from './lsHashMap';
import { Pokemon } from '@/types/pokemon';

export const useUserStore = defineStore('user', () => {
  const money = ref(0);
  const pokemons = ref<Pokemon[]>([]);
  const isInitial = ref(false);

  const loadUserData = (userLogin: string) => {
    const data = lsHashMap.get(`userData_${userLogin}`);
    if (data) {
      try {
        money.value = data.money || 0;
        pokemons.value = data.pokemons || [];
        isInitial.value = true;
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
    };
    lsHashMap.set(`userData_${userLogin}`, userData);  
    const savedData = lsHashMap.get(`userData_${userLogin}`);
  };

  const initNewUser = (resMoney: boolean = true) => {
    if (resMoney) {
      money.value = 0;
    }
    pokemons.value = [];
    isInitial.value = true;
  };

  const setInitialData = (data: { money: number; pokemons: Pokemon[] }, userLogin: string) => {    
    money.value = data.money;
    pokemons.value = [...data.pokemons];
    isInitial.value = true;
    saveUserData(userLogin);

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
  };

  const removePokemon = (pokemonId: number) => {
    const index = pokemons.value.findIndex(pok => pok.id === pokemonId);
    if (index !== -1) {
      pokemons.value.splice(index, 1);
    }
  };

  const clearPokemons = () => {
    pokemons.value = [];
  };

  return {
    money,
    pokemons,
    isInitial,
    initNewUser,
    loadUserData,
    saveUserData,
    setInitialData,
    addMoney,
    incrementMoney,
    decrementMoney,
    setMoney,
    addPokemon,
    removePokemon,
    clearPokemons
  };
});