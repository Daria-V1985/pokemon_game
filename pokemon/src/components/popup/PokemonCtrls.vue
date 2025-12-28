<template>
  <div class="static__control static-ctrl">
    <Button 
      class="static-ctrl__btn"
      color="primary"
      type="submit"
    >
      Удалить покемона
    </Button>
    <SearchForm 
      :current-pokemon="props.pokemon" 
      @saveName="savePokemonName"/>
  </div>
</template>

<script lang="ts" setup>
import { defineProps as vuePokemonCtrlsProps, defineEmits as vuePokemonCtrlsEmits } from 'vue';
import Button from '../Button.vue';
import SearchForm from './SearchForm.vue';

interface Pokemon {
  id: number;
  image: string;
  name: string;
  weight: number;
  money: number;
  earned: number;
  age: string;
}

const props = vuePokemonCtrlsProps<{
  pokemon: Pokemon | null;
}>();

const emit = vuePokemonCtrlsEmits<{
  'saveName': [{ name: string; pokemon?: Pokemon }];  
}>();

const savePokemonName = (payload: { name: string; pokemon?: Pokemon }) => {
  emit('saveName', payload);  
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.static-ctrl {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
  &__btn {
    width: 40%;
    padding: 4px 9px;
  }
}

</style>