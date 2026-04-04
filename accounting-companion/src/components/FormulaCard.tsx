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
};

export default function FormulaCard({
    formula,
    steps,
    glossary = [],
    interpretation,
}: FormulaCardProps) {
    return (
        <SectionCard>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-gray-400">Formula Used</p>
            <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-black/20 px-5 py-4">
                <p className="text-center text-lg font-bold text-white md:text-xl">{formula}</p>
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-gray-400">Steps</p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-white">
                {steps.map((step, i) => (
                    <li key={i} className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
                        {step}
                    </li>
                ))}
            </ul>

            {glossary.length > 0 ? (
                <>
                    <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-gray-400">
                        Terms Explained
                    </p>
                    <div className="mt-3 space-y-3">
                        {glossary.map((item) => (
                            <div
                                key={item.term}
                                className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3"
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
                        Interpretation
                    </p>
                    <div className="mt-3 rounded-2xl border border-green-400/12 bg-green-500/8 px-4 py-4 text-sm leading-6 text-gray-200">
                        {interpretation}
                    </div>
                </>
            ) : null}
        </SectionCard>
    );
}
