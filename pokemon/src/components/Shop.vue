<template>
  <section class="shop">
    <div class="shop__container">
      <div class="shop__body">
        <h2 class="shop__title">Shop</h2>
        <div class="shop__filters filters">
          <div class="filters__tag">Ягоды</div>
          <div class="filters__tag">Покеболлы</div>
        </div>
        <div class="shop__list shop-list">
          <div class="shop-list__item">
            <div class="shop-list__item-info">
              <div class="shop-list__item-img">
                <img src="../assets/image/small-fruit-1.png" alt="Ягода 1 уровня" />
              </div>
              <div class="shop-list__item-desc">
                <div class="shop-list__item-title">Ягода 1 уровня</div>
                <div class="shop-list__item-text">Накорми ей покемона для увеличения веса на 0.1 кг </div>
              </div>
            </div>
            <button class="shop-list__item-button">Купить за 1000</button>
          </div>
          <div class="shop-list__item">
            <div class="shop-list__item-info">
              <div class="shop-list__item-img">
                <img src="../assets/image/egg-1.png" alt="Покеболл 1 уровня" />
              </div>
              <div class="shop-list__item-desc">
                <div class="shop-list__item-title">Покеболл 1 уровня</div>
                <div class="shop-list__item-text">Во время охоты ловит покемона с шансом 7%</div>
              </div>
            </div>
            <button class="shop-list__item-button">Купить за 5000</button>
          </div>
          <div class="shop-list__item">
            <div class="shop-list__item-info">
              <div class="shop-list__item-img">
                <img src="../assets/image/egg-2.png" alt="Покеболл 2 уровня" />
              </div>
              <div class="shop-list__item-desc">
                <div class="shop-list__item-title">Покеболл 2 уровня</div>
                <div class="shop-list__item-text">Во время охоты ловит покемона с шансом 15%</div>
              </div>
            </div>
            <button class="shop-list__item-button">Купить за 10 000</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.shop {
  &__body {
    background: $white;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0px 0px 16px rgba(58, 58, 58, 0.1);
  }
  &__title {
    @include design-text;
  }
}

.filters {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    &__tag {
      background: rgba($neutral, 0.2);
      border-radius: 4px;
      padding: 0.25rem 0.6rem;
      font-size: 0.875rem;
      color: rgba($text, 0.5);
      user-select: none;
      display: flex;
      align-items: center;
      &::after {
        content: 'x';
        margin-left: 0.4rem;
        cursor: pointer;
        font-weight: 700;
      }
    }
  }

.shop-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  &__item {
    display: flex;
    flex-direction: column;
    background: $white;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    box-shadow: 0px 0px 16px rgba(58, 58, 58, 0.1);
    &-img {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.4rem;
      img {
        width: 59px;
        height: 59px;
        object-fit: contain;
        border-radius: 8px;
        background: rgba($neutral, 0.2);
      }
    }
    &-info {
      display: flex;
      justify-content: space-between;
      gap: 23px;
    }
    &-title {
      font-weight: 700;
      font-size: 1rem;
      color: $text;
    }
    &-text {
      font-size: 0.875rem;
      color: rgba($text, 0.5);;
      margin-bottom: 0.75rem;
      line-height: 1.3;
    }
    &-button {
      @include btn-primary;
      padding: 0.5rem 0;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.5s ease;
      &:hover {
        @include btn-primary-hover;
        transition: all 0.5s ease;
      }
    }
  }
}

</style>