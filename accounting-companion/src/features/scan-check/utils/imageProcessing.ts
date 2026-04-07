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

function detectDarkBackground(data: Uint8ClampedArray) {
    let darkPixels = 0;
    for (let index = 0; index < data.length; index += 4) {
        const luminance =
            data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
        if (luminance < 90) darkPixels += 1;
    }
    return darkPixels / (data.length / 4);
}

function detectGridLikelihood(
    data: Uint8ClampedArray,
    width: number,
    height: number
) {
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

export async function preprocessImage(source: string) {
    const image = await loadImage(source);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Canvas preprocessing is unavailable in this browser.");
    }

    const scale = image.naturalWidth < 1200 ? 1.35 : 1;
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    const darkBackgroundRatio = detectDarkBackground(data);
    const notes: string[] = [];

    if (darkBackgroundRatio > 0.45) {
        notes.push("Dark-background worksheet preprocessing applied.");
    }

    for (let index = 0; index < data.length; index += 4) {
        let grayscale =
            data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
        if (darkBackgroundRatio > 0.45) {
            grayscale = 255 - grayscale;
        }
        const contrasted = Math.max(0, Math.min(255, (grayscale - 128) * 1.45 + 128));
        data[index] = contrasted;
        data[index + 1] = contrasted;
        data[index + 2] = contrasted;
    }

    context.putImageData(imageData, 0, 0);
    const tableLikelihood = detectGridLikelihood(data, canvas.width, canvas.height);
    if (tableLikelihood > 0.45) {
        notes.push("Table/grid-like worksheet structure detected.");
    }

    return {
        processedDataUrl: canvas.toDataURL("image/png"),
        width: canvas.width,
        height: canvas.height,
        notes,
        tableLikelihood,
    };
}
