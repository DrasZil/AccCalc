import { stripCurrencyMarkers } from "./currency.js";
export const FLEXIBLE_NUMBER_CAPTURE_PATTERN = String.raw `(?:\((?:[\u20B1$]\s*)?\d[\d,]*(?:\.\d+)?\)|-?(?:[\u20B1$]\s*)?\d[\d,]*(?:\.\d+)?)(?:\s*%)?`;
export function parseLooseNumber(value, options) {
    if (value === null || value === undefined)
        return null;
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }
    const raw = String(value).trim();
    if (!raw)
        return null;
    const isParenthesizedNegative = /^\(\s*.*\s*\)$/.test(raw);
    const isNegative = isParenthesizedNegative || /^\s*-\s*/.test(raw);
    const isPercent = /%/.test(raw);
    let cleaned = stripCurrencyMarkers(raw);
    cleaned = cleaned
        .replace(/[()]/g, "")
        .replace(/%/g, "")
        .replace(/,/g, "")
        .replace(/\s+/g, "");
    const match = cleaned.match(/\d+(?:\.\d+)?/);
    if (!match)
        return null;
    let parsed = Number(match[0]);
    if (!Number.isFinite(parsed))
        return null;
    if (isNegative) {
        parsed = -Math.abs(parsed);
    }
    if (isPercent && options?.percentAsFraction) {
        parsed /= 100;
    }
    return parsed;
}
export function detectStructuredValueKind(value) {
    const trimmed = value.trim();
    if (!trimmed)
        return "text";
    if (/%/.test(trimmed))
        return "percent";
    if (/[\u20B1$]|(?:\bphp\b)|(?:\bpeso(?:s)?\b)/i.test(trimmed))
        return "money";
    if (/\b(?:units?|hours?|days?|years?|months?|kg|g|cm|mm|m|km)\b/i.test(trimmed)) {
        return "quantity";
    }
    if (/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/.test(trimmed) ||
        /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{2,4}\b/i.test(trimmed)) {
        return "date";
    }
    if (parseLooseNumber(trimmed) !== null)
        return "number";
    return "text";
}
export function normalizeStructuredFieldValue(value) {
    const kind = detectStructuredValueKind(value);
    const parsed = parseLooseNumber(value);
    if (parsed === null)
        return value.trim();
    if (kind === "percent") {
        return `${parsed}%`;
    }
    if (kind === "quantity") {
        const unitMatch = value.trim().match(/\b(?:units?|hours?|days?|years?|months?|kg|g|cm|mm|m|km)\b/i);
        return unitMatch ? `${parsed} ${unitMatch[0].toLowerCase()}` : String(parsed);
    }
    return String(parsed);
}
