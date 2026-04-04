import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeCashRatio } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function CashRatioPage() {
    const [cash, setCash] = useState("");
    const [marketableSecurities, setMarketableSecurities] = useState("");
    const [currentLiabilities, setCurrentLiabilities] = useState("");

    useSmartSolverConnector({
        cash: setCash,
        marketableSecurities: setMarketableSecurities,
        currentLiabilities: setCurrentLiabilities,
    });

    const result = useMemo(() => {
        if (
            cash.trim() === "" ||
            marketableSecurities.trim() === "" ||
            currentLiabilities.trim() === ""
        ) {
            return null;
        }

        const parsedCash = Number(cash);
        const parsedMarketableSecurities = Number(marketableSecurities);
        const parsedCurrentLiabilities = Number(currentLiabilities);

        if ([parsedCash, parsedMarketableSecurities, parsedCurrentLiabilities].some(Number.isNaN)) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedCash < 0 || parsedMarketableSecurities < 0 || parsedCurrentLiabilities <= 0) {
            return { error: "Cash and marketable securities cannot be negative, and current liabilities must be greater than zero." };
        }

        const { cashAssets, cashRatio } = computeCashRatio(
            parsedCash,
            parsedMarketableSecurities,
            parsedCurrentLiabilities
        );

        return {
            cashAssets,
            cashRatio,
            formula: "Cash Ratio = (Cash + Marketable Securities) / Current Liabilities",
            steps: [
                `Cash assets = ${formatPHP(parsedCash)} + ${formatPHP(parsedMarketableSecurities)} = ${formatPHP(cashAssets)}`,
                `Cash ratio = ${formatPHP(cashAssets)} / ${formatPHP(parsedCurrentLiabilities)} = ${cashRatio.toFixed(2)}:1`,
            ],
            glossary: [
                { term: "Cash", meaning: "Currency and demand deposits immediately available for use." },
                { term: "Marketable Securities", meaning: "Very liquid short-term investments that can be converted into cash quickly." },
                { term: "Cash Ratio", meaning: "A very strict liquidity ratio that compares the most liquid assets against current liabilities." },
            ],
            interpretation:
                cashRatio >= 1
                    ? `A cash ratio of ${cashRatio.toFixed(2)}:1 suggests the entity can cover current liabilities using only its most liquid resources.`
                    : `A cash ratio of ${cashRatio.toFixed(2)}:1 suggests the entity needs receivables, inventory, or future cash inflows to fully settle current liabilities.`,
        };
    }, [cash, currentLiabilities, marketableSecurities]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Analysis"
            title="Cash Ratio"
            description="Measure the strictest short-term liquidity coverage using cash, marketable securities, and current liabilities."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Cash" value={cash} onChange={setCash} placeholder="50000" />
                        <InputCard
                            label="Marketable Securities"
                            value={marketableSecurities}
                            onChange={setMarketableSecurities}
                            placeholder="25000"
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
                        <ResultCard title="Cash Assets" value={formatPHP(result.cashAssets)} />
                        <ResultCard title="Cash Ratio" value={`${result.cashRatio.toFixed(2)} : 1`} />
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
