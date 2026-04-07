import type { ScanImageSourceKind } from "../types";

export async function fileToDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(reader.error ?? new Error("Failed to read image."));
        reader.readAsDataURL(file);
    });
}

function loadImage(source: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Unable to load image preview."));
        image.src = source;
    });
}

export type ImagePreprocessProfile = "default" | "accounting-worksheet";

export type ImagePreprocessResult = {
    processedDataUrl: string;
    width: number;
    height: number;
    notes: string[];
    tableLikelihood: number;
    qualityWarnings: string[];
    qualityScore: number;
    detectedImageType: ScanImageSourceKind;
    blurScore: number;
    contrastRange: number;
};

function clamp(value: number, min = 0, max = 255) {
    return Math.max(min, Math.min(max, value));
}

function estimateBlur(data: Uint8ClampedArray, width: number, height: number) {
    let edgeEnergy = 0;
    let samples = 0;

    for (let row = 1; row < height; row += 6) {
        for (let column = 1; column < width; column += 6) {
            const index = (row * width + column) * 4;
            const left = (row * width + (column - 1)) * 4;
            const top = ((row - 1) * width + column) * 4;
            edgeEnergy +=
                Math.abs(data[index] - data[left]) + Math.abs(data[index] - data[top]);
            samples += 2;
        }
    }

    return samples > 0 ? edgeEnergy / samples : 0;
}

function estimateContrast(data: Uint8ClampedArray) {
    let min = 255;
    let max = 0;

    for (let index = 0; index < data.length; index += 12) {
        const value = data[index];
        if (value < min) min = value;
        if (value > max) max = value;
    }

    return max - min;
}

function detectDarkBackground(data: Uint8ClampedArray) {
    let darkPixels = 0;
    for (let index = 0; index < data.length; index += 4) {
        const luminance =
            data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
        if (luminance < 90) darkPixels += 1;
    }
    return darkPixels / (data.length / 4);
}

function detectGridLikelihood(data: Uint8ClampedArray, width: number, height: number) {
    let rowSignals = 0;
    let columnSignals = 0;

    for (let row = 0; row < height; row += Math.max(1, Math.floor(height / 40))) {
        let rowContrast = 0;
        for (let column = 4; column < width; column += 4) {
            const current = (row * width + column) * 4;
            const previous = (row * width + (column - 1)) * 4;
            rowContrast += Math.abs(data[current] - data[previous]);
        }
        if (rowContrast / Math.max(width, 1) > 18) rowSignals += 1;
    }

    for (let column = 0; column < width; column += Math.max(1, Math.floor(width / 40))) {
        let columnContrast = 0;
        for (let row = 1; row < height; row += 1) {
            const current = (row * width + column) * 4;
            const previous = ((row - 1) * width + column) * 4;
            columnContrast += Math.abs(data[current] - data[previous]);
        }
        if (columnContrast / Math.max(height, 1) > 18) columnSignals += 1;
    }

    return Math.min(1, (rowSignals + columnSignals) / 24);
}

function estimateNoise(data: Uint8ClampedArray, width: number, height: number) {
    let noise = 0;
    let samples = 0;

    for (let row = 1; row < height - 1; row += 8) {
        for (let column = 1; column < width - 1; column += 8) {
            const index = (row * width + column) * 4;
            const left = (row * width + (column - 1)) * 4;
            const right = (row * width + (column + 1)) * 4;
            const top = ((row - 1) * width + column) * 4;
            const bottom = ((row + 1) * width + column) * 4;
            const average =
                (data[left] + data[right] + data[top] + data[bottom]) / 4;
            noise += Math.abs(data[index] - average);
            samples += 1;
        }
    }

    return samples > 0 ? noise / samples : 0;
}

function averageEdgeLuminance(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    edgePixels = 6
) {
    let sum = 0;
    let count = 0;

    for (let row = 0; row < height; row += 1) {
        for (let column = 0; column < width; column += 1) {
            const isEdge =
                row < edgePixels ||
                column < edgePixels ||
                row >= height - edgePixels ||
                column >= width - edgePixels;
            if (!isEdge) continue;
            const index = (row * width + column) * 4;
            sum += data[index];
            count += 1;
        }
    }

    return count > 0 ? sum / count : 255;
}

