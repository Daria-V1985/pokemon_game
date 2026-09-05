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
                { 'inventory-grid__active': index < userStore.inventorySlots },
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
            <button 
              class="coins-bar__btn"
              type="button"
              :disabled="userStore.inventorySlots >= 50"
              @click="handleBuySlots"
            >
              <span class="coins-bar__icon">
                <img src="../assets/image/poke_coin.png" alt="Монеты">
              </span>
              <span class="coins-bar__sum">1000</span>
            </button>
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

const handleBuySlots = () => {
  inventStore.buyInventorySlots();
};

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
    opacity: 0.35;           
    pointer-events: none;    
    transition: opacity 0.2s ease;
    width: 100%;
    aspect-ratio: 1 / 1;
    :deep(.grid-cell) {
      opacity: 1 !important; 
    }
  }
  &__cell {
    width: 100% !important;
    height: 100% !important;
  }
  &__active {
    opacity: 1;
    pointer-events: all;
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
  box-sizing: border-box;
  &__btn {
    border: 3px solid #3b63bf;
    border-radius: 4px;
    background-color: $white;
    padding: 10px;
    width: 100%;
    max-width: 390px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s ease, transform 0.1s ease;
    &:hover:not(:disabled) {
      background-color: #f3f4f6; 
    }
    &:active:not(:disabled) {
      transform: scale(0.98); 
    }
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