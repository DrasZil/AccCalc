import type { ParsedScanResult } from "../../types";
import { parseOcrText } from "./ocrParser";

type ScanProcessingResponse =
    | {
          id: string;
          ok: true;
          parsed: ParsedScanResult;
      }
    | {
          id: string;
          ok: false;
          error: string;
      };

let scanWorker: Worker | null = null;
const pending = new Map<
    string,
    {
        resolve: (value: ParsedScanResult) => void;
        reject: (reason?: unknown) => void;
    }
>();

function ensureScanWorker() {
    if (scanWorker || typeof Worker === "undefined") {
        return scanWorker;
    }

    scanWorker = new Worker(new URL("../../workers/scanProcessing.worker.ts", import.meta.url), {
        type: "module",
    });

    scanWorker.addEventListener("message", (event: MessageEvent<ScanProcessingResponse>) => {
        const response = event.data;
        const request = pending.get(response.id);
        if (!request) return;

        pending.delete(response.id);
        if (response.ok) {
            request.resolve(response.parsed);
            return;
        }

        request.reject(new Error(response.error));
    });

    scanWorker.addEventListener("error", (event) => {
        pending.forEach(({ reject }) => reject(event.error ?? new Error("Scan worker failed.")));
        pending.clear();
        scanWorker?.terminate();
        scanWorker = null;
    });

    return scanWorker;
}

export async function parseScanTextInBackground(text: string, confidence: number) {
    const worker = ensureScanWorker();
    if (!worker) {
        return parseOcrText(text, confidence);
    }

    const id = `scan-parse-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return new Promise<ParsedScanResult>((resolve, reject) => {
        pending.set(id, { resolve, reject });
        try {
            worker.postMessage({
                id,
                text,
                confidence,
            });
        } catch (error) {
            pending.delete(id);
            worker.terminate();
            scanWorker = null;
            reject(error);
        }
    }).catch(() => parseOcrText(text, confidence));
}
