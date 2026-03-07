import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { lsHashMap } from './lsHashMap';
import { pokemonService, type Pokemon } from '@/services/pokemonService';

export const useUserStore = defineStore('user', () => {
  const money = ref(0);
  const pokemons = ref<Pokemon[]>([]);
  const isInitial = ref(false);

  const loadUserData = async (userId: string) => {
    const data = lsHashMap.get(`userData_${userId}`);
    if (data) {
      try {
        money.value = data.money || 0;
        pokemons.value = data.pokemons || [];
        isInitial.value = true;
        console.log('Данные пользователя загружены из LS');
      } catch (err) {
        console.error('Не удалось обработать данные:', err);
        initNewUser();
      }
    } else {
      console.log('Сохраненных данных пользователя не найдено');
      initNewUser();
    }
  };

  const saveUserData = (userId: string) => {
    if (!isInitial.value) return;
      
    const userData = {
      money: money.value,
      pokemons: pokemons.value,
    };
    lsHashMap.set(`userData_${userId}`, userData);  
    console.log('Данные пользователя сохранены в LS');
  };

  const initNewUser = () => {
    money.value = 0;
    pokemons.value = [];
    isInitial.value = true;
  };

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

  const setMoney = (amount: number) => {
    if (amount >= 0) {
      money.value = amount;
    }
  };

  const addPokemon = (pokemon: Pokemon) => {
    pokemons.value.push(pokemon);
  };

  const removePokemon = (pokemonId: number) => {
    const index = pokemons.value.findIndex(p => p.id === pokemonId);
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
    addMoney,
    incrementMoney,
    decrementMoney,
    setMoney,
    addPokemon,
    removePokemon,
    clearPokemons
  };
});