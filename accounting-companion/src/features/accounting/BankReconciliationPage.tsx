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

export default function BankReconciliationPage() {
    const [bankBalance, setBankBalance] = useState("");
    const [bookBalance, setBookBalance] = useState("");
    const [depositsInTransit, setDepositsInTransit] = useState("");
    const [outstandingChecks, setOutstandingChecks] = useState("");
    const [serviceCharges, setServiceCharges] = useState("");
    const [nsfChecks, setNsfChecks] = useState("");
    const [bankError, setBankError] = useState("");
    const [bookError, setBookError] = useState("");

    useSmartSolverConnector({
        bankBalance: setBankBalance,
        bookBalance: setBookBalance,
        depositsInTransit: setDepositsInTransit,
        outstandingChecks: setOutstandingChecks,
        serviceCharges: setServiceCharges,
        nsfChecks: setNsfChecks,
        bankError: setBankError,
        bookError: setBookError,
    });

    const result = useMemo(() => {
        const values = [
            bankBalance,
            bookBalance,
            depositsInTransit,
            outstandingChecks,
            serviceCharges,
            nsfChecks,
            bankError,
            bookError,
        ];

        if (values.some((value) => value.trim() === "")) return null;

        const parsedBankBalance = Number(bankBalance);
        const parsedBookBalance = Number(bookBalance);
        const parsedDepositsInTransit = Number(depositsInTransit);
        const parsedOutstandingChecks = Number(outstandingChecks);
        const parsedServiceCharges = Number(serviceCharges);
        const parsedNsfChecks = Number(nsfChecks);
        const parsedBankError = Number(bankError);
        const parsedBookError = Number(bookError);

        const numericValues = [
            parsedBankBalance,
            parsedBookBalance,
            parsedDepositsInTransit,
            parsedOutstandingChecks,
            parsedServiceCharges,
            parsedNsfChecks,
            parsedBankError,
            parsedBookError,
        ];

        if (numericValues.some((value) => Number.isNaN(value))) {
            return {
                error: "All inputs must be valid numbers.",
            };
        }

        if (parsedBankBalance < 0 || parsedBookBalance < 0) {
            return {
                error: "Bank balance and book balance cannot be negative.",
            };
        }

        if (
            parsedDepositsInTransit < 0 ||
            parsedOutstandingChecks < 0 ||
            parsedServiceCharges < 0 ||
            parsedNsfChecks < 0
        ) {
            return {
                error: "Deposits in transit, outstanding checks, service charges, and NSF checks cannot be negative.",
            };
        }

        const adjustedBank =
            parsedBankBalance +
            parsedDepositsInTransit -
            parsedOutstandingChecks +
            parsedBankError;

        const adjustedBook =
            parsedBookBalance -
            parsedServiceCharges -
            parsedNsfChecks +
            parsedBookError;

        const difference = adjustedBank - adjustedBook;
        const isBalanced = Math.abs(difference) < 0.005;

        return {
            adjustedBank,
            adjustedBook,
            difference,
            isBalanced,
            formula: (
                <>
                    Adjusted Bank Balance = Bank Balance + Deposits in Transit − Outstanding Checks ± Bank Error
                    <br />
                    Adjusted Book Balance = Book Balance − Service Charges − NSF Checks ± Book Error
                </>
            ),
            steps: [
                `Adjusted Bank Balance = ${formatPHP(parsedBankBalance)} + ${formatPHP(
                    parsedDepositsInTransit
                )} − ${formatPHP(parsedOutstandingChecks)} ${
                    parsedBankError >= 0 ? "+" : "−"
                } ${formatPHP(Math.abs(parsedBankError))} = ${formatPHP(adjustedBank)}`,
                `Adjusted Book Balance = ${formatPHP(parsedBookBalance)} − ${formatPHP(
                    parsedServiceCharges
                )} − ${formatPHP(parsedNsfChecks)} ${
                    parsedBookError >= 0 ? "+" : "−"
                } ${formatPHP(Math.abs(parsedBookError))} = ${formatPHP(adjustedBook)}`,
                isBalanced
                    ? `Both adjusted balances match at ${formatPHP(adjustedBank)}.`
                    : `Adjusted balances do not match yet. Difference = ${formatPHP(difference)}.`,
            ],
            glossary: [
                { term: "Deposits in Transit", meaning: "Deposits already recorded in the books but not yet reflected on the bank statement." },
                { term: "Outstanding Checks", meaning: "Checks already issued and recorded by the business but not yet cleared by the bank." },
                { term: "Service Charges", meaning: "Bank fees that reduce the book balance once recognized." },
                { term: "NSF Checks", meaning: "Customer checks returned by the bank because of insufficient funds." },
            ],
            interpretation: isBalanced
                ? `After considering timing differences and errors, both records reconcile to ${formatPHP(adjustedBank)}.`
                : `The reconciliation is still off by ${formatPHP(Math.abs(difference))}. Review whether any reconciling item or adjustment is missing or signed incorrectly.`,
        };
    }, [
        bankBalance,
        bookBalance,
        depositsInTransit,
        outstandingChecks,
        serviceCharges,
        nsfChecks,
        bankError,
        bookError,
    ]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Cash"
            title="Bank Reconciliation"
            description="Reconcile bank and book balances using deposits in transit, outstanding checks, service charges, NSF checks, and errors."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Bank Statement Balance"
                            value={bankBalance}
                            onChange={setBankBalance}
                            placeholder="50000"
                        />
                        <InputCard
                            label="Book / Cash Balance"
                            value={bookBalance}
                            onChange={setBookBalance}
                            placeholder="48500"
                        />
                        <InputCard
                            label="Deposits in Transit"
                            value={depositsInTransit}
                            onChange={setDepositsInTransit}
                            placeholder="3500"
                        />
                        <InputCard
                            label="Outstanding Checks"
                            value={outstandingChecks}
                            onChange={setOutstandingChecks}
                            placeholder="2000"
                        />
                        <InputCard
                            label="Service Charges"
                            value={serviceCharges}
                            onChange={setServiceCharges}
                            placeholder="300"
                        />
                        <InputCard
                            label="NSF Checks"
                            value={nsfChecks}
                            onChange={setNsfChecks}
                            placeholder="700"
                        />
                        <InputCard
                            label="Bank Error Adjustment"
                            value={bankError}
                            onChange={setBankError}
                            placeholder="-200 or 200"
                        />
                        <InputCard
                            label="Book Error Adjustment"
                            value={bookError}
                            onChange={setBookError}
                            placeholder="-150 or 150"
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
                    <ResultGrid columns={3}>
                        <ResultCard
                            title="Adjusted Bank Balance"
                            value={formatPHP(result.adjustedBank)}
                        />
                        <ResultCard
                            title="Adjusted Book Balance"
                            value={formatPHP(result.adjustedBook)}
                        />
                        <ResultCard
                            title="Status"
                            value={result.isBalanced ? "Balanced" : "Not yet balanced"}
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
                    />
                ) : null
            }
        />
    );
}
