<template>
  <div :class="[
    'grid-cell', {'grid-cell__active': isDragOver || props.itemType }
    ]"
    @dragover.prevent
    @dragenter.prevent="handleDragEnter"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <img 
      v-if="props.itemSrc" 
      :src="props.itemSrc" 
      :alt="props.itemAlt || 'item'" 
      class="grid-cell__item" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

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

const isDragOver = ref(false);

const handleDragEnter = () => {
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = () => {
  isDragOver.value = false;
};

</script>

<style lang="scss" scoped>
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
  &__active {
    opacity: 1;
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
  &__item {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
    image-rendering: pixelated;
  }
}
</style>