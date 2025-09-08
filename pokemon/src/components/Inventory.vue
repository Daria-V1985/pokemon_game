<template>
  <section class="inventory">
    <div class="inventory__container">
      <div class="inventory__body">
        <div class="inventory__title">Inventory</div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.inventory {
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