<template>
  <div class="tab-nav">
    <span
      v-for="tab in props.names"
      :key="tab.name"
      :class="['tab-nav__item', {'selected': tab.name === props.selectedTab}]"
      @click="clickOnTab(tab.name)">
      {{ tab.label }}
    </span>
  </div>
  <div class="tab-content">
    <slot/>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

interface Tab {
  name: string;
  label: string;
}

interface Props {
  names: Tab[];
  selectedTab?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["changeTab"])

const clickOnTab = (tabName: string) => {
  emit("changeTab", tabName)
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

  .tab {
    &-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 32px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.043);
      &__item {
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0px;
        font-size: 15px;
        font-weight: 500;
        border-bottom: 2px solid transparent;
        transition: .2s ease;
        &:hover {
          border-bottom: 2px solid $primary;
          transition: .2s ease;
        }
        &.selected {
          border-bottom: 2px solid $primary;
          color: $primary;
        }
      }
    }
    &-content {
      padding-top: 36px;
      border-radius: 7px;
      background: #fff;
    }
  }
  </style>