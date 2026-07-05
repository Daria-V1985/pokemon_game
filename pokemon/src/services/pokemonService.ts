import { lsHashMap } from "@/stores/lsHashMap";
import { type Pokemon } from "@/types/pokemon";

type PokemonBasicData = Pick<Pokemon, 'id' | 'name' | 'weight' | 'age'>;
type PokemonDetails = Omit<Pokemon, keyof PokemonBasicData>;

const mockPokemons: Pokemon[] = [
  { "id":1,"image":"./image/my-pokemon.png","name":"klody","view":"clefairy","weight":12,"money":1.1,"earned":11200,"age":"1 день" },
  { "id":2,"image":"./image/my-pokemon.png","name":"illy","view":"clefairy","weight":12,"money":1.1,"earned":11200,"age":"1 день" },
  { "id":3,"image":"./image/my-pokemon.png","name":"tote","view":"clefairy","weight":12,"money":1.1,"earned":11200,"age":"1 день" },
  { "id":4,"image":"./image/my-pokemon.png","name":"tote","view":"clefairy","weight":12,"money":1.1,"earned":11200,"age":"1 день" },
  { "id":5,"image":"./image/my-pokemon.png","name":"tote","view":"clefairy","weight":12,"money":1.1,"earned":11200,"age":"1 день" },
  { "id":6,"image":"./image/my-pokemon.png","name":"tote","view":"clefairy","weight":12,"money":1.1,"earned":11200,"age":"1 день" },
];

class PokemonService {
  private readonly POKEMONS_KEY = 'pokemons';
  private isLoaded = false;

  async loadAllPokemons(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const response = await fetch('https://9d6066f5473655c8.mokky.dev/pokemons');
      const data = await response.json();
      
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

      const key = this.POKEMONS_KEY;
      localStorage.setItem(key, JSON.stringify(pokemons));      
      this.isLoaded = true;
    } catch (err) {
      console.warn('Mokky API недоступен, инициализируем базовых покемонов из резерва');
      const basicBackup: PokemonBasicData[] = mockPokemons.map(p => ({
        id: p.id, name: p.name, weight: p.weight, age: p.age
      }));
      localStorage.setItem(this.POKEMONS_KEY, JSON.stringify(basicBackup));
      this.isLoaded = true;
    }
  }

  getBasicPokemons(): PokemonBasicData[] {
    const cached = localStorage.getItem(this.POKEMONS_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return mockPokemons;
      }
    }
    return mockPokemons.map(p => ({ id: p.id, image: p.image, name: p.name, view: p.view, weight: p.weight, money: p.money, 
      earned: p.earned, age: p.age}));
  }

  async loadFullPokemon(pokemonId: number): Promise<Pokemon | null> {
    try {
      const basicData = this.getBasicPokemons().find(pokemon => pokemon.id === pokemonId);

      if (!basicData) {
        console.warn(`Покемон ${pokemonId} не найден в базовых данных`);
        return mockPokemons.find(p => p.id === pokemonId) || null;
      }

      const response = await fetch(`https://9d6066f5473655c8.mokky.dev/pokemons/${pokemonId}`);
      
      if (!response.ok) {
        const backup = mockPokemons.find(p => p.id === pokemonId);
        return backup ? { ...basicData, ...backup } : null;
      }
      
      const apiData = await response.json();
      const currentHost = typeof window !== 'undefined' ? window.location.host : 'localhost:8080';
      
      const fullPokemon: Pokemon = {
        ...basicData,
        image: `http://${currentHost}/${apiData.image}`,
        view: apiData.view,
        money: apiData.money,
        earned: apiData.earned,
      };

      return fullPokemon;
    } catch (err) {
      return mockPokemons.find(p => p.id === pokemonId) || null;
    }
  }

  async fullDataPokemons(pokemonIds: number[]): Promise<Pokemon[]> {
    const promises = pokemonIds.map(id => this.loadFullPokemon(id));
    const results = await Promise.all(promises);
    
    return results.filter((pokemon): pokemon is Pokemon => pokemon !== null);
  }

  async getUserPokemonsWithDetails(userLogin: string): Promise<Pokemon[]> {
    const userData = lsHashMap.get(`userData_${userLogin}`);

    if (!userData || !userData.pokemons || !Array.isArray(userData.pokemons) || userData.pokemons.length === 0) {
      console.log(`У пользователя ${userLogin} нет покемонов. Выдаем стартовый набор`);
      return [ ...mockPokemons ];
    }

    const userPokemons = userData.pokemons;  
    const result: Pokemon[] = [];

    for (const userPokemon of userPokemons) {
      try {
        const response = await fetch(`https://9d6066f5473655c8.mokky.dev/pokemons/${userPokemon.id}`);
      
        if (!response.ok) {
          console.warn(`API недоступно для покемона ${userPokemon.id}, используем данные из LS`);
          const backupItem = mockPokemons.find(p => p.id === userPokemon.id)
          result.push({ 
            ...userPokemon,
           image: userPokemon.image || backupItem?.image || ''
          } as Pokemon);
          continue;
        }
        
        const apiData = await response.json();
        const currentHost = typeof window !== 'undefined' ? window.location.host : 'localhost:8080';
        
        const fullPokemon: Pokemon = {
          id: userPokemon.id,
          name: userPokemon.name, 
          weight: userPokemon.weight,
          age: userPokemon.age,
          image: `http://${currentHost}/${apiData.image}`,
          view: apiData.view,
          money: apiData.money,
          earned: apiData.earned
        };

        result.push(fullPokemon);
      } catch (err) {
        const backupItem = mockPokemons.find(p => p.id === userPokemon.id);
        result.push({
          ...userPokemon,
          image: userPokemon.image || backupItem?.image || ''
        } as Pokemon);
      }
    }

    return result;
  }

  getAllPokemons(): Pokemon[] {
    const cached = lsHashMap.get(this.POKEMONS_KEY);
    return cached && Array.isArray(cached) ? cached : mockPokemons;
  }

  getUserPokemons (userLogin: string): Pokemon[] {
    const userData = lsHashMap.get(`userData_${userLogin}`);
    if (userData?.pokemons || userData.pokemons.length === 0) {
      return [ ...mockPokemons ];
    }
    return userData.pokemons;
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