export const DEFAULT_WORKPAPER_ROW_COUNT = 24;
export const DEFAULT_WORKPAPER_COLUMN_COUNT = 8;
const DEFAULT_DARK_CELL_TEXT = "#0F172A";
const DEFAULT_LIGHT_CELL_TEXT = "#F8FAFC";
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
export function createCell(input = "", note, style) {
    return { input, note, style };
}
function normalizeHexColor(value) {
    const normalized = value?.trim();
    if (!normalized)
        return undefined;
    const compact = normalized.startsWith("#") ? normalized : `#${normalized}`;
    if (/^#[0-9a-f]{3}$/i.test(compact)) {
        return `#${compact
            .slice(1)
            .split("")
            .map((char) => char + char)
            .join("")
            .toUpperCase()}`;
    }
    if (/^#[0-9a-f]{6}$/i.test(compact)) {
        return compact.toUpperCase();
    }
    return undefined;
}
function hexToRgb(hex) {
    const normalized = normalizeHexColor(hex);
    if (!normalized)
        return null;
    return {
        red: Number.parseInt(normalized.slice(1, 3), 16),
        green: Number.parseInt(normalized.slice(3, 5), 16),
        blue: Number.parseInt(normalized.slice(5, 7), 16),
    };
}
function toLinearChannel(channel) {
    const normalized = channel / 255;
    return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
}
function getRelativeLuminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb)
        return 0;
    return (0.2126 * toLinearChannel(rgb.red) +
        0.7152 * toLinearChannel(rgb.green) +
        0.0722 * toLinearChannel(rgb.blue));
}
export function getReadableTextColor(fillColor) {
    const normalizedFill = normalizeHexColor(fillColor);
    if (!normalizedFill)
        return undefined;
    return getRelativeLuminance(normalizedFill) > 0.55
        ? DEFAULT_DARK_CELL_TEXT
        : DEFAULT_LIGHT_CELL_TEXT;
}
export function resolveWorkpaperCellStyle(style) {
    const fillColor = normalizeHexColor(style?.fillColor);
    const textColor = normalizeHexColor(style?.textColor);
    const effectiveTextColor = textColor ?? getReadableTextColor(fillColor);
    return {
        fillColor,
        textColor,
        effectiveTextColor,
        bold: style?.bold,
        italic: style?.italic,
        textAlign: style?.textAlign,
        numberFormat: style?.numberFormat,
    };
}
export function createSelectionRange(anchor, focus) {
    return {
        startRow: Math.min(anchor.rowIndex, focus.rowIndex),
        endRow: Math.max(anchor.rowIndex, focus.rowIndex),
        startColumn: Math.min(anchor.columnIndex, focus.columnIndex),
        endColumn: Math.max(anchor.columnIndex, focus.columnIndex),
    };
}
export function isCellWithinRange(range, rowIndex, columnIndex) {
    return (rowIndex >= range.startRow &&
        rowIndex <= range.endRow &&
        columnIndex >= range.startColumn &&
        columnIndex <= range.endColumn);
}
export function getRangeCellKeys(range) {
    const keys = [];
    for (let rowIndex = range.startRow; rowIndex <= range.endRow; rowIndex += 1) {
        for (let columnIndex = range.startColumn; columnIndex <= range.endColumn; columnIndex += 1) {
            keys.push(getCellKey(rowIndex, columnIndex));
        }
    }
    return keys;
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
        freezeRows: options?.freezeRows,
        freezeColumns: options?.freezeColumns,
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
        cells: Object.fromEntries(Object.entries(sheet.cells).map(([key, cell]) => [
            key,
            { ...cell, style: cell.style ? { ...cell.style } : undefined },
        ])),
        freezeRows: sheet.freezeRows,
        freezeColumns: sheet.freezeColumns,
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
    const existingStyle = nextCells[key]?.style;
    if (!input.trim() && !note?.trim()) {
        delete nextCells[key];
    }
    else {
        nextCells[key] = {
            input,
            note: note?.trim() ? note : undefined,
            style: existingStyle,
        };
    }
    return {
        ...sheet,
        cells: nextCells,
        updatedAt: Date.now(),
    };
}
export function setSheetCellStyle(sheet, rowIndex, columnIndex, stylePatch) {
    const key = getCellKey(rowIndex, columnIndex);
    const existingCell = sheet.cells[key];
    const nextCells = { ...sheet.cells };
    const nextStyle = {
        ...(existingCell?.style ?? {}),
        ...stylePatch,
    };
    const cleanedStyle = Object.fromEntries(Object.entries(nextStyle).filter(([, value]) => value !== undefined && value !== ""));
    if (!existingCell) {
        nextCells[key] = {
            input: "",
            style: Object.keys(cleanedStyle).length ? cleanedStyle : undefined,
        };
    }
    else {
        nextCells[key] = {
            ...existingCell,
            style: Object.keys(cleanedStyle).length ? cleanedStyle : undefined,
        };
    }
    return {
        ...sheet,
        cells: nextCells,
        updatedAt: Date.now(),
    };
}
export function applyStyleToRange(sheet, range, stylePatch) {
    let nextSheet = sheet;
    for (let rowIndex = range.startRow; rowIndex <= range.endRow; rowIndex += 1) {
        for (let columnIndex = range.startColumn; columnIndex <= range.endColumn; columnIndex += 1) {
            nextSheet = setSheetCellStyle(nextSheet, rowIndex, columnIndex, stylePatch);
        }
    }
    return nextSheet;
}
export function clearRangeCells(sheet, range) {
    let nextSheet = sheet;
    for (let rowIndex = range.startRow; rowIndex <= range.endRow; rowIndex += 1) {
        for (let columnIndex = range.startColumn; columnIndex <= range.endColumn; columnIndex += 1) {
            nextSheet = setSheetCell(nextSheet, rowIndex, columnIndex, "");
        }
    }
    return nextSheet;
}
function translateFormulaReference(reference, rowOffset, columnOffset) {
    const match = /^(\$?)([A-Z]+)(\$?)(\d+)$/i.exec(reference);
    if (!match)
        return reference;
    const [, columnFixed, label, rowFixed, rowValue] = match;
    const originalColumnIndex = fromColumnLabel(label);
    const originalRowIndex = Number(rowValue) - 1;
    const nextColumnIndex = columnFixed
        ? originalColumnIndex
        : Math.max(0, originalColumnIndex + columnOffset);
    const nextRowIndex = rowFixed ? originalRowIndex : Math.max(0, originalRowIndex + rowOffset);
    return `${columnFixed ? "$" : ""}${toColumnLabel(nextColumnIndex)}${rowFixed ? "$" : ""}${nextRowIndex + 1}`;
}
export function shiftFormulaReferences(input, rowOffset, columnOffset) {
    if (!input.trim().startsWith("="))
        return input;
    return input.replace(/\$?[A-Z]+\$?\d+/g, (reference) => translateFormulaReference(reference, rowOffset, columnOffset));
}
export function duplicateRangeToTarget(sheet, sourceRange, targetStart) {
    let nextSheet = sheet;
    for (let rowIndex = sourceRange.startRow; rowIndex <= sourceRange.endRow; rowIndex += 1) {
        for (let columnIndex = sourceRange.startColumn; columnIndex <= sourceRange.endColumn; columnIndex += 1) {
            const sourceKey = getCellKey(rowIndex, columnIndex);
            const sourceCell = sheet.cells[sourceKey];
            const targetRow = targetStart.rowIndex + (rowIndex - sourceRange.startRow);
            const targetColumn = targetStart.columnIndex + (columnIndex - sourceRange.startColumn);
            if (!sourceCell) {
                nextSheet = setSheetCell(nextSheet, targetRow, targetColumn, "");
                continue;
            }
            nextSheet = setSheetCell(nextSheet, targetRow, targetColumn, shiftFormulaReferences(sourceCell.input, targetRow - rowIndex, targetColumn - columnIndex), sourceCell.note);
            if (sourceCell.style) {
                nextSheet = setSheetCellStyle(nextSheet, targetRow, targetColumn, sourceCell.style);
            }
        }
    }
    return nextSheet;
}
export function insertRows(sheet, startRow, count = 1) {
    const nextCells = {};
    for (const [key, cell] of Object.entries(sheet.cells)) {
        const { rowIndex, columnIndex } = splitCellKey(key);
        const nextRowIndex = rowIndex >= startRow ? rowIndex + count : rowIndex;
        nextCells[getCellKey(nextRowIndex, columnIndex)] = cell;
    }
    return {
        ...sheet,
        rowCount: sheet.rowCount + count,
        cells: nextCells,
        updatedAt: Date.now(),
    };
}
export function deleteRows(sheet, startRow, count = 1) {
    const nextCells = {};
    for (const [key, cell] of Object.entries(sheet.cells)) {
        const { rowIndex, columnIndex } = splitCellKey(key);
        if (rowIndex >= startRow && rowIndex < startRow + count)
            continue;
        const nextRowIndex = rowIndex >= startRow + count ? rowIndex - count : rowIndex;
        nextCells[getCellKey(nextRowIndex, columnIndex)] = cell;
    }
    return {
        ...sheet,
        rowCount: Math.max(1, sheet.rowCount - count),
        cells: nextCells,
        updatedAt: Date.now(),
    };
}
export function insertColumns(sheet, startColumn, count = 1) {
    const nextCells = {};
    for (const [key, cell] of Object.entries(sheet.cells)) {
        const { rowIndex, columnIndex } = splitCellKey(key);
        const nextColumnIndex = columnIndex >= startColumn ? columnIndex + count : columnIndex;
        nextCells[getCellKey(rowIndex, nextColumnIndex)] = cell;
    }
    return {
        ...sheet,
        columnCount: sheet.columnCount + count,
        cells: nextCells,
        updatedAt: Date.now(),
    };
}
export function deleteColumns(sheet, startColumn, count = 1) {
    const nextCells = {};
    for (const [key, cell] of Object.entries(sheet.cells)) {
        const { rowIndex, columnIndex } = splitCellKey(key);
        if (columnIndex >= startColumn && columnIndex < startColumn + count)
            continue;
        const nextColumnIndex = columnIndex >= startColumn + count ? columnIndex - count : columnIndex;
        nextCells[getCellKey(rowIndex, nextColumnIndex)] = cell;
    }
    return {
        ...sheet,
        columnCount: Math.max(1, sheet.columnCount - count),
        cells: nextCells,
        updatedAt: Date.now(),
    };
}
function toSerializableValue(input) {
    if (input.trim().startsWith("="))
        return input;
    if (isNumericInput(input.trim()))
        return Number(input.trim());
    return input;
}
export function rangeToTabularData(sheet, range) {
    return Array.from({ length: range.endRow - range.startRow + 1 }, (_, rowOffset) => Array.from({ length: range.endColumn - range.startColumn + 1 }, (_, columnOffset) => {
        const key = getCellKey(range.startRow + rowOffset, range.startColumn + columnOffset);
        return sheet.cells[key]?.input ?? "";
    }));
}
export function tabularDataToRangeValues(rows) {
    return rows.map((row) => row.map((value) => toSerializableValue(value)));
}
export function formatDisplayValue(value, style) {
    const resolvedStyle = resolveWorkpaperCellStyle(style);
    const format = resolvedStyle.numberFormat ?? "general";
    if (format === "text" || format === "general")
        return value;
    const numericValue = Number(value);
    if (Number.isFinite(numericValue)) {
        if (format === "number") {
            return new Intl.NumberFormat(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numericValue);
        }
        if (format === "percentage") {
            return new Intl.NumberFormat(undefined, {
                style: "percent",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numericValue / 100);
        }
        if (format === "currency" || format === "accounting") {
            const formatted = new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "PHP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Math.abs(numericValue));
            return format === "accounting" && numericValue < 0 ? `(${formatted})` : formatted;
        }
    }
    if (format === "date") {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString();
        }
    }
    return value;
}
export function makeSourcesSummary(sources) {
    if (!sources.length)
        return "Manual workpaper";
    return sources.map((source) => source.title).join(" | ");
}
