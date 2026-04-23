import type {
    AccountingWorksheetExtraction,
    ParsedScanResult,
    ScanImageItem,
    ScanImageSourceKind,
    ScanPageType,
    ScanProblemKind,
    StructuredScanField,
} from "../types";

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

type LoadScanSessionResult = {
    items: ScanImageItem[];
    restored: boolean;
    repaired: boolean;
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

function ensureStringArray(value: unknown) {
    return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function ensureStructuredFields(value: unknown): StructuredScanField[] {
    if (!Array.isArray(value)) return [];
    return value
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) => {
            const field = entry as Record<string, unknown>;
            let valueKind: StructuredScanField["valueKind"];
            if (
                field.valueKind === "money" ||
                field.valueKind === "percent" ||
                field.valueKind === "number" ||
                field.valueKind === "date" ||
                field.valueKind === "quantity" ||
                field.valueKind === "text"
            ) {
                valueKind = field.valueKind;
            }
            return {
                key: typeof field.key === "string" ? field.key : "",
                label: typeof field.label === "string" ? field.label : "",
                value: typeof field.value === "string" ? field.value : "",
                confidence:
                    typeof field.confidence === "number" && Number.isFinite(field.confidence)
                        ? field.confidence
                        : 0,
                inferred: field.inferred === true,
                normalizedValue:
                    typeof field.normalizedValue === "string"
                        ? field.normalizedValue
                        : undefined,
                valueKind,
                sourceLine:
                    typeof field.sourceLine === "string" ? field.sourceLine : undefined,
                needsReview: field.needsReview === true,
            };
        })
        .filter((field) => field.key && field.label);
}

function sanitizeOcrResult(value: unknown): ScanImageItem["ocrResult"] {
    if (!value || typeof value !== "object") return null;
    const ocr = value as Record<string, unknown>;
    const blocks = Array.isArray(ocr.blocks)
        ? ocr.blocks
              .filter((entry) => entry && typeof entry === "object")
              .map((entry) => {
                  const block = entry as Record<string, unknown>;
                  const bbox = (block.bbox as Record<string, unknown> | undefined) ?? {};
                  return {
                      text: typeof block.text === "string" ? block.text : "",
                      confidence:
                          typeof block.confidence === "number" && Number.isFinite(block.confidence)
                              ? block.confidence
                              : 0,
                      bbox: {
                          x0: typeof bbox.x0 === "number" ? bbox.x0 : 0,
                          y0: typeof bbox.y0 === "number" ? bbox.y0 : 0,
                          x1: typeof bbox.x1 === "number" ? bbox.x1 : 0,
                          y1: typeof bbox.y1 === "number" ? bbox.y1 : 0,
                      },
                  };
              })
        : [];

    return {
        text: typeof ocr.text === "string" ? ocr.text : "",
        confidence:
            typeof ocr.confidence === "number" && Number.isFinite(ocr.confidence)
                ? ocr.confidence
                : 0,
        meanWordConfidence:
            typeof ocr.meanWordConfidence === "number" && Number.isFinite(ocr.meanWordConfidence)
                ? ocr.meanWordConfidence
                : 0,
        warnings: ensureStringArray(ocr.warnings),
        blocks,
    };
}

function asScanProblemKind(value: unknown): ScanProblemKind {
    const kinds: ScanProblemKind[] = [
        "equation",
        "word-problem",
        "worked-solution",
        "answer-check",
        "textbook-page",
        "notes-reference",
        "accounting-worksheet",
        "unknown",
    ];
    return kinds.includes(value as ScanProblemKind) ? (value as ScanProblemKind) : "unknown";
}

function asScanPageType(value: unknown): ScanPageType {
    const pageTypes: ScanPageType[] = [
        "problem-statement",
        "department-1-worksheet",
        "department-2-worksheet",
        "cost-schedule-page",
        "answer-page",
        "mixed-reference-page",
        "unknown",
    ];
    return pageTypes.includes(value as ScanPageType) ? (value as ScanPageType) : "unknown";
}

