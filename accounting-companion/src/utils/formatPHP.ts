import { readAppSettings } from "./appSettings";

const FALLBACK_CURRENCY = "PHP";

export default function formatPHP(value: number): string {
    const currency =
        typeof window === "undefined"
            ? FALLBACK_CURRENCY
            : readAppSettings().preferredCurrency || FALLBACK_CURRENCY;

    return new Intl.NumberFormat("en", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}
