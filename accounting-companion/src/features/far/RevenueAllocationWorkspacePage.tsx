import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeRevenueAllocationAnalysis } from "../../utils/calculatorMath";

export default function RevenueAllocationWorkspacePage() {
    const [transactionPrice, setTransactionPrice] = useState("120000");
    const [standaloneSellingPriceA, setStandaloneSellingPriceA] = useState("90000");
    const [standaloneSellingPriceB, setStandaloneSellingPriceB] = useState("60000");
    const [percentSatisfiedA, setPercentSatisfiedA] = useState("100");
    const [percentSatisfiedB, setPercentSatisfiedB] = useState("40");
    const [considerationReceived, setConsiderationReceived] = useState("100000");

    const result = useMemo(() => {
        const values = [
            transactionPrice,
            standaloneSellingPriceA,
            standaloneSellingPriceB,
            percentSatisfiedA,
            percentSatisfiedB,
            considerationReceived,
        ];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All revenue-allocation inputs must be valid numbers." };
        }
        if (numeric[0] < 0 || numeric[1] <= 0 || numeric[2] <= 0) {
            return {
                error:
                    "Transaction price cannot be negative, and each standalone selling price must be greater than zero.",
            };
        }
        if (numeric[3] < 0 || numeric[3] > 100 || numeric[4] < 0 || numeric[4] > 100) {
            return { error: "Satisfied percentages must be between 0 and 100." };
        }

        return computeRevenueAllocationAnalysis({
            transactionPrice: numeric[0],
            standaloneSellingPriceA: numeric[1],
            standaloneSellingPriceB: numeric[2],
            percentSatisfiedA: numeric[3],
            percentSatisfiedB: numeric[4],
            considerationReceived: numeric[5],
        });
    }, [
        considerationReceived,
        percentSatisfiedA,
        percentSatisfiedB,
        standaloneSellingPriceA,
        standaloneSellingPriceB,
        transactionPrice,
    ]);

    return (
        <CalculatorPageLayout
            badge="FAR | Revenue"
            title="Revenue Allocation Workspace"
            description="Allocate a bundled transaction price to two performance obligations, recognize revenue by satisfaction progress, and read the contract asset or liability signal."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Transaction Price"
                            value={transactionPrice}
                            onChange={setTransactionPrice}
                            placeholder="120000"
                        />
                        <InputCard
                            label="Standalone Selling Price A"
                            value={standaloneSellingPriceA}
                            onChange={setStandaloneSellingPriceA}
                            placeholder="90000"
                        />
                        <InputCard
                            label="Standalone Selling Price B"
                            value={standaloneSellingPriceB}
                            onChange={setStandaloneSellingPriceB}
                            placeholder="60000"
                        />
                        <InputCard
                            label="Obligation A Satisfied (%)"
                            value={percentSatisfiedA}
                            onChange={setPercentSatisfiedA}
                            placeholder="100"
                        />
                        <InputCard
                            label="Obligation B Satisfied (%)"
                            value={percentSatisfiedB}
                            onChange={setPercentSatisfiedB}
                            placeholder="40"
                        />
                        <InputCard
                            label="Consideration Received"
                            value={considerationReceived}
                            onChange={setConsiderationReceived}
                            placeholder="100000"
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
                        <ResultGrid columns={4}>
                            <ResultCard
                                title="Revenue Recognized"
                                value={formatPHP(result.revenueRecognized)}
                                tone="accent"
                            />
                            <ResultCard title="Allocation A" value={formatPHP(result.allocationA)} />
                            <ResultCard title="Allocation B" value={formatPHP(result.allocationB)} />
                            <ResultCard
                                title={result.contractLiability > 0 ? "Contract Liability" : "Contract Asset"}
                                value={formatPHP(
                                    result.contractLiability > 0
                                        ? result.contractLiability
                                        : result.contractAsset
                                )}
                            />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Recognition signal</p>
                            <p className="app-body-md mt-2 text-sm">{result.recognitionSignal}</p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Allocation = transaction price x relative SSP; revenue = allocation x satisfaction percentage"
                        steps={[
                            `Total SSP = ${formatPHP(result.totalStandaloneSellingPrice)}.`,
                            `Allocation A = ${formatPHP(Number(transactionPrice))} x relative SSP = ${formatPHP(result.allocationA)}.`,
                            `Allocation B = ${formatPHP(Number(transactionPrice))} x relative SSP = ${formatPHP(result.allocationB)}.`,
                            `Recognized revenue = ${formatPHP(result.revenueA)} + ${formatPHP(result.revenueB)} = ${formatPHP(result.revenueRecognized)}.`,
                        ]}
                        interpretation="This workspace is a classroom support tool for revenue-allocation problems. It assumes two performance obligations and uses the entered satisfaction percentages as the recognition basis."
                        warnings={[
                            "Identify distinct performance obligations before using the allocation.",
                            "Do not treat cash received as revenue when performance remains unsatisfied.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
