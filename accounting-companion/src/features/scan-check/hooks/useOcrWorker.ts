import { useEffect, useState } from "react";
import {
    recognizeImageWithWorker,
    terminateSharedOcrWorker,
} from "../services/ocr/tesseractClient";

export function useOcrWorker() {
    const [busy, setBusy] = useState(false);

    useEffect(() => () => void terminateSharedOcrWorker(), []);

    async function recognize(
        image: string,
        onProgress?: (progress: number, status: string) => void
    ) {
        setBusy(true);
        try {
            return await recognizeImageWithWorker(image, onProgress);
        } finally {
            setBusy(false);
        }
    }

    return {
        busy,
        recognize,
    };
}

