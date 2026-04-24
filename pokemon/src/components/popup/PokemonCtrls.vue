<template>
  <div class="static__control static-ctrl">
    <Button 
      class="static-ctrl__btn"
      color="primary"
      type="button"
      @click="deletePokemon"
      :disabled="!pokemon"
    >
      Удалить покемона
    </Button>
    <SearchForm 
      :current-pokemon="pokemon" 
      @saveName="savePokemonName"/>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/useUserStore';
import { Pokemon } from '@/types/pokemon';
import Button from '../Button.vue';
import SearchForm from './SearchForm.vue';

const props = defineProps<{
  pokemon: Pokemon | null;
}>();

const emit = defineEmits<{
  'saveName': [{ name: string; pokemon?: Pokemon }]; 
  'deletePokemon': [pokemonId: number]; 
}>();

const userStore = useUserStore();

const savePokemonName = (payload: { name: string; pokemon?: Pokemon }) => {
  emit('saveName', payload);  
};

const deletePokemon = () => {
  if (!props.pokemon) {
    alert('Покемон не выбран!');
    return;
  }
  
  const confirmed = confirm(`Вы уверены, что хотите удалить покемона "${props.pokemon.name}"?`);
  
  if (confirmed) {
    try {
      const success = userStore.deletePokemon(props.pokemon.id);
      
      if (success) {
        emit('deletePokemon', props.pokemon.id);
        alert(`Покемон "${props.pokemon.name}" удален из вашей коллекции!`);
      } else {
        alert('Не удалось удалить покемона');
      }
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Произошла ошибка при удалении');
    }
  }
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