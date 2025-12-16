const STORAGE_PREFIX = 'hm_';

export class lsHashMap<T = any> {
  mapName: string;
  _iMap: Map<string, T>;

  constructor(mapName: string) {
    this.mapName = mapName;
    this._iMap = new Map();
    this._loadAllFromLS();
  }

  _getLsKey(hash: string) {
    return `${STORAGE_PREFIX}${this.mapName}_${hash}`;
  }

  _loadAllFromLS() { 
    this._iMap.clear();
    for (let i = 0; i < localStorage.length; i++) {
      const lsKey = localStorage.key(i);
      if (lsKey === null) continue;
      if (lsKey.startsWith(`${STORAGE_PREFIX}${this.mapName}_`)) {
        const rawData = localStorage.getItem(lsKey);
        if (rawData === null) continue;
        try {
          const value = JSON.parse(rawData);
          const hash = lsKey.replace(`${STORAGE_PREFIX}${this.mapName}_`, '');
          this._iMap.set(hash, value);
        } catch (e) {
          console.error(`Error parsing data for key ${lsKey}:`, e);
        }
      }
    }
  }

  _persistAllToLS() {
    for (let i = 0; i < localStorage.length; i++) {
      const lsKey = localStorage.key(i);
      if (lsKey === null) continue;
      if (lsKey.startsWith(`${STORAGE_PREFIX}${this.mapName}_`)) {
        localStorage.removeItem(lsKey);
      }
    }
    this._iMap.forEach((value, hash) => {
      const lsKey = this._getLsKey(hash);
      localStorage.setItem(lsKey, JSON.stringify(value));
    });
  }


  set(hash: string, value: T) {
    this._iMap.set(hash, value);
    const lsKey = this._getLsKey(hash);
    localStorage.setItem(lsKey, JSON.stringify(value));
  }

  get(hash: string) {
    return this._iMap.get(hash);
  }

  has(hash: string) {
    return this._iMap.has(hash);
  }

  delete(hash: string) {
    const result = this._iMap.delete(hash);
    if (result) {
      const lsKey = this._getLsKey(hash);
      localStorage.removeItem(lsKey);
    }
    return result;
  }

  getAllValues() {
    return Array.from(this._iMap.values());
  }

  clear() {
    this._iMap.clear();
    for (let i = 0; i < localStorage.length; i++) {
      const lsKey = localStorage.key(i);
      if (lsKey === null) continue;
      if (lsKey.startsWith(`${STORAGE_PREFIX}${this.mapName}_`)) {
        localStorage.removeItem(lsKey);
      }
    }
  }

  get size() {
    return this._iMap.size;
  }
}