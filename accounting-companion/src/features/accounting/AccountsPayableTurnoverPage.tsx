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

export default function AccountsPayableTurnoverPage() {
    const [netCreditPurchases, setNetCreditPurchases] = useState("");
    const [averageAccountsPayable, setAverageAccountsPayable] = useState("");

    useSmartSolverConnector({
        netCreditPurchases: setNetCreditPurchases,
        averageAccountsPayable: setAverageAccountsPayable,
    });

    const result = useMemo(() => {
        if (netCreditPurchases.trim() === "" || averageAccountsPayable.trim() === "") return null;

        const parsedNetCreditPurchases = Number(netCreditPurchases);
        const parsedAverageAccountsPayable = Number(averageAccountsPayable);

        if ([parsedNetCreditPurchases, parsedAverageAccountsPayable].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedNetCreditPurchases < 0 || parsedAverageAccountsPayable < 0) {
            return { error: "Net credit purchases and average accounts payable cannot be negative." };
        }

        if (parsedNetCreditPurchases === 0) {
            return { error: "Net credit purchases must be greater than zero for turnover analysis." };
        }

        if (parsedAverageAccountsPayable === 0) {
            return { error: "Average accounts payable cannot be zero." };
        }

        const turnover = parsedNetCreditPurchases / parsedAverageAccountsPayable;
        const averagePaymentPeriod = 365 / turnover;

        return {
            turnover,
            averagePaymentPeriod,
            formula: "Accounts Payable Turnover = Net Credit Purchases / Average Accounts Payable",
            steps: [
                `Accounts payable turnover = ${formatPHP(parsedNetCreditPurchases)} / ${formatPHP(parsedAverageAccountsPayable)} = ${turnover.toFixed(2)}`,
                `Average payment period = 365 / ${turnover.toFixed(2)} = ${averagePaymentPeriod.toFixed(2)} days`,
            ],
            glossary: [
                { term: "Net Credit Purchases", meaning: "Purchases made on credit, net of returns and allowances." },
                { term: "Accounts Payable Turnover", meaning: "How many times payables are paid or settled during the period." },
                { term: "Average Payment Period", meaning: "The estimated number of days the entity takes to pay suppliers." },
            ],
            interpretation: `The company pays its average accounts payable about ${turnover.toFixed(2)} times per year, or roughly every ${averagePaymentPeriod.toFixed(2)} days.`,
        };
    }, [averageAccountsPayable, netCreditPurchases]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Accounts Payable Turnover"
            description="Measure how quickly a company pays suppliers using credit purchases and average payables."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Net Credit Purchases" value={netCreditPurchases} onChange={setNetCreditPurchases} placeholder="420000" />
                        <InputCard label="Average Accounts Payable" value={averageAccountsPayable} onChange={setAverageAccountsPayable} placeholder="70000" />
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
                        <ResultCard title="Payable Turnover" value={result.turnover.toFixed(2)} />
                        <ResultCard title="Average Payment Period" value={`${result.averagePaymentPeriod.toFixed(2)} days`} />
                        <ResultCard title="Net Credit Purchases" value={formatPHP(Number(netCreditPurchases))} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard formula={result.formula} steps={result.steps} glossary={result.glossary} interpretation={result.interpretation} />
                ) : null
            }
        />
    );
}
