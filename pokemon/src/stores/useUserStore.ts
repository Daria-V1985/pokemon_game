import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Pokemon {
  id: number,
  name: string,
  sprite: string,
}

export const useUserStore = defineStore('user', () => {
  const money = ref(0);
  const pokemons = ref<Pokemon[]>([]);
  const isInitial = ref(false);
  
  const hasData = computed(() => isInitial.value && (money.value > 0 || pokemons.value.length > 0));

  const initNewUser = () => {
    money.value = 0;
    pokemons.value = [];
    isInitial.value = true;
  };

  const loadUserData = () => {
    const data = localStorage.getItem('userData');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        money.value = parsedData.money || 0;
        pokemons.value = parsedData.pokemons || [];
        isInitial.value = true;
      } catch (err) {
        console.error('Не удалось обработать данные:', err);
        initNewUser();
      }
    }
  };

  const saveUserData = () => {
    if (!isInitial.value) return;
      
    const userData = {
      money: money.value,
      pokemons: pokemons.value
    };
    localStorage.setItem(`userData`, JSON.stringify(userData));  
  };

  const addMoney = (sum: number) => {
    money.value += sum;
  };

  const addPokemon = (pokemon: Pokemon) => {
    pokemons.value.push(pokemon);
  };

  return {
    money,
    pokemons,
    isInitial,
    hasData,
    initNewUser,
    loadUserData,
    saveUserData,
    addMoney,
    addPokemon
  };
});