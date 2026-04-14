import { useSyncExternalStore } from "react";
import { readIndexedValue, writeIndexedValue } from "../../services/storage/indexedKeyValue";
import type {
    WorkpaperLibraryState,
    WorkpaperSheet,
    WorkpaperTransferBundle,
    WorkpaperWorkbook,
} from "./workpaperTypes.js";
import {
    cloneSheet,
    createEmptySheet,
    createWorkbook,
    splitCellKey,
    touchWorkbook,
} from "./workpaperUtils.js";

const STORAGE_KEY = "accalc-workpaper-library";
const INDEXED_DB_KEY = "workpaper-library";
const UPDATED_EVENT = "accalc-workpaper-library-updated";
const MAX_RECENT_WORKBOOKS = 10;
const MAX_PENDING_TRANSFERS = 12;

const DEFAULT_LIBRARY: WorkpaperLibraryState = {
    version: 1,
    workbookOrder: [],
    workbooks: {},
    recentWorkbookIds: [],
    pendingTransfers: [],
};

let cachedRaw: string | null | undefined;
let cachedSnapshot: WorkpaperLibraryState = DEFAULT_LIBRARY;
let hydrationStarted = false;

function emitUpdate() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(UPDATED_EVENT));
}

function sanitizeSheet(value: Partial<WorkpaperSheet> | null | undefined): WorkpaperSheet | null {
    if (
        !value ||
        typeof value.id !== "string" ||
        typeof value.title !== "string" ||
        typeof value.rowCount !== "number" ||
        typeof value.columnCount !== "number" ||
        typeof value.createdAt !== "number" ||
        typeof value.updatedAt !== "number" ||
        typeof value.kind !== "string"
    ) {
        return null;
    }

    const cells =
        typeof value.cells === "object" && value.cells
            ? Object.fromEntries(
                  Object.entries(value.cells).flatMap(([key, cell]) => {
                      if (!cell || typeof cell.input !== "string") return [];
                      return [[
                          key,
                          {
                              input: cell.input,
                              note: cell.note,
                              style:
                                  cell.style && typeof cell.style === "object"
                                      ? {
                                            fillColor:
                                                typeof cell.style.fillColor === "string"
                                                    ? cell.style.fillColor
                                                    : undefined,
                                            textColor:
                                                typeof cell.style.textColor === "string"
                                                    ? cell.style.textColor
                                                    : undefined,
                                            bold:
                                                typeof cell.style.bold === "boolean"
                                                    ? cell.style.bold
                                                    : undefined,
                                            italic:
                                                typeof cell.style.italic === "boolean"
                                                    ? cell.style.italic
                                                    : undefined,
                                            numberFormat:
                                                cell.style.numberFormat === "general" ||
                                                cell.style.numberFormat === "number" ||
                                                cell.style.numberFormat === "percentage" ||
                                                cell.style.numberFormat === "currency" ||
                                                cell.style.numberFormat === "accounting" ||
                                                cell.style.numberFormat === "date" ||
                                                cell.style.numberFormat === "text"
                                                    ? cell.style.numberFormat
                                                    : undefined,
                                            textAlign:
                                                cell.style.textAlign === "left" ||
                                                cell.style.textAlign === "center" ||
                                                cell.style.textAlign === "right"
                                                    ? cell.style.textAlign
                                                    : undefined,
                                        }
                                      : undefined,
                          },
                      ]];
                  })
              )
            : {};

    return {
        id: value.id,
        title: value.title,
        kind: value.kind as WorkpaperSheet["kind"],
        rowCount: value.rowCount,
        columnCount: value.columnCount,
        cells,
        note: typeof value.note === "string" ? value.note : undefined,
        templateId: typeof value.templateId === "string" ? value.templateId : undefined,
        freezeRows: typeof value.freezeRows === "number" ? value.freezeRows : undefined,
        freezeColumns: typeof value.freezeColumns === "number" ? value.freezeColumns : undefined,
        sources: Array.isArray(value.sources)
            ? value.sources.filter(
                  (source): source is WorkpaperSheet["sources"][number] =>
                      Boolean(
                          source &&
                              typeof source.id === "string" &&
                              typeof source.kind === "string" &&
                              typeof source.title === "string" &&
                              typeof source.summary === "string" &&
                              typeof source.capturedAt === "number"
                      )
              )
            : [],
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
    };
}

