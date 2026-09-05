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
      class="grid-cell__item"
      draggable="true"
      @dragstart="handleDragStart"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Cells {
  index: number;
  itemSrc?: string; 
  itemAlt?: string; 
  itemType?: 'berry' | 'pokeball' | null;
}

const props = withDefaults(defineProps<Cells>(), {
  itemSrc: '',
  itemAlt: '',
  itemType: null
});

const emit = defineEmits<{
  'moveItem': [data: { fromIndex: number; toIndex: number }];
}>();

const isDragOver = ref(false);

const handleDragEnter = () => {
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDragStart = (e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', props.index.toString());
  }
};

const handleDrop = (e: DragEvent) => {
  isDragOver.value = false;
  if (!e.dataTransfer) return;

  const fromIndexRaw = e.dataTransfer.getData('text/plain');
  if (fromIndexRaw !== '') {
    const fromIndex = parseInt(fromIndexRaw, 10);
    const toIndex = props.index;
    if (fromIndex !== toIndex) {
      emit('moveItem', { fromIndex, toIndex });
    }
  }
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
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }
}
</style>