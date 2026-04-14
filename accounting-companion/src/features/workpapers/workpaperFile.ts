import * as XLSX from "xlsx";
import type {
    WorkpaperCellRecord,
    WorkpaperWorkbook,
} from "./workpaperTypes.js";
import {
    createCell,
    createEmptySheet,
    createWorkbook,
    getCellKey,
    splitCellKey,
    toColumnLabel,
} from "./workpaperUtils.js";
import { evaluateCellInput } from "./workpaperFormula.js";

function getWorkbookFileName(title: string, extension: "xlsx" | "csv") {
    const baseName = title.trim() || "accalc-workpaper";
    const safeName = baseName.replace(/[<>:"/\\|?*\u0000-\u001F]+/g, "-");
    return `${safeName}.${extension}`;
}

async function saveBlobWithFallback(blob: Blob, fileName: string, mimeType: string) {
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
            return;
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

        for (const [cellKey, cell] of Object.entries(sheet.cells)) {
            const { rowIndex, columnIndex } = splitCellKey(cellKey);
            const address = `${toColumnLabel(columnIndex)}${rowIndex + 1}`;
            const evaluated = evaluateCellInput(workbook, sheetId, cell.input);

            if (cell.input.trim().startsWith("=")) {
                XLSX.utils.sheet_add_aoa(xlsxSheet, [[evaluated.value]], {
                    origin: address,
                });
                const targetCell = xlsxSheet[address];
                if (targetCell) {
                    targetCell.f = cell.input.trim().slice(1);
                }
            } else {
                XLSX.utils.sheet_add_aoa(xlsxSheet, [[evaluated.value]], {
                    origin: address,
                });
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

    await saveBlobWithFallback(
        blob,
        getWorkbookFileName(workbook.title, "xlsx"),
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
}

export async function exportSheetAsCsv(workbook: WorkpaperWorkbook, sheetId: string) {
    const sheet = workbook.sheets[sheetId];
    if (!sheet) return;

    const rows = Array.from({ length: sheet.rowCount }, (_, rowIndex) =>
        Array.from({ length: sheet.columnCount }, (_, columnIndex) => {
            const input = sheet.cells[getCellKey(rowIndex, columnIndex)]?.input ?? "";
            return evaluateCellInput(workbook, sheetId, input).display;
        })
    );

    const xlsxSheet = XLSX.utils.aoa_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(xlsxSheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

    await saveBlobWithFallback(
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

export async function importWorkbookFile(file: File) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, {
        type: "array",
        cellFormula: true,
        cellDates: false,
    });

    const sheets = workbook.SheetNames.map((sheetName) => {
        const xlsxSheet = workbook.Sheets[sheetName];
        const ref = xlsxSheet["!ref"] ?? "A1:A1";
        const range = XLSX.utils.decode_range(ref);
        const cells: WorkpaperCellRecord = {};

        for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex += 1) {
            for (let columnIndex = range.s.c; columnIndex <= range.e.c; columnIndex += 1) {
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex });
                const input = valueToInput(xlsxSheet[cellAddress]);
                if (input !== "") {
                    cells[getCellKey(rowIndex, columnIndex)] = createCell(input);
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
