import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeBankReconciliation } from "../../utils/calculatorMath";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

function parseOptionalAmount(value: string) {
    if (value.trim() === "") return 0;
    return Number(value);
}

function formatSignedCurrency(value: number) {
    return `${value >= 0 ? "+" : "-"} ${formatPHP(Math.abs(value))}`;
}

export default function BankReconciliationPage() {
    const [bankBalance, setBankBalance] = useState("");
    const [bookBalance, setBookBalance] = useState("");
    const [depositsInTransit, setDepositsInTransit] = useState("");
    const [outstandingChecks, setOutstandingChecks] = useState("");
    const [serviceCharges, setServiceCharges] = useState("");
    const [nsfChecks, setNsfChecks] = useState("");
    const [interestIncome, setInterestIncome] = useState("");
    const [notesCollectedByBank, setNotesCollectedByBank] = useState("");
    const [bankError, setBankError] = useState("");
    const [bookError, setBookError] = useState("");

    useSmartSolverConnector({
        bankBalance: setBankBalance,
        bookBalance: setBookBalance,
        depositsInTransit: setDepositsInTransit,
        outstandingChecks: setOutstandingChecks,
        serviceCharges: setServiceCharges,
        nsfChecks: setNsfChecks,
        interestIncome: setInterestIncome,
        notesCollectedByBank: setNotesCollectedByBank,
        bankError: setBankError,
        bookError: setBookError,
    });

    const result = useMemo(() => {
        if (bankBalance.trim() === "" || bookBalance.trim() === "") return null;

        const parsedBankBalance = Number(bankBalance);
        const parsedBookBalance = Number(bookBalance);
        const parsedDepositsInTransit = parseOptionalAmount(depositsInTransit);
        const parsedOutstandingChecks = parseOptionalAmount(outstandingChecks);
        const parsedServiceCharges = parseOptionalAmount(serviceCharges);
        const parsedNsfChecks = parseOptionalAmount(nsfChecks);
        const parsedInterestIncome = parseOptionalAmount(interestIncome);
        const parsedNotesCollectedByBank = parseOptionalAmount(notesCollectedByBank);
        const parsedBankError = parseOptionalAmount(bankError);
        const parsedBookError = parseOptionalAmount(bookError);

        const numericValues = [
            parsedBankBalance,
            parsedBookBalance,
            parsedDepositsInTransit,
            parsedOutstandingChecks,
            parsedServiceCharges,
            parsedNsfChecks,
            parsedInterestIncome,
            parsedNotesCollectedByBank,
            parsedBankError,
            parsedBookError,
        ];

        if (numericValues.some((value) => Number.isNaN(value))) {
            return {
                error: "All entered values must be valid numbers. Leave optional adjustments blank if they do not apply.",
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

        const reconciliation = computeBankReconciliation({
            bankBalance: parsedBankBalance,
            bookBalance: parsedBookBalance,
            depositsInTransit: parsedDepositsInTransit,
            outstandingChecks: parsedOutstandingChecks,
            bankCharges: parsedServiceCharges,
            nsfChecks: parsedNsfChecks,
            interestIncome: parsedInterestIncome,
            notesCollectedByBank: parsedNotesCollectedByBank,
            bankError: parsedBankError,
            bookError: parsedBookError,
        });

        return {
            ...reconciliation,
            formula: (
                <>
                    Adjusted Bank Balance = Bank Balance + Deposits in Transit - Outstanding Checks
                    +/- Bank Error
                    <br />
                    Adjusted Book Balance = Book Balance - Bank Charges - NSF Checks + Interest Income + Notes Collected by Bank +/- Book Error
                </>
            ),
            steps: [
                `Adjusted bank balance = ${formatPHP(parsedBankBalance)} + ${formatPHP(parsedDepositsInTransit)} - ${formatPHP(parsedOutstandingChecks)} ${formatSignedCurrency(parsedBankError)} = ${formatPHP(reconciliation.adjustedBank)}`,
                `Adjusted book balance = ${formatPHP(parsedBookBalance)} - ${formatPHP(parsedServiceCharges)} - ${formatPHP(parsedNsfChecks)} + ${formatPHP(parsedInterestIncome)} + ${formatPHP(parsedNotesCollectedByBank)} ${formatSignedCurrency(parsedBookError)} = ${formatPHP(reconciliation.adjustedBook)}`,
                reconciliation.isBalanced
                    ? `Both adjusted balances reconcile at ${formatPHP(reconciliation.adjustedBank)}.`
                    : `The adjusted balances still differ by ${formatPHP(Math.abs(reconciliation.difference))}.`,
            ],
            glossary: [
                {
                    term: "Deposits in transit",
                    meaning: "Deposits already recorded in the cash book but not yet reflected on the bank statement.",
                },
                {
                    term: "Outstanding checks",
                    meaning: "Checks already issued and recorded by the business but not yet cleared by the bank.",
                },
                {
                    term: "Bank charges",
                    meaning: "Bank fees that reduce the book balance once recognized.",
                },
                {
                    term: "NSF checks",
                    meaning: "Customer checks returned by the bank because of insufficient funds.",
                },
                {
                    term: "Notes collected by bank",
                    meaning: "Collections the bank makes on behalf of the depositor that should increase the book balance once recorded.",
                },
            ],
            interpretation: reconciliation.isBalanced
                ? `After timing differences, bank-side items, and book-side adjustments, both records reconcile to ${formatPHP(reconciliation.adjustedBank)}.`
                : `The reconciliation is still off by ${formatPHP(Math.abs(reconciliation.difference))}. Review whether a reconciling item is missing or an error adjustment was signed the wrong way.`,
            assumptions: [
                "Leave optional adjustment fields blank when no item applies; blanks are treated as zero.",
                "Enter error adjustments with their effect on the related balance: positive to increase, negative to decrease.",
            ],
        };
    }, [
        bankBalance,
        bankError,
        bookBalance,
        bookError,
        depositsInTransit,
        nsfChecks,
        outstandingChecks,
        serviceCharges,
        interestIncome,
        notesCollectedByBank,
    ]);

    return (
        <CalculatorPageLayout
            badge="Accounting | Cash"
            title="Bank Reconciliation"
            description="Reconcile bank and book balances using deposits in transit, outstanding checks, service charges, NSF checks, and error adjustments."
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
                            placeholder="Leave blank if none"
                        />
                        <InputCard
                            label="Outstanding Checks"
                            value={outstandingChecks}
                            onChange={setOutstandingChecks}
                            placeholder="Leave blank if none"
                        />
                        <InputCard
                            label="Bank Charges / Service Charges"
                            value={serviceCharges}
                            onChange={setServiceCharges}
                            placeholder="Leave blank if none"
                        />
                        <InputCard
                            label="NSF Checks"
                            value={nsfChecks}
                            onChange={setNsfChecks}
                            placeholder="Leave blank if none"
                        />
                        <InputCard
                            label="Interest Income"
                            value={interestIncome}
                            onChange={setInterestIncome}
                            placeholder="Leave blank if none"
                        />
                        <InputCard
                            label="Notes Collected by Bank"
                            value={notesCollectedByBank}
                            onChange={setNotesCollectedByBank}
                            placeholder="Leave blank if none"
                        />
                        <InputCard
                            label="Bank Error Adjustment"
                            value={bankError}
                            onChange={setBankError}
                            placeholder="Use + or - only if needed"
                        />
                        <InputCard
                            label="Book Error Adjustment"
                            value={bookError}
                            onChange={setBookError}
                            placeholder="Use + or - only if needed"
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
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard
                                title="Adjusted Bank Balance"
                                value={formatPHP(result.adjustedBank)}
                            />
                            <ResultCard
                                title="Adjusted Book Balance"
                                value={formatPHP(result.adjustedBook)}
                            />
                            <ResultCard
                                title="Difference"
                                value={formatPHP(Math.abs(result.difference))}
                            />
                            <ResultCard
                                title="Status"
                                value={result.isBalanced ? "Balanced" : "Not yet balanced"}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <div className="grid gap-3 lg:grid-cols-2">
                                <div className="space-y-3">
                                    <p className="app-card-title text-sm">Bank side</p>
                                    {result.bankAdjustments.map((entry) => (
                                        <div
                                            key={entry.label}
                                            className="grid gap-2 rounded-[1rem] border app-divider px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                                        >
                                            <p className="text-sm text-[color:var(--app-text)]">{entry.label}</p>
                                            <p className="text-sm font-semibold text-[color:var(--app-text)] md:text-right">
                                                {formatSignedCurrency(entry.amount)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    <p className="app-card-title text-sm">Book side</p>
                                    {result.bookAdjustments.map((entry) => (
                                        <div
                                            key={entry.label}
                                            className="grid gap-2 rounded-[1rem] border app-divider px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                                        >
                                            <p className="text-sm text-[color:var(--app-text)]">{entry.label}</p>
                                            <p className="text-sm font-semibold text-[color:var(--app-text)] md:text-right">
                                                {formatSignedCurrency(entry.amount)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
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
                        assumptions={result.assumptions}
                    />
                ) : null
            }
        />
    );
}
