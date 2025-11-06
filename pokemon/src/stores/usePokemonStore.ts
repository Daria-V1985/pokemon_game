import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Pokemon {
  id: number;
  name: string;
  image: string,
  weight: number,
  money: number,
  earned: number,
  age: string,
}

export const usePokemonStore = defineStore('pokemon', () => {
  const userPokemons = ref<Pokemon[]>([]);

  const loadFromStorage = (authLogin: string) => {
    const key = `pokemons_${authLogin}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      userPokemons.value = JSON.parse(stored);
      console.log('Покемоны загружены из LS');
    } else {
      console.log('LS пустой, нужна загрузка из API');
    }
  };

  const saveToStorage = (authLogin: string) => {
    const key = `pokemons_${authLogin}`;
    localStorage.setItem(key, JSON.stringify(userPokemons.value));
    console.log('Покемоны сохранены в LS');
  };

  const loadFromAPI = async (authLogin: string) => {
    try {
      const response = await fetch('https://9d6066f5473655c8.mokky.dev/pokemons');
      const data: Pokemon[] = await response.json();
      
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomPokemon = data[randomIndex];
        
        userPokemons.value = [randomPokemon];
        saveToStorage(authLogin);  
        console.log(`Рандомный покемон "${randomPokemon.name}" загружен из API и сохранён в LS`);
      } else {
        throw new Error('API вернул пустой список');
      }
    } catch (err) {
      console.error('Ошибка загрузки из API:', err);
      throw err;
    }
  };

  return {
    userPokemons,
    loadFromStorage,
    saveToStorage,
    loadFromAPI,
  };
});