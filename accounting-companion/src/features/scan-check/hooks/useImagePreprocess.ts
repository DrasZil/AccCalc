import { useState } from "react";
import { preprocessImage } from "../utils/imageProcessing";

export function useImagePreprocess() {
    const [busy, setBusy] = useState(false);

    async function run(source: string) {
        setBusy(true);
        try {
            return await preprocessImage(source);
        } finally {
            setBusy(false);
        }
    }

    return {
        busy,
        run,
    };
}

