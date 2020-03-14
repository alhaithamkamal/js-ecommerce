const DB_NAME = 'order_store';
const DB_V = 1;
const ORDERS_STORE_NAME = 'orders';
let db;
if ('indexedDB' in window) {
    // open db
    openDB();
}
function openDB(){
    const dbReq = indexedDB.open(DB_NAME, DB_V);
    
    dbReq.onerror = (ev) => {
        console.error('onerror', ev.target.errorCode);
    };

    dbReq.onupgradeneeded = (ev) => {
        const db = ev.target.result;
        if (!db.objectStoreNames.contains(ORDERS_STORE_NAME)) {
            booksStore = db.createObjectStore(ORDERS_STORE_NAME, { keyPath: 'num', autoIncrement: true });
        }
    }

    dbReq.onsuccess = (ev) => {
        db = ev.target.result;
    }
}
function save_order(totalPrice) {
    if (db instanceof IDBDatabase) {
        const tx = db.transaction(ORDERS_STORE_NAME, 'readwrite');
        const orderStore = tx.objectStore(ORDERS_STORE_NAME);
        orderStore.add({
            total_price: totalPrice,
            date: new Date(),
        });
    }
}
function get_orders(totalPrice) {
    if (db instanceof IDBDatabase) {
        const tx = db.transaction(ORDERS_STORE_NAME, 'readwrite');
        const orderStore = tx.objectStore(ORDERS_STORE_NAME);
        let res = orderStore.getAll();
        res.onsuccess((e) => {
            return e.target.result
        })
        res.onerror((e) => {
            return null
        })
    }
}
