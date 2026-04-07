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
    if (/fifo/i.test(text) && /weighted average/i.test(text)) {
        issues.push("FIFO and weighted-average methods both appear. Confirm which method the worksheet expects.");
    }
    if (/transferred-?in/i.test(text) && !/department\s*2|dept\.?\s*2/i.test(text)) {
        issues.push("Transferred-in cost appears without a clear later-department label. Review the department carry-forward assumption.");
    }
    return issues;
}

function getRouteHint(kind: ParsedScanResult["kind"], cleanedText: string, accountingPageType?: ScanPageType) {
    if (kind === "accounting-worksheet") {
        return accountingPageType === "department-2-worksheet"
            ? "/accounting/department-transferred-in-process-costing"
            : "/accounting/process-costing-workspace";
    }

    if (kind === "equation") return "/basic";
    if (kind === "word-problem" || kind === "worked-solution" || kind === "answer-check") {
        return "/smart/solver";
    }
    if (kind === "textbook-page" || kind === "notes-reference") {
        if (/elasticity|equilibrium|demand|supply/i.test(cleanedText)) {
            return "/economics/market-equilibrium";
        }
        if (/margin|break-even|contribution/i.test(cleanedText)) {
            return "/business/break-even";
        }
        return "/smart/solver";
    }

    return "/smart/solver";
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
                  : kind === "textbook-page"
                    ? "Open suggested workspace"
                    : kind === "notes-reference"
                      ? "Review extracted values"
                  : "Send to SmartSolver";

    const routeHint = getRouteHint(kind, cleanedText, accountingPageType);

    const notes = [
        kind === "accounting-worksheet"
            ? "This looks like an accounting worksheet, so review structured fields and page roles before trusting the final totals."
            : kind === "worked-solution"
            ? "This looks like worked steps, so likely-mistake checks are more important than immediate solving."
            : kind === "textbook-page"
              ? "This looks like a textbook or reference page, so AccCalc is routing toward the most likely related tool."
            : kind === "notes-reference"
              ? "This looks like notes or a formula reference, so extract the key values before solving."
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
        routeHint,
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
                  routeHint,
                  fields: accountingFields,
                  likelyMistakes: likelyIssues,
                  notes,
              }
            : null,
    };
}