function findContentBounds(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    edgeLuminance: number
) {
    const threshold = 18;
    let top = 0;
    let bottom = height - 1;
    let left = 0;
    let right = width - 1;

    while (top < height / 5) {
        let signal = 0;
        for (let column = 0; column < width; column += 4) {
            signal += Math.abs(data[(top * width + column) * 4] - edgeLuminance);
        }
        if (signal / Math.max(1, width / 4) > threshold) break;
        top += 1;
    }

    while (bottom > height * 0.8) {
        let signal = 0;
        for (let column = 0; column < width; column += 4) {
            signal += Math.abs(data[(bottom * width + column) * 4] - edgeLuminance);
        }
        if (signal / Math.max(1, width / 4) > threshold) break;
        bottom -= 1;
    }

    while (left < width / 5) {
        let signal = 0;
        for (let row = 0; row < height; row += 4) {
            signal += Math.abs(data[(row * width + left) * 4] - edgeLuminance);
        }
        if (signal / Math.max(1, height / 4) > threshold) break;
        left += 1;
    }

    while (right > width * 0.8) {
        let signal = 0;
        for (let row = 0; row < height; row += 4) {
            signal += Math.abs(data[(row * width + right) * 4] - edgeLuminance);
        }
        if (signal / Math.max(1, height / 4) > threshold) break;
        right -= 1;
    }

    const cropWidth = Math.max(1, right - left + 1);
    const cropHeight = Math.max(1, bottom - top + 1);

    return {
        left: Math.max(0, left),
        top: Math.max(0, top),
        width: cropWidth,
        height: cropHeight,
        trimmed:
            left > width * 0.01 ||
            top > height * 0.01 ||
            cropWidth < width * 0.99 ||
            cropHeight < height * 0.99,
    };
}

function detectImageType(params: {
    darkBackgroundRatio: number;
    tableLikelihood: number;
    blurScore: number;
    contrastRange: number;
    noiseScore: number;
}) {
    const { darkBackgroundRatio, tableLikelihood, blurScore, contrastRange, noiseScore } = params;

    if (tableLikelihood > 0.62 && contrastRange > 90) return "accounting-table";
    if (darkBackgroundRatio > 0.58 && contrastRange > 110) return "dark-screenshot";
    if (contrastRange > 145 && noiseScore < 16 && blurScore > 20) return "screenshot";
    if (blurScore < 13 && contrastRange < 110) return "textbook-photo";
    if (noiseScore > 28 && tableLikelihood < 0.35 && contrastRange > 80) return "handwriting";
    if (noiseScore > 20 && contrastRange > 120) return "digital-handwriting";
    if (tableLikelihood > 0.32 && noiseScore > 22) return "mixed";
    if (contrastRange < 100 || noiseScore > 18) return "photo";
    return "unknown";
}

function applyAdaptiveMonochrome(
    data: Uint8ClampedArray,
    params: {
        darkBackgroundRatio: number;
        contrastRange: number;
        tableLikelihood: number;
        imageType: ScanImageSourceKind;
    }
) {
    const { darkBackgroundRatio, contrastRange, tableLikelihood, imageType } = params;
    const invert = darkBackgroundRatio > 0.45 || imageType === "dark-screenshot";
    const contrastBoost =
        contrastRange < 95 ? 1.72 : contrastRange < 120 ? 1.5 : contrastRange < 150 ? 1.35 : 1.22;
    const thresholdPush =
        imageType === "screenshot" || imageType === "dark-screenshot" || tableLikelihood > 0.45;

    for (let index = 0; index < data.length; index += 4) {
        let value =
            data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
        if (invert) value = 255 - value;
        value = clamp((value - 128) * contrastBoost + 128);

        if (thresholdPush) {
            const threshold = contrastRange < 110 ? 148 : 138;
            value = value >= threshold ? clamp(value + 24) : clamp(value - 24);
        }

        data[index] = value;
        data[index + 1] = value;
        data[index + 2] = value;
    }
}

function applySharpen(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    amount: number
) {
    const source = new Uint8ClampedArray(data);

    for (let row = 1; row < height - 1; row += 1) {
        for (let column = 1; column < width - 1; column += 1) {
            const index = (row * width + column) * 4;
            const left = (row * width + (column - 1)) * 4;
            const right = (row * width + (column + 1)) * 4;
            const top = ((row - 1) * width + column) * 4;
            const bottom = ((row + 1) * width + column) * 4;
            const enhanced =
                source[index] * (1 + amount * 4) -
                amount * (source[left] + source[right] + source[top] + source[bottom]);
            const clamped = clamp(enhanced);
            data[index] = clamped;
            data[index + 1] = clamped;
            data[index + 2] = clamped;
        }
    }
}

