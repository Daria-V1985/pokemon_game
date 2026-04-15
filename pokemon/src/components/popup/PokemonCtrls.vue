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
import { Pokemon } from '@/types/pokemon';
import Button from '../Button.vue';
import SearchForm from './SearchForm.vue';

const props = defineProps<{
  pokemon: Pokemon | null;
}>();

const emit = defineEmits<{
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