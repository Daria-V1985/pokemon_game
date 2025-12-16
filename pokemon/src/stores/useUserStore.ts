import { defineStore } from 'pinia';
import { lsHashMap } from '@/stores/lsHashMap'; 
import { useAuthStore } from './AuthStore';

interface UserState {
  money: number;
  pokemons: lsHashMap<Pokemon>;
}

interface Pokemon {
  id: number,
  name: string,
  image: string,
  weight: number,
  money: number,
  earned: number,
  age: string,
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    money: 100,
    pokemons: new lsHashMap<Pokemon>(''),
  }),

  actions: {
    initStore() {
      const authStore = useAuthStore();

      if (authStore.user?.authLogin) {
        const storageKey = `qwery_${authStore.user.authLogin}`;
        const userDataStr = localStorage.getItem(storageKey);
        
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          this.money = userData.money || 100;
        }
        this.pokemons = new lsHashMap<Pokemon>('guest_pokemons');
      }
    },

    addPokemon(pokemonData: Pokemon) {
      this.pokemons.set(pokemonData.id.toString(), pokemonData);
      this.saveUserData();
    },

    removePokemon(pokemonId: Pokemon) {
      this.pokemons.delete(pokemonId.toString());
      this.saveUserData();
    },

    getPokemon(pokemonId: Pokemon) {
      return this.pokemons.get(pokemonId.toString());
    },

    getAllPokemons() {
      return this.pokemons.getAllValues();
    },

    updateMoney(amount: number) {
      this.money = amount;
      this.saveUserData();
    },

    addMoney(amount: number) {
      this.money += amount;
      this.saveUserData(); 
    },

    saveUserData() {
      const authStore = useAuthStore();
      
      if (authStore.user?.authLogin) {
        const storageKey = `qwery_${authStore.user.authLogin}`;
        const userData = {
          money: this.money,
        };
        localStorage.setItem(storageKey, JSON.stringify(userData));
      }
    },

    resetUserData() {
      this.money = 100;
      this.pokemons = new lsHashMap<Pokemon>('');
    }
  },
});