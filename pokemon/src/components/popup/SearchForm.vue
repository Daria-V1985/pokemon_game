<template>
  <div class="static-ctrl__search search">
      <Form class="search__form" @submit.prevent="saveName">
        <input 
          v-model="inputName"
          type="text"
          class="search__input" 
          placeholder="Псевдоним покемона"
        >
        <Button 
          class="static-ctrl__btn"
          color="primary"
          type="submit"
          :disabled="!isValidName"
        >
          Сохранить
        </Button>
      </Form>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { Pokemon } from '@/types/pokemon';
import Button from '../Button.vue';

const props = defineProps<{
  currentPokemon?: Pokemon | null;
}>();

const emit = defineEmits<{
  'saveName': [{ name: string; pokemon?: Pokemon }];
}>();

const getCurrentName = (): string => {
  return props.currentPokemon?.name || '';
};

const inputName = ref(getCurrentName());

const isValidName = computed(() => {
  const trimmed = inputName.value.trim();
  if (!trimmed) return false;
  const currentName = getCurrentName();
  return trimmed !== currentName;
});

watch(
  () => props.currentPokemon,
  (newPokemon) => {
    inputName.value = newPokemon?.name || '';
  },
  { immediate: true }
);

const saveName = () => {
  const trimmedName = inputName.value.trim();
  
  if (!isValidName.value || !props.currentPokemon?.id) {
    console.warn('Невалидные данные для сохранения');
    return;
  }

  emit('saveName', { 
    name: trimmedName, 
    pokemon: props.currentPokemon 
  });
};

</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.static-ctrl {
  &__btn {
    width: 40%;
    padding: 4px 9px;
  }
}

.search {
  &__form {
    display: flex;
    gap: 12px;
  }
  &__input {
    width: 294px;
    padding: 7px;
  }
}
</style>