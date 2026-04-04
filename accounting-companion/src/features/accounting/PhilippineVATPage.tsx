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

const PHILIPPINE_VAT_RATE = 0.12;

export default function PhilippineVATPage() {
    const [vatableSales, setVatableSales] = useState("");
    const [vatablePurchases, setVatablePurchases] = useState("");

    useSmartSolverConnector({
        vatableSales: setVatableSales,
        vatablePurchases: setVatablePurchases,
    });

    const result = useMemo(() => {
        if (vatableSales.trim() === "" || vatablePurchases.trim() === "") {
            return null;
        }

        const sales = Number(vatableSales);
        const purchases = Number(vatablePurchases);

        if ([sales, purchases].some((value) => Number.isNaN(value))) {
            return {
                error: "Both inputs must be valid numbers.",
            };
        }

        if (sales < 0 || purchases < 0) {
            return {
                error: "VATable sales and purchases cannot be negative.",
            };
        }

        const outputVat = sales * PHILIPPINE_VAT_RATE;
        const inputVat = purchases * PHILIPPINE_VAT_RATE;
        const vatPayable = outputVat - inputVat;
        const status = vatPayable >= 0 ? "VAT payable" : "Excess input VAT";

        return {
            sales,
            purchases,
            outputVat,
            inputVat,
            vatPayable,
            status,
            formula: (
                <>
                    Output VAT = VATable Sales × 12%
                    <br />
                    Input VAT = VATable Purchases × 12%
                    <br />
                    Net VAT = Output VAT − Input VAT
                </>
            ),
            steps: [
                `Output VAT = ${formatPHP(sales)} x 12% = ${formatPHP(outputVat)}`,
                `Input VAT = ${formatPHP(purchases)} x 12% = ${formatPHP(inputVat)}`,
                `Net VAT = ${formatPHP(outputVat)} - ${formatPHP(inputVat)} = ${formatPHP(vatPayable)}`,
            ],
        };
    }, [vatablePurchases, vatableSales]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Philippine Taxation"
            title="Philippine VAT"
            description="Compute output VAT, input VAT, and the resulting VAT payable or excess input VAT using the standard 12% VAT rate."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="VATable Sales"
                            value={vatableSales}
                            onChange={setVatableSales}
                            placeholder="150000"
                        />
                        <InputCard
                            label="VATable Purchases"
                            value={vatablePurchases}
                            onChange={setVatablePurchases}
                            placeholder="80000"
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
                        <ResultCard title="Output VAT" value={formatPHP(result.outputVat)} />
                        <ResultCard title="Input VAT" value={formatPHP(result.inputVat)} />
                        <ResultCard title={result.status} value={formatPHP(Math.abs(result.vatPayable))} />
                        <ResultCard title="VAT Rate" value="12%" />
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
