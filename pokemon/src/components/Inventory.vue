<template>
  <section class="inventory">
    <div class="inventory__container">
      <div class="inventory__body">
        <div class="inventory__title">Inventory</div>
        <div class="inventory__grid">
          <Cell 
            v-for="(_, index) in 50"
            :key="index"
            :index="index"
            :itemSrc="itemInSlot(index)?.image || ''"
            :itemAlt="itemInSlot(index)?.name || ''"
            :itemType="itemInSlot(index)?.type || null"
          />
          <div class="inventory__coins-bar coins-bar">
            <div class="coins-bar__balance">
              <span class="coins-bar__icon">
                <img src="../assets/image/poke_coin.png" alt="Монеты">
              </span>
              <span class="coins-bar__sum">{{ userStore.money }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/useUserStore';
import Cell from './Cell.vue';

const userStore = useUserStore();

const itemInSlot = (slot: number) => {
  return userStore.inventory.find(item => item.slot === slot);
};

</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.inventory {
  &__body {
    background: $white;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0px 0px 16px rgba(58, 58, 58, 0.1);
    max-width: 320px;
    box-sizing: border-box;
  }
  &__title {
    @include design-text;
    margin-bottom: 16px;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }
}

.coins-bar {
  grid-column: 1 / -1;
  border: 3px solid #3b63bf;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  &__balance {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &__icon {
    width: 32px;
    height: 32px;
  }
  &__sum {
    @include design-text;
    line-height: 29px;
    padding-left: 4px;
  }
}
</style>