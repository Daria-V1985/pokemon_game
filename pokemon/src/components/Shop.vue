<template>
  <section class="shop">
    <div class="shop__container">
      <div class="shop__body">
        <h2 class="shop__title">Shop</h2>
        <div class="shop__filters filters">
          <FiltersTag />
        </div>
        <ShopCardList />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import FiltersTag from './FiltersTag.vue';
import ShopCardList from './ShopCardList.vue';

</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.shop {
  &__body {
    background: $white;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0px 0px 16px rgba(58, 58, 58, 0.1);
  }
  &__title {
    @include design-text;
  }
}

.filters {
    display: flex;
    gap: 0.5rem;
    margin: 1rem auto;
    border: 1px solid rgba($neutral, 0.8);
    padding: 4px;
  }

.shop-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

</style>