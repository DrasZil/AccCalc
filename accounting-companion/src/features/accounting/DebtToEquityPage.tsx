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

export default function DebtToEquityPage() {
    const [liabilities, setLiabilities] = useState("");
    const [equity, setEquity] = useState("");

    useSmartSolverConnector({
        liabilities: setLiabilities,
        equity: setEquity,
    });

    const result = useMemo(() => {
        if (liabilities.trim() === "" || equity.trim() === "") {
            return null;
        }

        const parsedLiabilities = Number(liabilities);
        const parsedEquity = Number(equity);

        if (Number.isNaN(parsedLiabilities) || Number.isNaN(parsedEquity)) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedLiabilities < 0 || parsedEquity < 0) {
            return { error: "Liabilities and equity cannot be negative." };
        }

        if (parsedEquity === 0) {
            return { error: "Equity cannot be zero when solving for debt to equity ratio." };
        }

        const debtToEquity = parsedLiabilities / parsedEquity;

        return {
            debtToEquity,
            formula: <>Debt to Equity Ratio = Total Liabilities / Total Equity</>,
            steps: [
                `Debt to Equity Ratio = ${formatPHP(parsedLiabilities)} / ${formatPHP(parsedEquity)} = ${debtToEquity.toFixed(2)}:1`,
            ],
        };
    }, [equity, liabilities]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Analysis"
            title="Debt to Equity Ratio"
            description="Measure leverage using total liabilities and total equity."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Total Liabilities"
                            value={liabilities}
                            onChange={setLiabilities}
                            placeholder="450000"
                        />
                        <InputCard
                            label="Total Equity"
                            value={equity}
                            onChange={setEquity}
                            placeholder="300000"
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
                    <ResultGrid columns={1}>
                        <ResultCard title="Debt to Equity Ratio" value={`${result.debtToEquity.toFixed(2)} : 1`} />
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
