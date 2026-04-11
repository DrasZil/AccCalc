const DB_NAME = "accalc-local";
const DB_VERSION = 1;
const STORE_NAME = "records";

function openDatabase() {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () =>
            reject(request.error ?? new Error("Unable to open AccCalc local database."));
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
    });
}

function runStoreRequest<T>(
    mode: IDBTransactionMode,
    work: (
        store: IDBObjectStore,
        resolve: (value: T) => void,
        reject: (error: Error) => void
    ) => void
) {
    return openDatabase().then(
        (db) =>
            new Promise<T>((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, mode);
                const store = transaction.objectStore(STORE_NAME);
                work(store, resolve, reject);
                transaction.oncomplete = () => db.close();
                transaction.onerror = () =>
                    reject(transaction.error ?? new Error("Local database transaction failed."));
            })
    );
}

export async function readIndexedValue<T>(key: string): Promise<T | null> {
    if (typeof indexedDB === "undefined") return null;

    return runStoreRequest<T | null>("readonly", (store, resolve, reject) => {
        const request = store.get(key);
        request.onerror = () =>
            reject(request.error ?? new Error(`Failed to read local record "${key}".`));
        request.onsuccess = () => resolve((request.result as T | undefined) ?? null);
    });
}

export async function writeIndexedValue<T>(key: string, value: T) {
    if (typeof indexedDB === "undefined") return;

    await runStoreRequest<void>("readwrite", (store, resolve, reject) => {
        const request = store.put(value, key);
        request.onerror = () =>
            reject(request.error ?? new Error(`Failed to write local record "${key}".`));
        request.onsuccess = () => resolve();
    });
}
