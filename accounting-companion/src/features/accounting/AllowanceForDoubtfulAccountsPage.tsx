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

export default function AllowanceForDoubtfulAccountsPage() {
    const [accountsReceivable, setAccountsReceivable] = useState("");
    const [estimatedUncollectibleRate, setEstimatedUncollectibleRate] = useState("");

    useSmartSolverConnector({
        accountsReceivable: setAccountsReceivable,
        estimatedUncollectibleRate: setEstimatedUncollectibleRate,
    });

    const result = useMemo(() => {
        const values = [accountsReceivable, estimatedUncollectibleRate];

        if (values.some((value) => value.trim() === "")) return null;

        const parsedAccountsReceivable = Number(accountsReceivable);
        const parsedEstimatedUncollectibleRate = Number(estimatedUncollectibleRate);
        const numericValues = [parsedAccountsReceivable, parsedEstimatedUncollectibleRate];

        if (numericValues.some((value) => Number.isNaN(value))) {
            return {
                error: "All inputs must be valid numbers.",
            };
        }

        if (parsedAccountsReceivable < 0 || parsedEstimatedUncollectibleRate < 0) {
            return {
                error: "Values cannot be negative.",
            };
        }

        if (parsedEstimatedUncollectibleRate > 100) {
            return {
                error: "Estimated uncollectible rate cannot be greater than 100%.",
            };
        }

        const allowance =
            parsedAccountsReceivable * (parsedEstimatedUncollectibleRate / 100);
        const netRealizableValue = parsedAccountsReceivable - allowance;

        return {
            allowance,
            netRealizableValue,
            formula: (
                <>
                    Allowance for Doubtful Accounts = Accounts Receivable x Estimated Uncollectible Rate
                    <br />
                    Net Realizable Value = Accounts Receivable - Allowance for Doubtful Accounts
                </>
            ),
            steps: [
                `Allowance = ${formatPHP(parsedAccountsReceivable)} x ${parsedEstimatedUncollectibleRate}% = ${formatPHP(allowance)}`,
                `Net Realizable Value = ${formatPHP(parsedAccountsReceivable)} - ${formatPHP(allowance)} = ${formatPHP(netRealizableValue)}`,
            ],
            interpretation: `If ${parsedEstimatedUncollectibleRate.toFixed(2)}% of receivables are expected to be uncollectible, the estimated allowance is ${formatPHP(allowance)} on accounts receivable of ${formatPHP(parsedAccountsReceivable)}. The remaining ${formatPHP(netRealizableValue)} is the net amount expected to be collected.`,
        };
    }, [accountsReceivable, estimatedUncollectibleRate]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Receivables"
            title="Allowance for Doubtful Accounts"
            description="Estimate uncollectible accounts and net realizable value using accounts receivable and an estimated uncollectible rate."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Accounts Receivable"
                            value={accountsReceivable}
                            onChange={setAccountsReceivable}
                            placeholder="50000"
                        />
                        <InputCard
                            label="Estimated Uncollectible Rate (%)"
                            value={estimatedUncollectibleRate}
                            onChange={setEstimatedUncollectibleRate}
                            placeholder="5"
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
                        <ResultCard
                            title="Allowance for Doubtful Accounts"
                            value={formatPHP(result.allowance)}
                        />
                        <ResultCard
                            title="Net Realizable Value"
                            value={formatPHP(result.netRealizableValue)}
                        />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula={result.formula}
                        steps={result.steps}
                        interpretation={result.interpretation}
                    />
                ) : null
            }
        />
    );
}
