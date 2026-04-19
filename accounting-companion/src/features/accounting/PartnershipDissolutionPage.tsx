import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import StudySupportPanel from "../../components/StudySupportPanel";
import { buildStudyQuizPath, buildStudyTopicPath } from "../study/studyContent";
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
            description="Work through realization, liability settlement, and final partner distributions in the same order your textbook solution expects."
            desktopLayout="result-focus"
            pageWidth="wide"
            startGuide={{
                title: "Follow the liquidation order one stage at a time",
                summary:
                    "Dissolution problems get intimidating when the entire schedule is treated as one step. Start with realization, then liabilities, then partner capital effects.",
                steps: [
                    {
                        title: "Enter realization and liability data",
                        description:
                            "Start with the book value of noncash assets, the cash realized, and the liabilities that must be settled first.",
                    },
                    {
                        title: "Add partner capitals and ratios",
                        description:
                            "Use the same profit-and-loss ratio that the problem gives for allocating the realization gain or loss.",
                    },
                    {
                        title: "Turn on insolvency only when stated",
                        description:
                            "Use deficiency absorption only if the problem clearly says the deficient partner cannot contribute the shortage.",
                    },
                ],
            }}
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
                            Enter each partner&apos;s capital balance before dissolution and the
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
                        <SectionCard className="app-tone-accent">
                            <p className="app-card-title text-sm">What this liquidation schedule is telling you</p>
                            <p className="app-body-md mt-2 text-sm">
                                Realization produced {formatPHP(result.gainOrLossOnRealization)} and left {formatPHP(result.cashAvailableForPartners)} after outside liabilities. The next question is not just the total cash, but how that amount moves through each partner&apos;s adjusted capital balance.
                            </p>
                            <p className="app-helper mt-2 text-xs leading-5">
                                {result.deficiencyTotal > 0
                                    ? assumeDeficiencyInsolvent
                                        ? `A capital deficiency of ${formatPHP(result.deficiencyTotal)} is being absorbed by the solvent partners because insolvency is assumed.`
                                        : `A capital deficiency of ${formatPHP(result.deficiencyTotal)} remains and still needs separate contribution or problem-specific treatment.`
                                    : "No capital deficiency appears after the realization gain or loss is allocated."}
                            </p>
                        </SectionCard>

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
                    <div className="space-y-4">
                        <StudySupportPanel
                            topicId="partnership-dissolution"
                            topicTitle="Partnership Dissolution"
                            lessonPath={buildStudyTopicPath("partnership-dissolution")}
                            quizPath={buildStudyQuizPath("partnership-dissolution")}
                            intro="Use this study layer to keep the liquidation order, realization logic, deficiency treatment, and review questions attached to the dissolution workflow."
                            sections={[
                                {
                                    key: "purpose",
                                    label: "What this tool is for",
                                    summary: "Turn a dissolution problem into a clear liquidation sequence.",
                                    content: (
                                        <p>
                                            Partnership dissolution problems require more than one final figure. You need to measure the realization gain or loss, settle outside liabilities first, adjust the partners&apos; capital balances, and then determine the final cash distributions. This page keeps that sequence together.
                                        </p>
                                    ),
                                },
                                {
                                    key: "procedure",
                                    label: "Procedure",
                                    summary: "Follow the liquidation order the same way a textbook solution would.",
                                    content: (
                                        <ol className="list-decimal space-y-2 pl-5">
                                            <li>Compare realized cash with book value of noncash assets.</li>
                                            <li>Allocate the realization gain or loss using the profit-and-loss ratio.</li>
                                            <li>Pay outside liabilities before partner distributions.</li>
                                            <li>Check whether any partner has a capital deficiency.</li>
                                            <li>Handle insolvency only if the problem explicitly says the deficient partner cannot contribute.</li>
                                        </ol>
                                    ),
                                },
                                {
                                    key: "worked-example",
                                    label: "Worked example",
                                    summary: "A live explanation built from the numbers now on the page.",
                                    content: (
                                        <p>
                                            The current liquidation produces a realization amount of {formatPHP(result.gainOrLossOnRealization)} and leaves {formatPHP(result.cashAvailableForPartners)} available after liabilities. From there, each partner&apos;s capital is adjusted by the allocated realization share before final distribution is determined.
                                        </p>
                                    ),
                                },
                                {
                                    key: "common-mistakes",
                                    label: "Common mistakes",
                                    summary: "Most dissolution errors come from sequence and assumption mistakes.",
                                    emphasis: "support",
                                    tone: "warning",
                                    content: (
                                        <ul className="list-disc space-y-2 pl-5">
                                            <li>Distributing partner cash before settling outside liabilities.</li>
                                            <li>Using capital balances without allocating realization gain or loss first.</li>
                                            <li>Assuming insolvency when the problem never says the deficient partner cannot contribute.</li>
                                            <li>Ignoring a capital consistency gap that suggests incomplete problem data.</li>
                                        </ul>
                                    ),
                                },
                                {
                                    key: "self-check",
                                    label: "Self-check",
                                    summary: "Quick prompts for review after solving.",
                                    emphasis: "support",
                                    tone: "info",
                                    content: (
                                        <ul className="list-disc space-y-2 pl-5">
                                            <li>Why must outside liabilities be handled before partner settlement?</li>
                                            <li>What changes when a deficient partner is insolvent?</li>
                                            <li>What does a non-zero capital consistency gap suggest about the data entered?</li>
                                        </ul>
                                    ),
                                },
                            ]}
                            relatedTools={[
                                { path: "/accounting/partnership-profit-sharing", label: "Profit Sharing" },
                                { path: "/accounting/partnership-retirement-bonus", label: "Retirement Bonus" },
                                { path: "/accounting/partners-capital-statement", label: "Partners Capital Statement" },
                            ]}
                        />
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
                    </div>
                ) : null
            }
        />
    );
}
