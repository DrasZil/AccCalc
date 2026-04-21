export const PHILIPPINE_TAX_ASSUMPTIONS = {
    vat: {
        jurisdiction: "Philippines",
        effectiveDate: "2026-04-21",
        ratePercent: 12,
        notes: [
            "Use this helper only after confirming the transaction is under the regular VAT regime.",
            "Classroom cases may exclude zero-rated, exempt, or special industry rules unless they are stated explicitly.",
        ],
    },
    percentageTax: {
        jurisdiction: "Philippines",
        effectiveDate: "2026-04-21",
        defaultRatePercent: 3,
        notes: [
            "Percentage tax rules can change, so treat the rate shown here as an editable classroom default rather than a hidden permanent law.",
            "Always confirm whether the case belongs to percentage tax instead of VAT before using this page.",
        ],
    },
    withholding: {
        jurisdiction: "Philippines",
        effectiveDate: "2026-04-21",
        notes: [
            "Withholding-tax rates vary by payment type and taxpayer classification.",
            "Use the rate given by the problem or current reference, then use this page to compute the arithmetic cleanly.",
        ],
    },
};
export function buildTaxAssumptionNotes(config, extraNotes = []) {
    return [
        `Assumption basis: ${config.jurisdiction} reference default as of ${config.effectiveDate}. Review current rules before using the result outside classroom or reviewer contexts.`,
        ...config.notes,
        ...extraNotes,
    ];
}
