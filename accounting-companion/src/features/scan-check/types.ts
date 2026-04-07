export type ScanImageStatus =
    | "idle"
    | "queued"
    | "preprocessing"
    | "recognizing"
    | "parsed"
    | "needs review"
    | "completed"
    | "failed";

export type ConfidenceLevel = "high" | "medium" | "low";

export type ScanProblemKind =
    | "equation"
    | "word-problem"
    | "worked-solution"
    | "answer-check"
    | "accounting-worksheet"
    | "unknown";

export type ScanPageType =
    | "problem-statement"
    | "department-1-worksheet"
    | "department-2-worksheet"
    | "cost-schedule-page"
    | "answer-page"
    | "mixed-reference-page"
    | "unknown";

export type StructuredScanField = {
    key: string;
    label: string;
    value: string;
    confidence: number;
    inferred?: boolean;
};

export type AccountingWorksheetExtraction = {
    topic: string;
    pageType: ScanPageType;
    pageTypeConfidence: number;
    extractionConfidence: number;
    routeHint: string;
    fields: StructuredScanField[];
    likelyMistakes: string[];
    notes: string[];
};

export type AccountingProblemSession = {
    routeHint: string;
    summary: string;
    pageRoles: Array<{ id: string; name: string; role: ScanPageType }>;
    structuredFields: StructuredScanField[];
    extractedCompletedCost?: number | null;
    extractedEndingWipCost?: number | null;
    extractedCostPerEquivalentUnit?: number | null;
};

export type OcrResult = {
    text: string;
    confidence: number;
    meanWordConfidence: number;
    warnings: string[];
    blocks: Array<{
        text: string;
        confidence: number;
        bbox: { x0: number; y0: number; x1: number; y1: number };
    }>;
};

export type ParsedScanResult = {
    kind: ScanProblemKind;
    cleanedText: string;
    suggestedIntent: string;
    parseConfidence: number;
    extractionConfidence?: number;
    extractedValues: Array<{ label: string; value: string }>;
    detectedUnits: string[];
    likelyIssues: string[];
    notes: string[];
    pageType?: ScanPageType;
    routeHint?: string;
    structuredFields?: StructuredScanField[];
    accounting?: AccountingWorksheetExtraction | null;
};

export type ScanImageItem = {
    id: string;
    file: File;
    name: string;
    previewUrl: string;
    processedPreviewUrl: string | null;
    status: ScanImageStatus;
    progress: number;
    error: string | null;
    ocrResult: OcrResult | null;
    parsedResult: ParsedScanResult | null;
    editableText: string;
    confidenceLevel: ConfidenceLevel;
    selected: boolean;
    problemRole?: ScanPageType | null;
    preprocessNotes?: string[];
};
