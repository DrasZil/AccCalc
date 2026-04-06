import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeMaterialsQuantityVariance } from "../../utils/calculatorMath";

export default function MaterialsQuantityVariancePage() {
    const [actualQuantityUsed, setActualQuantityUsed] = useState("");
    const [standardQuantityAllowed, setStandardQuantityAllowed] = useState("");
    const [standardPrice, setStandardPrice] = useState("");

    const result = useMemo(() => {
        if (
            actualQuantityUsed.trim() === "" ||
            standardQuantityAllowed.trim() === "" ||
            standardPrice.trim() === ""
        ) {
            return null;
        }

        const values = [
            Number(actualQuantityUsed),
            Number(standardQuantityAllowed),
            Number(standardPrice),
        ];

        if (values.some((value) => Number.isNaN(value))) {
            return { error: "All fields must contain valid numbers." };
        }

        if (values.some((value) => value < 0)) {
            return { error: "Actual quantity, standard quantity, and standard price cannot be negative." };
        }

        return computeMaterialsQuantityVariance(values[0], values[1], values[2]);
    }, [actualQuantityUsed, standardPrice, standardQuantityAllowed]);

    return (
        <CalculatorPageLayout
            badge="Managerial & Cost"
            title="Materials Quantity Variance"
            description="Measure whether production used more or fewer direct materials than the standard quantity allowed for the output achieved."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Actual Quantity Used"
                            value={actualQuantityUsed}
                            onChange={setActualQuantityUsed}
                            placeholder="5200"
                        />
                        <InputCard
                            label="Standard Quantity Allowed"
                            value={standardQuantityAllowed}
                            onChange={setStandardQuantityAllowed}
                            placeholder="5000"
                        />
                        <InputCard
                            label="Standard Price per Unit"
                            value={standardPrice}
                            onChange={setStandardPrice}
                            placeholder="20"
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
                    <ResultGrid columns={2}>
                        <ResultCard
                            title="Materials Quantity Variance"
                            value={formatPHP(result.variance)}
                        />
                        <ResultCard
                            title="Variance Direction"
                            value={result.direction}
                        />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Materials quantity variance = (actual quantity used - standard quantity allowed) x standard price."
                        steps={[
                            `Variance = (${Number(actualQuantityUsed || 0)} - ${Number(standardQuantityAllowed || 0)}) x ${formatPHP(Number(standardPrice || 0))} = ${formatPHP(result.variance)}.`,
                        ]}
                        interpretation={
                            result.direction === "Unfavorable"
                                ? "The quantity variance is unfavorable because actual material usage exceeded the standard quantity allowed."
                                : result.direction === "Favorable"
                                  ? "The quantity variance is favorable because actual material usage was lower than the standard quantity allowed."
                                  : "There is no quantity variance because actual usage matched the standard quantity."
                        }
                    />
                ) : null
            }
        />
    );
}
