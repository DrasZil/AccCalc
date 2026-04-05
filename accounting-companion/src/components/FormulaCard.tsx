import { useMemo, useState, type ReactNode } from "react";
import SectionCard from "./SectionCard";

type FormulaGlossaryItem = {
    term: string;
    meaning: ReactNode | string;
};

type FormulaCardProps = {
    formula: ReactNode | string;
    steps: ReactNode[] | string[];
    glossary?: FormulaGlossaryItem[];
    interpretation?: ReactNode | string;
    notes?: Array<ReactNode | string>;
    assumptions?: Array<ReactNode | string>;
    warnings?: Array<ReactNode | string>;
};

type FormulaSection = {
    key: string;
    label: string;
    shortLabel: string;
    content: ReactNode;
};

function SectionHeading({ label }: { label: string }) {
    return (
        <div className="text-center">
            <p className="app-section-kicker mt-7">{label}</p>
        </div>
    );
}

export default function FormulaCard({
    formula,
    steps,
    glossary = [],
    interpretation,
    notes = [],
    assumptions = [],
    warnings = [],
}: FormulaCardProps) {
    const sections = useMemo<FormulaSection[]>(
        () => {
            const nextSections: FormulaSection[] = [
                {
                    key: "formula",
                    label: "Formula used",
                    shortLabel: "Formula",
                    content: (
                        <>
                            <div className="app-subtle-surface app-formula-panel rounded-[var(--app-radius-md)] px-5 py-5 md:px-7 md:py-6">
                                <div className="mx-auto max-w-3xl text-center">
                                    <p className="app-formula-display text-center">{formula}</p>
                                </div>
                            </div>
                        </>
                    ),
                },
                {
                    key: "steps",
                    label: "Step-by-step solving",
                    shortLabel: "Steps",
                    content: (
                        <ul className="space-y-3 text-sm leading-7 text-[color:var(--app-text)]">
                            {steps.map((step, index) => (
                                <li
                                    key={index}
                                    className="app-subtle-surface rounded-2xl px-4 py-3.5 md:px-5"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="app-chip-accent mt-0.5 inline-flex min-w-[2rem] items-center justify-center rounded-full px-2.5 py-1 text-[0.62rem]">
                                            {index + 1}
                                        </span>
                                        <div className="min-w-0 flex-1 text-[0.95rem] leading-7 tracking-[-0.01em]">
                                            {step}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ),
                },
            ];

            if (glossary.length > 0) {
                nextSections.push({
                    key: "glossary",
                    label: "Variable meaning",
                    shortLabel: "Terms",
                    content: (
                        <div className="space-y-3">
                            {glossary.map((item) => (
                                <div
                                    key={item.term}
                                    className="app-subtle-surface rounded-2xl px-4 py-3.5 md:px-5"
                                >
                                    <p className="app-card-title text-sm">{item.term}</p>
                                    <p className="app-body-md mt-1.5 text-sm">{item.meaning}</p>
                                </div>
                            ))}
                        </div>
                    ),
                });
            }

            if (interpretation) {
                nextSections.push({
                    key: "interpretation",
                    label: "Interpretation",
                    shortLabel: "Meaning",
                    content: (
                        <div className="app-tone-accent rounded-2xl px-5 py-4 md:px-6 md:py-5">
                            <div className="mx-auto max-w-3xl text-center text-[0.96rem] leading-7 tracking-[-0.012em]">
                                {interpretation}
                            </div>
                        </div>
                    ),
                });
            }

            if (assumptions.length > 0) {
                nextSections.push({
                    key: "assumptions",
                    label: "Notes and assumptions",
                    shortLabel: "Assumptions",
                    content: (
                        <div className="space-y-3">
                            {assumptions.map((assumption, index) => (
                                <div
                                    key={`assumption-${index}`}
                                    className="app-tone-info rounded-2xl px-4 py-3.5 text-sm leading-7 md:px-5"
                                >
                                    {assumption}
                                </div>
                            ))}
                        </div>
                    ),
                });
            }

            if (notes.length > 0) {
                nextSections.push({
                    key: "notes",
                    label: "Notes",
                    shortLabel: "Notes",
                    content: (
                        <div className="space-y-3">
                            {notes.map((note, index) => (
                                <div
                                    key={`note-${index}`}
                                    className="app-subtle-surface rounded-2xl px-4 py-3.5 text-sm leading-7 text-[color:var(--app-text)] md:px-5"
                                >
                                    {note}
                                </div>
                            ))}
                        </div>
                    ),
                });
            }

            if (warnings.length > 0) {
                nextSections.push({
                    key: "warnings",
                    label: "Warnings",
                    shortLabel: "Warnings",
                    content: (
                        <div className="space-y-3">
                            {warnings.map((warning, index) => (
                                <div
                                    key={`warning-${index}`}
                                    className="app-tone-warning rounded-2xl px-4 py-3.5 text-sm leading-7 md:px-5"
                                >
                                    {warning}
                                </div>
                            ))}
                        </div>
                    ),
                });
            }

            return nextSections;
        },
        [assumptions, formula, glossary, interpretation, notes, steps, warnings]
    );

    const [activeSection, setActiveSection] = useState(() => sections[0]?.key ?? "formula");

    const resolvedActiveSectionKey = sections.some((section) => section.key === activeSection)
        ? activeSection
        : (sections[0]?.key ?? "formula");
    const activeMobileSection =
        sections.find((section) => section.key === resolvedActiveSectionKey) ?? sections[0];

    return (
        <SectionCard>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="app-section-kicker">Interpretation workspace</p>
                    <p className="app-body-md mt-2 text-sm">
                        Review the formula, walkthrough, variable meaning, and practical reading without leaving the result flow.
                    </p>
                </div>
                <div className="hidden flex-wrap gap-2 md:flex">
                    {sections.map((section) => (
                        <span
                            key={section.key}
                            className="app-chip rounded-full px-3 py-1 text-xs"
                        >
                            {section.shortLabel}
                        </span>
                    ))}
                </div>
            </div>

            {sections.length > 1 ? (
                <div className="mt-5 xl:hidden">
                    <div className="app-panel rounded-[1.25rem] p-2">
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {sections.map((section) => (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => setActiveSection(section.key)}
                                    className={[
                                        "rounded-xl px-3 py-2.5 text-sm font-semibold",
                                        resolvedActiveSectionKey === section.key
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

            <div className="mt-5 hidden space-y-1 xl:block">
                {sections.map((section, index) => (
                    <div key={section.key}>
                        {index === 0 ? (
                            <div className="text-center">
                                <p className="app-section-kicker">{section.label}</p>
                            </div>
                        ) : (
                            <SectionHeading label={section.label} />
                        )}
                        <div className="mt-4">{section.content}</div>
                    </div>
                ))}
            </div>

            {activeMobileSection ? (
                <div className="mt-5 space-y-4 xl:hidden">
                    <div className="text-center">
                        <p className="app-section-kicker">{activeMobileSection.label}</p>
                    </div>
                    {activeMobileSection.content}
                </div>
            ) : null}
        </SectionCard>
    );
}
