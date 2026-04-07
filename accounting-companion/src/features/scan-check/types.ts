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
    | "unknown";

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
    extractedValues: Array<{ label: string; value: string }>;
    detectedUnits: string[];
    likelyIssues: string[];
    notes: string[];
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
};

