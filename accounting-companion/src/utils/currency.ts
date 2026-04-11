import { readAppSettings } from "./appSettings.js";

export type SupportedCurrencyCode =
    | "PHP"
    | "USD"
    | "EUR"
    | "GBP"
    | "JPY"
    | "CAD"
    | "AUD"
    | "SGD"
    | "HKD"
    | "CNY"
    | "INR"
    | "KRW"
    | "AED";

export const SUPPORTED_CURRENCIES: Array<{
    code: SupportedCurrencyCode;
    label: string;
}> = [
    { code: "PHP", label: "Philippine Peso" },
    { code: "USD", label: "US Dollar" },
    { code: "EUR", label: "Euro" },
    { code: "GBP", label: "British Pound" },
    { code: "JPY", label: "Japanese Yen" },
    { code: "CAD", label: "Canadian Dollar" },
    { code: "AUD", label: "Australian Dollar" },
    { code: "SGD", label: "Singapore Dollar" },
    { code: "HKD", label: "Hong Kong Dollar" },
    { code: "CNY", label: "Chinese Yuan" },
    { code: "INR", label: "Indian Rupee" },
    { code: "KRW", label: "South Korean Won" },
    { code: "AED", label: "UAE Dirham" },
];

const FALLBACK_CURRENCY: SupportedCurrencyCode = "PHP";

const CURRENCY_HINTS: Array<[SupportedCurrencyCode, RegExp[]]> = [
    ["PHP", [/\bphp\b/i, /\bphilippine peso(s)?\b/i, /\bpeso(s)?\b/i, /\u20B1/]],
    ["USD", [/\busd\b/i, /\bus dollar(s)?\b/i, /\bdollar(s)?\b/i, /\$/]],
    ["EUR", [/\beur\b/i, /\beuro(s)?\b/i, /\u20AC/]],
    ["GBP", [/\bgbp\b/i, /\bpound sterling\b/i, /\bpound(s)?\b/i, /\u00A3/]],
    ["JPY", [/\bjpy\b/i, /\byen\b/i, /\u00A5/]],
    ["CAD", [/\bcad\b/i, /\bcanadian dollar(s)?\b/i]],
    ["AUD", [/\baud\b/i, /\baustralian dollar(s)?\b/i]],
    ["SGD", [/\bsgd\b/i, /\bsingapore dollar(s)?\b/i]],
    ["HKD", [/\bhkd\b/i, /\bhong kong dollar(s)?\b/i]],
    ["CNY", [/\bcny\b/i, /\byuan\b/i, /\brmb\b/i]],
    ["INR", [/\binr\b/i, /\brupee(s)?\b/i, /\u20B9/]],
    ["KRW", [/\bkrw\b/i, /\bwon\b/i, /\u20A9/]],
    ["AED", [/\baed\b/i, /\bdirham(s)?\b/i]],
];

const SYMBOL_FALLBACKS: Record<SupportedCurrencyCode, string> = {
    PHP: "\u20b1",
    USD: "$",
    EUR: "\u20ac",
    GBP: "\u00a3",
    JPY: "\u00a5",
    CAD: "CA$",
    AUD: "A$",
    SGD: "S$",
    HKD: "HK$",
    CNY: "\u00a5",
    INR: "\u20b9",
    KRW: "\u20a9",
    AED: "\u062f.\u0625",
};

export function getPreferredCurrency(): SupportedCurrencyCode {
    if (typeof window === "undefined") return FALLBACK_CURRENCY;
    const preferred = readAppSettings().preferredCurrency;
    return (
        SUPPORTED_CURRENCIES.find((currency) => currency.code === preferred)?.code ??
        FALLBACK_CURRENCY
    );
}

export function getCurrencySymbol(currencyCode = getPreferredCurrency()) {
    const fallback = SYMBOL_FALLBACKS[currencyCode] ?? currencyCode;

    try {
        const parts = new Intl.NumberFormat("en", {
            style: "currency",
            currency: currencyCode,
            currencyDisplay: "narrowSymbol",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).formatToParts(1);

        return parts.find((part) => part.type === "currency")?.value ?? fallback;
    } catch {
        return fallback;
    }
}

export function formatCurrency(
    value: number,
    options?: {
        currency?: SupportedCurrencyCode;
        minimumFractionDigits?: number;
        maximumFractionDigits?: number;
        useCode?: boolean;
    }
) {
    const currencyCode = options?.currency ?? getPreferredCurrency();
    const minimumFractionDigits = options?.minimumFractionDigits ?? 2;
    const maximumFractionDigits = options?.maximumFractionDigits ?? 2;

    try {
        const formatter = new Intl.NumberFormat("en", {
            style: "currency",
            currency: currencyCode,
            currencyDisplay: options?.useCode ? "code" : "narrowSymbol",
            minimumFractionDigits,
            maximumFractionDigits,
        });

        if (options?.useCode) {
            return formatter.format(value);
        }

        const parts = formatter.formatToParts(value);
        const currencySymbol = getCurrencySymbol(currencyCode);

        return parts
            .map((part) => (part.type === "currency" ? currencySymbol : part.value))
            .join("");
    } catch {
        const symbol = options?.useCode ? currencyCode : getCurrencySymbol(currencyCode);
        return `${symbol}${Number(value).toLocaleString("en", {
            minimumFractionDigits,
            maximumFractionDigits,
        })}`;
    }
}

export function detectCurrencyFromText(text: string): SupportedCurrencyCode | null {
    for (const [currencyCode, patterns] of CURRENCY_HINTS) {
        if (patterns.some((pattern) => pattern.test(text))) {
            return currencyCode;
        }
    }

    return null;
}

export function stripCurrencyMarkers(value: string): string {
    return value.replace(
        /\b(?:php|philippine peso(?:s)?|peso(?:s)?|usd|us dollar(?:s)?|dollar(?:s)?|eur|euro(?:s)?|gbp|pound(?: sterling|s)?|jpy|yen|cad|canadian dollar(?:s)?|aud|australian dollar(?:s)?|sgd|singapore dollar(?:s)?|hkd|hong kong dollar(?:s)?|cny|yuan|rmb|inr|rupee(?:s)?|krw|won|aed|dirham(?:s)?)\b/gi,
        ""
    );
}
