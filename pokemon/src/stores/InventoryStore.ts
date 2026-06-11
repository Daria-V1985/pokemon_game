import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from './AuthStore';
import { useUserStore } from './useUserStore';
import { InventoryItem } from '@/types/inventoryItem';

export const useInventoryStore = defineStore('inventory', () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const inventStore = computed(() => userStore.inventory); 

  const findFirstEmptySlot = (): number => {
    return Array.from({ length: 50 }, (_, i) => i)
      .findIndex(i => !userStore.inventory.some(item => item.slot === i)); 
  };

  const buyItem = (shopItem: Omit<InventoryItem, 'slot'>) => {
    if (userStore.money < shopItem.price) {
      alert('Недостаточно монет для покупки!');
      return false;
    }

    const emptySlot = findFirstEmptySlot();
    if (emptySlot === -1) {
      alert('Ваш инвентарь полностью заполнен!');
      return false;
    }

    userStore.money -= shopItem.price;

    userStore.inventory.push({
      ...shopItem,
      slot: emptySlot
    } as InventoryItem);
    
    const login = authStore.user?.login;
    if (login) {
      userStore.saveUserData(login);
    }
    return true;
  };

  return {
    inventStore,
    buyItem
  };
});