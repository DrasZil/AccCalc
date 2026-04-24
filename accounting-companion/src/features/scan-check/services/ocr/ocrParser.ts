import { recommendStudyTopicsFromText } from "../../../study/studyContent.js";
import {
    analyzeSmartInput,
    FIELD_META,
    INITIAL_FIELDS,
} from "../../../smart/smartSolver.engine.js";
import type {
    ParsedScanResult,
    ScanPageType,
    ScanRouteRecommendation,
    StructuredScanField,
} from "../../types.js";
import {
    detectStructuredValueKind,
    FLEXIBLE_NUMBER_CAPTURE_PATTERN,
    normalizeStructuredFieldValue,
} from "../../../../utils/numberParsing.js";
import {
    extractAccountingFields,
    normalizeAccountingWorksheetText,
} from "../accounting/accountingFieldExtractor.js";
import { classifyAccountingWorksheet } from "../accounting/accountingWorksheetClassifier.js";
import { classifyScanText } from "./ocrClassifier.js";
import { cleanupMathLikeText } from "./ocrMathCleanup.js";
import { recommendScanRoutes } from "./ocrRouting.js";

function extractUnits(text: string) {
    const matches =
        text.match(
            /\b(?:kg|g|cm|mm|m|km|%|days?|years?|months?|hours?|php|peso(?:s)?|units?)\b|₱/gi
        ) ?? [];
    return Array.from(new Set(matches.map((match) => match.toLowerCase())));
}

function extractValues(text: string) {
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    const matches: Array<{ label: string; value: string }> = [];
    const labeledLinePattern = new RegExp(
        String.raw`^([A-Za-z][A-Za-z0-9 /(),-]{2,42}?)(?:\s*[:=-]\s*|\s{2,})(${FLEXIBLE_NUMBER_CAPTURE_PATTERN}(?:\s*(?:units?|kg|g|cm|mm|m|km|days?|years?|months?|hours?))?)$`,
        "i"
    );
    const numberPattern = new RegExp(
        `${FLEXIBLE_NUMBER_CAPTURE_PATTERN}(?:\\s*(?:units?|kg|g|cm|mm|m|km|days?|years?|months?|hours?))?`,
        "gi"
    );

    for (const line of lines) {
        const labeledMatch = line.match(labeledLinePattern);
        if (labeledMatch) {
            matches.push({
                label: labeledMatch[1].trim(),
                value: labeledMatch[2].trim(),
            });
            continue;
        }

        const fallbackMatches = line.match(numberPattern) ?? [];
        fallbackMatches.slice(0, 1).forEach((match) => {
            matches.push({
                label: `Value ${matches.length + 1}`,
                value: match.trim(),
            });
        });
    }

    return matches.slice(0, 8);
}

function extractStructuredCandidates(text: string) {
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    const pattern = new RegExp(
        String.raw`^([A-Za-z][A-Za-z0-9 /(),-]{2,42}?)(?:\s*[:=-]\s*|\s{2,})(${FLEXIBLE_NUMBER_CAPTURE_PATTERN}(?:\s*(?:units?|kg|g|cm|mm|m|km|days?|years?|months?|hours?))?)$`,
        "i"
    );
    const seen = new Set<string>();
    const fields: StructuredScanField[] = [];

    for (const line of lines) {
        const match = line.match(pattern);
        if (!match) continue;

        const label = match[1].replace(/\s+/g, " ").trim();
        const value = match[2].trim();
        const key = label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");
        const normalizedValue = normalizeStructuredFieldValue(value);
        const valueKind = detectStructuredValueKind(value);
        const dedupeKey = `${key}:${value}`;

        if (!key || seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);

        fields.push({
            key,
            label,
            value,
            confidence: normalizedValue === value ? 74 : 68,
            normalizedValue,
            valueKind,
            sourceLine: line,
            needsReview: normalizedValue !== value || valueKind === "text",
        });
    }

    return fields.slice(0, 12);
}

