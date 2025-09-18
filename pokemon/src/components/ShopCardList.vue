<template>
  <div class="shop__list shop-list">
    <ShopCard 
      v-for="shopCard in shopCards"
      :key="shopCard.id"
      :id="shopCard.id"
      :image="shopCard.image"
      :title="shopCard.title"
      :text="shopCard.text"
      :buy="shopCard.buy"
    />
  </div>
</template>

<script lang="ts" setup>
import ShopCard from "./ShopCard.vue";
import { ref, onMounted } from "vue";

interface Shop {
  id: number,
  image: string,
  title: string,
  text: string,
  buy: number,
}

const API_URL = 'https://9d6066f5473655c8.mokky.dev/shopCards';
const shopCards = ref<Shop[]>([]);

const loadShopCards = async (): Promise<void> => {
  try {
    const response = await fetch(API_URL);
    const data: Shop[] = await response.json();
    shopCards.value = data;
  } catch (err) {
    console.error('Ошибка загрузки данных из API:', err);
  }
}

onMounted(() => {
  loadShopCards();
})
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.shop-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>