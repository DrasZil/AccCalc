import { createWorker, PSM, type Worker } from "tesseract.js";
import type { OcrResult } from "../../types";

let sharedWorkerPromise: Promise<Worker> | null = null;

export async function getSharedOcrWorker(
    onProgress?: (progress: number, status: string) => void
) {
    if (!sharedWorkerPromise) {
        sharedWorkerPromise = createWorker("eng", 1, {
            logger: (message) => {
                onProgress?.(Math.round((message.progress ?? 0) * 100), message.status);
            },
        });
    }

    const worker = await sharedWorkerPromise;
    await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO,
        preserve_interword_spaces: "1",
    });
    return worker;
}

export async function recognizeImageWithWorker(
    image: string,
    onProgress?: (progress: number, status: string) => void
) {
    const worker = await getSharedOcrWorker(onProgress);
    const response = await worker.recognize(
        image,
        { rotateAuto: true },
        { text: true, blocks: true }
    );

    const blocks = response.data.blocks ?? [];
    const result: OcrResult = {
        text: response.data.text ?? "",
        confidence: response.data.confidence ?? 0,
        meanWordConfidence: blocks.length
            ? blocks.reduce((sum, block) => sum + block.confidence, 0) / blocks.length
            : response.data.confidence ?? 0,
        warnings: [],
        blocks: blocks.map((block) => ({
            text: block.text,
            confidence: block.confidence,
            bbox: block.bbox,
        })),
    };

    return result;
}

export async function terminateSharedOcrWorker() {
    if (!sharedWorkerPromise) return;
    const worker = await sharedWorkerPromise;
    await worker.terminate();
    sharedWorkerPromise = null;
}
