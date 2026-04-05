import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computePartnershipAdmissionGoodwill } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function PartnershipAdmissionGoodwillPage() {
    const [totalOldCapital, setTotalOldCapital] = useState("");
    const [partnerInvestment, setPartnerInvestment] = useState("");
    const [ownershipPercentage, setOwnershipPercentage] = useState("");

    useSmartSolverConnector({
        totalOldCapital: setTotalOldCapital,
        partnerInvestment: setPartnerInvestment,
        ownershipPercentage: setOwnershipPercentage,
    });

    const result = useMemo(() => {
        if (
            totalOldCapital.trim() === "" ||
            partnerInvestment.trim() === "" ||
            ownershipPercentage.trim() === ""
        ) {
            return null;
        }

        const parsedTotalOldCapital = Number(totalOldCapital);
        const parsedPartnerInvestment = Number(partnerInvestment);
        const parsedOwnershipPercentage = Number(ownershipPercentage);

        if (
            [parsedTotalOldCapital, parsedPartnerInvestment, parsedOwnershipPercentage].some(
                (value) => Number.isNaN(value)
            )
        ) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedTotalOldCapital < 0 || parsedPartnerInvestment < 0) {
            return { error: "Old capital and partner investment cannot be negative." };
        }

        if (parsedOwnershipPercentage <= 0 || parsedOwnershipPercentage >= 100) {
            return { error: "Ownership percentage must be greater than 0 and less than 100." };
        }

        const admission = computePartnershipAdmissionGoodwill(
            parsedTotalOldCapital,
            parsedPartnerInvestment,
            parsedOwnershipPercentage
        );

        return {
            ...admission,
            formula:
                "Goodwill = (Investment / Ownership percentage) - (Old capital + Investment)",
            steps: [
                `Implied total capital = ${formatPHP(parsedPartnerInvestment)} / ${admission.ownershipDecimal.toFixed(4)} = ${formatPHP(admission.impliedTotalCapital)}`,
                `Recorded capital after investment = ${formatPHP(parsedTotalOldCapital)} + ${formatPHP(parsedPartnerInvestment)} = ${formatPHP(admission.actualCapitalAfterInvestment)}`,
                `Implied goodwill = ${formatPHP(admission.impliedTotalCapital)} - ${formatPHP(admission.actualCapitalAfterInvestment)} = ${formatPHP(admission.goodwill)}`,
            ],
            glossary: [
                {
                    term: "Goodwill method",
                    meaning: "A partnership admission approach that recognizes implied goodwill when the agreed ownership interest suggests a total capital larger than recorded book capital.",
                },
                {
                    term: "Implied total capital",
                    meaning: "The total partnership value inferred from the incoming partner's investment and agreed ownership percentage.",
                },
                {
                    term: "Goodwill",
                    meaning: "An unrecorded intangible value recognized so capital balances reflect the implied partnership value.",
                },
            ],
            interpretation:
                admission.goodwill > 0
                    ? `The agreed ownership percentage implies ${formatPHP(admission.goodwill)} of unrecorded goodwill before finalizing capital balances.`
                    : admission.goodwill < 0
                      ? `The agreed ownership percentage implies recorded capital already exceeds the implied partnership value by ${formatPHP(Math.abs(admission.goodwill))}. Review whether the problem really calls for goodwill recognition.`
                      : "The incoming investment supports the recorded capital amount exactly, so no goodwill is implied.",
            assumptions: [
                "Ownership percentage is treated as the incoming partner's agreed capital interest after admission.",
                "This calculator follows the goodwill-method classroom treatment and focuses on implied capital, not later bonus reallocations.",
            ],
            warnings: [
                "If the problem states the difference should be treated as bonus instead of goodwill, use the bonus-method calculator instead.",
            ],
        };
    }, [ownershipPercentage, partnerInvestment, totalOldCapital]);

    return (
        <CalculatorPageLayout
            badge="Accounting | Partnership"
            title="Partnership Admission Goodwill"
            description="Estimate implied partnership capital and goodwill when the incoming partner's agreed ownership percentage points to a higher total value."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Total Old Partners' Capital"
                            value={totalOldCapital}
                            onChange={setTotalOldCapital}
                            placeholder="300000"
                        />
                        <InputCard
                            label="Incoming Partner Investment"
                            value={partnerInvestment}
                            onChange={setPartnerInvestment}
                            placeholder="120000"
                        />
                        <InputCard
                            label="Ownership Percentage (%)"
                            value={ownershipPercentage}
                            onChange={setOwnershipPercentage}
                            placeholder="25"
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
                        <ResultCard
                            title="Implied Total Capital"
                            value={formatPHP(result.impliedTotalCapital)}
                        />
                        <ResultCard
                            title="Recorded Capital After Investment"
                            value={formatPHP(result.actualCapitalAfterInvestment)}
                        />
                        <ResultCard title="Implied Goodwill" value={formatPHP(result.goodwill)} />
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
                        assumptions={result.assumptions}
                        warnings={result.warnings}
                    />
                ) : null
            }
        />
    );
}
