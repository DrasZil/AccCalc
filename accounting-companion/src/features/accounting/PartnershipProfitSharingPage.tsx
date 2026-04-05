import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computePartnershipProfitSharing } from "../../utils/calculatorMath";
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
            return { error: "All entered values must be valid numbers." };
        }

        if (ratioA < 0 || ratioB < 0 || ratioC < 0) {
            return { error: "Profit-and-loss ratios cannot be negative." };
        }

        const totalRatio = ratioA + ratioB + ratioC;
        if (totalRatio <= 0) {
            return { error: "Total ratio must be greater than zero." };
        }

        const sharing = computePartnershipProfitSharing({
            partnershipAmount: totalAmount,
            ratioA,
            ratioB,
            ratioC,
        });

        return {
            shareA: sharing.shareA,
            shareB: sharing.shareB,
            shareC: sharing.shareC,
            totalRatio: sharing.totalRatio,
            formula: "Partner share = Total partnership profit or loss x Individual ratio / Total ratio",
            steps: [
                `Total ratio = ${ratioA} + ${ratioB} + ${ratioC} = ${sharing.totalRatio}`,
                `Partner A share = ${formatPHP(totalAmount)} x ${ratioA}/${sharing.totalRatio} = ${formatPHP(sharing.shareA)}`,
                `Partner B share = ${formatPHP(totalAmount)} x ${ratioB}/${sharing.totalRatio} = ${formatPHP(sharing.shareB)}`,
                `Partner C share = ${formatPHP(totalAmount)} x ${ratioC}/${sharing.totalRatio} = ${formatPHP(sharing.shareC)}`,
            ],
            glossary: [
                {
                    term: "Profit-and-loss ratio",
                    meaning: "The agreed basis used to divide partnership income or loss among partners.",
                },
                {
                    term: "Net income",
                    meaning: "The partnership's excess of revenues over expenses for the period.",
                },
                {
                    term: "Net loss",
                    meaning: "The partnership's excess of expenses over revenues for the period.",
                },
            ],
            interpretation:
                totalAmount >= 0
                    ? `Using the agreed ratio, the partnership income of ${formatPHP(totalAmount)} is allocated proportionately to each partner.`
                    : `Using the agreed ratio, the partnership loss of ${formatPHP(Math.abs(totalAmount))} is absorbed proportionately by each partner.`,
            assumptions: [
                "This page assumes the amount to be distributed is already final after closing adjustments.",
                "If salary or interest allowances apply, compute those before using the remaining distributable amount here.",
            ],
            warnings: [
                "Do not assume capital ratios and profit-and-loss ratios are automatically the same unless the partnership agreement says so.",
            ],
        };
    }, [partnershipAmount, partnerARatio, partnerBRatio, partnerCRatio]);

    return (
        <CalculatorPageLayout
            badge="Accounting | Partnership"
            title="Partnership Profit Sharing"
            description="Allocate partnership net income or net loss using the agreed profit-and-loss ratio."
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
