import type { ScanImageItem } from "../../types";

export function mergeSelectedOcrText(items: ScanImageItem[]) {
    return items
        .filter((item) => item.selected && item.editableText.trim() !== "")
        .map((item) => `[${item.name}]\n${item.editableText.trim()}`)
        .join("\n\n");
}

