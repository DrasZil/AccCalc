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

export async function preprocessImage(source: string) {
    const image = await loadImage(source);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Canvas preprocessing is unavailable in this browser.");
    }

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    for (let index = 0; index < data.length; index += 4) {
        const grayscale =
            data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
        const contrasted = Math.max(0, Math.min(255, (grayscale - 128) * 1.25 + 128));
        data[index] = contrasted;
        data[index + 1] = contrasted;
        data[index + 2] = contrasted;
    }

    context.putImageData(imageData, 0, 0);

    return {
        processedDataUrl: canvas.toDataURL("image/png"),
        width: canvas.width,
        height: canvas.height,
    };
}

