<template>
  <div v-if="pokemon" class="static__info static-info">
    <div class="static-info__body">
      <div class="static-info__img">
        <img :src="pokemon.image" :alt="pokemon.name">
      </div>
      <div class="static-info__desc info-desc">
        <div class="info-desc__item">
          <div class="info-desc__item-title">Вид</div>
          <div class="info-desc__item-data">{{ pokemon.name }}</div>
        </div>
        <div class="info-desc__item">
          <div class="info-desc__item-title">Вес</div>
          <div class="info-desc__item-data">{{ pokemon.weight }} кг</div>
        </div>
        <div class="info-desc__item">
          <div class="info-desc__item-title">Суммарно заработано</div>
          <div class="info-desc__item-data">{{ pokemon.money }}</div>
        </div>
        <div class="info-desc__item">
          <div class="info-desc__item-title">Денег/сек</div>
          <div class="info-desc__item-data">{{ pokemon.earned }}</div>
        </div>
        <div class="info-desc__item">
          <div class="info-desc__item-title">Возраст</div>
          <div class="info-desc__item-data">{{ pokemon.age }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="loading" class="loading">Загрузка данных о покемоне...</div>
  <div v-else class="error">Ошибка загрузки данных о покемоне.</div>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted } from 'vue';

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
  loading?: boolean;
  error?: boolean;
}>();

const pokemon = ref<Pokemon | null>(null);
const loading = ref(true);
const error = ref(false);

const fetchPokemon = async () => {
  try {
    const response = await fetch(`https://9d6066f5473655c8.mokky.dev/pokemons`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      pokemon.value = data[0];
    } else {
      throw new Error('Покемон не найден!');
    }
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPokemon();
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.static-info {
  &__body {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 7px;
  }
  &__img {
    width: 143px;
    height: 143px;
    background: rgba($neutral, 0.4) 50% 50%;
    border-radius: 4px;
  }
}

.info-desc {
  width: 70%;
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
    &-title {
      font-weight: bold;
    }
    &-data {
      font-weight: 500;
    }
  }
}

</style>