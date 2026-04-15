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
    console.warn('Нет данных покемона для сохранения');
    console.error('Ошибка: props.pokemon равен null');
    alert('Ошибка: данные покемона не загружены');
    return;
  }

  console.log('Сохраняем имя покемона в LocalStorage...');
  console.log('ID покемона:', props.pokemon.id);
  console.log('Старое имя:', props.pokemon.name);
  console.log('Новое имя:', args.name);
  
  try {
    const updatedPokemon = { ...props.pokemon, name: args.name };
    const authStore = useAuthStore();
    const userStore = useUserStore();

    if (!authStore.user?.login) {
      console.error('Пользователь не авторизован');
      alert('Ошибка авторизации');
      return;
    }

    const userLogin = authStore.user.login;
    console.log(`Пользователь: ${userLogin}`);

    if (!Array.isArray(userStore.pokemons)) {
      console.error('userStore.pokemons не является массивом:', userStore.pokemons);
      userStore.pokemons = []; 
    }

    const pokemonIndex = userStore.pokemons.findIndex((pokemon: any) => pokemon.id === props.pokemon!.id);
    console.log(`Индекс покемона в userStore: ${pokemonIndex}`);
    
    if (pokemonIndex === -1) {
      console.error(`Покемон с ID ${props.pokemon.id} не найден у пользователя`);
      alert('Ошибка: покемон не найден');
      return;
    }

    const updatedPokemons = [...userStore.pokemons];
    updatedPokemons[pokemonIndex] = { ...updatedPokemon };
    
    userStore.pokemons = updatedPokemons;
    console.log(`✅ Покемон обновлен в userStore: ${updatedPokemon.name}`);

    userStore.saveUserData(userLogin);
    console.log(`💾 Данные сохранены в LocalStorage под ключом userData_${userLogin}`);
    
    const savedData = JSON.parse(localStorage.getItem(`userData_${userLogin}`) || '{}');
    const savedPokemon = savedData.pokemons?.find((pokemon: any) => pokemon.id === props.pokemon!.id);
    
    if (savedPokemon?.name === args.name) {
      console.log('✅ Проверка: имя успешно сохранено в LocalStorage');
    } else {
      console.warn('⚠️ Проверка: имя не найдено в сохраненных данных');
    }
    
    emit('updatePokemon', updatedPokemon);
    console.log('✅ Событие updatePokemon отправлено');
    alert(`Имя покемона изменено на: ${args.name}`);
  } catch (error) {
    console.error('Критическая ошибка при сохранении:', error);
    alert('Ошибка при сохранении имени');
  }
};

</script>