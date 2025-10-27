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
          type="submit">
          Сохранить
        </Button>
      </Form>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineEmits, defineProps } from 'vue';
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

const props = defineProps<{
  currentPokemon?: Pokemon | null;
}>();

const emit = defineEmits<{
  'saveName': [{ name: string; pokemon?: Pokemon }];
}>();

const inputName = ref('');

watch(
  () => props.currentPokemon,
  (newPokemon) => {
    inputName.value = newPokemon?.name || '';
  },
  { immediate: true }
);

const saveName = () => {
  const name = inputName.value.trim();
  if (name) {
    emit('saveName', { name, pokemon: props.currentPokemon || undefined });
    inputName.value = ''; 
  }
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