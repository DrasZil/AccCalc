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
