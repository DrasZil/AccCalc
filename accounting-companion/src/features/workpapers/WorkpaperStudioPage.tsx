import {
    type CSSProperties,
    type KeyboardEvent as ReactKeyboardEvent,
    startTransition,
    useDeferredValue,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Link } from "react-router-dom";
import DisclosurePanel from "../../components/DisclosurePanel";
import InlineNotice from "../../components/InlineNotice";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";
import { APP_VERSION } from "../../utils/appRelease";
import { useAppNotifications } from "../layout/AppNotifications";
import {
    appendTransferRowsToActiveSheet,
    appendTransferToWorkbook,
    createWorkbookFromTransfer,
    createWorkpaperWorkbook,
    deleteWorkbook,
    dismissTransfer,
    duplicateSheetIntoWorkbook,
    saveWorkbookSnapshot,
    useWorkpaperLibrary,
} from "./workpaperStore.js";
import {
    buildSheetValueMap,
    describeSheetFormulaCoverage,
    evaluateCellInput,
    getLastUsedRowIndex,
} from "./workpaperFormula.js";
import {
    exportSheetAsCsv,
    exportWorkbookAsXlsx,
    importWorkbookFile,
    type WorkpaperFileActionResult,
} from "./workpaperFile.js";
import {
    getWorkpaperTemplate,
    WORKPAPER_TEMPLATES,
} from "./workpaperTemplates.js";
import type {
    WorkpaperCellStyle,
    WorkpaperSheet,
    WorkpaperWorkbook,
} from "./workpaperTypes.js";
import {
    applyStyleToRange,
    clampSheetDimension,
    clearRangeCells,
    createEmptySheet,
    createSelectionRange,
    deleteColumns,
    deleteRows,
    duplicateRangeToTarget,
    formatDisplayValue,
    getCellKey,
    getCellReference,
    getRangeCellKeys,
    insertColumns,
    insertRows,
    isCellWithinRange,
    rangeToTabularData,
    resolveWorkpaperCellStyle,
    setSheetCell,
    setSheetCellStyle,
    splitCellKey,
    type WorkpaperSelectionRange,
    toColumnLabel,
} from "./workpaperUtils.js";

const MAX_ROWS = 120;
const MAX_COLUMNS = 26;
const GUIDANCE_STORAGE_KEY = "accalc-workpaper-guidance-dismissed";
const FORMULA_HINTS = [
    { label: "=SUM(A1:A5)", value: "=SUM(A1:A5)" },
    { label: "=A1+B1", value: "=A1+B1" },
    { label: "=10*5", value: "=10*5" },
    { label: "=ROUND(PI(),2)", value: "=ROUND(PI(),2)" },
];
const FORMAT_FILL_OPTIONS = ["", "#FEF3C7", "#DBEAFE", "#DCFCE7", "#FCE7F3", "#EDE9FE"];
const FORMAT_TEXT_OPTIONS = ["", "#0F172A", "#1D4ED8", "#047857", "#B45309", "#BE123C"];
const NUMBER_FORMAT_OPTIONS = [
    { value: "general", label: "General" },
    { value: "number", label: "Number" },
    { value: "percentage", label: "Percent" },
    { value: "currency", label: "Currency" },
    { value: "accounting", label: "Accounting" },
    { value: "date", label: "Date" },
    { value: "text", label: "Text" },
] as const;
const FUNCTION_GROUPS = [
    {
        label: "Common",
        items: [
            { name: "SUM", template: "=SUM(A1:A5)", signature: "SUM(number1, number2, ...)" },
            { name: "AVERAGE", template: "=AVERAGE(A1:A5)", signature: "AVERAGE(range)" },
            { name: "IF", template: "=IF(A1>0,1,0)", signature: "IF(condition, true_value, false_value)" },
            { name: "ROUND", template: "=ROUND(A1,2)", signature: "ROUND(value, digits)" },
        ],
    },
    {
        label: "Math",
        items: [
            { name: "PRODUCT", template: "=PRODUCT(A1:A5)", signature: "PRODUCT(number1, number2, ...)" },
            { name: "POWER", template: "=POWER(A1,2)", signature: "POWER(value, exponent)" },
            { name: "SQRT", template: "=SQRT(A1)", signature: "SQRT(value)" },
            { name: "MOD", template: "=MOD(A1,A2)", signature: "MOD(dividend, divisor)" },
        ],
    },
    {
        label: "Logic and stats",
        items: [
            { name: "COUNT", template: "=COUNT(A1:A5)", signature: "COUNT(range)" },
            { name: "COUNTA", template: "=COUNTA(A1:A5)", signature: "COUNTA(range)" },
            { name: "MEDIAN", template: "=MEDIAN(A1:A5)", signature: "MEDIAN(number1, number2, ...)" },
            { name: "MAX", template: "=MAX(A1:A5)", signature: "MAX(range)" },
        ],
    },
];

type WorkpaperSmartActionKey =
    | "totals-row"
    | "assumptions-block"
    | "notes-block"
    | "section-heading"
    | "summary-sheet";

type WorkpaperPanelKey = "none" | "workbooks" | "transfers" | "templates" | "details";
type WorkpaperMenuKey = "file" | "sheet" | "structure" | "workspace";
type WorkpaperActionState =
    | { status: "idle" }
    | { status: "running"; message: string }
    | { status: "done"; message: string }
    | { status: "error"; message: string };

type WorkpaperMenuItem = {
    label: string;
    detail?: string;
    badge?: string;
    disabled?: boolean;
    tone?: "default" | "danger";
    onSelect: () => void;
};

function cloneWorkbook(workbook: WorkpaperWorkbook) {
    return structuredClone(workbook);
}

function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleString();
}

function normalizeSelection(rowIndex: number, columnIndex: number, sheet: WorkpaperSheet) {
    return getCellKey(
        Math.max(0, Math.min(sheet.rowCount - 1, rowIndex)),
        Math.max(0, Math.min(sheet.columnCount - 1, columnIndex))
    );
}

function normalizeTemplateSearch(value: string) {
    return value.trim().toLowerCase();
}

function describeFileAction(result: WorkpaperFileActionResult, action: "Imported" | "Exported") {
    if (result.method === "file-picker") {
        return `${action} ${result.fileName}. Saved using your chosen file location.`;
    }

    return `${action} ${result.fileName}. Downloaded through your browser. Check your Downloads folder or default save location.`;
}

function getCellButtonStyle(style?: WorkpaperCellStyle): CSSProperties | undefined {
    const resolvedStyle = resolveWorkpaperCellStyle(style);
    if (!resolvedStyle.fillColor && !resolvedStyle.effectiveTextColor && !resolvedStyle.bold && !resolvedStyle.italic && !resolvedStyle.textAlign) {
        return undefined;
    }

    return {
        backgroundColor: resolvedStyle.fillColor,
        color: resolvedStyle.effectiveTextColor,
        fontWeight: resolvedStyle.bold ? 700 : undefined,
        fontStyle: resolvedStyle.italic ? "italic" : undefined,
        textAlign: resolvedStyle.textAlign,
    };
}

function getCellTextStyle(style?: WorkpaperCellStyle): CSSProperties | undefined {
    const resolvedStyle = resolveWorkpaperCellStyle(style);
    if (!resolvedStyle.effectiveTextColor && !resolvedStyle.bold && !resolvedStyle.italic && !resolvedStyle.textAlign) {
        return undefined;
    }

    return {
        color: resolvedStyle.effectiveTextColor,
        fontWeight: resolvedStyle.bold ? 700 : undefined,
        fontStyle: resolvedStyle.italic ? "italic" : undefined,
        textAlign: resolvedStyle.textAlign,
    };
}

function getCellEditorStyle(style?: WorkpaperCellStyle): CSSProperties | undefined {
    const resolvedStyle = resolveWorkpaperCellStyle(style);
    if (!resolvedStyle.fillColor && !resolvedStyle.effectiveTextColor && !resolvedStyle.bold && !resolvedStyle.italic && !resolvedStyle.textAlign) {
        return undefined;
    }

    return {
        backgroundColor: resolvedStyle.fillColor
            ? `color-mix(in srgb, ${resolvedStyle.fillColor} 88%, var(--app-surface))`
            : undefined,
        color: resolvedStyle.effectiveTextColor,
        fontWeight: resolvedStyle.bold ? 700 : undefined,
        fontStyle: resolvedStyle.italic ? "italic" : undefined,
        textAlign: resolvedStyle.textAlign,
        caretColor: resolvedStyle.effectiveTextColor,
    };
}

function getTextChipStyle(color?: string): CSSProperties | undefined {
    if (!color) return undefined;
    return {
        color,
        backgroundColor: `color-mix(in srgb, ${color} 16%, var(--app-field-bg))`,
        borderColor: `color-mix(in srgb, ${color} 28%, var(--app-border-subtle))`,
    };
}

function getRangeLabel(range: WorkpaperSelectionRange) {
    const start = getCellReference(range.startRow, range.startColumn);
    const end = getCellReference(range.endRow, range.endColumn);
    return start === end ? start : `${start}:${end}`;
}

function isSingleCellRange(range: WorkpaperSelectionRange) {
    return (
        range.startRow === range.endRow && range.startColumn === range.endColumn
    );
}

function parseClipboardMatrix(raw: string) {
    return raw
        .replace(/\r\n/g, "\n")
        .split("\n")
        .filter((row) => row.length > 0)
        .map((row) => row.split("\t"));
}

