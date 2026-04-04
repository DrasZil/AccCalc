import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeCurrentRatio } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function CurrentRatioPage() {
    const [currentAssets, setCurrentAssets] = useState("");
    const [currentLiabilities, setCurrentLiabilities] = useState("");

    useSmartSolverConnector({
        currentAssets: setCurrentAssets,
        currentLiabilities: setCurrentLiabilities,
    });

    const result = useMemo(() => {
        if (currentAssets.trim() === "" || currentLiabilities.trim() === "") {
            return null;
        }

        const assets = Number(currentAssets);
        const liabilities = Number(currentLiabilities);

        if (Number.isNaN(assets) || Number.isNaN(liabilities)) {
            return { error: "All inputs must be valid numbers." };
        }

        if (assets < 0 || liabilities < 0) {
            return { error: "Current assets and current liabilities cannot be negative." };
        }

        if (liabilities === 0) {
            return { error: "Current liabilities cannot be zero when solving for current ratio." };
        }

        const { currentRatio, workingCapital } = computeCurrentRatio({
            currentAssets: assets,
            currentLiabilities: liabilities,
        });

        return {
            currentRatio,
            workingCapital,
            formula: (
                <>
                    Current Ratio = Current Assets / Current Liabilities
                    <br />
                    Working Capital = Current Assets - Current Liabilities
                </>
            ),
            steps: [
                `Current Ratio = ${formatPHP(assets)} / ${formatPHP(liabilities)} = ${currentRatio.toFixed(2)}:1`,
                `Working Capital = ${formatPHP(assets)} - ${formatPHP(liabilities)} = ${formatPHP(workingCapital)}`,
            ],
            glossary: [
                { term: "Current Assets", meaning: "Assets expected to be converted into cash or used within one year or one operating cycle." },
                { term: "Current Liabilities", meaning: "Obligations expected to be settled within one year or one operating cycle." },
                { term: "Current Ratio", meaning: "A liquidity ratio that compares current assets with current liabilities." },
                { term: "Working Capital", meaning: "The excess of current assets over current liabilities." },
            ],
            interpretation:
                currentRatio >= 1
                    ? `A current ratio of ${currentRatio.toFixed(2)}:1 suggests the entity has more current assets than current liabilities. Working capital is ${formatPHP(workingCapital)}.`
                    : `A current ratio of ${currentRatio.toFixed(2)}:1 suggests current liabilities exceed current asset coverage, so liquidity should be monitored carefully.`,
        };
    }, [currentAssets, currentLiabilities]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Analysis"
            title="Current Ratio & Working Capital"
            description="Measure short-term liquidity using current assets and current liabilities."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Current Assets"
                            value={currentAssets}
                            onChange={setCurrentAssets}
                            placeholder="250000"
                        />
                        <InputCard
                            label="Current Liabilities"
                            value={currentLiabilities}
                            onChange={setCurrentLiabilities}
                            placeholder="100000"
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
                        <ResultCard title="Current Ratio" value={`${result.currentRatio.toFixed(2)} : 1`} />
                        <ResultCard title="Working Capital" value={formatPHP(result.workingCapital)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula={result.formula}
                        steps={result.steps}
                        glossary={result.glossary}
                        interpretation={result.interpretation}
                    />
                ) : null
            }
        />
    );
}
