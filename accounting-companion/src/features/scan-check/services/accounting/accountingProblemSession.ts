import type { AccountingProblemSession, ScanImageItem, StructuredScanField } from "../../types";

const ROLE_PRIORITY = new Map([
    ["problem-statement", 1],
    ["department-1-worksheet", 2],
    ["department-2-worksheet", 3],
    ["cost-schedule-page", 4],
    ["answer-page", 5],
    ["mixed-reference-page", 6],
    ["unknown", 7],
]);

function uniqueFields(fields: StructuredScanField[]) {
    const seen = new Set<string>();
    return fields.filter((field) => {
        const key = `${field.key}:${field.value}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function parseFieldNumber(fields: StructuredScanField[], key: string) {
    const value = fields.find((field) => field.key === key)?.value;
    if (!value) return null;
    const parsed = Number(value.replaceAll(",", ""));
    return Number.isFinite(parsed) ? parsed : null;
}

export function buildAccountingProblemSession(items: ScanImageItem[]): AccountingProblemSession | null {
    const accountingItems = items.filter((item) => item.parsedResult?.accounting);
    if (accountingItems.length === 0) return null;

    const pageRoles = accountingItems
        .map((item) => ({
            id: item.id,
            name: item.name,
            role: item.parsedResult?.pageType ?? "unknown",
        }))
        .toSorted(
            (left, right) =>
                (ROLE_PRIORITY.get(left.role) ?? 99) - (ROLE_PRIORITY.get(right.role) ?? 99)
        );

    const structuredFields = uniqueFields(
        accountingItems.flatMap((item) => item.parsedResult?.structuredFields ?? [])
    );

    const routeHint =
        pageRoles.some((page) => page.role === "department-2-worksheet")
            ? "/accounting/department-transferred-in-process-costing"
            : "/accounting/process-costing-workspace";

    return {
        routeHint,
        summary:
            pageRoles.some((page) => page.role === "department-2-worksheet")
                ? "Selected images look like one linked process-costing set with later-department or transferred-in treatment. Review page order and carry-forward assumptions before checking totals."
                : "Selected images look like one process-costing problem set. AccCalc merged the worksheet roles automatically, but key fields should still be reviewed before trusting totals.",
        pageRoles,
        structuredFields,
        extractedCompletedCost: parseFieldNumber(structuredFields, "completed_cost"),
        extractedEndingWipCost: parseFieldNumber(structuredFields, "ending_wip_cost"),
        extractedCostPerEquivalentUnit: parseFieldNumber(structuredFields, "cost_per_eu"),
    };
}
