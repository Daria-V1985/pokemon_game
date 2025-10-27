<template>
  <PokemonInfo :pokemon="props.pokemon" />
  <PokemonCtrls 
    :pokemon="props.pokemon"
    @saveName="savePokemonName"
  />
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
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

const props = defineProps<{
  pokemon: Pokemon | null;
}>();

const emit = defineEmits<{
  'updatePokemon': [pokemon: Pokemon];
}>();

const API_URL = 'https://9d6066f5473655c8.mokky.dev/pokemons';

const savePokemonName = async (args: { name: string; pokemon?: Pokemon | undefined; }) => {
  if (!props.pokemon) return;
  
  try {
    const updatedPokemon = { ...props.pokemon, name: args.name };
    const response = await fetch(`${API_URL}/${props.pokemon.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPokemon),
    });
    if (response.ok) {
      emit('updatePokemon', updatedPokemon); 
      console.log(`Имя сохранено в API: ${args.name}`);
    } else {
      alert('Ошибка сохранения в API');
    }
  } catch (err) {
    console.error('Ошибка обновления:', err);
    alert('Ошибка сети');
  }
};
</script>