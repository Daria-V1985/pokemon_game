<template>
  <PokemonInfo :pokemon="currentPokemon" />
  <PokemonCtrls 
    :pokemon="currentPokemon"
    @saveName="savePokemonName"
    @deletePokemon="handleDeletePokemon"
  />
</template>

<script lang="ts" setup>
import PokemonInfo from './PokemonInfo.vue';
import PokemonCtrls from './PokemonCtrls.vue';
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/AuthStore';
import { Pokemon } from "@/types/pokemon";

const props = defineProps<{
  pokemon?: Pokemon;
}>();

const emit = defineEmits<{
  'updatePokemon': [pokemon: Pokemon];
  'pokemonDeleted': [pokemonId: number];
}>();

const userStore = useUserStore();
const authStore = useAuthStore();
const currentPokemon = ref<Pokemon | null>(props.pokemon || null);

watch(() => props.pokemon, (newPokemon) => {
  currentPokemon.value = newPokemon || null;
})

const savePokemonName = async (args: { name: string; pokemon?: Pokemon | undefined; }) => {
  if (!currentPokemon.value) {
    alert('Ошибка: данные покемона не загружены');
    return;
  }
  
  try {
    const updatedPokemon = { ...currentPokemon.value, name: args.name };

    if (!authStore.user?.login) {
      alert('Ошибка авторизации');
      return;
    }

    const pokemonIndex = userStore.pokemons.findIndex((pokemon: any) => pokemon.id === currentPokemon.value!.id);
    if (pokemonIndex === -1) {
      alert('Ошибка: покемон не найден');
      return;
    }

    userStore.pokemons[pokemonIndex] = { ...updatedPokemon };
    userStore.saveUserData(authStore.user.login);    
    currentPokemon.value = updatedPokemon;
    alert(`Имя покемона изменено на: ${args.name}`);
  } catch (err) {
    alert('Ошибка при сохранении имени');
  }
};

const handleDeletePokemon = (pokemonId: number) => {

  try {
    if (!authStore.user?.login) {
      alert('Ошибка авторизации!');
      return;
    }
    const pokemonDelete = currentPokemon.value;
    const success = userStore.deletePokemon(pokemonId);

    if (success) {
      console.log(`Покемон "${pokemonDelete?.name}" удален`);
      currentPokemon.value = null;
      emit('pokemonDeleted', pokemonId);
      
      alert(`Покемон "${pokemonDelete?.name}" успешно удален!`);
    } else {
      alert('Не удалось удалить покемона');
    }
  } catch (err) {
    console.error('Ошибка при удалении покемона:', err);
    alert('Произошла ошибка при удалении');
  }
};

</script>