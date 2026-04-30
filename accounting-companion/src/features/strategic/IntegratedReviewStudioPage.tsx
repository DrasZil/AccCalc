import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeIntegratedReviewReadiness } from "../../utils/calculatorMath";

export default function IntegratedReviewStudioPage() {
    const [topicIdentification, setTopicIdentification] = useState("3.5");
    const [computationAccuracy, setComputationAccuracy] = useState("3");
    const [explanationQuality, setExplanationQuality] = useState("3");
    const [assumptionDiscipline, setAssumptionDiscipline] = useState("2.5");
    const [followUpCompletion, setFollowUpCompletion] = useState("2");

    const result = useMemo(() => {
        const values = [topicIdentification, computationAccuracy, explanationQuality, assumptionDiscipline, followUpCompletion];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All integrated-review ratings must be valid numbers." };
        }
        if (numeric.some((value) => value < 0 || value > 5)) {
            return { error: "Use ratings from 0 to 5 for each review readiness area." };
        }

        return computeIntegratedReviewReadiness({
            topicIdentification: numeric[0],
            computationAccuracy: numeric[1],
            explanationQuality: numeric[2],
            assumptionDiscipline: numeric[3],
            followUpCompletion: numeric[4],
        });
    }, [assumptionDiscipline, computationAccuracy, explanationQuality, followUpCompletion, topicIdentification]);

    return (
        <CalculatorPageLayout
            badge="Strategic | Integrated review"
            title="CPA Integrated Review Studio"
            description="Score a mixed-review attempt across topic identification, computation, explanation, assumptions, and follow-up so the next study step is specific instead of vague."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Topic Identification (0-5)" value={topicIdentification} onChange={setTopicIdentification} />
                        <InputCard label="Computation Accuracy (0-5)" value={computationAccuracy} onChange={setComputationAccuracy} />
                        <InputCard label="Explanation Quality (0-5)" value={explanationQuality} onChange={setExplanationQuality} />
                        <InputCard label="Assumption Discipline (0-5)" value={assumptionDiscipline} onChange={setAssumptionDiscipline} />
                        <InputCard label="Follow-up Completion (0-5)" value={followUpCompletion} onChange={setFollowUpCompletion} />
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
                            <ResultCard title="Readiness Score" value={result.readinessScore.toFixed(2)} tone="accent" />
                            <ResultCard title="Weakest Area" value={result.weakestArea} />
                            <ResultCard title="Review Band" value={result.readinessBand} tone={result.readinessScore < 3.25 ? "warning" : "default"} />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Next attempt focus</p>
                            <p className="app-body-md mt-2 text-sm">{result.reviewSignal}</p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                <div className="space-y-4">
                    {result && !("error" in result) ? (
                        <FormulaCard
                            formula="Readiness score = average of five review dimensions"
                            steps={[
                                "Rate the last mixed case honestly from 0 to 5.",
                                `Readiness score = ${result.readinessScore.toFixed(2)}.`,
                                `Weakest area = ${result.weakestArea}.`,
                                "Use the related routes to repair the weakest category before adding a harder mixed set.",
                            ]}
                            interpretation="This studio is a review steering tool. It turns mixed-practice performance into a concrete next study action."
                            warnings={[
                                "A high score still needs topic-specific verification when the case includes tax, law, audit, or standards-sensitive content.",
                                "Use workpapers to preserve assumptions when a mixed case spans multiple subjects.",
                            ]}
                        />
                    ) : null}
                    <RelatedLinksPanel
                        title="Integrated repair routes"
                        summary="Use these routes after the readiness score identifies the weak step."
                        badge="Review loop"
                        items={[
                            { path: "/study/practice", label: "Practice Hub", description: "Retake topic quizzes and weak-area review sets." },
                            { path: "/smart/solver", label: "Smart Solver", description: "Paste a mixed prompt and confirm the route before solving." },
                            { path: "/workpapers", label: "Workpaper Studio", description: "Record subject, route, result, limitation, and follow-up." },
                            { path: "/strategic/integrative-case-mapper", label: "Integrative Case Mapper", description: "Split multi-topic cases into subject-specific routes." },
                        ]}
                        showDescriptions
                    />
                </div>
            }
        />
    );
}
