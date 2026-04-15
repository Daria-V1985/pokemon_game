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
    console.log('Пользователь не авторизован');
    return;
  }
  try {
    console.log(`Загрузка покемонов для ${authStore.user.login}...`);
    const pokemonsWithDetails = await pokemonService.getUserPokemonsWithDetails(authStore.user.login);
    
    userPokemons.value = pokemonsWithDetails;
    console.log(`Загружено ${pokemonsWithDetails.length} покемонов с деталями:`, pokemonsWithDetails);
    
    if (pokemonsWithDetails.length > 0) {
      userStore.pokemons = [...pokemonsWithDetails];
    }  
  } catch (err) {
    console.error('Ошибка загрузки покемонов:', err);
    userPokemons.value = [];
    
    if (userStore.pokemons.length > 0) {
      console.log('Используем данные из userStore как fallback');
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
  console.log('Обновление данных покемона:', updatedPokemon);
  const index = userPokemons.value.findIndex((pokemon: any) => pokemon.id === updatedPokemon.id);
  try {
    if (index !== -1) {
    const updatedArray = [...userPokemons.value];
      updatedArray[index] = { ...updatedPokemon };
      userPokemons.value = updatedArray;
      console.log(`Покемон обновлен в локальном массиве: ${updatedPokemon.name}`);
  }

  if (authStore.user?.login) {
      userStore.saveUserData(authStore.user.login);
      console.log(`Данные сохранены для ${authStore.user.login}`);
    }

  await loadUserPokemons();
  } catch (err) {
    console.error('Ошибка при обновлении покемона:', err);
  }
};

onMounted(() => {
  console.log('PokemonCardList mounted');
  loadUserPokemons();
})

watch(() => userStore.isInitial, (isInitial) => {
  if (isInitial) {
    console.log('UserStore инициализирован');
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