import {
    Children,
    cloneElement,
    isValidElement,
    useMemo,
    useState,
    type ReactElement,
    type ReactNode,
} from "react";
import DisclosurePanel from "./DisclosurePanel";
import SectionCard from "./SectionCard";
import FormulaBlock from "./math/FormulaBlock";
import MathInline from "./math/MathInline";
import { looksLikeStandaloneMathText } from "../utils/mathNotation";

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

const SUPERSCRIPT_MAP: Record<string, string> = {
    "0": "\u2070",
    "1": "\u00b9",
    "2": "\u00b2",
    "3": "\u00b3",
    "4": "\u2074",
    "5": "\u2075",
    "6": "\u2076",
    "7": "\u2077",
    "8": "\u2078",
    "9": "\u2079",
    "+": "\u207a",
    "-": "\u207b",
    "(": "\u207d",
    ")": "\u207e",
    n: "\u207f",
};

function prettifyText(value: string) {
    return value
        .replace(/ x /g, " \u00d7 ")
        .replace(/ X /g, " \u00d7 ")
        .replace(/ >= /g, " \u2265 ")
        .replace(/ <= /g, " \u2264 ")
        .replace(/ != /g, " \u2260 ")
        .replace(/\+\/-/g, "\u00b1")
        .replace(/\^([0-9n()+-]+)/g, (_, exponent: string) =>
            exponent
                .split("")
                .map((character) => SUPERSCRIPT_MAP[character] ?? character)
                .join("")
        );
}

function polishNode(node: ReactNode, preferMath = false): ReactNode {
    if (typeof node === "string") {
        const polished = prettifyText(node);
        const renderAsMath = preferMath || looksLikeStandaloneMathText(polished);
        return (
            <MathInline
                text={polished}
                renderMode={renderAsMath ? "math" : "plain"}
                className={renderAsMath ? "app-reading-formula-inline" : "app-reading-inline"}
            />
        );
    }

    if (Array.isArray(node)) {
        return node.map((child, index) => (
            <span key={index} className="app-reading-inline">
                {polishNode(child, preferMath)}
            </span>
        ));
    }

    if (isValidElement(node)) {
        const element = node as ReactElement<{ children?: ReactNode }>;
        const nextChildren = element.props.children
            ? Children.map(element.props.children, (child) => polishNode(child, preferMath))
            : element.props.children;

        return cloneElement(element, undefined, nextChildren);
    }

    return node;
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
                    label: "Formula",
                    shortLabel: "Formula",
                    content: (
                        <div className="app-formula-panel app-subtle-surface rounded-[var(--app-radius-md)] px-5 py-5 text-left md:px-6">
                            <div className="mx-auto max-w-3xl">
                                {typeof formula === "string" ? (
                                    <FormulaBlock text={formula} />
                                ) : (
                                    <>
                                        <p className="app-label mb-3">Equation</p>
                                        <div className="app-formula-display text-left">
                                            {polishNode(formula)}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ),
                },
                {
                    key: "steps",
                    label: "Steps",
                    shortLabel: "Steps",
                    content: (
                        <ol className="space-y-3">
                            {steps.map((step, index) => (
                                <li
                                    key={index}
                                    className="app-subtle-surface min-w-0 rounded-[1.1rem] px-4 py-3.5 md:px-5"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="app-chip-accent mt-0.5 inline-flex min-w-[2rem] items-center justify-center rounded-full px-2.5 py-1 text-[0.62rem]">
                                            {index + 1}
                                        </span>
                                        <div className="app-reading-content app-guide-step min-w-0 flex-1">
                                            {polishNode(step)}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    ),
                },
            ];

            if (glossary.length > 0) {
                nextSections.push({
                    key: "glossary",
                    label: "Variable meaning",
                    shortLabel: "Terms",
                    content: (
                        <div className="grid gap-3 md:grid-cols-2">
                            {glossary.map((item) => (
                                <div
                                    key={item.term}
                                    className="app-subtle-surface rounded-[1.1rem] px-4 py-3.5 md:px-5"
                                >
                                    <p className="app-card-title text-sm">{item.term}</p>
                                    <p className="app-reading-content mt-1.5">
                                        {polishNode(item.meaning)}
                                    </p>
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
                        <div className="app-tone-accent rounded-[1.15rem] px-5 py-4 md:px-6 md:py-5">
                            <p className="app-label mb-2">Key takeaway</p>
                            <div className="app-reading-content max-w-3xl app-reading-strong">
                                {polishNode(interpretation)}
                            </div>
                        </div>
                    ),
                });
            }

            if (assumptions.length > 0) {
                nextSections.push({
                    key: "assumptions",
                    label: "Assumptions",
                    shortLabel: "Assumptions",
                    content: (
                        <div className="space-y-3">
                            {assumptions.map((assumption, index) => (
                                <div
                                    key={`assumption-${index}`}
                                    className="app-tone-info rounded-[1.1rem] px-4 py-3.5 md:px-5"
                                >
                                    <div className="app-reading-content">{polishNode(assumption)}</div>
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
                                    className="app-subtle-surface rounded-[1.1rem] px-4 py-3.5 md:px-5"
                                >
                                    <div className="app-reading-content">{polishNode(note)}</div>
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
                                    className="app-tone-warning rounded-[1.1rem] px-4 py-3.5 md:px-5"
                                >
                                    <div className="app-reading-content">{polishNode(warning)}</div>
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
        <SectionCard className="overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="app-section-kicker text-[0.68rem]">Formula guide</p>
                    <p className="app-body-md mt-2 text-sm">
                        Keep the calculator in front. Open the deeper method only when needed.
                    </p>
                </div>
                <div className="hidden flex-wrap gap-2 lg:flex">
                    {sections.map((section) => (
                        <span key={section.key} className="app-chip rounded-full px-3 py-1 text-xs">
                            {section.shortLabel}
                        </span>
                    ))}
                </div>
            </div>

            {sections.length > 1 ? (
                <div className="mt-5 lg:hidden">
                    <div className="app-panel rounded-[1.1rem] p-1.5">
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {sections.map((section) => (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => setActiveSection(section.key)}
                                    className={[
                                        "rounded-xl px-3 py-2 text-sm font-semibold",
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

            <div className="mt-5 hidden space-y-4 lg:block">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)]">
                    <div className="space-y-4">
                        {sections.find((section) => section.key === "formula")?.content}
                        {sections.find((section) => section.key === "steps")?.content}
                    </div>
                    <div className="space-y-4">
                        {sections.find((section) => section.key === "interpretation")?.content ?? (
                            <div className="app-subtle-surface rounded-[1.15rem] px-5 py-4">
                                <p className="app-label mb-2">Reading</p>
                                <p className="app-body-md text-sm">
                                    Open the supporting sections below for variable meaning and cautions.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {sections
                    .filter(
                        (section) =>
                            !["formula", "steps", "interpretation"].includes(section.key)
                    )
                    .map((section) => (
                        <DisclosurePanel
                            key={section.key}
                            title={section.label}
                            summary={`Open ${section.shortLabel.toLowerCase()} when you need more depth.`}
                        >
                            {section.content}
                        </DisclosurePanel>
                    ))}
            </div>

            {activeMobileSection ? (
                <div className="mt-5 space-y-4 lg:hidden">
                    <div>
                        <p className="app-section-kicker text-[0.68rem]">
                            {activeMobileSection.label}
                        </p>
                    </div>
                    {activeMobileSection.content}
                </div>
            ) : null}
        </SectionCard>
    );
}
