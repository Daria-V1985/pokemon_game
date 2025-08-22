<template>
  <Header />
  <main class="page container">
    <Inventory />
    <MyPokemons />
    <Shop />
  </main>
</template>

<script lang="ts" setup>
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
</style>