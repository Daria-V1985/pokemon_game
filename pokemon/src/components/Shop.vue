<template>
  <section class="shop">
    <div class="shop__container">
      <div class="shop__body">
        <div class="shop__title">Shop</div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup></script>

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
</style>