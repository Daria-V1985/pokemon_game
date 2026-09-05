<template>
  <article class="pokemons__card card">
    <div class="card__header">
      <h3 class="card__title">{{ newName }}</h3>
      <button class="card__settings" @click="$emit('click', props.id)">
        <img src="../assets/image/svg/setting.svg" alt="Настройка покемона">
      </button>
    </div>
    <div class="card__image">
      <img :src="props.image" :alt="newName"/>
    </div>
    <div class="card__info card-info">
      <div class="card-info__row">
        <span class="card-info__row-label">Вес</span>
        <span class="card-info__row-value">{{ props.weight }} кг</span>
      </div>
      <div class="card-info__row">
        <span class="card-info__row-label">Денег/сек</span>
        <span class="card-info__row-value">{{ props.money }}</span>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { lsHashMap } from "@/stores/lsHashMap"

interface Pokemon {
  id: number,
  name: string,
  image: string,
  weight: number,
  money: number,
  alias?: string,
}

const props = defineProps<Pokemon>();
defineEmits<{
  'click': [id: number]
}>();

const newName = computed(() => {
  return lsHashMap.getPokemonAlias(props.id) || props.name;
});

</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.card {
  width: 165px;
  background: $white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 0.1);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: $mainFont;
  font-weight: 700;
  color: $text;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__title {
    font-size: 1.1rem;
    margin: 0;
  }
  &__settings {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 1;
    color: $coin; 
    transition: color 0.3s ease;
    &:hover {
      color: #d18c00;
    }
  }
  &__image {
    display: flex;
    justify-content: center;
    img {
      width: 140px;
      height: 140px;
    }
  }
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  &__row {
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    &-label {
      color: $text;
      font-weight: 700;
    }
    &-value {
      color: $text;
      font-weight: 500;
    }
  }
}

</style>