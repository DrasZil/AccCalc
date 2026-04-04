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

export default function PartnershipProfitSharingPage() {
    const [partnershipAmount, setPartnershipAmount] = useState("");
    const [partnerARatio, setPartnerARatio] = useState("");
    const [partnerBRatio, setPartnerBRatio] = useState("");
    const [partnerCRatio, setPartnerCRatio] = useState("");

    useSmartSolverConnector({
        partnershipAmount: setPartnershipAmount,
        partnerARatio: setPartnerARatio,
        partnerBRatio: setPartnerBRatio,
        partnerCRatio: setPartnerCRatio,
    });

    const result = useMemo(() => {
        if (
            partnershipAmount.trim() === "" ||
            partnerARatio.trim() === "" ||
            partnerBRatio.trim() === ""
        ) {
            return null;
        }

        const totalAmount = Number(partnershipAmount);
        const ratioA = Number(partnerARatio);
        const ratioB = Number(partnerBRatio);
        const ratioC = partnerCRatio.trim() === "" ? 0 : Number(partnerCRatio);

        if ([totalAmount, ratioA, ratioB, ratioC].some((value) => Number.isNaN(value))) {
            return {
                error: "All entered values must be valid numbers.",
            };
        }

        if (ratioA < 0 || ratioB < 0 || ratioC < 0) {
            return {
                error: "Profit-and-loss ratios cannot be negative.",
            };
        }

        const totalRatio = ratioA + ratioB + ratioC;

        if (totalRatio <= 0) {
            return {
                error: "Total ratio must be greater than zero.",
            };
        }

        const shareA = totalAmount * (ratioA / totalRatio);
        const shareB = totalAmount * (ratioB / totalRatio);
        const shareC = totalAmount * (ratioC / totalRatio);

        return {
            totalAmount,
            ratioA,
            ratioB,
            ratioC,
            totalRatio,
            shareA,
            shareB,
            shareC,
            formula: (
                <>
                    Partner Share = Total Partnership Profit or Loss × Individual Ratio / Total Ratio
                </>
            ),
            steps: [
                `Total ratio = ${ratioA} + ${ratioB} + ${ratioC} = ${totalRatio}`,
                `Partner A share = ${formatPHP(totalAmount)} x ${ratioA}/${totalRatio} = ${formatPHP(shareA)}`,
                `Partner B share = ${formatPHP(totalAmount)} x ${ratioB}/${totalRatio} = ${formatPHP(shareB)}`,
                `Partner C share = ${formatPHP(totalAmount)} x ${ratioC}/${totalRatio} = ${formatPHP(shareC)}`,
            ],
        };
    }, [partnershipAmount, partnerARatio, partnerBRatio, partnerCRatio]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Partnership"
            title="Partnership Profit Sharing"
            description="Allocate partnership net income or net loss using an agreed profit-and-loss ratio, a common topic in Philippine partnership accounting classes."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Partnership Profit or Loss"
                            value={partnershipAmount}
                            onChange={setPartnershipAmount}
                            placeholder="120000 or -30000"
                        />
                        <InputCard
                            label="Partner A Ratio"
                            value={partnerARatio}
                            onChange={setPartnerARatio}
                            placeholder="3"
                        />
                        <InputCard
                            label="Partner B Ratio"
                            value={partnerBRatio}
                            onChange={setPartnerBRatio}
                            placeholder="2"
                        />
                        <InputCard
                            label="Partner C Ratio (optional)"
                            value={partnerCRatio}
                            onChange={setPartnerCRatio}
                            placeholder="1"
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
                        <ResultCard title="Partner A Share" value={formatPHP(result.shareA)} />
                        <ResultCard title="Partner B Share" value={formatPHP(result.shareB)} />
                        <ResultCard title="Partner C Share" value={formatPHP(result.shareC)} />
                        <ResultCard title="Ratio Total" value={String(result.totalRatio)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard formula={result.formula} steps={result.steps} />
                ) : null
            }
        />
    );
}
