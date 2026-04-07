const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function validateScanFile(file: File) {
    if (!SUPPORTED_TYPES.has(file.type)) {
        return "Unsupported image type. Use PNG, JPG, WEBP, or GIF.";
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        return "Image is too large. Keep each file under 8 MB for browser OCR.";
    }

    return null;
}

