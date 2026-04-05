import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computePartnershipAdmissionBonus } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function PartnershipAdmissionBonusPage() {
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

        const admission = computePartnershipAdmissionBonus(
            parsedTotalOldCapital,
            parsedPartnerInvestment,
            parsedOwnershipPercentage
        );

        return {
            totalActualCapital: admission.totalActualCapital,
            capitalCredit: admission.capitalCredit,
            bonus: admission.bonus,
            formula: "Capital credit of new partner = (Old capital + Investment) x Ownership percentage",
            steps: [
                `Total actual capital after admission = ${formatPHP(parsedTotalOldCapital)} + ${formatPHP(parsedPartnerInvestment)} = ${formatPHP(admission.totalActualCapital)}`,
                `Capital credit to incoming partner = ${formatPHP(admission.totalActualCapital)} x ${admission.ownershipDecimal.toFixed(4)} = ${formatPHP(admission.capitalCredit)}`,
                `Bonus = ${formatPHP(parsedPartnerInvestment)} - ${formatPHP(admission.capitalCredit)} = ${formatPHP(admission.bonus)}`,
            ],
            glossary: [
                {
                    term: "Bonus method",
                    meaning: "A partnership admission method where the difference between investment and capital credit is treated as bonus rather than goodwill.",
                },
                {
                    term: "Capital credit",
                    meaning: "The capital amount recorded for the incoming partner based on the agreed ownership interest.",
                },
                {
                    term: "Bonus",
                    meaning: "The excess or deficiency transferred between the incoming partner and the old partners.",
                },
            ],
            interpretation:
                admission.bonus >= 0
                    ? `The incoming partner contributes more than the capital credit recorded, so ${formatPHP(admission.bonus)} is treated as bonus to the old partners.`
                    : `The incoming partner receives a capital credit larger than the investment, so ${formatPHP(Math.abs(admission.bonus))} is treated as bonus from the old partners to the incoming partner.`,
            assumptions: [
                "This page applies the bonus method only and does not recognize implied goodwill.",
                "Ownership percentage is treated as the incoming partner's agreed capital interest immediately after admission.",
            ],
            warnings: [
                "If the problem states that admission implies unrecorded goodwill, use the goodwill-method calculator instead of the bonus method.",
            ],
        };
    }, [ownershipPercentage, partnerInvestment, totalOldCapital]);

    return (
        <CalculatorPageLayout
            badge="Accounting | Partnership"
            title="Partnership Admission Bonus"
            description="Compute the incoming partner's capital credit and the related partnership bonus under the bonus method."
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
                        <ResultCard title="Total Capital After Admission" value={formatPHP(result.totalActualCapital)} />
                        <ResultCard title="Incoming Partner Capital Credit" value={formatPHP(result.capitalCredit)} />
                        <ResultCard title="Bonus" value={formatPHP(result.bonus)} />
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
