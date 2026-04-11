import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import DisclosurePanel from "./DisclosurePanel";
import RelatedLinksPanel from "./RelatedLinksPanel";
import SectionCard from "./SectionCard";
import {
    markStudySectionComplete,
    toggleStudyBookmark,
    touchStudyTopic,
    useStudyProgress,
} from "../utils/studyProgress";

export type StudySupportSection = {
    key: string;
    label: string;
    summary?: string;
    content: ReactNode;
    emphasis?: "core" | "support";
    tone?: "default" | "accent" | "info" | "warning";
};

type StudySupportPanelProps = {
    topicId: string;
    topicTitle: string;
    intro: string;
    sections: StudySupportSection[];
    relatedTools?: Array<{ path: string; label: string }>;
    lessonPath?: string;
    quizPath?: string;
};

function getToneClass(tone: StudySupportSection["tone"]) {
    switch (tone) {
        case "accent":
            return "app-tone-accent";
        case "info":
            return "app-tone-info";
        case "warning":
            return "app-tone-warning";
        default:
            return "app-subtle-surface";
    }
}

export default function StudySupportPanel({
    topicId,
    topicTitle,
    intro,
    sections,
    relatedTools = [],
    lessonPath,
    quizPath,
}: StudySupportPanelProps) {
    const location = useLocation();
    const studyProgress = useStudyProgress();
    const topicProgress = studyProgress.topics[topicId];
    const progressPath = lessonPath ?? location.pathname;
    const [activeSection, setActiveSection] = useState(
        () => topicProgress?.lastSectionKey ?? sections[0]?.key ?? "overview"
    );

    useEffect(() => {
        touchStudyTopic({
            id: topicId,
            path: progressPath,
            title: topicTitle,
        });
    }, [progressPath, topicId, topicTitle]);

    useEffect(() => {
        if (!sections.some((section) => section.key === activeSection)) {
            setActiveSection(sections[0]?.key ?? "overview");
        }
    }, [activeSection, sections]);

    const completedCount = topicProgress?.completedSections.length ?? 0;
    const completionLabel =
        sections.length > 0 ? `${completedCount}/${sections.length} reviewed` : "Study";
    const activeMobileSection =
        sections.find((section) => section.key === activeSection) ?? sections[0] ?? null;
    const coreSections = useMemo(
        () => sections.filter((section) => (section.emphasis ?? "core") === "core"),
        [sections]
    );
    const supportSections = useMemo(
        () => sections.filter((section) => (section.emphasis ?? "core") === "support"),
        [sections]
    );

    function handleSectionOpen(sectionKey: string) {
        setActiveSection(sectionKey);
        markStudySectionComplete(
            {
                id: topicId,
                path: progressPath,
                title: topicTitle,
            },
            sectionKey
        );
    }

    return (
        <SectionCard className="overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-3xl">
                    <p className="app-section-kicker text-[0.68rem]">Study</p>
                    <p className="app-body-md mt-2 text-sm">{intro}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="app-chip rounded-full px-3 py-1 text-[0.62rem]">
                        {completionLabel}
                    </span>
                    <button
                        type="button"
                        onClick={() =>
                            toggleStudyBookmark({
                                id: topicId,
                                path: progressPath,
                                title: topicTitle,
                            })
                        }
                        className={[
                            "rounded-full px-3 py-1.5 text-xs font-semibold",
                            topicProgress?.bookmarked
                                ? "app-button-primary"
                                : "app-button-secondary",
                        ].join(" ")}
                    >
                        {topicProgress?.bookmarked ? "Bookmarked" : "Bookmark topic"}
                    </button>
                </div>
            </div>

            {lessonPath || quizPath ? (
                <div className="app-card-grid-readable--compact mt-4">
                    {lessonPath ? (
                        <Link
                            to={lessonPath}
                            className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                        >
                            Open full lesson
                        </Link>
                    ) : null}
                    {quizPath ? (
                        <Link
                            to={quizPath}
                            className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                        >
                            Practice quiz
                        </Link>
                    ) : null}
                </div>
            ) : null}

            {sections.length > 1 ? (
                <div className="mt-5 lg:hidden">
                    <div className="app-panel rounded-[1.1rem] p-1.5">
                        <div className="app-guide-tabs">
                            {sections.map((section) => (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => handleSectionOpen(section.key)}
                                    className={[
                                        "app-guide-tab-button rounded-xl px-3 py-2 text-sm font-semibold",
                                        activeMobileSection?.key === section.key
                                            ? "app-button-primary"
                                            : "app-button-ghost",
                                    ].join(" ")}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="mt-5 hidden lg:block">
                <div className="app-study-layout">
                    <div className="app-study-layout__primary">
                    {coreSections.map((section) => (
                        <div
                            key={section.key}
                            className={[
                                getToneClass(section.tone),
                                "rounded-[1.15rem] px-4 py-4 md:px-5",
                            ].join(" ")}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="app-card-title text-sm">{section.label}</p>
                                    {section.summary ? (
                                        <p className="app-helper mt-1 text-xs leading-5">
                                            {section.summary}
                                        </p>
                                    ) : null}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleSectionOpen(section.key)}
                                    className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]"
                                >
                                    Review
                                </button>
                            </div>
                            <div className="mt-3 app-reading-content">{section.content}</div>
                        </div>
                    ))}
                    </div>

                    <div className="app-study-layout__secondary">
                        {supportSections.length > 0 ? (
                            <div className="app-card-grid-readable--compact">
                                {supportSections.map((section) => (
                                    <DisclosurePanel
                                        key={section.key}
                                        title={section.label}
                                        summary={section.summary}
                                        badge={
                                            topicProgress?.completedSections.includes(section.key)
                                                ? "Reviewed"
                                                : "Support"
                                        }
                                        headerActions={
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleSectionOpen(section.key);
                                                }}
                                                className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]"
                                            >
                                                Mark
                                            </button>
                                        }
                                    >
                                        <div className="app-reading-content">{section.content}</div>
                                    </DisclosurePanel>
                                ))}
                            </div>
                        ) : null}

                        <RelatedLinksPanel
                            title="Related tools"
                            summary="Keep follow-up routes collapsed until you want the next calculator or lesson."
                            badge={`${relatedTools.length} tools`}
                            items={relatedTools}
                            compact
                        />
                    </div>
                </div>
            </div>

            {activeMobileSection ? (
                <div className="mt-5 space-y-4 lg:hidden">
                    <div
                        className={[
                            getToneClass(activeMobileSection.tone),
                            "rounded-[1.15rem] px-4 py-4 md:px-5",
                        ].join(" ")}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="app-card-title text-sm">{activeMobileSection.label}</p>
                                {activeMobileSection.summary ? (
                                    <p className="app-helper mt-1 text-xs leading-5">
                                        {activeMobileSection.summary}
                                    </p>
                                ) : null}
                            </div>
                            <button
                                type="button"
                                onClick={() => handleSectionOpen(activeMobileSection.key)}
                                className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]"
                            >
                                Review
                            </button>
                        </div>
                        <div className="mt-3 app-reading-content">
                            {activeMobileSection.content}
                        </div>
                    </div>

                    <RelatedLinksPanel
                        title="Related tools"
                        summary="Keep follow-up routes collapsed until you want the next calculator or lesson."
                        badge={`${relatedTools.length} tools`}
                        items={relatedTools}
                        compact
                    />
                </div>
            ) : null}
        </SectionCard>
    );
}
