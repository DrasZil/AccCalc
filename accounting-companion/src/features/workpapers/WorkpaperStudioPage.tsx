import {
    type KeyboardEvent as ReactKeyboardEvent,
    startTransition,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Link } from "react-router-dom";
import DisclosurePanel from "../../components/DisclosurePanel";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";
import { APP_VERSION } from "../../utils/appRelease";
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
} from "./workpaperFile.js";
import {
    getWorkpaperTemplate,
    WORKPAPER_TEMPLATES,
} from "./workpaperTemplates.js";
import type { WorkpaperSheet, WorkpaperWorkbook } from "./workpaperTypes.js";
import {
    clampSheetDimension,
    createEmptySheet,
    getCellKey,
    getCellReference,
    setSheetCell,
    splitCellKey,
    toColumnLabel,
} from "./workpaperUtils.js";

const MAX_ROWS = 120;
const MAX_COLUMNS = 26;

type WorkpaperPanelKey = "none" | "workbooks" | "transfers" | "templates" | "details";

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

export default function WorkpaperStudioPage() {
    const library = useWorkpaperLibrary();
    const [selectedWorkbookId, setSelectedWorkbookId] = useState<string | null>(
        () => library.recentWorkbookIds[0] ?? library.workbookOrder[0] ?? null
    );
    const [draftWorkbook, setDraftWorkbook] = useState<WorkpaperWorkbook | null>(null);
    const [selectedCellKey, setSelectedCellKey] = useState(getCellKey(0, 0));
    const [cellDraft, setCellDraft] = useState("");
    const [cellNoteDraft, setCellNoteDraft] = useState("");
    const [activePanel, setActivePanel] = useState<WorkpaperPanelKey>("none");
    const [statusMessage, setStatusMessage] = useState(
        "Select a cell and start typing. Workpapers autosave locally in the background."
    );
    const [importError, setImportError] = useState<string | null>(null);
    const [draftVersion, setDraftVersion] = useState(0);
    const [hasPendingDraftSave, setHasPendingDraftSave] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const activeInputRef = useRef<HTMLInputElement | null>(null);

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

    useEffect(() => {
        if (!activeSheet) return;
        setSelectedCellKey((current) => {
            const { rowIndex, columnIndex } = splitCellKey(current);
            return normalizeSelection(rowIndex, columnIndex, activeSheet);
        });
    }, [activeSheet]);

    useEffect(() => {
        setCellDraft(selectedCell?.input ?? "");
        setCellNoteDraft(selectedCell?.note ?? "");
    }, [selectedCell?.input, selectedCell?.note, selectedCellKey]);

    useEffect(() => {
        if (!draftWorkbook || !hasPendingDraftSave || !selectedWorkbookId) return;

        const timeout = window.setTimeout(() => {
            saveWorkbookSnapshot(draftWorkbook);
            setHasPendingDraftSave(false);
            setStatusMessage(`Autosaved ${draftWorkbook.title} at ${new Date().toLocaleTimeString()}.`);
        }, 420);

        return () => window.clearTimeout(timeout);
    }, [draftVersion, draftWorkbook, hasPendingDraftSave, selectedWorkbookId]);

    const evaluatedCells = useMemo(
        () =>
            draftWorkbook && activeSheet
                ? buildSheetValueMap(draftWorkbook, activeSheet.id)
                : {},
        [draftWorkbook, activeSheet]
    );

    const formulaCoverage = activeSheet
        ? describeSheetFormulaCoverage(activeSheet)
        : { formulas: 0, values: 0 };
    const lastUsedRow = activeSheet ? getLastUsedRowIndex(activeSheet) : -1;
    const activeTemplate = activeSheet?.templateId
        ? getWorkpaperTemplate(activeSheet.templateId)
        : null;

    function markDirty(message?: string) {
        setDraftVersion((current) => current + 1);
        setHasPendingDraftSave(true);
        if (message) setStatusMessage(message);
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

    function selectCell(nextCellKey: string) {
        commitCellDraft();
        setSelectedCellKey(nextCellKey);
        window.requestAnimationFrame(() => activeInputRef.current?.focus());
    }

    function moveSelection(rowOffset: number, columnOffset: number) {
        if (!activeSheet) return;
        selectCell(
            normalizeSelection(
                selectedCellCoords.rowIndex + rowOffset,
                selectedCellCoords.columnIndex + columnOffset,
                activeSheet
            )
        );
    }

    function handleEditorNavigation(event: ReactKeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault();
            commitCellDraft({ staySelected: true });
            moveSelection(1, 0);
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
        try {
            const importedWorkbook = await importWorkbookFile(file);
            saveWorkbookSnapshot(importedWorkbook);
            startTransition(() => setSelectedWorkbookId(importedWorkbook.id));
            setStatusMessage(`Imported ${file.name} into Workpaper Studio.`);
        } catch (error) {
            setImportError(
                error instanceof Error
                    ? error.message
                    : "That file could not be imported into Workpaper Studio."
            );
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

    const selectedCellReference = getCellReference(
        selectedCellCoords.rowIndex,
        selectedCellCoords.columnIndex
    );
    const selectedCellEvaluated = evaluatedCells[selectedCellKey];
    const liveCellPreview = useMemo(() => {
        if (!draftWorkbook || !activeSheet) return selectedCellEvaluated;
        const nextSheet = setSheetCell(
            activeSheet,
            selectedCellCoords.rowIndex,
            selectedCellCoords.columnIndex,
            cellDraft,
            cellNoteDraft
        );

        const previewWorkbook = {
            ...draftWorkbook,
            sheets: {
                ...draftWorkbook.sheets,
                [activeSheet.id]: nextSheet,
            },
        };

        return evaluateCellInput(previewWorkbook, activeSheet.id, cellDraft);
    }, [
        activeSheet,
        cellDraft,
        cellNoteDraft,
        draftWorkbook,
        selectedCellCoords.columnIndex,
        selectedCellCoords.rowIndex,
        selectedCellEvaluated,
    ]);

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
        <div className="app-page-shell-wide workpaper-studio-page">
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
                            Open a workbook, tap a cell, and keep the supporting tools nearby instead
                            of in the way.
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
                                <span className="app-chip rounded-full px-3 py-1 text-xs">
                                    {draftWorkbook.topic || "General"}
                                </span>
                                <span className="workpaper-toolbar__status">{statusMessage}</span>
                            </div>
                        </div>

                        <div className="workpaper-toolbar__actions">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="app-button-secondary rounded-xl px-3.5 py-2 text-sm font-semibold"
                            >
                                Import
                            </button>
                            <button
                                type="button"
                                onClick={() => void exportWorkbookAsXlsx(draftWorkbook)}
                                className="app-button-secondary rounded-xl px-3.5 py-2 text-sm font-semibold"
                            >
                                Export XLSX
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    activeSheet
                                        ? void exportSheetAsCsv(draftWorkbook, activeSheet.id)
                                        : undefined
                                }
                                disabled={!activeSheet}
                                className="app-button-ghost rounded-xl px-3.5 py-2 text-sm font-semibold"
                            >
                                Export CSV
                            </button>
                            <button
                                type="button"
                                onClick={() =>
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
                                    }, "Added a new sheet.")
                                }
                                className="app-button-ghost rounded-xl px-3.5 py-2 text-sm font-semibold"
                            >
                                Add sheet
                            </button>
                        </div>
                    </section>

                    {importError ? (
                        <p className="rounded-xl px-3 py-2 text-sm app-tone-warning">
                            {importError}
                        </p>
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
                                    onClick={() =>
                                        selectedWorkbookId
                                            ? duplicateSheetIntoWorkbook(selectedWorkbookId, activeSheet.id)
                                            : undefined
                                    }
                                    className="app-button-ghost rounded-xl px-3 py-1.5 text-xs font-semibold"
                                >
                                    Duplicate
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        mutateWorkbook((current) => {
                                            const currentIndex = current.sheetOrder.indexOf(activeSheet.id);
                                            if (currentIndex <= 0) return current;
                                            const nextOrder = [...current.sheetOrder];
                                            [nextOrder[currentIndex - 1], nextOrder[currentIndex]] = [
                                                nextOrder[currentIndex],
                                                nextOrder[currentIndex - 1],
                                            ];
                                            return { ...current, sheetOrder: nextOrder };
                                        }, "Moved the active sheet left.")
                                    }
                                    className="app-button-ghost rounded-xl px-3 py-1.5 text-xs font-semibold"
                                >
                                    Move left
                                </button>
                            </div>
                        ) : null}
                    </section>

                    {activeSheet ? (
                        <>
                            <section className="workpaper-formula-bar">
                                <div className="workpaper-formula-bar__cell">{selectedCellReference}</div>
                                <input
                                    ref={activeInputRef}
                                    value={cellDraft}
                                    onChange={(event) => setCellDraft(event.target.value)}
                                    onBlur={() => commitCellDraft({ staySelected: true })}
                                    onKeyDown={handleEditorNavigation}
                                    placeholder="Type a value or start a formula with ="
                                    className="workpaper-formula-bar__input"
                                />
                                <span
                                    className={[
                                        "workpaper-formula-bar__mode",
                                        cellDraft.trim().startsWith("=")
                                            ? "workpaper-formula-bar__mode--formula"
                                            : "",
                                    ].join(" ")}
                                >
                                    {cellDraft.trim().startsWith("=") ? "Formula" : "Value"}
                                </span>
                            </section>

                            <section className="workpaper-grid-shell">
                                <div className="workpaper-grid-shell__header">
                                    <div className="min-w-0">
                                        <h2 className="workpaper-grid-shell__title">{activeSheet.title}</h2>
                                        <p className="workpaper-grid-shell__subtitle">
                                            {formulaCoverage.values} value cells, {formulaCoverage.formulas} formula
                                            cells, last used row {lastUsedRow >= 0 ? lastUsedRow + 1 : "none"}.
                                        </p>
                                    </div>
                                    <div className="workpaper-grid-shell__header-actions">
                                        <button
                                            type="button"
                                            onClick={() =>
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
                                                )
                                            }
                                            className="app-button-ghost rounded-xl px-3 py-1.5 text-xs font-semibold"
                                        >
                                            Rows
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
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
                                                )
                                            }
                                            className="app-button-ghost rounded-xl px-3 py-1.5 text-xs font-semibold"
                                        >
                                            Columns
                                        </button>
                                    </div>
                                </div>

                                <div className="workpaper-grid scrollbar-premium">
                                    <table className="workpaper-grid__table">
                                        <thead>
                                            <tr>
                                                <th className="workpaper-grid__corner">#</th>
                                                {Array.from({ length: activeSheet.columnCount }, (_, columnIndex) => (
                                                    <th key={columnIndex} className="workpaper-grid__colhead">
                                                        {toColumnLabel(columnIndex)}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.from({ length: activeSheet.rowCount }, (_, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <th className="workpaper-grid__rowhead">{rowIndex + 1}</th>
                                                    {Array.from(
                                                        { length: activeSheet.columnCount },
                                                        (_, columnIndex) => {
                                                            const cellKey = getCellKey(rowIndex, columnIndex);
                                                            const cell = activeSheet.cells[cellKey];
                                                            const evaluated = evaluatedCells[cellKey];
                                                            const isSelected = cellKey === selectedCellKey;

                                                            return (
                                                                <td key={cellKey} className="workpaper-grid__cell-wrap">
                                                                    {isSelected ? (
                                                                        <div className="workpaper-grid__cell workpaper-grid__cell--selected">
                                                                            <input
                                                                                value={cellDraft}
                                                                                onChange={(event) =>
                                                                                    setCellDraft(event.target.value)
                                                                                }
                                                                                onBlur={() =>
                                                                                    commitCellDraft({
                                                                                        staySelected: true,
                                                                                    })
                                                                                }
                                                                                onKeyDown={(event) => {
                                                                                    if (event.key === "Enter" || event.key === "Tab") {
                                                                                        handleEditorNavigation(event);
                                                                                    }
                                                                                }}
                                                                                className="workpaper-grid__editor"
                                                                            />
                                                                            <span className="workpaper-grid__preview">
                                                                                {cellDraft.trim().startsWith("=")
                                                                                    ? liveCellPreview?.display ?? ""
                                                                                    : ""}
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => selectCell(cellKey)}
                                                                            className="workpaper-grid__cell"
                                                                        >
                                                                            <span className="workpaper-grid__display">
                                                                                {evaluated?.display || cell?.input || ""}
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
                                {panelButtons.map((panel) => (
                                    <button
                                        key={panel.key}
                                        type="button"
                                        onClick={() =>
                                            setActivePanel((current) =>
                                                current === panel.key ? "none" : panel.key
                                            )
                                        }
                                        className={[
                                            "workpaper-panel-strip__button",
                                            activePanel === panel.key
                                                ? "workpaper-panel-strip__button--active"
                                                : "",
                                        ].join(" ")}
                                    >
                                        {panel.label}
                                        {typeof panel.count === "number" ? (
                                            <span className="workpaper-panel-strip__count">
                                                {panel.count}
                                            </span>
                                        ) : null}
                                    </button>
                                ))}
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
                                                                            `Created a new workbook from ${transfer.source.title}.`
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
                                                                            onClick={() =>
                                                                                appendTransferToWorkbook(
                                                                                    selectedWorkbookId,
                                                                                    transfer
                                                                                )
                                                                            }
                                                                            className="app-button-secondary rounded-xl px-3.5 py-2 text-sm font-semibold"
                                                                        >
                                                                            Add as sheet
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                appendTransferRowsToActiveSheet(
                                                                                    selectedWorkbookId,
                                                                                    transfer
                                                                                )
                                                                            }
                                                                            className="app-button-ghost rounded-xl px-3.5 py-2 text-sm font-semibold"
                                                                        >
                                                                            Append to sheet
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
                                            <div className="workpaper-card-grid">
                                                {WORKPAPER_TEMPLATES.map((template) => (
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
                                                            onClick={() => {
                                                                const workbook = template.buildWorkbook();
                                                                saveWorkbookSnapshot(workbook);
                                                                startTransition(() =>
                                                                    setSelectedWorkbookId(workbook.id)
                                                                );
                                                                setStatusMessage(
                                                                    `Opened ${template.title} from templates.`
                                                                );
                                                            }}
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
                                                    badge={selectedCellReference}
                                                    defaultOpen
                                                    compact
                                                >
                                                    <div className="space-y-3">
                                                        <div className="workpaper-card">
                                                            <p className="app-helper text-xs">Display</p>
                                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                                {liveCellPreview?.display || "Blank cell"}
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
                    <div className="workpaper-card-grid">
                        {WORKPAPER_TEMPLATES.slice(0, 4).map((template) => (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => {
                                    const workbook = template.buildWorkbook();
                                    saveWorkbookSnapshot(workbook);
                                    startTransition(() => setSelectedWorkbookId(workbook.id));
                                    setStatusMessage(`Opened ${template.title} from templates.`);
                                }}
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
