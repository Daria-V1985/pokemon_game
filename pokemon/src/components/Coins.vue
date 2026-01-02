<template>
  <div class="coins">
    <div class="coins__count count">
      <div class="count__body">
        <button class="count__button btn-minus" @click="onDecrement">-</button>
        <div class="count__num">{{ userStore.money.toLocaleString() }}</div>
        <button class="count__button btn-plus" @click="onIncrement">+</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/useUserStore';

const userStore = useUserStore();

function onIncrement() {
  userStore.incrementMoney();
}

function onDecrement() {
  userStore.decrementMoney();
}

</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.coins {
  display: flex;
  align-items: center;
  gap: 10px;
  &__count {
    @include design-text;
    margin: 0;
  }
}

.count {
  max-width: 300px;
  text-align: center;
  font-family: $mainFont;
  &__body {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 15px;
  }
  &__button {
    font-size: 1.6rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    color: $text;
  }
  &__num {
    @include design-text;
  }
}

</style>