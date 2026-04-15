<template>
  <div v-if="pokemon" class="static__info static-info">
    <div class="static-info__body">
      <div class="static-info__img">
        <img :src="pokemon.image" :alt="newName">
      </div>
      <div class="static-info__desc info-desc">
        <div class="info-desc__item">
          <div class="info-desc__item-title">Имя</div>
          <div class="info-desc__item-data">{{ newName }}</div>
        </div>
        <div class="info-desc__item">
          <div class="info-desc__item-title">Вид</div>
          <div class="info-desc__item-data">{{ pokemon.view }}</div>
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
import { computed } from 'vue';
import { Pokemon } from '@/types/pokemon';

const props = defineProps<{
  pokemon: Pokemon | null;
  loading?: boolean;
  error?: boolean;
}>();

const newName = computed(() => {
  return props.pokemon?.name || 'Не выбран'; 
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