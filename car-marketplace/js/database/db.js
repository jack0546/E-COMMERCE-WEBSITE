/* ============================================
   IndexedDB Database Module
   Car Marketplace Database Layer
   ============================================ */
const CarDB = (() => {
  const DB_NAME = 'CarMarketplaceDB';
  const DB_VERSION = 3;
  let _db = null;

  const STORES = {
    cars: { keyPath: 'id', autoIncrement: true, indexes: ['brand', 'model', 'year', 'price', 'transmission', 'fuel', 'featured', 'status'] },
    users: { keyPath: 'id', autoIncrement: true, indexes: ['email', 'role'] },
    orders: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'carId', 'status'] },
    installments: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'carId', 'status'] },
    messages: { keyPath: 'id', autoIncrement: true, indexes: ['conversationId', 'senderId', 'receiverId', 'timestamp'] },
    conversations: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'adminId'] },
    wishlist: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'carId'] },
    sessions: { keyPath: 'token', indexes: ['userId', 'expiry'] }
  };

  function open() {
    return new Promise((resolve, reject) => {
      if (_db) { resolve(_db); return; }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        for (const [name, config] of Object.entries(STORES)) {
          let store;
          if (!db.objectStoreNames.contains(name)) {
            store = db.createObjectStore(name, { keyPath: config.keyPath, autoIncrement: config.autoIncrement });
          } else {
            store = e.target.transaction.objectStore(name);
          }
          config.indexes.forEach(idx => {
            if (!store.indexNames.contains(idx)) {
              store.createIndex(idx, idx, { unique: idx === 'email' && name === 'users' });
            }
          });
        }
      };
      req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  function getStore(storeName, mode = 'readonly') {
    return _db.transaction(storeName, mode).objectStore(storeName);
  }

  function add(storeName, data) {
    return new Promise(async (resolve, reject) => {
      await open();
      const store = getStore(storeName, 'readwrite');
      const req = store.add({ ...data, createdAt: Date.now(), updatedAt: Date.now() });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function put(storeName, data) {
    return new Promise(async (resolve, reject) => {
      await open();
      const store = getStore(storeName, 'readwrite');
      const req = store.put({ ...data, updatedAt: Date.now() });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function get(storeName, id) {
    return new Promise(async (resolve, reject) => {
      await open();
      const store = getStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function getAll(storeName) {
    return new Promise(async (resolve, reject) => {
      await open();
      const store = getStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function getByIndex(storeName, indexName, value) {
    return new Promise(async (resolve, reject) => {
      await open();
      const store = getStore(storeName);
      const index = store.index(indexName);
      const req = index.getAll(value);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function remove(storeName, id) {
    return new Promise(async (resolve, reject) => {
      await open();
      const store = getStore(storeName, 'readwrite');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  function count(storeName) {
    return new Promise(async (resolve, reject) => {
      await open();
      const store = getStore(storeName);
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function clear(storeName) {
    return new Promise(async (resolve, reject) => {
      await open();
      const store = getStore(storeName, 'readwrite');
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  function query(storeName, filterFn) {
    return new Promise(async (resolve, reject) => {
      const all = await getAll(storeName);
      resolve(all.filter(filterFn));
    });
  }

  return { open, add, put, get, getAll, getByIndex, remove, count, clear, query };
})();

window.CarDB = CarDB;
