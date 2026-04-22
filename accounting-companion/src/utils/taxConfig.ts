export type TaxAssumptionConfig = {
    jurisdiction: string;
    effectiveDate: string;
    notes: string[];
};

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
    estateTax: {
        jurisdiction: "Philippines",
        effectiveDate: "2026-04-22",
        ratePercent: 6,
        notes: [
            "This helper assumes the classroom case already identified the gross estate and allowable deductions correctly.",
            "Special deductions, exclusions, and non-resident or cross-border issues should still be checked against the actual problem or current tax reference.",
        ],
    },
    donorsTax: {
        jurisdiction: "Philippines",
        effectiveDate: "2026-04-22",
        ratePercent: 6,
        notes: [
            "This helper assumes the taxable gift base has already been classified correctly for the scenario.",
            "Exemptions, exclusions, and donor classification details still need to be confirmed from the case or current reference.",
        ],
    },
    documentaryStampTax: {
        jurisdiction: "Philippines",
        effectiveDate: "2026-04-22",
        defaultTaxableUnitSize: 200,
        defaultRatePerUnit: 1.5,
        notes: [
            "Documentary stamp tax rates vary by document or transaction type, so treat the per-unit rate here as an editable classroom default rather than a hidden legal conclusion.",
            "Always confirm the applicable base and taxable unit before using the arithmetic result.",
        ],
    },
} as const satisfies Record<string, TaxAssumptionConfig & Record<string, unknown>>;

export function buildTaxAssumptionNotes(
    config: TaxAssumptionConfig,
    extraNotes: string[] = []
) {
    return [
        `Assumption basis: ${config.jurisdiction} reference default as of ${config.effectiveDate}. Review current rules before using the result outside classroom or reviewer contexts.`,
        ...config.notes,
        ...extraNotes,
    ];
}
