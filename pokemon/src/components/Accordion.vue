<template>
  <div class="page-accordion__item" :class="{ active: isOpen }"
  >
    <div @click="toggle" class="page-accordion__item-title" :class="{ active: isOpen }">
      <slot name="title">{{ title }}</slot>
    </div>
    <div v-show="isOpen" class="page-accordion__item-content content-item">
      <slot />
    </div>
  </div>
</template>

<script  lang="ts" setup>
import { ref, watch, defineProps as defineMyProps, defineEmits as defineMyEmits } from "vue";

const props = defineMyProps({
  title: { 
    type: String, 
    required: true, 
  },
  modelValue: { 
    type: Boolean, 
    default: false, 
  }
});

const emit = defineMyEmits(['update:modelValue']);
const isOpen = ref(props.modelValue);

watch(() => props.modelValue, (value) => {
  isOpen.value = value;
})

function toggle() {
  isOpen.value = !isOpen.value;
  emit('update:modelValue', isOpen.value);
}

</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.page-accordion {
  &__item {
    background: $white;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0px 0px 16px rgba(58, 58, 58, 0.1);
    position: relative;
    &-title {
      @include design-text;
      cursor: pointer;
      &:before {
        content: '';
        width: 17px;
        height: 11px;
        background: url('../assets/image/svg/arrow.svg') no-repeat;
        position: absolute;
        left: 94%;
        margin-top: 15px;
        transition: transform 0.15s ease;
      }
    }
    &.active {
      .page-accordion__item-title:before {
        transform: rotate(-180deg);
        transition: transform 0.15s ease;
      }
      .content-item {
        display: block;
        animation: visible 1s forwards;
      }
    }
  }
}

.content-item {
  overflow: hidden;
  transition: all 0.25s ease;
}

</style>