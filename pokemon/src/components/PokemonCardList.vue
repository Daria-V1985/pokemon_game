<template>
  <div class="pokemons__cards">
    <PokemonCard 
      v-for="pokemon in userStore.pokemons"
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
    @pokemonDeleted="handlePokemonDeleted"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { Pokemon } from "@/types/pokemon";
import PokemonCard from './PokemonCard.vue';
import PokemonModal from './PokemonModal.vue';

const authStore = useAuthStore();
const userStore = useUserStore();
const showModal = ref(false);
const selectedPokemon = ref<Pokemon | null>(null);

const openSettings = (id: number): void => {
  const pokemon = userStore.pokemons.find((pokemon: any) => pokemon.id === id)
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
  const index = userStore.pokemons.findIndex((pokemon: any) => pokemon.id === updatedPokemon.id);
  if (index !== -1) {
    userStore.pokemons[index] = { ...updatedPokemon };
  }

  if (authStore.user?.login) {
    userStore.saveUserData(authStore.user.login);
  }
};

const handlePokemonDeleted = () => {
  closeSettings();
};

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