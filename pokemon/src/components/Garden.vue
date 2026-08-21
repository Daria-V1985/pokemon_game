<template>
  <div class="garden">
    <div class="garden__container">
      <div class="garden__body">
        <div class="garden__inventory garden-inventory">
          <div class="garden-inventory__grid garden-grid">
            <template v-for="(_, index) in 49" :key="index">
              <div
                v-if="!isGardenSlotOverlap(index)"
                :class="[
                    'garden-grid__wrapper',
                    { 'garden-grid__wrapper--active': index < gardenStore.gardenSlots },
                    { 'garden-grid__mega': berryInSlot(index)?.isMega },
                    { 'garden-grid__ripe': berryInSlot(index)?.scale === 100 }
                  ]"
                  :draggable="berryInSlot(index)?.scale === 100"
                  @dragstart="handleGardenDragStart($event, index)"
                  @click="handleCellClick(index)" 
              >
                <Cell 
                  :index="index"
                  :itemSrc="berryInSlot(index) ? require('@/assets/image/small-fruit-1.png') : ''"
                  :itemAlt="'Ягода'"
                  :itemType="berryInSlot(index) ? 'berry' : null"
                  class="garden-grid__cell"
                  :style="berryStyle(index)"
                  @moveItem="onItemMoved($event, index)"
                />
              </div>
            </template>
          </div>
        </div>
        <div class="garden__sidebar garden-sidebar">
          <div class="garden-sidebar__wrapper">
            <div class="garden-sidebar__list">
              <div class="garden-sidebar__item sidebar-item">
                <div class="sidebar-item__info">
                  <p class="sidebar-item__text">Увеличить площадь грядки</p>
                </div>
                <div class="sidebar-item__action">
                  <Button 
                    class="sidebar-item__action-btn"
                    color="primary"
                    type="button"
                    :disabled="userStore?.money < 1000"
                    @click="handleBuyExtension"
                  >
                    Купить
                  </Button>
                  <div class="sidebar-item__price">
                    <img src="../assets/image/poke_coin.png" alt="Монеты">
                    <span class="sidebar-item__price-sum">1000</span>
                  </div>
                </div>
              </div>
              <div class="garden-sidebar__item sidebar-item">
                <div class="sidebar-item__info">
                  <p class="sidebar-item__text">Ускорить рост на 2%/час на 2 часа</p>
                </div>
                <div class="sidebar-item__action">
                  <Button 
                    class="sidebar-item__action-btn"
                    color="primary"
                    type="button"
                    :disabled="userStore?.money < 2000 || gardenStore.isActiveBuff_2 || !gardenStore.hasGrowingBerries"
                    @click="handleBuySpeedBuff('buff2')" 
                  >
                    Купить
                  </Button>
                  <div class="sidebar-item__price">
                    <img src="../assets/image/poke_coin.png" alt="Монеты">
                    <span class="sidebar-item__price-sum">2000</span>
                  </div>
                </div>
              </div>
              <div class="garden-sidebar__item sidebar-item">
                <div class="sidebar-item__info">
                  <p class="sidebar-item__text">Ускорить рост на 5%/час на 2 часа</p>
                </div>
                <div class="sidebar-item__action">
                  <Button 
                    class="sidebar-item__action-btn"
                    color="primary"
                    type="button"
                    :disabled="userStore?.money < 5000 || gardenStore.isActiveBuff_5 || !gardenStore.hasGrowingBerries"
                    @click="handleBuySpeedBuff('buff5')"
                  >
                    Купить
                  </Button>
                  <div class="sidebar-item__price">
                    <img src="../assets/image/poke_coin.png" alt="Монеты">
                    <span class="sidebar-item__price-sum">5000</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="garden-sidebar__stats stats-bar">
              <span class="stats-bar__label">Скорость роста</span>
              <span class="stats-bar__value">{{ gardenStore.growthSpeedText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/AuthStore';
import { useGardenStore } from '@/stores/gardenStore';
import Cell from './Cell.vue';
import Button from './Button.vue';

const authStore = useAuthStore();
const userStore = useUserStore();
const gardenStore = useGardenStore();

onMounted(() => {
  if (authStore.user?.login) {
    gardenStore.loadGardenData(authStore.user.login);
  }
});

const berryInSlot = (gardenSlot: number) => {
  return gardenStore.gardenBerry.find(berry => berry.gardenSlot === gardenSlot);
};

const isGardenSlotOverlap = (gardenSlot: number): boolean => {
  const GRID_COLUMNS = 7;

  return gardenStore.gardenBerry.some(berry => {
    if (!berry.isMega) return false;

    const root = berry.gardenSlot;
    const isRight = gardenSlot === root + 1;
    const isBottom = gardenSlot == root + GRID_COLUMNS;
    const isBottomRight = gardenSlot === root + GRID_COLUMNS + 1;

    return isRight || isBottom || isBottomRight;
  });
}

const berryStyle = (slot: number) => {
  const berry = berryInSlot(slot);
  if (!berry) return {};

  const maxScaleMulti = berry.isMega ? 2 : 1;
  const finalScale = (berry.scale / 100) * maxScaleMulti;
  
  return {
    '--berry-scale': finalScale,
  };
}

const handleBuyExtension = () => {
  gardenStore.buyExtension();
};

const handleBuySpeedBuff = (buffType: 'buff2' | 'buff5') => {
  gardenStore.buySpeedBuff(buffType);
};

const handleGardenDragStart = (e: DragEvent, gardenSlot: number) => {
  const brInSlot = berryInSlot(gardenSlot);

  if (!brInSlot) {
    e.preventDefault();
    return;
  }

  if (brInSlot.scale < 100) {
    e.preventDefault();
    console.warn('Ягода еще растет!');
    return;
  }

  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `FROM_GARDEN:${gardenSlot}`);
  }
}

