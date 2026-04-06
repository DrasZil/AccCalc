import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import TextAreaCard from "../../components/TextAreaCard";
import { computeProfitabilityIndex } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { parseNumberList } from "../../utils/listParsers";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function ProfitabilityIndexPage() {
    const [initialInvestment, setInitialInvestment] = useState("");
    const [discountRate, setDiscountRate] = useState("");
    const [cashFlows, setCashFlows] = useState("");
    const [terminalCashFlow, setTerminalCashFlow] = useState("");

    useSmartSolverConnector({
        initialInvestment: setInitialInvestment,
        discountRate: setDiscountRate,
    });

    const result = useMemo(() => {
        if (
            initialInvestment.trim() === "" ||
            discountRate.trim() === "" ||
            cashFlows.trim() === ""
        ) {
            return null;
        }

        const investment = Number(initialInvestment);
        const rate = Number(discountRate);
        const parsedCashFlows = parseNumberList(cashFlows);
        const parsedTerminalCashFlow =
            terminalCashFlow.trim() === "" ? 0 : Number(terminalCashFlow);

        if (Number.isNaN(investment) || Number.isNaN(rate) || Number.isNaN(parsedTerminalCashFlow)) {
            return { error: "Initial investment, discount rate, and terminal cash flow must be valid numbers." };
        }

        if (investment <= 0) {
            return { error: "Initial investment must be greater than zero." };
        }

        if (rate <= -100) {
            return { error: "Discount rate must be greater than -100%." };
        }

        if (parsedCashFlows.error) {
            return { error: parsedCashFlows.error };
        }

        if (!parsedCashFlows.values.length) {
            return { error: "Enter at least one operating cash flow period." };
        }

        const { profitabilityIndex, totalPresentValue, netPresentValue } =
            computeProfitabilityIndex(
                investment,
                rate,
                parsedCashFlows.values,
                parsedTerminalCashFlow
            );

        return {
            profitabilityIndex,
            totalPresentValue,
            netPresentValue,
            terminalCashFlow: parsedTerminalCashFlow,
            formula: "Profitability Index = Present value of future cash inflows / Initial investment",
            steps: [
                `Present value of future cash inflows = ${formatPHP(totalPresentValue)}`,
                `Initial investment = ${formatPHP(investment)}`,
                `Profitability index = ${formatPHP(totalPresentValue)} / ${formatPHP(investment)} = ${profitabilityIndex.toFixed(4)}`,
                `Related NPV = ${formatPHP(netPresentValue)}`,
            ],
            glossary: [
                { term: "Profitability index", meaning: "The discounted inflows generated for every peso invested." },
                { term: "Present value of inflows", meaning: "The discounted value of all expected future cash inflows." },
            ],
            interpretation:
                profitabilityIndex >= 1
                    ? `A profitability index of ${profitabilityIndex.toFixed(4)} means discounted inflows are at least equal to the initial investment.`
                    : `A profitability index of ${profitabilityIndex.toFixed(4)} means discounted inflows do not fully recover the initial investment.`,
        };
    }, [cashFlows, discountRate, initialInvestment]);

    return (
        <CalculatorPageLayout
            badge="Finance"
            title="Profitability Index"
            description="Measure discounted inflows per peso of initial investment."
            inputSection={
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <SectionCard>
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputCard
                                label="Initial Investment"
                                value={initialInvestment}
                                onChange={setInitialInvestment}
                                placeholder="100000"
                            />
                            <InputCard
                                label="Discount Rate (%)"
                                value={discountRate}
                                onChange={setDiscountRate}
                                placeholder="12"
                            />
                            <InputCard
                                label="Terminal Cash Flow (optional)"
                                value={terminalCashFlow}
                                onChange={setTerminalCashFlow}
                                placeholder="25000"
                                helperText="Use this for salvage value or another final-period receipt."
                            />
                        </div>
                    </SectionCard>
                    <TextAreaCard
                        label="Cash Flows by Period"
                        value={cashFlows}
                        onChange={setCashFlows}
                        placeholder="30000, 35000, 40000, 45000"
                    />
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={3}>
                        <ResultCard title="Profitability Index" value={result.profitabilityIndex.toFixed(4)} />
                        <ResultCard title="Present Value of Inflows" value={formatPHP(result.totalPresentValue)} />
                        <ResultCard
                            title="Decision"
                            value={result.profitabilityIndex >= 1 ? "Accept" : "Reject"}
                            supportingText={`Related NPV: ${formatPHP(result.netPresentValue)}`}
                        />
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
                        assumptions={[
                            "The optional terminal cash flow is added to the final listed period only.",
                            "A profitability index of at least 1.00 aligns with a non-negative NPV under the same assumptions.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
