<template>
  <div class="feed__list feed-list">
    <div class="feed-list__cards">
      <FeedCard 
        v-for="feedCard in feedCards"
        :key="feedCard.id"
        :id="feedCard.id"
        :image="feedCard.image"
        :title="feedCard.title"
        :text="feedCard.text"
        :action="feedCard.action"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import FeedCard from './FeedCard.vue';

interface Feed {
  id: number,
  image: string,
  title: string,
  text: string,
  action: string,
}

const API_URL = 'https://9d6066f5473655c8.mokky.dev/feed';
const feedCards = ref<Feed[]>([]);

const loadFeedCards = async (): Promise<void> => {
  try {
    const response = await fetch(API_URL);
    const data: Feed[] = await response.json();
    feedCards.value = data;
  } catch (err) {
    console.error('Ошибка загрузки данных из API:', err);
  }
}

onMounted(() => {
  loadFeedCards();
})

</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.feed-list {
  &__cards {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 15px;
    transition: all 0.25s ease;
    margin-bottom: 36px;
  }
}

</style>