function sanitizeWorkbook(
    value: Partial<WorkpaperWorkbook> | null | undefined
): WorkpaperWorkbook | null {
    if (
        !value ||
        typeof value.id !== "string" ||
        typeof value.title !== "string" ||
        typeof value.description !== "string" ||
        typeof value.topic !== "string" ||
        typeof value.createdAt !== "number" ||
        typeof value.updatedAt !== "number" ||
        typeof value.revision !== "number"
    ) {
        return null;
    }

    const sheets = Object.fromEntries(
        Object.entries(value.sheets ?? {}).flatMap(([sheetId, sheet]) => {
            const sanitized = sanitizeSheet(sheet);
            return sanitized ? [[sheetId, sanitized]] : [];
        })
    );

    const sheetOrder = Array.isArray(value.sheetOrder)
        ? value.sheetOrder.filter(
              (sheetId): sheetId is string =>
                  typeof sheetId === "string" && Boolean(sheets[sheetId])
          )
        : Object.keys(sheets);

    const activeSheetId =
        typeof value.activeSheetId === "string" && sheets[value.activeSheetId]
            ? value.activeSheetId
            : sheetOrder[0];

    if (!activeSheetId) return null;

    return {
        id: value.id,
        title: value.title,
        description: value.description,
        topic: value.topic,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
        revision: value.revision,
        activeSheetId,
        sheetOrder,
        sheets,
    };
}

function sanitizeLibrary(
    value: Partial<WorkpaperLibraryState> | null | undefined
): WorkpaperLibraryState {
    const workbooks = Object.fromEntries(
        Object.entries(value?.workbooks ?? {}).flatMap(([workbookId, workbook]) => {
            const sanitized = sanitizeWorkbook(workbook);
            return sanitized ? [[workbookId, sanitized]] : [];
        })
    );

    const workbookOrder = Array.isArray(value?.workbookOrder)
        ? value.workbookOrder.filter(
              (workbookId): workbookId is string =>
                  typeof workbookId === "string" && Boolean(workbooks[workbookId])
          )
        : Object.keys(workbooks);

    const recentWorkbookIds = Array.isArray(value?.recentWorkbookIds)
        ? value.recentWorkbookIds
              .filter(
                  (workbookId): workbookId is string =>
                      typeof workbookId === "string" && Boolean(workbooks[workbookId])
              )
              .slice(0, MAX_RECENT_WORKBOOKS)
        : [];

    const pendingTransfers = Array.isArray(value?.pendingTransfers)
        ? value.pendingTransfers
              .filter(
                  (transfer): transfer is WorkpaperTransferBundle =>
                      Boolean(
                          transfer &&
                              typeof transfer.id === "string" &&
                              typeof transfer.title === "string" &&
                              typeof transfer.description === "string" &&
                              typeof transfer.topic === "string" &&
                              transfer.sheet &&
                              transfer.source
                      )
              )
              .slice(0, MAX_PENDING_TRANSFERS)
        : [];

    return {
        version: 1,
        workbookOrder,
        workbooks,
        recentWorkbookIds,
        pendingTransfers,
    };
}

function persist(nextValue: WorkpaperLibraryState) {
    if (typeof window === "undefined") return;
    const serialized = JSON.stringify(nextValue);
    cachedRaw = serialized;
    cachedSnapshot = nextValue;
    window.localStorage.setItem(STORAGE_KEY, serialized);
    void writeIndexedValue(INDEXED_DB_KEY, nextValue);
    emitUpdate();
}

function ensureHydration() {
    if (
        hydrationStarted ||
        typeof window === "undefined" ||
        typeof indexedDB === "undefined"
    ) {
        return;
    }

    hydrationStarted = true;

    void readIndexedValue<WorkpaperLibraryState>(INDEXED_DB_KEY)
        .then((indexedState) => {
            if (indexedState) {
                const sanitized = sanitizeLibrary(indexedState);
                const raw = JSON.stringify(sanitized);
                if (raw !== cachedRaw) {
                    cachedRaw = raw;
                    cachedSnapshot = sanitized;
                    window.localStorage.setItem(STORAGE_KEY, raw);
                    emitUpdate();
                }
            } else if (cachedRaw) {
                void writeIndexedValue(INDEXED_DB_KEY, cachedSnapshot);
            }
        })
        .catch(() => undefined);
}

