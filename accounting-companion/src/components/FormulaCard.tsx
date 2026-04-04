import type { ReactNode } from "react";
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

export default function FormulaCard({
    formula,
    steps,
    glossary = [],
    interpretation,
    notes = [],
    assumptions = [],
    warnings = [],
}: FormulaCardProps) {
    return (
        <SectionCard>
            <p className="app-section-kicker">
                Formula used
            </p>
            <div className="app-subtle-surface mt-4 rounded-[var(--app-radius-md)] px-5 py-4">
                <p className="app-formula-display text-center">
                    {formula}
                </p>
            </div>

            <p className="app-section-kicker mt-6">
                Step-by-step solving
            </p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-[color:var(--app-text)]">
                {steps.map((step, index) => (
                    <li
                        key={index}
                        className="app-subtle-surface rounded-2xl px-4 py-3"
                    >
                        <span className="mr-2 app-helper">
                            {index + 1}.
                        </span>
                        {step}
                    </li>
                ))}
            </ul>

            {glossary.length > 0 ? (
                <>
                    <p className="app-section-kicker mt-6">
                        Variable meaning
                    </p>
                    <div className="mt-3 space-y-3">
                        {glossary.map((item) => (
                            <div
                                key={item.term}
                                className="app-subtle-surface rounded-2xl px-4 py-3"
                            >
                                <p className="app-card-title text-sm">
                                    {item.term}
                                </p>
                                <p className="app-body-md mt-1 text-sm">
                                    {item.meaning}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {interpretation ? (
                <>
                    <p className="app-section-kicker mt-6">
                        Interpretation
                    </p>
                    <div className="app-tone-accent mt-3 rounded-2xl px-4 py-4 text-sm leading-6">
                        {interpretation}
                    </div>
                </>
            ) : null}

            {assumptions.length > 0 ? (
                <>
                    <p className="app-section-kicker mt-6">
                        Notes and assumptions
                    </p>
                    <div className="mt-3 space-y-3">
                        {assumptions.map((assumption, index) => (
                            <div
                                key={`assumption-${index}`}
                                className="app-tone-info rounded-2xl px-4 py-3 text-sm leading-6"
                            >
                                {assumption}
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {notes.length > 0 ? (
                <>
                    <p className="app-section-kicker mt-6">
                        Notes
                    </p>
                    <div className="mt-3 space-y-3">
                        {notes.map((note, index) => (
                            <div
                                key={`note-${index}`}
                                className="app-subtle-surface rounded-2xl px-4 py-3 text-sm leading-6 text-[color:var(--app-text)]"
                            >
                                {note}
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {warnings.length > 0 ? (
                <>
                    <p className="app-section-kicker mt-6">
                        Warnings
                    </p>
                    <div className="mt-3 space-y-3">
                        {warnings.map((warning, index) => (
                            <div
                                key={`warning-${index}`}
                                className="app-tone-warning rounded-2xl px-4 py-3 text-sm leading-6"
                            >
                                {warning}
                            </div>
                        ))}
                    </div>
                </>
            ) : null}
        </SectionCard>
    );
}
