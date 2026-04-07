import type { ScanImageItem } from "../types";

const DB_NAME = "acccalc-scan-session";
const DB_VERSION = 1;
const STORE_NAME = "sessions";
const ACTIVE_SESSION_KEY = "active";
const MAX_SESSION_AGE_MS = 1000 * 60 * 60 * 24 * 3;

type PersistedScanImageItem = Omit<ScanImageItem, "file" | "previewUrl"> & {
    sourceDataUrl: string | null;
    previewUrl?: string;
};

type PersistedScanSession = {
    id: string;
    savedAt: number;
    items: PersistedScanImageItem[];
};

function openDatabase() {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error ?? new Error("Unable to open scan session DB."));
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
    work: (store: IDBObjectStore, resolve: (value: T) => void, reject: (error: Error) => void) => void
) {
    return openDatabase().then(
        (db) =>
            new Promise<T>((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, mode);
                const store = transaction.objectStore(STORE_NAME);
                work(
                    store,
                    (value) => resolve(value),
                    (error) => reject(error)
                );
                transaction.oncomplete = () => db.close();
                transaction.onerror = () => reject(transaction.error ?? new Error("Scan session transaction failed."));
            })
    );
}

function revokeIfBlob(url: string | null | undefined) {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
}

function dataUrlToFile(dataUrl: string, name: string) {
    const [header, body] = dataUrl.split(",");
    const mimeMatch = header.match(/data:(.*?);base64/);
    const mime = mimeMatch?.[1] ?? "image/png";
    const binary = atob(body ?? "");
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return new File([bytes], name, { type: mime });
}

function serializeItems(items: ScanImageItem[]): PersistedScanImageItem[] {
    return items.map(({ file: _file, previewUrl, ...item }) => ({
        ...item,
        sourceDataUrl: item.sourceDataUrl ?? previewUrl ?? null,
        previewUrl: undefined,
        updatedAt: item.updatedAt ?? Date.now(),
    }));
}

export async function saveScanSession(items: ScanImageItem[]) {
    if (typeof indexedDB === "undefined") return;

    if (items.length === 0) {
        await clearScanSession();
        return;
    }

    const payload: PersistedScanSession = {
        id: ACTIVE_SESSION_KEY,
        savedAt: Date.now(),
        items: serializeItems(items),
    };

    await runStoreRequest<void>("readwrite", (store, resolve, reject) => {
        const request = store.put(payload, ACTIVE_SESSION_KEY);
        request.onerror = () => reject(request.error ?? new Error("Failed to save scan session."));
        request.onsuccess = () => resolve();
    });
}

export async function loadScanSession() {
    if (typeof indexedDB === "undefined") {
        return { items: [] as ScanImageItem[], restored: false };
    }

    const payload = await runStoreRequest<PersistedScanSession | null>("readonly", (store, resolve, reject) => {
        const request = store.get(ACTIVE_SESSION_KEY);
        request.onerror = () => reject(request.error ?? new Error("Failed to load scan session."));
        request.onsuccess = () => resolve((request.result as PersistedScanSession | undefined) ?? null);
    });

    if (!payload) {
        return { items: [] as ScanImageItem[], restored: false };
    }

    if (Date.now() - payload.savedAt > MAX_SESSION_AGE_MS) {
        await clearScanSession();
        return { items: [] as ScanImageItem[], restored: false };
    }

    const items = payload.items
        .filter((item) => Boolean(item.sourceDataUrl))
        .map((item) => {
            const sourceDataUrl = item.sourceDataUrl ?? null;
            const previewUrl = sourceDataUrl ?? item.previewUrl ?? "";
            return {
                ...item,
                sourceDataUrl,
                previewUrl,
                file: dataUrlToFile(sourceDataUrl ?? previewUrl, item.name),
                updatedAt: item.updatedAt ?? payload.savedAt,
            } satisfies ScanImageItem;
        });

    return { items, restored: items.length > 0 };
}

export async function clearScanSession() {
    if (typeof indexedDB === "undefined") return;
    await runStoreRequest<void>("readwrite", (store, resolve, reject) => {
        const request = store.delete(ACTIVE_SESSION_KEY);
        request.onerror = () => reject(request.error ?? new Error("Failed to clear scan session."));
        request.onsuccess = () => resolve();
    });
}

export function cleanupScanItemUrls(items: ScanImageItem[]) {
    items.forEach((item) => {
        if (item.previewUrl !== item.sourceDataUrl) {
            revokeIfBlob(item.previewUrl);
        }
    });
}
