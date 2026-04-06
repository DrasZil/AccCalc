import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeCashBudget } from "../../utils/calculatorMath";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function CashBudgetPage() {
    const [beginningCashBalance, setBeginningCashBalance] = useState("");
    const [cashCollections, setCashCollections] = useState("");
    const [cashDisbursements, setCashDisbursements] = useState("");
    const [minimumCashBalance, setMinimumCashBalance] = useState("");

    useSmartSolverConnector({
        beginningCashBalance: setBeginningCashBalance,
        cashCollections: setCashCollections,
        cashDisbursements: setCashDisbursements,
        minimumCashBalance: setMinimumCashBalance,
    });

    const result = useMemo(() => {
        if (
            beginningCashBalance.trim() === "" ||
            cashCollections.trim() === "" ||
            cashDisbursements.trim() === "" ||
            minimumCashBalance.trim() === ""
        ) {
            return null;
        }

        const values = [
            Number(beginningCashBalance),
            Number(cashCollections),
            Number(cashDisbursements),
            Number(minimumCashBalance),
        ];

        if (values.some((value) => Number.isNaN(value))) {
            return { error: "Cash-budget inputs must all be valid numbers." };
        }

        if (values.some((value) => value < 0)) {
            return { error: "Cash-budget amounts cannot be negative." };
        }

        return computeCashBudget({
            beginningCashBalance: values[0],
            cashCollections: values[1],
            cashDisbursements: values[2],
            minimumCashBalance: values[3],
        });
    }, [beginningCashBalance, cashCollections, cashDisbursements, minimumCashBalance]);

    return (
        <CalculatorPageLayout
            badge="Managerial & Cost / Budgeting"
            title="Cash Budget"
            description="Organize beginning cash, expected collections, planned disbursements, and minimum cash policy into a short cash-budget schedule with financing need visibility."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Beginning Cash Balance"
                            value={beginningCashBalance}
                            onChange={setBeginningCashBalance}
                            placeholder="50000"
                        />
                        <InputCard
                            label="Cash Collections"
                            value={cashCollections}
                            onChange={setCashCollections}
                            placeholder="180000"
                        />
                        <InputCard
                            label="Cash Disbursements"
                            value={cashDisbursements}
                            onChange={setCashDisbursements}
                            placeholder="210000"
                        />
                        <InputCard
                            label="Minimum Cash Balance"
                            value={minimumCashBalance}
                            onChange={setMinimumCashBalance}
                            placeholder="25000"
                        />
                    </InputGrid>
                </SectionCard>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={4}>
                        <ResultCard
                            title="Total Cash Available"
                            value={formatPHP(result.totalCashAvailable)}
                        />
                        <ResultCard
                            title="Excess / Deficiency Before Financing"
                            value={formatPHP(result.excessOrDeficiencyBeforeFinancing)}
                        />
                        <ResultCard
                            title="Financing Needed"
                            value={formatPHP(result.financingNeeded)}
                        />
                        <ResultCard
                            title="Ending Cash After Financing"
                            value={formatPHP(result.endingCashAfterFinancing)}
                        />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Ending cash after financing = beginning cash + collections - disbursements + financing."
                        steps={[
                            `Total cash available = ${formatPHP(Number(beginningCashBalance || 0))} + ${formatPHP(Number(cashCollections || 0))} = ${formatPHP(result.totalCashAvailable)}.`,
                            `Excess or deficiency before financing = ${formatPHP(result.totalCashAvailable)} - ${formatPHP(Number(cashDisbursements || 0))} = ${formatPHP(result.excessOrDeficiencyBeforeFinancing)}.`,
                            `Required financing = max(minimum cash balance ${formatPHP(Number(minimumCashBalance || 0))} - excess or deficiency before financing, 0) = ${formatPHP(result.financingNeeded)}.`,
                            `Ending cash after financing = ${formatPHP(result.endingCashAfterFinancing)}.`,
                        ]}
                        interpretation={
                            result.financingNeeded > 0
                                ? `The budget shows a cash shortfall relative to the minimum policy, so financing of ${formatPHP(result.financingNeeded)} is needed to end the period at ${formatPHP(result.endingCashAfterFinancing)}.`
                                : `The budget maintains the minimum cash policy without outside financing and ends with ${formatPHP(result.endingCashAfterFinancing)} in cash.`
                        }
                        assumptions={[
                            "This is a compact single-period cash budget and does not separate borrowing, repayment, and interest into multiple monthly steps.",
                        ]}
                        warnings={[
                            "If the instructor or workplace format requires separate financing, repayment, or interest sections, use this as a planning check rather than the final presentation.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
