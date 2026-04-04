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

export default function DebtRatioPage() {
    const [assets, setAssets] = useState("");
    const [liabilities, setLiabilities] = useState("");

    useSmartSolverConnector({
        assets: setAssets,
        liabilities: setLiabilities,
    });

    const result = useMemo(() => {
        if (assets.trim() === "" || liabilities.trim() === "") return null;

        const parsedAssets = Number(assets);
        const parsedLiabilities = Number(liabilities);

        if (Number.isNaN(parsedAssets) || Number.isNaN(parsedLiabilities)) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedAssets <= 0 || parsedLiabilities < 0) {
            return { error: "Assets must be greater than zero and liabilities cannot be negative." };
        }

        const debtRatio = (parsedLiabilities / parsedAssets) * 100;

        return {
            debtRatio,
            formula: <>Debt Ratio = Total Liabilities / Total Assets</>,
            steps: [
                `Debt Ratio = ${formatPHP(parsedLiabilities)} / ${formatPHP(parsedAssets)} = ${(debtRatio / 100).toFixed(4)}`,
                `Debt Ratio = ${debtRatio.toFixed(2)}%`,
            ],
            glossary: [
                { term: "Total Liabilities", meaning: "All obligations the entity owes to outsiders." },
                { term: "Total Assets", meaning: "All resources controlled by the entity that have economic value." },
                { term: "Debt Ratio", meaning: "The portion of total assets financed by debt rather than owners' equity." },
            ],
            interpretation:
                debtRatio >= 60
                    ? `A debt ratio of ${debtRatio.toFixed(2)}% means a relatively large portion of assets is financed by liabilities, which may indicate higher leverage risk.`
                    : `A debt ratio of ${debtRatio.toFixed(2)}% means less than two-thirds of assets are financed by liabilities, suggesting a more moderate debt position.`,
        };
    }, [assets, liabilities]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Analysis"
            title="Debt Ratio"
            description="Measure the proportion of assets financed by liabilities, a common topic in financial statement analysis."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Total Assets" value={assets} onChange={setAssets} placeholder="800000" />
                        <InputCard label="Total Liabilities" value={liabilities} onChange={setLiabilities} placeholder="420000" />
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
                        <ResultCard title="Debt Ratio" value={`${result.debtRatio.toFixed(2)}%`} />
                        <ResultCard title="Liabilities" value={formatPHP(Number(liabilities))} />
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
