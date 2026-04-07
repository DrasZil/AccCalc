export async function copyPlainText(value: string) {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable in this browser.");
    }

    await navigator.clipboard.writeText(value);
}

export async function downloadRemoteAsset(source: string, fileName: string) {
    if (typeof window === "undefined") return;

    const response = await fetch(source);
    if (!response.ok) {
        throw new Error("Unable to download this file right now.");
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = fileName;
    anchor.rel = "noopener";
    anchor.click();
    window.URL.revokeObjectURL(objectUrl);
}

export async function shareSupportDetails({
    title,
    text,
    url,
}: {
    title: string;
    text: string;
    url?: string;
}) {
    if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
            title,
            text,
            url,
        });
        return "shared" as const;
    }

    const fallback = [title, text, url].filter(Boolean).join("\n");
    await copyPlainText(fallback);
    return "copied" as const;
}
