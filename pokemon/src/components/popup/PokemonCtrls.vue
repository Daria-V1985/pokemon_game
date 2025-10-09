<template>
  <div class="static__control static-ctrl">
    <Button 
      class="static-ctrl__btn"
      color="primary"
      type="submit">
      Удалить покемона
    </Button>
    <div class="static-ctrl__search search">
      <form class="search__form" action="#">
        <input class="search__input" placeholder="Псевдоним покемона">
        <Button 
          class="static-ctrl__btn"
          color="primary"
          type="submit">
          Сохранить
        </Button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
//import { ref, onMounted } from 'vue';
import Button from '../Button.vue';
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

.search {
  &__form {
    display: flex;
    gap: 12px;
  }
  &__input {
    width: 294px;
    padding: 7px;
    &::placeholder {
    }
  }
}
</style>