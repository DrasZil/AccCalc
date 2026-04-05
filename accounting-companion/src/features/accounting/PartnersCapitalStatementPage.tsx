import { useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import {
    computePartnerCapitalEndingBalance,
} from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

type PartnerKey = "A" | "B" | "C";
type PartnerEntry = {
    name: string;
    beginningCapital: string;
    additionalInvestment: string;
    drawings: string;
    incomeShare: string;
};

type PartnerResult = {
    key: PartnerKey;
    name: string;
    beginningCapital: number;
    additionalInvestment: number;
    drawings: number;
    incomeShare: number;
    endingCapital: number;
};

const INITIAL_PARTNERS: Record<PartnerKey, PartnerEntry> = {
    A: {
        name: "Partner A",
        beginningCapital: "",
        additionalInvestment: "",
        drawings: "",
        incomeShare: "",
    },
    B: {
        name: "Partner B",
        beginningCapital: "",
        additionalInvestment: "",
        drawings: "",
        incomeShare: "",
    },
    C: {
        name: "Partner C",
        beginningCapital: "",
        additionalInvestment: "",
        drawings: "",
        incomeShare: "",
    },
};

export default function PartnersCapitalStatementPage() {
    const [partners, setPartners] =
        useState<Record<PartnerKey, PartnerEntry>>(INITIAL_PARTNERS);

    function setPartnerField(
        partnerKey: PartnerKey,
        field: keyof PartnerEntry,
        value: string
    ) {
        setPartners((current) => ({
            ...current,
            [partnerKey]: {
                ...current[partnerKey],
                [field]: value,
            },
        }));
    }

    function loadSampleCase() {
        setPartners({
            A: {
                name: "Partner A",
                beginningCapital: "200000",
                additionalInvestment: "30000",
                drawings: "25000",
                incomeShare: "45000",
            },
            B: {
                name: "Partner B",
                beginningCapital: "180000",
                additionalInvestment: "15000",
                drawings: "20000",
                incomeShare: "35000",
            },
            C: {
                name: "Partner C",
                beginningCapital: "90000",
                additionalInvestment: "0",
                drawings: "10000",
                incomeShare: "20000",
            },
        });
    }

    const result = (() => {
        const activePartners = (Object.entries(partners) as Array<[PartnerKey, PartnerEntry]>)
            .filter(([key, partner]) => {
                if (key === "C") {
                    return Object.values(partner).some((value) => value.trim() !== "");
                }

                return true;
            });

        const requiredFieldsMissing = activePartners.some(([, partner]) =>
            [
                partner.beginningCapital,
                partner.additionalInvestment,
                partner.drawings,
                partner.incomeShare,
            ].some((value) => value.trim() === "")
        );

        if (requiredFieldsMissing) {
            return null;
        }

        const partnerResults: PartnerResult[] = [];

        for (const [key, partner] of activePartners) {
            const values = [
                Number(partner.beginningCapital),
                Number(partner.additionalInvestment),
                Number(partner.drawings),
                Number(partner.incomeShare),
            ];

            if (values.some((value) => Number.isNaN(value))) {
                return { error: `All values for ${partner.name} must be valid numbers.` };
            }

            const [beginningCapital, additionalInvestment, drawings, incomeShare] = values;

            if (beginningCapital < 0 || additionalInvestment < 0 || drawings < 0) {
                return {
                    error: `${partner.name} beginning capital, additional investment, and drawings cannot be negative.`,
                };
            }

            const endingCapital = computePartnerCapitalEndingBalance({
                beginningCapital,
                additionalInvestment,
                drawings,
                incomeShare,
            });

            partnerResults.push({
                key,
                name: partner.name,
                beginningCapital,
                additionalInvestment,
                drawings,
                incomeShare,
                endingCapital,
            });
        }

        const totalEndingCapital = partnerResults.reduce(
            (sum, partner) => sum + partner.endingCapital,
            0
        );
        const totalIncomeShare = partnerResults.reduce(
            (sum, partner) => sum + partner.incomeShare,
            0
        );

        return {
            partnerResults,
            totalEndingCapital,
            totalIncomeShare,
            formula:
                "Ending capital = Beginning capital + Additional investment + Income share - Drawings",
            steps: partnerResults.map(
                (partner) =>
                    `${partner.name}: ${formatPHP(partner.beginningCapital)} + ${formatPHP(partner.additionalInvestment)} + ${formatPHP(partner.incomeShare)} - ${formatPHP(partner.drawings)} = ${formatPHP(partner.endingCapital)}`
            ),
            glossary: [
                {
                    term: "Beginning capital",
                    meaning: "Opening balance of each partner's capital account before current-period changes.",
                },
                {
                    term: "Additional investment",
                    meaning: "Extra owner contribution added directly to the partner's capital account.",
                },
                {
                    term: "Drawings",
                    meaning: "Amounts withdrawn by the partner for personal use during the period.",
                },
                {
                    term: "Income share",
                    meaning: "The partner's allocated share of partnership income or loss after agreed distribution rules are applied.",
                },
            ],
            interpretation:
                totalIncomeShare >= 0
                    ? `The statement shows how each partner's capital moved during the period and closes to total ending capital of ${formatPHP(totalEndingCapital)}.`
                    : `Because total allocated income is negative, the statement shows how partnership losses reduced ending capital to ${formatPHP(totalEndingCapital)}.`,
            assumptions: [
                "This statement assumes the period's income share was already computed correctly using the partnership agreement before posting to capital.",
                "Drawings are treated as direct capital reductions and additional investments are treated as direct capital increases.",
            ],
            warnings: [
                "If salary or interest allowances apply, compute those allocations first, then bring the final income share into this statement.",
            ],
        };
    })();

    return (
        <CalculatorPageLayout
            badge="Accounting | Partnership"
            title="Statement of Partners' Capital"
            description="Roll beginning capital, investments, drawings, and allocated income forward into ending capital for two or three partners."
            headerActions={
                <button
                    type="button"
                    onClick={loadSampleCase}
                    className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                >
                    Load sample case
                </button>
            }
            inputSection={
                <div className="space-y-4">
                    {(["A", "B", "C"] as PartnerKey[]).map((partnerKey) => (
                        <SectionCard key={partnerKey}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="app-section-kicker text-xs">
                                        {partnerKey === "C" ? "Optional partner" : "Partner"}
                                    </p>
                                    <h3 className="app-section-title mt-2 text-xl">
                                        {partners[partnerKey].name}
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-4">
                                <InputGrid columns={2}>
                                    <InputCard
                                        label="Beginning Capital"
                                        value={partners[partnerKey].beginningCapital}
                                        onChange={(value) =>
                                            setPartnerField(partnerKey, "beginningCapital", value)
                                        }
                                        placeholder="200000"
                                    />
                                    <InputCard
                                        label="Additional Investment"
                                        value={partners[partnerKey].additionalInvestment}
                                        onChange={(value) =>
                                            setPartnerField(partnerKey, "additionalInvestment", value)
                                        }
                                        placeholder="30000"
                                    />
                                    <InputCard
                                        label="Drawings"
                                        value={partners[partnerKey].drawings}
                                        onChange={(value) =>
                                            setPartnerField(partnerKey, "drawings", value)
                                        }
                                        placeholder="25000"
                                    />
                                    <InputCard
                                        label="Income Share"
                                        value={partners[partnerKey].incomeShare}
                                        onChange={(value) =>
                                            setPartnerField(partnerKey, "incomeShare", value)
                                        }
                                        placeholder="45000"
                                    />
                                </InputGrid>
                            </div>
                        </SectionCard>
                    ))}
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <div className="space-y-4">
                        <ResultGrid columns={3}>
                            <ResultCard
                                title="Total Ending Capital"
                                value={formatPHP(result.totalEndingCapital)}
                                tone="accent"
                            />
                            <ResultCard
                                title="Total Income Share Posted"
                                value={formatPHP(result.totalIncomeShare)}
                            />
                            <ResultCard
                                title="Partners Included"
                                value={String(result.partnerResults.length)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <p className="app-section-kicker text-xs">Capital statement</p>
                            <h3 className="app-section-title mt-2 text-xl">
                                Rollforward by partner
                            </h3>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                                    <thead>
                                        <tr className="text-left text-[color:var(--app-text-secondary)]">
                                            <th className="px-3 py-2 font-medium">Partner</th>
                                            <th className="px-3 py-2 font-medium">Beginning</th>
                                            <th className="px-3 py-2 font-medium">Investment</th>
                                            <th className="px-3 py-2 font-medium">Income share</th>
                                            <th className="px-3 py-2 font-medium">Drawings</th>
                                            <th className="px-3 py-2 font-medium">Ending</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.partnerResults.map((partner) => (
                                            <tr key={partner.key} className="app-subtle-surface">
                                                <td className="rounded-l-2xl px-3 py-3 font-semibold text-[color:var(--app-text)]">
                                                    {partner.name}
                                                </td>
                                                <td className="px-3 py-3 text-[color:var(--app-text)]">
                                                    {formatPHP(partner.beginningCapital)}
                                                </td>
                                                <td className="px-3 py-3 text-[color:var(--app-text)]">
                                                    {formatPHP(partner.additionalInvestment)}
                                                </td>
                                                <td className="px-3 py-3 text-[color:var(--app-text)]">
                                                    {formatPHP(partner.incomeShare)}
                                                </td>
                                                <td className="px-3 py-3 text-[color:var(--app-text)]">
                                                    {formatPHP(partner.drawings)}
                                                </td>
                                                <td className="rounded-r-2xl px-3 py-3 text-[color:var(--app-text)]">
                                                    {formatPHP(partner.endingCapital)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula={result.formula}
                        steps={result.steps}
                        glossary={result.glossary}
                        interpretation={result.interpretation}
                        assumptions={result.assumptions}
                        warnings={result.warnings}
                    />
                ) : null
            }
        />
    );
}
