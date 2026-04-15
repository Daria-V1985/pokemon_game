<template>
  <div class="pokemons__cards">
    <PokemonCard 
      v-for="pokemon in userPokemons"
      :key="pokemon.id"
      :id="pokemon.id"
      :name="pokemon.name"
      :view="pokemon.view"
      :image="pokemon.image"
      :weight="pokemon.weight"
      :money="pokemon.money"
      @click="openSettings(pokemon.id)"
    />
  </div>
  <PokemonModal 
    v-model:modelValue="showModal" 
    :pokemon="selectedPokemon"
    @updatePokemon="updatePokemonInfo"
    @close="closeSettings"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { pokemonService } from "@/services/pokemonService" 
import { Pokemon } from "@/types/pokemon";
import PokemonCard from './PokemonCard.vue';
import PokemonModal from './PokemonModal.vue';

const authStore = useAuthStore();
const userStore = useUserStore();
const userPokemons = ref<Pokemon[]>([]);
const showModal = ref(false);
const selectedPokemon = ref<Pokemon | null>(null);

const loadUserPokemons = async () => {

  if (!authStore.user?.login) {
    userPokemons.value = [];
    return;
  }
  try {
    const pokemonsWithDetails = await pokemonService.getUserPokemonsWithDetails(authStore.user.login);   
    userPokemons.value = pokemonsWithDetails;
    
    if (pokemonsWithDetails.length > 0) {
      userStore.pokemons = [...pokemonsWithDetails];
    }  
  } catch (err) {
    console.error('Ошибка загрузки покемонов:', err);
    userPokemons.value = [];
    
    if (userStore.pokemons.length > 0) {
      userPokemons.value = [...userStore.pokemons];
    }
  }
};

const openSettings = (id: number): void => {
  const pokemon = userPokemons.value.find((pokemon: any) => pokemon.id === id)
  if (pokemon) {
    selectedPokemon.value = structuredClone(pokemon);
    showModal.value = true;
  } else {
    console.warn(`Покемон с id ${id} не найден`);
  }
}

const closeSettings = () => {
  showModal.value = false;
  selectedPokemon.value = null;
};

const updatePokemonInfo = async (updatedPokemon: Pokemon) => {
  const index = userPokemons.value.findIndex((pokemon: any) => pokemon.id === updatedPokemon.id);
  try {
    if (index !== -1) {
    const updatedArray = [...userPokemons.value];
      updatedArray[index] = { ...updatedPokemon };
      userPokemons.value = updatedArray;
  }

  if (authStore.user?.login) {
      userStore.saveUserData(authStore.user.login);
    }

  await loadUserPokemons();
  } catch (err) {
    console.error('Ошибка при обновлении покемона:', err);
  }
};

onMounted(() => {
  loadUserPokemons();
})

watch(() => userStore.isInitial, (isInitial) => {
  if (isInitial) {
    loadUserPokemons();
  }
});

watch(() => authStore.user, (newUser) => {
    console.log('Статус авторизации изменился:', newUser?.login);
    loadUserPokemons();
});

</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.pokemons {
  &__cards {
    display: grid;
    grid-template-columns: repeat(4, auto);
    margin: 16px auto;
    column-gap: 6px;
    row-gap: 12px;
  }
}
</style>