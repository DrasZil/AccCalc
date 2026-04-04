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
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-gray-400">Formula Used</p>
            <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-black/20 px-5 py-4">
                <p className="text-center text-lg font-bold text-white md:text-xl">{formula}</p>
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-gray-400">
                Step-by-Step Solving
            </p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-white">
                {steps.map((step, i) => (
                    <li key={i} className="rounded-2xl border border-white/[0.08] bg-black/[0.15] px-4 py-3">
                        <span className="mr-2 text-gray-500">{i + 1}.</span>
                        {step}
                    </li>
                ))}
            </ul>

            {glossary.length > 0 ? (
                <>
                    <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-gray-400">
                        Variable Meaning
                    </p>
                    <div className="mt-3 space-y-3">
                        {glossary.map((item) => (
                            <div
                                key={item.term}
                                className="rounded-2xl border border-white/[0.08] bg-black/[0.15] px-4 py-3"
                            >
                                <p className="text-sm font-semibold text-white">{item.term}</p>
                                <p className="mt-1 text-sm leading-6 text-gray-300">{item.meaning}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {interpretation ? (
                <>
                    <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-gray-400">
                        Interpretation / What The Answer Means
                    </p>
                    <div className="mt-3 rounded-2xl border border-green-400/[0.12] bg-green-500/[0.08] px-4 py-4 text-sm leading-6 text-gray-200">
                        {interpretation}
                    </div>
                </>
            ) : null}

            {assumptions.length > 0 ? (
                <>
                    <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-gray-400">
                        Notes / Assumptions
                    </p>
                    <div className="mt-3 space-y-3">
                        {assumptions.map((assumption, index) => (
                            <div
                                key={`assumption-${index}`}
                                className="rounded-2xl border border-sky-400/[0.12] bg-sky-500/[0.08] px-4 py-3 text-sm leading-6 text-slate-200"
                            >
                                {assumption}
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {notes.length > 0 ? (
                <>
                    <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-gray-400">
                        Notes
                    </p>
                    <div className="mt-3 space-y-3">
                        {notes.map((note, index) => (
                            <div
                                key={`note-${index}`}
                                className="rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-sm leading-6 text-slate-200"
                            >
                                {note}
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {warnings.length > 0 ? (
                <>
                    <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-gray-400">
                        Warnings
                    </p>
                    <div className="mt-3 space-y-3">
                        {warnings.map((warning, index) => (
                            <div
                                key={`warning-${index}`}
                                className="rounded-2xl border border-amber-400/[0.16] bg-amber-500/[0.1] px-4 py-3 text-sm leading-6 text-amber-100"
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
