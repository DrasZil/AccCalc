import { useEffect, useMemo, useRef, useState } from "react";
import type { ScanImageItem, ScanImageStatus } from "../types";
import { fileToDataUrl } from "../utils/imageProcessing";
import { validateScanFile } from "../utils/scanFileValidation";
import {
    cleanupScanItemUrls,
    clearScanSession,
    loadScanSession,
    saveScanSession,
} from "../services/scanSessionStore";

function makeId() {
    return `scan-${Math.random().toString(36).slice(2, 10)}`;
}

type AddFilesResult = {
    added: number;
    errors: string[];
};

export function useScanQueue() {
    const [items, setItems] = useState<ScanImageItem[]>([]);
    const [queueError, setQueueError] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const [restoredFromSession, setRestoredFromSession] = useState(false);
    const itemsRef = useRef<ScanImageItem[]>([]);

    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    useEffect(() => {
        let cancelled = false;

        void loadScanSession().then((session) => {
            if (cancelled) return;
            setItems(session.items);
            setRestoredFromSession(session.restored);
            setHydrated(true);
        });

        return () => {
            cancelled = true;
            cleanupScanItemUrls(itemsRef.current);
        };
    }, []);

    useEffect(() => {
        if (!hydrated) return;

        const timeout = window.setTimeout(() => {
            void saveScanSession(items);
        }, 220);

        return () => window.clearTimeout(timeout);
    }, [hydrated, items]);

    async function addFiles(files: File[]): Promise<AddFilesResult> {
        const nextItems: ScanImageItem[] = [];
        const errors: string[] = [];

        for (const file of files) {
            const validationError = validateScanFile(file);
            if (validationError) {
                errors.push(`${file.name}: ${validationError}`);
                continue;
            }

            const sourceDataUrl = await fileToDataUrl(file);
            nextItems.push({
                id: makeId(),
                file,
                name: file.name,
                sourceDataUrl,
                previewUrl: sourceDataUrl,
                processedPreviewUrl: null,
                status: "queued",
                progress: 0,
                error: null,
                ocrResult: null,
                parsedResult: null,
                editableText: "",
                confidenceLevel: "low",
                selected: true,
                problemRole: null,
                preprocessNotes: [],
                processingPhase: "queued",
                processingSummary: "Waiting to start",
                qualityWarnings: [],
                updatedAt: Date.now(),
            });
        }

        if (nextItems.length > 0) {
            setItems((current) => [...current, ...nextItems]);
        }
        setQueueError(errors.length > 0 ? errors.join(" ") : null);
        return { added: nextItems.length, errors };
    }

    async function replaceFile(id: string, file: File) {
        const error = validateScanFile(file);
        if (error) {
            setQueueError(`${file.name}: ${error}`);
            return false;
        }

        const sourceDataUrl = await fileToDataUrl(file);
        setItems((current) =>
            current.map((item) => {
                if (item.id !== id) return item;
                return {
                    ...item,
                    file,
                    name: file.name,
                    sourceDataUrl,
                    previewUrl: sourceDataUrl,
                    processedPreviewUrl: null,
                    status: "queued",
                    progress: 0,
                    error: null,
                    ocrResult: null,
                    parsedResult: null,
                    editableText: "",
                    problemRole: null,
                    preprocessNotes: [],
                    processingPhase: "queued",
                    processingSummary: "Waiting to start",
                    qualityWarnings: [],
                    updatedAt: Date.now(),
                };
            })
        );
        setQueueError(null);
        return true;
    }

    function updateItem(id: string, updater: (item: ScanImageItem) => ScanImageItem) {
        setItems((current) =>
            current.map((item) =>
                item.id === id ? { ...updater(item), updatedAt: Date.now() } : item
            )
        );
    }

    function setItemStatus(id: string, status: ScanImageStatus, progress = 0) {
        updateItem(id, (item) => ({ ...item, status, progress }));
    }

    function removeItem(id: string) {
        setItems((current) => current.filter((item) => item.id !== id));
    }

    function moveItem(id: string, direction: -1 | 1) {
        setItems((current) => {
            const index = current.findIndex((item) => item.id === id);
            if (index < 0) return current;
            const nextIndex = index + direction;
            if (nextIndex < 0 || nextIndex >= current.length) return current;
            const next = [...current];
            const [moved] = next.splice(index, 1);
            next.splice(nextIndex, 0, moved);
            return next.map((item) => ({ ...item, updatedAt: Date.now() }));
        });
    }

    function toggleSelected(id: string) {
        updateItem(id, (item) => ({ ...item, selected: !item.selected }));
    }

    async function resetSession() {
        cleanupScanItemUrls(itemsRef.current);
        setItems([]);
        setQueueError(null);
        await clearScanSession();
    }

    const mergedSelectedText = useMemo(
        () =>
            items
                .filter((item) => item.selected && item.editableText.trim() !== "")
                .map((item) => item.editableText.trim())
                .join("\n\n"),
        [items]
    );

    return {
        items,
        queueError,
        hydrated,
        restoredFromSession,
        addFiles,
        replaceFile,
        updateItem,
        setItemStatus,
        removeItem,
        moveItem,
        toggleSelected,
        mergedSelectedText,
        fileToDataUrl,
        resetSession,
    };
}
