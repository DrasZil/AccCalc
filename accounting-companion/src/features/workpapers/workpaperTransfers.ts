import type { SavedToolRecord, ActivityEntry } from "../../utils/appActivity";
import type { WorkpaperTransferBundle } from "./workpaperTypes.js";
import { createCell, createWorkpaperId } from "./workpaperUtils.js";

function getHistorySummary(entry: SavedToolRecord | ActivityEntry) {
    return "summary" in entry ? entry.summary : entry.input;
}

export function createHistoryTransferBundle(
    entry: SavedToolRecord | ActivityEntry
): WorkpaperTransferBundle {
    const createdAt = Date.now();
    const description =
        "result" in entry && entry.result
            ? `Saved result from ${entry.title}`
            : `History note from ${entry.title}`;

    return {
        id: createWorkpaperId("transfer"),
        title: `${entry.title} workpaper`,
        description,
        topic: entry.category,
        createdAt,
        recommendedTemplateIds: [],
        source: {
            id: createWorkpaperId("source"),
            kind: "history",
            title: entry.title,
            path: entry.path,
            summary:
                "result" in entry
                    ? `${entry.input}${entry.result ? ` | Result: ${entry.result}` : ""}`
                    : getHistorySummary(entry),
            capturedAt: createdAt,
            recordId: entry.id,
        },
        sheet: {
            title: "History Capture",
            kind: "notes",
            rowCount: 12,
            columnCount: 4,
            note: "This sheet was created from AccCalc history so the source prompt and result stay traceable.",
            cells: {
                "0:0": createCell("History capture"),
                "0:1": createCell("Source"),
                "1:1": createCell(entry.title),
                "0:2": createCell("Path"),
                "1:2": createCell(entry.path),
                "0:3": createCell("Prompt / summary"),
                "1:3": createCell(
                    "result" in entry ? entry.input : getHistorySummary(entry)
                ),
                "0:4": createCell("Result"),
                "1:4": createCell("result" in entry ? entry.result ?? "" : ""),
                "0:5": createCell("Captured at"),
                "1:5": createCell(new Date(createdAt).toLocaleString()),
            },
        },
    };
}
