import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import TextAreaCard from "../../components/TextAreaCard";
import { computeDiscountedPaybackPeriod } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { parseNumberList } from "../../utils/listParsers";

export default function DiscountedPaybackPeriodPage() {
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

        return computeDiscountedPaybackPeriod(investment, rate, parsedCashFlows.values);
    }, [cashFlows, discountRate, initialInvestment]);
    const resolvedResult =
        result && !("error" in result) ? result : null;

    return (
        <CalculatorPageLayout
            badge="Finance / Capital Budgeting"
            title="Discounted Payback Period"
            description="Measure how long discounted cash inflows take to recover the initial investment, rather than relying on the simpler undiscounted payback shortcut."
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
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : resolvedResult ? (
                    (() => {
                        const paybackPeriodValue = resolvedResult.paybackPeriod;

                        return (
                    <div className="space-y-4">
                        <ResultGrid columns={3}>
                            <ResultCard
                                title="Discounted Payback"
                                value={
                                    paybackPeriodValue === null
                                        ? "Not recovered"
                                        : `${Number(paybackPeriodValue).toFixed(2)} periods`
                                }
                            />
                            <ResultCard
                                title="Discounted Cash Recovered"
                                value={formatPHP(resolvedResult.cumulativeDiscountedCashFlow)}
                            />
                            <ResultCard
                                title="Ending Unrecovered Balance"
                                value={formatPHP(resolvedResult.unrecoveredDiscountedBalance)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <div className="space-y-3">
                                {resolvedResult.schedule.map((row) => (
                                    <div
                                        key={row.period}
                                        className="grid gap-2 rounded-[1.15rem] border app-divider px-4 py-3 md:grid-cols-[auto_minmax(0,1fr)] md:items-center"
                                    >
                                        <div className="app-chip-accent inline-flex w-fit rounded-full px-2.5 py-1 text-[0.62rem]">
                                            Period {row.period}
                                        </div>
                                        <div className="grid gap-2 text-sm text-[color:var(--app-text)] md:grid-cols-4">
                                            <span>Cash {formatPHP(row.cashFlow)}</span>
                                            <span>Factor {row.discountFactor.toFixed(4)}</span>
                                            <span>Discounted {formatPHP(row.discountedCashFlow)}</span>
                                            <span>Unrecovered {formatPHP(row.unrecoveredDiscountedBalance)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </div>
                        );
                    })()
                ) : null
            }
            explanationSection={
                resolvedResult ? (
                    (() => {
                        const paybackPeriodValue = resolvedResult.paybackPeriod;

                        return (
                            <FormulaCard
                                formula="Discounted payback period is reached when cumulative discounted cash inflows recover the initial investment."
                                steps={[
                                    `Each cash flow is discounted at ${(resolvedResult.rateDecimal * 100).toFixed(2)}% per period before being accumulated.`,
                                    paybackPeriodValue === null
                                        ? "The listed discounted inflows did not fully recover the investment within the provided periods."
                                        : `Recovery occurs after ${Number(paybackPeriodValue).toFixed(2)} periods, including a final fractional period of ${(resolvedResult.fractionOfPeriod ?? 0).toFixed(2)}.`,
                                ]}
                                interpretation={
                                    paybackPeriodValue === null
                                        ? "The project does not recover its initial investment on a discounted basis within the listed periods, even though an undiscounted payback might appear shorter."
                                        : `On a discounted basis, the investment is recovered in ${Number(paybackPeriodValue).toFixed(2)} periods. This is stricter than simple payback because it recognizes the time value of money.`
                                }
                                assumptions={[
                                    "Cash flows are assumed to occur at the end of each period and the discount rate is assumed consistent across the horizon.",
                                ]}
                                warnings={[
                                    "Discounted payback still ignores cash flows after recovery. Use NPV or profitability index when the decision needs total value, not only recovery speed.",
                                ]}
                            />
                        );
                    })()
                ) : null
            }
        />
    );
}
