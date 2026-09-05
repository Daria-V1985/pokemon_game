import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';
import { useAuthStore } from './AuthStore';
import { useUserStore } from './useUserStore';
import { gardenBerry } from '@/types/gardenItem';

interface GardenBerryExtended extends gardenBerry {
  waveSpawned?: boolean; 
}

interface PauseTimeSlot {
  gardenSlot: number;
  availableAt: number;
}

export const useGardenStore = defineStore('garden', () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const gardenSlots = computed(() => userStore.gardenSlots);
  const gardenBerry = ref<GardenBerryExtended[]>([]);
  const buffEnd_2 = ref<number>(0);
  const buffEnd_5 = ref<number>(0);
  
  const isActiveBuff_2 = computed(() => Date.now() < buffEnd_2.value);
  const isActiveBuff_5 = computed(() => Date.now() < buffEnd_5.value);
  const slotsOnPause = ref<PauseTimeSlot[]>([]);

  const buyExtension = (): boolean => {
    const EXTENSION_PRICE = 1000;

    if (userStore.money < EXTENSION_PRICE) {
      alert('Недостаточно монет для расширения грядки!');
      return false;
    }
    userStore.money -= EXTENSION_PRICE;
    userStore.gardenSlots += 2;

    const login = authStore.user?.login;
    if (login) {
      userStore.saveUserData(login);
    }
    return true;
  };

  const emptyActiveSlots = (): number[] => {
    const GRID_COLUMNS = 7; 
    const busySlots = new Set<number>();

    gardenBerry.value.forEach(berry => {
      busySlots.add(berry.gardenSlot);
      if (berry.isMega) {
        busySlots.add(berry.gardenSlot + 1);
        busySlots.add(berry.gardenSlot + GRID_COLUMNS);
        busySlots.add(berry.gardenSlot + GRID_COLUMNS + 1);
      }
    });

    slotsOnPause.value.forEach(p => busySlots.add(p.gardenSlot));
    return Array.from({ length: userStore.gardenSlots }, (_, i) => i)
      .filter(slotIndex => !busySlots.has(slotIndex));
  };

  const spawnNewBerryWave = () => {
    const emptySlots = emptyActiveSlots();
    if (emptySlots.length === 0) return; 

    const countToSpawn = Math.min(emptySlots.length, Math.floor(Math.random() * 2) + 1);
    const randomSlots = emptySlots.sort(() => 0.5 - Math.random()).slice(0, countToSpawn);

    randomSlots.forEach(slot => {
      gardenBerry.value.push({
        gardenSlot: slot,
        scale: 10,
        timeUpdate: Date.now(),
        isMega: Math.random() < 0.15,
        waveSpawned: false,
      });
    });

    saveGardenData();
  };

  const extractBerryFromGarden = (gardenSlotIndex: number): boolean => {
    const berryIndex = gardenBerry.value.findIndex(berry => berry.gardenSlot === gardenSlotIndex);
    if (berryIndex === -1) return false;

    const berry = gardenBerry.value[berryIndex];
    if (berry.scale < 100) {
      console.warn(`Ягода еще не созрела. Текущий рост: ${berry.scale}%`);
      return false;
    }

    const INVENTORY_COLUMNS = 7;
    const blockedSlotsInInventory = new Set<number>();

    userStore.inventory.forEach(item => {
      blockedSlotsInInventory.add(item.slot);

      if (item.isMega) {
        blockedSlotsInInventory.add(item.slot + 1);
        blockedSlotsInInventory.add(item.slot + INVENTORY_COLUMNS);
        blockedSlotsInInventory.add(item.slot + INVENTORY_COLUMNS + 1);
      }
    });

    let targetInventSlot = -1;
    const isMega = !!berry.isMega;

    if (isMega) {
      for (let i = 0; i < userStore.inventorySlots; i++) {
        if ((i % INVENTORY_COLUMNS) === INVENTORY_COLUMNS - 1) continue;
        if (i + INVENTORY_COLUMNS >= userStore.inventorySlots) continue;

        const slotRight = i + 1;
        const slotBottom = i + INVENTORY_COLUMNS;
        const slotBottomRight = i + INVENTORY_COLUMNS + 1;

        const isRootFree = !blockedSlotsInInventory.has(i);
        const isRightFree = !blockedSlotsInInventory.has(slotRight);
        const isBottomFree = !blockedSlotsInInventory.has(slotBottom);
        const isBottomRightFree = !blockedSlotsInInventory.has(slotBottomRight);

        if (isRootFree && isRightFree && isBottomFree && isBottomRightFree) {
          targetInventSlot = i; 
          break; 
        }
      }
    } else {
      for (let i = 0; i < userStore.inventorySlots; i++) {
        if (!blockedSlotsInInventory.has(i)) {
          targetInventSlot = i;
          break;
        }
      }
    }

    if (targetInventSlot === -1) {
      if (isMega) {
        alert('В вашем рюкзаке недостаточно свободного места! Требуется пустой участок размером 2х2 ячейки.');
      } else {
        alert('Ваш инвентарь полностью заполнен! Освободите место для сбора урожая.');
      }
      return false;
    }

    const berryName = isMega ? 'Ягода 2 уровня' : 'Ягода 1 уровня';
    const berryImage = isMega 
      ? require('@/assets/image/big-fruit-1.png') 
      : require('@/assets/image/small-fruit-1.png');

    const newInventoryItem = ({
      id: Date.now(), 
      name: berryName, 
      type: 'berry' as const,
      image: berryImage, 
      price: berry.isMega ? 300 : 100, 
      slot: targetInventSlot,
      isMega: isMega,
    });
    
    nextTick(() => {
      userStore.inventory.push(newInventoryItem);
      gardenBerry.value.splice(berryIndex, 1);

      const COOLDOWN_TIME = 30 * 1000;
      slotsOnPause.value.push({
        gardenSlot: gardenSlotIndex,
        availableAt: Date.now() + COOLDOWN_TIME
      });

      saveGardenData();
      const login = authStore.user?.login;
      if (login) {
        userStore.saveUserData(login);
      }
    });

    console.log(`Ягода собрана из слота сада #${gardenSlotIndex} и помещена в рюкзак в слот #${targetInventSlot}`);
    return true;
  };

  const generateRandomBerries = () => {
    gardenBerry.value = [];
    slotsOnPause.value = [];
    const availebleSlots = Array.from({ length: userStore.gardenSlots }, (_, i) => i);
    const randomSlots = availebleSlots.sort(() => 0.5 - Math.random()).slice(0, 3);

    randomSlots.forEach((slot, index) => {
      gardenBerry.value.push({
        gardenSlot: slot,
        scale: 10,    
        timeUpdate: Date.now(), 
        isMega: index === 0,
        waveSpawned: false
      });
    });
    saveGardenData();
  };

  let growthInterval: any = null;

  const startGrowthTime = () => {
    if (growthInterval) clearInterval(growthInterval);

    growthInterval = setInterval(() => {
      const now = Date.now();
      let hasChanges = false;

      if (buffEnd_2.value > 0 && now > buffEnd_2.value) {
        buffEnd_2.value = 0;
        hasChanges = true;
      }
      if (buffEnd_5.value > 0 && now > buffEnd_5.value) {
        buffEnd_5.value = 0;
        hasChanges = true;
      }

      let timeForTick = 2 * 60 * 1000; 

      if (isActiveBuff_2.value && isActiveBuff_5.value) {
        timeForTick = 5500;
      } else if (isActiveBuff_2.value) {
        timeForTick = 1000;
      } else if (isActiveBuff_5.value) {
        timeForTick = 7000;  
      }

      gardenBerry.value.forEach(berry => {
        const timePassed = now - berry.timeUpdate;
        if (timePassed >= timeForTick) {
          const growthTimer = Math.floor(timePassed / timeForTick);
          berry.scale = Math.min(100, berry.scale + (growthTimer * 5));
          berry.timeUpdate = now;
          hasChanges = true;
        }

        if (berry.scale >= 60 && !berry.waveSpawned) {
          spawnNewBerryWave();     
          berry.waveSpawned = true; 
          hasChanges = true;
        }
      });

      if (slotsOnPause.value.length > 0) {
        for (let i = slotsOnPause.value.length - 1; i >= 0; i--) {
          const pSlot = slotsOnPause.value[i];

          if (now >= pSlot.availableAt) {
            gardenBerry.value.push({
              gardenSlot: pSlot.gardenSlot,
              scale: 10,
              timeUpdate: now,
              isMega: Math.random() < 0.1,
              waveSpawned: false
            });
            
            slotsOnPause.value.splice(i, 1);
            hasChanges = true;
          }
        }
      }

      if (hasChanges) {
        saveGardenData();
      }
    }, 1000); 
  };

  const growthSpeedText = computed(() => {
    if (isActiveBuff_2.value && isActiveBuff_5.value) return '17%/час';
    if (isActiveBuff_2.value) return '12%/час';
    if (isActiveBuff_5.value) return '15%/час';
    return '10%/час'; 
  });

  const hasGrowingBerries = computed(() => {
    if (gardenBerry.value.length === 0) return false;
    return gardenBerry.value.some(berry => berry.scale < 100);
  });

  const buySpeedBuff = (type: 'buff2' | 'buff5'): boolean => {
    const price = type === 'buff2' ? 2000 : 5000;
    if (userStore.money < price) {
      alert('Недостаточно монет для покупки баффа!');
      return false;
    }

    userStore.money -= price;
    const DURATION = 15 * 1000;
    if (type === 'buff2') buffEnd_2.value = Date.now() + DURATION;
    if (type === 'buff5') buffEnd_5.value = Date.now() + DURATION;

    saveGardenData();
    const login = authStore.user?.login;
    if (login) {
      userStore.saveUserData(login);
    }

    return true;
  }

  const saveGardenData = () => {
    const login = authStore.user?.login;
    if (login) {
      const state = {
        berries: gardenBerry.value,
        buffEnd_2: buffEnd_2.value,
        buffEnd_5: buffEnd_5.value,
        pause: slotsOnPause.value,
      };
      localStorage.setItem(`garden_berries_${login}`, JSON.stringify(state));
    }
  };

  const loadGardenData = (login: string) => {
    const cached = localStorage.getItem(`garden_berries_${login}`);
    if (cached === null) {
      generateRandomBerries();
    } else {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          gardenBerry.value = parsed.map(b => ({ ...b, waveSpawned: b.waveSpawned ?? false }));
          buffEnd_2.value = 0;
          buffEnd_5.value = 0;
          slotsOnPause.value = [];
        } else {
          gardenBerry.value = parsed.berries || [];
          buffEnd_2.value = parsed.buffEnd_2 || 0;
          buffEnd_5.value = parsed.buffEnd_5 || 0;
          slotsOnPause.value = parsed.pause || [];
        }
      } catch (err) {
        generateRandomBerries();
      }
    }
    startGrowthTime();
  };

  return {
    gardenSlots,
    gardenBerry,
    growthSpeedText,
    isActiveBuff_2, 
    isActiveBuff_5, 
    hasGrowingBerries,
    extractBerryFromGarden,
    buyExtension,
    buySpeedBuff,
    generateRandomBerries,
    startGrowthTime,
    loadGardenData,
  };
});