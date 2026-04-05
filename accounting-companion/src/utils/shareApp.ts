export type ShareAppOutcome =
    | "shared"
    | "copied"
    | "dismissed"
    | "unsupported"
    | "failed";

type ShareAppOptions = {
    title?: string;
    text?: string;
    url?: string;
};

function fallbackCopyText(value: string) {
    if (typeof document === "undefined") return false;

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    textarea.style.top = "0";
    textarea.style.left = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
        return document.execCommand("copy");
    } catch {
        return false;
    } finally {
        document.body.removeChild(textarea);
    }
}

async function copyAppLink(value: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
    }

    return fallbackCopyText(value);
}

function isShareCancellation(error: unknown) {
    if (!(error instanceof Error)) return false;

    return (
        error.name === "AbortError" ||
        error.name === "NotAllowedError" ||
        /abort|cancel|dismiss/i.test(error.message)
    );
}

export function getAppShareUrl() {
    if (typeof window === "undefined") return "/";

    return new URL(import.meta.env.BASE_URL, window.location.origin).toString();
}

export function getAppShareData(options: ShareAppOptions = {}) {
    return {
        title: options.title ?? "AccCalc",
        text:
            options.text ??
            "AccCalc helps with accounting, finance, and business calculations in a cleaner, offline-friendly workspace.",
        url: options.url ?? getAppShareUrl(),
    };
}

export async function shareApp(options: ShareAppOptions = {}): Promise<ShareAppOutcome> {
    const shareData = getAppShareData(options);

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        try {
            await navigator.share(shareData);
            return "shared";
        } catch (error) {
            if (isShareCancellation(error)) {
                return "dismissed";
            }
        }
    }

    try {
        const copied = await copyAppLink(shareData.url);
        return copied ? "copied" : "unsupported";
    } catch {
        return "failed";
    }
}
