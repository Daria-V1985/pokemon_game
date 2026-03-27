import { lsHashMap } from "@/stores/lsHashMap";

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  weight: number;
  money: number;
  earned: number;
  age: string;
}

class PokemonService {
  private readonly POKEMONS_KEY = 'pokemons';
  private isLoaded = false;

  async loadAllPokemons(): Promise<void> {
    if (this.isLoaded) {
      console.log('Покемоны уже загружены');
      return;
    } 
    console.log('Загрузка покемонов из API...');

    try {
      const response = await fetch('https://9d6066f5473655c8.mokky.dev/pokemons');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Данные от API:', data);
      if (!data || typeof data !== 'object') {
        throw new Error('Некорректный формат данных от API');
      }
      
      let pokemonsArray: any[] = [];

      if (Array.isArray(data)) {
        // Если API возвращает массив напрямую
        pokemonsArray = data;
      } else if (data.results && Array.isArray(data.results)) {
        // Если API возвращает объект с полем results
        pokemonsArray = data.results;
      } else if (data.pokemons && Array.isArray(data.pokemons)) {
        // Если API возвращает объект с полем pokemons
        pokemonsArray = data.pokemons;
      } else {
        throw new Error('Неизвестная структура данных от API');
      }
      
      console.log(`Найдено покемонов: ${pokemonsArray.length}`);

      const pokemons: Pokemon[] = await Promise.all(
        data.results.map(async (pokemon: any, index: number) => {
          const detailsResponse = await fetch(pokemon.url);
          const details = await detailsResponse.json();
          let imageUrl = details.sprites.front_default;

          if (!imageUrl) {
            imageUrl = `https://9d6066f5473655c8.mokky.dev/pokemon/${details.id}.png`;
          }
          
          console.log(`Покемон ${details.name}:`, imageUrl);

          return {
            id: details.id,
            name: details.name,
            image: imageUrl,
            weight: details.weight,
            money: Math.floor(Math.random() * 1000) + 100,
            earned: 0, 
            age: '1 день' 
          };
        })
      );

      lsHashMap.set(this.POKEMONS_KEY, pokemons);
      this.isLoaded = true;
      console.log(`Загружено ${pokemons.length} покемонов в LS`);

      const savedData = lsHashMap.get(this.POKEMONS_KEY);
      console.log(`Сохранено ${savedData?.length || 0} покемонов под ключом: ${this.POKEMONS_KEY}`);
    } catch (error) {
      console.error('Ошибка загрузки покемонов:', error);
    }
  }

  getAllPokemons(): Pokemon[] {
    const cached = lsHashMap.get(this.POKEMONS_KEY);
    console.log(`Поиск покемонов по ключу: ${this.POKEMONS_KEY}, найдено: ${cached?.length || 0}`);
    return cached && Array.isArray(cached) ? cached : [];
  }

  getUserPokemons (userId: string): Pokemon[] {
    const userData = lsHashMap.get(`userData_${userId}`);
    return userData?.pokemons || [];
  }

  isPokemonsLoaded(): boolean {
    return this.isLoaded;
  }

  clearCache(): void {
    lsHashMap.remove(this.POKEMONS_KEY);
    this.isLoaded = false;
  }
}

export const pokemonService = new PokemonService();