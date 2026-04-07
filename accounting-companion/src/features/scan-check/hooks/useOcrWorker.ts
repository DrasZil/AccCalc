import { useEffect, useState } from "react";
import { getOcrEngine } from "../services/ocr/ocrEngine";

export function useOcrWorker() {
    const [busy, setBusy] = useState(false);
    const engine = getOcrEngine();

    useEffect(() => () => void engine.terminate?.(), [engine]);

    async function recognize(
        image: string,
        onProgress?: (progress: number, status: string) => void
    ) {
        setBusy(true);
        try {
            return await engine.recognize(image, onProgress);
        } finally {
            setBusy(false);
        }
    }

    return {
        busy,
        engineLabel: engine.label,
        recognize,
    };
}
