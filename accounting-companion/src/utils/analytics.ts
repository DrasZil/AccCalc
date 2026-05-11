type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
    interface Window {
        __ACCCALC_GA4_INLINE_LOADED__?: boolean;
        dataLayer?: unknown[];
        gtag?: (
            command: "js" | "config" | "event",
            target: string | Date,
            params?: AnalyticsEventParams
        ) => void;
    }
}

const GA_SCRIPT_ID = "accalc-ga4-gtag";
const DEFAULT_MEASUREMENT_ID = "G-RECVGTF5J1";
const MEASUREMENT_ID =
    import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || DEFAULT_MEASUREMENT_ID;
let initialized = false;
let lastPagePath = "";
let skippedInlineInitialPageView = false;

function canUseAnalytics() {
    return typeof window !== "undefined" && typeof document !== "undefined" && MEASUREMENT_ID;
}

function cleanParams(params: AnalyticsEventParams = {}) {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
    );
}

function resolvePagePath(path: string) {
    const basePath = window.location.pathname.endsWith("/")
        ? window.location.pathname
        : `${window.location.pathname}/`;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${basePath}#${normalizedPath}`;
}

export function initializeAnalytics() {
    if (!canUseAnalytics() || initialized) return;

    window.dataLayer = window.dataLayer ?? [];
    window.gtag =
        window.gtag ??
        function gtag() {
            window.dataLayer?.push(arguments);
        };

    if (window.__ACCCALC_GA4_INLINE_LOADED__) {
        initialized = true;
        return;
    }

    if (!document.getElementById(GA_SCRIPT_ID)) {
        const script = document.createElement("script");
        script.id = GA_SCRIPT_ID;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
        document.head.appendChild(script);
    }

    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
        anonymize_ip: true,
        send_page_view: false,
    });
    initialized = true;
}

export function trackPageView(
    path: string,
    title?: string,
    params: AnalyticsEventParams = {}
) {
    if (!canUseAnalytics()) return;
    initializeAnalytics();

    const pagePath = resolvePagePath(path);
    if (window.__ACCCALC_GA4_INLINE_LOADED__ && !skippedInlineInitialPageView) {
        skippedInlineInitialPageView = true;
        lastPagePath = pagePath;
        return;
    }

    if (pagePath === lastPagePath) return;
    lastPagePath = pagePath;

    window.gtag?.("event", "page_view", {
        page_title: title ?? document.title,
        page_location: window.location.href,
        page_path: pagePath,
        ...cleanParams(params),
    });
}

export function trackEvent(eventName: string, params: AnalyticsEventParams = {}) {
    if (!canUseAnalytics()) return;
    initializeAnalytics();
    window.gtag?.("event", eventName, cleanParams(params));
}

export function trackCalculatorUsage(calculatorName: string, params: AnalyticsEventParams = {}) {
    trackEvent("calculator_used", {
        calculator_name: calculatorName,
        ...params,
    });
}

export function trackButtonClick(buttonName: string, params: AnalyticsEventParams = {}) {
    trackEvent("button_click", {
        button_name: buttonName,
        ...params,
    });
}
