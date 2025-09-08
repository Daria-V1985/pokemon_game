<template>
  <Header />
  <main class="page container">
    <Inventory />
    <div class="page__accordion page-accordion">
      <Accordion title="My Pokemons" v-model="pokemonsOpen">
        <MyPokemons />
      </Accordion>
      <Accordion title="Garden" v-model="gardenOpen">
        <Garden />
      </Accordion>
      <Accordion title="Hunt" v-model="huntOpen">
        <Hunt />
      </Accordion>
    </div>
    <Shop />
  </main>
</template>

<script lang="ts" setup>
import Garden from '@/components/Garden.vue';
import Header from '@/components/Header.vue';
import Hunt from '@/components/Hunt.vue';
import Inventory from '@/components/Inventory.vue';
import MyPokemons from '@/components/MyPokemons.vue';
import Shop from '@/components/Shop.vue';
import Accordion from '@/components/Accordion.vue';

import { ref } from 'vue';

const pokemonsOpen = ref(false);
const gardenOpen = ref(false);
const huntOpen = ref(false);
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.page {
  display: grid;
  grid-template-columns: 320px 728px 320px;
  height: 100vh;
  margin-top: 4px;
  gap: 20px;
}

.page-accordion {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>