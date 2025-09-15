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
</template>

<script lang="ts" setup>
import PokemonCard from './PokemonCard.vue';
import { ref, onMounted } from "vue";

interface Pokemon {
  id: number,
  name: string,
  image: string,
  weight: number,
  money: number,
}

const API_URL = 'https://9d6066f5473655c8.mokky.dev/pokemons';
const pokemons = ref<Pokemon[]>([]);

const loadPokemons = async (): Promise<void> => {
  try {
    const response = await fetch(API_URL)
    const data: Pokemon[] = await response.json()
    pokemons.value = data
  } catch (err) {
    console.error('Ошибка загрузки данных из API:', err)
  }
}

const openSettings = (id: number): void => {
  const pokemon = pokemons.value.find(p => p.id === id)
  console.log('Открыть настройки для покемона:', pokemon)
}

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