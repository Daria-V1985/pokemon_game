<template>
  <section class="shop">
    <div class="shop__container">
      <div class="shop__body">
        <h2 class="shop__title">Shop</h2>
        <div class="shop__filters filters">
          <div class="filters__search search-wrapper">
            <FiltersTag 
              :tags="selectedTags"
              @remove="removeTag"
            />
            <input 
              v-model="shopFilter"
              type="text"
              class="search-wrapper__input" 
              :placeholder="selectedTags.length > 0 ? '' : 'Введите фильтр'"
              @input="handleInput"
              @focus="showSuggestions = true"
              @keydown.backspace="handleBackspace"
            >
            <ul
              v-if="showSuggestions && filteredSuggestions.length"
              class="filters__suggestions filters-suggestion"
            >
              <li
                v-for="item in filteredSuggestions"
                :key="item.id"
                class="filters-suggestion__item"
                @mousedown.prevent="selectSuggestion(item)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>
        <ShopCardList 
          :active-tags="selectedTags"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { TagItem } from '@/types/tagItem';
import FiltersTag from './FiltersTag.vue';
import ShopCardList from './ShopCardList.vue';

const allSuggestions: TagItem[] = [
  { id: 1, name: 'Ягоды', type: 'berry' },
  { id: 2, name: 'Покеболлы', type: 'pokeball' }
]

const shopFilter = ref('');
const showSuggestions = ref(false);
const selectedTags = ref<TagItem[]>([]);

const filteredSuggestions = computed(() => {
  const query = shopFilter.value.trim().toLowerCase()
  if (!query) return []

  if (query.includes('ягод') || query.includes('berry')) {
    return allSuggestions.filter(item => item.type === 'berry')
  }
  if (query.includes('покебол') || query.includes('pokeball')) {
    return allSuggestions.filter(item => item.type === 'pokeball')
  }
  return allSuggestions.filter(item =>
    item.name.toLowerCase().includes(query)
  )
})

const handleInput = () => {
  showSuggestions.value = shopFilter.value.length > 0
}

const handleBackspace = () => {
  if (shopFilter.value === '' && selectedTags.value.length > 0) {
    selectedTags.value.pop();
  }
}

const selectSuggestion = (item: TagItem) => {
  if (!selectedTags.value.some(tag => tag.id === item.id)) {
    selectedTags.value = [...selectedTags.value, item]
  }
  shopFilter.value = '';
  showSuggestions.value = false;
}

const removeTag = (id: number) => {
  selectedTags.value = selectedTags.value.filter(tag => tag.id !== id);
}

</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.shop {
  &__body {
    background: $white;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0px 0px 16px rgba(58, 58, 58, 0.1);
  }
  &__title {
    @include design-text;
  }
}

.filters {
  margin: 1rem auto;
  position: relative;
  &__search {
    position: relative;
    min-width: 200px;
    flex-shrink: 0;
  }
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid $neutral;
  border-radius: 4px;
  cursor: text;
  &:focus-within {
    border-color: $primary; 
    box-shadow: 0 0 2px rgba($primary, 0.2);
  }
  &__input {
    flex: 1 1 100px; 
    min-width: 100px;
    border: none !important;
    outline: none !important;
    padding: 4px 0;
    margin: 0;
    background: transparent;
    font-size: 14px;
  }
  &::placeholder {
    color: rgba($text, 0.5);
  }
}

.filters-suggestion {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: $white;
  border: 1px solid rgba($neutral, 0.5);
  border-radius: 8px;
  max-height: 150px;
  overflow-y: auto;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin-top: 4px;
  &__item {
    padding: 0.5rem 0.6rem;
    cursor: pointer;
    font-size: 0.875rem;
    &:hover {
      background: rgba($neutral, 0.1);
    }
  }
}

.shop-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

</style>