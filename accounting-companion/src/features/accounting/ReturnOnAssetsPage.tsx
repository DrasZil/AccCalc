import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function ReturnOnAssetsPage() {
    const [netIncome, setNetIncome] = useState("");
    const [averageTotalAssets, setAverageTotalAssets] = useState("");

    useSmartSolverConnector({
        netIncome: setNetIncome,
        averageTotalAssets: setAverageTotalAssets,
    });

    const result = useMemo(() => {
        if (netIncome.trim() === "" || averageTotalAssets.trim() === "") {
            return null;
        }

        const parsedNetIncome = Number(netIncome);
        const parsedAverageTotalAssets = Number(averageTotalAssets);

        if (Number.isNaN(parsedNetIncome) || Number.isNaN(parsedAverageTotalAssets)) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedAverageTotalAssets <= 0) {
            return { error: "Average total assets must be greater than zero." };
        }

        const returnOnAssets = (parsedNetIncome / parsedAverageTotalAssets) * 100;

        return {
            returnOnAssets,
            averageTotalAssets: parsedAverageTotalAssets,
            formula: <>Return on Assets = Net Income / Average Total Assets</>,
            steps: [
                `Return on Assets = ${formatPHP(parsedNetIncome)} / ${formatPHP(parsedAverageTotalAssets)} = ${(returnOnAssets / 100).toFixed(4)}`,
                `Return on Assets = ${returnOnAssets.toFixed(2)}%`,
            ],
        };
    }, [averageTotalAssets, netIncome]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Analysis"
            title="Return on Assets"
            description="Compute return on assets using net income and average total assets."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Net Income"
                            value={netIncome}
                            onChange={setNetIncome}
                            placeholder="85000"
                        />
                        <InputCard
                            label="Average Total Assets"
                            value={averageTotalAssets}
                            onChange={setAverageTotalAssets}
                            placeholder="500000"
                        />
                    </InputGrid>
                </SectionCard>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={2}>
                        <ResultCard title="Return on Assets" value={`${result.returnOnAssets.toFixed(2)}%`} />
                        <ResultCard title="Average Total Assets" value={formatPHP(result.averageTotalAssets)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard formula={result.formula} steps={result.steps} />
                ) : null
            }
        />
    );
}
