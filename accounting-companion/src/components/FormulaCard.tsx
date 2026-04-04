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
            <div className="text-center">
                <p className="app-section-kicker">Formula used</p>
            </div>
            <div className="app-subtle-surface app-formula-panel mt-4 rounded-[var(--app-radius-md)] px-5 py-5 md:px-7 md:py-6">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="app-formula-display text-center">
                        {formula}
                    </p>
                </div>
            </div>

            <div className="text-center">
                <p className="app-section-kicker mt-7">
                    Step-by-step solving
                </p>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[color:var(--app-text)]">
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

            {glossary.length > 0 ? (
                <>
                    <div className="text-center">
                        <p className="app-section-kicker mt-7">
                            Variable meaning
                        </p>
                    </div>
                    <div className="mt-4 space-y-3">
                        {glossary.map((item) => (
                            <div
                                key={item.term}
                                className="app-subtle-surface rounded-2xl px-4 py-3.5 md:px-5"
                            >
                                <p className="app-card-title text-sm">
                                    {item.term}
                                </p>
                                <p className="app-body-md mt-1.5 text-sm">
                                    {item.meaning}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {interpretation ? (
                <>
                    <div className="text-center">
                        <p className="app-section-kicker mt-7">
                            Interpretation
                        </p>
                    </div>
                    <div className="app-tone-accent mt-4 rounded-2xl px-5 py-4 md:px-6 md:py-5">
                        <div className="mx-auto max-w-3xl text-center text-[0.96rem] leading-7 tracking-[-0.012em]">
                            {interpretation}
                        </div>
                    </div>
                </>
            ) : null}

            {assumptions.length > 0 ? (
                <>
                    <div className="text-center">
                        <p className="app-section-kicker mt-7">
                            Notes and assumptions
                        </p>
                    </div>
                    <div className="mt-4 space-y-3">
                        {assumptions.map((assumption, index) => (
                            <div
                                key={`assumption-${index}`}
                                className="app-tone-info rounded-2xl px-4 py-3.5 text-sm leading-7 md:px-5"
                            >
                                {assumption}
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {notes.length > 0 ? (
                <>
                    <div className="text-center">
                        <p className="app-section-kicker mt-7">
                            Notes
                        </p>
                    </div>
                    <div className="mt-4 space-y-3">
                        {notes.map((note, index) => (
                            <div
                                key={`note-${index}`}
                                className="app-subtle-surface rounded-2xl px-4 py-3.5 text-sm leading-7 text-[color:var(--app-text)] md:px-5"
                            >
                                {note}
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {warnings.length > 0 ? (
                <>
                    <div className="text-center">
                        <p className="app-section-kicker mt-7">
                            Warnings
                        </p>
                    </div>
                    <div className="mt-4 space-y-3">
                        {warnings.map((warning, index) => (
                            <div
                                key={`warning-${index}`}
                                className="app-tone-warning rounded-2xl px-4 py-3.5 text-sm leading-7 md:px-5"
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
