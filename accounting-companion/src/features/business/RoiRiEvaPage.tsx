import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeRoiRiEva } from "../../utils/calculatorMath";
import SendToWorkpaperButton from "../workpapers/SendToWorkpaperButton";
import { buildRoiTransferBundle } from "../workpapers/workpaperTransferBuilders";

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export default function RoiRiEvaPage() {
    const [operatingIncome, setOperatingIncome] = useState("");
    const [investedCapital, setInvestedCapital] = useState("");
    const [targetRatePercent, setTargetRatePercent] = useState("");
    const [sales, setSales] = useState("");

    const result = useMemo(() => {
        if (
            operatingIncome.trim() === "" ||
            investedCapital.trim() === "" ||
            targetRatePercent.trim() === ""
        ) {
            return null;
        }

        const income = Number(operatingIncome);
        const capital = Number(investedCapital);
        const targetRate = Number(targetRatePercent);
        const salesValue = sales.trim() === "" ? 0 : Number(sales);

        if ([income, capital, targetRate].some((value) => Number.isNaN(value))) {
            return { error: "Operating income, invested capital, and target rate must be valid numbers." };
        }

        if (sales.trim() !== "" && Number.isNaN(salesValue)) {
            return { error: "Sales must be a valid number when provided." };
        }

        if (capital <= 0) {
            return { error: "Invested capital must be greater than zero." };
        }

        return computeRoiRiEva({
            operatingIncome: income,
            investedCapital: capital,
            targetRatePercent: targetRate,
            sales: salesValue,
        });
    }, [investedCapital, operatingIncome, sales, targetRatePercent]);

    const workpaperBundle = useMemo(
        () =>
            result && !("error" in result)
                ? buildRoiTransferBundle({
                      operatingIncome,
                      investedCapital,
                      targetRatePercent,
                      sales,
                      result,
                  })
                : null,
        [investedCapital, operatingIncome, result, sales, targetRatePercent]
    );

    return (
        <CalculatorPageLayout
            badge="Cost & Managerial"
            title="ROI, RI, and EVA Workspace"
            description="Compare return on investment, residual income, and EVA-style capital-charge reading from one responsibility-accounting workspace."
            headerActions={<SendToWorkpaperButton bundle={workpaperBundle} />}
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Operating Income"
                            value={operatingIncome}
                            onChange={setOperatingIncome}
                            placeholder="240000"
                        />
                        <InputCard
                            label="Invested Capital"
                            value={investedCapital}
                            onChange={setInvestedCapital}
                            placeholder="1500000"
                        />
                        <InputCard
                            label="Target Rate (%)"
                            value={targetRatePercent}
                            onChange={setTargetRatePercent}
                            placeholder="12"
                        />
                        <InputCard
                            label="Sales (optional)"
                            value={sales}
                            onChange={setSales}
                            placeholder="3200000"
                            helperText="Add sales when you want margin and investment-turnover support."
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
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard title="ROI" value={formatPercent(result.roi)} tone="accent" />
                            <ResultCard title="Residual Income" value={formatPHP(result.residualIncome)} />
                            <ResultCard title="EVA-style Read" value={formatPHP(result.eva)} />
                            <ResultCard title="Capital Charge" value={formatPHP(result.capitalCharge)} />
                        </ResultGrid>

                        <ResultGrid columns={2}>
                            <ResultCard
                                title="Profit Margin"
                                value={sales.trim() === "" ? "Add sales" : formatPercent(result.profitMargin)}
                            />
                            <ResultCard
                                title="Investment Turnover"
                                value={sales.trim() === "" ? "Add sales" : result.investmentTurnover.toFixed(2)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <p className="app-card-title text-sm">Performance reading</p>
                            <p className="app-body-md mt-2 text-sm">
                                A positive residual income or EVA-style amount means the segment earned more
                                than the required capital charge. A strong ROI alone is not enough if the
                                division still fails the minimum return standard.
                            </p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="ROI = Operating income / Invested capital; RI = Operating income - (Invested capital x target rate)"
                        steps={[
                            `ROI = ${formatPHP(Number(operatingIncome))} / ${formatPHP(Number(investedCapital))} = ${formatPercent(result.roi)}.`,
                            `Capital charge = ${formatPHP(Number(investedCapital))} x ${Number(targetRatePercent).toFixed(2)}% = ${formatPHP(result.capitalCharge)}.`,
                            `Residual income = ${formatPHP(Number(operatingIncome))} - ${formatPHP(result.capitalCharge)} = ${formatPHP(result.residualIncome)}.`,
                            sales.trim() === ""
                                ? "Add sales if you want to split ROI into margin and investment turnover."
                                : `Profit margin = ${formatPercent(result.profitMargin)} and investment turnover = ${result.investmentTurnover.toFixed(2)} times.`,
                        ]}
                        interpretation="Use ROI when the class wants a percentage return, then use RI or EVA-style reading when the case asks whether performance exceeded the required return on invested capital."
                        warnings={[
                            "A division can reject a profitable project if managers focus only on average ROI instead of residual income.",
                            "EVA in professional settings may adjust accounting numbers further, so this workspace is a reviewer-friendly first pass.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
