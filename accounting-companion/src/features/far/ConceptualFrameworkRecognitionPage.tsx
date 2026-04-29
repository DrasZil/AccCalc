import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";

type FrameworkIssue = "asset" | "liability" | "income" | "expense" | "disclosure";
type MeasurementBasis = "historical-cost" | "current-value" | "amortized-cost" | "fair-value";

const ISSUE_GUIDE: Record<
    FrameworkIssue,
    { label: string; recognitionCue: string; caution: string }
> = {
    asset: {
        label: "Asset",
        recognitionCue:
            "Look for a present economic resource controlled by the entity as a result of a past event.",
        caution:
            "Future hopes, unsigned plans, and internally generated benefits may fail control or reliable-measurement discipline.",
    },
    liability: {
        label: "Liability",
        recognitionCue:
            "Look for a present obligation to transfer an economic resource because a past event has already created duty or responsibility.",
        caution:
            "A possible future purchase or avoidable business action is not the same as a present obligation.",
    },
    income: {
        label: "Income",
        recognitionCue:
            "Look for increases in assets or decreases in liabilities that increase equity other than owner contributions.",
        caution:
            "Receipt of cash is not enough; performance, earning process, or obligation release still matters.",
    },
    expense: {
        label: "Expense",
        recognitionCue:
            "Look for decreases in assets or increases in liabilities that decrease equity other than owner distributions.",
        caution:
            "Do not expense an item only because cash was paid if the case shows future economic benefit still controlled.",
    },
    disclosure: {
        label: "Disclosure focus",
        recognitionCue:
            "Use disclosure when recognition is uncertain, measurement is not sufficiently supportable, or qualitative risk needs transparent explanation.",
        caution:
            "Disclosure is not a shortcut for omitting a material recognized item that meets the definition and recognition threshold.",
    },
};

const MEASUREMENT_GUIDE: Record<MeasurementBasis, string> = {
    "historical-cost":
        "Historical cost is strongest when the case emphasizes original transaction price, verifiability, and cost allocation.",
    "current-value":
        "Current value is strongest when relevance depends on present economic conditions rather than original cost.",
    "amortized-cost":
        "Amortized cost is strongest for financial instruments measured by effective interest and contractual cash flows.",
    "fair-value":
        "Fair value is strongest when the problem asks for market participant measurement or current exit-price evidence.",
};

export default function ConceptualFrameworkRecognitionPage() {
    const [issue, setIssue] = useState<FrameworkIssue>("asset");
    const [basis, setBasis] = useState<MeasurementBasis>("historical-cost");
    const [hasPastEvent, setHasPastEvent] = useState(true);
    const [hasControlOrObligation, setHasControlOrObligation] = useState(true);
    const [isMeasurable, setIsMeasurable] = useState(true);

    const result = useMemo(() => {
        const guide = ISSUE_GUIDE[issue];
        const recognitionScore = [hasPastEvent, hasControlOrObligation, isMeasurable].filter(Boolean).length;
        const recognitionSignal =
            recognitionScore === 3
                ? "Recognition looks supportable under the entered conceptual-framework checks."
                : recognitionScore === 2
                  ? "Recognition may be possible, but the missing check should be explained before computing an amount."
                  : "The case is probably better handled as nonrecognition, disclosure, or a different element classification.";

        return {
            ...guide,
            recognitionScore,
            recognitionSignal,
            measurementSignal: MEASUREMENT_GUIDE[basis],
        };
    }, [basis, hasControlOrObligation, hasPastEvent, isMeasurable, issue]);
    const recognitionChecks = [
        { label: "Past event exists", value: hasPastEvent, setter: setHasPastEvent },
        {
            label: "Control or obligation exists",
            value: hasControlOrObligation,
            setter: setHasControlOrObligation,
        },
        { label: "Measurement is supportable", value: isMeasurable, setter: setIsMeasurable },
    ];

    return (
        <CalculatorPageLayout
            badge="FAR | Conceptual Framework"
            title="Conceptual Framework Recognition Helper"
            description="Classify financial statement elements, test recognition support, and choose a measurement-basis explanation before moving into FAR computations."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-sm">Element being tested</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {(Object.keys(ISSUE_GUIDE) as FrameworkIssue[]).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setIssue(key)}
                                    className={[
                                        "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                        issue === key ? "app-button-primary" : "app-button-ghost",
                                    ].join(" ")}
                                >
                                    {ISSUE_GUIDE[key].label}
                                </button>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Recognition checks</p>
                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                            {recognitionChecks.map((check) => (
                                <label
                                    key={check.label}
                                    className="flex items-start gap-3 rounded-[1rem] border border-[color:var(--app-border)] px-3.5 py-3 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={check.value}
                                        onChange={(event) => check.setter(event.target.checked)}
                                        className="mt-1"
                                    />
                                    <span>{check.label}</span>
                                </label>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <label className="app-label mb-2 block" htmlFor="measurement-basis">
                            Measurement basis
                        </label>
                        <select
                            id="measurement-basis"
                            value={basis}
                            onChange={(event) => setBasis(event.target.value as MeasurementBasis)}
                            className="app-field w-full rounded-[1rem] px-3.5 py-2.5 text-sm outline-none"
                        >
                            <option value="historical-cost">Historical cost</option>
                            <option value="current-value">Current value</option>
                            <option value="amortized-cost">Amortized cost</option>
                            <option value="fair-value">Fair value</option>
                        </select>
                    </SectionCard>
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">Recognition path</p>
                        <h2 className="app-section-title mt-2">{result.label}</h2>
                        <p className="app-body-md mt-3 text-sm">{result.recognitionCue}</p>
                        <p className="app-body-md mt-3 text-sm">{result.recognitionSignal}</p>
                    </SectionCard>
                    <SectionCard>
                        <p className="app-card-title text-sm">Measurement and caution</p>
                        <p className="app-body-md mt-2 text-sm">{result.measurementSignal}</p>
                        <p className="app-helper mt-3 text-xs">{result.caution}</p>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="Continue the FAR loop"
                    summary="Use this helper before a measurement page when the hard part is element classification, not arithmetic."
                    badge="Learn + solve"
                    items={[
                        {
                            path: "/study/topics/conceptual-framework-recognition-measurement-and-disclosure",
                            label: "Conceptual framework lesson",
                            description: "Review element definitions, recognition discipline, and measurement-basis logic.",
                        },
                        {
                            path: "/far/revenue-allocation-workspace",
                            label: "Revenue allocation workspace",
                            description: "Move from recognition logic into allocation and contract-balance computation.",
                        },
                        {
                            path: "/far/financial-asset-amortized-cost",
                            label: "Financial asset amortized cost",
                            description: "Use when classification points to amortized-cost financial asset measurement.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
