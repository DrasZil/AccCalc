import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeIncidentResponseTriage } from "../../utils/calculatorMath";

export default function IncidentResponseTriagePage() {
    const [confidentialityImpact, setConfidentialityImpact] = useState("4");
    const [integrityImpact, setIntegrityImpact] = useState("3");
    const [availabilityImpact, setAvailabilityImpact] = useState("2");
    const [controlContainment, setControlContainment] = useState("2");
    const [evidenceReadiness, setEvidenceReadiness] = useState("2");

    const result = useMemo(() => {
        const values = [
            confidentialityImpact,
            integrityImpact,
            availabilityImpact,
            controlContainment,
            evidenceReadiness,
        ];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All incident-response ratings must be valid numbers." };
        }
        if (numeric.some((value) => value < 0 || value > 5)) {
            return { error: "Use ratings from 0 to 5 for impact, containment, and evidence readiness." };
        }

        return computeIncidentResponseTriage({
            confidentialityImpact: numeric[0],
            integrityImpact: numeric[1],
            availabilityImpact: numeric[2],
            controlContainment: numeric[3],
            evidenceReadiness: numeric[4],
        });
    }, [
        availabilityImpact,
        confidentialityImpact,
        controlContainment,
        evidenceReadiness,
        integrityImpact,
    ]);

    return (
        <CalculatorPageLayout
            badge="AIS | IT controls"
            title="Incident Response Triage"
            description="Score confidentiality, integrity, and availability impact against containment and evidence readiness for AIS incident-management and IT-audit review."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Confidentiality Impact (0-5)" value={confidentialityImpact} onChange={setConfidentialityImpact} />
                        <InputCard label="Integrity Impact (0-5)" value={integrityImpact} onChange={setIntegrityImpact} />
                        <InputCard label="Availability Impact (0-5)" value={availabilityImpact} onChange={setAvailabilityImpact} />
                        <InputCard label="Control Containment (0-5)" value={controlContainment} onChange={setControlContainment} />
                        <InputCard label="Evidence Readiness (0-5)" value={evidenceReadiness} onChange={setEvidenceReadiness} />
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
                            <ResultCard title="Impact Score" value={result.impactScore.toFixed(2)} tone="accent" />
                            <ResultCard title="Response Readiness" value={result.responseReadiness.toFixed(2)} />
                            <ResultCard title="Residual Risk" value={result.residualIncidentRisk.toFixed(2)} tone={result.residualIncidentRisk >= 8 ? "warning" : "default"} />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">{result.responseTier}</p>
                            <p className="app-body-md mt-2 text-sm">{result.responseSignal}</p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Residual incident risk = CIA impact score - response readiness"
                        steps={[
                            `CIA impact score = ${result.impactScore.toFixed(2)}.`,
                            `Response readiness = containment + evidence readiness = ${result.responseReadiness.toFixed(2)}.`,
                            `Residual incident risk = ${result.residualIncidentRisk.toFixed(2)}.`,
                        ]}
                        interpretation="This workspace supports AIS, IT controls, and IT-audit review. It is a study model, not an operational security incident platform."
                        warnings={[
                            "Preserve evidence before altering systems in real incident work.",
                            "Escalation, notification, and legal obligations depend on current policies and law.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
