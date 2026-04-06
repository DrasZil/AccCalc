import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import TextAreaCard from "../../components/TextAreaCard";
import { computeNetPresentValue } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { parseNumberList } from "../../utils/listParsers";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function NetPresentValuePage() {
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

        const { discountedCashFlows, totalPresentValue, netPresentValue, rateDecimal } =
            computeNetPresentValue(investment, rate, parsedCashFlows.values, parsedTerminalCashFlow);
        const sensitivityRates = [
            Math.max(rate - 2, -99),
            rate,
            rate + 2,
        ].map((sampleRate) => ({
            rate: sampleRate,
            npv: computeNetPresentValue(
                investment,
                sampleRate,
                parsedCashFlows.values,
                parsedTerminalCashFlow
            ).netPresentValue,
        }));

        return {
            discountedCashFlows,
            totalPresentValue,
            netPresentValue,
            rateDecimal,
            terminalCashFlow: parsedTerminalCashFlow,
            sensitivityRates,
            formula: "NPV = Sum of discounted cash inflows - Initial investment",
            steps: [
                `Initial investment = ${formatPHP(investment)}`,
                `Discount rate = ${rate.toFixed(2)}% = ${rateDecimal.toFixed(4)}`,
                ...discountedCashFlows.map(
                    (entry) =>
                        `Period ${entry.period}: ${formatPHP(entry.cashFlow)} x ${entry.discountFactor.toFixed(6)} = ${formatPHP(entry.presentValue)}`
                ),
                `Total present value of inflows = ${formatPHP(totalPresentValue)}`,
                `NPV = ${formatPHP(totalPresentValue)} - ${formatPHP(investment)} = ${formatPHP(netPresentValue)}`,
            ],
            glossary: [
                { term: "Initial investment", meaning: "The cash outflow required at the start of the project." },
                { term: "Discount rate", meaning: "The required rate of return used to discount future cash flows." },
                { term: "Net present value", meaning: "The excess of discounted cash inflows over the initial investment." },
                { term: "Terminal cash flow", meaning: "A final-period salvage value, release of working capital, or other one-time terminal receipt." },
            ],
            interpretation:
                netPresentValue >= 0
                    ? `The project has a positive NPV of ${formatPHP(netPresentValue)}, so the discounted inflows recover the investment and exceed the required return.`
                    : `The project has a negative NPV of ${formatPHP(netPresentValue)}, so discounted inflows fall short of the required return.`,
        };
    }, [cashFlows, discountRate, initialInvestment]);

    return (
        <CalculatorPageLayout
            badge="Finance"
            title="Net Present Value"
            description="Discount a stream of future cash flows and compare the result with the initial investment."
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
                                helperText="Add salvage value or final working-capital recovery if needed."
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
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard title="Net Present Value" value={formatPHP(result.netPresentValue)} />
                            <ResultCard title="Present Value of Inflows" value={formatPHP(result.totalPresentValue)} />
                            <ResultCard title="Terminal Cash Flow" value={formatPHP(result.terminalCashFlow)} />
                            <ResultCard
                                title="Decision"
                                value={result.netPresentValue >= 0 ? "Accept" : "Reject"}
                                supportingText="Positive NPV supports acceptance under the required return."
                            />
                        </ResultGrid>

                        <SectionCard>
                            <p className="app-card-title text-sm">Sensitivity snapshot</p>
                            <div className="mt-3 grid gap-3 md:grid-cols-3">
                                {result.sensitivityRates.map((entry) => (
                                    <div
                                        key={entry.rate}
                                        className="app-subtle-surface rounded-[1rem] px-4 py-3"
                                    >
                                        <p className="app-label">{entry.rate.toFixed(2)}% rate</p>
                                        <p className="mt-2 text-sm font-semibold text-[color:var(--app-text)]">
                                            {formatPHP(entry.npv)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </div>
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
                            "Cash flows are assumed to occur at the end of each period.",
                            "Use consistent periods for both the discount rate and the listed cash flows.",
                            "The optional terminal cash flow is added to the last listed period only.",
                        ]}
                        notes={[
                            "The sensitivity snapshot shifts the discount rate by two percentage points to show how quickly the NPV changes when the required return moves.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
