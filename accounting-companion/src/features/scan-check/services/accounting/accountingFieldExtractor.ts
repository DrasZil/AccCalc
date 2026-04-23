import type { StructuredScanField } from "../../types";
import {
    detectStructuredValueKind,
    normalizeStructuredFieldValue,
} from "../../../../utils/numberParsing.js";

const CLEANUPS: Array<[RegExp, string]> = [
    [/\bdept\.?\b/gi, "Department"],
    [/\btransferred[\s-]*in\b/gi, "transferred-in"],
    [/\bmaterials?\b/gi, "materials"],
    [/\blabor\b/gi, "labor"],
    [/\boverhead\b/gi, "overhead"],
    [/\bconversion\b/gi, "conversion"],
    [/\bcosts?\s+to\s+be\s+accounted\s+for\b/gi, "costs to be accounted for"],
    [/\bcosts?\s+accounted\s+for\b/gi, "costs accounted for"],
    [/\bcompleted\s+and\s+transferred\s+out\b/gi, "completed and transferred out"],
];

const FIELD_PATTERNS: Array<{ key: string; label: string; pattern: RegExp }> = [
    { key: "department", label: "Department", pattern: /(department\s*\d+)/i },
    { key: "units_started", label: "Units started / received", pattern: /units\s+(?:started|received)[^0-9]*([\d,.]+)/i },
    { key: "units_completed", label: "Completed and transferred out", pattern: /completed(?:\s+and\s+transferred\s+out)?[^0-9]*([\d,.]+)/i },
    { key: "ending_wip_units", label: "Ending WIP units", pattern: /ending\s+wip[^0-9]*([\d,.]+)/i },
    { key: "materials_cost", label: "Materials cost", pattern: /materials[^0-9%]*([\d,.]+)/i },
    { key: "labor_cost", label: "Labor cost", pattern: /labor[^0-9%]*([\d,.]+)/i },
    { key: "overhead_cost", label: "Overhead cost", pattern: /overhead[^0-9%]*([\d,.]+)/i },
    { key: "conversion_cost", label: "Conversion cost", pattern: /conversion[^0-9%]*([\d,.]+)/i },
    { key: "transferred_in_cost", label: "Transferred-in cost", pattern: /transferred-?in[^0-9%]*([\d,.]+)/i },
    { key: "costs_to_account_for", label: "Costs to be accounted for", pattern: /costs?\s+to\s+be\s+accounted\s+for[^0-9]*([\d,.]+)/i },
    { key: "costs_accounted_for", label: "Costs accounted for", pattern: /costs?\s+accounted\s+for[^0-9]*([\d,.]+)/i },
    { key: "completed_cost", label: "Completed / transferred cost", pattern: /completed\s+and\s+transferred\s+out[^0-9]*([\d,.]+)/i },
    { key: "ending_wip_cost", label: "Ending WIP cost", pattern: /ending\s+wip[^0-9%]*([\d,.]+)/i },
    { key: "cost_per_eu", label: "Cost per equivalent unit", pattern: /cost\s+per\s+equivalent\s+unit[^0-9]*([\d,.]+)/i },
];

export function normalizeAccountingWorksheetText(text: string) {
    return text
        .replace(/\r/g, "")
        .split("\n")
        .map((line) =>
            CLEANUPS.reduce(
                (current, [pattern, replacement]) => current.replace(pattern, replacement),
                line.replace(/[|]/g, " ").replace(/\s{2,}/g, " ").trim()
            )
        )
        .filter(Boolean)
        .join("\n");
}

export function extractAccountingFields(text: string) {
    const normalized = normalizeAccountingWorksheetText(text);
    const normalizedLines = normalized
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    const fields: StructuredScanField[] = [];

    FIELD_PATTERNS.forEach((field) => {
        let match: RegExpMatchArray | null = null;
        let sourceLine: string | undefined;

        for (const line of normalizedLines) {
            const lineMatch = line.match(field.pattern);
            if (!lineMatch) continue;
            match = lineMatch;
            sourceLine = line;
            break;
        }

        if (!match) {
            match = normalized.match(field.pattern);
        }
        if (!match) return;

        const rawValue = (match[1] ?? match[0]).trim();
        const normalizedValue = normalizeStructuredFieldValue(rawValue);
        const valueKind = detectStructuredValueKind(rawValue);

        fields.push({
            key: field.key,
            label: field.label,
            value: rawValue,
            confidence: sourceLine ? (match[1] ? 82 : 68) : match[1] ? 74 : 60,
            normalizedValue,
            valueKind,
            sourceLine,
            needsReview:
                Boolean(sourceLine && rawValue !== sourceLine) ||
                normalizedValue !== rawValue ||
                valueKind === "text",
        });
    });

    return fields;
}