const onItemMoved = (data: { fromIndex: number; toIndex: number }, currentIndex: number) => {
  if (currentIndex >= gardenStore.gardenSlots) {
    console.warn('Попытка взаимодействия с заблокированной грядкой');
    return;
  }
};

const handleCellClick = (gardenSlotIndex: number) => {
  if (gardenSlotIndex >= gardenStore.gardenSlots) return; 
  gardenStore.extractBerryFromGarden(gardenSlotIndex); 
};

</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

:deep(.grid-cell__item) {
  transform: scale(var(--berry-scale, 1));
  transition: transform 0.5s ease-in-out;
  transform-origin: bottom center;
}

.garden {
  &__container { 
    min-height: 250px;
    background-color: $white;
  }
  &__body {
    display: grid;
    grid-template-columns: 400px auto;
    gap: 16px;
    padding: 16px 0;
  }
}

.garden-grid {
  &__wrapper {
    opacity: 0.3;           
    pointer-events: none;    
    transition: opacity 0.2s ease;
    width: 100%;
    aspect-ratio: 1 / 1;
    &--active {
      opacity: 1 !important;
      pointer-events: all;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    :deep(.grid-cell) {
      opacity: 1 !important;
    }
  }
  &__cell {
    width: 100% !important;
    height: 100% !important;
  }
  &__mega {
    grid-column: span 2 !important; 
    grid-row: span 2 !important; 
    display: flex;
    justify-content: center;
    align-items: center;
    .garden-grid__cell {
      max-width: 100% !important;
      max-height: 100% !important;
      transform-origin: center center !important; 
    }
    :deep(.grid-cell__item) {
      max-width: 80% !important;
      max-height: 80% !important;
      transform-origin: center center !important; 
    }
  }
  &__ripe {
    :deep(.grid-cell__item) {
      cursor: grab !important;
    }
    :deep(.grid-cell__item:active) {
      cursor: grabbing !important;
    }
  }
}

.garden-sidebar {
  display: flex;
  &__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1 1 25%;
  }
  &__item {
    margin-bottom: 12px;
  }
}

.garden-inventory {
  background: $white;
  max-width: 390px;
  box-sizing: border-box;
  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    transition: opacity 0.2s ease, border-color 0.2s ease;
  }
}

.sidebar-item {
  &__text {
    font-family: $dopFont;
    font-weight: 700;
    font-size: 14px;
    line-height: 22px;
    padding-bottom: 12px;
  }
  &__action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    &-btn {
      width: 30%;
    }
  }
  &__price {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    &-sum {
      @include design-text;
      font-size: 1.4rem;
    }
  }
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: end;
  flex: auto;
  font-family: $dopFont;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;

}

</style>