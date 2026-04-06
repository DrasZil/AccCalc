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
import OfflineCapabilityBadge from "./OfflineCapabilityBadge";
import { getRouteAvailability } from "../utils/appCatalog";
import { useNetworkStatus } from "../utils/networkStatus";
import { useOfflineBundleStatus } from "../utils/offlineStatus";
import { getSuggestedRoutes, searchAppRoutes, type AppSearchResult } from "../utils/appSearch";

type FeatureSearchProps = {
    variant?: "header" | "hero";
    className?: string;
    placeholder?: string;
    autoFocus?: boolean;
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
    autoFocus = false,
}: FeatureSearchProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const network = useNetworkStatus();
    const offlineBundle = useOfflineBundleStatus();
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
        function handlePointerDown(event: MouseEvent) {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, []);

    function handleNavigate(result: AppSearchResult) {
        const availability = getRouteAvailability(result, {
            online: network.online,
            bundleReady: offlineBundle.ready,
            currentPath: location.pathname,
        });
        if (!availability.canOpen) {
            setOpen(true);
            setActiveIndex(
                suggestions.findIndex((entry) => entry.path === result.path)
            );
            return;
        }

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

    const shellClass =
        variant === "hero"
            ? "app-search-shell rounded-[1.35rem] px-4 py-3"
            : "app-search-shell rounded-[1.15rem] px-3 py-2.25";

    const panelClass =
        variant === "hero"
            ? "app-search-panel mt-2.5 rounded-[1.35rem]"
            : "app-search-panel mt-2 rounded-[1.15rem]";

    return (
        <div
            ref={rootRef}
            className={`relative ${open ? "z-40" : "z-10"} ${className}`}
        >
            <div className={`${shellClass} hover:border-[color:var(--app-border-strong)]`}>
                <div className="flex items-center gap-3">
                    <div className="app-subtle-surface inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[1rem]">
                        <SearchIcon className="h-[1.125rem] w-[1.125rem] text-[color:var(--app-text-muted)]" />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        autoFocus={autoFocus}
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setOpen(true);
                            setActiveIndex(0);
                        }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full bg-transparent text-sm text-[color:var(--app-text)] outline-none placeholder:text-[color:var(--app-text-muted)] md:text-[0.95rem]"
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
                                setActiveIndex(0);
                                inputRef.current?.focus();
                            }}
                            className="app-button-ghost rounded-full px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.16em]"
                        >
                            Clear
                        </button>
                    ) : null}
                </div>
            </div>

            {open ? (
                <div id={resultsId} className={`${panelClass} overflow-hidden`} role="listbox">
                    <div className="border-b app-divider px-4 py-3.5">
                        <p className="app-kicker text-[0.68rem]">
                            {deferredQuery.trim() ? "Autocomplete" : "Browse suggestions"}
                        </p>
                        <p className="app-helper mt-1 text-xs leading-5">
                            {deferredQuery.trim()
                                ? "Matches titles, aliases, tags, categories, and close misspellings."
                                : "Start typing or open a suggested tool."}
                        </p>
                    </div>

                    {suggestions.length > 0 ? (
                        <div className="max-h-[26rem] overflow-y-auto scrollbar-premium">
                            {suggestions.map((result, index) => {
                                const isActive = index === activeIndex;
                                const availability = getRouteAvailability(result, {
                                    online: network.online,
                                    bundleReady: offlineBundle.ready,
                                    currentPath: location.pathname,
                                });

                                return (
                                    <button
                                        key={result.path}
                                        id={`${resultsId}-option-${index}`}
                                        type="button"
                                        role="option"
                                        aria-selected={isActive}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onClick={() => handleNavigate(result)}
                                        disabled={!availability.canOpen}
                                        className={[
                                            "flex w-full items-start justify-between gap-3 border-b app-divider px-4 py-3.5 text-left transition last:border-b-0",
                                            isActive
                                                ? "bg-[var(--app-accent-soft)]"
                                                : "hover:bg-[var(--app-accent-soft)]",
                                            !availability.canOpen
                                                ? "cursor-not-allowed opacity-70"
                                                : "",
                                        ].join(" ")}
                                        style={
                                            isActive
                                                ? {
                                                      boxShadow:
                                                          "inset 0 0 0 1px var(--app-border-strong)",
                                                  }
                                                : undefined
                                        }
                                    >
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-[0.96rem] font-semibold tracking-[-0.02em] text-[color:var(--app-text)]">
                                                    {result.label}
                                                </p>
                                                <span className="app-chip rounded-full px-2 py-0.5 text-[0.62rem]">
                                                    {result.subtopic
                                                        ? `${result.category} / ${result.subtopic}`
                                                        : result.category}
                                                </span>
                                                <OfflineCapabilityBadge
                                                    level={result.offlineSupport}
                                                    className="px-2 py-0.5 text-[0.62rem]"
                                                    label={availability.label}
                                                />
                                            </div>
                                            <p className="app-body-md mt-1 text-sm">
                                                {result.description}
                                            </p>
                                            <p className="app-helper mt-2 text-xs leading-5">
                                                {availability.reason}
                                            </p>
                                            {result.tags.length > 0 ? (
                                                <p className="app-helper mt-2 text-[0.68rem] uppercase tracking-[0.14em]">
                                                    {result.tags.join(", ")}
                                                </p>
                                            ) : null}
                                        </div>
                                        <span className="app-chip-accent shrink-0 rounded-full px-2.5 py-1 text-[0.62rem]">
                                            {resultBadge(result)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="px-4 py-5 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                            No matching tool yet. Try a broader term like `ratio`, `inventory`,
                            `annuity`, `npv`, `debit`, or `trial balance`.
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}
