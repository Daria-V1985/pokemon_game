<template>
  <article class="feed-list__card feed-card">
    <div class="feed-card__item">
      <div class="feed-card__img">
        <img :src="props.image" :alt="props.title">
      </div>
      <div class="feed-card__desc">
        <div class="feed-card__title">{{ props.title }}</div>
        <div class="feed-card__text">{{ props.text }}</div>
      </div>
    </div>
    <Button
      color="primary"
      type="submit"
    > 
      {{ props.action }}
    </Button>
  </article>
</template>

<script lang="ts" setup>
import Button from '../Button.vue';

interface Feed {
  id: number,
  image: string,
  title: string,
  text: string,
  action: string,
}

const props = defineProps<Feed>();
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.feed-card {
  display: flex;
  flex-direction: column;
  background: $white;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  box-shadow: 0px 0px 16px rgba(58, 58, 58, 0.1);
  &__img {
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
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 12px;
  }
  &__title {
    font-weight: 700;
    font-size: 1rem;
    color: $text;
    margin-bottom: 6px;
  }
  &__text {
    font-size: 0.875rem;
    color: rgba($text, 0.5);;
    margin-bottom: 0.75rem;
    line-height: 1.3;
    margin-bottom: 12px;
  }
}
</style>