import * as XLSX from "xlsx";
import type {
    WorkpaperCellStyle,
    WorkpaperCellRecord,
    WorkpaperWorkbook,
} from "./workpaperTypes.js";
import {
    createCell,
    createEmptySheet,
    createWorkbook,
    formatDisplayValue,
    getCellKey,
    resolveWorkpaperCellStyle,
    splitCellKey,
    toColumnLabel,
} from "./workpaperUtils.js";
import { evaluateCellInput } from "./workpaperFormula.js";

export type WorkpaperFileActionResult = {
    fileName: string;
    method: "file-picker" | "download";
};

function getWorkbookFileName(title: string, extension: "xlsx" | "csv") {
    const baseName = title.trim() || "accalc-workpaper";
    const safeName = baseName.replace(/[<>:"/\\|?*\u0000-\u001F]+/g, "-");
    return `${safeName}.${extension}`;
}

async function saveBlobWithFallback(
    blob: Blob,
    fileName: string,
    mimeType: string
): Promise<WorkpaperFileActionResult> {
    const picker = (window as typeof window & {
        showSaveFilePicker?: (options: {
            suggestedName: string;
            types: Array<{ description: string; accept: Record<string, string[]> }>;
        }) => Promise<{
            createWritable: () => Promise<{
                write: (data: Blob) => Promise<void>;
                close: () => Promise<void>;
            }>;
        }>;
    }).showSaveFilePicker;

    if (picker) {
        try {
            const handle = await picker({
                suggestedName: fileName,
                types: [
                    {
                        description: "AccCalc workpaper export",
                        accept: { [mimeType]: [`.${fileName.split(".").pop() ?? "xlsx"}`] },
                    },
                ],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            return { fileName, method: "file-picker" };
        } catch {
            // Fall back to a download link when the picker is unsupported or cancelled.
        }
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
    return { fileName, method: "download" };
}

function workbookToXlsxBinary(workbook: WorkpaperWorkbook) {
    const xlsxWorkbook = XLSX.utils.book_new();

    workbook.sheetOrder.forEach((sheetId) => {
        const sheet = workbook.sheets[sheetId];
        if (!sheet) return;

        const aoa = Array.from({ length: sheet.rowCount }, () =>
            Array.from({ length: sheet.columnCount }, () => "")
        );
        const xlsxSheet = XLSX.utils.aoa_to_sheet(aoa);
        xlsxSheet["!cols"] = Array.from({ length: sheet.columnCount }, () => ({ wch: 14 }));

        for (const [cellKey, cell] of Object.entries(sheet.cells)) {
            const { rowIndex, columnIndex } = splitCellKey(cellKey);
            const address = `${toColumnLabel(columnIndex)}${rowIndex + 1}`;
            const evaluated = evaluateCellInput(workbook, sheetId, cell.input);
            const resolvedStyle = resolveWorkpaperCellStyle(cell.style);
            const xlsxStyle = cell.style
                ? {
                      font: {
                          bold: resolvedStyle.bold,
                          italic: resolvedStyle.italic,
                          color: resolvedStyle.effectiveTextColor
                              ? {
                                    rgb: resolvedStyle.effectiveTextColor
                                        .replace("#", "")
                                        .toUpperCase(),
                                }
                              : undefined,
                      },
                      fill: resolvedStyle.fillColor
                          ? {
                                patternType: "solid",
                                fgColor: {
                                    rgb: resolvedStyle.fillColor.replace("#", "").toUpperCase(),
                                },
                            }
                          : undefined,
                      alignment: resolvedStyle.textAlign
                          ? { horizontal: resolvedStyle.textAlign }
                          : undefined,
                      numFmt:
                          resolvedStyle.numberFormat === "number"
                              ? "0.00"
                              : resolvedStyle.numberFormat === "percentage"
                                ? "0.00%"
                                : resolvedStyle.numberFormat === "currency"
                                  ? '"₱"#,##0.00'
                                  : resolvedStyle.numberFormat === "accounting"
                                    ? '_("₱"* #,##0.00_);_("₱"* (#,##0.00);_("₱"* "-"??_);_(@_)'
                                    : resolvedStyle.numberFormat === "date"
                                      ? "yyyy-mm-dd"
                                      : undefined,
                  }
                : undefined;

            if (cell.input.trim().startsWith("=")) {
                XLSX.utils.sheet_add_aoa(xlsxSheet, [[evaluated.value]], {
                    origin: address,
                });
                const targetCell = xlsxSheet[address];
                if (targetCell) {
                    targetCell.f = cell.input.trim().slice(1);
                    if (xlsxStyle) {
                        targetCell.s = xlsxStyle;
                    }
                }
            } else {
                XLSX.utils.sheet_add_aoa(xlsxSheet, [[evaluated.value]], {
                    origin: address,
                });
                const targetCell = xlsxSheet[address];
                if (targetCell && xlsxStyle) {
                    targetCell.s = xlsxStyle;
                }
            }
        }

        XLSX.utils.book_append_sheet(xlsxWorkbook, xlsxSheet, sheet.title);
    });

    return XLSX.write(xlsxWorkbook, {
        type: "array",
        bookType: "xlsx",
    });
}

export async function exportWorkbookAsXlsx(workbook: WorkpaperWorkbook) {
    const binary = workbookToXlsxBinary(workbook);
    const blob = new Blob([binary], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return saveBlobWithFallback(
        blob,
        getWorkbookFileName(workbook.title, "xlsx"),
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
}

export async function exportSheetAsCsv(workbook: WorkpaperWorkbook, sheetId: string) {
    const sheet = workbook.sheets[sheetId];
    if (!sheet) return null;

    const rows = Array.from({ length: sheet.rowCount }, (_, rowIndex) =>
        Array.from({ length: sheet.columnCount }, (_, columnIndex) => {
            const cell = sheet.cells[getCellKey(rowIndex, columnIndex)];
            const input = cell?.input ?? "";
            return formatDisplayValue(
                evaluateCellInput(workbook, sheetId, input).display,
                cell?.style
            );
        })
    );

    const xlsxSheet = XLSX.utils.aoa_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(xlsxSheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

    return saveBlobWithFallback(
        blob,
        getWorkbookFileName(`${workbook.title}-${sheet.title}`, "csv"),
        "text/csv"
    );
}

function valueToInput(value: XLSX.CellObject | undefined) {
    if (!value) return "";
    if (typeof value.f === "string" && value.f.trim()) {
        return `=${value.f}`;
    }
    if (value.v === undefined || value.v === null) return "";
    return String(value.v);
}

function normalizeImportedColor(value: unknown) {
    if (typeof value !== "string") return undefined;
    const normalized = value.replace(/^FF/i, "#").replace(/^#/i, "#");
    if (/^#[0-9A-F]{6}$/i.test(normalized)) {
        return normalized.toUpperCase();
    }
    return undefined;
}

function extractImportedStyle(value: XLSX.CellObject | undefined) {
    const rawStyle = (value as XLSX.CellObject & { s?: Record<string, unknown> } | undefined)?.s;
    if (!rawStyle || typeof rawStyle !== "object") return undefined;

    const font = rawStyle.font as Record<string, unknown> | undefined;
    const fill = rawStyle.fill as Record<string, unknown> | undefined;
    const alignment = rawStyle.alignment as Record<string, unknown> | undefined;
        const style: WorkpaperCellStyle = {
            fillColor: normalizeImportedColor(
                (fill?.fgColor as Record<string, unknown> | undefined)?.rgb
            ),
        textColor: normalizeImportedColor(
            (font?.color as Record<string, unknown> | undefined)?.rgb
        ),
        bold: typeof font?.bold === "boolean" ? font.bold : undefined,
        italic: typeof font?.italic === "boolean" ? font.italic : undefined,
        textAlign:
            alignment?.horizontal === "left" ||
            alignment?.horizontal === "center" ||
            alignment?.horizontal === "right"
                ? alignment.horizontal
                : undefined,
        numberFormat:
            typeof rawStyle.numFmt === "string"
                ? rawStyle.numFmt.includes("%")
                    ? "percentage"
                    : rawStyle.numFmt.includes("₱")
                      ? rawStyle.numFmt.includes("_(")
                          ? "accounting"
                          : "currency"
                      : rawStyle.numFmt.toLowerCase().includes("yy")
                        ? "date"
                        : rawStyle.numFmt.includes("0.00")
                          ? "number"
                          : undefined
                : undefined,
    };

    return Object.values(style).some((entry) => entry !== undefined) ? style : undefined;
}

export async function importWorkbookFile(file: File) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, {
        type: "array",
        cellFormula: true,
        cellDates: false,
        cellStyles: true,
    });

    const sheets = workbook.SheetNames.map((sheetName) => {
        const xlsxSheet = workbook.Sheets[sheetName];
        const ref = xlsxSheet["!ref"] ?? "A1:A1";
        const range = XLSX.utils.decode_range(ref);
        const cells: WorkpaperCellRecord = {};

        for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex += 1) {
            for (let columnIndex = range.s.c; columnIndex <= range.e.c; columnIndex += 1) {
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex });
                const xlsxCell = xlsxSheet[cellAddress];
                const input = valueToInput(xlsxCell);
                const style = extractImportedStyle(xlsxCell);
                if (input !== "" || style) {
                    cells[getCellKey(rowIndex, columnIndex)] = createCell(input, undefined, style);
                }
            }
        }

        return createEmptySheet({
            title: sheetName,
            kind: "imported",
            rowCount: range.e.r + 1,
            columnCount: range.e.c + 1,
            cells,
            note: `Imported from ${file.name}.`,
            sources: [
                {
                    id: `import-${Date.now()}-${sheetName}`,
                    kind: "import",
                    title: file.name,
                    summary: `Imported worksheet ${sheetName}.`,
                    capturedAt: Date.now(),
                },
            ],
        });
    });

    return createWorkbook({
        title: file.name.replace(/\.[^.]+$/, ""),
        description: `Imported from ${file.name}`,
        topic: "Imported",
        sheets: sheets.length ? sheets : [createEmptySheet({ title: "Imported Sheet" })],
    });
}
