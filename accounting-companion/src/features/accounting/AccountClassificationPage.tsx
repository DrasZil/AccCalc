import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import {
    ACCOUNT_REFERENCE_DATA,
    searchAccountReferences,
} from "../../utils/accountingReference";

const QUICK_LOOKUPS = [
    "Cash",
    "Accounts Receivable",
    "Allowance for Doubtful Accounts",
    "Accounts Payable",
    "Sales Revenue",
    "Cost of Goods Sold",
];

export default function AccountClassificationPage() {
    const [query, setQuery] = useState("");

    const matches = useMemo(() => searchAccountReferences(query), [query]);
    const topMatch = matches[0] ?? null;
    const showingDefaultList = query.trim() === "";

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Account Classification Helper"
            description="Look up an account's type, normal balance, statement placement, and common aliases for faster schoolwork and review."
            inputSection={
                <div className="space-y-4">
                    <InputCard
                        label="Account Name or Alias"
                        value={query}
                        onChange={setQuery}
                        placeholder="Try cash, ADA, sales discounts, or accounts payable"
                        type="text"
                        inputMode="search"
                    />
                    <SectionCard>
                        <p className="text-sm font-medium text-white">Quick lookups</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {QUICK_LOOKUPS.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setQuery(item)}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-200 transition hover:bg-white/[0.08]"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </SectionCard>
                </div>
            }
            resultSection={
                topMatch ? (
                    <ResultGrid columns={4}>
                        <ResultCard title="Account Type" value={topMatch.type} />
                        <ResultCard title="Normal Balance" value={topMatch.normalBalance} />
                        <ResultCard title="Statement" value={topMatch.statement} />
                        <ResultCard title="Section" value={topMatch.section} />
                    </ResultGrid>
                ) : (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">No match yet</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">
                            No account matched that search. Try a broader name such as `inventory`,
                            `revenue`, `allowance`, or `payable`.
                        </p>
                    </SectionCard>
                )
            }
            explanationSection={
                <SectionCard>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.16em] text-gray-400">
                                {showingDefaultList ? "Common Accounts" : "Matching Accounts"}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-gray-300">
                                {showingDefaultList
                                    ? `Showing ${Math.min(matches.length, ACCOUNT_REFERENCE_DATA.length)} common reference accounts.`
                                    : `Showing ${matches.length} account match${matches.length === 1 ? "" : "es"} for "${query}".`}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        {matches.map((match) => (
                            <div
                                key={match.name}
                                className="rounded-2xl border border-white/[0.08] bg-black/[0.16] px-4 py-4"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-base font-semibold text-white">{match.name}</p>
                                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.16em] text-gray-300">
                                        {match.type}
                                    </span>
                                    <span className="rounded-full border border-green-400/15 bg-green-500/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.16em] text-green-300">
                                        {match.normalBalance}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-gray-300">{match.note}</p>
                                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-gray-500">
                                    {match.statement} | {match.section}
                                </p>
                                {match.aliases.length > 0 ? (
                                    <p className="mt-2 text-xs leading-5 text-gray-500">
                                        Aliases: {match.aliases.join(", ")}
                                    </p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </SectionCard>
            }
        />
    );
}