export function readWorkpaperLibrary(): WorkpaperLibraryState {
    if (typeof window === "undefined") return DEFAULT_LIBRARY;

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw === cachedRaw) {
            ensureHydration();
            return cachedSnapshot;
        }

        if (!raw) {
            cachedRaw = raw;
            cachedSnapshot = DEFAULT_LIBRARY;
            ensureHydration();
            return cachedSnapshot;
        }

        cachedRaw = raw;
        cachedSnapshot = sanitizeLibrary(
            JSON.parse(raw) as Partial<WorkpaperLibraryState>
        );
        ensureHydration();
        return cachedSnapshot;
    } catch {
        cachedRaw = null;
        cachedSnapshot = DEFAULT_LIBRARY;
        ensureHydration();
        return cachedSnapshot;
    }
}

export function updateWorkpaperLibrary(
    updater: (current: WorkpaperLibraryState) => WorkpaperLibraryState
) {
    if (typeof window === "undefined") return;
    persist(updater(readWorkpaperLibrary()));
}

function subscribe(callback: () => void) {
    if (typeof window === "undefined") return () => undefined;

    ensureHydration();
    const handle = () => callback();
    window.addEventListener("storage", handle);
    window.addEventListener(UPDATED_EVENT, handle);

    return () => {
        window.removeEventListener("storage", handle);
        window.removeEventListener(UPDATED_EVENT, handle);
    };
}

export function useWorkpaperLibrary() {
    return useSyncExternalStore(subscribe, readWorkpaperLibrary, () => DEFAULT_LIBRARY);
}

function markRecent(state: WorkpaperLibraryState, workbookId: string) {
    return [
        workbookId,
        ...state.recentWorkbookIds.filter((currentId) => currentId !== workbookId),
    ].slice(0, MAX_RECENT_WORKBOOKS);
}

export function createWorkpaperWorkbook(options?: {
    title?: string;
    description?: string;
    topic?: string;
}) {
    const workbook = createWorkbook(options);
    updateWorkpaperLibrary((current) => ({
        ...current,
        workbooks: {
            ...current.workbooks,
            [workbook.id]: workbook,
        },
        workbookOrder: [workbook.id, ...current.workbookOrder.filter((id) => id !== workbook.id)],
        recentWorkbookIds: markRecent(current, workbook.id),
    }));
    return workbook.id;
}

export function saveWorkbookSnapshot(workbook: WorkpaperWorkbook) {
    updateWorkpaperLibrary((current) => ({
        ...current,
        workbooks: {
            ...current.workbooks,
            [workbook.id]: touchWorkbook(workbook),
        },
        workbookOrder: [
            workbook.id,
            ...current.workbookOrder.filter((workbookId) => workbookId !== workbook.id),
        ],
        recentWorkbookIds: markRecent(current, workbook.id),
    }));
}

export function deleteWorkbook(workbookId: string) {
    updateWorkpaperLibrary((current) => {
        const nextWorkbooks = { ...current.workbooks };
        delete nextWorkbooks[workbookId];

        return {
            ...current,
            workbooks: nextWorkbooks,
            workbookOrder: current.workbookOrder.filter((id) => id !== workbookId),
            recentWorkbookIds: current.recentWorkbookIds.filter((id) => id !== workbookId),
        };
    });
}

export function createWorkbookFromTransfer(bundle: WorkpaperTransferBundle) {
    const sheet = createEmptySheet({
        title: bundle.sheet.title,
        kind: bundle.sheet.kind ?? "calculator",
        rowCount: bundle.sheet.rowCount,
        columnCount: bundle.sheet.columnCount,
        note: bundle.sheet.note,
        templateId: bundle.sheet.templateId,
        cells: bundle.sheet.cells,
        sources: [bundle.source],
    });

    const workbook = createWorkbook({
        title: bundle.title,
        description: bundle.description,
        topic: bundle.topic,
        sheets: [sheet],
    });

    updateWorkpaperLibrary((current) => ({
        ...current,
        workbooks: {
            ...current.workbooks,
            [workbook.id]: workbook,
        },
        workbookOrder: [workbook.id, ...current.workbookOrder.filter((id) => id !== workbook.id)],
        recentWorkbookIds: markRecent(current, workbook.id),
        pendingTransfers: current.pendingTransfers.filter((transfer) => transfer.id !== bundle.id),
    }));

    return workbook.id;
}

