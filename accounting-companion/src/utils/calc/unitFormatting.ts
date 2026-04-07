import { formatUnitLabel } from "../mathFormatting";

export function formatValueWithUnit(value: string, unit?: string) {
    return unit ? `${value} ${formatUnitLabel(unit)}` : value;
}

export function normalizeUnitToken(unit?: string) {
    return unit?.trim().replace(/\s+/g, " ") ?? "";
}

