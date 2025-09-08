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
    margin: 16px;
  }
}
</style>