function detectLikelyIssues(
    text: string,
    flaggedValues: string[],
    structuredFields: StructuredScanField[]
) {
    const issues: string[] = [];
    const suspiciousCompactTokens =
        text.match(/\b\d+[A-Za-z]{1,3}\d*\b|\b[A-Za-z]{1,2}\d+[A-Za-z]*\b/g) ?? [];

    if (/-/.test(text) && /\+/.test(text)) {
        issues.push("Check for sign errors around positive and negative terms.");
    }
    if (/[x*]\s*\d/.test(text) || /\d\s*[\/]\s*\d/.test(text)) {
        issues.push(
            "Verify operators because OCR often confuses multiplication and division symbols."
        );
    }
    if (/\b(?:kg|cm|days?|years?)\b/i.test(text) && /%/.test(text)) {
        issues.push("Review units and rates so the final answer uses a consistent basis.");
    }
    if (/therefore|answer/i.test(text) && /=/.test(text)) {
        issues.push("Check whether the final answer is consistent with the previous step.");
    }
    if (/fifo/i.test(text) && /weighted average/i.test(text)) {
        issues.push(
            "FIFO and weighted-average methods both appear. Confirm which method the worksheet expects."
        );
    }
    if (/transferred-?in/i.test(text) && !/department\s*2|dept\.?\s*2/i.test(text)) {
        issues.push(
            "Transferred-in cost appears without a clear later-department label. Review the department carry-forward assumption."
        );
    }
    if (suspiciousCompactTokens.length > 0) {
        issues.push(
            `Review tightly merged OCR tokens such as ${suspiciousCompactTokens
                .slice(0, 3)
                .join(", ")} because numbers and labels may still be stuck together.`
        );
    }
    if (structuredFields.some((field) => field.needsReview)) {
        issues.push(
            "Some structured values still need review because OCR normalization changed their raw shape or the label-value pairing is only moderately confident."
        );
    }
    if (flaggedValues.length > 0) {
        issues.push(
            "Some numeric values were left close to the raw OCR text because commas, decimals, or handwriting were uncertain."
        );
    }

    return issues;
}

function buildSmartStructuredFields(text: string) {
    const smartAnalysis = analyzeSmartInput({ ...INITIAL_FIELDS }, text);

    const structuredFields: StructuredScanField[] = smartAnalysis.extractedEntries.map(
        ([key, value]) => ({
            key,
            label: FIELD_META[key]?.label ?? key,
            value,
            normalizedValue: normalizeStructuredFieldValue(value),
            valueKind: detectStructuredValueKind(value),
            confidence:
                !smartAnalysis.best
                    ? 62
                    : Math.max(62, Math.min(92, smartAnalysis.best?.score ?? 62)),
            needsReview:
                smartAnalysis.warnings.length > 0 ||
                !smartAnalysis.isReadyToRoute ||
                (smartAnalysis.best?.score ?? 0) < 70,
        })
    );

    return {
        smartAnalysis,
        structuredFields,
    };
}

function getRecommendationConfidence(score: number): ScanRouteRecommendation["confidence"] {
    if (score >= 72) return "high";
    if (score >= 50) return "moderate";
    return "low";
}

