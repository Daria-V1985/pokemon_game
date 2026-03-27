import { defineStore } from 'pinia';
import { ref } from 'vue';
import { lsHashMap } from './lsHashMap';
import { pokemonService, type Pokemon } from '@/services/pokemonService';

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
        console.log('Данные пользователя загружены из LS');
      } catch (err) {
        console.error('Не удалось обработать данные:', err);
      }
    } else {
      console.log('Сохраненных данных пользователя не найдено');
    }
  };

  const saveUserData = (userLogin: string) => {
    console.log('saveUserData вызван для:', userLogin);
    if (!isInitial.value) {
      console.log('Store не инициализирован, пропускаем сохранение');
      return;
    }
      
    const userData = {
      money: money.value,
      pokemons: pokemons.value,
    };
    console.log('Сохраняемые данные:', userData);
    lsHashMap.set(`userData_${userLogin}`, userData);  
    console.log('Данные пользователя сохранены в LS');

    const savedData = lsHashMap.get(`userData_${userLogin}`);
    console.log('Проверка сохранения:', savedData);
  };

  const initNewUser = (resMoney: boolean = true) => {
    console.log('initNewUser вызван. Текущие данные:', {
      money: money.value,
      pokemons: pokemons.value.length
    });

    if (resMoney) {
      money.value = 0;
    }
    pokemons.value = [];
    isInitial.value = true;

    console.log('initNewUser завершен. Новые данные:', {
      money: money.value,
      pokemons: pokemons.value.length
    });
  };

  const setInitialData = (data: { money: number; pokemons: Pokemon[] }, userLogin: string) => {
    console.log('setInitialData вызван с:', data);
    console.log('Логин пользователя:', userLogin);
    
    money.value = data.money;
    pokemons.value = [...data.pokemons];
    isInitial.value = true;

    console.log('Данные до сохранения:', { money: money.value, pokemons: pokemons.value });
    saveUserData(userLogin);
    console.log('Данные после сохранения:', { money: money.value, pokemons: pokemons.value });

    const checkData = lsHashMap.get(`userData_${userLogin}`);
    console.log('Данные после сохранения:', checkData);
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