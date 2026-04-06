import { useMemo, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import OfflineCapabilityBadge from "./OfflineCapabilityBadge";
import PageHeader from "./PageHeader";
import ToolPinButton from "./ToolPinButton";
import {
    APP_ROUTE_META,
    getRouteAvailability,
    getRouteMeta,
} from "../utils/appCatalog";
import { useNetworkStatus } from "../utils/networkStatus";
import { useOfflineBundleStatus } from "../utils/offlineStatus";

type CalculatorPageLayoutProps = {
    badge?: string;
    title: string;
    description: string;
    inputSection: ReactNode;
    resultSection?: ReactNode;
    explanationSection?: ReactNode;
    prioritizeResultSection?: boolean;
    headerActions?: ReactNode;
    headerMeta?: ReactNode;
};

type SectionKey = "inputs" | "results" | "guide";

function LayoutSection({
    label,
    children,
    id,
}: {
    label: string;
    children: ReactNode;
    id: string;
}) {
    return (
        <section id={id} className="space-y-3">
            <div className="px-1">
                <p className="app-section-kicker text-xs">{label}</p>
            </div>
            {children}
        </section>
    );
}

export default function CalculatorPageLayout({
    badge,
    title,
    description,
    inputSection,
    resultSection,
    explanationSection,
    prioritizeResultSection = false,
    headerActions,
    headerMeta,
}: CalculatorPageLayoutProps) {
    const location = useLocation();
    const network = useNetworkStatus();
    const offlineBundle = useOfflineBundleStatus();
    const currentMeta = getRouteMeta(location.pathname);
    const [activeSection, setActiveSection] = useState<SectionKey>(
        prioritizeResultSection ? "results" : "inputs"
    );
    const routeAvailability = useMemo(
        () =>
            currentMeta
                ? getRouteAvailability(currentMeta, {
                      online: network.online,
                      bundleReady: offlineBundle.ready,
                      currentPath: location.pathname,
                  })
                : null,
        [currentMeta, location.pathname, network.online, offlineBundle.ready]
    );
    const relatedRoutes = useMemo(() => {
        if (!currentMeta) return [];

        const currentTags = new Set(currentMeta.tags);
        const currentKeywords = new Set(currentMeta.keywords);

        return APP_ROUTE_META.filter(
            (route) => route.path !== currentMeta.path && route.path !== "/"
        )
            .map((route) => {
                let score = 0;

                if (route.category === currentMeta.category) score += 5;
                score += route.tags.filter((tag) => currentTags.has(tag)).length * 4;
                score += route.keywords.filter((keyword) => currentKeywords.has(keyword)).length * 2;

                if (route.isNew) score += 0.5;

                return { route, score };
            })
            .filter((entry) => entry.score > 0)
            .sort((left, right) => right.score - left.score)
            .slice(0, 4)
            .map((entry) => entry.route);
    }, [currentMeta]);

    const combinedHeaderActions = useMemo(() => {
        if (!currentMeta || currentMeta.path === "/" || currentMeta.path.startsWith("/settings")) {
            return headerActions ?? null;
        }

        return (
            <>
                <ToolPinButton path={currentMeta.path} label={currentMeta.label} />
                {headerActions}
            </>
        );
    }, [currentMeta, headerActions]);

    const sections = useMemo(
        () =>
            [
                {
                    key: "inputs" as const,
                    label: "Inputs",
                    shortLabel: "Inputs",
                    content: inputSection,
                },
                resultSection
                    ? {
                          key: "results" as const,
                          label: "Results",
                          shortLabel: "Results",
                          content: resultSection,
                      }
                    : null,
                explanationSection
                    ? {
                          key: "guide" as const,
                          label: "Interpretation",
                          shortLabel: "Guide",
                          content: explanationSection,
                      }
                    : null,
            ].filter(Boolean) as Array<{
                key: SectionKey;
                label: string;
                shortLabel: string;
                content: ReactNode;
            }>,
        [explanationSection, inputSection, resultSection]
    );

    return (
        <div className="app-page-stack">
            <PageHeader
                badge={badge}
                title={title}
                description={description}
                actions={combinedHeaderActions}
                meta={
                    <>
                        {currentMeta ? (
                            <OfflineCapabilityBadge level={currentMeta.offlineSupport} />
                        ) : null}
                        {routeAvailability ? (
                            <span className="app-chip inline-flex items-center rounded-full px-3 py-1 text-xs">
                                {routeAvailability.label}
                            </span>
                        ) : null}
                        {headerMeta}
                    </>
                }
            />

            {routeAvailability ? (
                <div
                    className={[
                        "rounded-[1.35rem] px-4 py-3.5 text-sm leading-6",
                        routeAvailability.canOpen ? "app-subtle-surface" : "app-tone-warning",
                    ].join(" ")}
                >
                    {routeAvailability.reason}
                </div>
            ) : null}

            {sections.length > 1 ? (
                <div className="sticky z-20 -mt-2 top-[calc(var(--app-header-height)+0.5rem)] xl:static xl:mt-0">
                    <div className="app-panel rounded-[1.4rem] p-2 backdrop-blur-xl xl:hidden">
                        <div className="grid grid-cols-3 gap-2">
                            {sections.map((section) => (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => setActiveSection(section.key)}
                                    className={[
                                        "rounded-xl px-3 py-2.5 text-sm font-semibold",
                                        activeSection === section.key
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

            <div className="hidden xl:grid xl:gap-[var(--app-page-gap-lg)]">
                {(prioritizeResultSection
                    ? sections.toSorted((left, right) =>
                          left.key === "results" ? -1 : right.key === "results" ? 1 : 0
                      )
                    : sections
                ).map((section) => (
                    <LayoutSection
                        key={section.key}
                        label={section.label}
                        id={`section-${section.key}`}
                    >
                        {section.content}
                    </LayoutSection>
                ))}
            </div>

            <div className="space-y-[var(--app-page-gap)] xl:hidden">
                {sections.map((section) =>
                    activeSection === section.key ? (
                        <LayoutSection
                            key={section.key}
                            label={section.label}
                            id={`section-${section.key}`}
                        >
                            {section.content}
                        </LayoutSection>
                    ) : null
                )}
            </div>

            {relatedRoutes.length > 0 ? (
                <section className="space-y-3">
                    <div className="px-1">
                        <p className="app-section-kicker text-xs">Related tools</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {relatedRoutes.map((route) => (
                            <Link
                                key={route.path}
                                to={route.path}
                                className="app-list-link rounded-[1.2rem] px-4 py-3.5"
                            >
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    {route.label}
                                </p>
                                <p className="app-helper mt-1 text-xs">{route.description}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            ) : null}
        </div>
    );
}
