const STORAGE_PREFIX = 'hm_';

export class lsHashMap<T> {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  set(id: string, value: T) {
    const allData = this.getAllValues();
    allData[id] = value;
    localStorage.setItem(this.key, JSON.stringify(allData));
  }

  get(id: string) {
    const allData = this.getAllValues();
    return allData[id] || null;
  }

  getAllValues(): Record<string, T> {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : {};
  }

  delete(id: string) {
    const allData = this.getAllValues();
    delete allData[id];
    localStorage.setItem(this.key, JSON.stringify(allData));
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}