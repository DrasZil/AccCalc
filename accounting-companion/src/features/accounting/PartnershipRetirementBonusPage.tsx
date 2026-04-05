import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import {
    computePartnershipRetirementBonus,
} from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function PartnershipRetirementBonusPage() {
    const [totalPartnershipCapital, setTotalPartnershipCapital] = useState("");
    const [retiringPartnerCapital, setRetiringPartnerCapital] = useState("");
    const [settlementPaid, setSettlementPaid] = useState("");

    useSmartSolverConnector({
        totalPartnershipCapital: setTotalPartnershipCapital,
        retiringPartnerCapital: setRetiringPartnerCapital,
        settlementPaid: setSettlementPaid,
    });

    const result = useMemo(() => {
        if (
            totalPartnershipCapital.trim() === "" ||
            retiringPartnerCapital.trim() === "" ||
            settlementPaid.trim() === ""
        ) {
            return null;
        }

        const totalCapital = Number(totalPartnershipCapital);
        const capitalBalance = Number(retiringPartnerCapital);
        const paid = Number(settlementPaid);

        if ([totalCapital, capitalBalance, paid].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (totalCapital < 0 || capitalBalance < 0 || paid < 0) {
            return { error: "Capital balances and settlement paid cannot be negative." };
        }

        if (capitalBalance > totalCapital) {
            return {
                error: "The retiring partner's capital balance cannot exceed total partnership capital.",
            };
        }

        if (paid > totalCapital) {
            return {
                error: "Settlement paid cannot exceed total partnership capital in this simplified withdrawal view.",
            };
        }

        const retirement = computePartnershipRetirementBonus({
            totalPartnershipCapital: totalCapital,
            retiringPartnerCapital: capitalBalance,
            settlementPaid: paid,
        });

        return {
            ...retirement,
            formula:
                "Bonus on retirement = Settlement paid - Retiring partner capital balance",
            steps: [
                `Settlement difference = ${formatPHP(paid)} - ${formatPHP(capitalBalance)} = ${formatPHP(retirement.settlementDifference)}`,
                `Remaining partnership capital after settlement = ${formatPHP(totalCapital)} - ${formatPHP(paid)} = ${formatPHP(retirement.remainingCapitalAfterSettlement)}`,
            ],
            glossary: [
                {
                    term: "Retiring partner capital",
                    meaning: "The partner's book capital balance before settlement.",
                },
                {
                    term: "Settlement paid",
                    meaning: "The cash or agreed value transferred to the retiring partner.",
                },
                {
                    term: "Bonus method",
                    meaning: "The settlement difference is treated as a transfer between partners rather than goodwill recognition.",
                },
            ],
            interpretation:
                retirement.direction === "bonus-to-retiring-partner"
                    ? `The retiring partner receives ${formatPHP(retirement.settlementDifference)} more than book capital, so the excess is treated as a bonus from the remaining partners under the bonus method.`
                    : retirement.direction === "bonus-to-remaining-partners"
                      ? `The retiring partner receives ${formatPHP(Math.abs(retirement.settlementDifference))} less than book capital, so the difference is treated as a bonus to the remaining partners.`
                      : "Settlement equals book capital, so no retirement bonus arises under the bonus method.",
            assumptions: [
                "This page applies the bonus-method treatment only. If the retirement problem requires goodwill recognition, that should be analyzed separately.",
                "The settlement view assumes the retiring partner is paid from recorded partnership resources and ignores tax, legal, or liquidation complications.",
            ],
            warnings: [
                "If the problem gives a profit-and-loss ratio for allocating the retirement bonus among remaining partners, that allocation must still be prepared separately.",
            ],
            notes: [
                "Use this after the retiring partner's final income share, drawings, and closing adjustments have already been reflected in book capital.",
            ],
        };
    }, [retiringPartnerCapital, settlementPaid, totalPartnershipCapital]);

    return (
        <CalculatorPageLayout
            badge="Accounting | Partnership"
            title="Partnership Retirement Bonus"
            description="Evaluate a retiring partner settlement under the bonus method and see whether the difference benefits the retiring partner or the remaining partners."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Total Partnership Capital Before Retirement"
                            value={totalPartnershipCapital}
                            onChange={setTotalPartnershipCapital}
                            placeholder="500000"
                        />
                        <InputCard
                            label="Retiring Partner Capital Balance"
                            value={retiringPartnerCapital}
                            onChange={setRetiringPartnerCapital}
                            placeholder="120000"
                        />
                        <InputCard
                            label="Settlement Paid to Retiring Partner"
                            value={settlementPaid}
                            onChange={setSettlementPaid}
                            placeholder="130000"
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
                            title="Settlement Difference"
                            value={formatPHP(result.settlementDifference)}
                            tone={
                                result.direction === "bonus-to-retiring-partner"
                                    ? "warning"
                                    : result.direction === "bonus-to-remaining-partners"
                                      ? "success"
                                      : "default"
                            }
                        />
                        <ResultCard
                            title="Remaining Capital After Settlement"
                            value={formatPHP(result.remainingCapitalAfterSettlement)}
                        />
                        <ResultCard
                            title="Direction"
                            value={
                                result.direction === "bonus-to-retiring-partner"
                                    ? "Bonus to retiring partner"
                                    : result.direction === "bonus-to-remaining-partners"
                                      ? "Bonus to remaining partners"
                                      : "No bonus"
                            }
                        />
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
                        notes={result.notes}
                    />
                ) : null
            }
        />
    );
}
