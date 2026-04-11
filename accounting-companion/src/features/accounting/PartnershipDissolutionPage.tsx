import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computePartnershipDissolution } from "../../utils/calculatorMath";

export default function PartnershipDissolutionPage() {
    const [bookValueNoncashAssets, setBookValueNoncashAssets] = useState("");
    const [cashFromRealization, setCashFromRealization] = useState("");
    const [liabilitiesToSettle, setLiabilitiesToSettle] = useState("");
    const [partnerACapital, setPartnerACapital] = useState("");
    const [partnerBCapital, setPartnerBCapital] = useState("");
    const [partnerCCapital, setPartnerCCapital] = useState("");
    const [partnerARatio, setPartnerARatio] = useState("");
    const [partnerBRatio, setPartnerBRatio] = useState("");
    const [partnerCRatio, setPartnerCRatio] = useState("");
    const [assumeDeficiencyInsolvent, setAssumeDeficiencyInsolvent] = useState(false);

    const result = useMemo(() => {
        if (
            bookValueNoncashAssets.trim() === "" ||
            cashFromRealization.trim() === "" ||
            liabilitiesToSettle.trim() === "" ||
            partnerACapital.trim() === "" ||
            partnerBCapital.trim() === "" ||
            partnerARatio.trim() === "" ||
            partnerBRatio.trim() === ""
        ) {
            return null;
        }

        const parsedPartners = [
            {
                label: "Partner A",
                capital: Number(partnerACapital),
                ratio: Number(partnerARatio),
            },
            {
                label: "Partner B",
                capital: Number(partnerBCapital),
                ratio: Number(partnerBRatio),
            },
            ...(partnerCCapital.trim() !== "" || partnerCRatio.trim() !== ""
                ? [
                      {
                          label: "Partner C",
                          capital: Number(partnerCCapital || 0),
                          ratio: Number(partnerCRatio || 0),
                      },
                  ]
                : []),
        ];

        const numericValues = [
            Number(bookValueNoncashAssets),
            Number(cashFromRealization),
            Number(liabilitiesToSettle),
            ...parsedPartners.flatMap((partner) => [partner.capital, partner.ratio]),
        ];

        if (numericValues.some((value) => Number.isNaN(value))) {
            return { error: "All visible dissolution inputs must be valid numbers." };
        }

        if (
            Number(bookValueNoncashAssets) < 0 ||
            Number(cashFromRealization) < 0 ||
            Number(liabilitiesToSettle) < 0 ||
            parsedPartners.some((partner) => partner.ratio <= 0)
        ) {
            return {
                error: "Noncash assets, realized cash, and liabilities cannot be negative. Every visible profit-and-loss ratio must be greater than zero.",
            };
        }

        return computePartnershipDissolution({
            bookValueNoncashAssets: Number(bookValueNoncashAssets),
            cashFromRealization: Number(cashFromRealization),
            liabilitiesToSettle: Number(liabilitiesToSettle),
            partners: parsedPartners,
            assumeDeficiencyInsolvent,
        });
    }, [
        assumeDeficiencyInsolvent,
        bookValueNoncashAssets,
        cashFromRealization,
        liabilitiesToSettle,
        partnerACapital,
        partnerARatio,
        partnerBCapital,
        partnerBRatio,
        partnerCCapital,
        partnerCRatio,
    ]);

    return (
        <CalculatorPageLayout
            badge="Accounting | Partnership"
            title="Partnership Dissolution"
            description="Review realization gain or loss, liquidation cash available to partners, and capital-deficiency handling from one course-aligned dissolution workflow."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <InputGrid columns={3}>
                            <InputCard
                                label="Book Value of Noncash Assets"
                                value={bookValueNoncashAssets}
                                onChange={setBookValueNoncashAssets}
                                placeholder="420000"
                            />
                            <InputCard
                                label="Cash from Realization"
                                value={cashFromRealization}
                                onChange={setCashFromRealization}
                                placeholder="390000"
                            />
                            <InputCard
                                label="Liabilities to Settle"
                                value={liabilitiesToSettle}
                                onChange={setLiabilitiesToSettle}
                                placeholder="120000"
                            />
                        </InputGrid>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Partners and ratios</p>
                        <p className="app-body-md mt-2 text-sm">
                            Enter each partner's capital balance before dissolution and the
                            agreed profit-and-loss ratio used to allocate the realization gain or
                            loss.
                        </p>
                        <div className="mt-4 space-y-3">
                            <InputGrid columns={3}>
                                <InputCard
                                    label="Partner A Capital"
                                    value={partnerACapital}
                                    onChange={setPartnerACapital}
                                    placeholder="120000"
                                />
                                <InputCard
                                    label="Partner A Ratio"
                                    value={partnerARatio}
                                    onChange={setPartnerARatio}
                                    placeholder="3"
                                />
                                <InputCard
                                    label="Partner B Capital"
                                    value={partnerBCapital}
                                    onChange={setPartnerBCapital}
                                    placeholder="100000"
                                />
                                <InputCard
                                    label="Partner B Ratio"
                                    value={partnerBRatio}
                                    onChange={setPartnerBRatio}
                                    placeholder="2"
                                />
                                <InputCard
                                    label="Partner C Capital (optional)"
                                    value={partnerCCapital}
                                    onChange={setPartnerCCapital}
                                    placeholder="80000"
                                />
                                <InputCard
                                    label="Partner C Ratio (optional)"
                                    value={partnerCRatio}
                                    onChange={setPartnerCRatio}
                                    placeholder="1"
                                />
                            </InputGrid>
                        </div>

                        <div className="app-subtle-surface mt-4 rounded-[1rem] px-4 py-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="max-w-2xl">
                                    <p className="app-card-title text-sm">Capital deficiency handling</p>
                                    <p className="app-body-md mt-1 text-sm">
                                        Turn this on when the problem says a deficient partner is
                                        insolvent and the deficiency must be absorbed by the
                                        remaining partners.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setAssumeDeficiencyInsolvent((current) => !current)
                                    }
                                    className={[
                                        "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                        assumeDeficiencyInsolvent
                                            ? "app-button-primary"
                                            : "app-button-secondary",
                                    ].join(" ")}
                                >
                                    {assumeDeficiencyInsolvent
                                        ? "Insolvency assumed"
                                        : "No insolvency assumed"}
                                </button>
                            </div>
                        </div>
                    </SectionCard>
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard
                                title="Gain or Loss on Realization"
                                value={formatPHP(result.gainOrLossOnRealization)}
                                tone={
                                    result.gainOrLossOnRealization >= 0 ? "success" : "warning"
                                }
                            />
                            <ResultCard
                                title="Cash Available for Partners"
                                value={formatPHP(result.cashAvailableForPartners)}
                            />
                            <ResultCard
                                title="Capital Deficiency"
                                value={formatPHP(result.deficiencyTotal)}
                                supportingText={
                                    assumeDeficiencyInsolvent
                                        ? "Absorbed by solvent partners"
                                        : "Still requires contribution or separate treatment"
                                }
                            />
                            <ResultCard
                                title="Capital Consistency Gap"
                                value={formatPHP(result.capitalConsistencyGap)}
                                supportingText="Difference between entered capitals and book net assets"
                            />
                        </ResultGrid>

                        <SectionCard>
                            <p className="app-card-title text-sm">Partner liquidation schedule</p>
                            <div className="mt-3 space-y-3">
                                {result.finalPartners.map((partner) => (
                                    <div
                                        key={partner.label}
                                        className="app-subtle-surface rounded-[1rem] px-4 py-3"
                                    >
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                    {partner.label}
                                                </p>
                                                <p className="app-helper mt-1 text-xs">
                                                    Realization share {formatPHP(partner.realizationShare)} | Adjusted capital {formatPHP(partner.adjustedCapital)}
                                                </p>
                                            </div>
                                            <div className="text-sm font-semibold text-[color:var(--app-text)] md:text-right">
                                                Final distribution {formatPHP(partner.finalCashDistribution)}
                                            </div>
                                        </div>
                                        {partner.absorbedDeficiency > 0 ? (
                                            <p className="app-helper mt-2 text-xs">
                                                Absorbed deficiency: {formatPHP(partner.absorbedDeficiency)}
                                            </p>
                                        ) : null}
                                        {partner.contributionRequired > 0 ? (
                                            <p className="app-helper mt-2 text-xs">
                                                Contribution required from deficient partner: {formatPHP(partner.contributionRequired)}
                                            </p>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Gain or loss on realization = cash from realization - book value of noncash assets; adjusted capital = beginning capital + allocated realization gain or loss; cash available to partners = realized cash - liabilities settled."
                        steps={[
                            `Gain or loss on realization = ${formatPHP(Number(cashFromRealization || 0))} - ${formatPHP(Number(bookValueNoncashAssets || 0))} = ${formatPHP(result.gainOrLossOnRealization)}.`,
                            `Cash available to partners = ${formatPHP(Number(cashFromRealization || 0))} - ${formatPHP(Number(liabilitiesToSettle || 0))} = ${formatPHP(result.cashAvailableForPartners)}.`,
                            ...result.finalPartners.map(
                                (partner) =>
                                    `${partner.label}: capital ${formatPHP(partner.capital)} + realization share ${formatPHP(partner.realizationShare)} = adjusted capital ${formatPHP(partner.adjustedCapital)}.`
                            ),
                            assumeDeficiencyInsolvent && result.deficiencyTotal > 0
                                ? `Because insolvency is assumed, the deficiency of ${formatPHP(result.deficiencyTotal)} is absorbed by the solvent partners based on their profit-and-loss ratio.`
                                : result.deficiencyTotal > 0
                                  ? `A deficiency of ${formatPHP(result.deficiencyTotal)} remains. Without an insolvency assumption, the deficient partner normally contributes cash or the problem must state how the deficiency is handled.`
                                  : "No partner capital deficiency appears after allocating the realization gain or loss.",
                        ]}
                        glossary={[
                            {
                                term: "Realization gain or loss",
                                meaning:
                                    "The difference between the cash obtained from selling noncash assets and the book value of those assets before liquidation.",
                            },
                            {
                                term: "Adjusted capital",
                                meaning:
                                    "The partner's capital after adding or subtracting the share of realization gain or loss. This is the amount used before final liquidation cash is distributed.",
                            },
                            {
                                term: "Capital deficiency",
                                meaning:
                                    "A negative adjusted capital balance. It signals that the partner cannot fully absorb the allocated loss without contributing additional cash or triggering deficiency absorption by other partners if insolvency is assumed.",
                            },
                        ]}
                        interpretation={`This dissolution schedule shows whether realization produced a gain or a loss, how much cash remains after paying outside liabilities, and how that cash should move through the partners' capital accounts. The result matters because dissolution is not just about one final amount; it is about following the proper liquidation order, allocating realization effects correctly, and explaining whether any deficiency changes the partners' final cash settlement.`}
                        assumptions={[
                            "This page assumes the entered capitals represent the partners' balances immediately before dissolution adjustments and that the stated ratio is the basis for allocating realization gain or loss.",
                            "The workflow focuses on outside liabilities first, then partner capital settlement. Partner loans, safe installment schedules, and tax effects are outside this simplified dissolution view.",
                        ]}
                        notes={[
                            "If the capital consistency gap is not zero, the entered capitals and net book assets do not reconcile cleanly. That usually means the problem contains omitted cash, partner loans, or incomplete balances.",
                            "Use the insolvency toggle only when the problem explicitly says the deficient partner is insolvent or unable to contribute the shortage.",
                        ]}
                        warnings={[
                            "Do not distribute cash to partners before settling outside liabilities unless the problem explicitly provides a safe-payment schedule.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
