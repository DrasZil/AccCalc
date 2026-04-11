import { formatCurrency } from "./currency.js";

export default function formatPHP(value: number): string {
    return formatCurrency(value);
}
