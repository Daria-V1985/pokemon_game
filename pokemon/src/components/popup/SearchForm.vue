<template>
  <div class="static-ctrl__search search">
      <Form class="search__form" @submit.prevent="namePokemon">
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
//import { ref, defineEmits } from 'vue';
import Button from '../Button.vue';

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