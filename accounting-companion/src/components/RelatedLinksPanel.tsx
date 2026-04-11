import DisclosurePanel from "./DisclosurePanel";
import TransitionLink from "./TransitionLink";

export type RelatedLinkItem = {
    path: string;
    label: string;
    description?: string;
};

type RelatedLinksPanelProps = {
    title?: string;
    summary?: string;
    badge?: string;
    items: RelatedLinkItem[];
    defaultOpen?: boolean;
    compact?: boolean;
    className?: string;
    showDescriptions?: boolean;
};

export default function RelatedLinksPanel({
    title = "Related tools",
    summary = "Open the next relevant tools only when you need them.",
    badge,
    items,
    defaultOpen = false,
    compact = false,
    className,
    showDescriptions = false,
}: RelatedLinksPanelProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <DisclosurePanel
            title={title}
            summary={summary}
            badge={badge ?? `${items.length} links`}
            defaultOpen={defaultOpen}
            compact={compact}
            className={className}
        >
            <div
                className={[
                    "app-related-link-grid",
                    showDescriptions ? "app-related-link-grid--descriptive" : "app-related-link-grid--compact",
                ].join(" ")}
            >
                {items.map((item) => (
                    <TransitionLink
                        key={item.path}
                        to={item.path}
                        className="app-list-link app-related-link rounded-[1rem] px-3.5 py-3"
                    >
                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                            {item.label}
                        </p>
                        {showDescriptions && item.description ? (
                            <p className="app-helper mt-1 text-xs leading-5">{item.description}</p>
                        ) : null}
                    </TransitionLink>
                ))}
            </div>
        </DisclosurePanel>
    );
}
