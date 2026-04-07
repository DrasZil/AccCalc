import type { ConfidenceLevel } from "../../types";

export function getConfidenceLevel(value: number): ConfidenceLevel {
    if (value >= 85) return "high";
    if (value >= 60) return "medium";
    return "low";
}

export function explainConfidence(value: number) {
    if (value >= 85) {
        return "Strong OCR read. Cleaned text should be usable, but still verify key numbers and symbols.";
    }

    if (value >= 60) {
        return "Usable extraction, but some digits, punctuation, or operators may still need confirmation.";
    }

    return "Low-confidence OCR. Review flagged values carefully and compare cleaned text against the raw OCR before solving.";
}
