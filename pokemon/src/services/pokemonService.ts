import { lsHashMap } from "@/stores/lsHashMap";
import { type Pokemon } from "@/types/pokemon";

type PokemonBasicData = Pick<Pokemon, 'id' | 'name' | 'weight' | 'age'>;
type PokemonDetails = Omit<Pokemon, keyof PokemonBasicData>;

class PokemonService {
  private readonly POKEMONS_KEY = 'pokemons';
  private isLoaded = false;

  async loadAllPokemons(): Promise<void> {
    if (this.isLoaded) {
      console.log('Покемоны уже загружены');
      return;
    } 
    console.log('=== НАЧАЛО ЗАГРУЗКИ ПОКЕМОНОВ ===');

    try {
      console.log('1. Делаем запрос к API...');
      const response = await fetch('https://9d6066f5473655c8.mokky.dev/pokemons');
      console.log('API ответил, статус:', response.status);
      const data = await response.json();
      
      console.log('2. Данные получены:');
      console.log('   Количество покемонов:', Array.isArray(data) ? data.length : 'N/A');

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Нет данных для обработки');
      }

      const pokemons: PokemonBasicData[] = data.map((pokemon: any) => {
        
          return {
            id: pokemon.id,
            name: pokemon.name,
            weight: pokemon.weight,
            age: pokemon.age 
          };
        });

      console.log(`3. Сохраняем ${pokemons.length} базовых записей в LS...`);
      console.log('Пример базовой записи:', pokemons[0]);

      const key = this.POKEMONS_KEY;
      localStorage.setItem(key, JSON.stringify(pokemons));
      console.log(`Сохранено напрямую в localStorage под ключом "${key}"`);
      console.log(`Ключ "${key}" создан с ${pokemons.length} покемонами`);
      
      this.isLoaded = true;
      console.log(`Загружено ${pokemons.length} покемонов в LS`);      
      console.log('=== ЗАГРУЗКА ЗАВЕРШЕНА ===');
    } catch (error) {
      console.warn('Ошибка загрузки покемонов:', error);
      this.isLoaded = false;
    }
  }

  getBasicPokemons(): PokemonBasicData[] {
    const cached = localStorage.getItem(this.POKEMONS_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return [];
      }
    }
    return [];
  }

  async loadFullPokemon(pokemonId: number): Promise<Pokemon | null> {
    try {
      console.log(`Загружаем полные данные покемона ${pokemonId}...`);
      const basicData = this.getBasicPokemons().find(pokemon => pokemon.id === pokemonId);

      if (!basicData) {
        console.warn(`Покемон ${pokemonId} не найден в базовых данных`);
        return null;
      }

      const response = await fetch(`https://9d6066f5473655c8.mokky.dev/pokemons/${pokemonId}`);
      
      if (!response.ok) {
        console.warn(`Покемон ${pokemonId} не найден в API`);
        return null;
      }
      
      const apiData = await response.json();
      const fullPokemon: Pokemon = {
        ...basicData,
        image: `http://localhost:8080/${apiData.image}`,
        view: apiData.view,
        money: apiData.money,
        earned: apiData.earned,
      };

      console.log(`Полные данные покемона ${pokemonId} загружены`);
      return fullPokemon;
    } catch (err) {
      console.error(`Ошибка загрузки покемона ${pokemonId}:`, err);
      return null;
    }
  }

  async fullDataPokemons(pokemonIds: number[]): Promise<Pokemon[]> {
    console.log(`Загружаем ${pokemonIds.length} покемонов с деталями...`);
    const promises = pokemonIds.map(id => this.loadFullPokemon(id));
    const results = await Promise.all(promises);
    
    return results.filter((pokemon): pokemon is Pokemon => pokemon !== null);
  }

  async getUserPokemonsWithDetails(userLogin: string): Promise<Pokemon[]> {
    console.log(`Загрузка покемонов пользователя ${userLogin}...`);
    const userData = lsHashMap.get(`userData_${userLogin}`);

    if (!userData || !userData.pokemons || !Array.isArray(userData.pokemons)) {
      console.log(`У пользователя ${userLogin} нет покемонов`);
      return [];
    }

    const userPokemons = userData.pokemons;
    console.log(`Найдено ${userPokemons.length} покемонов в LS`);
  
    const result: Pokemon[] = [];

    for (const userPokemon of userPokemons) {
      try {
        const response = await fetch(`https://9d6066f5473655c8.mokky.dev/pokemons/${userPokemon.id}`);
      
        if (!response.ok) {
          console.warn(`API недоступно для покемона ${userPokemon.id}, используем данные из LS`);
          result.push(userPokemon as Pokemon);
          continue;
        }
        
        const apiData = await response.json();
        const fullPokemon: Pokemon = {
          id: userPokemon.id,
          name: userPokemon.name, 
          weight: userPokemon.weight,
          age: userPokemon.age,
          image: `http://localhost:8080/${apiData.image}`,
          view: apiData.view,
          money: apiData.money,
          earned: apiData.earned
        };

        result.push(fullPokemon);
        console.log(`Покемон ${userPokemon.id}: "${userPokemon.name}"`);
      } catch (err) {
        console.error(`Ошибка загрузки покемона ${userPokemon.id}:`, err);
        result.push(userPokemon as Pokemon);
      }
    }

    console.log(`Итого загружено: ${result.length} покемонов`);
    return result;
  }

  getAllPokemons(): Pokemon[] {
    const cached = lsHashMap.get(this.POKEMONS_KEY);
    return cached && Array.isArray(cached) ? cached : [];
  }

  getUserPokemons (userLogin: string): Pokemon[] {
    const userData = lsHashMap.get(`userData_${userLogin}`);
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