export async function preprocessImage(source: string): Promise<ImagePreprocessResult> {
    const image = await loadImage(source);
    const sampleCanvas = document.createElement("canvas");
    const sampleContext = sampleCanvas.getContext("2d");

    if (!sampleContext) {
        throw new Error("Canvas preprocessing is unavailable in this browser.");
    }

    sampleCanvas.width = image.naturalWidth;
    sampleCanvas.height = image.naturalHeight;
    sampleContext.drawImage(image, 0, 0, sampleCanvas.width, sampleCanvas.height);

    const sampleData = sampleContext.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height);
    const samplePixels = sampleData.data;
    const initialDarkRatio = detectDarkBackground(samplePixels);
    const initialContrast = estimateContrast(samplePixels);
    const initialBlur = estimateBlur(samplePixels, sampleCanvas.width, sampleCanvas.height);
    const initialTableLikelihood = detectGridLikelihood(
        samplePixels,
        sampleCanvas.width,
        sampleCanvas.height
    );
    const initialNoise = estimateNoise(samplePixels, sampleCanvas.width, sampleCanvas.height);
    const edgeLuminance = averageEdgeLuminance(
        samplePixels,
        sampleCanvas.width,
        sampleCanvas.height
    );
    const contentBounds = findContentBounds(
        samplePixels,
        sampleCanvas.width,
        sampleCanvas.height,
        edgeLuminance
    );
    const detectedImageType = detectImageType({
        darkBackgroundRatio: initialDarkRatio,
        tableLikelihood: initialTableLikelihood,
        blurScore: initialBlur,
        contrastRange: initialContrast,
        noiseScore: initialNoise,
    });

    const notes: string[] = [];
    const qualityWarnings: string[] = [];
    const scale = image.naturalWidth < 1200 ? 1.35 : image.naturalWidth < 1800 ? 1.12 : 1;
    const padding = Math.round(Math.max(14, Math.min(32, Math.max(contentBounds.width, contentBounds.height) * 0.015)));
    const outputWidth = Math.round((contentBounds.width + padding * 2) * scale);
    const outputHeight = Math.round((contentBounds.height + padding * 2) * scale);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Canvas preprocessing is unavailable in this browser.");
    }

    canvas.width = outputWidth;
    canvas.height = outputHeight;
    context.fillStyle = initialDarkRatio > 0.45 ? "#111111" : "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
        image,
        contentBounds.left,
        contentBounds.top,
        contentBounds.width,
        contentBounds.height,
        padding * scale,
        padding * scale,
        contentBounds.width * scale,
        contentBounds.height * scale
    );

    if (contentBounds.trimmed) {
        notes.push("Trimmed low-detail borders to focus OCR on the content area.");
    }
    if (scale > 1) {
        notes.push("Upscaled the image before OCR to help small text and numbers.");
    }
    if (detectedImageType === "dark-screenshot") {
        notes.push("Applied dark-background balancing for a screenshot-style image.");
    } else if (detectedImageType === "accounting-table") {
        notes.push("Applied table-friendly contrast tuning for accounting rows and totals.");
    } else if (detectedImageType === "textbook-photo") {
        notes.push("Applied photo cleanup for a softer textbook-style page.");
    } else if (detectedImageType === "handwriting" || detectedImageType === "digital-handwriting") {
        notes.push("Used gentler cleanup to preserve handwriting strokes and spacing.");
    }

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    applyAdaptiveMonochrome(data, {
        darkBackgroundRatio: initialDarkRatio,
        contrastRange: initialContrast,
        tableLikelihood: initialTableLikelihood,
        imageType: detectedImageType,
    });

    if (initialBlur < 17 && canvas.width * canvas.height <= 2_800_000) {
        applySharpen(data, canvas.width, canvas.height, initialBlur < 11 ? 0.55 : 0.32);
        notes.push("Applied mild sharpening to improve soft edges and blurry digits.");
    }

    context.putImageData(imageData, 0, 0);

    const processedData = context.getImageData(0, 0, canvas.width, canvas.height);
    const processedPixels = processedData.data;
    const tableLikelihood = detectGridLikelihood(processedPixels, canvas.width, canvas.height);
    const blurScore = estimateBlur(processedPixels, canvas.width, canvas.height);
    const contrastRange = estimateContrast(processedPixels);

    if (tableLikelihood > 0.45) {
        notes.push("Detected worksheet or table structure that may contain aligned numeric values.");
    }
    if (initialBlur < 10 || blurScore < 10) {
        qualityWarnings.push("Noticeable blur detected. Review flagged digits before solving.");
    } else if (initialBlur < 17 || blurScore < 17) {
        qualityWarnings.push("Image looks a little soft. Check totals, commas, and decimal places carefully.");
    }
    if (contrastRange < 105) {
        qualityWarnings.push("Contrast is still limited. Faint handwriting or symbols may need manual review.");
    }
    if (canvas.width < 900 || canvas.height < 900) {
        qualityWarnings.push("Small source image detected. A closer crop can improve OCR quality.");
    }
    if (detectedImageType === "handwriting" || detectedImageType === "digital-handwriting") {
        qualityWarnings.push("Handwriting detected. Ambiguous short numbers and symbols should be reviewed manually.");
    }

    const qualityScore = Math.max(
        20,
        Math.min(
            100,
            Math.round(
                100 -
                    Math.max(0, 18 - blurScore) * 2.4 -
                    Math.max(0, 118 - contrastRange) * 0.5 -
                    Math.max(0, initialNoise - 24) * 0.9
            )
        )
    );

    return {
        processedDataUrl: canvas.toDataURL("image/png"),
        width: canvas.width,
        height: canvas.height,
        notes,
        tableLikelihood,
        qualityWarnings,
        qualityScore,
        detectedImageType,
        blurScore,
        contrastRange,
    };
}
