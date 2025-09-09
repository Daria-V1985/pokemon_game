<template>
  <article v-for="(pokemon, index) in pokemons"
    :key="index"
    class="pokemons__card card"
  >
    <div class="card__header">
      <h3 class="card__title">{{ pokemon.name }}</h3>
      <div class="card__settings">
        <img src="../assets/image/svg/setting.svg" alt="Настройка покемона">
      </div>
    </div>
    <div class="card__image">
      <img :src="pokemon.image" alt="Покемон" />
    </div>
    <div class="card__info card-info">
      <div class="card-info__row">
        <span class="card-info__row-label">Вес</span>
        <span class="card-info__row-value">{{ pokemon.weight }}</span>
      </div>
      <div class="card-info__row">
        <span class="card-info__row-label">Денег/сек</span>
        <span class="card-info__row-value">{{ pokemon.money }}</span>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

interface Pokemon {
  name: string,
  image: string,
  weight: number,
  money: number,
}

const getPokemons = (): Pokemon[] => [
  {
    name: 'clefairy',
    image: '../assets/image/my-pokemon.png',
    weight: 12,
    money: 1.1,
  },
  {
    name: 'clefairy',
    image: '../assets/image/my-pokemon.png',
    weight: 12,
    money: 1.1,
  },
  {
    name: 'clefairy',
    image: '../assets/image/my-pokemon.png',
    weight: 12,
    money: 1.1,
  },
  {
    name: 'clefairy',
    image: '../assets/image/my-pokemon.png',
    weight: 12,
    money: 1.1,
  },
  {
    name: 'clefairy',
    image: '../assets/image/my-pokemon.png',
    weight: 12,
    money: 1.1,
  },
  {
    name: 'clefairy',
    image: '../assets/image/my-pokemon.png',
    weight: 12,
    money: 1.1,
  },
]

const pokemons = ref<Pokemon[]>([]);

const savePokemons = (): void => {
  localStorage.setItem('pokemons', JSON.stringify(pokemons.value));
}

const loadPokemons = (): void => {
  const saved = localStorage.getItem('pokemons');
  if (saved) {
    try {
      pokemons.value = JSON.parse(saved) as Pokemon[];
    } catch (err) {
      console.error('Ошибка парсинга данных из localStorage', err);
      pokemons.value = getPokemons();
      savePokemons();
    }
  } else {
    pokemons.value = getPokemons();
    savePokemons();
  }
}

onMounted(() => {
  loadPokemons();
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