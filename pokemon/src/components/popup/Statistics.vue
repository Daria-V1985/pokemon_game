<template>
  <PokemonInfo :pokemon="pokemon" />
  <PokemonCtrls 
    :pokemon="pokemon"
  />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import PokemonInfo from './PokemonInfo.vue';
import PokemonCtrls from './PokemonCtrls.vue';

interface Pokemon {
  id: number,
  image: string,
  name: string;
  weight: number,
  money: number,
  earned: number,
  age: string,
}

defineProps<{
  pokemon: Pokemon | null;
}>();
</script>