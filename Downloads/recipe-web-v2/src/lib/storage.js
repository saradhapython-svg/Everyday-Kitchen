// Single namespace prevents collisions across keys
const PREFIX = 'ek:';

export const storage = {
  async load(key, fallback) {
    try {
      const v = localStorage.getItem(PREFIX + key);
      if (v === null) return fallback;
      return JSON.parse(v);
    } catch { return fallback; }
  },
  async save(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch (e) { console.error('storage save failed', e); }
  },
  async remove(key) {
    try { localStorage.removeItem(PREFIX + key); }
    catch {}
  },
  async clearAll() {
    try {
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(PREFIX)) toRemove.push(k);
      }
      toRemove.forEach(k => localStorage.removeItem(k));
    } catch {}
  },
};
