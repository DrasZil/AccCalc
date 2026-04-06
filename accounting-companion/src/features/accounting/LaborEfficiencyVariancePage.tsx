import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeLaborEfficiencyVariance } from "../../utils/calculatorMath";

export default function LaborEfficiencyVariancePage() {
    const [actualHours, setActualHours] = useState("");
    const [standardHoursAllowed, setStandardHoursAllowed] = useState("");
    const [standardRate, setStandardRate] = useState("");

    const result = useMemo(() => {
        if (
            actualHours.trim() === "" ||
            standardHoursAllowed.trim() === "" ||
            standardRate.trim() === ""
        ) {
            return null;
        }

        const values = [
            Number(actualHours),
            Number(standardHoursAllowed),
            Number(standardRate),
        ];

        if (values.some((value) => Number.isNaN(value))) {
            return { error: "All fields must contain valid numbers." };
        }

        if (values.some((value) => value < 0)) {
            return { error: "Actual hours, standard hours, and standard rate cannot be negative." };
        }

        return computeLaborEfficiencyVariance(values[0], values[1], values[2]);
    }, [actualHours, standardHoursAllowed, standardRate]);

    return (
        <CalculatorPageLayout
            badge="Managerial & Cost"
            title="Labor Efficiency Variance"
            description="Check whether actual labor hours were more or less efficient than the standard hours allowed for the completed output."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Actual Hours"
                            value={actualHours}
                            onChange={setActualHours}
                            placeholder="2400"
                        />
                        <InputCard
                            label="Standard Hours Allowed"
                            value={standardHoursAllowed}
                            onChange={setStandardHoursAllowed}
                            placeholder="2200"
                        />
                        <InputCard
                            label="Standard Rate per Hour"
                            value={standardRate}
                            onChange={setStandardRate}
                            placeholder="170"
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
                            title="Labor Efficiency Variance"
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
                        formula="Labor efficiency variance = (actual hours - standard hours allowed) x standard rate."
                        steps={[
                            `Variance = (${Number(actualHours || 0)} - ${Number(standardHoursAllowed || 0)}) x ${formatPHP(Number(standardRate || 0))} = ${formatPHP(result.variance)}.`,
                        ]}
                        interpretation={
                            result.direction === "Unfavorable"
                                ? "The efficiency variance is unfavorable because actual labor hours exceeded the standard hours allowed."
                                : result.direction === "Favorable"
                                  ? "The efficiency variance is favorable because actual labor hours were lower than the standard hours allowed."
                                  : "There is no efficiency variance because actual labor hours matched the standard hours allowed."
                        }
                    />
                ) : null
            }
        />
    );
}
