<template>
  <div class="pokemons__cards">
    <PokemonCard 
      v-for="pokemon in pokemons"
      :key="pokemon.id"
      :id="pokemon.id"
      :name="pokemon.name"
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
import { ref, onMounted } from "vue";
import PokemonCard from './PokemonCard.vue';
import PokemonModal from './PokemonModal.vue';

interface Pokemon {
  id: number,
  name: string,
  image: string,
  weight: number,
  money: number,
  earned: number,
  age: string,
}

const API_URL = 'https://9d6066f5473655c8.mokky.dev/pokemons';
const pokemons = ref<Pokemon[]>([]);
const showModal = ref(false);
const selectedPokemon = ref<Pokemon | null>(null);

const loadPokemons = async () => {
  try {
    const response = await fetch(API_URL);
    const data: Pokemon[] = await response.json();
    pokemons.value = data;
  } catch (err) {
    console.error('Ошибка загрузки данных из API:', err);
  }
}

const openSettings = (id: number): void => {
  const pokemon = pokemons.value.find(pokemon => pokemon.id === id)
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
  await loadPokemons();
  const freshPokemon = pokemons.value.find(pokemon => pokemon.id === updatedPokemon.id);
  if (freshPokemon) {
    selectedPokemon.value = freshPokemon;
  } else {
    console.warn('Обновлённый покемон не найден!');
  }
  console.log('Список и модал обновлены после изменения в API');
};

onMounted(() => {
  loadPokemons();
})

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