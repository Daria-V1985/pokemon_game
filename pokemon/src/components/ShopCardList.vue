<template>
  <div class="shop__list shop-list">
    <ShopCard 
      v-for="shopCard in filteredShopCards"
      :key="shopCard.id"
      :id="shopCard.id"
      :image="shopCard.image"
      :title="shopCard.title"
      :text="shopCard.text"
      :buy="shopCard.buy"
      :type="shopCard.type"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { Shop } from "@/types/shop";
import { TagItem } from "@/types/tagItem";
import ShopCard from "./ShopCard.vue";
import { mockShopItems } from "@/stores/mockShopItem";

//const API_URL = 'https://9d6066f5473655c8.mokky.dev/shopCards';
const shopCards = ref<Shop[]>([]);
const props = defineProps<{
  activeTags: TagItem[];
}>();

onMounted(async () => {
  try {
    shopCards.value = mockShopItems;
  } catch (err) {
    console.error('Ошибка загрузки:', err);
  }
})

/*const loadShopCards = async (): Promise<void> => {
  try {
    const response = await fetch(API_URL);
    const data: Shop[] = await response.json();
    shopCards.value = data;
  } catch (err) {
    console.error('Ошибка загрузки данных из API:', err);
  }
}*/

const filteredShopCards = computed(() => {
  if (props.activeTags.length === 0) return shopCards.value;
  return shopCards.value.filter(item =>
    props.activeTags.some(tag => tag.type === item.type)
  );
});

/*onMounted(() => {
  loadShopCards();
})*/
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.shop-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>