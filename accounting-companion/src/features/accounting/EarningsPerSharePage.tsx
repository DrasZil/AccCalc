import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function EarningsPerSharePage() {
    const [netIncome, setNetIncome] = useState("");
    const [preferredDividends, setPreferredDividends] = useState("");
    const [weightedAverageCommonShares, setWeightedAverageCommonShares] = useState("");

    useSmartSolverConnector({
        netIncome: setNetIncome,
        preferredDividends: setPreferredDividends,
        weightedAverageCommonShares: setWeightedAverageCommonShares,
    });

    const result = useMemo(() => {
        if (
            netIncome.trim() === "" ||
            preferredDividends.trim() === "" ||
            weightedAverageCommonShares.trim() === ""
        ) {
            return null;
        }

        const parsedNetIncome = Number(netIncome);
        const parsedPreferredDividends = Number(preferredDividends);
        const parsedWeightedAverageCommonShares = Number(weightedAverageCommonShares);

        if (
            [parsedNetIncome, parsedPreferredDividends, parsedWeightedAverageCommonShares].some((value) =>
                Number.isNaN(value)
            )
        ) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedWeightedAverageCommonShares <= 0) {
            return { error: "Weighted average common shares must be greater than zero." };
        }

        const earningsAvailableToCommon =
            parsedNetIncome - parsedPreferredDividends;
        const earningsPerShare =
            earningsAvailableToCommon / parsedWeightedAverageCommonShares;

        return {
            earningsAvailableToCommon,
            earningsPerShare,
            formula:
                "Earnings Per Share = (Net Income - Preferred Dividends) / Weighted Average Common Shares",
            steps: [
                `Earnings available to common = ${parsedNetIncome} - ${parsedPreferredDividends} = ${earningsAvailableToCommon}`,
                `EPS = ${earningsAvailableToCommon} / ${parsedWeightedAverageCommonShares} = ${earningsPerShare}`,
            ],
            glossary: [
                { term: "Net Income", meaning: "Profit remaining after all expenses for the period." },
                { term: "Preferred Dividends", meaning: "Portion of earnings belonging to preferred shareholders before common shareholders." },
                { term: "Weighted Average Common Shares", meaning: "Average number of common shares outstanding during the period." },
                { term: "Earnings Per Share", meaning: "Profit attributable to each common share." },
            ],
            interpretation:
                earningsPerShare >= 0
                    ? `An EPS of ${earningsPerShare.toFixed(4)} means each common share earned about ${earningsPerShare.toFixed(4)} units of profit for the period.`
                    : `A negative EPS of ${earningsPerShare.toFixed(4)} means the business reported a loss attributable to common shares.`,
        };
    }, [netIncome, preferredDividends, weightedAverageCommonShares]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Analysis"
            title="Earnings Per Share"
            description="Compute basic earnings per share using net income, preferred dividends, and weighted average common shares."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Net Income" value={netIncome} onChange={setNetIncome} placeholder="1200000" />
                        <InputCard label="Preferred Dividends" value={preferredDividends} onChange={setPreferredDividends} placeholder="100000" />
                        <InputCard
                            label="Weighted Average Common Shares"
                            value={weightedAverageCommonShares}
                            onChange={setWeightedAverageCommonShares}
                            placeholder="250000"
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
                        <ResultCard title="Earnings Available to Common" value={result.earningsAvailableToCommon.toFixed(2)} />
                        <ResultCard title="Earnings Per Share" value={result.earningsPerShare.toFixed(4)} />
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
