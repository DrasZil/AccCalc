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
        const impliedTotalCapital = parsedPartnerInvestment / ownershipDecimal;
        const actualCapitalAfterInvestment = parsedTotalOldCapital + parsedPartnerInvestment;
        const goodwill = impliedTotalCapital - actualCapitalAfterInvestment;

        return {
            impliedTotalCapital,
            actualCapitalAfterInvestment,
            goodwill,
            formula: "Goodwill = (Investment / Ownership Percentage) - (Old Capital + Investment)",
            steps: [
                `Implied total capital = ${formatPHP(parsedPartnerInvestment)} / ${ownershipDecimal.toFixed(4)} = ${formatPHP(impliedTotalCapital)}`,
                `Actual capital after investment = ${formatPHP(parsedTotalOldCapital)} + ${formatPHP(parsedPartnerInvestment)} = ${formatPHP(actualCapitalAfterInvestment)}`,
                `Goodwill = ${formatPHP(impliedTotalCapital)} - ${formatPHP(actualCapitalAfterInvestment)} = ${formatPHP(goodwill)}`,
            ],
            glossary: [
                { term: "Goodwill Method", meaning: "A partnership admission method that recognizes implied goodwill before or upon admission." },
                { term: "Implied Total Capital", meaning: "The total partnership capital suggested by the amount invested and the ownership percentage acquired." },
                { term: "Goodwill", meaning: "An intangible value recognized when implied capital exceeds recorded capital." },
            ],
            interpretation:
                goodwill > 0
                    ? `The admission implies unrecorded goodwill of ${formatPHP(goodwill)} before recording the new partner's capital interest.`
                    : `There is no positive implied goodwill under these figures; if this is a classroom problem, the bonus method may fit better than the goodwill method.`,
        };
    }, [ownershipPercentage, partnerInvestment, totalOldCapital]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Partnership"
            title="Partnership Admission Goodwill"
            description="Compute implied total capital and goodwill when admitting a new partner under the goodwill method."
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
                        <ResultCard title="Implied Total Capital" value={formatPHP(result.impliedTotalCapital)} />
                        <ResultCard title="Actual Capital After Investment" value={formatPHP(result.actualCapitalAfterInvestment)} />
                        <ResultCard title="Goodwill" value={formatPHP(result.goodwill)} />
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
