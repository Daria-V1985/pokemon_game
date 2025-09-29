<template>
  <div class="static__info static-info">
    <div class="static-info__body">
      <div class="static-info__img">
        <img src="@/assets/image/my-pokemon.png" alt="Покемон">
      </div>
      <div class="static-info__desc info-desc">
        <div class="info-desc__item">
          <div class="info-desc__item-title">Вид</div>
          <div class="info-desc__item-data">clefairy</div>
        </div>
        <div class="info-desc__item">
          <div class="info-desc__item-title">Вес</div>
          <div class="info-desc__item-data">12 кг</div>
        </div>
        <div class="info-desc__item">
          <div class="info-desc__item-title">Суммарно заработано</div>
          <div class="info-desc__item-data">11 200</div>
        </div>
        <div class="info-desc__item">
          <div class="info-desc__item-title">Денег/сек</div>
          <div class="info-desc__item-data">1.1</div>
        </div>
        <div class="info-desc__item">
          <div class="info-desc__item-title">Возраст</div>
          <div class="info-desc__item-data">1 день</div>
        </div>
      </div>
    </div>
  </div>
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
import Button from '../Button.vue';
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.static-info {
  &__body {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 7px;
  }
  &__img {
    width: 143px;
    height: 143px;
    background: rgba($neutral, 0.4) 50% 50%;
    border-radius: 4px;
  }
}

.info-desc {
  width: 70%;
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
    &-title {
      font-weight: bold;
    }
    &-data {
      font-weight: 500;
    }
  }
}

.static-ctrl {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
  &__btn {
    padding: 4px 9px;
  }
}

.search {
  &__form {
  }
  &__input {
    width: 241px;
    padding: 7px;
    &::placeholder {
    }
  }
}
</style>