<template>
  <div class="static__control static-ctrl">
    <Button 
      class="static-ctrl__btn"
      color="primary"
      type="submit">
      Удалить покемона
    </Button>
    <SearchForm />
  </div>
</template>

<script lang="ts" setup>
//import { ref, onMounted } from 'vue';
import Button from '../Button.vue';
import SearchForm from './SearchForm.vue';
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