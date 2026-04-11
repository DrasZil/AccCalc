export type ScanImageStatus =
    | "idle"
    | "queued"
    | "preprocessing"
    | "recognizing"
    | "classifying"
    | "extracting"
    | "routing"
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
    | "textbook-page"
    | "notes-reference"
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

export type ScanImageSourceKind =
    | "screenshot"
    | "dark-screenshot"
    | "photo"
    | "textbook-photo"
    | "handwriting"
    | "digital-handwriting"
    | "accounting-table"
    | "mixed"
    | "unknown";

export type StructuredScanField = {
    key: string;
    label: string;
    value: string;
    confidence: number;
    inferred?: boolean;
};

export type ScanRouteRecommendation = {
    path: string;
    label: string;
    category: string;
    reason: string;
    score: number;
    confidence: "high" | "moderate" | "low";
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

export type ScanProcessingPhase =
    | "queued"
    | "preparing"
    | "enhancing"
    | "reading"
    | "classifying"
    | "extracting"
    | "routing"
    | "completed"
    | "failed";

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
    cleanupNotes: string[];
    flaggedValues: string[];
    suggestedIntent: string;
    parseConfidence: number;
    extractionConfidence?: number;
    extractedValues: Array<{ label: string; value: string }>;
    detectedUnits: string[];
    likelyIssues: string[];
    notes: string[];
    pageType?: ScanPageType;
    routeHint?: string;
    routeReason?: string;
    routeConfidence?: number;
    recommendations?: ScanRouteRecommendation[];
    structuredFields?: StructuredScanField[];
    accounting?: AccountingWorksheetExtraction | null;
};

export type ScanImageItem = {
    id: string;
    file: File;
    name: string;
    sourceDataUrl?: string | null;
    previewUrl: string;
    processedPreviewUrl: string | null;
    detectedImageType?: ScanImageSourceKind;
    qualityScore?: number;
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
    processingPhase?: ScanProcessingPhase;
    processingSummary?: string;
    qualityWarnings?: string[];
    updatedAt?: number;
};
