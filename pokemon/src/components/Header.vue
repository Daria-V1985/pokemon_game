<template>
  <header class="header">
    <div class="header__container container">
      <div class="header__body">
        <Logo />
        <Coins />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import Logo from '@/components/Logo.vue';
import Coins from '@/components/UserLogin.vue';
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.header {
  &__container {
    margin: 0 auto;
  }
  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: $white;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0px 0px 16px rgba(58, 58, 58, 0.1);
  }
}
</style>