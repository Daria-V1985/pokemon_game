<template>
  <div class="login">
    <img class="login__icon" src="../assets/image/icon-money.png" alt="Login Icon" />
    <h2 class="login__name">{{ authLogin || 'Гость' }}</h2>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const stored = localStorage.getItem('authUser');
let login = '';

if (stored) {
  try {
    const parsed = JSON.parse(stored);
    login = parsed.authLogin || '';
  } catch {
    login = stored;
  }
}

const authLogin = ref(login);
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.login {
  display: flex;
  align-items: center;
  gap: 10px;
  &__name {
    @include design-text;
    margin: 0;
  }
}
</style>