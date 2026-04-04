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

export default function BookValuePerSharePage() {
    const [commonEquity, setCommonEquity] = useState("");
    const [outstandingCommonShares, setOutstandingCommonShares] = useState("");

    useSmartSolverConnector({
        commonEquity: setCommonEquity,
        outstandingCommonShares: setOutstandingCommonShares,
    });

    const result = useMemo(() => {
        if (!commonEquity || !outstandingCommonShares) return null;

        const parsedCommonEquity = Number(commonEquity);
        const parsedOutstandingCommonShares = Number(outstandingCommonShares);

        if ([parsedCommonEquity, parsedOutstandingCommonShares].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedOutstandingCommonShares === 0) {
            return { error: "Outstanding common shares cannot be zero." };
        }

        const bookValuePerShare = parsedCommonEquity / parsedOutstandingCommonShares;

        return {
            bookValuePerShare,
            formula: "Book Value Per Share = Common Equity / Outstanding Common Shares",
            steps: [
                `Book value per share = ${formatPHP(parsedCommonEquity)} / ${parsedOutstandingCommonShares.toLocaleString()} = ${bookValuePerShare.toFixed(4)}`,
            ],
            glossary: [
                { term: "Common Equity", meaning: "Equity attributable to common shareholders." },
                { term: "Outstanding Common Shares", meaning: "The number of common shares currently held by investors." },
                { term: "Book Value Per Share", meaning: "The accounting value of common equity represented by each common share." },
            ],
            interpretation: `Each outstanding common share represents about ${formatPHP(bookValuePerShare)} of book value based on the current common equity figure.`,
        };
    }, [commonEquity, outstandingCommonShares]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Book Value Per Share"
            description="Compute the book value represented by each outstanding common share."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Common Equity" value={commonEquity} onChange={setCommonEquity} placeholder="900000" />
                        <InputCard label="Outstanding Common Shares" value={outstandingCommonShares} onChange={setOutstandingCommonShares} placeholder="100000" />
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
                        <ResultCard title="Book Value Per Share" value={formatPHP(result.bookValuePerShare)} />
                        <ResultCard title="Common Equity" value={formatPHP(Number(commonEquity))} />
                        <ResultCard title="Outstanding Shares" value={Number(outstandingCommonShares).toLocaleString()} />
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
