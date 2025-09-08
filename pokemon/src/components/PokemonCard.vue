<template>
  <article class="pokemons__card card">
    <div class="card__header">
      <h3 class="card__title">clefairy</h3>
      <button class="card__settings">
        <img src="../assets/image/svg/setting.svg" alt="Настройка покемона">
      </button>
    </div>
    <div class="card__image">
      <img src="../assets/image/my-pokemon.png" alt="Покемон" />
    </div>
    <div class="card__info card-info">
      <div class="card-info__row weight">
        <span class="weight__label">Вес</span>
        <span class="weight__value">12 кг</span>
      </div>
      <div class="card-info__row money">
        <span class="money__label">Денег/сек</span>
        <span class="money__value">1.1</span>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.card {
  width: 180px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: Arial, sans-serif;
  color: #111;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  &__title {
    font-weight: 700;
    font-size: 1.1rem;
    margin: 0;
  }

    .settings-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 1;
      color: #f7b500; // золотистый цвет шестерёнки
      transition: color 0.3s ease;

      &:hover {
        color: #d18c00;
      }
    }
  }

  .card-image {
    display: flex;
    justify-content: center;

    img {
      width: 80px;
      height: 80px;
      image-rendering: pixelated; // для пиксельной графики
    }
  }

  .card-info {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .info-row {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      font-size: 0.95rem;

      .label {
        color: #222;
      }

      .value {
        color: #222;
      }
    }
  }
}
</style>