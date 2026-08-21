<template>
  <section class="inventory">
    <div class="inventory__container">
      <div class="inventory__body">
        <div class="inventory__title">Inventory</div>
        <div class="inventory__grid">
          <template v-for="(_, index) in 50" :key="index">
            <div
              v-if="!isInventSlotOverlap(index)"
              :class="[
                'inventory-grid__wrapper',
                { 'inventory-grid__mega': itemInSlot(index)?.isMega }
              ]"
            >
              <Cell 
                :index="index"
                :itemSrc="itemInSlot(index)?.image || ''"
                :itemAlt="itemInSlot(index)?.name || ''"
                :itemType="itemInSlot(index)?.type || null"
                class='inventory-grid__cell'
                @moveItem="onItemMoved"
              />
            </div>
          </template>
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
import { useInventoryStore } from '@/stores/InventoryStore';
import Cell from './Cell.vue';

const userStore = useUserStore();
const inventStore = useInventoryStore();

const itemInSlot = (slot: number) => {
  return userStore.inventory.find(item => item.slot === slot);
};

const isInventSlotOverlap = (inventSlot: number): boolean => {
  const INVENTORY_COLUMNS = 7;

  return userStore.inventory.some(item => {
    if (!item.isMega) return false;

    const root = item.slot;
    const isRight = inventSlot === root + 1;
    const isBottom = inventSlot == root + INVENTORY_COLUMNS;
    const isBottomRight = inventSlot === root + INVENTORY_COLUMNS + 1;

    return isRight || isBottom || isBottomRight;
  });
}

const onItemMoved = ({ fromIndex, toIndex }: {fromIndex: number; toIndex: number}) => {
  inventStore.moveItem(fromIndex, toIndex);
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

:deep(.grid-cell__item) {
  max-width: 80% !important;
  max-height: 80% !important;
  transform: scale(1) !important; 
  transform-origin: center center !important; 
}

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

.inventory-grid {
  &__wrapper {
    width: 100%;
    aspect-ratio: 1 / 1;
  }
  &__cell {
    width: 100% !important;
    height: 100% !important;
  }
  &__mega {
    grid-column: span 2 !important; 
    grid-row: span 2 !important;    
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
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