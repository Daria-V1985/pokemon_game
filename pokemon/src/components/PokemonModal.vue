<template>
  <section class="popup" v-if="modelValue && pokemon" @click.self="closeModal">
    <div class="popup__inner" @click.stop>
      <div :class="['popup__body', { 'open': showPopup }]">
        <div class="popup__container">
          <div class="popup__header popup-header">
            <h5 class="popup-header__title">Управление покемоном {{ newName }}</h5>
            <div class="popup-header__close" @click="closeModal">&#10006;</div> 
          </div>
          <Tabs 
            class="popup__tabs"
            :names="modalTabs"
            :selectedTab="selectedTab"
            @changeTab="changeTab"
          >
            <component 
              :is="currentComponent" 
              :pokemon="pokemon"
              :pokemonId="props.pokemon?.id || null"
              @updatePokemon="$emit('updatePokemon', $event)"
              @pokemonDeleted="handlePokemonDeleted"
            />
          </Tabs>
          <div class="popup__footer">
            <Button @click="closeModal">
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { lsHashMap } from "@/stores/lsHashMap";
import { Pokemon } from "@/types/pokemon";
import Tabs from "@/components/Tabs.vue";
import Feed from "@/components/popup/Feed.vue";
import Statistics from "@/components/popup/Statistics.vue";
import Button from "./Button.vue";

interface Popup {
  modelValue: boolean; 
  pokemon: Pokemon | null,
}

const props = defineProps<Popup>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'updatePokemon': [pokemon: Pokemon];
  'pokemonDeleted': [pokemonId: number];  
}>();

const modalTabs = [
  {name: "/popup/feed", label: "Накормить"},
  {name: "/popup/statistics", label: "Статистика"},
];

const selectedTab = ref("/popup/feed");
const showPopup = ref(false);

const changeTab = (tabName: string) => {
  selectedTab.value = tabName;
}

const currentComponent = computed(() => {
  return selectedTab.value === "/popup/feed" ? Feed : Statistics;
});

const newName = computed(() => {
  if (!props.pokemon) return 'неизвестным';
  const alias = lsHashMap.getPokemonAlias(props.pokemon.id);
  return alias || props.pokemon.name;
});

onMounted(() => {
  setTimeout(() => {
    showPopup.value = true;
  }, 300);
});

watch(() => props.modelValue,
  (value) => {
    if (value) {
      showPopup.value = true;
      document.body.style.overflow = "hidden";
    } else {
      showPopup.value = false;
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 300); 
    }
  },
  { immediate: true }
);

const closeModal = () => {
  emit('update:modelValue', false);
};

const handlePokemonDeleted = (pokemonId: number) => {
  closeModal();
  emit('pokemonDeleted', pokemonId);
};

</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.popup {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba($text, 0.4);
  top: 0;
  left: 0;
  z-index: 999;
  cursor: pointer;
  overflow-y: auto;
  pointer-events: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  &__inner {
    min-width: 572px;
    display: table;
    padding: 15px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
  &__body {
    font-family: $mainFont;
    background-color: #fff;
    color: rgba($text, 0.85);
    max-width: 600px;
    width: 100%;
    border-radius: 4px;
    cursor: default;
  }
  &__container {
    padding: 10px 24px;
  }
  &__header {
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.043);
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid rgba(0, 0, 0, 0.043);
    .btn {
      width: 100px;
      margin: 10px 0 0 0;
    }
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0 16px 0;
  gap: 20%;
  &__title {
    font-family: $mainFont;
    font-size: 1rem;
    font-weight: 500;
  }
  &__close {
    color: rgba($text, 0.7);
    font-size: 16px;
    font-weight: normal;
    border: none;
    background-color: transparent;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: rgba($text, 1);
    }
  }
}

</style>