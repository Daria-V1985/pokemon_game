<template>
  <div class="login">
    <h2 class="login__name">{{ user?.authLogin || 'Гость' }}</h2>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
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