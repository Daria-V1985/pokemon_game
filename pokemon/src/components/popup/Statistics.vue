<template>
  <PokemonInfo :pokemon="props.pokemon" />
  <PokemonCtrls 
    :pokemon="props.pokemon"
    @saveName="savePokemonName"
  />
</template>

<script lang="ts" setup>
import PokemonInfo from './PokemonInfo.vue';
import PokemonCtrls from './PokemonCtrls.vue';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/AuthStore';
import { Pokemon } from "@/types/pokemon";

const props = defineProps<{
  pokemon: Pokemon;
}>();

const emit = defineEmits<{
  'updatePokemon': [pokemon: Pokemon];
}>();

const savePokemonName = async (args: { name: string; pokemon?: Pokemon | undefined; }) => {
  if (!props.pokemon) {
    alert('Ошибка: данные покемона не загружены');
    return;
  }
  
  try {
    const updatedPokemon = { ...props.pokemon, name: args.name };
    const authStore = useAuthStore();
    const userStore = useUserStore();

    if (!authStore.user?.login) {
      alert('Ошибка авторизации');
      return;
    }

    const userLogin = authStore.user.login;

    if (!Array.isArray(userStore.pokemons)) {
      userStore.pokemons = []; 
    }

    const pokemonIndex = userStore.pokemons.findIndex((pokemon: any) => pokemon.id === props.pokemon!.id);
    
    if (pokemonIndex === -1) {
      alert('Ошибка: покемон не найден');
      return;
    }

    const updatedPokemons = [...userStore.pokemons];
    updatedPokemons[pokemonIndex] = { ...updatedPokemon };
    
    userStore.pokemons = updatedPokemons;
    userStore.saveUserData(userLogin);
    
    const savedData = JSON.parse(localStorage.getItem(`userData_${userLogin}`) || '{}');
    const savedPokemon = savedData.pokemons?.find((pokemon: any) => pokemon.id === props.pokemon!.id);
    
    if (savedPokemon?.name === args.name) {
      console.log('✅ Проверка: имя успешно сохранено в LocalStorage');
    } else {
      console.warn('⚠️ Проверка: имя не найдено в сохраненных данных');
    }
    
    emit('updatePokemon', updatedPokemon);
    alert(`Имя покемона изменено на: ${args.name}`);
  } catch (error) {
    alert('Ошибка при сохранении имени');
  }
};

</script>