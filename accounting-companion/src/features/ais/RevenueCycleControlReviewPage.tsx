import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";

type Rating = "weak" | "basic" | "strong";
type RatingRow = {
    key: string;
    label: string;
    assertion: string;
    value: Rating;
    setter: (next: Rating) => void;
};

const SCORE: Record<Rating, number> = { weak: 1, basic: 2, strong: 3 };

function ratingCopy(value: Rating) {
    if (value === "strong") return "Documented and operating";
    if (value === "basic") return "Present but needs evidence";
    return "Weak or missing";
}

export default function RevenueCycleControlReviewPage() {
    const [orderApproval, setOrderApproval] = useState<Rating>("basic");
    const [creditLimitCheck, setCreditLimitCheck] = useState<Rating>("weak");
    const [shippingMatch, setShippingMatch] = useState<Rating>("basic");
    const [invoiceSequence, setInvoiceSequence] = useState<Rating>("strong");
    const [cashApplication, setCashApplication] = useState<Rating>("basic");
    const [exceptionReview, setExceptionReview] = useState<Rating>("weak");

    const rows: RatingRow[] = [
        {
            key: "order",
            label: "Sales order approval",
            assertion: "Occurrence",
            value: orderApproval,
            setter: setOrderApproval,
        },
        {
            key: "credit",
            label: "Customer credit limit check",
            assertion: "Valuation / collectability",
            value: creditLimitCheck,
            setter: setCreditLimitCheck,
        },
        {
            key: "shipping",
            label: "Shipping-to-invoice match",
            assertion: "Completeness",
            value: shippingMatch,
            setter: setShippingMatch,
        },
        {
            key: "sequence",
            label: "Invoice sequence control",
            assertion: "Completeness / cutoff",
            value: invoiceSequence,
            setter: setInvoiceSequence,
        },
        {
            key: "cash",
            label: "Cash application review",
            assertion: "Accuracy",
            value: cashApplication,
            setter: setCashApplication,
        },
        {
            key: "exception",
            label: "Exception report follow-up",
            assertion: "Presentation / monitoring",
            value: exceptionReview,
            setter: setExceptionReview,
        },
    ];

    const result = useMemo(() => {
        const totalScore = rows.reduce((sum, row) => sum + SCORE[row.value], 0);
        const maxScore = rows.length * 3;
        const readinessPercent = (totalScore / maxScore) * 100;
        const weakRows = rows.filter((row) => row.value === "weak");
        const basicRows = rows.filter((row) => row.value === "basic");
        const primaryGap = weakRows[0] ?? basicRows[0] ?? null;
        const response =
            weakRows.length >= 2
                ? "Revenue-cycle reliance is not supportable without remediation or expanded substantive testing around the weak controls."
                : weakRows.length === 1 || basicRows.length >= 3
                  ? "Use limited reliance only after walkthrough evidence and targeted tests of the weaker controls."
                  : "Control design looks directionally supportable, subject to walkthrough evidence and operating-effectiveness testing.";

        return {
            totalScore,
            maxScore,
            readinessPercent,
            weakRows,
            primaryGap,
            response,
        };
    }, [rows]);

    return (
        <CalculatorPageLayout
            badge="AIS | Revenue Cycle"
            title="Revenue Cycle Control Review"
            description="Map order-to-cash controls to assertions, identify weak control points, and choose a practical AIS or audit follow-up path."
            inputSection={
                <SectionCard>
                    <div className="grid gap-4 md:grid-cols-2">
                        {rows.map((row) => (
                            <div key={row.key} className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="app-card-title text-sm">{row.label}</p>
                                        <p className="app-helper mt-1 text-xs">{row.assertion}</p>
                                    </div>
                                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                        {ratingCopy(row.value)}
                                    </span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {(["weak", "basic", "strong"] as Rating[]).map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => row.setter(rating)}
                                            className={[
                                                "rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
                                                row.value === rating ? "app-button-primary" : "app-button-ghost",
                                            ].join(" ")}
                                        >
                                            {rating}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            }
            resultSection={
                <div className="space-y-4">
                    <ResultGrid columns={3}>
                        <ResultCard
                            title="Readiness"
                            value={`${result.readinessPercent.toFixed(0)}%`}
                            tone="accent"
                        />
                        <ResultCard
                            title="Control Score"
                            value={`${result.totalScore} / ${result.maxScore}`}
                        />
                        <ResultCard
                            title="Weak Controls"
                            value={String(result.weakRows.length)}
                            tone={result.weakRows.length > 0 ? "warning" : "success"}
                        />
                    </ResultGrid>
                    <SectionCard>
                        <p className="app-card-title text-sm">Primary walkthrough focus</p>
                        <p className="app-body-md mt-2 text-sm">
                            {result.primaryGap
                                ? `${result.primaryGap.label} is the first control to document, test, or compensate for. It primarily affects ${result.primaryGap.assertion.toLowerCase()}.`
                                : "No weak or basic row is selected; keep evidence focused on operating effectiveness and exception resolution."}
                        </p>
                        <p className="app-helper mt-3 text-xs">{result.response}</p>
                    </SectionCard>
                    <SectionCard>
                        <p className="app-card-title text-sm">Evidence to request</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color:var(--app-text-secondary)]">
                            <li>Approved sales-order sample tied to customer master data.</li>
                            <li>Shipping documents matched to invoices and sequence gaps.</li>
                            <li>Exception reports with reviewer initials, date, and resolution trail.</li>
                            <li>Cash receipt posting logs reconciled to deposit and subsidiary ledger data.</li>
                        </ul>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="AIS follow-up"
                    summary="Use these routes to move from one cycle walkthrough into broader ITGC and role-conflict review."
                    badge="3 routes"
                    items={[
                        {
                            path: "/ais/it-control-matrix",
                            label: "IT Control Matrix",
                            description: "Map general and application controls around the cycle.",
                        },
                        {
                            path: "/ais/access-control-review",
                            label: "Access Control Review",
                            description: "Review provisioning, privileged access, and monitoring.",
                        },
                        {
                            path: "/audit/assertion-evidence-planner",
                            label: "Assertion Evidence Planner",
                            description: "Translate the control gap into audit procedure emphasis.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
