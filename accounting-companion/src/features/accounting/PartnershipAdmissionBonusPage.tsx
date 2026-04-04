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
        if (!totalOldCapital || !partnerInvestment || !ownershipPercentage) return null;

        const parsedTotalOldCapital = Number(totalOldCapital);
        const parsedPartnerInvestment = Number(partnerInvestment);
        const parsedOwnershipPercentage = Number(ownershipPercentage);

        if ([parsedTotalOldCapital, parsedPartnerInvestment, parsedOwnershipPercentage].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedOwnershipPercentage <= 0 || parsedOwnershipPercentage >= 100) {
            return { error: "Ownership percentage must be greater than 0 and less than 100." };
        }

        const ownershipDecimal = parsedOwnershipPercentage / 100;
        const totalActualCapital = parsedTotalOldCapital + parsedPartnerInvestment;
        const capitalCredit = totalActualCapital * ownershipDecimal;
        const bonus = parsedPartnerInvestment - capitalCredit;

        return {
            totalActualCapital,
            capitalCredit,
            bonus,
            formula: "Capital Credit of New Partner = (Old Capital + Investment) × Ownership Percentage",
            steps: [
                `Total actual capital after admission = ${formatPHP(parsedTotalOldCapital)} + ${formatPHP(parsedPartnerInvestment)} = ${formatPHP(totalActualCapital)}`,
                `Capital credit to incoming partner = ${formatPHP(totalActualCapital)} × ${ownershipDecimal.toFixed(4)} = ${formatPHP(capitalCredit)}`,
                `Bonus = ${formatPHP(parsedPartnerInvestment)} - ${formatPHP(capitalCredit)} = ${formatPHP(bonus)}`,
            ],
            glossary: [
                { term: "Bonus Method", meaning: "A partnership admission method where the difference between investment and capital credit is treated as bonus rather than goodwill." },
                { term: "Capital Credit", meaning: "The capital amount recorded for the incoming partner based on the agreed ownership interest." },
                { term: "Bonus", meaning: "The excess or deficiency transferred between the incoming partner and the old partners." },
            ],
            interpretation:
                bonus >= 0
                    ? `The incoming partner contributes more than the capital credit recorded, so ${formatPHP(bonus)} is treated as bonus to the old partners.`
                    : `The incoming partner receives a capital credit larger than the investment, so ${formatPHP(Math.abs(bonus))} is treated as bonus from the old partners to the incoming partner.`,
        };
    }, [ownershipPercentage, partnerInvestment, totalOldCapital]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Partnership"
            title="Partnership Admission Bonus"
            description="Compute the incoming partner's capital credit and the related partnership bonus under the bonus method."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Total Old Partners' Capital" value={totalOldCapital} onChange={setTotalOldCapital} placeholder="300000" />
                        <InputCard label="Incoming Partner Investment" value={partnerInvestment} onChange={setPartnerInvestment} placeholder="120000" />
                        <InputCard label="Ownership Percentage (%)" value={ownershipPercentage} onChange={setOwnershipPercentage} placeholder="25" />
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
                    <FormulaCard formula={result.formula} steps={result.steps} glossary={result.glossary} interpretation={result.interpretation} />
                ) : null
            }
        />
    );
}
