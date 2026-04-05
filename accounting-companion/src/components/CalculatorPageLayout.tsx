import { useMemo, useState, type ReactNode } from "react";
import PageHeader from "./PageHeader";

type CalculatorPageLayoutProps = {
    badge?: string;
    title: string;
    description: string;
    inputSection: ReactNode;
    resultSection?: ReactNode;
    explanationSection?: ReactNode;
    prioritizeResultSection?: boolean;
    headerActions?: ReactNode;
    headerMeta?: ReactNode;
};

type SectionKey = "inputs" | "results" | "guide";

function LayoutSection({
    label,
    children,
    id,
}: {
    label: string;
    children: ReactNode;
    id: string;
}) {
    return (
        <section id={id} className="space-y-3">
            <div className="px-1">
                <p className="app-section-kicker text-xs">{label}</p>
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
    headerActions,
    headerMeta,
}: CalculatorPageLayoutProps) {
    const [activeSection, setActiveSection] = useState<SectionKey>(
        prioritizeResultSection ? "results" : "inputs"
    );

    const sections = useMemo(
        () =>
            [
                {
                    key: "inputs" as const,
                    label: "Inputs",
                    shortLabel: "Inputs",
                    content: inputSection,
                },
                resultSection
                    ? {
                          key: "results" as const,
                          label: "Results",
                          shortLabel: "Results",
                          content: resultSection,
                      }
                    : null,
                explanationSection
                    ? {
                          key: "guide" as const,
                          label: "Interpretation",
                          shortLabel: "Guide",
                          content: explanationSection,
                      }
                    : null,
            ].filter(Boolean) as Array<{
                key: SectionKey;
                label: string;
                shortLabel: string;
                content: ReactNode;
            }>,
        [explanationSection, inputSection, resultSection]
    );

    return (
        <div className="app-page-stack">
            <PageHeader
                badge={badge}
                title={title}
                description={description}
                actions={headerActions}
                meta={headerMeta}
            />

            {sections.length > 1 ? (
                <div className="sticky z-20 -mt-2 top-[calc(var(--app-header-height)+0.5rem)] xl:static xl:mt-0">
                    <div className="app-panel rounded-[1.4rem] p-2 backdrop-blur-xl xl:hidden">
                        <div className="grid grid-cols-3 gap-2">
                            {sections.map((section) => (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => setActiveSection(section.key)}
                                    className={[
                                        "rounded-xl px-3 py-2.5 text-sm font-semibold",
                                        activeSection === section.key
                                            ? "app-button-primary"
                                            : "app-button-ghost",
                                    ].join(" ")}
                                >
                                    {section.shortLabel}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="hidden xl:grid xl:gap-[var(--app-page-gap-lg)]">
                {(prioritizeResultSection
                    ? sections.toSorted((left, right) =>
                          left.key === "results" ? -1 : right.key === "results" ? 1 : 0
                      )
                    : sections
                ).map((section) => (
                    <LayoutSection
                        key={section.key}
                        label={section.label}
                        id={`section-${section.key}`}
                    >
                        {section.content}
                    </LayoutSection>
                ))}
            </div>

            <div className="space-y-[var(--app-page-gap)] xl:hidden">
                {sections.map((section) =>
                    activeSection === section.key ? (
                        <LayoutSection
                            key={section.key}
                            label={section.label}
                            id={`section-${section.key}`}
                        >
                            {section.content}
                        </LayoutSection>
                    ) : null
                )}
            </div>
        </div>
    );
}
