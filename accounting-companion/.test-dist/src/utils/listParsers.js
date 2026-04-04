export function parseNumberList(rawValue) {
    const parts = rawValue
        .split(/[\n,;]+/)
        .map((part) => part.trim())
        .filter(Boolean);
    if (parts.length === 0) {
        return {
            values: [],
            error: "Enter at least one numeric value.",
        };
    }
    const values = parts.map((part) => Number(part));
    if (values.some((value) => Number.isNaN(value))) {
        return {
            values: [],
            error: "All entries must be valid numbers separated by commas, semicolons, or new lines.",
        };
    }
    return {
        values,
        error: null,
    };
}
