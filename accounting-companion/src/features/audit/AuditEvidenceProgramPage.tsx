import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeAuditEvidenceProgram } from "../../utils/calculatorMath";

export default function AuditEvidenceProgramPage() {
    const [assertionRisk, setAssertionRisk] = useState("4.2");
    const [evidenceReliability, setEvidenceReliability] = useState("3.5");
    const [evidenceRelevance, setEvidenceRelevance] = useState("3.2");
    const [coverageDepth, setCoverageDepth] = useState("2.8");
    const [contradictionCount, setContradictionCount] = useState("1");

    const result = useMemo(() => {
        const values = [
            assertionRisk,
            evidenceReliability,
            evidenceRelevance,
            coverageDepth,
            contradictionCount,
        ];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All evidence-program inputs must be valid numbers." };
        }
        if (numeric.slice(0, 4).some((value) => value < 1 || value > 5)) {
            return { error: "Risk, reliability, relevance, and coverage ratings must be from 1 to 5." };
        }
        if (numeric[4] < 0) return { error: "Contradiction count cannot be negative." };

        return computeAuditEvidenceProgram({
            assertionRisk: numeric[0],
            evidenceReliability: numeric[1],
            evidenceRelevance: numeric[2],
            coverageDepth: numeric[3],
            contradictionCount: numeric[4],
        });
    }, [
        assertionRisk,
        contradictionCount,
        coverageDepth,
        evidenceReliability,
        evidenceRelevance,
    ]);

    return (
        <CalculatorPageLayout
            badge="Audit & Assurance"
            title="Audit Evidence Program Builder"
            description="Score assertion risk against evidence reliability, relevance, coverage, and contradictions so audit-procedure planning stays structured."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Assertion Risk (1-5)"
                            value={assertionRisk}
                            onChange={setAssertionRisk}
                            placeholder="4.2"
                        />
                        <InputCard
                            label="Evidence Reliability (1-5)"
                            value={evidenceReliability}
                            onChange={setEvidenceReliability}
                            placeholder="3.5"
                        />
                        <InputCard
                            label="Evidence Relevance (1-5)"
                            value={evidenceRelevance}
                            onChange={setEvidenceRelevance}
                            placeholder="3.2"
                        />
                        <InputCard
                            label="Coverage Depth (1-5)"
                            value={coverageDepth}
                            onChange={setCoverageDepth}
                            placeholder="2.8"
                        />
                        <InputCard
                            label="Contradictory Evidence Items"
                            value={contradictionCount}
                            onChange={setContradictionCount}
                            placeholder="1"
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
                    <div className="space-y-4">
                        <ResultGrid columns={3}>
                            <ResultCard
                                title="Evidence Strength Avg."
                                value={result.evidenceStrengthAverage.toFixed(2)}
                                tone="accent"
                            />
                            <ResultCard
                                title="Contradiction Penalty"
                                value={result.contradictionPenalty.toFixed(2)}
                            />
                            <ResultCard
                                title="Residual Evidence Gap"
                                value={result.residualEvidenceGap.toFixed(2)}
                                tone={result.residualEvidenceGap >= 2.5 ? "warning" : "default"}
                            />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Procedure intensity</p>
                            <p className="app-body-md mt-2 text-sm">{result.procedureIntensity}</p>
                            <p className="app-helper mt-3 text-xs">{result.evidenceSignal}</p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Residual evidence gap = assertion risk - (evidence strength average - contradiction penalty)"
                        steps={[
                            `Evidence strength average = ${result.evidenceStrengthAverage.toFixed(2)}.`,
                            `Contradiction penalty = ${Number(contradictionCount).toFixed(0)} x 0.60 = ${result.contradictionPenalty.toFixed(2)}.`,
                            `Residual evidence gap = ${result.residualEvidenceGap.toFixed(2)}.`,
                        ]}
                        interpretation="This is a classroom planning aid. It structures audit thinking but does not replace professional judgment, audit standards, or engagement-specific methodology."
                        warnings={[
                            "External, independent evidence is normally stronger than internally generated evidence.",
                            "Contradictory evidence should be resolved before concluding that an assertion is sufficiently supported.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
