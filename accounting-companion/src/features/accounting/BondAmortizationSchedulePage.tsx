import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeBondAmortizationSchedule } from "../../utils/calculatorMath";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

type AmortizationMethod = "effective-interest" | "straight-line";

export default function BondAmortizationSchedulePage() {
    const [method, setMethod] = useState<AmortizationMethod>("effective-interest");
    const [faceValue, setFaceValue] = useState("");
    const [statedRate, setStatedRate] = useState("");
    const [marketRate, setMarketRate] = useState("");
    const [termYears, setTermYears] = useState("");
    const [paymentsPerYear, setPaymentsPerYear] = useState("2");
    const [issuePrice, setIssuePrice] = useState("");

    useSmartSolverConnector({
        faceValue: setFaceValue,
        statedRate: setStatedRate,
        marketRate: setMarketRate,
        years: setTermYears,
    });

    const result = useMemo(() => {
        if (
            faceValue.trim() === "" ||
            statedRate.trim() === "" ||
            marketRate.trim() === "" ||
            termYears.trim() === "" ||
            paymentsPerYear.trim() === ""
        ) {
            return null;
        }

        const parsedFaceValue = Number(faceValue);
        const parsedStatedRate = Number(statedRate);
        const parsedMarketRate = Number(marketRate);
        const parsedTermYears = Number(termYears);
        const parsedPaymentsPerYear = Number(paymentsPerYear);
        const parsedIssuePrice =
            issuePrice.trim() === "" ? undefined : Number(issuePrice);

        if (
            [
                parsedFaceValue,
                parsedStatedRate,
                parsedMarketRate,
                parsedTermYears,
                parsedPaymentsPerYear,
            ].some((value) => Number.isNaN(value)) ||
            (parsedIssuePrice !== undefined && Number.isNaN(parsedIssuePrice))
        ) {
            return { error: "All populated bond inputs must be valid numbers." };
        }

        if (
            parsedFaceValue <= 0 ||
            parsedTermYears <= 0 ||
            parsedPaymentsPerYear <= 0
        ) {
            return {
                error: "Face value, term, and payments per year must be greater than zero.",
            };
        }

        if (
            parsedStatedRate < 0 ||
            parsedMarketRate < 0 ||
            (parsedIssuePrice !== undefined && parsedIssuePrice <= 0)
        ) {
            return {
                error: "Rates cannot be negative and issue price must stay above zero.",
            };
        }

        if (!Number.isInteger(parsedPaymentsPerYear)) {
            return { error: "Payments per year should be a whole number." };
        }

        return computeBondAmortizationSchedule({
            faceValue: parsedFaceValue,
            statedRatePercent: parsedStatedRate,
            marketRatePercent: parsedMarketRate,
            termYears: parsedTermYears,
            paymentsPerYear: parsedPaymentsPerYear,
            method,
            issuePrice: parsedIssuePrice,
        });
    }, [faceValue, issuePrice, marketRate, method, paymentsPerYear, statedRate, termYears]);

    return (
        <CalculatorPageLayout
            badge="Accounting / Liabilities"
            title="Bond Amortization Schedule"
            description="Build a premium or discount bond schedule using either effective-interest amortization or straight-line amortization, then inspect each period's carrying value change."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setMethod("effective-interest")}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-medium",
                                    method === "effective-interest"
                                        ? "app-button-primary"
                                        : "app-button-secondary",
                                ].join(" ")}
                            >
                                Effective interest
                            </button>
                            <button
                                type="button"
                                onClick={() => setMethod("straight-line")}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-medium",
                                    method === "straight-line"
                                        ? "app-button-primary"
                                        : "app-button-secondary",
                                ].join(" ")}
                            >
                                Straight-line
                            </button>
                        </div>
                        <p className="app-body-md mt-3 text-sm">
                            {method === "effective-interest"
                                ? "This is the more conceptually precise method because interest expense follows the carrying value each period."
                                : "Use this when the problem explicitly allows straight-line amortization for classroom comparison or simplified treatment."}
                        </p>
                    </SectionCard>

                    <SectionCard>
                        <InputGrid columns={3}>
                            <InputCard
                                label="Face Value"
                                value={faceValue}
                                onChange={setFaceValue}
                                placeholder="1000000"
                            />
                            <InputCard
                                label="Stated Rate (%)"
                                value={statedRate}
                                onChange={setStatedRate}
                                placeholder="8"
                            />
                            <InputCard
                                label="Market Rate (%)"
                                value={marketRate}
                                onChange={setMarketRate}
                                placeholder="10"
                            />
                            <InputCard
                                label="Term (Years)"
                                value={termYears}
                                onChange={setTermYears}
                                placeholder="5"
                            />
                            <InputCard
                                label="Payments per Year"
                                value={paymentsPerYear}
                                onChange={setPaymentsPerYear}
                                placeholder="2"
                            />
                            <InputCard
                                label="Issue Price (Optional Override)"
                                value={issuePrice}
                                onChange={setIssuePrice}
                                placeholder="924184"
                            />
                        </InputGrid>
                    </SectionCard>
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
                            <ResultCard title="Issue Price" value={formatPHP(result.issuePrice)} />
                            <ResultCard
                                title="Cash Interest / Period"
                                value={formatPHP(result.cashInterest)}
                            />
                            <ResultCard title="Issue Type" value={result.issueType} />
                            <ResultCard
                                title="Total Interest Expense"
                                value={formatPHP(result.totalInterestExpense)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <div className="space-y-3">
                                {result.schedule.map((row) => (
                                    <div
                                        key={row.period}
                                        className="grid gap-2 rounded-[1.15rem] border app-divider px-4 py-3 md:grid-cols-[auto_minmax(0,1fr)] md:items-center"
                                    >
                                        <div className="app-chip-accent inline-flex w-fit rounded-full px-2.5 py-1 text-[0.62rem]">
                                            Period {row.period}
                                        </div>
                                        <div className="grid gap-2 text-sm text-[color:var(--app-text)] md:grid-cols-5">
                                            <span>Begin {formatPHP(row.beginningCarryingValue)}</span>
                                            <span>Cash {formatPHP(row.cashInterest)}</span>
                                            <span>Expense {formatPHP(row.interestExpense)}</span>
                                            <span>Amortization {formatPHP(row.amortization)}</span>
                                            <span>End {formatPHP(row.endingCarryingValue)}</span>
                                        </div>
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
                        formula={
                            method === "effective-interest"
                                ? "Interest expense = beginning carrying value x market rate per period."
                                : "Straight-line amortization per period = total discount or premium / number of interest periods."
                        }
                        steps={[
                            `Issue price ${issuePrice.trim() === "" ? "was derived" : "used"} at ${formatPHP(result.issuePrice)}.`,
                            `Cash interest each period = face value x stated rate / payments per year = ${formatPHP(result.cashInterest)}.`,
                            method === "effective-interest"
                                ? `Each period uses the beginning carrying value times the periodic market rate of ${(result.periodicMarketRate * 100).toFixed(4)}%.`
                                : `Each period applies a constant amortization of ${formatPHP(result.straightLineAmortizationPerPeriod)}.`,
                            "The last period is adjusted so the ending carrying value returns exactly to face value.",
                        ]}
                        interpretation={`This bond was issued at ${result.issueType}, with an initial carrying value of ${formatPHP(result.issuePrice)}. The ${method === "effective-interest" ? "effective-interest" : "straight-line"} schedule then moves carrying value toward the face value by maturity.`}
                        assumptions={[
                            "Interest periods are assumed to be equal and the stated and market rates are nominal annual rates.",
                            "A manual issue-price override is allowed when the problem already gives the issuance amount.",
                        ]}
                        warnings={[
                            "Effective-interest and straight-line amortization do not produce the same period-by-period interest expense. Label the chosen method clearly in classwork and working papers.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
