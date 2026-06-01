<template>
  <div :class="['grid-cell', cellModClass]">
    <img 
      v-if="props.itemSrc" 
      :src="props.itemSrc" 
      :alt="props.itemAlt || 'item'" 
      class="grid-cell__item" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Cells {
  itemSrc?: string; 
  itemAlt?: string; 
  itemType?: 'berry' | 'pokeball' | null;
}

const props = withDefaults(defineProps<Cells>(), {
  itemSrc: '',
  itemAlt: '',
  itemType: null
});

const cellModClass = computed(() => {
  if (!props.itemType) return 'grid-cell--empty';
  return `grid-cell--${props.itemType}`;
});

</script>

<style scoped>
.grid-cell {
  background-color: #efefef;
  opacity: 0.3;
  border-radius: 8px;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  cursor: pointer;
  &__item {
    max-width: 80%;
    max-height: 80%;
  }
}
</style>