import { ref } from 'vue';

const aliases = ref<Map<number, string>>(new Map());

const loadFromLS = () => {
  const stored = localStorage.getItem('pokemon_aliases');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      aliases.value = new Map(Object.entries(parsed).map(([k, v]) => [Number(k), v as string]));
    } catch (error) {
      console.error('Ошибка загрузки псевдонимов из LS:', error);
      aliases.value = new Map();
    }
  } else {
    aliases.value = new Map();
  }
};

const saveToLS = () => {
  const obj = Object.fromEntries(aliases.value);
  localStorage.setItem('pokemon_aliases', JSON.stringify(obj));
};

const getAlias = (id: number): string | null => {
  return aliases.value.get(id) || null;
};

const setAlias = (id: number, name: string) => {
  aliases.value.set(id, name);
  saveToLS(); 
};

loadFromLS();

export { getAlias, setAlias };