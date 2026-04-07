import { useEffect, useMemo, useRef, useState } from "react";
import type { ScanImageItem, ScanImageStatus } from "../types";
import { fileToDataUrl } from "../utils/imageProcessing";
import { validateScanFile } from "../utils/scanFileValidation";

function makeId() {
    return `scan-${Math.random().toString(36).slice(2, 10)}`;
}

export function useScanQueue() {
    const [items, setItems] = useState<ScanImageItem[]>([]);
    const [queueError, setQueueError] = useState<string | null>(null);
    const itemsRef = useRef<ScanImageItem[]>([]);

    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    useEffect(
        () => () => {
            itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        },
        []
    );

    async function addFiles(files: File[]) {
        const nextItems: ScanImageItem[] = [];
        const errors: string[] = [];

        for (const file of files) {
            const validationError = validateScanFile(file);
            if (validationError) {
                errors.push(`${file.name}: ${validationError}`);
                continue;
            }

            nextItems.push({
                id: makeId(),
                file,
                name: file.name,
                previewUrl: URL.createObjectURL(file),
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
            });
        }

        if (nextItems.length > 0) {
            setItems((current) => [...current, ...nextItems]);
        }
        setQueueError(errors.length > 0 ? errors.join(" ") : null);
    }

    async function replaceFile(id: string, file: File) {
        const error = validateScanFile(file);
        if (error) {
            setQueueError(`${file.name}: ${error}`);
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setItems((current) =>
            current.map((item) => {
                if (item.id !== id) return item;
                URL.revokeObjectURL(item.previewUrl);
                return {
                    ...item,
                    file,
                    name: file.name,
                    previewUrl,
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
                };
            })
        );
    }

    function updateItem(id: string, updater: (item: ScanImageItem) => ScanImageItem) {
        setItems((current) => current.map((item) => (item.id === id ? updater(item) : item)));
    }

    function setItemStatus(id: string, status: ScanImageStatus, progress = 0) {
        updateItem(id, (item) => ({ ...item, status, progress }));
    }

    function removeItem(id: string) {
        setItems((current) => {
            const target = current.find((item) => item.id === id);
            if (target) {
                URL.revokeObjectURL(target.previewUrl);
            }
            return current.filter((item) => item.id !== id);
        });
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
            return next;
        });
    }

    function toggleSelected(id: string) {
        updateItem(id, (item) => ({ ...item, selected: !item.selected }));
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
        addFiles,
        replaceFile,
        updateItem,
        setItemStatus,
        removeItem,
        moveItem,
        toggleSelected,
        mergedSelectedText,
        fileToDataUrl,
    };
}
