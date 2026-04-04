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

export default function QuickRatioPage() {
    const [cash, setCash] = useState("");
    const [marketableSecurities, setMarketableSecurities] = useState("");
    const [netReceivables, setNetReceivables] = useState("");
    const [currentLiabilities, setCurrentLiabilities] = useState("");

    useSmartSolverConnector({
        cash: setCash,
        marketableSecurities: setMarketableSecurities,
        netReceivables: setNetReceivables,
        currentLiabilities: setCurrentLiabilities,
    });

    const result = useMemo(() => {
        const values = [cash, marketableSecurities, netReceivables, currentLiabilities];

        if (values.some((value) => value.trim() === "")) {
            return null;
        }

        const parsedCash = Number(cash);
        const parsedMarketableSecurities = Number(marketableSecurities);
        const parsedNetReceivables = Number(netReceivables);
        const parsedCurrentLiabilities = Number(currentLiabilities);

        const parsedValues = [
            parsedCash,
            parsedMarketableSecurities,
            parsedNetReceivables,
            parsedCurrentLiabilities,
        ];

        if (parsedValues.some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedValues.some((value) => value < 0)) {
            return { error: "Quick ratio inputs cannot be negative." };
        }

        if (parsedCurrentLiabilities === 0) {
            return { error: "Current liabilities cannot be zero when solving for quick ratio." };
        }

        const quickAssets = parsedCash + parsedMarketableSecurities + parsedNetReceivables;
        const quickRatio = quickAssets / parsedCurrentLiabilities;

        return {
            quickAssets,
            quickRatio,
            formula: (
                <>
                    Quick Assets = Cash + Marketable Securities + Net Receivables
                    <br />
                    Quick Ratio = Quick Assets / Current Liabilities
                </>
            ),
            steps: [
                `Quick Assets = ${formatPHP(parsedCash)} + ${formatPHP(parsedMarketableSecurities)} + ${formatPHP(parsedNetReceivables)} = ${formatPHP(quickAssets)}`,
                `Quick Ratio = ${formatPHP(quickAssets)} / ${formatPHP(parsedCurrentLiabilities)} = ${quickRatio.toFixed(2)}:1`,
            ],
        };
    }, [cash, currentLiabilities, marketableSecurities, netReceivables]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Analysis"
            title="Quick Ratio"
            description="Measure immediate liquidity using cash, marketable securities, receivables, and current liabilities."
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
                            label="Net Receivables"
                            value={netReceivables}
                            onChange={setNetReceivables}
                            placeholder="40000"
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
                        <ResultCard title="Quick Assets" value={formatPHP(result.quickAssets)} />
                        <ResultCard title="Quick Ratio" value={`${result.quickRatio.toFixed(2)} : 1`} />
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
