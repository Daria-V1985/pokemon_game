<template>
  <div class="pokemons__cards">
    <PokemonCard 
      v-for="pokemon in userPokemons"
      :key="pokemon.id"
      :id="pokemon.id"
      :name="pokemon.name"
      :image="getValidImageUrl(pokemon.image)"
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
import PokemonCard from './PokemonCard.vue';
import PokemonModal from './PokemonModal.vue';
import { lsHashMap } from "@/stores/lsHashMap";

interface Pokemon {
  id: number,
  name: string,
  image: string,
  weight: number,
  money: number,
  earned: number,
  age: string,
}

const authStore = useAuthStore();
const userStore = useUserStore();
const userPokemons = ref<Pokemon[]>([]);
const showModal = ref(false);
const selectedPokemon = ref<Pokemon | null>(null);

const loadUserPokemons = () => {
  console.log('Текущий пользователь:', authStore.user?.login);
  console.log('Покемоны в userStore:', userStore.pokemons);

  if (authStore.user && userStore.isInitial) {
    userPokemons.value = [...userStore.pokemons];
    console.log('Покемоны пользователя загружены из userStore:', userPokemons.value);
  } else if (authStore.user) {
    const userData = lsHashMap.get(`userData_${authStore.user.login}`);
    userPokemons.value = userData?.pokemons || [];
    console.log('Покемоны из LS:', userPokemons.value);
  } else {
    userPokemons.value = [];
    console.log('Пользователь не авторизован');
  }
  console.log('Отображаемые покемоны:', userPokemons.value);
}

const openSettings = (id: number): void => {
  const pokemon = userPokemons.value.find(pokemon => pokemon.id === id)
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
  const index = userStore.pokemons.findIndex(pokemon => pokemon.id === updatedPokemon.id);
  if (index !== -1) {
    userStore.pokemons[index] = updatedPokemon;
    userStore.saveUserData(authStore.user?.login || '');
  }

  loadUserPokemons();
  console.log('Данные покемона обновлены');
};

const getValidImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) {
    return '/images/pokemon-placeholder.png';
  }
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith('//')) {
    return `https:${imageUrl}`;
  }
  return imageUrl;
};

onMounted(() => {
  loadUserPokemons();
})

watch(() => userStore.pokemons, 
  (newPokemons) => {
    console.log('userStore.pokemons изменился:', newPokemons);
    userPokemons.value = [...newPokemons];
    console.log('Отображаемые покемоны обновлены:', userPokemons.value);
  }, { deep: true }
);

watch(() => authStore.user,
  (newUser) => {
    console.log('Статус авторизации изменился:', newUser);
    if (newUser) {
      loadUserPokemons();
    } else {
      userPokemons.value = [];
    }
  }
);

watch(
  () => userStore.isInitial,
  (isInitial) => {
    if (isInitial) {
      loadUserPokemons();
    }
  }
);

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