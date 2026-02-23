const cacheStore = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

export const apiCache = {
  get(key) {
    const cached = cacheStore.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      cacheStore.delete(key);
      return null;
    }

    return cached.data;
  },

  set(key, data) {
    cacheStore.set(key, {
      data,
      timestamp: Date.now(),
    });
  },

  clear() {
    cacheStore.clear();
  },

  delete(key) {
    cacheStore.delete(key);
  },

  has(key) {
    return this.get(key) !== null;
  },
};

export const fetchWithCache = async (url, options = {}) => {
  const cacheKey = `${url}:${JSON.stringify(options)}`;

  if (options.cache !== false && apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      apiCache.set(cacheKey, data);
    }

    return data;
  } catch (error) {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.warn(`Using stale cache for ${url}:`, error);
      return cachedData;
    }
    throw error;
  }
};
