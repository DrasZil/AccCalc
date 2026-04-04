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

export default function NetPresentValuePage() {
    const [initialInvestment, setInitialInvestment] = useState("");
    const [discountRate, setDiscountRate] = useState("");
    const [cashFlows, setCashFlows] = useState("");

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

        if (Number.isNaN(investment) || Number.isNaN(rate)) {
            return { error: "Initial investment and discount rate must be valid numbers." };
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

        const { discountedCashFlows, totalPresentValue, netPresentValue, rateDecimal } =
            computeNetPresentValue(investment, rate, parsedCashFlows.values);

        return {
            discountedCashFlows,
            totalPresentValue,
            netPresentValue,
            rateDecimal,
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
                    <ResultGrid columns={2}>
                        <ResultCard title="Net Present Value" value={formatPHP(result.netPresentValue)} />
                        <ResultCard title="Present Value of Inflows" value={formatPHP(result.totalPresentValue)} />
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
                            "Cash flows are assumed to occur at the end of each period.",
                            "Use consistent periods for both the discount rate and the listed cash flows.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
