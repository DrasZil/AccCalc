import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DisclosurePanel from "../../../components/DisclosurePanel";

export type StudyLessonOutlineItem = {
    id: string;
    title: string;
    summary?: string;
};

type BreadcrumbItem = {
    label: string;
    path?: string;
};

type StudyLessonLayoutProps = {
    badge: string;
    title: string;
    summary: string;
    breadcrumbs: BreadcrumbItem[];
    outline: StudyLessonOutlineItem[];
    activeSectionId: string;
    progressPercent: number;
    progressLabel: string;
    difficultyLabel: string;
    estimatedTimeLabel: string;
    prerequisiteLabel?: string;
    completionLabel: string;
    sidebarTop?: ReactNode;
    sidebarBottom?: ReactNode;
    headerActions?: ReactNode;
    children: ReactNode;
};

export function useLessonSectionObserver(
    sectionIds: string[],
    onChange: (sectionId: string) => void
) {
    useEffect(() => {
        if (typeof window === "undefined" || sectionIds.length === 0) return;

        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter((section): section is HTMLElement => Boolean(section));

        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (left, right) =>
                            Math.abs(left.boundingClientRect.top) -
                            Math.abs(right.boundingClientRect.top)
                    )[0];

                if (visibleEntry?.target?.id) {
                    onChange(visibleEntry.target.id);
                }
            },
            {
                rootMargin: "-24% 0px -55% 0px",
                threshold: [0.1, 0.35, 0.65],
            }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [onChange, sectionIds]);
}

export default function StudyLessonLayout({
    badge,
    title,
    summary,
    breadcrumbs,
    outline,
    activeSectionId,
    progressPercent,
    progressLabel,
    difficultyLabel,
    estimatedTimeLabel,
    prerequisiteLabel,
    completionLabel,
    sidebarTop,
    sidebarBottom,
    headerActions,
    children,
}: StudyLessonLayoutProps) {
    return (
        <div className="app-page-stack">
            <div className="app-panel app-hero-panel rounded-[1.6rem] p-5 md:p-7">
                <div className="flex flex-col gap-4">
                    <nav className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--app-text-muted)]">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                                {crumb.path ? (
                                    <Link
                                        to={crumb.path}
                                        className="transition hover:text-[color:var(--app-text)]"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="font-semibold text-[color:var(--app-text)]">
                                        {crumb.label}
                                    </span>
                                )}
                                {index < breadcrumbs.length - 1 ? <span>/</span> : null}
                            </div>
                        ))}
                    </nav>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="app-kicker text-xs">{badge}</p>
                            <h1 className="mt-3 text-3xl font-bold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)] md:text-4xl">
                                {title}
                            </h1>
                            <p className="app-body-md mt-4 max-w-3xl text-sm leading-7 md:text-[0.98rem]">
                                {summary}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="app-chip rounded-full px-3 py-1 text-[0.68rem]">
                                    {progressLabel}
                                </span>
                                <span className="app-chip rounded-full px-3 py-1 text-[0.68rem]">
                                    {difficultyLabel}
                                </span>
                                <span className="app-chip rounded-full px-3 py-1 text-[0.68rem]">
                                    {estimatedTimeLabel}
                                </span>
                            </div>
                        </div>

                        {headerActions ? (
                            <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
                                {headerActions}
                            </div>
                        ) : null}
                    </div>

                    <DisclosurePanel
                        title="Lesson context"
                        summary="Progress, pace, and prerequisite cues stay close by without pushing the reading flow down the page."
                        badge="Context"
                        compact
                    >
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <p className="app-helper text-[0.68rem] uppercase tracking-[0.16em]">
                                    Progress
                                </p>
                                <p className="mt-2 text-sm font-semibold text-[color:var(--app-text)]">
                                    {progressLabel}
                                </p>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color:var(--app-border)]/60">
                                    <div
                                        className="h-full rounded-full bg-[color:var(--app-accent)] transition-all"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <p className="app-helper text-[0.68rem] uppercase tracking-[0.16em]">
                                    Difficulty
                                </p>
                                <p className="mt-2 text-sm font-semibold text-[color:var(--app-text)]">
                                    {difficultyLabel}
                                </p>
                            </div>
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <p className="app-helper text-[0.68rem] uppercase tracking-[0.16em]">
                                    Estimated time
                                </p>
                                <p className="mt-2 text-sm font-semibold text-[color:var(--app-text)]">
                                    {estimatedTimeLabel}
                                </p>
                            </div>
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <p className="app-helper text-[0.68rem] uppercase tracking-[0.16em]">
                                    Prerequisite focus
                                </p>
                                <p className="mt-2 text-sm font-semibold text-[color:var(--app-text)]">
                                    {prerequisiteLabel ?? "Open the overview first"}
                                </p>
                                <p className="app-helper mt-2 text-xs">{completionLabel}</p>
                            </div>
                        </div>
                    </DisclosurePanel>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <DisclosurePanel
                    title="Lesson outline"
                    summary="Jump between sections on smaller screens without keeping the outline visible all the time."
                    badge={`${outline.length} sections`}
                    compact
                    className="xl:hidden"
                >
                    <div className="space-y-2">
                        {outline.map((item, index) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className={[
                                    "block rounded-[1rem] border px-3.5 py-3 transition",
                                    activeSectionId === item.id
                                        ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] shadow-[var(--app-shadow-sm)]"
                                        : "app-divider hover:border-[color:var(--app-border-strong)]",
                                ].join(" ")}
                            >
                                <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--app-text-muted)]">
                                    Section {index + 1}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                                    {item.title}
                                </p>
                                {item.summary ? (
                                    <p className="app-helper mt-1 text-xs leading-5">
                                        {item.summary}
                                    </p>
                                ) : null}
                            </a>
                        ))}
                    </div>
                </DisclosurePanel>

                <article className="min-w-0 space-y-5">{children}</article>

                <aside className="min-w-0 space-y-4 xl:sticky xl:top-24 xl:self-start">
                    <div className="app-panel rounded-[1.35rem] p-4">
                        <p className="app-section-kicker text-[0.68rem]">Lesson outline</p>
                        <h2 className="app-section-title mt-2">You are here</h2>
                        <div className="mt-4 space-y-2">
                            {outline.map((item, index) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className={[
                                        "block rounded-[1rem] border px-3.5 py-3 transition",
                                        activeSectionId === item.id
                                            ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] shadow-[var(--app-shadow-sm)]"
                                            : "app-divider hover:border-[color:var(--app-border-strong)]",
                                    ].join(" ")}
                                >
                                    <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--app-text-muted)]">
                                        Section {index + 1}
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                                        {item.title}
                                    </p>
                                    {item.summary ? (
                                        <p className="app-helper mt-1 text-xs leading-5">
                                            {item.summary}
                                        </p>
                                    ) : null}
                                </a>
                            ))}
                        </div>
                    </div>

                    {sidebarTop}
                    {sidebarBottom}
                </aside>
            </div>
        </div>
    );
}
