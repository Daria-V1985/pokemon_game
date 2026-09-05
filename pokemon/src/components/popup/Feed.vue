<template>
  <div class="feed__list feed-list">
    <div v-if="buyBerries.length > 0" class="feed-list__cards">
      <FeedCard 
        v-for="berry in buyBerries"
        :key="berry.slot"
        :id="berry.id"
        :image="berry.image"
        :title="berry.name"
        :text="berryDescription(berry.id)"
        :action="berryAction(berry.id)"
        @click="handleFeed(berry.slot)"
      />
    </div>
    <div v-else class="feed-list__empty">
      <p>В вашем инвентаре нет ягод. Купите их на витрине магазина!</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useInventoryStore } from '@/stores/InventoryStore';
import { useUserStore } from '@/stores/useUserStore';
import FeedCard from './FeedCard.vue';

interface Feed {
  id: number,
  image: string,
  title: string,
  text: string,
  action: string,
}

const props = defineProps<{
  pokemonId: number,
}>();

const API_URL = 'https://9d6066f5473655c8.mokky.dev/feed';
const feedCards = ref<Feed[]>([]);
const inventoryStore = useInventoryStore();
const userStore = useUserStore();

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

const buyBerries = computed(() => {
  return inventoryStore.inventStore.filter(berry => berry.type === 'berry');
});

const berryDescription = (berryId: number): string => {
  const matchedApi = feedCards.value.find(apiCard => apiCard.id === berryId);
  return matchedApi ? matchedApi.text : 'Вкусная ягода для вашего покемона';
};

const berryAction = (berryId: number): string => {
  const matchedApi = feedCards.value.find(apiCard => apiCard.id === berryId);
  return matchedApi ? matchedApi.action : 'Накормить';
};

const handleFeed = (slot: number) => {
  userStore.feedPokemonAction(props.pokemonId, 1);
  inventoryStore.removeItemBySlot(slot);
  console.log(`Покемон #${props.pokemonId} успешно накормлен. Ягода из слота ${slot} удалена.`);
};
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