function asImageSourceKind(value: unknown): ScanImageSourceKind {
    const imageTypes: ScanImageSourceKind[] = [
        "screenshot",
        "dark-screenshot",
        "photo",
        "textbook-photo",
        "handwriting",
        "digital-handwriting",
        "accounting-table",
        "mixed",
        "unknown",
    ];
    return imageTypes.includes(value as ScanImageSourceKind)
        ? (value as ScanImageSourceKind)
        : "unknown";
}

function sanitizeParsedResult(value: unknown): ParsedScanResult | null {
    if (!value || typeof value !== "object") return null;
    const parsed = value as Record<string, unknown>;
    const kind = asScanProblemKind(parsed.kind);
    const accountingValue = parsed.accounting;
    const accounting: AccountingWorksheetExtraction | null =
        accountingValue && typeof accountingValue === "object"
            ? (() => {
                  const next = accountingValue as Record<string, unknown>;
                  return {
                      topic: typeof next.topic === "string" ? next.topic : "",
                      pageType: asScanPageType(next.pageType),
                      pageTypeConfidence:
                          typeof next.pageTypeConfidence === "number" && Number.isFinite(next.pageTypeConfidence)
                              ? next.pageTypeConfidence
                              : 0,
                      extractionConfidence:
                          typeof next.extractionConfidence === "number" && Number.isFinite(next.extractionConfidence)
                              ? next.extractionConfidence
                              : 0,
                      routeHint: typeof next.routeHint === "string" ? next.routeHint : "/smart/solver",
                      fields: ensureStructuredFields(next.fields),
                      likelyMistakes: ensureStringArray(next.likelyMistakes),
                      notes: ensureStringArray(next.notes),
                  };
              })()
            : null;

    return {
        kind,
        cleanedText: typeof parsed.cleanedText === "string" ? parsed.cleanedText : "",
        cleanupNotes: ensureStringArray(parsed.cleanupNotes),
        flaggedValues: ensureStringArray(parsed.flaggedValues),
        suggestedIntent:
            typeof parsed.suggestedIntent === "string"
                ? parsed.suggestedIntent
                : "Review extracted values",
        parseConfidence:
            typeof parsed.parseConfidence === "number" && Number.isFinite(parsed.parseConfidence)
                ? parsed.parseConfidence
                : 0,
        extractionConfidence:
            typeof parsed.extractionConfidence === "number" && Number.isFinite(parsed.extractionConfidence)
                ? parsed.extractionConfidence
                : undefined,
        extractedValues: Array.isArray(parsed.extractedValues)
            ? parsed.extractedValues
                  .filter((entry) => entry && typeof entry === "object")
                  .map((entry) => {
                      const valueEntry = entry as Record<string, unknown>;
                      return {
                          label: typeof valueEntry.label === "string" ? valueEntry.label : "Value",
                          value: typeof valueEntry.value === "string" ? valueEntry.value : "",
                      };
                  })
            : [],
        detectedUnits: ensureStringArray(parsed.detectedUnits),
        likelyIssues: ensureStringArray(parsed.likelyIssues),
        notes: ensureStringArray(parsed.notes),
        pageType: asScanPageType(parsed.pageType),
        routeHint: typeof parsed.routeHint === "string" ? parsed.routeHint : "/smart/solver",
        structuredFields: ensureStructuredFields(parsed.structuredFields),
        accounting,
    };
}

