export type WorkpaperValue = string | number | boolean | null;

export type WorkpaperSourceKind = "calculator" | "history" | "study" | "import";

export type WorkpaperSourceLink = {
    id: string;
    kind: WorkpaperSourceKind;
    title: string;
    path?: string;
    summary: string;
    capturedAt: number;
    recordId?: string;
};

export type WorkpaperCell = {
    input: string;
    note?: string;
};

export type WorkpaperCellRecord = Record<string, WorkpaperCell>;

export type WorkpaperSheetKind = "grid" | "template" | "calculator" | "imported" | "notes";

export type WorkpaperSheet = {
    id: string;
    title: string;
    kind: WorkpaperSheetKind;
    rowCount: number;
    columnCount: number;
    cells: WorkpaperCellRecord;
    note?: string;
    templateId?: string;
    sources: WorkpaperSourceLink[];
    createdAt: number;
    updatedAt: number;
};

export type WorkpaperWorkbook = {
    id: string;
    title: string;
    description: string;
    topic: string;
    createdAt: number;
    updatedAt: number;
    revision: number;
    activeSheetId: string;
    sheetOrder: string[];
    sheets: Record<string, WorkpaperSheet>;
};

export type WorkpaperTransferSheet = {
    title: string;
    kind?: WorkpaperSheetKind;
    rowCount?: number;
    columnCount?: number;
    cells?: WorkpaperCellRecord;
    note?: string;
    templateId?: string;
};

export type WorkpaperTransferBundle = {
    id: string;
    title: string;
    description: string;
    topic: string;
    sheet: WorkpaperTransferSheet;
    source: WorkpaperSourceLink;
    recommendedTemplateIds?: string[];
    createdAt: number;
};

export type WorkpaperTemplateDefinition = {
    id: string;
    title: string;
    description: string;
    topic: string;
    tags: string[];
    relatedPaths: string[];
    buildWorkbook: () => WorkpaperWorkbook;
};

export type WorkpaperLibraryState = {
    version: 1;
    workbookOrder: string[];
    workbooks: Record<string, WorkpaperWorkbook>;
    recentWorkbookIds: string[];
    pendingTransfers: WorkpaperTransferBundle[];
};