function WorkpaperActionMenu(props: {
    menuKey: WorkpaperMenuKey;
    openMenu: WorkpaperMenuKey | null;
    setOpenMenu: (menuKey: WorkpaperMenuKey | null) => void;
    label: string;
    badge?: string;
    items: WorkpaperMenuItem[];
    align?: "start" | "end";
    className?: string;
}) {
    const isOpen = props.openMenu === props.menuKey;

    return (
        <div className={["workpaper-menu", props.className ?? ""].join(" ").trim()}>
            <button
                type="button"
                onClick={() => props.setOpenMenu(isOpen ? null : props.menuKey)}
                aria-expanded={isOpen}
                className={[
                    "workpaper-menu__trigger",
                    isOpen ? "workpaper-menu__trigger--active" : "",
                ].join(" ")}
            >
                <span>{props.label}</span>
                {props.badge ? <span className="workpaper-menu__badge">{props.badge}</span> : null}
                <span className="workpaper-menu__chevron" aria-hidden="true">
                    {isOpen ? "▴" : "▾"}
                </span>
            </button>

            {isOpen ? (
                <div
                    className={[
                        "workpaper-menu__content",
                        props.align === "start" ? "workpaper-menu__content--start" : "",
                    ].join(" ")}
                >
                    {props.items.map((item) => (
                        <button
                            key={`${props.menuKey}-${item.label}`}
                            type="button"
                            disabled={item.disabled}
                            onClick={() => {
                                item.onSelect();
                                props.setOpenMenu(null);
                            }}
                            className={[
                                "workpaper-menu__item",
                                item.tone === "danger" ? "workpaper-menu__item--danger" : "",
                            ].join(" ")}
                        >
                            <span className="workpaper-menu__item-copy">
                                <strong>{item.label}</strong>
                                {item.detail ? <small>{item.detail}</small> : null}
                            </span>
                            {item.badge ? <span className="workpaper-menu__item-badge">{item.badge}</span> : null}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export default function WorkpaperStudioPage() {
    const library = useWorkpaperLibrary();
    const { notify } = useAppNotifications();
    const [selectedWorkbookId, setSelectedWorkbookId] = useState<string | null>(
        () => library.recentWorkbookIds[0] ?? library.workbookOrder[0] ?? null
    );
    const [draftWorkbook, setDraftWorkbook] = useState<WorkpaperWorkbook | null>(null);
    const [selectedCellKey, setSelectedCellKey] = useState(getCellKey(0, 0));
    const [selectionAnchorKey, setSelectionAnchorKey] = useState(getCellKey(0, 0));
    const [cellDraft, setCellDraft] = useState("");
    const [cellNoteDraft, setCellNoteDraft] = useState("");
    const [activePanel, setActivePanel] = useState<WorkpaperPanelKey>("none");
    const [statusMessage, setStatusMessage] = useState(
        "Select a cell and start typing. Workpapers autosave locally in the background."
    );
    const [importError, setImportError] = useState<string | null>(null);
    const [draftVersion, setDraftVersion] = useState(0);
    const [hasPendingDraftSave, setHasPendingDraftSave] = useState(false);
    const [guidanceDismissed, setGuidanceDismissed] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.localStorage.getItem(GUIDANCE_STORAGE_KEY) === "1";
    });
    const [showFormulaExamples, setShowFormulaExamples] = useState(false);
    const [showFunctionPicker, setShowFunctionPicker] = useState(false);
    const [showFormattingTools, setShowFormattingTools] = useState(false);
    const [actionState, setActionState] = useState<WorkpaperActionState>({ status: "idle" });
    const [openMenu, setOpenMenu] = useState<WorkpaperMenuKey | null>(null);
    const [templateSearchQuery, setTemplateSearchQuery] = useState("");
    const [selectedTemplateTopic, setSelectedTemplateTopic] = useState("All");
    const deferredCellDraft = useDeferredValue(cellDraft);
    const deferredCellNoteDraft = useDeferredValue(cellNoteDraft);
    const deferredTemplateSearchQuery = useDeferredValue(templateSearchQuery);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const formulaBarInputRef = useRef<HTMLInputElement | null>(null);
    const selectedCellEditorRef = useRef<HTMLInputElement | null>(null);
    const selectedCellElementRef = useRef<HTMLElement | null>(null);
    const workspaceRef = useRef<HTMLDivElement | null>(null);
    const copiedRangeRef = useRef<{
        text: string;
        range: WorkpaperSelectionRange;
    } | null>(null);

    useEffect(() => {
        if (selectedWorkbookId && !library.workbooks[selectedWorkbookId]) {
            startTransition(() => setSelectedWorkbookId(library.workbookOrder[0] ?? null));
        } else if (!selectedWorkbookId && library.workbookOrder.length > 0) {
            startTransition(() => setSelectedWorkbookId(library.workbookOrder[0] ?? null));
        }
    }, [library.workbookOrder, library.workbooks, selectedWorkbookId]);

    const selectedWorkbook = selectedWorkbookId
        ? library.workbooks[selectedWorkbookId] ?? null
        : null;

    useEffect(() => {
        setDraftWorkbook(selectedWorkbook ? cloneWorkbook(selectedWorkbook) : null);
        setHasPendingDraftSave(false);
    }, [selectedWorkbook]);

    const activeSheet = useMemo(() => {
        if (!draftWorkbook) return null;
        return draftWorkbook.sheets[draftWorkbook.activeSheetId] ?? null;
    }, [draftWorkbook]);

    const selectedCell = activeSheet?.cells[selectedCellKey];
    const selectedCellCoords = useMemo(() => splitCellKey(selectedCellKey), [selectedCellKey]);
    const selectionAnchorCoords = useMemo(
        () => splitCellKey(selectionAnchorKey),
        [selectionAnchorKey]
    );
    const selectedRange = useMemo(
        () => createSelectionRange(selectionAnchorCoords, selectedCellCoords),
        [selectionAnchorCoords, selectedCellCoords]
    );
    const selectedCellKeys = useMemo(
        () => getRangeCellKeys(selectedRange),
        [selectedRange]
    );

    useEffect(() => {
        if (!activeSheet) return;
        setSelectedCellKey((current) => {
            const { rowIndex, columnIndex } = splitCellKey(current);
            return normalizeSelection(rowIndex, columnIndex, activeSheet);
        });
        setSelectionAnchorKey((current) => {
            const { rowIndex, columnIndex } = splitCellKey(current);
            return normalizeSelection(rowIndex, columnIndex, activeSheet);
        });
    }, [activeSheet]);

    useEffect(() => {
        selectedCellElementRef.current?.scrollIntoView({
            block: "nearest",
            inline: "nearest",
        });
    }, [selectedCellKey]);

    useEffect(() => {
        if (!openMenu) return;

        function handlePointerDown(event: PointerEvent) {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (!workspaceRef.current?.contains(target)) {
                setOpenMenu(null);
                return;
            }
            if (!(target instanceof Element) || !target.closest(".workpaper-menu")) {
                setOpenMenu(null);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpenMenu(null);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("keydown", handleEscape);
        };
    }, [openMenu]);

    useEffect(() => {
        setCellDraft(selectedCell?.input ?? "");
        setCellNoteDraft(selectedCell?.note ?? "");
    }, [selectedCell?.input, selectedCell?.note, selectedCellKey]);

    useEffect(() => {
        if (!draftWorkbook || !hasPendingDraftSave || !selectedWorkbookId) return;

        let idleCallbackId: number | null = null;
        const persistDraft = () => {
            saveWorkbookSnapshot(draftWorkbook);
            setHasPendingDraftSave(false);
            setStatusMessage(`Autosaved ${draftWorkbook.title} at ${new Date().toLocaleTimeString()}.`);
        };
        const timeout = window.setTimeout(() => {
            if ("requestIdleCallback" in window) {
                idleCallbackId = window.requestIdleCallback(persistDraft, { timeout: 1200 });
                return;
            }
            persistDraft();
        }, 420);

        return () => {
            window.clearTimeout(timeout);
            if (idleCallbackId !== null && "cancelIdleCallback" in window) {
                window.cancelIdleCallback(idleCallbackId);
            }
        };
    }, [draftVersion, draftWorkbook, hasPendingDraftSave, selectedWorkbookId]);

    const evaluatedCells = useMemo(
        () =>
            draftWorkbook && activeSheet
                ? buildSheetValueMap(draftWorkbook, activeSheet.id)
                : {},
        [draftWorkbook, activeSheet]
    );

    const formulaCoverage = useMemo(
        () => activeSheet ? describeSheetFormulaCoverage(activeSheet) : { formulas: 0, values: 0 },
        [activeSheet]
    );
    const lastUsedRow = useMemo(
        () => activeSheet ? getLastUsedRowIndex(activeSheet) : -1,
        [activeSheet]
    );
    const activeTemplate = useMemo(
        () => activeSheet?.templateId ? getWorkpaperTemplate(activeSheet.templateId) : null,
        [activeSheet?.templateId]
    );
    const templateTopics = useMemo(
        () => ["All", ...Array.from(new Set(WORKPAPER_TEMPLATES.map((template) => template.topic))).sort()],
        []
    );
    const filteredTemplates = useMemo(() => {
        const query = normalizeTemplateSearch(deferredTemplateSearchQuery);

        return WORKPAPER_TEMPLATES.filter((template) => {
            if (selectedTemplateTopic !== "All" && template.topic !== selectedTemplateTopic) {
                return false;
            }

            if (!query) return true;

            return [
                template.title,
                template.description,
                template.topic,
                ...template.tags,
                ...template.relatedPaths,
            ].some((value) => value.toLowerCase().includes(query));
        });
    }, [deferredTemplateSearchQuery, selectedTemplateTopic]);
    const hasSheetContent = activeSheet ? Object.keys(activeSheet.cells).length > 0 : false;
    const selectedCellStyle = selectedCell?.style;
    const resolvedSelectedCellStyle = useMemo(
        () => resolveWorkpaperCellStyle(selectedCellStyle),
        [selectedCellStyle]
    );

    useEffect(() => {
        if (actionState.status !== "done") return;
        const timeout = window.setTimeout(() => setActionState({ status: "idle" }), 3200);
        return () => window.clearTimeout(timeout);
    }, [actionState]);

    useEffect(() => {
        if (actionState.status === "done") {
            notify({
                title: "Workpaper updated",
                message: actionState.message,
                tone: "success",
                dedupeKey: `workpaper-done:${actionState.message}`,
            });
            return;
        }

        if (actionState.status === "error") {
            notify({
                title: "Workpaper issue",
                message: actionState.message,
                tone: "error",
                dedupeKey: `workpaper-error:${actionState.message}`,
                durationMs: 8200,
            });
        }
    }, [actionState, notify]);

    function markDirty(message?: string) {
        setDraftVersion((current) => current + 1);
        setHasPendingDraftSave(true);
        if (message) setStatusMessage(message);
    }

    function openTemplateWorkbook(template: (typeof WORKPAPER_TEMPLATES)[number]) {
        const workbook = template.buildWorkbook();
        saveWorkbookSnapshot(workbook);
        startTransition(() => setSelectedWorkbookId(workbook.id));
        setActivePanel("none");
        setStatusMessage(`Opened ${template.title} from templates.`);
    }

    function mutateWorkbook(
        mutator: (current: WorkpaperWorkbook) => WorkpaperWorkbook,
        message?: string
    ) {
        setDraftWorkbook((current) => (current ? mutator(current) : current));
        markDirty(message);
    }

    function mutateActiveSheet(
        mutator: (sheet: WorkpaperSheet) => WorkpaperSheet,
        message?: string
    ) {
        mutateWorkbook((current) => {
            const currentSheet = current.sheets[current.activeSheetId];
            if (!currentSheet) return current;

            return {
                ...current,
                sheets: {
                    ...current.sheets,
                    [currentSheet.id]: mutator(currentSheet),
                },
            };
        }, message);
    }

    function commitCellDraft(options?: { staySelected?: boolean }) {
        if (!activeSheet) return;

        const originalInput = selectedCell?.input ?? "";
        const originalNote = selectedCell?.note ?? "";
        if (cellDraft === originalInput && cellNoteDraft === originalNote) return;

        mutateActiveSheet(
            (sheet) =>
                setSheetCell(
                    sheet,
                    selectedCellCoords.rowIndex,
                    selectedCellCoords.columnIndex,
                    cellDraft,
                    cellNoteDraft
                ),
            options?.staySelected
                ? "Updated the active cell."
                : "Saved the current cell before moving."
        );
    }

    function focusSelectedCellEditor() {
        window.requestAnimationFrame(() => selectedCellEditorRef.current?.focus());
    }

    function selectCell(nextCellKey: string, options?: { extendRange?: boolean }) {
        commitCellDraft();
        setSelectedCellKey(nextCellKey);
        if (!options?.extendRange) {
            setSelectionAnchorKey(nextCellKey);
        }
        focusSelectedCellEditor();
    }

    function moveSelection(
        rowOffset: number,
        columnOffset: number,
        options?: { extendRange?: boolean }
    ) {
        if (!activeSheet) return;
        const nextKey = normalizeSelection(
            selectedCellCoords.rowIndex + rowOffset,
            selectedCellCoords.columnIndex + columnOffset,
            activeSheet
        );
        selectCell(
            normalizeSelection(
                splitCellKey(nextKey).rowIndex,
                splitCellKey(nextKey).columnIndex,
                activeSheet
            ),
            options
        );
    }

    function handleEditorNavigation(event: ReactKeyboardEvent<HTMLInputElement>) {
        if (event.key === "Escape") {
            event.preventDefault();
            setCellDraft(selectedCell?.input ?? "");
            setCellNoteDraft(selectedCell?.note ?? "");
            setStatusMessage("Reverted the active cell draft.");
            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();
            commitCellDraft({ staySelected: true });
            moveSelection(event.shiftKey ? -1 : 1, 0);
            return;
        }

        if (event.key === "Tab") {
            event.preventDefault();
            commitCellDraft({ staySelected: true });
            moveSelection(0, event.shiftKey ? -1 : 1);
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            commitCellDraft({ staySelected: true });
            moveSelection(-1, 0);
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            commitCellDraft({ staySelected: true });
            moveSelection(1, 0);
            return;
        }

        if (event.key === "ArrowLeft" && event.currentTarget.selectionStart === 0) {
            event.preventDefault();
            commitCellDraft({ staySelected: true });
            moveSelection(0, -1);
            return;
        }

        if (
            event.key === "ArrowRight" &&
            event.currentTarget.selectionStart === event.currentTarget.value.length
        ) {
            event.preventDefault();
            commitCellDraft({ staySelected: true });
            moveSelection(0, 1);
        }
    }

    async function handleImport(files: FileList | null) {
        const file = files?.[0];
        if (!file) return;

        setImportError(null);
        setActionState({ status: "running", message: `Importing ${file.name}...` });
        try {
            const importedWorkbook = await importWorkbookFile(file);
            saveWorkbookSnapshot(importedWorkbook);
            startTransition(() => setSelectedWorkbookId(importedWorkbook.id));
            const message = `Imported ${file.name} into Workpaper Studio.`;
            setStatusMessage(message);
            setActionState({ status: "done", message });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "That file could not be imported into Workpaper Studio.";
            setImportError(message);
            setActionState({ status: "error", message });
        }
    }

    function createBlankWorkbook() {
        const workbookId = createWorkpaperWorkbook({
            title: "Untitled workpaper",
            description: "Manual workpaper created in AccCalc Workpaper Studio.",
            topic: "General",
        });
        startTransition(() => setSelectedWorkbookId(workbookId));
        setStatusMessage("Created a new blank workpaper.");
    }

    function addSheet() {
        mutateWorkbook((current) => {
            const nextSheet = createEmptySheet({
                title: `Sheet ${current.sheetOrder.length + 1}`,
            });
            return {
                ...current,
                activeSheetId: nextSheet.id,
                sheetOrder: [...current.sheetOrder, nextSheet.id],
                sheets: {
                    ...current.sheets,
                    [nextSheet.id]: nextSheet,
                },
            };
        }, "Added a new sheet.");
    }

    function dismissGuidance() {
        setGuidanceDismissed(true);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(GUIDANCE_STORAGE_KEY, "1");
        }
    }

    function deleteActiveSheet() {
        if (!draftWorkbook || !activeSheet || draftWorkbook.sheetOrder.length <= 1) return;

        mutateWorkbook((current) => {
            const nextSheets = { ...current.sheets };
            delete nextSheets[activeSheet.id];

            const currentIndex = current.sheetOrder.indexOf(activeSheet.id);
            const nextOrder = current.sheetOrder.filter((sheetId) => sheetId !== activeSheet.id);
            const fallbackSheetId =
                nextOrder[Math.max(0, currentIndex - 1)] ?? nextOrder[0] ?? current.activeSheetId;

            return {
                ...current,
                activeSheetId: fallbackSheetId,
                sheetOrder: nextOrder,
                sheets: nextSheets,
            };
        }, `Deleted ${activeSheet.title}.`);
    }

    async function handleExportWorkbook() {
        if (!draftWorkbook) return;
        setActionState({ status: "running", message: `Preparing ${draftWorkbook.title}.xlsx...` });
        try {
            const result = await exportWorkbookAsXlsx(draftWorkbook);
            const message = describeFileAction(result, "Exported");
            setStatusMessage(message);
            setActionState({ status: "done", message });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Workbook export could not be completed.";
            setActionState({ status: "error", message });
        }
    }

    async function handleExportSheet() {
        if (!draftWorkbook || !activeSheet) return;
        setActionState({ status: "running", message: `Preparing ${activeSheet.title}.csv...` });
        try {
            const result = await exportSheetAsCsv(draftWorkbook, activeSheet.id);
            if (!result) return;
            const message = describeFileAction(result, "Exported");
            setStatusMessage(message);
            setActionState({ status: "done", message });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Sheet export could not be completed.";
            setActionState({ status: "error", message });
        }
    }

    function insertFunctionTemplate(template: string) {
        setCellDraft(template);
        setShowFunctionPicker(false);
        setShowFormulaExamples(false);
        focusSelectedCellEditor();
    }

    function updateSelectedCellStyle(stylePatch: Partial<WorkpaperCellStyle>, message: string) {
        if (!activeSheet) return;
        mutateActiveSheet(
            (sheet) =>
                isSingleCellRange(selectedRange)
                    ? setSheetCellStyle(
                          sheet,
                          selectedCellCoords.rowIndex,
                          selectedCellCoords.columnIndex,
                          stylePatch
                      )
                    : applyStyleToRange(sheet, selectedRange, stylePatch),
            message
        );
    }

    async function copySelectedRange() {
        if (!activeSheet || typeof navigator === "undefined" || !navigator.clipboard?.writeText) return;
        const rows = rangeToTabularData(activeSheet, selectedRange);
        const text = rows.map((row) => row.join("\t")).join("\n");
        copiedRangeRef.current = { text, range: selectedRange };
        await navigator.clipboard.writeText(text);
        setStatusMessage(`Copied ${getRangeLabel(selectedRange)}.`);
    }

    async function pasteIntoSelection() {
        if (!activeSheet || typeof navigator === "undefined" || !navigator.clipboard?.readText) return;
        const raw = await navigator.clipboard.readText();
        if (!raw.trim()) return;
        if (
            copiedRangeRef.current &&
            copiedRangeRef.current.text === raw &&
            draftWorkbook
        ) {
            mutateActiveSheet(
                (sheet) =>
                    duplicateRangeToTarget(sheet, copiedRangeRef.current!.range, {
                        rowIndex: selectedRange.startRow,
                        columnIndex: selectedRange.startColumn,
                    }),
                `Pasted copied range into ${getRangeLabel(selectedRange)}.`
            );
            return;
        }
        const rows = parseClipboardMatrix(raw);
        mutateActiveSheet((sheet) => {
            let nextSheet = sheet;
            rows.forEach((row, rowOffset) => {
                row.forEach((value, columnOffset) => {
                    nextSheet = setSheetCell(
                        nextSheet,
                        selectedRange.startRow + rowOffset,
                        selectedRange.startColumn + columnOffset,
                        value
                    );
                });
            });
            return nextSheet;
        }, `Pasted into ${getRangeLabel(selectedRange)}.`);
    }

    function fillSelection(direction: "down" | "right") {
        if (!activeSheet) return;
        const singleCell = isSingleCellRange(selectedRange);
        if (singleCell) return;
        mutateActiveSheet((sheet) => {
            let nextSheet = sheet;
            if (direction === "down") {
                for (let rowIndex = selectedRange.startRow + 1; rowIndex <= selectedRange.endRow; rowIndex += 1) {
                    nextSheet = duplicateRangeToTarget(
                        nextSheet,
                        {
                            startRow: selectedRange.startRow,
                            endRow: selectedRange.startRow,
                            startColumn: selectedRange.startColumn,
                            endColumn: selectedRange.endColumn,
                        },
                        { rowIndex, columnIndex: selectedRange.startColumn }
                    );
                }
            } else {
                for (
                    let columnIndex = selectedRange.startColumn + 1;
                    columnIndex <= selectedRange.endColumn;
                    columnIndex += 1
                ) {
                    nextSheet = duplicateRangeToTarget(
                        nextSheet,
                        {
                            startRow: selectedRange.startRow,
                            endRow: selectedRange.endRow,
                            startColumn: selectedRange.startColumn,
                            endColumn: selectedRange.startColumn,
                        },
                        { rowIndex: selectedRange.startRow, columnIndex }
                    );
                }
            }
            return nextSheet;
        }, `Filled ${direction} across ${getRangeLabel(selectedRange)}.`);
    }

    function clearSelectedRange() {
        if (!activeSheet) return;
        mutateActiveSheet(
            (sheet) => clearRangeCells(sheet, selectedRange),
            `Cleared ${getRangeLabel(selectedRange)}.`
        );
    }

    function insertStructure(kind: "row" | "column", action: "insert" | "delete") {
        if (!activeSheet) return;
        const count =
            kind === "row"
                ? selectedRange.endRow - selectedRange.startRow + 1
                : selectedRange.endColumn - selectedRange.startColumn + 1;
        mutateActiveSheet((sheet) => {
            if (kind === "row") {
                return action === "insert"
                    ? insertRows(sheet, selectedRange.startRow, count)
                    : deleteRows(sheet, selectedRange.startRow, count);
            }
            return action === "insert"
                ? insertColumns(sheet, selectedRange.startColumn, count)
                : deleteColumns(sheet, selectedRange.startColumn, count);
        }, `${action === "insert" ? "Updated" : "Removed"} ${count} ${kind}${count > 1 ? "s" : ""}.`);
    }

    function toggleFreeze(type: "rows" | "columns") {
        if (!activeSheet) return;
        mutateActiveSheet((sheet) => ({
            ...sheet,
            freezeRows: type === "rows" ? (sheet.freezeRows ? 0 : 1) : sheet.freezeRows,
            freezeColumns:
                type === "columns" ? (sheet.freezeColumns ? 0 : 1) : sheet.freezeColumns,
            updatedAt: Date.now(),
        }), type === "rows" ? "Toggled frozen first row." : "Toggled frozen first column.");
    }

    function applySmartAction(action: WorkpaperSmartActionKey) {
        if (!activeSheet || !draftWorkbook) return;
        mutateWorkbook((current) => {
            const sheet = current.sheets[current.activeSheetId];
            if (!sheet) return current;
            let nextSheet = sheet;
            const startRow = Math.max(selectedRange.endRow + 1, getLastUsedRowIndex(sheet) + 1, 0);

            if (action === "summary-sheet") {
                const template = getWorkpaperTemplate("assumptions-and-summary");
                if (template) {
                    const workbook = template.buildWorkbook();
                    const summarySheet = workbook.sheets[workbook.activeSheetId];
                    return {
                        ...current,
                        activeSheetId: summarySheet.id,
                        sheetOrder: [...current.sheetOrder, summarySheet.id],
                        sheets: {
                            ...current.sheets,
                            [summarySheet.id]: summarySheet,
                        },
                    };
                }
                return current;
            }

            const rowSets: Array<[number, number, string, WorkpaperCellStyle?]> =
                action === "totals-row"
                    ? [
                          [startRow, 0, "Total", { bold: true, numberFormat: "currency" }],
                          [startRow, 1, `=SUM(B${selectedRange.startRow + 1}:B${selectedRange.endRow + 1})`, { bold: true, numberFormat: "currency" }],
                      ]
                    : action === "assumptions-block"
                      ? [
                            [startRow, 0, "Assumptions", { bold: true, fillColor: "#DBEAFE" }],
                            [startRow + 1, 0, "Assumption 1"],
                            [startRow + 2, 0, "Assumption 2"],
                          ]
                      : action === "notes-block"
                        ? [
                              [startRow, 0, "Notes", { bold: true, fillColor: "#DCFCE7" }],
                              [startRow + 1, 0, "Document support, reviewer comments, or source traceability here."],
                          ]
                        : [
                              [startRow, 0, "Section heading", { bold: true, fillColor: "#FEF3C7" }],
                              [startRow + 1, 0, ""],
                          ];

            rowSets.forEach(([rowIndex, columnIndex, input, style]) => {
                nextSheet = setSheetCell(nextSheet, rowIndex, columnIndex, input);
                if (style) {
                    nextSheet = setSheetCellStyle(nextSheet, rowIndex, columnIndex, style);
                }
            });

            return {
                ...current,
                sheets: {
                    ...current.sheets,
                    [sheet.id]: nextSheet,
                },
            };
        }, "Inserted a structured workpaper block.");
    }

    function handleGridKeydown(event: ReactKeyboardEvent<HTMLElement>) {
        const isModifier = event.ctrlKey || event.metaKey;
        if (isModifier && event.key.toLowerCase() === "c") {
            event.preventDefault();
            void copySelectedRange();
            return;
        }
        if (isModifier && event.key.toLowerCase() === "v") {
            event.preventDefault();
            void pasteIntoSelection();
            return;
        }
        if (isModifier && event.key.toLowerCase() === "d") {
            event.preventDefault();
            fillSelection("down");
            return;
        }
        if (event.key === "Delete") {
            event.preventDefault();
            clearSelectedRange();
            return;
        }
        if (event.key.startsWith("Arrow") && !isModifier && !event.altKey) {
            const extendRange = event.shiftKey;
            event.preventDefault();
            if (event.key === "ArrowUp") moveSelection(-1, 0, { extendRange });
            if (event.key === "ArrowDown") moveSelection(1, 0, { extendRange });
            if (event.key === "ArrowLeft") moveSelection(0, -1, { extendRange });
            if (event.key === "ArrowRight") moveSelection(0, 1, { extendRange });
        }
    }

    const selectedRangeLabel = getRangeLabel(selectedRange);
    const selectedCellEvaluated = evaluatedCells[selectedCellKey];
    const liveCellPreview = useMemo(() => {
        if (!draftWorkbook || !activeSheet) return selectedCellEvaluated;
        const nextSheet = setSheetCell(
            activeSheet,
            selectedCellCoords.rowIndex,
            selectedCellCoords.columnIndex,
            deferredCellDraft,
            deferredCellNoteDraft
        );

        const previewWorkbook = {
            ...draftWorkbook,
            sheets: {
                ...draftWorkbook.sheets,
                [activeSheet.id]: nextSheet,
            },
        };

        return evaluateCellInput(previewWorkbook, activeSheet.id, deferredCellDraft);
    }, [
        activeSheet,
        deferredCellDraft,
        deferredCellNoteDraft,
        draftWorkbook,
        selectedCellCoords.columnIndex,
        selectedCellCoords.rowIndex,
        selectedCellEvaluated,
    ]);
    const liveFormulaError =
        cellDraft.trim().startsWith("=") && liveCellPreview?.kind === "error"
            ? liveCellPreview.errorMessage ?? String(liveCellPreview.value)
            : null;
    const recentWorkbookIds = library.recentWorkbookIds
        .filter((workbookId) => workbookId !== selectedWorkbookId && Boolean(library.workbooks[workbookId]))
        .slice(0, 4);
    const selectionSummary =
        selectedCellKeys.length > 1
            ? `${selectedCellKeys.length} cells selected`
            : "1 cell selected";
    const shouldShowGuidance =
        Boolean(activeSheet) &&
        ((!guidanceDismissed && !hasSheetContent) ||
            showFormulaExamples ||
            Boolean(liveFormulaError));

    const sheetTabs = draftWorkbook
        ? draftWorkbook.sheetOrder.map((sheetId) => ({
              id: sheetId,
              label: draftWorkbook.sheets[sheetId]?.title ?? "Sheet",
          }))
        : [];

    const panelButtons: Array<{ key: WorkpaperPanelKey; label: string; count?: number }> = [
        { key: "workbooks", label: "Workbooks", count: library.workbookOrder.length },
        { key: "transfers", label: "Inbox", count: library.pendingTransfers.length },
        { key: "templates", label: "Templates", count: WORKPAPER_TEMPLATES.length },
        { key: "details", label: "Details" },
    ];

    const relatedItems = activeTemplate
        ? activeTemplate.relatedPaths.map((path) => ({
              path,
              label: path
                  .replace(/^\//, "")
                  .split("/")
                  .map((part) => part.replace(/-/g, " "))
                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(" / "),
          }))
        : [];

    return (
        <div ref={workspaceRef} className="app-page-shell-wide workpaper-studio-page">
            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={(event) => void handleImport(event.target.files)}
            />

            <header className="workpaper-studio-page__header">
                <div className="workpaper-studio-page__header-main">
                    <Link to="/" className="app-back-link rounded-full px-3 py-2">
                        <span className="app-back-link__label">Back to AccCalc</span>
                    </Link>
                    <div className="min-w-0">
                        <p className="workpaper-studio-page__kicker">Workpaper Studio</p>
                        <h1 className="workpaper-studio-page__title">Worksheet-first workpapers</h1>
                        <p className="workpaper-studio-page__subtitle">
                            Open a workbook, tap a cell, and build calculations, schedules, or math
                            tables without fighting the interface.
                        </p>
                    </div>
                </div>
                <div className="workpaper-studio-page__header-meta">
                    <span className="app-chip rounded-full px-3 py-1 text-xs">v{APP_VERSION}</span>
                    <button
                        type="button"
                        onClick={createBlankWorkbook}
                        className="app-button-primary rounded-xl px-3.5 py-2 text-sm font-semibold"
                    >
                        New workbook
                    </button>
                </div>
            </header>

            {draftWorkbook ? (
                <div className="workpaper-studio-page__body">
                    <section className="workpaper-toolbar">
                        <div className="workpaper-toolbar__main">
                            <label className="workpaper-toolbar__field">
                                <span className="workpaper-toolbar__label">Workbook</span>
                                <select
                                    value={selectedWorkbookId ?? ""}
                                    onChange={(event) =>
                                        startTransition(() => setSelectedWorkbookId(event.target.value))
                                    }
                                    className="workpaper-toolbar__select"
                                >
                                    {library.workbookOrder.map((workbookId) => {
                                        const workbook = library.workbooks[workbookId];
                                        if (!workbook) return null;
                                        return (
                                            <option key={workbook.id} value={workbook.id}>
                                                {workbook.title}
                                            </option>
                                        );
                                    })}
                                </select>
                            </label>

                            <div className="workpaper-toolbar__meta">
                                <span className="workpaper-toolbar__identity">
                                    {draftWorkbook.title}
                                    {activeSheet ? ` / ${activeSheet.title}` : ""}
                                </span>
                                <span className="app-chip rounded-full px-3 py-1 text-xs">
                                    {draftWorkbook.topic || "General"}
                                </span>
                                <span className="workpaper-toolbar__status">{statusMessage}</span>
                            </div>
                        </div>

                        <div className="workpaper-toolbar__actions">
                            <WorkpaperActionMenu
                                menuKey="file"
                                openMenu={openMenu}
                                setOpenMenu={setOpenMenu}
                                label="File"
                                items={[
                                    {
                                        label: "Import workbook",
                                        detail: "Open an XLSX or CSV file into Workpaper Studio.",
                                        onSelect: () => fileInputRef.current?.click(),
                                    },
                                    {
                                        label: "Export workbook (.xlsx)",
                                        detail: "Download the full workbook with sheet structure.",
                                        onSelect: () => void handleExportWorkbook(),
                                    },
                                    {
                                        label: "Export active sheet (.csv)",
                                        detail: "Download only the current sheet.",
                                        disabled: !activeSheet,
                                        onSelect: () => void handleExportSheet(),
                                    },
                                    {
                                        label: "Print workbook view",
                                        detail: "Use the worksheet-friendly print layout.",
                                        onSelect: () => window.print(),
                                    },
                                ]}
                            />
                        </div>
                    </section>

                    {actionState.status !== "idle" ? (
                        <InlineNotice
                            title={
                                actionState.status === "running"
                                    ? "Workpaper action in progress"
                                    : actionState.status === "done"
                                      ? "Workpaper action complete"
                                      : "Workpaper action needs attention"
                            }
                            message={actionState.message}
                            tone={
                                actionState.status === "error"
                                    ? "error"
                                    : actionState.status === "done"
                                      ? "success"
                                      : "info"
                            }
                            compact
                        />
                    ) : null}

                    {importError ? (
                        <InlineNotice
                            title="Import review needed"
                            message={importError}
                            tone="warning"
                            compact
                            onDismiss={() => setImportError(null)}
                        />
                    ) : null}

                    <section className="workpaper-tabs">
                        <div className="workpaper-tabs__scroll scrollbar-premium">
                            {sheetTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() =>
                                        mutateWorkbook(
                                            (current) => ({ ...current, activeSheetId: tab.id }),
                                            `Switched to ${tab.label}.`
                                        )
                                    }
                                    className={[
                                        "workpaper-tab",
                                        draftWorkbook.activeSheetId === tab.id
                                            ? "workpaper-tab--active"
                                            : "",
                                    ].join(" ")}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        {activeSheet ? (
                            <div className="workpaper-tabs__actions">
                                <button
                                    type="button"
                                    onClick={addSheet}
                                    className="app-button-ghost rounded-xl px-3 py-1.5 text-xs font-semibold"
                                >
                                    Add sheet
                                </button>
                                <WorkpaperActionMenu
                                    menuKey="sheet"
                                    openMenu={openMenu}
                                    setOpenMenu={setOpenMenu}
                                    label="Sheet"
                                    badge={activeSheet.title}
                                    items={[
                                        {
                                            label: "Duplicate sheet",
                                            detail: "Create a copy of the active worksheet.",
                                            disabled: !selectedWorkbookId,
                                            onSelect: () =>
                                                selectedWorkbookId
                                                    ? duplicateSheetIntoWorkbook(selectedWorkbookId, activeSheet.id)
                                                    : undefined,
                                        },
                                        {
                                            label: "Move sheet left",
                                            detail: "Bring this sheet earlier in the workbook.",
                                            onSelect: () =>
                                                mutateWorkbook((current) => {
                                                    const currentIndex = current.sheetOrder.indexOf(activeSheet.id);
                                                    if (currentIndex <= 0) return current;
                                                    const nextOrder = [...current.sheetOrder];
                                                    [nextOrder[currentIndex - 1], nextOrder[currentIndex]] = [
                                                        nextOrder[currentIndex],
                                                        nextOrder[currentIndex - 1],
                                                    ];
                                                    return { ...current, sheetOrder: nextOrder };
                                                }, "Moved the active sheet left."),
                                        },
                                        {
                                            label: "Delete sheet",
                                            detail: "Remove the current worksheet from the workbook.",
                                            disabled: draftWorkbook.sheetOrder.length <= 1,
                                            tone: "danger",
                                            onSelect: deleteActiveSheet,
                                        },
                                    ]}
                                />
                            </div>
                        ) : null}
                    </section>

                    {activeSheet ? (
                        <>
                            <section className="workpaper-formula-bar">
                                <div className="workpaper-formula-bar__cell">{selectedRangeLabel}</div>
                                <button
                                    type="button"
                                    onClick={() => setShowFunctionPicker((current) => !current)}
                                    className={[
                                        "workpaper-formula-bar__fx",
                                        showFunctionPicker ? "workpaper-formula-bar__fx--active" : "",
                                    ].join(" ")}
                                >
                                    fx
                                </button>
                                <input
                                    ref={formulaBarInputRef}
                                    value={cellDraft}
                                    onChange={(event) => setCellDraft(event.target.value)}
                                    onBlur={() => commitCellDraft({ staySelected: true })}
                                    onKeyDown={handleEditorNavigation}
                                    placeholder="Type a value, text, or a formula like =SUM(A1:A5)"
                                    className="workpaper-formula-bar__input"
                                    aria-label={`Formula bar for ${selectedRangeLabel}`}
                                />
                                <span
                                    className={[
                                        "workpaper-formula-bar__mode",
                                        liveFormulaError ? "workpaper-formula-bar__mode--error" : "",
                                        cellDraft.trim().startsWith("=")
                                            ? "workpaper-formula-bar__mode--formula"
                                            : "",
                                    ].join(" ")}
                                >
                                    {liveFormulaError
                                        ? "Error"
                                        : cellDraft.trim().startsWith("=")
                                          ? "Formula"
                                          : "Value"}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowFormulaExamples((current) => !current)}
                                    className="workpaper-formula-bar__help"
                                >
                                    {showFormulaExamples ? "Hide tips" : "Tips"}
                                </button>
                            </section>

                            <section className="workpaper-quickbar">
                                <div className="workpaper-quickbar__summary">
                                    <span className="workpaper-format-strip__label">Active selection</span>
                                    <strong>{selectedRangeLabel}</strong>
                                    <span className="workpaper-format-strip__hint">{selectionSummary}</span>
                                    <span className="workpaper-quickbar__preview">
                                        Live display:{" "}
                                        <strong>
                                            {formatDisplayValue(
                                                liveCellPreview?.display ||
                                                    selectedCell?.input ||
                                                    "Blank cell",
                                                selectedCellStyle
                                            )}
                                        </strong>
                                    </span>
                                </div>
                                <div className="workpaper-quickbar__actions">
                                    <button
                                        type="button"
                                        onClick={() => setShowFormattingTools((current) => !current)}
                                        className="workpaper-toolbar__button workpaper-toolbar__button--secondary"
                                    >
                                        {showFormattingTools ? "Hide format" : "Format"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowFunctionPicker((current) => !current)}
                                        className="workpaper-toolbar__button workpaper-toolbar__button--secondary"
                                    >
                                        {showFunctionPicker ? "Hide fx" : "Functions"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActivePanel((current) =>
                                                current === "details" ? "none" : "details"
                                            )
                                        }
                                        className="workpaper-toolbar__button workpaper-toolbar__button--secondary"
                                    >
                                        {activePanel === "details" ? "Hide details" : "Details"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => void copySelectedRange()}
                                        className="workpaper-toolbar__button workpaper-toolbar__button--secondary"
                                    >
                                        Copy
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => void pasteIntoSelection()}
                                        className="workpaper-toolbar__button workpaper-toolbar__button--secondary"
                                    >
                                        Paste
                                    </button>
                                </div>
                            </section>

                            <section className="workpaper-mobile-edit-dock" aria-label="Selected cell quick edit">
                                <div>
                                    <span className="workpaper-format-strip__label">Editing {selectedRangeLabel}</span>
                                    <p className="app-helper text-xs">
                                        Use the formula bar above or tap a visible cell. Enter moves down, Tab moves right.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => formulaBarInputRef.current?.focus()}
                                    className="workpaper-toolbar__button workpaper-toolbar__button--secondary"
                                >
                                    Focus formula bar
                                </button>
                            </section>

                            {(showFunctionPicker || showFormattingTools) && (
                                <section className="workpaper-helpers-row">
                                    {showFunctionPicker ? (
                                        <div className="workpaper-function-picker">
                                            <div className="workpaper-function-picker__header">
                                                <strong>Insert a function</strong>
                                                <span className="app-helper text-xs">
                                                    Choose a starter formula for {selectedRangeLabel}.
                                                </span>
                                            </div>
                                            <div className="workpaper-function-picker__groups">
                                                {FUNCTION_GROUPS.map((group) => (
                                                    <div
                                                        key={group.label}
                                                        className="workpaper-function-picker__group"
                                                    >
                                                        <p className="workpaper-function-picker__group-label">
                                                            {group.label}
                                                        </p>
                                                        <div className="workpaper-function-picker__list">
                                                            {group.items.map((item) => (
                                                                <button
                                                                    key={item.name}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        insertFunctionTemplate(item.template)
                                                                    }
                                                                    className="workpaper-function-picker__item"
                                                                >
                                                                    <span>{item.name}</span>
                                                                    <small>{item.signature}</small>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                    {showFormattingTools ? (
                                        <div className="workpaper-format-strip">
                                        <div className="workpaper-format-strip__group">
                                            <span className="workpaper-format-strip__label">Selection tools</span>
                                            <button
                                                type="button"
                                                onClick={() => fillSelection("down")}
                                                disabled={isSingleCellRange(selectedRange)}
                                                className="workpaper-format-button workpaper-format-button--wide"
                                            >
                                                Fill Down
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => fillSelection("right")}
                                                disabled={isSingleCellRange(selectedRange)}
                                                className="workpaper-format-button workpaper-format-button--wide"
                                            >
                                                Fill Right
                                            </button>
                                            <button
                                                type="button"
                                                onClick={clearSelectedRange}
                                                className="workpaper-format-button workpaper-format-button--wide"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        <div className="workpaper-format-strip__group">
                                            <span className="workpaper-format-strip__label">Fill</span>
                                            {FORMAT_FILL_OPTIONS.map((color) => (
                                                <button
                                                    key={`fill-${color || "none"}`}
                                                    type="button"
                                                    onClick={() =>
                                                        updateSelectedCellStyle(
                                                            { fillColor: color || undefined },
                                                            color
                                                                ? "Updated cell fill color."
                                                                : "Cleared cell fill color."
                                                        )
                                                    }
                                                    className={[
                                                        "workpaper-color-chip",
                                                        selectedCellStyle?.fillColor === color
                                                            ? "workpaper-color-chip--active"
                                                            : "",
                                                    ].join(" ")}
                                                    style={{ backgroundColor: color || "transparent" }}
                                                    aria-label={color ? `Set fill color ${color}` : "Clear fill color"}
                                                />
                                            ))}
                                        </div>
                                        <div className="workpaper-format-strip__group">
                                            <span className="workpaper-format-strip__label">Text</span>
                                            {FORMAT_TEXT_OPTIONS.map((color) => (
                                                <button
                                                    key={`text-${color || "none"}`}
                                                    type="button"
                                                    onClick={() =>
                                                        updateSelectedCellStyle(
                                                            { textColor: color || undefined },
                                                            color
                                                                ? "Updated text color."
                                                                : "Cleared text color."
                                                        )
                                                    }
                                                    className={[
                                                        "workpaper-color-chip",
                                                        "workpaper-color-chip--text",
                                                        selectedCellStyle?.textColor === color
                                                            ? "workpaper-color-chip--active"
                                                            : "",
                                                    ].join(" ")}
                                                    style={color ? getTextChipStyle(color) : undefined}
                                                    aria-label={color ? `Set text color ${color}` : "Clear text color"}
                                                >
                                                    A
                                                </button>
                                            ))}
                                            {selectedCellStyle?.fillColor && !selectedCellStyle?.textColor ? (
                                                <span className="workpaper-format-strip__hint">
                                                    Auto contrast {resolvedSelectedCellStyle.effectiveTextColor}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="workpaper-format-strip__group">
                                            <span className="workpaper-format-strip__label">Format</span>
                                            <select
                                                value={selectedCellStyle?.numberFormat ?? "general"}
                                                onChange={(event) =>
                                                    updateSelectedCellStyle(
                                                        {
                                                            numberFormat:
                                                                event.target.value === "general"
                                                                    ? undefined
                                                                    : (event.target
                                                                          .value as WorkpaperCellStyle["numberFormat"]),
                                                        },
                                                        "Updated cell number format."
                                                    )
                                                }
                                                className="workpaper-toolbar__select workpaper-toolbar__select--compact"
                                            >
                                                {NUMBER_FORMAT_OPTIONS.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="workpaper-format-strip__group">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateSelectedCellStyle(
                                                        { bold: !selectedCellStyle?.bold },
                                                        selectedCellStyle?.bold ? "Removed bold formatting." : "Applied bold formatting."
                                                    )
                                                }
                                                className={[
                                                    "workpaper-format-button",
                                                    selectedCellStyle?.bold
                                                        ? "workpaper-format-button--active"
                                                        : "",
                                                ].join(" ")}
                                            >
                                                B
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateSelectedCellStyle(
                                                        { italic: !selectedCellStyle?.italic },
                                                        selectedCellStyle?.italic ? "Removed italic formatting." : "Applied italic formatting."
                                                    )
                                                }
                                                className={[
                                                    "workpaper-format-button",
                                                    "workpaper-format-button--italic",
                                                    selectedCellStyle?.italic
                                                        ? "workpaper-format-button--active"
                                                        : "",
                                                ].join(" ")}
                                            >
                                                I
                                            </button>
                                            {(["left", "center", "right"] as const).map((align) => (
                                                <button
                                                    key={align}
                                                    type="button"
                                                    onClick={() =>
                                                        updateSelectedCellStyle(
                                                            {
                                                                textAlign:
                                                                    selectedCellStyle?.textAlign === align
                                                                        ? undefined
                                                                        : align,
                                                            },
                                                            `Set cell alignment to ${align}.`
                                                        )
                                                    }
                                                    className={[
                                                        "workpaper-format-button",
                                                        selectedCellStyle?.textAlign === align
                                                            ? "workpaper-format-button--active"
                                                            : "",
                                                    ].join(" ")}
                                                >
                                                    {align === "left" ? "L" : align === "center" ? "C" : "R"}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="workpaper-format-strip__group">
                                            <span className="workpaper-format-strip__label">Workpaper</span>
                                            <button
                                                type="button"
                                                onClick={() => applySmartAction("totals-row")}
                                                className="workpaper-format-button workpaper-format-button--wide"
                                            >
                                                Totals
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applySmartAction("assumptions-block")}
                                                className="workpaper-format-button workpaper-format-button--wide"
                                            >
                                                Assumptions
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applySmartAction("notes-block")}
                                                className="workpaper-format-button workpaper-format-button--wide"
                                            >
                                                Notes
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applySmartAction("summary-sheet")}
                                                className="workpaper-format-button workpaper-format-button--wide"
                                            >
                                                Summary sheet
                                            </button>
                                        </div>
                                    </div>
                                    ) : null}
                                </section>
                            )}

                            {shouldShowGuidance ? (
                                <section className="workpaper-inline-guide">
                                    <div className="workpaper-inline-guide__summary">
                                        <strong>How to use this sheet</strong>
                                        <span className="app-helper text-xs">
                                            Type values directly, start formulas with <code>=</code>,
                                            use <code>Functions</code> for guided formulas, and open
                                            <code> Format</code> only when you need styling or workpaper blocks.
                                        </span>
                                        {liveFormulaError ? (
                                            <span className="workpaper-inline-guide__error">
                                                {liveFormulaError}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="workpaper-inline-guide__actions">
                                        {FORMULA_HINTS.map((hint) => (
                                            <button
                                                key={hint.value}
                                                type="button"
                                                onClick={() => {
                                                    setCellDraft(hint.value);
                                                    focusSelectedCellEditor();
                                                }}
                                                className="workpaper-inline-guide__chip"
                                            >
                                                {hint.label}
                                            </button>
                                        ))}
                                        {!guidanceDismissed ? (
                                            <button
                                                type="button"
                                                onClick={dismissGuidance}
                                                className="workpaper-inline-guide__dismiss"
                                            >
                                                Dismiss
                                            </button>
                                        ) : null}
                                    </div>
                                </section>
                            ) : null}

                            <section className="workpaper-grid-shell">
                                <div className="workpaper-grid-shell__header">
                                    <div className="min-w-0">
                                        <h2 className="workpaper-grid-shell__title">{activeSheet.title}</h2>
                                        <p className="workpaper-grid-shell__subtitle">
                                            {formulaCoverage.values} value cells, {formulaCoverage.formulas} formula
                                            cells, last used row {lastUsedRow >= 0 ? lastUsedRow + 1 : "none"}, selection{" "}
                                            {selectedRangeLabel}.
                                        </p>
                                    </div>
                                    <div className="workpaper-grid-shell__header-actions">
                                        <WorkpaperActionMenu
                                            menuKey="structure"
                                            openMenu={openMenu}
                                            setOpenMenu={setOpenMenu}
                                            label="Structure"
                                            items={[
                                                {
                                                    label: "Add 5 rows at the bottom",
                                                    detail: "Extend the sheet for more working lines.",
                                                    onSelect: () =>
                                                        mutateActiveSheet(
                                                            (sheet) => ({
                                                                ...sheet,
                                                                rowCount: clampSheetDimension(
                                                                    sheet.rowCount + 5,
                                                                    24,
                                                                    MAX_ROWS
                                                                ),
                                                            }),
                                                            "Added more rows to the active sheet."
                                                        ),
                                                },
                                                {
                                                    label: "Add 1 column at the end",
                                                    detail: "Extend the sheet for more schedules or notes.",
                                                    onSelect: () =>
                                                        mutateActiveSheet(
                                                            (sheet) => ({
                                                                ...sheet,
                                                                columnCount: clampSheetDimension(
                                                                    sheet.columnCount + 1,
                                                                    8,
                                                                    MAX_COLUMNS
                                                                ),
                                                            }),
                                                            "Added a new column to the active sheet."
                                                        ),
                                                },
                                                {
                                                    label: "Insert row",
                                                    detail: `Insert a row around ${selectedRangeLabel}.`,
                                                    onSelect: () => insertStructure("row", "insert"),
                                                },
                                                {
                                                    label: "Insert column",
                                                    detail: `Insert a column around ${selectedRangeLabel}.`,
                                                    onSelect: () => insertStructure("column", "insert"),
                                                },
                                                {
                                                    label: "Delete row",
                                                    detail: `Delete the row at ${selectedRangeLabel}.`,
                                                    tone: "danger",
                                                    onSelect: () => insertStructure("row", "delete"),
                                                },
                                                {
                                                    label: "Delete column",
                                                    detail: `Delete the column at ${selectedRangeLabel}.`,
                                                    tone: "danger",
                                                    onSelect: () => insertStructure("column", "delete"),
                                                },
                                                {
                                                    label: activeSheet.freezeRows ? "Unfreeze top row" : "Freeze top row",
                                                    detail: "Keep the first row visible while scrolling.",
                                                    onSelect: () => toggleFreeze("rows"),
                                                },
                                                {
                                                    label: activeSheet.freezeColumns
                                                        ? "Unfreeze first column"
                                                        : "Freeze first column",
                                                    detail: "Keep the first column visible while scrolling.",
                                                    onSelect: () => toggleFreeze("columns"),
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div
                                    className="workpaper-grid scrollbar-premium"
                                    onKeyDown={handleGridKeydown}
                                    tabIndex={0}
                                    role="region"
                                    aria-label={`${activeSheet.title} editable workpaper grid`}
                                >
                                    <table className="workpaper-grid__table">
                                        <thead>
                                            <tr>
                                                <th className="workpaper-grid__corner">#</th>
                                                {Array.from({ length: activeSheet.columnCount }, (_, columnIndex) => (
                                                    <th
                                                        key={columnIndex}
                                                        className={[
                                                            "workpaper-grid__colhead",
                                                            selectedCellCoords.columnIndex === columnIndex
                                                                ? "workpaper-grid__colhead--active"
                                                                : "",
                                                            activeSheet.freezeColumns &&
                                                            columnIndex < activeSheet.freezeColumns
                                                                ? "workpaper-grid__colhead--frozen"
                                                                : "",
                                                        ].join(" ")}
                                                        style={
                                                            activeSheet.freezeColumns &&
                                                            columnIndex < activeSheet.freezeColumns
                                                                ? {
                                                                      left: `calc(var(--workpaper-row-header-width, 3.4rem) + (${columnIndex} * var(--workpaper-cell-width, 6.25rem)))`,
                                                                      zIndex: 3,
                                                                  }
                                                                : undefined
                                                        }
                                                    >
                                                        {toColumnLabel(columnIndex)}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.from({ length: activeSheet.rowCount }, (_, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <th
                                                        className={[
                                                            "workpaper-grid__rowhead",
                                                            selectedCellCoords.rowIndex === rowIndex
                                                                ? "workpaper-grid__rowhead--active"
                                                                : "",
                                                            activeSheet.freezeRows &&
                                                            rowIndex < activeSheet.freezeRows
                                                                ? "workpaper-grid__rowhead--frozen"
                                                                : "",
                                                        ].join(" ")}
                                                        style={
                                                            activeSheet.freezeRows && rowIndex < activeSheet.freezeRows
                                                                ? {
                                                                      top: `calc(var(--workpaper-column-header-height, 2.65rem) + (${rowIndex} * var(--workpaper-cell-height, 3rem)))`,
                                                                      zIndex: 2,
                                                                  }
                                                                : undefined
                                                        }
                                                    >
                                                        {rowIndex + 1}
                                                    </th>
                                                    {Array.from(
                                                        { length: activeSheet.columnCount },
                                                        (_, columnIndex) => {
                                                            const cellKey = getCellKey(rowIndex, columnIndex);
                                                            const cell = activeSheet.cells[cellKey];
                                                            const evaluated = evaluatedCells[cellKey];
                                                            const isSelected = cellKey === selectedCellKey;
                                                            const isInSelection = isCellWithinRange(
                                                                selectedRange,
                                                                rowIndex,
                                                                columnIndex
                                                            );
                                                            const isFrozenColumn = Boolean(
                                                                activeSheet.freezeColumns &&
                                                                    columnIndex < activeSheet.freezeColumns
                                                            );
                                                            const isFrozenRow = Boolean(
                                                                activeSheet.freezeRows &&
                                                                    rowIndex < activeSheet.freezeRows
                                                            );

                                                            return (
                                                                <td
                                                                    key={cellKey}
                                                                    className={[
                                                                        "workpaper-grid__cell-wrap",
                                                                        isInSelection
                                                                            ? "workpaper-grid__cell-wrap--range"
                                                                            : "",
                                                                        isFrozenColumn
                                                                            ? "workpaper-grid__cell-wrap--frozen-column"
                                                                            : "",
                                                                        isFrozenRow
                                                                            ? "workpaper-grid__cell-wrap--frozen-row"
                                                                            : "",
                                                                        isFrozenColumn && isFrozenRow
                                                                            ? "workpaper-grid__cell-wrap--frozen-intersection"
                                                                            : "",
                                                                    ].join(" ")}
                                                                    style={{
                                                                        left: isFrozenColumn
                                                                            ? `calc(var(--workpaper-row-header-width, 3.4rem) + (${columnIndex} * var(--workpaper-cell-width, 6.25rem)))`
                                                                            : undefined,
                                                                        top: isFrozenRow
                                                                            ? `calc(var(--workpaper-column-header-height, 2.65rem) + (${rowIndex} * var(--workpaper-cell-height, 3rem)))`
                                                                            : undefined,
                                                                        zIndex: isFrozenColumn && isFrozenRow ? 2 : isFrozenColumn || isFrozenRow ? 1 : undefined,
                                                                    }}
                                                                >
                                                                    {isSelected ? (
                                                                        <div
                                                                            ref={(element) => {
                                                                                selectedCellElementRef.current = element;
                                                                            }}
                                                                            className="workpaper-grid__cell workpaper-grid__cell--selected"
                                                                            style={getCellButtonStyle(cell?.style)}
                                                                        >
                                                                            <input
                                                                                ref={selectedCellEditorRef}
                                                                                value={cellDraft}
                                                                                onChange={(event) =>
                                                                                    setCellDraft(event.target.value)
                                                                                }
                                                                                onBlur={() =>
                                                                                    commitCellDraft({
                                                                                        staySelected: true,
                                                                                    })
                                                                                }
                                                                                onKeyDown={handleEditorNavigation}
                                                                                className="workpaper-grid__editor"
                                                                                style={getCellEditorStyle(cell?.style)}
                                                                                aria-label={`Edit ${getCellReference(rowIndex, columnIndex)}`}
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            onClick={(event) =>
                                                                                selectCell(cellKey, {
                                                                                    extendRange: event.shiftKey,
                                                                                })
                                                                            }
                                                                            className={[
                                                                                "workpaper-grid__cell",
                                                                                isInSelection
                                                                                    ? "workpaper-grid__cell--range"
                                                                                    : "",
                                                                            ].join(" ")}
                                                                            style={getCellButtonStyle(cell?.style)}
                                                                        >
                                                                            <span
                                                                                className="workpaper-grid__display"
                                                                                style={getCellTextStyle(cell?.style)}
                                                                            >
                                                                                {formatDisplayValue(
                                                                                    evaluated?.display || cell?.input || "",
                                                                                    cell?.style
                                                                                )}
                                                                            </span>
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            );
                                                        }
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="workpaper-panel-strip">
                                <WorkpaperActionMenu
                                    menuKey="workspace"
                                    openMenu={openMenu}
                                    setOpenMenu={setOpenMenu}
                                    label="Workspace"
                                    badge={
                                        activePanel === "none"
                                            ? undefined
                                            : panelButtons.find((panel) => panel.key === activePanel)?.label
                                    }
                                    align="start"
                                    items={panelButtons.map((panel) => ({
                                        label: panel.label,
                                        badge:
                                            typeof panel.count === "number"
                                                ? String(panel.count)
                                                : undefined,
                                        detail:
                                            activePanel === panel.key
                                                ? "Currently open below the worksheet."
                                                : "Open this utility without crowding the grid.",
                                        onSelect: () =>
                                            setActivePanel((current) =>
                                                current === panel.key ? "none" : panel.key
                                            ),
                                    }))}
                                />
                                {activePanel !== "none" ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setActivePanel("none")}
                                            className="workpaper-panel-strip__button"
                                        >
                                            Hide panel
                                        </button>
                                        <span className="workpaper-panel-strip__active">
                                            {
                                                panelButtons.find((panel) => panel.key === activePanel)
                                                    ?.label
                                            }{" "}
                                            open
                                        </span>
                                    </>
                                ) : null}
                            </section>

                            {activePanel !== "none" ? (
                                <section className="workpaper-panel-surface">
                                      {activePanel === "workbooks" ? (
                                          <DisclosurePanel
                                              title="Workbooks"
                                              summary="Open and manage workbook files without taking over the worksheet."
                                              badge={`${library.workbookOrder.length} files`}
                                              defaultOpen
                                              compact
                                          >
                                              {recentWorkbookIds.length > 0 ? (
                                                  <div className="mb-4 space-y-2">
                                                      <p className="app-helper text-xs">Recent workbooks</p>
                                                      <div className="flex flex-wrap gap-2">
                                                          {recentWorkbookIds.map((workbookId) => {
                                                              const workbook = library.workbooks[workbookId];
                                                              if (!workbook) return null;
                                                              return (
                                                                  <button
                                                                      key={workbook.id}
                                                                      type="button"
                                                                      onClick={() =>
                                                                          startTransition(() =>
                                                                              setSelectedWorkbookId(workbook.id)
                                                                          )
                                                                      }
                                                                      className="workpaper-recent-strip__button"
                                                                  >
                                                                      {workbook.title}
                                                                  </button>
                                                              );
                                                          })}
                                                      </div>
                                                  </div>
                                              ) : null}
                                              <div className="workpaper-card-grid">
                                                  {library.workbookOrder.map((workbookId) => {
                                                      const workbook = library.workbooks[workbookId];
                                                    if (!workbook) return null;
                                                    return (
                                                        <button
                                                            key={workbook.id}
                                                            type="button"
                                                            onClick={() =>
                                                                startTransition(() =>
                                                                    setSelectedWorkbookId(workbook.id)
                                                                )
                                                            }
                                                            className={[
                                                                "workpaper-card-button",
                                                                selectedWorkbookId === workbook.id
                                                                    ? "workpaper-card-button--active"
                                                                    : "",
                                                            ].join(" ")}
                                                        >
                                                            <strong>{workbook.title}</strong>
                                                            <span className="app-helper text-xs">
                                                                {workbook.topic} | {workbook.sheetOrder.length} sheets
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (!selectedWorkbookId) return;
                                                        deleteWorkbook(selectedWorkbookId);
                                                        startTransition(() =>
                                                            setSelectedWorkbookId(
                                                                library.workbookOrder.find(
                                                                    (id) => id !== selectedWorkbookId
                                                                ) ?? null
                                                            )
                                                        );
                                                        setStatusMessage("Deleted the selected workbook.");
                                                    }}
                                                    className="app-button-ghost rounded-xl px-3.5 py-2 text-sm font-semibold"
                                                >
                                                    Delete workbook
                                                </button>
                                            </div>
                                        </DisclosurePanel>
                                    ) : null}

                                    {activePanel === "transfers" ? (
                                        <DisclosurePanel
                                            title="Transfer inbox"
                                            summary="Send calculator and history outputs into this workbook with less friction."
                                            badge={`${library.pendingTransfers.length} pending`}
                                            defaultOpen
                                            compact
                                        >
                                            <div className="space-y-3">
                                                {library.pendingTransfers.length === 0 ? (
                                                    <p className="app-body-md text-sm">
                                                        No incoming transfers right now. Use a calculator&apos;s
                                                        &quot;Send to Workpaper&quot; action or create one from History.
                                                    </p>
                                                ) : (
                                                    library.pendingTransfers.map((transfer) => (
                                                        <SectionCard key={transfer.id}>
                                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                                {transfer.title}
                                                            </p>
                                                            <p className="app-helper mt-1 text-xs">
                                                                {transfer.source.title} | {transfer.topic}
                                                            </p>
                                                            <p className="app-body-md mt-2 text-sm">
                                                                {transfer.source.summary}
                                                            </p>
                                                            <div className="mt-3 flex flex-wrap gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const workbookId = createWorkbookFromTransfer(transfer);
                                                                        startTransition(() =>
                                                                            setSelectedWorkbookId(workbookId)
                                                                        );
                                                                        setStatusMessage(
                                                                            `Created a workbook from ${transfer.source.title}.`
                                                                        );
                                                                    }}
                                                                    className="app-button-primary rounded-xl px-3.5 py-2 text-sm font-semibold"
                                                                >
                                                                    New workbook
                                                                </button>
                                                                {selectedWorkbookId ? (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                appendTransferToWorkbook(
                                                                                    selectedWorkbookId,
                                                                                    transfer
                                                                                );
                                                                                setStatusMessage(
                                                                                    `Added ${transfer.title} as a new sheet.`
                                                                                );
                                                                            }}
                                                                            className="app-button-secondary rounded-xl px-3.5 py-2 text-sm font-semibold"
                                                                        >
                                                                            Add as new sheet
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                appendTransferRowsToActiveSheet(
                                                                                    selectedWorkbookId,
                                                                                    transfer
                                                                                );
                                                                                setStatusMessage(
                                                                                    `Appended ${transfer.title} below the current sheet content.`
                                                                                );
                                                                            }}
                                                                            className="app-button-ghost rounded-xl px-3.5 py-2 text-sm font-semibold"
                                                                        >
                                                                            Append below sheet
                                                                        </button>
                                                                    </>
                                                                ) : null}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => dismissTransfer(transfer.id)}
                                                                    className="app-button-ghost rounded-xl px-3.5 py-2 text-sm font-semibold"
                                                                >
                                                                    Dismiss
                                                                </button>
                                                            </div>
                                                        </SectionCard>
                                                    ))
                                                )}
                                            </div>
                                        </DisclosurePanel>
                                    ) : null}

                                    {activePanel === "templates" ? (
                                        <DisclosurePanel
                                            title="Templates"
                                            summary="Open structured starter sheets only when you need them."
                                            badge={`${WORKPAPER_TEMPLATES.length} templates`}
                                            defaultOpen
                                            compact
                                        >
                                            <div className="workpaper-template-filters" aria-label="Template filters">
                                                <label className="workpaper-template-filters__search">
                                                    <span className="app-helper text-xs">Search templates</span>
                                                    <input
                                                        value={templateSearchQuery}
                                                        onChange={(event) => setTemplateSearchQuery(event.target.value)}
                                                        placeholder="Try ABC, audit, FAR, budget..."
                                                        className="workpaper-details-form__input"
                                                    />
                                                </label>
                                                <label className="workpaper-template-filters__topic">
                                                    <span className="app-helper text-xs">Topic</span>
                                                    <select
                                                        value={selectedTemplateTopic}
                                                        onChange={(event) => setSelectedTemplateTopic(event.target.value)}
                                                        className="workpaper-toolbar__select"
                                                    >
                                                        {templateTopics.map((topic) => (
                                                            <option key={topic} value={topic}>
                                                                {topic}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>
                                            </div>
                                            <p className="app-helper mt-3 text-xs">
                                                Showing {filteredTemplates.length} of {WORKPAPER_TEMPLATES.length} assignment-ready templates.
                                            </p>
                                            {filteredTemplates.length === 0 ? (
                                                <SectionCard className="app-tone-warning mt-3">
                                                    <p className="app-card-title text-sm">No matching templates</p>
                                                    <p className="app-body-md mt-2 text-sm">
                                                        Try a broader topic, calculator name, or curriculum keyword.
                                                    </p>
                                                </SectionCard>
                                            ) : null}
                                            <div className="workpaper-card-grid mt-3">
                                                {filteredTemplates.map((template) => (
                                                    <div key={template.id} className="workpaper-card">
                                                        <strong>{template.title}</strong>
                                                        <p className="app-helper mt-1 text-xs">
                                                            {template.description}
                                                        </p>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {template.tags.slice(0, 3).map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="app-chip rounded-full px-2.5 py-1 text-[0.68rem]"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => openTemplateWorkbook(template)}
                                                            className="app-button-secondary mt-3 rounded-xl px-3.5 py-2 text-sm font-semibold"
                                                        >
                                                            Open template
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </DisclosurePanel>
                                    ) : null}

                                    {activePanel === "details" ? (
                                        <div className="workpaper-details-grid">
                                            <DisclosurePanel
                                                title="Workbook and sheet details"
                                                summary="Keep metadata, notes, and worksheet settings available without crowding the grid."
                                                badge="Details"
                                                defaultOpen
                                                compact
                                            >
                                                <div className="workpaper-details-form">
                                                    <label className="workpaper-details-form__field">
                                                        <span className="app-helper text-xs">Workbook title</span>
                                                        <input
                                                            value={draftWorkbook.title}
                                                            onChange={(event) =>
                                                                mutateWorkbook(
                                                                    (current) => ({
                                                                        ...current,
                                                                        title: event.target.value,
                                                                    }),
                                                                    "Updated workbook title."
                                                                )
                                                            }
                                                            className="workpaper-details-form__input"
                                                        />
                                                    </label>
                                                    <label className="workpaper-details-form__field">
                                                        <span className="app-helper text-xs">Topic / track</span>
                                                        <input
                                                            value={draftWorkbook.topic}
                                                            onChange={(event) =>
                                                                mutateWorkbook(
                                                                    (current) => ({
                                                                        ...current,
                                                                        topic: event.target.value,
                                                                    }),
                                                                    "Updated workbook topic."
                                                                )
                                                            }
                                                            className="workpaper-details-form__input"
                                                        />
                                                    </label>
                                                    <label className="workpaper-details-form__field workpaper-details-form__field--wide">
                                                        <span className="app-helper text-xs">Workbook description</span>
                                                        <textarea
                                                            value={draftWorkbook.description}
                                                            onChange={(event) =>
                                                                mutateWorkbook(
                                                                    (current) => ({
                                                                        ...current,
                                                                        description: event.target.value,
                                                                    }),
                                                                    "Updated workbook description."
                                                                )
                                                            }
                                                            rows={3}
                                                            className="workpaper-details-form__input"
                                                        />
                                                    </label>
                                                    <label className="workpaper-details-form__field">
                                                        <span className="app-helper text-xs">Sheet title</span>
                                                        <input
                                                            value={activeSheet.title}
                                                            onChange={(event) =>
                                                                mutateActiveSheet(
                                                                    (sheet) => ({
                                                                        ...sheet,
                                                                        title: event.target.value,
                                                                    }),
                                                                    "Updated sheet title."
                                                                )
                                                            }
                                                            className="workpaper-details-form__input"
                                                        />
                                                    </label>
                                                    <label className="workpaper-details-form__field">
                                                        <span className="app-helper text-xs">Cell note</span>
                                                        <input
                                                            value={cellNoteDraft}
                                                            onChange={(event) => setCellNoteDraft(event.target.value)}
                                                            onBlur={() => commitCellDraft({ staySelected: true })}
                                                            className="workpaper-details-form__input"
                                                        />
                                                    </label>
                                                    <label className="workpaper-details-form__field workpaper-details-form__field--wide">
                                                        <span className="app-helper text-xs">Sheet note</span>
                                                        <textarea
                                                            value={activeSheet.note ?? ""}
                                                            onChange={(event) =>
                                                                mutateActiveSheet(
                                                                    (sheet) => ({
                                                                        ...sheet,
                                                                        note: event.target.value,
                                                                    }),
                                                                    "Updated sheet note."
                                                                )
                                                            }
                                                            rows={4}
                                                            className="workpaper-details-form__input"
                                                        />
                                                    </label>
                                                </div>
                                            </DisclosurePanel>

                                            <div className="workpaper-side-stack">
                                                <DisclosurePanel
                                                    title="Current worksheet"
                                                    summary="Keep traceability nearby without letting it dominate the editor."
                                                    badge={selectedRangeLabel}
                                                    defaultOpen
                                                    compact
                                                >
                                                    <div className="space-y-3">
                                                        <div className="workpaper-card">
                                                            <p className="app-helper text-xs">Display</p>
                                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                                {formatDisplayValue(
                                                                    liveCellPreview?.display || "Blank cell",
                                                                    selectedCellStyle
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="workpaper-card">
                                                            <p className="app-helper text-xs">Workbook timestamps</p>
                                                            <p className="text-sm text-[color:var(--app-text)]">
                                                                Created {formatDate(draftWorkbook.createdAt)}
                                                            </p>
                                                            <p className="app-helper mt-1 text-xs">
                                                                Updated {formatDate(draftWorkbook.updatedAt)}
                                                            </p>
                                                        </div>
                                                        {activeSheet.sources.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {activeSheet.sources.map((source) => (
                                                                    <div key={source.id} className="workpaper-card">
                                                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                                            {source.title}
                                                                        </p>
                                                                        <p className="app-helper mt-1 text-xs">
                                                                            {source.kind} | {formatDate(source.capturedAt)}
                                                                        </p>
                                                                        <p className="app-body-md mt-2 text-sm">
                                                                            {source.summary}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="app-helper text-xs">
                                                                No traceability links are attached to this sheet yet.
                                                            </p>
                                                        )}
                                                    </div>
                                                </DisclosurePanel>

                                                <RelatedLinksPanel
                                                    title="Related workflows"
                                                    summary="Jump from this sheet into the matching calculator or lesson."
                                                    items={relatedItems}
                                                    badge={relatedItems.length ? `${relatedItems.length} links` : undefined}
                                                    compact
                                                />
                                            </div>
                                        </div>
                                    ) : null}
                                </section>
                            ) : null}
                        </>
                    ) : null}
                </div>
            ) : (
                <section className="workpaper-empty-state">
                    <div className="workpaper-empty-state__intro">
                        <p className="workpaper-empty-state__kicker">Start working</p>
                        <h2>Create, open, or import a workbook</h2>
                        <p className="app-body-md">
                            Workpaper Studio is built for direct worksheet editing first. Start blank,
                            open a template, or bring in a spreadsheet file and keep the rest of the app
                            connected in the background.
                        </p>
                    </div>
                    <div className="workpaper-empty-state__guide">
                        <span className="workpaper-inline-guide__chip">Type values directly</span>
                        <span className="workpaper-inline-guide__chip">Start formulas with =</span>
                        <span className="workpaper-inline-guide__chip">Try =SUM(A1:A5)</span>
                        <span className="workpaper-inline-guide__chip">Use templates for schedules</span>
                    </div>
                    <div className="workpaper-empty-state__actions">
                        <button
                            type="button"
                            onClick={createBlankWorkbook}
                            className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            Create workbook
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            Import workbook
                        </button>
                    </div>
                    {library.recentWorkbookIds.length > 0 ? (
                        <div className="workpaper-card-grid">
                            {library.recentWorkbookIds.slice(0, 4).map((workbookId) => {
                                const workbook = library.workbooks[workbookId];
                                if (!workbook) return null;
                                return (
                                    <button
                                        key={workbook.id}
                                        type="button"
                                        onClick={() =>
                                            startTransition(() => setSelectedWorkbookId(workbook.id))
                                        }
                                        className="workpaper-card-button"
                                    >
                                        <strong>{workbook.title}</strong>
                                        <span className="app-helper text-xs">
                                            {workbook.topic} | {workbook.sheetOrder.length} sheets
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}
                    <div className="workpaper-card-grid">
                        {WORKPAPER_TEMPLATES.slice(0, 4).map((template) => (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => openTemplateWorkbook(template)}
                                className="workpaper-card-button"
                            >
                                <strong>{template.title}</strong>
                                <span className="app-helper text-xs">{template.description}</span>
                            </button>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
