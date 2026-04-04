import type { ReactNode } from "react";
import PageHeader from "./PageHeader";

type CalculatorPageLayoutProps = {
    badge?: string;
    title: string;
    description: string;
    inputSection: ReactNode;
    resultSection?: ReactNode;
    explanationSection?: ReactNode;
    prioritizeResultSection?: boolean;
};

function LayoutSection({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <section className="space-y-3">
            <div className="px-1">
                <p className="app-section-kicker text-xs">
                    {label}
                </p>
            </div>
            {children}
        </section>
    );
}

export default function CalculatorPageLayout({
    badge,
    title,
    description,
    inputSection,
    resultSection,
    explanationSection,
    prioritizeResultSection = false,
}: CalculatorPageLayoutProps) {
    const inputBlock = <LayoutSection label="Inputs">{inputSection}</LayoutSection>;

    const resultBlock = resultSection ? (
        <LayoutSection label="Final answer">{resultSection}</LayoutSection>
    ) : null;

    const explanationBlock = explanationSection ? (
        <LayoutSection label="Understanding the answer">
            {explanationSection}
        </LayoutSection>
    ) : null;

    return (
        <div className="app-page-stack">
            <PageHeader badge={badge} title={title} description={description} />

            {prioritizeResultSection ? resultBlock : inputBlock}
            {prioritizeResultSection ? inputBlock : resultBlock}
            {explanationBlock}
        </div>
    );
}
