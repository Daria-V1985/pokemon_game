<template>
  <div :class="['grid-cell', { active: props.isActive }]">
    <img v-if="props.itemSrc" :src="props.itemSrc" :alt="props.itemAlt" class="grid-cell__item" />
  </div>
</template>

<script lang="ts" setup>
import { defineProps as vueCellProps } from 'vue';

interface Cells {
  isActive: boolean;
  itemSrc?: string; 
  itemAlt?: string; 
}

const props = vueCellProps<Cells>();
</script>

<style scoped>
.grid-cell {
  background-color: #e5e7eb8c;
  border-radius: 8px;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  &.active {
    border: 2px solid #e5e7eb;
  }
  &__item {
    max-width: 80%;
    max-height: 80%;
  }
}
</style>