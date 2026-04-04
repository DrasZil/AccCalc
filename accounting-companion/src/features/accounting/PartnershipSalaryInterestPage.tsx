import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";

export default function PartnershipSalaryInterestPage() {
    const [partnershipAmount, setPartnershipAmount] = useState("");
    const [partnerASalary, setPartnerASalary] = useState("");
    const [partnerBSalary, setPartnerBSalary] = useState("");
    const [partnerAAverageCapital, setPartnerAAverageCapital] = useState("");
    const [partnerBAverageCapital, setPartnerBAverageCapital] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [partnerARemainderRatio, setPartnerARemainderRatio] = useState("");
    const [partnerBRemainderRatio, setPartnerBRemainderRatio] = useState("");

    const result = useMemo(() => {
        const required = [
            partnershipAmount,
            partnerASalary,
            partnerBSalary,
            partnerAAverageCapital,
            partnerBAverageCapital,
            interestRate,
            partnerARemainderRatio,
            partnerBRemainderRatio,
        ];

        if (required.some((value) => value.trim() === "")) return null;

        const values = required.map(Number);
        if (values.some((value) => Number.isNaN(value))) {
            return { error: "All fields must contain valid numbers." };
        }

        const [
            parsedPartnershipAmount,
            parsedPartnerASalary,
            parsedPartnerBSalary,
            parsedPartnerAAverageCapital,
            parsedPartnerBAverageCapital,
            parsedInterestRate,
            parsedPartnerARemainderRatio,
            parsedPartnerBRemainderRatio,
        ] = values;

        if (
            parsedPartnerASalary < 0 ||
            parsedPartnerBSalary < 0 ||
            parsedPartnerAAverageCapital < 0 ||
            parsedPartnerBAverageCapital < 0 ||
            parsedInterestRate < 0 ||
            parsedPartnerARemainderRatio < 0 ||
            parsedPartnerBRemainderRatio < 0
        ) {
            return {
                error: "Salary allowances, average capital, interest rate, and remainder ratios cannot be negative.",
            };
        }

        const ratioTotal = parsedPartnerARemainderRatio + parsedPartnerBRemainderRatio;
        if (ratioTotal <= 0) {
            return { error: "The remainder ratio total must be greater than zero." };
        }

        const interestShareA = parsedPartnerAAverageCapital * (parsedInterestRate / 100);
        const interestShareB = parsedPartnerBAverageCapital * (parsedInterestRate / 100);
        const totalAppropriation =
            parsedPartnerASalary +
            parsedPartnerBSalary +
            interestShareA +
            interestShareB;
        const remainder = parsedPartnershipAmount - totalAppropriation;
        const remainderShareA = remainder * (parsedPartnerARemainderRatio / ratioTotal);
        const remainderShareB = remainder * (parsedPartnerBRemainderRatio / ratioTotal);
        const finalShareA = parsedPartnerASalary + interestShareA + remainderShareA;
        const finalShareB = parsedPartnerBSalary + interestShareB + remainderShareB;

        return {
            interestShareA,
            interestShareB,
            totalAppropriation,
            remainder,
            finalShareA,
            finalShareB,
            formula:
                "Final Share = Salary Allowance + Interest Allowance + Share in Remainder",
            steps: [
                `Partner A interest allowance = ${formatPHP(parsedPartnerAAverageCapital)} x ${parsedInterestRate}% = ${formatPHP(interestShareA)}`,
                `Partner B interest allowance = ${formatPHP(parsedPartnerBAverageCapital)} x ${parsedInterestRate}% = ${formatPHP(interestShareB)}`,
                `Total salary and interest allowances = ${formatPHP(totalAppropriation)}`,
                `Remainder = ${formatPHP(parsedPartnershipAmount)} - ${formatPHP(totalAppropriation)} = ${formatPHP(remainder)}`,
                `Partner A remainder share = ${formatPHP(remainder)} x ${parsedPartnerARemainderRatio}/${ratioTotal} = ${formatPHP(remainderShareA)}`,
                `Partner B remainder share = ${formatPHP(remainder)} x ${parsedPartnerBRemainderRatio}/${ratioTotal} = ${formatPHP(remainderShareB)}`,
            ],
            glossary: [
                {
                    term: "Salary allowance",
                    meaning: "An agreed internal allocation to a partner before dividing the remaining profit or loss. It is not an expense of the partnership.",
                },
                {
                    term: "Interest allowance",
                    meaning: "An allocation based on partners' capital balances to recognize differing investment amounts.",
                },
                {
                    term: "Remainder",
                    meaning: "The balance of partnership profit or loss left after salary and interest allowances are assigned.",
                },
            ],
            interpretation:
                remainder >= 0
                    ? "The partnership profit was enough to cover the salary and interest allowances, so the remaining profit was shared using the stated remainder ratio."
                    : "The allowances exceeded partnership profit, so the deficit reduced each partner's final share through the remainder allocation.",
            assumptions: [
                "Salary and interest allowances are appropriations of partnership income, not operating expenses.",
                "A negative partnership amount represents a partnership loss and reduces the remainder available to partners.",
            ],
        };
    }, [
        interestRate,
        partnerAAverageCapital,
        partnerARemainderRatio,
        partnerASalary,
        partnerBAverageCapital,
        partnerBRemainderRatio,
        partnerBSalary,
        partnershipAmount,
    ]);

    return (
        <CalculatorPageLayout
            badge="Accounting | Partnership"
            title="Partnership Salary and Interest Distribution"
            description="Allocate partnership income after salary allowances, interest on capital, and the remainder ratio."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Partnership Net Income or Loss"
                            value={partnershipAmount}
                            onChange={setPartnershipAmount}
                            placeholder="150000"
                        />
                        <InputCard
                            label="Partner A Salary Allowance"
                            value={partnerASalary}
                            onChange={setPartnerASalary}
                            placeholder="30000"
                        />
                        <InputCard
                            label="Partner B Salary Allowance"
                            value={partnerBSalary}
                            onChange={setPartnerBSalary}
                            placeholder="25000"
                        />
                        <InputCard
                            label="Partner A Average Capital"
                            value={partnerAAverageCapital}
                            onChange={setPartnerAAverageCapital}
                            placeholder="200000"
                        />
                        <InputCard
                            label="Partner B Average Capital"
                            value={partnerBAverageCapital}
                            onChange={setPartnerBAverageCapital}
                            placeholder="180000"
                        />
                        <InputCard
                            label="Interest Rate (%)"
                            value={interestRate}
                            onChange={setInterestRate}
                            placeholder="10"
                        />
                        <InputCard
                            label="Partner A Remainder Ratio"
                            value={partnerARemainderRatio}
                            onChange={setPartnerARemainderRatio}
                            placeholder="3"
                        />
                        <InputCard
                            label="Partner B Remainder Ratio"
                            value={partnerBRemainderRatio}
                            onChange={setPartnerBRemainderRatio}
                            placeholder="2"
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
                        <ResultCard title="Partner A Final Share" value={formatPHP(result.finalShareA)} />
                        <ResultCard title="Partner B Final Share" value={formatPHP(result.finalShareB)} />
                        <ResultCard title="Remainder" value={formatPHP(result.remainder)} />
                        <ResultCard
                            title="Partner A Interest Allowance"
                            value={formatPHP(result.interestShareA)}
                        />
                        <ResultCard
                            title="Partner B Interest Allowance"
                            value={formatPHP(result.interestShareB)}
                        />
                        <ResultCard
                            title="Total Appropriation"
                            value={formatPHP(result.totalAppropriation)}
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
                    />
                ) : null
            }
        />
    );
}
