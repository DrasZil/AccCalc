import type { OcrResult } from "../../types";
import {
    recognizeImageWithWorker,
    terminateSharedOcrWorker,
} from "./tesseractClient";

export type OcrEngineAdapter = {
    id: string;
    label: string;
    recognize: (
        image: string,
        onProgress?: (progress: number, status: string) => void
    ) => Promise<OcrResult>;
    terminate?: () => Promise<void>;
};

const tesseractEngine: OcrEngineAdapter = {
    id: "tesseract-browser",
    label: "Tesseract (browser)",
    recognize: recognizeImageWithWorker,
    terminate: terminateSharedOcrWorker,
};

export function getOcrEngine() {
    return tesseractEngine;
}
