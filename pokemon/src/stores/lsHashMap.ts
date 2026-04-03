import UserLogin from "@/components/UserLogin.vue";

class LSHashMap {
  static instance: LSHashMap;
  cache: Map<string, any> = new Map();
  pendingWrites: Set<string> = new Set();
  writeTimeout: number | null = null;

  constructor() {
    this.setupEventListeners();
  }

  static getInstance(): LSHashMap {
    if (!LSHashMap.instance) {
      LSHashMap.instance = new LSHashMap();
    }
    return LSHashMap.instance;
  }

  setupEventListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('DOMContentLoaded', () => {
        this.loadAllData();
      });
      window.addEventListener('beforeunload', () => {
        this.flushAllData();
      });
      window.addEventListener('unload', () => {
        this.flushAllData();
      });

      setInterval(() => {
        this.flushPendingWrite();
      }, 30000);
    }
  }

  loadAllData() {
    for (let i = 0; i < localStorage.length; i++) {
      const id = localStorage.key(i);
      if (id) {
        try {
          const value = localStorage.getItem(id);
          if (value) {
            this.cache.set(id, JSON.parse(value));
          }
        } catch (err) {
          console.warn(`Не удалось обработать данные: ${id}`, err);
        }
      }
    }
  }

  get(id: string) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    const data = localStorage.getItem(id);
    if (data) {
      try {
        const dataValue = JSON.parse(data);
        this.cache.set(id, dataValue);
        return dataValue;
      } catch (err) {
        console.warn(`Не удалось обработать данные: ${id}`, err);
        return null;
      }
    }
    return null;
  }
 
  set (id: string, data: any) {
    this.cache.set(id, data);
    this.pendingWrites.add(id);

    if(this.writeTimeout) {
      clearTimeout(this.writeTimeout);
    }

    this.writeTimeout = window.setTimeout(() => {
      this.flushPendingWrite();
    }, 1000);
  }

  flush(id: string) {
    if (this.cache.has(id)) {
      try {
        localStorage.setItem(id, JSON.stringify(this.cache.get(id)));
        this.pendingWrites.delete(id);
      } catch (err) {
        console.warn(`Не удалось обработать данные: ${id}`, err);
      }
    }
  }

  flushPendingWrite() {
    this.pendingWrites.forEach(id => {
      this.flush(id);
    });
  }

  flushAllData() {
    this.cache.forEach((data, id) => {
      this.flush(id);
    });
  }

  remove(id: string) {
    this.cache.delete(id);
    this.pendingWrites.delete(id);
    localStorage.removeItem(id);
  }

  clearCache() {
    this.cache.clear();
    this.pendingWrites.clear();
  }

  getAuthUser() {
    return this.get('authUser') as { id: string, login: string } | null;
  }

  getUserData(userLogin: string) {
    return this.get(`userData_${userLogin}`) as {
      money: number;
      pokemons: any[];
    } | null;
  }

  getPokemonAlias(pokemonId: number) {
    return this.get(`pokemonAlias_${pokemonId}`) as string | null;
  }
}

export const lsHashMap = LSHashMap.getInstance();