import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import TextAreaCard from "../../components/TextAreaCard";
import { computeInternalRateOfReturn } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { parseNumberList } from "../../utils/listParsers";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export default function InternalRateOfReturnPage() {
    const [initialInvestment, setInitialInvestment] = useState("");
    const [cashFlows, setCashFlows] = useState("");
    const [terminalCashFlow, setTerminalCashFlow] = useState("");
    const [requiredRate, setRequiredRate] = useState("");

    useSmartSolverConnector({
        initialInvestment: setInitialInvestment,
    });

    const result = useMemo(() => {
        if (initialInvestment.trim() === "" || cashFlows.trim() === "") {
            return null;
        }

        const parsedInvestment = Number(initialInvestment);
        const parsedCashFlows = parseNumberList(cashFlows);
        const parsedTerminalCashFlow =
            terminalCashFlow.trim() === "" ? 0 : Number(terminalCashFlow);
        const parsedRequiredRate =
            requiredRate.trim() === "" ? null : Number(requiredRate);

        if (Number.isNaN(parsedInvestment) || Number.isNaN(parsedTerminalCashFlow)) {
            return { error: "Initial investment and terminal cash flow must be valid numbers." };
        }

        if (parsedRequiredRate !== null && Number.isNaN(parsedRequiredRate)) {
            return { error: "Required return must be a valid percentage when provided." };
        }

        if (parsedInvestment <= 0) {
            return { error: "Initial investment must be greater than zero." };
        }

        if (parsedCashFlows.error) {
            return { error: parsedCashFlows.error };
        }

        if (!parsedCashFlows.values.length) {
            return { error: "Enter at least one operating cash flow period." };
        }

        const analysis = computeInternalRateOfReturn(
            parsedInvestment,
            parsedCashFlows.values,
            parsedTerminalCashFlow
        );

        return {
            ...analysis,
            terminalCashFlow: parsedTerminalCashFlow,
            requiredRate: parsedRequiredRate,
            status:
                analysis.hasSolution && parsedRequiredRate !== null
                    ? analysis.irrPercent! >= parsedRequiredRate
                        ? "Accept"
                        : "Reject"
                    : analysis.hasSolution
                      ? "Computed"
                      : "Review cash-flow pattern",
        };
    }, [cashFlows, initialInvestment, requiredRate, terminalCashFlow]);

    return (
        <CalculatorPageLayout
            badge="Finance / Capital Budgeting"
            title="Internal Rate of Return"
            description="Estimate the discount rate that drives NPV to zero, while flagging cases where the cash-flow pattern may not support one clean IRR."
            inputSection={
                <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
                    <SectionCard>
                        <InputGrid columns={2}>
                            <InputCard
                                label="Initial Investment"
                                value={initialInvestment}
                                onChange={setInitialInvestment}
                                placeholder="250000"
                                helperText="Enter the cash outflow at period 0."
                            />
                            <InputCard
                                label="Terminal Cash Flow (optional)"
                                value={terminalCashFlow}
                                onChange={setTerminalCashFlow}
                                placeholder="30000"
                                helperText="Use salvage value or a final release of working capital if applicable."
                            />
                            <InputCard
                                label="Required Return (%) (optional)"
                                value={requiredRate}
                                onChange={setRequiredRate}
                                placeholder="14"
                                helperText="Add a hurdle rate only if you want an accept/reject reading."
                            />
                        </InputGrid>
                    </SectionCard>

                    <TextAreaCard
                        label="Operating Cash Flows by Period"
                        value={cashFlows}
                        onChange={setCashFlows}
                        placeholder="70000, 80000, 90000, 85000"
                        rows={5}
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
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard
                                title="IRR"
                                value={
                                    result.hasSolution && result.irrPercent !== null
                                        ? formatPercent(result.irrPercent)
                                        : "No single IRR"
                                }
                                tone={result.hasSolution ? "accent" : "warning"}
                            />
                            <ResultCard
                                title="Status"
                                value={result.status}
                                supportingText={
                                    result.requiredRate !== null
                                        ? `Compared with ${formatPercent(result.requiredRate)} hurdle rate`
                                        : "Use NPV as a companion check when rates are uncertain."
                                }
                            />
                            <ResultCard
                                title="Sign Changes"
                                value={String(result.signChanges)}
                                supportingText={
                                    result.multipleIrRisk
                                        ? "More than one sign change can create multiple IRRs."
                                        : "Single sign-change patterns usually give one clean IRR."
                                }
                            />
                            <ResultCard
                                title="Terminal Cash Flow"
                                value={formatPHP(result.terminalCashFlow)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <p className="app-card-title text-sm">IRR reading</p>
                            <p className="app-body-md mt-2 text-sm">
                                {result.hasSolution && result.irrPercent !== null
                                    ? `The estimated IRR is ${formatPercent(result.irrPercent)}. ${
                                          result.requiredRate !== null
                                              ? result.irrPercent >= result.requiredRate
                                                  ? "That clears the required return, so the project would ordinarily be accepted under a standard capital-budgeting rule."
                                                  : "That falls short of the required return, so the project would ordinarily be rejected under a standard capital-budgeting rule."
                                              : "Use this rate as the break-even return, then compare it with the required return or cost of capital for the final decision."
                                      }`
                                    : result.reason}
                            </p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="IRR is the rate that makes the net present value of the full cash-flow stream equal to zero."
                        steps={
                            result.hasSolution && result.irrPercent !== null
                                ? [
                                      `Period cash flows entered = ${cashFlows}.`,
                                      `Terminal cash flow added to the final period = ${formatPHP(result.terminalCashFlow)}.`,
                                      `The solver searched discount rates until NPV moved close to zero and isolated an IRR of ${formatPercent(result.irrPercent)}.`,
                                      `At ${formatPercent(result.irrPercent)}, discounted inflows total ${formatPHP(result.totalPresentValue)} and NPV is ${formatPHP(result.netPresentValue)}.`,
                                  ]
                                : [
                                      `The tested discount-rate range did not isolate one clean IRR.`,
                                      result.reason,
                                  ]
                        }
                        glossary={[
                            {
                                term: "IRR",
                                meaning:
                                    "The break-even discount rate at which present value of inflows exactly offsets the initial investment.",
                            },
                            {
                                term: "Sign changes",
                                meaning:
                                    "How often the cash-flow stream switches from negative to positive or back again. Multiple sign changes can create multiple IRRs.",
                            },
                        ]}
                        interpretation={
                            result.hasSolution && result.irrPercent !== null
                                ? result.requiredRate !== null
                                    ? `Compare the computed IRR of ${formatPercent(result.irrPercent)} with the hurdle rate of ${formatPercent(result.requiredRate)}. Higher is favorable; lower is not.`
                                    : `The project's break-even return is ${formatPercent(result.irrPercent)} before comparing it with a required rate of return.`
                                : "Use NPV alongside IRR when the cash-flow pattern is irregular, has more than one sign change, or fails to produce one clean solution."
                        }
                        assumptions={[
                            "Cash flows are assumed to occur at equal period intervals.",
                            "The optional terminal cash flow is added to the final listed period only.",
                        ]}
                        warnings={[
                            "IRR is not always unique. Non-conventional cash-flow patterns can produce multiple valid IRRs or none inside a practical search range.",
                            "When projects differ sharply in scale or timing, NPV is usually the stronger accept/reject anchor.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
