export function parseNumberList(rawValue: string) {
    const parts = rawValue
        .split(/[\n,;]+/)
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length === 0) {
        return {
            values: [] as number[],
            error: "Enter at least one numeric value.",
        };
    }

    const values = parts.map((part) => Number(part));
    if (values.some((value) => Number.isNaN(value))) {
        return {
            values: [] as number[],
            error: "All entries must be valid numbers separated by commas, semicolons, or new lines.",
        };
    }

    return {
        values,
        error: null as string | null,
    };
}
