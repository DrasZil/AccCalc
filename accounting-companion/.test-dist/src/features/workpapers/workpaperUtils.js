export const DEFAULT_WORKPAPER_ROW_COUNT = 24;
export const DEFAULT_WORKPAPER_COLUMN_COUNT = 8;
function randomId() {
    return Math.random().toString(16).slice(2, 10);
}
export function createWorkpaperId(prefix) {
    return `${prefix}-${Date.now()}-${randomId()}`;
}
export function getCellKey(rowIndex, columnIndex) {
    return `${columnIndex}:${rowIndex}`;
}
export function splitCellKey(key) {
    const [column, row] = key.split(":");
    return {
        columnIndex: Number(column),
        rowIndex: Number(row),
    };
}
export function toColumnLabel(columnIndex) {
    let current = columnIndex + 1;
    let label = "";
    while (current > 0) {
        const remainder = (current - 1) % 26;
        label = String.fromCharCode(65 + remainder) + label;
        current = Math.floor((current - 1) / 26);
    }
    return label;
}
export function fromColumnLabel(label) {
    let result = 0;
    for (const char of label.toUpperCase()) {
        if (char < "A" || char > "Z")
            return Number.NaN;
        result = result * 26 + (char.charCodeAt(0) - 64);
    }
    return result - 1;
}
export function getCellReference(rowIndex, columnIndex) {
    return `${toColumnLabel(columnIndex)}${rowIndex + 1}`;
}
export function createCell(input = "", note) {
    return { input, note };
}
export function createEmptySheet(options) {
    const now = Date.now();
    return {
        id: createWorkpaperId("sheet"),
        title: options?.title ?? "Sheet 1",
        kind: options?.kind ?? "grid",
        rowCount: options?.rowCount ?? DEFAULT_WORKPAPER_ROW_COUNT,
        columnCount: options?.columnCount ?? DEFAULT_WORKPAPER_COLUMN_COUNT,
        cells: options?.cells ?? {},
        note: options?.note,
        templateId: options?.templateId,
        sources: options?.sources ?? [],
        createdAt: now,
        updatedAt: now,
    };
}
export function createWorkbook(options) {
    const now = Date.now();
    const sheets = options?.sheets?.length
        ? options.sheets
        : [createEmptySheet({ title: "Sheet 1" })];
    const activeSheetId = sheets[0]?.id ?? createEmptySheet().id;
    return {
        id: createWorkpaperId("workbook"),
        title: options?.title ?? "Untitled workpaper",
        description: options?.description ?? "",
        topic: options?.topic ?? "General",
        createdAt: now,
        updatedAt: now,
        revision: 1,
        activeSheetId,
        sheetOrder: sheets.map((sheet) => sheet.id),
        sheets: Object.fromEntries(sheets.map((sheet) => [sheet.id, sheet])),
    };
}
export function cloneSheet(sheet, title) {
    const now = Date.now();
    return {
        ...sheet,
        id: createWorkpaperId("sheet"),
        title: title ?? `${sheet.title} Copy`,
        cells: Object.fromEntries(Object.entries(sheet.cells).map(([key, cell]) => [key, { ...cell }])),
        sources: sheet.sources.map((source) => ({ ...source })),
        createdAt: now,
        updatedAt: now,
    };
}
export function touchWorkbook(workbook) {
    return {
        ...workbook,
        updatedAt: Date.now(),
        revision: workbook.revision + 1,
    };
}
export function clampSheetDimension(value, fallback, max) {
    if (!Number.isFinite(value) || value < 1)
        return fallback;
    return Math.max(1, Math.min(max, Math.round(value)));
}
export function isNumericInput(input) {
    const normalized = input.trim();
    if (!normalized)
        return false;
    return /^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test(normalized);
}
export function cellInputToPrimitive(input) {
    const normalized = input.trim();
    if (!normalized)
        return "";
    if (normalized.toLowerCase() === "true")
        return true;
    if (normalized.toLowerCase() === "false")
        return false;
    if (isNumericInput(normalized))
        return Number(normalized);
    return normalized;
}
export function setSheetCell(sheet, rowIndex, columnIndex, input, note) {
    const key = getCellKey(rowIndex, columnIndex);
    const nextCells = { ...sheet.cells };
    if (!input.trim() && !note?.trim()) {
        delete nextCells[key];
    }
    else {
        nextCells[key] = {
            input,
            note: note?.trim() ? note : undefined,
        };
    }
    return {
        ...sheet,
        cells: nextCells,
        updatedAt: Date.now(),
    };
}
export function makeSourcesSummary(sources) {
    if (!sources.length)
        return "Manual workpaper";
    return sources.map((source) => source.title).join(" | ");
}
