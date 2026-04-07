import type { ScanImageItem } from "../../types";

export function mergeSelectedOcrText(items: ScanImageItem[]) {
    return items
        .filter((item) => item.selected && item.editableText.trim() !== "")
        .map((item) =>
            [`[${item.name}]`, item.editableText.trim()]
                .filter(Boolean)
                .join("\n")
                .replace(/\n{3,}/g, "\n\n")
        )
        .join("\n\n");
}
