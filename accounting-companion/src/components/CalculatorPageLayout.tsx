import { useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import ContextualPageMenu from "./ContextualPageMenu";
import DisclosurePanel from "./DisclosurePanel";
import EducationalUseNotice from "./EducationalUseNotice";
import GuidedStartPanel, { type GuidedStartStep } from "./GuidedStartPanel";
import OfflineCapabilityBadge from "./OfflineCapabilityBadge";
import PageBackButton from "./PageBackButton";
import PageHeader from "./PageHeader";
import ToolPinButton from "./ToolPinButton";
import RelatedLinksPanel from "./RelatedLinksPanel";
import {
    APP_ROUTE_META,
    getRouteAvailability,
    getRouteMeta,
} from "../utils/appCatalog";
import { useAppSettings } from "../utils/appSettings";
import { useNetworkStatus } from "../utils/networkStatus";
import { useOfflineBundleStatus } from "../utils/offlineStatus";
import {
    buildStudyQuizPath,
    buildStudyTopicPath,
    getStudyTopicsForRoute,
} from "../features/study/studyContent";

type CalculatorPageLayoutProps = {
    badge?: string;
    title: string;
    description: string;
    inputSection: ReactNode;
    resultSection?: ReactNode;
    explanationSection?: ReactNode;
    prioritizeResultSection?: boolean;
    desktopLayout?: "balanced" | "result-focus";
    pageWidth?: "default" | "study" | "wide" | "data";
    headerActions?: ReactNode;
    headerMeta?: ReactNode;
    backButtonLabel?: string;
    backButtonTo?: string;
    showBackButton?: boolean;
    startGuide?:
        | {
              badge?: string;
              title?: string;
              summary?: string;
              steps?: GuidedStartStep[];
              actions?: ReactNode;
          }
        | false;
};

type SectionKey = "inputs" | "results";
type EducationalNoticeArea = "tax" | "audit" | "legal" | "governance";

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

function getEducationalNoticeArea(category: string | undefined): EducationalNoticeArea | null {
    if (category === "Taxation") return "tax";
    if (category === "Audit & Assurance") return "audit";
    if (category === "RFBT & Law") return "legal";
    if (category === "Governance & Ethics") return "governance";
    if (category === "AIS & IT Controls") return "governance";
    return null;
}

export default function CalculatorPageLayout({
    badge,
    title,
    description,
    inputSection,
    resultSection,
    explanationSection,
    prioritizeResultSection = false,
    desktopLayout = "balanced",
    pageWidth = "default",
    headerActions,
    headerMeta,
    backButtonLabel = "Back",
    backButtonTo = "/",
    showBackButton = true,
    startGuide,
}: CalculatorPageLayoutProps) {
    const location = useLocation();
    const settings = useAppSettings();
    const network = useNetworkStatus();
    const offlineBundle = useOfflineBundleStatus();
    const currentMeta = getRouteMeta(location.pathname);
    const [activeSection, setActiveSection] = useState<SectionKey>(
        prioritizeResultSection && resultSection ? "results" : "inputs"
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
    const relatedStudyLinks = useMemo(
        () =>
            getStudyTopicsForRoute(location.pathname)
                .flatMap((topic) => [
                    {
                        path: buildStudyTopicPath(topic.id),
                        label: `${topic.shortTitle} lesson`,
                        description: topic.summary,
                    },
                    {
                        path: buildStudyQuizPath(topic.id),
                        label: `${topic.shortTitle} practice`,
                        description: topic.quiz.intro,
                    },
                ])
                .slice(0, 4),
        [location.pathname]
    );
    const resolvedStartGuide = useMemo(() => {
        if (startGuide === false) return null;

        const defaultSteps: GuidedStartStep[] = resultSection
            ? [
                  {
                      title: "Enter the values you already know",
                      description:
                          "Start with the problem data in plain order. You do not need to remember every formula before typing.",
                  },
                  {
                      title: "Read the answer before opening deeper help",
                      description:
                          "Check the result, units, and main meaning first so the page feels simpler on first view.",
                  },
                  {
                      title: explanationSection
                          ? "Open Learn only when you need it"
                          : "Use related tools only when needed",
                      description: explanationSection
                          ? "Formula breakdowns, cautions, mistakes, and study support stay available without crowding the solving surface."
                          : "Keep follow-up tools as the next step after the main answer is clear.",
                  },
              ]
            : [
                  {
                      title: "Start with the main inputs",
                      description:
                          "Translate the problem into the fields shown here one line at a time.",
                  },
                  {
                      title: "Use the page as a guided workspace",
                      description:
                          "Focus on the current section first before opening supporting notes or nearby tools.",
                  },
                  {
                      title: "Study deeper only when needed",
                      description:
                          "The supporting material is still here, but it should not block the first task.",
                  },
              ];

        return {
            badge: startGuide?.badge ?? "Start here",
            title:
                startGuide?.title ??
                (resultSection
                    ? "Solve first, then open explanation only when you need it"
                    : "Work through the main task before opening deeper support"),
            summary:
                startGuide?.summary ??
                (resultSection
                    ? "AccCalc keeps the first step simple: enter the known values, read the answer, then study the method if the meaning still feels unclear."
                    : "This page is designed to keep the working surface visible first and move supporting detail later."),
            steps: startGuide?.steps ?? defaultSteps,
            actions: startGuide?.actions ?? null,
        };
    }, [explanationSection, resultSection, startGuide]);

    const combinedHeaderActions = useMemo(() => {
        const pageMenu =
            currentMeta || resolvedStartGuide || relatedStudyLinks.length > 0 || relatedRoutes.length > 0 ? (
                <ContextualPageMenu
                    title={`${title} page menu`}
                    description="Open orientation help, related study, nearby tools, and lower-priority page detail without pushing the main solve area off the screen."
                    badge={currentMeta?.subtopic ?? badge}
                >
                    <div className="space-y-4">
                        {resolvedStartGuide ? (
                            <GuidedStartPanel
                                badge={resolvedStartGuide.badge}
                                title={resolvedStartGuide.title}
                                summary={resolvedStartGuide.summary}
                                steps={resolvedStartGuide.steps}
                                actions={resolvedStartGuide.actions}
                                compact
                            />
                        ) : null}

                        {routeAvailability ? (
                            <div
                                className={[
                                    "rounded-[1rem] px-4 py-3.5 text-sm leading-6",
                                    routeAvailability.canOpen
                                        ? "app-subtle-surface"
                                        : "app-tone-warning",
                                ].join(" ")}
                            >
                                <p className="app-label text-[0.66rem]">Availability and assumptions</p>
                                <p className="app-body-md mt-2">{routeAvailability.reason}</p>
                            </div>
                        ) : null}

                        {currentMeta ? (
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <p className="app-label text-[0.66rem]">Page focus</p>
                                <p className="mt-2 text-sm font-semibold text-[color:var(--app-text)]">
                                    Solve the current {currentMeta.subtopic.toLowerCase()} task first.
                                </p>
                                <p className="app-helper mt-2 text-sm leading-6">
                                    Use this page for the answer and short interpretation first, then open related study or follow-up tools only if you still need more context.
                                </p>
                            </div>
                        ) : null}

                        {relatedStudyLinks.length > 0 ? (
                            <RelatedLinksPanel
                                title="Related study"
                                summary="Open lessons or quick practice only after the main answer is on screen."
                                badge={`${relatedStudyLinks.length} study links`}
                                items={relatedStudyLinks}
                                compact
                                showDescriptions
                                defaultOpen
                            />
                        ) : null}

                        {relatedRoutes.length > 0 ? (
                            <RelatedLinksPanel
                                title="Related tools"
                                summary="Keep adjacent calculators and analyzers available without crowding the main workflow."
                                badge={`${relatedRoutes.length} tools`}
                                items={relatedRoutes.map((route) => ({
                                    path: route.path,
                                    label: route.shortLabel ?? route.label,
                                    description: route.description,
                                }))}
                                compact
                            />
                        ) : null}
                    </div>
                </ContextualPageMenu>
            ) : null;

        if (!currentMeta || currentMeta.path === "/" || currentMeta.path.startsWith("/settings")) {
            return (
                <>
                    {pageMenu}
                    {headerActions}
                </>
            );
        }

        return (
            <>
                {pageMenu}
                <ToolPinButton
                    path={currentMeta.path}
                    label={currentMeta.label}
                    variant="icon"
                />
                {headerActions}
            </>
        );
    }, [
        badge,
        currentMeta,
        headerActions,
        relatedRoutes,
        relatedStudyLinks,
        resolvedStartGuide,
        routeAvailability,
        title,
    ]);

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
            ].filter(Boolean) as Array<{
                key: SectionKey;
                label: string;
                shortLabel: string;
                content: ReactNode;
            }>,
        [inputSection, resultSection]
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

    const pageWidthClass =
        pageWidth === "data"
            ? "app-page-shell-data"
            : pageWidth === "wide"
            ? "app-page-shell-wide"
            : pageWidth === "study"
              ? "app-page-shell-study"
              : "";
    const shouldShowAvailabilityBanner =
        routeAvailability !== null &&
        (!routeAvailability.canOpen || routeAvailability.support !== "full");
    const educationalNoticeArea = getEducationalNoticeArea(currentMeta?.category);

    return (
        <div className={["app-page-stack", pageWidthClass].join(" ").trim()}>
            {showBackButton ? <PageBackButton fallbackTo={backButtonTo} label={backButtonLabel} /> : null}

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

            {shouldShowAvailabilityBanner ? (
                <div
                    className={[
                        "hidden rounded-[1.35rem] px-4 py-3.5 text-sm leading-6 md:block",
                        routeAvailability.canOpen ? "app-subtle-surface" : "app-tone-warning",
                    ].join(" ")}
                >
                    {routeAvailability.reason}
                </div>
            ) : null}

            {educationalNoticeArea ? (
                <EducationalUseNotice area={educationalNoticeArea} />
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

            <div className="hidden xl:block">
                {resultSection ? (
                    <div className="app-adaptive-layout">
                        <div
                            className={[
                                "app-adaptive-main",
                                desktopLayout === "result-focus"
                                    ? "app-adaptive-main--result-focus"
                                    : "app-adaptive-main--balanced",
                            ].join(" ")}
                        >
                            {desktopLayout === "result-focus" ? (
                                <>
                                    <div className="min-w-0">
                                        <LayoutSection label="Inputs" id="section-inputs">
                                            {inputSection}
                                        </LayoutSection>
                                    </div>

                                    <div className="min-w-0">
                                        <LayoutSection label="Results" id="section-results">
                                            {resultSection}
                                        </LayoutSection>
                                    </div>
                                </>
                            ) : prioritizeResultSection ? (
                                <>
                                    <div className="min-w-0">
                                        <LayoutSection label="Results" id="section-results">
                                            {resultSection}
                                        </LayoutSection>
                                    </div>
                                    <div className="min-w-0">
                                        <LayoutSection label="Inputs" id="section-inputs">
                                            {inputSection}
                                        </LayoutSection>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="min-w-0">
                                        <LayoutSection label="Inputs" id="section-inputs">
                                            {inputSection}
                                        </LayoutSection>
                                    </div>
                                    <div className="min-w-0">
                                        <LayoutSection label="Results" id="section-results">
                                            {resultSection}
                                        </LayoutSection>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                ) : (
                    <LayoutSection label="Inputs" id="section-inputs">
                        {inputSection}
                    </LayoutSection>
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

            {explanationSection ? (
                <DisclosurePanel
                    title="Learn this method"
                    summary="Open the formula, procedure, interpretation, and cautions only when you need deeper support."
                    badge="Learn"
                >
                    {explanationSection}
                </DisclosurePanel>
            ) : null}
        </div>
    );
}
