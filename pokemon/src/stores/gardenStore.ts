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

      gardenBerry.value.forEach(berry => {
        const timePassed = now - berry.timeUpdate;
        const twoMinutes = 2 * 60 * 1000;
        if (timePassed >= twoMinutes) {
          const growthTimer = Math.floor(timePassed / twoMinutes);
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

  const saveGardenData = () => {
    const login = authStore.user?.login;
    if (login) {
      localStorage.setItem(`garden_berries_${login}`, JSON.stringify(gardenBerry.value));

    }
  };

  const loadGardenData = (login: string) => {
    const cached = localStorage.getItem(`garden_berries_${login}`);
    if (cached) {
      gardenBerry.value = JSON.parse(cached);
    } else {
      generateRandomBerries();
    }
    startGrowthTime();
  };

  return {
    gardenSlots,
    gardenBerry,
    //extractBerryFromGarden,
    buyExtension,
    generateRandomBerries,
    startGrowthTime,
    loadGardenData
  };
});