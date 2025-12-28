<template>
  <article class="shop-list__item">
    <div class="shop-list__item-info">
      <div class="shop-list__item-img">
        <img :src="props.image" :alt="props.title">
      </div>
      <div class="shop-list__item-desc">
        <div class="shop-list__item-title">{{ props.title }}</div>
        <div class="shop-list__item-text">{{ props.text }}</div>
      </div>
    </div>
    <Button
      color="primary"
      type="submit"
    > 
      Купить за {{ props.buy }}
    </Button>
  </article>
</template>

<script lang="ts" setup>
import Button from './Button.vue';
import { defineProps as vueShopCardProps } from 'vue';

interface Shop {
  id: number,
  image: string,
  title: string,
  text: string,
  buy: number,
}

const props = vueShopCardProps<Shop>();
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.shop-list {
  &__item {
    display: flex;
    flex-direction: column;
    background: $white;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    box-shadow: 0px 0px 16px rgba(58, 58, 58, 0.1);
    &-img {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.4rem;
      img {
        width: 59px;
        height: 59px;
        object-fit: contain;
        border-radius: 8px;
        background: rgba($neutral, 0.2);
      }
    }
    &-info {
      display: flex;
      justify-content: space-between;
      gap: 23px;
    }
    &-title {
      font-weight: 700;
      font-size: 1rem;
      color: $text;
    }
    &-text {
      font-size: 0.875rem;
      color: rgba($text, 0.5);;
      margin-bottom: 0.75rem;
      line-height: 1.3;
    }
    &-button {
      @include btn-primary;
      padding: 0.5rem 0;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.5s ease;
      &:hover {
        @include btn-primary-hover;
        transition: all 0.5s ease;
      }
    }
  }
}
</style>