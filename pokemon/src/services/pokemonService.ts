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
  private readonly POKEMONS_KEY = 'all_pokemons';
  //private readonly USER_POKEMONS_PREFIX = 'user_pokemons_';
  private isLoaded = false;

  async loadAllPokemons(): Promise<Pokemon[]> {
    console.log('Загрузка покемонов из API...');

    const cached = lsHashMap.get(this.POKEMONS_KEY);
    if (cached && Array.isArray(cached)) {
      console.log('Покемоны загружены из кэша LSHashMap');
      this.isLoaded = true;
      return cached;
    }

    try {
      const response = await fetch('https://9d6066f5473655c8.mokky.dev/pokemons');
      const data = await response.json();

      const pokemons: Pokemon[] = await Promise.all(
        data.results.map(async (pokemon: any, index: number) => {
          const detailsResponse = await fetch(pokemon.url);
          const details = await detailsResponse.json();

          return {
            id: details.id,
            name: details.name,
            image: details.sprites.front_default,
            weight: details.weight,
            money: Math.floor(Math.random() * 1000) + 100,
            earned: 0, 
            age: '1 день' 
          };
        })
      );

      lsHashMap.set(this.POKEMONS_KEY, pokemons);
      this.isLoaded = true;
      console.log(`✅ Сохранено ${pokemons.length} покемонов в кэш LSHashMap`);
      return pokemons;
    } catch (error) {
      console.error('❌ Ошибка загрузки покемонов:', error);
      this.isLoaded = false;
      return [];
    }
  }

  getAllPokemons(): Pokemon[] {
    const cached = lsHashMap.get(this.POKEMONS_KEY);
    return cached && Array.isArray(cached) ? cached : [];
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