function sanitizeScanItem(item: PersistedScanImageItem, savedAt: number): ScanImageItem | null {
    const sourceDataUrl =
        typeof item.sourceDataUrl === "string" && item.sourceDataUrl.startsWith("data:")
            ? item.sourceDataUrl
            : null;
    const previewUrl =
        typeof item.previewUrl === "string" && item.previewUrl.startsWith("data:")
            ? item.previewUrl
            : sourceDataUrl ?? "";

    if (!sourceDataUrl && !previewUrl) return null;

    const parsedResult = sanitizeParsedResult(item.parsedResult);
    const ocrResult = sanitizeOcrResult(item.ocrResult);

    return {
        ...item,
        id: typeof item.id === "string" ? item.id : `scan-restored-${Math.random().toString(36).slice(2, 10)}`,
        name: typeof item.name === "string" ? item.name : "Restored image",
        sourceDataUrl,
        previewUrl,
        file: dataUrlToFile(sourceDataUrl ?? previewUrl, typeof item.name === "string" ? item.name : "restored-image.png"),
        processedPreviewUrl:
            typeof item.processedPreviewUrl === "string" && item.processedPreviewUrl.startsWith("data:")
                ? item.processedPreviewUrl
                : null,
        detectedImageType: asImageSourceKind(item.detectedImageType),
        qualityScore:
            typeof item.qualityScore === "number" && Number.isFinite(item.qualityScore)
                ? item.qualityScore
                : undefined,
        status: typeof item.status === "string" ? item.status : "queued",
        progress:
            typeof item.progress === "number" && Number.isFinite(item.progress) ? item.progress : 0,
        error: typeof item.error === "string" ? item.error : null,
        ocrResult,
        parsedResult,
        editableText:
            typeof item.editableText === "string"
                ? item.editableText
                : parsedResult?.cleanedText ?? "",
        confidenceLevel:
            item.confidenceLevel === "high" || item.confidenceLevel === "medium" || item.confidenceLevel === "low"
                ? item.confidenceLevel
                : "low",
        selected: item.selected !== false,
        problemRole: typeof item.problemRole === "string" ? item.problemRole : null,
        preprocessNotes: ensureStringArray(item.preprocessNotes),
        processingPhase: typeof item.processingPhase === "string" ? item.processingPhase : "queued",
        processingSummary:
            typeof item.processingSummary === "string" ? item.processingSummary : "Restored scan item",
        qualityWarnings: ensureStringArray(item.qualityWarnings),
        updatedAt:
            typeof item.updatedAt === "number" && Number.isFinite(item.updatedAt)
                ? item.updatedAt
                : savedAt,
    };
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

export async function loadScanSession(): Promise<LoadScanSessionResult> {
    if (typeof indexedDB === "undefined") {
        return { items: [] as ScanImageItem[], restored: false, repaired: false };
    }

    const payload = await runStoreRequest<PersistedScanSession | null>("readonly", (store, resolve, reject) => {
        const request = store.get(ACTIVE_SESSION_KEY);
        request.onerror = () => reject(request.error ?? new Error("Failed to load scan session."));
        request.onsuccess = () => resolve((request.result as PersistedScanSession | undefined) ?? null);
    });

    if (!payload) {
        return { items: [] as ScanImageItem[], restored: false, repaired: false };
    }

    if (Date.now() - payload.savedAt > MAX_SESSION_AGE_MS) {
        await clearScanSession();
        return { items: [] as ScanImageItem[], restored: false, repaired: true };
    }

    const persistedItems = Array.isArray(payload.items) ? payload.items : [];
    const items = persistedItems
        .map((item) => sanitizeScanItem(item, payload.savedAt))
        .filter((item): item is ScanImageItem => item !== null);

    const repaired =
        !Array.isArray(payload.items) ||
        items.length !== persistedItems.length ||
        persistedItems.some(
            (item) =>
                !Array.isArray(item.preprocessNotes) ||
                !Array.isArray(item.qualityWarnings) ||
                (item.parsedResult !== null &&
                    item.parsedResult !== undefined &&
                    (!Array.isArray((item.parsedResult as Record<string, unknown>).likelyIssues) ||
                        !Array.isArray((item.parsedResult as Record<string, unknown>).notes) ||
                        !Array.isArray((item.parsedResult as Record<string, unknown>).flaggedValues)))
        );

    if (repaired) {
        await saveScanSession(items);
    }

    return { items, restored: items.length > 0, repaired };
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
