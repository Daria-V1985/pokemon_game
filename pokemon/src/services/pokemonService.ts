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
    console.log('=== НАЧАЛО ЗАГРУЗКИ ПОКЕМОНОВ ===');

    try {
      console.log('1. Делаем запрос к API...');
      const response = await fetch('https://9d6066f5473655c8.mokky.dev/pokemons');
      console.log('API ответил, статус:', response.status);
      const data = await response.json();
      
      console.log('2. Данные получены:');
      console.log('   Тип:', typeof data);
      console.log('   Это массив?', Array.isArray(data));
      console.log('   Количество покемонов:', Array.isArray(data) ? data.length : 'N/A');

      if (Array.isArray(data) && data.length > 0) {
        console.log('3. Первый элемент массива:', data[0]);
        console.log('Ключи первого элемента:', Object.keys(data[0]));
      }

      console.log('4. Проверяем структуру данных...');

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Нет данных для обработки');
      }

      const pokemons: Pokemon[] = data.map((pokemon: any, index: number) => {
          let imageUrl = pokemon.image;

          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
          imageUrl = '/' + imageUrl;
        }
        
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `http://192.168.0.102:8080${imageUrl}`;
        }

          return {
            id: pokemon.id,
            name: pokemon.name,
            image: `http://localhost:8080/${pokemon.image}`,
            weight: pokemon.weight,
            money: pokemon.money,
            earned: pokemon.earned, 
            age: pokemon.age 
          };
        });

      console.log(`5. Обработано ${pokemons.length} покемонов`);
      console.log('   Пример покемона:', pokemons[0]);

      console.log('6. Сохраняем в LocalStorage...');
      const key = this.POKEMONS_KEY;
      localStorage.setItem(key, JSON.stringify(pokemons));
      console.log(`Сохранено напрямую в localStorage под ключом "${key}"`);
      console.log(`Ключ "${key}" создан с ${pokemons.length} покемонами`);

      lsHashMap.set(key, pokemons);
      lsHashMap.flush(key);
      
      this.isLoaded = true;
      console.log(`Загружено ${pokemons.length} покемонов в LS`);

      console.log('7. Проверяем сохранение...');
      const savedData = lsHashMap.get(key);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log(`   🎉 УСПЕХ! В LS сохранено ${parsed.length} покемонов`);
      } else {
        console.error('   ❌ ОШИБКА: Данные не сохранились!');
      }
      
      console.log('=== ЗАГРУЗКА ЗАВЕРШЕНА ===');
    } catch (error) {
      console.warn('Ошибка загрузки покемонов:', error);
      this.isLoaded = false;
    }
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