export function appendTransferToWorkbook(workbookId: string, bundle: WorkpaperTransferBundle) {
    updateWorkpaperLibrary((current) => {
        const workbook = current.workbooks[workbookId];
        if (!workbook) return current;

        const nextSheet = createEmptySheet({
            title: bundle.sheet.title,
            kind: bundle.sheet.kind ?? "calculator",
            rowCount: bundle.sheet.rowCount,
            columnCount: bundle.sheet.columnCount,
            note: bundle.sheet.note,
            templateId: bundle.sheet.templateId,
            cells: bundle.sheet.cells,
            sources: [bundle.source],
        });

        const updatedWorkbook = touchWorkbook({
            ...workbook,
            activeSheetId: nextSheet.id,
            sheetOrder: [...workbook.sheetOrder, nextSheet.id],
            sheets: {
                ...workbook.sheets,
                [nextSheet.id]: nextSheet,
            },
        });

        return {
            ...current,
            workbooks: {
                ...current.workbooks,
                [workbookId]: updatedWorkbook,
            },
            recentWorkbookIds: markRecent(current, workbookId),
            pendingTransfers: current.pendingTransfers.filter((transfer) => transfer.id !== bundle.id),
        };
    });
}

export function appendTransferRowsToActiveSheet(
    workbookId: string,
    bundle: WorkpaperTransferBundle
) {
    updateWorkpaperLibrary((current) => {
        const workbook = current.workbooks[workbookId];
        if (!workbook) return current;

        const activeSheet = workbook.sheets[workbook.activeSheetId];
        if (!activeSheet || !bundle.sheet.cells) return current;

        const nextCells = { ...activeSheet.cells };
        const usedRows = Object.keys(activeSheet.cells).map((key) => splitCellKey(key).rowIndex);
        const startRow = usedRows.length ? Math.max(...usedRows) + 2 : 0;

        for (const [cellKey, cell] of Object.entries(bundle.sheet.cells)) {
            const { rowIndex, columnIndex } = splitCellKey(cellKey);
            const nextRow = startRow + rowIndex;
            nextCells[`${columnIndex}:${nextRow}`] = { ...cell };
        }

        const updatedSheet: WorkpaperSheet = {
            ...activeSheet,
            rowCount: Math.max(activeSheet.rowCount, startRow + (bundle.sheet.rowCount ?? 8)),
            columnCount: Math.max(
                activeSheet.columnCount,
                bundle.sheet.columnCount ?? activeSheet.columnCount
            ),
            cells: nextCells,
            sources: [...activeSheet.sources, bundle.source],
            updatedAt: Date.now(),
        };

        const updatedWorkbook = touchWorkbook({
            ...workbook,
            sheets: {
                ...workbook.sheets,
                [activeSheet.id]: updatedSheet,
            },
        });

        return {
            ...current,
            workbooks: {
                ...current.workbooks,
                [workbookId]: updatedWorkbook,
            },
            recentWorkbookIds: markRecent(current, workbookId),
            pendingTransfers: current.pendingTransfers.filter((transfer) => transfer.id !== bundle.id),
        };
    });
}

export function queueWorkpaperTransfer(bundle: WorkpaperTransferBundle) {
    updateWorkpaperLibrary((current) => ({
        ...current,
        pendingTransfers: [
            bundle,
            ...current.pendingTransfers.filter((transfer) => transfer.id !== bundle.id),
        ].slice(0, MAX_PENDING_TRANSFERS),
    }));
}

export function dismissTransfer(transferId: string) {
    updateWorkpaperLibrary((current) => ({
        ...current,
        pendingTransfers: current.pendingTransfers.filter((transfer) => transfer.id !== transferId),
    }));
}

export function duplicateSheetIntoWorkbook(workbookId: string, sheetId: string) {
    updateWorkpaperLibrary((current) => {
        const workbook = current.workbooks[workbookId];
        const sheet = workbook?.sheets[sheetId];
        if (!workbook || !sheet) return current;

        const duplicated = cloneSheet(sheet);
        const nextOrder = [...workbook.sheetOrder];
        const currentIndex = nextOrder.indexOf(sheetId);
        nextOrder.splice(currentIndex + 1, 0, duplicated.id);

        const updatedWorkbook = touchWorkbook({
            ...workbook,
            activeSheetId: duplicated.id,
            sheetOrder: nextOrder,
            sheets: {
                ...workbook.sheets,
                [duplicated.id]: duplicated,
            },
        });

        return {
            ...current,
            workbooks: {
                ...current.workbooks,
                [workbookId]: updatedWorkbook,
            },
            recentWorkbookIds: markRecent(current, workbookId),
        };
    });
}
