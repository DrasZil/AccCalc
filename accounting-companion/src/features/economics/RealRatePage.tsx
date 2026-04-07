import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeRealInterestRate } from "../../utils/calculatorMath";

export default function RealRatePage() {
    const [nominalRate, setNominalRate] = useState("");
    const [inflationRate, setInflationRate] = useState("");

    const result = useMemo(() => {
        if (nominalRate.trim() === "" || inflationRate.trim() === "") return null;

        const nominal = Number(nominalRate);
        const inflation = Number(inflationRate);

        if (Number.isNaN(nominal) || Number.isNaN(inflation)) {
            return { error: "Nominal rate and inflation rate must both be valid numbers." };
        }

        if (inflation <= -100) {
            return { error: "Inflation rate must stay above -100%." };
        }

        return computeRealInterestRate(nominal, inflation);
    }, [inflationRate, nominalRate]);

    return (
        <CalculatorPageLayout
            badge="Economics / Inflation"
            title="Real Interest Rate"
            description="Compare the exact Fisher-style real rate with the common classroom approximation of nominal rate minus inflation."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Nominal Rate (%)" value={nominalRate} onChange={setNominalRate} placeholder="9" />
                        <InputCard label="Inflation Rate (%)" value={inflationRate} onChange={setInflationRate} placeholder="4" />
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
                    <ResultGrid columns={3}>
                        <ResultCard title="Exact Real Rate" value={`${result.exactRealRate.toFixed(3)}%`} tone="accent" />
                        <ResultCard title="Approximate Real Rate" value={`${result.approximateRealRate.toFixed(3)}%`} />
                        <ResultCard title="Difference" value={`${(result.exactRealRate - result.approximateRealRate).toFixed(3)} pts`} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Exact real rate = ((1 + nominal rate) / (1 + inflation rate)) - 1; Approximation = nominal rate - inflation rate."
                        steps={[
                            `Exact real rate = ${result.exactRealRate.toFixed(3)}%.`,
                            `Approximate real rate = ${result.approximateRealRate.toFixed(3)}%.`,
                        ]}
                        interpretation={`The exact real return is ${result.exactRealRate.toFixed(3)}%. Use the approximation for quick review work, but prefer the exact formula when precision matters.`}
                        notes={[
                            "The approximation becomes closer when both nominal rate and inflation are relatively low.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
