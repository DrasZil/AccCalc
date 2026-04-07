export const APP_VERSION = "3.2.4";
export const APP_RELEASE_DATE = "2026-04-08";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Mobile camera capture works better in 3.2.4",
        body: "Scan & Check now prefers native mobile camera capture first, then falls back gracefully when a browser does not support a reliable direct camera flow.",
    },
    {
        title: "Capture flows feed the queue directly",
        body: "Taking a photo now drops it straight into the scan queue so preview, OCR, review, and persistence behave the same as a normal image upload.",
    },
    {
        title: "Safer fallbacks on awkward browsers",
        body: "When native capture or live camera is not reliable, AccCalc falls back to the image picker instead of leaving the user stuck after a permission prompt.",
    },
    {
        title: "Mobile scan controls feel clearer",
        body: "Start Camera, Upload image, capture status, and related feedback are now grouped more clearly for touch-first scan sessions.",
    },
    {
        title: "Still future-proof and honest",
        body: "The camera fix builds on the existing persistence, preview, toast, and OCR layers without replacing them or treating fragile live camera logic as the only path.",
    },
];

export const APP_RELEASE_NOTES = [
    "3.2.4: Fixed the mobile camera flow so Start Camera prefers native device capture on supported phones and sends the photo directly into the scan queue after capture.",
    "3.2.4: Added graceful fallback from native capture or live camera into the image picker when the browser or device does not support a reliable direct camera flow.",
    "3.2.4: Kept captured photos inside the same persisted scan-session logic so they restore with the queue, preview, OCR output, and review state.",
    "3.2.4: Refined scan toasts and status messaging for camera opening, fallback use, permission denial, and capture-related guidance without blocking the workflow.",
    "3.2.4: Preserved desktop behavior while keeping live inline camera as a secondary supported path only where secure-context browser support is strong enough.",
    "3.2.4: Tightened mobile button grouping around Start Camera and Upload image so the capture flow feels clearer and more touch-friendly.",
];
