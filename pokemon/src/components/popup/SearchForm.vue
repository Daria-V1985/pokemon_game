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
import { ref, watch, defineProps as vueSearchFormProps, computed } from 'vue';
import Button from '../Button.vue';

interface Pokemon {
  id: number;
  image: string;
  name: string;
  weight: number;
  money: number;
  earned: number;
  age: string;
}

const props = vueSearchFormProps<{
  currentPokemon?: Pokemon | null;
}>();

const storedName = (id?: number): string => {
  if (!id) return '';
  return getAlias(id) || '';
};

const inputName = ref(storedName(props.currentPokemon?.id) || props.currentPokemon?.name || '');

const isValidName = computed(() => {
  const trimmed = inputName.value.trim();
  if (!trimmed) return false;
  const stored = storedName(props.currentPokemon?.id);
  const base = props.currentPokemon?.name || '';
  return trimmed !== stored && trimmed !== base;
});

watch(
  () => props.currentPokemon,
  (newPokemon) => {
    inputName.value = storedName(newPokemon?.id) || newPokemon?.name || '';
  },
  { immediate: true }
);

const saveName = () => {
  const trimmedName = inputName.value.trim();
  if (!isValidName.value || !props.currentPokemon?.id) return;

  setAlias(props.currentPokemon.id, trimmedName);
  alert('Имя сохранено!');  
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