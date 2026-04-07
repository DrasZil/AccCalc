import { cleanupMathLikeText } from "./ocrMathCleanup";
import { classifyScanText } from "./ocrClassifier";
import type { ParsedScanResult, ScanPageType } from "../../types";
import { classifyAccountingWorksheet } from "../accounting/accountingWorksheetClassifier";
import {
    extractAccountingFields,
    normalizeAccountingWorksheetText,
} from "../accounting/accountingFieldExtractor";

function extractUnits(text: string) {
    const matches =
        text.match(
            /\b(?:kg|g|cm|mm|m|km|%|days?|years?|months?|hours?|php|peso(?:s)?|units?)\b/gi
        ) ?? [];
    return Array.from(new Set(matches.map((match) => match.toLowerCase())));
}

function extractValues(text: string) {
    const matches =
        text.match(/(?:[A-Za-z][A-Za-z ]{1,18}[:=]\s*)?-?\d[\d,.]*(?:\.\d+)?%?/g) ?? [];
    return matches.slice(0, 8).map((match, index) => ({
        label: `Value ${index + 1}`,
        value: match.trim(),
    }));
}

function detectLikelyIssues(text: string) {
    const issues: string[] = [];
    if (/\u2212/.test(text) && /\+/.test(text)) {
        issues.push("Check for sign errors around positive and negative terms.");
    }
    if (/[×x]\s*\d/.test(text) || /\d\s*[÷/]\s*\d/.test(text)) {
        issues.push("Verify operators because OCR often confuses multiplication and division symbols.");
    }
    if (/\b(?:kg|cm|days?|years?)\b/i.test(text) && /%/.test(text)) {
        issues.push("Review units and rates so the final answer uses a consistent basis.");
    }
    if (/therefore|answer/i.test(text) && /=/.test(text)) {
        issues.push("Check whether the final answer is consistent with the previous step.");
    }
    return issues;
}

export function parseOcrText(text: string, ocrConfidence: number): ParsedScanResult {
    const cleanedText = cleanupMathLikeText(text);
    const normalizedAccountingText = normalizeAccountingWorksheetText(cleanedText);
    const accountingFields = extractAccountingFields(normalizedAccountingText);
    const accountingClassification = classifyAccountingWorksheet(normalizedAccountingText);
    const accountingPageType = accountingClassification.pageType as ScanPageType;
    const isAccountingWorksheet =
        accountingFields.length >= 3 || accountingPageType !== "unknown";
    const kind = isAccountingWorksheet
        ? "accounting-worksheet"
        : classifyScanText(cleanedText);
    const extractedValues = extractValues(cleanedText);
    const detectedUnits = extractUnits(cleanedText);
    const likelyIssues = detectLikelyIssues(cleanedText);
    const parseConfidence = Math.max(
        25,
        Math.min(
            100,
            ocrConfidence -
                (kind === "unknown" ? 22 : 0) +
                Math.min(extractedValues.length * 3, 18)
        )
    );

    const suggestedIntent =
        kind === "accounting-worksheet"
            ? "Check my solution"
            : kind === "equation"
            ? "Extract equation"
            : kind === "worked-solution"
              ? "Check my solution"
              : kind === "answer-check"
                ? "Compare final answer"
                : kind === "word-problem"
                  ? "Check this word problem"
                  : "Send to SmartSolver";

    const notes = [
        kind === "accounting-worksheet"
            ? "This looks like an accounting worksheet, so review structured fields and page roles before trusting the final totals."
            : kind === "worked-solution"
            ? "This looks like worked steps, so likely-mistake checks are more important than immediate solving."
            : "Review extracted values before routing into a calculator.",
        detectedUnits.length > 0
            ? `Detected units: ${detectedUnits.join(", ")}.`
            : "No clear units detected from OCR.",
    ];

    return {
        kind,
        cleanedText,
        suggestedIntent,
        parseConfidence,
        extractionConfidence: isAccountingWorksheet
            ? Math.min(95, Math.round((accountingClassification.confidence + parseConfidence) / 2))
            : undefined,
        extractedValues,
        detectedUnits,
        likelyIssues,
        notes,
        pageType: isAccountingWorksheet ? accountingPageType : "unknown",
        routeHint: isAccountingWorksheet
            ? accountingPageType === "department-2-worksheet"
                ? "/accounting/department-transferred-in-process-costing"
                : "/accounting/process-costing-workspace"
            : undefined,
        structuredFields: isAccountingWorksheet ? accountingFields : undefined,
        accounting: isAccountingWorksheet
            ? {
                  topic: "Process costing",
                  pageType: accountingPageType,
                  pageTypeConfidence: accountingClassification.confidence,
                  extractionConfidence: Math.min(
                      95,
                      Math.round((accountingClassification.confidence + parseConfidence) / 2)
                  ),
                  routeHint:
                      accountingPageType === "department-2-worksheet"
                          ? "/accounting/department-transferred-in-process-costing"
                          : "/accounting/process-costing-workspace",
                  fields: accountingFields,
                  likelyMistakes: likelyIssues,
                  notes,
              }
            : null,
    };
}
