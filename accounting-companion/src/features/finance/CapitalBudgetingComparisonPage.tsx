import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import TextAreaCard from "../../components/TextAreaCard";
import { computeCapitalBudgetingComparison } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { parseNumberList } from "../../utils/listParsers";

export default function CapitalBudgetingComparisonPage() {
    const [initialInvestment, setInitialInvestment] = useState("");
    const [discountRate, setDiscountRate] = useState("");
    const [cashFlows, setCashFlows] = useState("");
    const [terminalCashFlow, setTerminalCashFlow] = useState("");

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
        const terminalValue =
            terminalCashFlow.trim() === "" ? 0 : Number(terminalCashFlow);
        const parsedCashFlows = parseNumberList(cashFlows);

        if (
            Number.isNaN(investment) ||
            Number.isNaN(rate) ||
            Number.isNaN(terminalValue)
        ) {
            return { error: "Initial investment, discount rate, and terminal cash flow must be valid numbers." };
        }

        if (investment <= 0) {
            return { error: "Initial investment must be greater than zero." };
        }

        if (rate <= -100) {
            return { error: "Discount rate must stay above -100%." };
        }

        if (parsedCashFlows.error) {
            return { error: parsedCashFlows.error };
        }

        if (!parsedCashFlows.values.length) {
            return { error: "Enter at least one cash-flow period." };
        }

        return computeCapitalBudgetingComparison(
            investment,
            rate,
            parsedCashFlows.values,
            terminalValue
        );
    }, [cashFlows, discountRate, initialInvestment, terminalCashFlow]);

    return (
        <CalculatorPageLayout
            badge="Finance / Capital Budgeting"
            title="Capital Budgeting Comparison"
            description="See NPV, profitability index, IRR, and discounted payback together so project decisions are not judged on a single metric alone."
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
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    (() => {
                        const irrValue = result.internalRateOfReturn.irrPercent as
                            | number
                            | null;
                        const paybackValue = result.discountedPayback.paybackPeriod as
                            | number
                            | null;

                        return (
                            <div className="space-y-4">
                                <ResultGrid columns={4}>
                                    <ResultCard
                                        title="Decision"
                                        value={result.decision}
                                        tone={
                                            result.decision === "Accept"
                                                ? "success"
                                                : "warning"
                                        }
                                    />
                                    <ResultCard
                                        title="Net Present Value"
                                        value={formatPHP(result.npv.netPresentValue)}
                                    />
                                    <ResultCard
                                        title="Profitability Index"
                                        value={result.profitabilityIndex.profitabilityIndex.toFixed(3)}
                                    />
                                    <ResultCard
                                        title="IRR"
                                        value={
                                            typeof irrValue !== "number"
                                                ? "No single IRR"
                                                : `${irrValue.toFixed(2)}%`
                                        }
                                    />
                                    <ResultCard
                                        title="Discounted Payback"
                                        value={
                                            typeof paybackValue !== "number"
                                                ? "Not recovered"
                                                : `${paybackValue.toFixed(2)} periods`
                                        }
                                    />
                                    <ResultCard
                                        title="PV of Inflows"
                                        value={formatPHP(result.npv.totalPresentValue)}
                                    />
                                </ResultGrid>
                            </div>
                        );
                    })()
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    (() => {
                        const irrValue = result.internalRateOfReturn.irrPercent as
                            | number
                            | null;
                        const paybackValue = result.discountedPayback.paybackPeriod as
                            | number
                            | null;
                        const irrIterations =
                            "iterations" in result.internalRateOfReturn
                                ? result.internalRateOfReturn.iterations
                                : 0;

                        return (
                            <FormulaCard
                                formula="Compare NPV, PI, IRR, and discounted payback from one project cash-flow set instead of reading each metric in isolation."
                                steps={[
                                    `NPV = ${formatPHP(result.npv.totalPresentValue)} - ${formatPHP(Number(initialInvestment))} = ${formatPHP(result.npv.netPresentValue)}.`,
                                    `Profitability index = ${formatPHP(result.profitabilityIndex.totalPresentValue)} / ${formatPHP(Number(initialInvestment))} = ${result.profitabilityIndex.profitabilityIndex.toFixed(3)}.`,
                                    typeof irrValue !== "number"
                                        ? "A single IRR could not be isolated across the tested rate range."
                                        : `IRR ~= ${irrValue.toFixed(2)}% with ${irrIterations} bisection iterations.`,
                                    typeof paybackValue !== "number"
                                        ? "Discounted payback is not achieved within the listed periods."
                                        : `Discounted payback ~= ${paybackValue.toFixed(2)} periods.`,
                                ]}
                                interpretation={`The project summary is ${result.decision}. Use NPV and PI for value creation, IRR for rate-based reading, and discounted payback for recovery speed.`}
                                warnings={
                                    result.internalRateOfReturn.multipleIrRisk
                                        ? [
                                              "The cash-flow pattern has multiple sign changes, so more than one IRR may exist. Rely more heavily on NPV and PI in that situation.",
                                          ]
                                        : undefined
                                }
                            />
                        );
                    })()
                ) : null
            }
        />
    );
}
