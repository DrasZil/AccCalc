import {
    startTransition,
    useDeferredValue,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSuggestedRoutes, searchAppRoutes, type AppSearchResult } from "../utils/appSearch";

type FeatureSearchProps = {
    variant?: "header" | "hero";
    className?: string;
    placeholder?: string;
};

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
        </svg>
    );
}

function resultBadge(result: AppSearchResult) {
    if (result.matchLabel === "new") return "New";
    if (result.matchLabel === "abbreviation") return "Abbrev";
    if (result.matchLabel === "alias" || result.matchLabel === "alias prefix") return "Alias";
    if (result.matchLabel === "category") return "Category";
    if (result.matchLabel === "tag") return "Tag";
    return "Match";
}

export default function FeatureSearch({
    variant = "header",
    className = "",
    placeholder = "Search calculators, helpers, aliases, abbreviations, or topics",
}: FeatureSearchProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const resultsId = useId();
    const rootRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const deferredQuery = useDeferredValue(query);
    const suggestions = useMemo(
        () =>
            deferredQuery.trim()
                ? searchAppRoutes(deferredQuery, 8)
                : getSuggestedRoutes(8),
        [deferredQuery]
    );

    useEffect(() => {
        setOpen(false);
        setActiveIndex(0);
    }, [location.pathname]);

    useEffect(() => {
        function handlePointerDown(event: MouseEvent) {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, []);

    useEffect(() => {
        setActiveIndex(0);
    }, [deferredQuery]);

    function handleNavigate(result: AppSearchResult) {
        startTransition(() => {
            navigate(result.path);
        });
        setOpen(false);
        setQuery("");
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (!suggestions.length) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((current) => (current + 1) % suggestions.length);
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length);
            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();
            handleNavigate(suggestions[activeIndex] ?? suggestions[0]);
            return;
        }

        if (event.key === "Escape") {
            setOpen(false);
            inputRef.current?.blur();
        }
    }

    const inputShellClass =
        variant === "hero"
            ? "rounded-[1.6rem] border border-white/10 bg-black/30 px-4 py-3.5 shadow-[0_18px_60px_rgba(0,0,0,0.24)]"
            : "rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-3 py-2.5";

    const panelClass =
        variant === "hero"
            ? "mt-3 rounded-[1.6rem] border border-white/10 bg-[#060606]/96 shadow-[0_24px_80px_rgba(0,0,0,0.32)]"
            : "mt-2 rounded-[1.3rem] border border-white/10 bg-[#060606]/96 shadow-[0_24px_80px_rgba(0,0,0,0.32)]";

    return (
        <div ref={rootRef} className={`relative ${className}`}>
            <div
                className={`${inputShellClass} transition hover:border-white/15 focus-within:border-green-400/30 focus-within:ring-2 focus-within:ring-green-400/15`}
            >
                <div className="flex items-center gap-3">
                    <SearchIcon className="h-5 w-5 shrink-0 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500 md:text-[0.95rem]"
                        aria-label="Search features"
                        aria-expanded={open}
                        aria-controls={resultsId}
                        aria-activedescendant={
                            open && suggestions[activeIndex]
                                ? `${resultsId}-option-${activeIndex}`
                                : undefined
                        }
                        role="combobox"
                    />
                    {query ? (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setOpen(true);
                                inputRef.current?.focus();
                            }}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-gray-300 transition hover:bg-white/[0.08]"
                        >
                            Clear
                        </button>
                    ) : null}
                </div>
            </div>

            {open ? (
                <div id={resultsId} className={`${panelClass} overflow-hidden`} role="listbox">
                    <div className="border-b border-white/10 px-4 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-green-300">
                            {deferredQuery.trim() ? "Autocomplete" : "Browse Suggestions"}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-gray-400">
                            {deferredQuery.trim()
                                ? "Matches title, aliases, abbreviations, tags, categories, and close misspellings."
                                : "Start typing or open a suggested tool directly."}
                        </p>
                    </div>

                    {suggestions.length > 0 ? (
                        <div className="max-h-[26rem] overflow-y-auto scrollbar-premium">
                            {suggestions.map((result, index) => {
                                const isActive = index === activeIndex;

                                return (
                                    <button
                                        key={result.path}
                                        id={`${resultsId}-option-${index}`}
                                        type="button"
                                        role="option"
                                        aria-selected={isActive}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onClick={() => handleNavigate(result)}
                                        className={[
                                            "flex w-full items-start justify-between gap-3 border-b border-white/[0.06] px-4 py-3 text-left transition last:border-b-0",
                                            isActive ? "bg-green-500/12" : "bg-transparent hover:bg-white/[0.04]",
                                        ].join(" ")}
                                    >
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-semibold text-white">
                                                    {result.label}
                                                </p>
                                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.16em] text-gray-300">
                                                    {result.category}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm leading-6 text-gray-400">
                                                {result.description}
                                            </p>
                                            {result.tags.length > 0 ? (
                                                <p className="mt-2 text-[0.68rem] uppercase tracking-[0.16em] text-gray-500">
                                                    {result.tags.join(", ")}
                                                </p>
                                            ) : null}
                                        </div>
                                        <span className="shrink-0 rounded-full border border-green-400/15 bg-green-500/10 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-green-300">
                                            {resultBadge(result)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="px-4 py-5 text-sm leading-6 text-gray-400">
                            No matching tool yet. Try a broader term like `ratio`, `inventory`,
                            `annuity`, `npv`, `debit`, or `trial balance`.
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}
