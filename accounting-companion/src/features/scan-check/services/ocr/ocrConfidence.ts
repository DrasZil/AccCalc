import type { ConfidenceLevel } from "../../types";

export function getConfidenceLevel(value: number): ConfidenceLevel {
    if (value >= 85) return "high";
    if (value >= 60) return "medium";
    return "low";
}

export function explainConfidence(value: number) {
    if (value >= 85) {
        return "Strong printed-text read. Still review symbols and numbers before solving.";
    }

    if (value >= 60) {
        return "Usable extraction, but some values or operators may need confirmation.";
    }

    return "Low-confidence OCR. Review the extracted text carefully before solving.";
}

