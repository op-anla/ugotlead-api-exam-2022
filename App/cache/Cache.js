const NodeCache = require("node-cache");

class Cache {
  constructor(ttlSeconds) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  get(key, storeFunction) {
    console.log("🚀 ~ file: Cache.js ~ line 13 ~ Cache ~ get ~ key", key);
    const value = this.cache.get(key);
    if (value) {
      console.log("🚀 ~ file: Cache.js ~ line 16 ~ Cache ~ get ~ value", value);
      return Promise.resolve(value);
    }

    return storeFunction().then((result) => {
      console.log(
        "🚀 ~ file: Cache.js ~ line 20 ~ Cache ~ returnstoreFunction ~ result",
        result
      );
      this.cache.set(key, result);
      return result;
    });
  }

  del(keys) {
    this.cache.del(keys);
  }

  delStartWith(startStr = "") {
    if (!startStr) {
      return;
    }

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key);
      }
    }
  }

  flush() {
    this.cache.flushAll();
  }
}

module.exports = Cache;
