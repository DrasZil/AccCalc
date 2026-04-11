/// <reference lib="webworker" />

import { parseOcrText } from "../services/ocr/ocrParser";

type ScanProcessingRequest = {
    id: string;
    text: string;
    confidence: number;
};

self.addEventListener("message", (event: MessageEvent<ScanProcessingRequest>) => {
    const payload = event.data;
    if (!payload?.id) return;

    try {
        const parsed = parseOcrText(payload.text, payload.confidence);
        self.postMessage({
            id: payload.id,
            ok: true,
            parsed,
        });
    } catch (error) {
        self.postMessage({
            id: payload.id,
            ok: false,
            error: error instanceof Error ? error.message : "Scan parsing failed.",
        });
    }
});
