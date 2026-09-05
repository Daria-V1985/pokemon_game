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
    const INVENTORY_COLUMNS = 7;
    const blockedSlots = new Set<number>();
    
    userStore.inventory.forEach(item => {
      blockedSlots.add(item.slot);
      if (item.isMega) {
        blockedSlots.add(item.slot + 1);
        blockedSlots.add(item.slot + INVENTORY_COLUMNS);
        blockedSlots.add(item.slot + INVENTORY_COLUMNS + 1);
      }
    });

    for (let i = 0; i < userStore.inventorySlots; i++) {
      if (!blockedSlots.has(i)) {
        return i; 
      }
    }
    return -1;
  };

  const buyItem = (shopItem: Omit<InventoryItem, 'slot'>) => {
    if (userStore.money < shopItem.price) {
      alert('Недостаточно монет для покупки!');
      return false;
    }

    const emptySlot = findFirstEmptySlot();
    if (emptySlot === -1) {
      alert('В вашем рюкзаке недостаточно открытого места! Купите расширение инвентаря');
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

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex >= userStore.inventorySlots) {
      console.warn('Попытка перемещения предмета в закрытую зону инвентаря');
      return;
    }

    const itemToMove = userStore.inventory.find(item => item.slot === fromIndex);
    if (!itemToMove) return;

    const targetItem = userStore.inventory.find(item => item.slot === toIndex);
    if (targetItem) {
      targetItem.slot = fromIndex;
    }
    itemToMove.slot = toIndex;

    const login = authStore.user?.login;
    if (login) {
      userStore.saveUserData(login);
    }
  };

  const removeItemBySlot = (slot: number) => {
    const index = userStore.inventory.findIndex(item => item.slot === slot);
    if (index !== -1) {
      userStore.inventory.splice(index, 1);

      const login = authStore.user?.login;
      if (login) {
        userStore.saveUserData(login);
      }
      return true;
    }
    return false;
  };

  const buyInventorySlots = (): boolean => {
    const EXTENSION_PRICE = 1000;

    if (userStore.money < EXTENSION_PRICE) {
      alert('Недостаточно монет для расширения инвентаря!');
      return false;
    }

    if (userStore.inventorySlots >= 50) {
      alert('Ваш рюкзак уже расширен до максимального размера (50 ячеек)!');
      return false;
    }

    userStore.money -= EXTENSION_PRICE;
    userStore.inventorySlots += 5;

    const login = authStore.user?.login;
    if (login) {
      userStore.saveUserData(login);
    }

    console.log(`Рюкзак успешно расширен! Текущий лимит ячеек: ${userStore.inventorySlots}`);
    return true;
  }

  return {
    inventStore,
    buyItem,
    moveItem,
    removeItemBySlot,
    findFirstEmptySlot,
    buyInventorySlots
  };
});