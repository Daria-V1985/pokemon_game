import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './AuthStore';
import { useUserStore } from './useUserStore';
import { gardenBerry } from '@/types/gardenItem';

export const useGardenStore = defineStore('garden', () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const gardenSlots = computed(() => userStore.gardenSlots);
  const gardenBerry = ref<gardenBerry[]>([]);
  const buffEnd_2 = ref<number>(0);
  const buffEnd_5 = ref<number>(0);
  
  const isActiveBuff_2 = computed(() => Date.now() < buffEnd_2.value);
  const isActiveBuff_5 = computed(() => Date.now() < buffEnd_5.value);
  //const slotsOnPause = ref<PauseTimeSlot[]>([]);

  //let isWaveTriggered = false;

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

  const extractBerryFromGarden = (gardenSlotIndex: number): boolean => {
    const berryIndex = gardenBerry.value.findIndex(berry => berry.gardenSlot === gardenSlotIndex);
    if (berryIndex === -1) return false;

    const berry = gardenBerry.value[berryIndex];
    if (berry.scale < 100) {
      console.warn(`Ягода еще не созрела. Текущий рост: ${berry.scale}%`);
      return false;
    }

    const emptyInventSlot = Array.from({ length: 50 }, (_, i) => i).findIndex(i => !userStore.inventory.some(item => item.slot === i));
    if (emptyInventSlot === -1) {
      alert('Ваш инвентарь полностью заполнен! Сбор невозможен.');
      return false;
    }

    userStore.inventory.push({
      id: Date.now(), 
      name: berry.isMega ? 'Мега-Оран' : 'Оран', 
      type: 'berry' as const,
      image: require('@/assets/image/small-fruit-1.png'), 
      price: berry.isMega ? 5000 : 2000, 
      slot: emptyInventSlot
    });
    
    gardenBerry.value.splice(berryIndex, 1);
    saveGardenData();
    const login = authStore.user?.login;
    if (login) {
      userStore.saveUserData(login);
    }

    console.log(`Ягода собрана из слота сада #${gardenSlotIndex} и помещена в рюкзак в слот #${emptyInventSlot}`);
    return true;
  };

  const generateRandomBerries = () => {
    gardenBerry.value = [];
    const availebleSlots = Array.from({ length: userStore.gardenSlots }, (_, i) => i);
    const randomSlots = availebleSlots.sort(() => 0.5 - Math.random()).slice(0, 3);

    randomSlots.forEach((slot, index) => {
      gardenBerry.value.push({
        gardenSlot: slot,
        scale: 10,    
        timeUpdate: Date.now(), 
        isMega: index === 0,
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
      let timeForTick = 2 * 60 * 1000; 

      if (isActiveBuff_2.value && isActiveBuff_5.value) {
        timeForTick = 55000;
      } else if (isActiveBuff_2.value) {
        timeForTick = 100000;
      } else if (isActiveBuff_5.value) {
        timeForTick = 70000;  
      }

      gardenBerry.value.forEach(berry => {
        const timePassed = now - berry.timeUpdate;
        if (timePassed >= timeForTick) {
          const growthTimer = Math.floor(timePassed / timeForTick);
          berry.scale = Math.min(100, berry.scale + (growthTimer * 5));
          berry.timeUpdate = now;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        saveGardenData();
      }
    }, 1000);
  };

  const growthSpeedText = computed(() => {
    if (isActiveBuff_2.value && isActiveBuff_5) return '17%/час';
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
    const DURATION = 1 * 60 * 60 * 1000;
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
      };
      localStorage.setItem(`garden_berries_${login}`, JSON.stringify(state));
    }
  };

  const loadGardenData = (login: string) => {
    const cached = localStorage.getItem(`garden_berries_${login}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          gardenBerry.value = parsed;
          buffEnd_2.value = 0;
          buffEnd_5.value = 0;
        } else {
          gardenBerry.value = parsed.berries || [];
          buffEnd_2.value = parsed.buffEnd_2 || 0;
          buffEnd_5.value = parsed.buffEnd_5 || 0;
        }
      } catch {
        generateRandomBerries();
      }
    } else {
      generateRandomBerries();
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