import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeBorrowingCostsCapitalization } from "../../utils/calculatorMath";

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export default function BorrowingCostsCapitalizationPage() {
    const [averageAccumulatedExpenditures, setAverageAccumulatedExpenditures] = useState("");
    const [capitalizationRatePercent, setCapitalizationRatePercent] = useState("");
    const [capitalizationMonths, setCapitalizationMonths] = useState("");

    const result = useMemo(() => {
        const rawValues = [
            averageAccumulatedExpenditures,
            capitalizationRatePercent,
            capitalizationMonths,
        ];

        if (rawValues.some((value) => value.trim() === "")) return null;

        const [expenditures, ratePercent, months] = rawValues.map((value) => Number(value));
        if ([expenditures, ratePercent, months].some((value) => Number.isNaN(value))) {
            return { error: "All borrowing-cost inputs must be valid numbers." };
        }
        if (expenditures < 0 || ratePercent < 0 || months <= 0 || months > 12) {
            return {
                error: "Use a non-negative expenditure and rate, with capitalization months between 1 and 12.",
            };
        }

        return computeBorrowingCostsCapitalization({
            averageAccumulatedExpenditures: expenditures,
            capitalizationRatePercent: ratePercent,
            capitalizationMonths: months,
        });
    }, [
        averageAccumulatedExpenditures,
        capitalizationMonths,
        capitalizationRatePercent,
    ]);

    return (
        <CalculatorPageLayout
            badge="FAR"
            title="Borrowing Costs Capitalization"
            description="Estimate avoidable borrowing cost on a qualifying asset using average accumulated expenditures, a capitalization rate, and the portion of the year the asset was under construction."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Average Accumulated Expenditures"
                            value={averageAccumulatedExpenditures}
                            onChange={setAverageAccumulatedExpenditures}
                            placeholder="8500000"
                            helperText="Use the weighted-average qualifying expenditures from the problem, not total project cost unless the case says they are the same."
                        />
                        <InputCard
                            label="Capitalization Rate (%)"
                            value={capitalizationRatePercent}
                            onChange={setCapitalizationRatePercent}
                            placeholder="9.5"
                            helperText="Use the rate the class problem assigns to avoidable borrowing cost."
                        />
                        <InputCard
                            label="Capitalization Months"
                            value={capitalizationMonths}
                            onChange={setCapitalizationMonths}
                            placeholder="8"
                            helperText="Keep this to the period when capitalization conditions were actually present."
                        />
                    </InputGrid>
                </SectionCard>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <div className="space-y-4">
                        <ResultGrid columns={3}>
                            <ResultCard
                                title="Annual Avoidable Interest"
                                value={formatPHP(result.annualAvoidableInterest)}
                                tone="accent"
                            />
                            <ResultCard
                                title="Capitalization Fraction"
                                value={formatPercent(result.capitalizationFraction * 100)}
                            />
                            <ResultCard
                                title="Capitalizable Borrowing Cost"
                                value={formatPHP(result.capitalizableBorrowingCost)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <p className="app-card-title text-sm">Interpretation</p>
                            <p className="app-body-md mt-2 text-sm">
                                This output is the classroom-style avoidable borrowing cost for
                                the qualifying-asset period shown. It should be compared against
                                any problem-specific ceiling or actual-interest cap before final
                                capitalization is concluded.
                            </p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Capitalizable borrowing cost = Average accumulated expenditures x capitalization rate x capitalization months / 12"
                        steps={[
                            `Annual avoidable interest = ${formatPHP(Number(averageAccumulatedExpenditures))} x ${Number(capitalizationRatePercent).toFixed(2)}% = ${formatPHP(result.annualAvoidableInterest)}.`,
                            `Capitalization fraction = ${Number(capitalizationMonths).toFixed(2)} / 12 = ${result.capitalizationFraction.toFixed(4)}.`,
                            `Capitalizable borrowing cost = ${formatPHP(result.annualAvoidableInterest)} x ${result.capitalizationFraction.toFixed(4)} = ${formatPHP(result.capitalizableBorrowingCost)}.`,
                        ]}
                        interpretation="This helper supports textbook borrowing-cost capitalization logic. Real cases may still require specific-borrowing priority rules, suspension periods, or actual-interest ceilings."
                        warnings={[
                            "Do not capitalize borrowing cost outside the period when asset construction and capitalization conditions are actually present.",
                            "If the problem gives specific-borrowing and weighted-average borrowing layers separately, follow the class method instead of forcing one blended rate.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
