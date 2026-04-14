import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeConstructionRevenue } from "../../utils/calculatorMath";

function formatPercent(value: number) {
    return `${(value * 100).toFixed(2)}%`;
}

export default function ConstructionRevenuePage() {
    const [contractPrice, setContractPrice] = useState("");
    const [costsIncurredToDate, setCostsIncurredToDate] = useState("");
    const [estimatedCostsToComplete, setEstimatedCostsToComplete] = useState("");
    const [billingsToDate, setBillingsToDate] = useState("");
    const [collectionsToDate, setCollectionsToDate] = useState("");

    const result = useMemo(() => {
        if (
            contractPrice.trim() === "" ||
            costsIncurredToDate.trim() === "" ||
            estimatedCostsToComplete.trim() === ""
        ) {
            return null;
        }

        const required = [
            Number(contractPrice),
            Number(costsIncurredToDate),
            Number(estimatedCostsToComplete),
        ];

        if (required.some((value) => Number.isNaN(value))) {
            return { error: "Contract price, costs incurred, and estimated costs to complete must be valid numbers." };
        }

        return computeConstructionRevenue({
            contractPrice: required[0],
            costsIncurredToDate: required[1],
            estimatedCostsToComplete: required[2],
            billingsToDate: billingsToDate.trim() === "" ? 0 : Number(billingsToDate),
            collectionsToDate: collectionsToDate.trim() === "" ? 0 : Number(collectionsToDate),
        });
    }, [
        billingsToDate,
        collectionsToDate,
        contractPrice,
        costsIncurredToDate,
        estimatedCostsToComplete,
    ]);

    return (
        <CalculatorPageLayout
            badge="AFAR"
            title="Construction Revenue Workspace"
            description="Estimate percentage of completion, revenue recognized to date, gross profit, and the contract asset-or-liability position for long-term construction cases."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Contract Price" value={contractPrice} onChange={setContractPrice} placeholder="12000000" />
                        <InputCard label="Costs Incurred to Date" value={costsIncurredToDate} onChange={setCostsIncurredToDate} placeholder="4200000" />
                        <InputCard label="Estimated Costs to Complete" value={estimatedCostsToComplete} onChange={setEstimatedCostsToComplete} placeholder="2800000" />
                        <InputCard label="Billings to Date" value={billingsToDate} onChange={setBillingsToDate} placeholder="5000000" />
                        <InputCard label="Collections to Date" value={collectionsToDate} onChange={setCollectionsToDate} placeholder="4600000" />
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
                            <ResultCard title="Estimated Total Cost" value={formatPHP(result.estimatedTotalCost)} tone="accent" />
                            <ResultCard title="Percentage Complete" value={formatPercent(result.percentComplete)} />
                            <ResultCard title="Revenue Recognized to Date" value={formatPHP(result.revenueRecognizedToDate)} />
                            <ResultCard title="Gross Profit to Date" value={formatPHP(result.grossProfitRecognizedToDate)} />
                            <ResultCard title={result.positionLabel} value={formatPHP(Math.abs(result.contractAssetLiabilityPosition))} />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Billing follow-through</p>
                            <p className="app-body-md mt-2 text-sm">
                                Uncollected billings currently stand at {formatPHP(result.uncollectedBillings)}.
                                Use this together with the contract asset-or-liability position so
                                revenue recognition, billing, and collection status do not get mixed.
                            </p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Percentage complete = costs incurred to date / estimated total cost; Revenue recognized to date = contract price x percentage complete"
                        steps={[
                            `Estimated total cost = ${formatPHP(result.estimatedTotalCost)}.`,
                            `Percentage complete = ${formatPercent(result.percentComplete)}.`,
                            `Revenue recognized to date = ${formatPHP(result.revenueRecognizedToDate)}.`,
                            `Gross profit recognized to date = ${formatPHP(result.grossProfitRecognizedToDate)}.`,
                        ]}
                        interpretation="This is most useful when the classroom case focuses on progress-based revenue recognition and contract position analysis."
                        warnings={[
                            "The page is a first-pass cost-to-cost model. More specialized revenue constraints, change orders, and claims still need separate judgment.",
                            "Contract asset or liability position depends on revenue recognized versus billings, not collections.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