export function parseOcrText(text: string, ocrConfidence: number): ParsedScanResult {
    const cleanup = cleanupMathLikeText(text, ocrConfidence);
    const cleanedText = cleanup.cleanedText;
    const normalizedAccountingText = normalizeAccountingWorksheetText(cleanedText);
    const smartStructured = buildSmartStructuredFields(cleanedText);
    const accountingFields = extractAccountingFields(normalizedAccountingText);
    const genericStructuredFields = extractStructuredCandidates(cleanedText);
    const accountingClassification = classifyAccountingWorksheet(normalizedAccountingText);
    const accountingPageType = accountingClassification.pageType as ScanPageType;
    const isAccountingWorksheet =
        accountingFields.length >= 3 || accountingPageType !== "unknown";
    const kind = isAccountingWorksheet
        ? "accounting-worksheet"
        : classifyScanText(cleanedText);
    const extractedValues = extractValues(cleanedText);
    const detectedUnits = extractUnits(cleanedText);
    const structuredFields = isAccountingWorksheet
        ? accountingFields
        : smartStructured.structuredFields.length > 0
          ? smartStructured.structuredFields
        : genericStructuredFields.length > 0
          ? genericStructuredFields
          : undefined;
    const likelyIssues = detectLikelyIssues(
        cleanedText,
        cleanup.flaggedValues,
        structuredFields ?? []
    );
    const fallbackRecommendations = recommendScanRoutes(
        isAccountingWorksheet ? normalizedAccountingText : cleanedText,
        kind,
        accountingPageType
    );
    const solverRecommendations: ScanRouteRecommendation[] = smartStructured.smartAnalysis.best
        ? [
              {
                  path: smartStructured.smartAnalysis.best.route,
                  label: smartStructured.smartAnalysis.best.name,
                  category: smartStructured.smartAnalysis.topicFamily?.label ?? "Smart Solver",
                  reason: smartStructured.smartAnalysis.best.reason,
                  score: smartStructured.smartAnalysis.best.score,
                  confidence: getRecommendationConfidence(
                      smartStructured.smartAnalysis.best.score
                  ),
              },
              ...smartStructured.smartAnalysis.secondaryRoutes.map((route) => ({
                  path: route.route,
                  label: route.name,
                  category: smartStructured.smartAnalysis.topicFamily?.label ?? "Smart Solver",
                  reason: route.reason,
                  score: route.score,
                  confidence: getRecommendationConfidence(route.score),
              })),
          ]
        : [];
    const shouldPreferSolverRecommendations =
        solverRecommendations.length > 0 &&
        (smartStructured.smartAnalysis.topicFamily?.confidence === "high" ||
            (smartStructured.smartAnalysis.best?.score ?? 0) >=
                (fallbackRecommendations[0]?.score ?? 0));
    const recommendations = shouldPreferSolverRecommendations
        ? solverRecommendations
        : fallbackRecommendations;
    const primaryRecommendation = recommendations[0];
    const secondRecommendation = recommendations[1];
    const studyRecommendations = recommendStudyTopicsFromText(
        isAccountingWorksheet ? normalizedAccountingText : cleanedText,
        primaryRecommendation?.path
    );
    const parseConfidence = Math.max(
        25,
        Math.min(
            100,
            ocrConfidence -
                (kind === "unknown" ? 22 : 0) +
                Math.min(extractedValues.length * 3, 18) +
                Math.min((structuredFields?.length ?? 0) * 2, 10) -
                Math.min(cleanup.flaggedValues.length * 5, 18) +
                Math.min((smartStructured.smartAnalysis.best?.score ?? 0) / 12, 8)
        )
    );

    const suggestedIntent =
        kind === "accounting-worksheet"
            ? "Check my solution"
            : kind === "equation"
              ? "Open suggested tool"
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

    const routeHint = primaryRecommendation?.path;
    const routeGap =
        primaryRecommendation && secondRecommendation
            ? primaryRecommendation.score - secondRecommendation.score
            : null;
    const routeLooksAmbiguous =
        routeGap !== null &&
        (routeGap <= 4 ||
            (primaryRecommendation?.confidence === secondRecommendation?.confidence &&
                primaryRecommendation?.confidence !== "high"));

    if (routeLooksAmbiguous) {
        likelyIssues.push(
            `Route selection is still close between ${primaryRecommendation?.label} and ${secondRecommendation?.label}, so confirm the topic before trusting the first recommendation.`
        );
    }

    if (smartStructured.smartAnalysis.warnings.length > 0) {
        likelyIssues.push(...smartStructured.smartAnalysis.warnings);
    }

    const notes = [
        kind === "accounting-worksheet"
            ? "This looks like an accounting worksheet, so review structured fields and page roles before trusting the final totals."
            : kind === "worked-solution"
              ? "This looks like worked steps, so likely-mistake checks are more important than immediate solving."
              : kind === "textbook-page"
                ? "This looks like a textbook or reference page, so AccCalc is ranking the most likely related tools instead of forcing one weak guess."
                : kind === "notes-reference"
                  ? "This looks like notes or a formula reference, so extract the key values before solving."
                  : "Review extracted values before routing into a calculator.",
        detectedUnits.length > 0
            ? `Detected units: ${detectedUnits.join(", ")}.`
            : "No clear units detected from OCR.",
        structuredFields?.length
            ? `Structured review captured ${structuredFields.length} candidate field${structuredFields.length === 1 ? "" : "s"} for manual confirmation.`
            : "No structured field candidates were strong enough to prefill safely.",
        primaryRecommendation
            ? `Best-fit route: ${primaryRecommendation.label}. ${primaryRecommendation.reason}`
            : "No confident specialized route was found, so Smart Solver remains the safest fallback.",
        smartStructured.smartAnalysis.topicFamily
            ? `Topic-first OCR routing currently reads this as ${smartStructured.smartAnalysis.topicFamily.label.toLowerCase()}.`
            : "OCR topic-family routing is still weak, so fallback routing rules remain active.",
        routeLooksAmbiguous && secondRecommendation
            ? `The top route is only slightly ahead of ${secondRecommendation.label}, so treat the recommendation as a guided shortlist instead of a final classification.`
            : "Routing confidence is separated from OCR confidence so you can review topic fit independently of text accuracy.",
        ...cleanup.cleanupNotes,
    ];

    return {
        kind,
        cleanedText,
        cleanupNotes: cleanup.cleanupNotes,
        flaggedValues: cleanup.flaggedValues,
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
        routeReason: primaryRecommendation?.reason,
        routeConfidence: primaryRecommendation?.score,
        recommendations,
        studyRecommendations,
        structuredFields,
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
