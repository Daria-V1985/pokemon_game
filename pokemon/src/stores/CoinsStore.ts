import { defineStore } from 'pinia';

function getStorageUserCoins(userId: string) {
  return `coins_${userId}`;
}

export const useCoinsStore = defineStore('coins', {
  state: () => ({
    userId: '',
    count: 0, 
  }),
  actions: {
    init(userId: string) {
      this.userId = userId;
      const saved = localStorage.getItem(getStorageUserCoins(userId));
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        this.count = isNaN(parsed) ? 0 : parsed;
      } else {
        this.count = 1000000; // дефолтное значение, если нет сохранения
        this.save();
      }
    },
    increment() {
      this.count++;
      this.save();
    },
    decrement() {
      if (this.count > 0) {
        this.count--;
        this.save();
      }
    },
    save() {
      if (this.userId) {
        localStorage.setItem(getStorageUserCoins(this.userId), this.count.toString());
      }
    },
  },

});