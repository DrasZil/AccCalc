import { useMemo, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import DisclosurePanel from "./DisclosurePanel";
import OfflineCapabilityBadge from "./OfflineCapabilityBadge";
import PageHeader from "./PageHeader";
import ToolAboutPanel from "./ToolAboutPanel";
import ToolPinButton from "./ToolPinButton";
import {
    APP_ROUTE_META,
    getRouteAvailability,
    getRouteMeta,
} from "../utils/appCatalog";
import { useAppSettings } from "../utils/appSettings";
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
            <div className="flex items-center justify-between gap-3 px-1">
                <p className="app-section-kicker text-[0.68rem]">{label}</p>
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
    const settings = useAppSettings();
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
                <ToolPinButton
                    path={currentMeta.path}
                    label={currentMeta.label}
                    variant="icon"
                />
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
    const mobileHeaderMeta = useMemo(() => {
        if (!currentMeta) return headerMeta ?? null;

        return (
            <>
                <OfflineCapabilityBadge
                    level={currentMeta.offlineSupport}
                    className="px-2.5 py-1 text-[0.62rem]"
                />
                {routeAvailability ? (
                    <span className="app-chip inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem]">
                        {routeAvailability.label}
                    </span>
                ) : null}
            </>
        );
    }, [currentMeta, headerMeta, routeAvailability]);

    return (
        <div className="app-page-stack">
            <PageHeader
                badge={badge}
                title={title}
                description={description}
                actions={combinedHeaderActions}
                compactDescriptionOnMobile
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
                mobileMeta={mobileHeaderMeta}
            />

            <div className="md:hidden">
                {currentMeta ? (
                    <ToolAboutPanel
                        route={currentMeta}
                        availability={routeAvailability}
                        relatedRoutes={relatedRoutes}
                        compact
                        includeDescription={!settings.compactMobileChrome}
                    />
                ) : null}
            </div>

            {routeAvailability ? (
                <div
                    className={[
                        "hidden rounded-[1.35rem] px-4 py-3.5 text-sm leading-6 md:block",
                        routeAvailability.canOpen ? "app-subtle-surface" : "app-tone-warning",
                    ].join(" ")}
                >
                    {routeAvailability.reason}
                </div>
            ) : null}

            {currentMeta ? (
                <div className="hidden md:block">
                    <ToolAboutPanel
                        route={currentMeta}
                        availability={routeAvailability}
                        relatedRoutes={relatedRoutes}
                        includeDescription={false}
                    />
                </div>
            ) : null}

            {sections.length > 1 ? (
                <div className="sticky z-20 -mt-1 top-[calc(var(--app-header-height)+0.35rem)] xl:static xl:mt-0">
                    <div
                        className={[
                            "app-panel backdrop-blur-xl xl:hidden",
                            settings.compactMobileChrome
                                ? "rounded-[0.95rem] p-1"
                                : "rounded-[1.05rem] p-1.25",
                        ].join(" ")}
                    >
                        <div className="app-guide-tabs">
                            {sections.map((section) => (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => setActiveSection(section.key)}
                                    className={[
                                        "app-guide-tab-button rounded-[0.95rem] px-2.5 py-1.5 text-[0.82rem] font-semibold",
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
                {resultSection ? (
                    <div className="grid gap-[var(--app-page-gap-lg)] xl:grid-cols-[minmax(0,1.06fr)_minmax(22rem,0.94fr)]">
                        {prioritizeResultSection ? (
                            <>
                                <div className="space-y-[var(--app-page-gap-lg)]">
                                    <LayoutSection label="Results" id="section-results">
                                        {resultSection}
                                    </LayoutSection>
                                    <LayoutSection label="Inputs" id="section-inputs">
                                        {inputSection}
                                    </LayoutSection>
                                </div>
                                <div className="space-y-[var(--app-page-gap-lg)]">
                                    {explanationSection ? (
                                        <DisclosurePanel
                                            title="Formula and guide"
                                            summary="Open the method, meaning, assumptions, and cautions only when you need them."
                                            badge="Details"
                                        >
                                            {explanationSection}
                                        </DisclosurePanel>
                                    ) : null}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-[var(--app-page-gap-lg)]">
                                    <LayoutSection label="Inputs" id="section-inputs">
                                        {inputSection}
                                    </LayoutSection>
                                    {explanationSection ? (
                                        <DisclosurePanel
                                            title="Formula and guide"
                                            summary="Open the method, meaning, assumptions, and cautions only when you need them."
                                            badge="Details"
                                        >
                                            {explanationSection}
                                        </DisclosurePanel>
                                    ) : null}
                                </div>
                                <div className="space-y-[var(--app-page-gap)] xl:sticky xl:top-[calc(var(--app-header-height)+1rem)]">
                                    <LayoutSection label="Results" id="section-results">
                                        {resultSection}
                                    </LayoutSection>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <LayoutSection label="Inputs" id="section-inputs">
                            {inputSection}
                        </LayoutSection>
                        {explanationSection ? (
                            <DisclosurePanel
                                title="Formula and guide"
                                summary="Open the method, meaning, assumptions, and cautions only when you need them."
                                badge="Details"
                            >
                                {explanationSection}
                            </DisclosurePanel>
                        ) : null}
                    </>
                )}
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
                        <p className="app-section-kicker text-[0.68rem]">Related tools</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {relatedRoutes.map((route) => (
                            <Link
                                key={route.path}
                                to={route.path}
                                className="app-list-link rounded-[1.1rem] px-4 py-3"
                            >
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    {route.shortLabel ?? route.label}
                                </p>
                                <p className="app-helper mt-1 hidden text-xs md:block">
                                    {route.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            ) : null}
        </div>
    );
}
