<template>
  <div
    v-for="tag in tags"
    :key="tag.id" 
    class="filters__tag"
    @click="emit('remove', tag.id)"
  >
    {{ tag.name }}
  </div>
</template>

<script lang="ts" setup>
import { TagItem } from '@/types/tagItem';

defineProps<{
  tags: TagItem[]
}>();

const emit = defineEmits<{
  remove: [id: number]
}>();

</script>

<style lang="scss" setup>
@import "../assets/scss/_variables.scss";

.filters {
  &__tag {
    background: rgba($neutral, 0.2);
    border-radius: 4px;
    padding: 0.25rem 0.6rem;
    font-size: 0.875rem;
    color: rgba($text, 0.5);
    user-select: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    &::after {
      content: 'x';
      margin-left: 0.4rem;
      cursor: pointer;
      font-weight: 700;
    }
    &:hover {
      background: rgba($neutral, 0.35);
    }
  }
}
</style>