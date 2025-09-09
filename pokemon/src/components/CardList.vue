<template>
  <div class="pokemons__cards">
    <PokemonCard />
  </div>
</template>

<script lang="ts" setup>
import PokemonCard from './PokemonCard.vue';

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