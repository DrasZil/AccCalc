import { useDeferredValue, useMemo, useState } from "react";
import DisclosurePanel from "../../components/DisclosurePanel";
import GuidedStartPanel from "../../components/GuidedStartPanel";
import PageHeader from "../../components/PageHeader";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";
import TransitionLink from "../../components/TransitionLink";
import { APP_NAV_GROUPS } from "../../utils/appCatalog";
import {
    STUDY_CATEGORY_DETAILS,
    buildStudyQuizPath,
    buildStudyTopicPath,
    getAllStudyTopics,
    getStudyCategoryTrack,
    searchStudyTopics,
    type StudyTopic,
} from "./studyContent";
import { useStudyProgress } from "../../utils/studyProgress";

function TopicCard({
    topic,
    reviewedCount,
    bookmarked,
    bestScore,
}: {
    topic: StudyTopic;
    reviewedCount: number;
    bookmarked: boolean;
    bestScore: number | null;
}) {
    return (
        <div className="app-link-card min-w-0 rounded-[1.15rem] px-4 py-4">
            <div className="flex min-w-0 flex-wrap items-start gap-2">
                <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                    {getStudyCategoryTrack(topic.category)}
                </span>
                {bookmarked ? (
                    <span className="app-chip-accent rounded-full px-2.5 py-1 text-[0.62rem]">
                        Bookmarked
                    </span>
                ) : null}
                {bestScore !== null ? (
                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                        Best quiz {Math.round(bestScore)}%
                    </span>
                ) : null}
            </div>

            <h3 className="app-wrap-anywhere mt-3 text-[1rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                {topic.title}
            </h3>
            <p className="app-helper mt-1.5 text-xs leading-5">{topic.summary}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="app-helper text-xs">{reviewedCount} sections reviewed</span>
            </div>

            <div className="app-card-grid-readable--compact mt-4">
                <TransitionLink
                    to={buildStudyTopicPath(topic.id)}
                    className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                >
                    Open lesson
                </TransitionLink>
                <TransitionLink
                    to={buildStudyQuizPath(topic.id)}
                    className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                >
                    Practice quiz
                </TransitionLink>
            </div>
        </div>
    );
}

export default function StudyHubPage() {
    const [query, setQuery] = useState("");
    const [activeTrack, setActiveTrack] = useState<string>("All");
    const deferredQuery = useDeferredValue(query);
    const studyProgress = useStudyProgress();

    const allTopics = useMemo(() => getAllStudyTopics(), []);
    const studyTracks = useMemo(
        () => ["All", ...Array.from(new Set(allTopics.map((topic) => getStudyCategoryTrack(topic.category))))],
        [allTopics]
    );

    const visibleTopics = useMemo(
        () =>
            (deferredQuery.trim() ? searchStudyTopics(deferredQuery) : allTopics).filter((topic) =>
                activeTrack === "All" ? true : getStudyCategoryTrack(topic.category) === activeTrack
            ),
        [activeTrack, allTopics, deferredQuery]
    );

    const recentTopics = useMemo(
        () =>
            Object.values(studyProgress.topics)
                .sort((left, right) => right.lastViewedAt - left.lastViewedAt)
                .slice(0, 4)
                .map((record) => allTopics.find((topic) => topic.id === record.id))
                .filter((topic): topic is StudyTopic => Boolean(topic)),
        [allTopics, studyProgress.topics]
    );

    const bookmarkedTopics = useMemo(
        () =>
            Object.values(studyProgress.topics)
                .filter((record) => record.bookmarked)
                .sort((left, right) => right.lastViewedAt - left.lastViewedAt)
                .slice(0, 4)
                .map((record) => allTopics.find((topic) => topic.id === record.id))
                .filter((topic): topic is StudyTopic => Boolean(topic)),
        [allTopics, studyProgress.topics]
    );

    const categoryGroups = useMemo(
        () =>
            visibleTopics.reduce<Record<string, StudyTopic[]>>((groups, topic) => {
                const track = getStudyCategoryTrack(topic.category);
                const existing = groups[track] ?? [];
                return {
                    ...groups,
                    [track]: [...existing, topic],
                };
            }, {} as Record<string, StudyTopic[]>),
        [visibleTopics]
    );
    const categoryCoverage = useMemo(
        () =>
            allTopics.reduce<
                Record<string, { topicCount: number; calculatorCount: number; quizCount: number }>
            >((groups, topic) => {
                const track = getStudyCategoryTrack(topic.category);
                const current = groups[track] ?? {
                    topicCount: 0,
                    calculatorCount: 0,
                    quizCount: 0,
                };

                return {
                    ...groups,
                    [track]: {
                        topicCount: current.topicCount + 1,
                        calculatorCount:
                            current.calculatorCount + topic.relatedCalculatorPaths.length,
                        quizCount: current.quizCount + 1,
                    },
                };
            }, {} as Record<string, { topicCount: number; calculatorCount: number; quizCount: number }>),
        [allTopics]
    );

    const quizCount = Object.keys(studyProgress.quizzes).length;
    const calculatorGroups = useMemo(
        () =>
            APP_NAV_GROUPS.filter((group) => group.title !== "Study Hub" && group.items.length > 0),
        []
    );

    return (
        <div className="app-page-stack">
            <PageHeader
                badge="Study Hub"
                title="Study topics step by step, then move into practice"
                description="Use Study Hub when you need plain-language review before solving, when you want a stronger explanation after a calculator result, or when you need a short quiz to confirm that the topic really makes sense."
                compactDescriptionOnMobile
                actions={
                    <>
                        <TransitionLink
                            to="/study/practice"
                            className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            Open practice mode
                        </TransitionLink>
                        <TransitionLink
                            to="/smart/solver"
                            className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            Ask Smart Solver
                        </TransitionLink>
                    </>
                }
            />

            <GuidedStartPanel
                badge="Study path"
                title="Keep learning layered: lesson first, quiz second, deeper support only when needed"
                summary="The Study Hub is meant to reduce intimidation. Start with a topic overview, move into a short practice set, and return to deeper sections only for the parts that still feel weak."
                steps={[
                    {
                        title: "Open one lesson",
                        description:
                            "Start with a topic page when you need the meaning, formula logic, procedure, and common mistakes in plain language.",
                        badge: "Lesson",
                    },
                    {
                        title: "Use a mini quiz",
                        description:
                            "Practice after the concept already feels familiar so the quiz becomes self-check, not blind guessing.",
                        badge: "Quiz",
                    },
                    {
                        title: "Return only to the weak spots",
                        description:
                            "Bookmarks, notes, reviewed sections, and scores stay on this device so you can keep studying without re-reading everything.",
                        badge: "Review",
                    },
                ]}
            />

            <SectionCard>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="app-section-kicker text-[0.68rem]">Search topics</p>
                        <p className="app-body-md mt-2 text-sm">
                            Search by topic, classroom wording, or concept signal such as break-even, transferred-in cost, elasticity, or liquidation.
                        </p>
                    </div>
                    <div className="w-full max-w-xl">
                        <label className="sr-only" htmlFor="study-search">
                            Search study topics
                        </label>
                        <input
                            id="study-search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search study topics..."
                            className="app-input-shell w-full rounded-[1rem] px-4 py-3 text-sm"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <div className="app-panel rounded-[1rem] p-1.5">
                        <div className="app-guide-tabs">
                            {studyTracks.map((track) => (
                                <button
                                    key={track}
                                    type="button"
                                    onClick={() => setActiveTrack(track)}
                                    className={[
                                        "app-guide-tab-button rounded-xl px-3 py-2 text-sm font-semibold",
                                        activeTrack === track ? "app-button-primary" : "app-button-ghost",
                                    ].join(" ")}
                                >
                                    {track}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionCard>

            <section className="app-study-layout">
                <SectionCard>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="app-section-kicker text-[0.68rem]">Continue study</p>
                            <h2 className="app-section-title mt-2">Recent lesson activity</h2>
                        </div>
                        <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                            {recentTopics.length} recent
                        </span>
                    </div>

                    <div className="mt-4 app-card-grid-readable">
                        {(recentTopics.length > 0 ? recentTopics : allTopics.slice(0, 4)).map((topic) => {
                            const topicRecord = studyProgress.topics[topic.id];
                            const quizRecord = studyProgress.quizzes[topic.id];

                            return (
                                <TopicCard
                                    key={topic.id}
                                    topic={topic}
                                    reviewedCount={topicRecord?.completedSections.length ?? 0}
                                    bookmarked={topicRecord?.bookmarked ?? false}
                                    bestScore={
                                        quizRecord
                                            ? (quizRecord.bestScore / quizRecord.totalQuestions) * 100
                                            : null
                                    }
                                />
                            );
                        })}
                    </div>
                </SectionCard>

                <SectionCard>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="app-section-kicker text-[0.68rem]">Study stats</p>
                            <h2 className="app-section-title mt-2">On-device progress</h2>
                        </div>
                    </div>

                    <div className="mt-4 app-card-grid-readable--compact">
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <p className="app-metric-label">Topics opened</p>
                            <p className="app-metric-value mt-2">
                                {Object.keys(studyProgress.topics).length}
                            </p>
                        </div>
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <p className="app-metric-label">Quizzes attempted</p>
                            <p className="app-metric-value mt-2">{quizCount}</p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <div className="app-tone-info rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">Bookmarks</p>
                            <p className="app-body-md mt-2 text-sm">
                                {bookmarkedTopics.length > 0
                                    ? `${bookmarkedTopics.length} topic${bookmarkedTopics.length === 1 ? "" : "s"} saved for return study.`
                                    : "Bookmark a topic when you want it to stay near the top of your study flow."}
                            </p>
                        </div>
                        <div className="app-tone-accent rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">Solve, learn, practice</p>
                            <p className="app-body-md mt-2 text-sm">
                                Use calculators and Scan & Check for solving, open the full lesson when you need procedure support, and finish with a short quiz to verify the concept.
                            </p>
                        </div>
                    </div>
                </SectionCard>
            </section>

            <section className="space-y-4">
                <div>
                    <p className="app-section-kicker text-[0.68rem]">Browse by category</p>
                    <h2 className="app-section-title mt-2">
                        {deferredQuery.trim() ? "Search results" : "Structured study categories"}
                    </h2>
                    <p className="app-helper mt-2 text-xs">
                        {activeTrack === "All"
                            ? "Browse the full study catalog by track, then open one lesson instead of scanning every topic at once."
                            : `Showing ${activeTrack} topics first so the study view stays narrower and easier to scan.`}
                    </p>
                </div>

                {Object.entries(categoryGroups).map(([category, topics]) => (
                    <SectionCard key={category}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="max-w-3xl">
                                <p className="app-card-title text-base">{category}</p>
                                <p className="app-helper mt-1 text-xs leading-5">
                                    {topics[0]
                                        ? STUDY_CATEGORY_DETAILS[topics[0].category].description
                                        : "Structured study coverage for this curriculum track."}
                                </p>
                                <p className="app-helper mt-2 text-xs leading-5">
                                    Focus: {topics[0]
                                        ? STUDY_CATEGORY_DETAILS[topics[0].category].emphasis
                                        : "Concept structure and practical interpretation"}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                        {categoryCoverage[category]?.topicCount ?? 0} lessons
                                    </span>
                                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                        {categoryCoverage[category]?.quizCount ?? 0} quizzes
                                    </span>
                                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                        {categoryCoverage[category]?.calculatorCount ?? 0} linked calculators
                                    </span>
                                </div>
                            </div>
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                {topics.length} topics
                            </span>
                        </div>

                        <div className="mt-4 app-card-grid-readable">
                            {topics.map((topic) => {
                                const topicRecord = studyProgress.topics[topic.id];
                                const quizRecord = studyProgress.quizzes[topic.id];

                                return (
                                    <TopicCard
                                        key={topic.id}
                                        topic={topic}
                                        reviewedCount={topicRecord?.completedSections.length ?? 0}
                                        bookmarked={topicRecord?.bookmarked ?? false}
                                        bestScore={
                                            quizRecord
                                                ? (quizRecord.bestScore / quizRecord.totalQuestions) * 100
                                                : null
                                        }
                                    />
                                );
                            })}
                        </div>
                    </SectionCard>
                ))}
            </section>

            <DisclosurePanel
                title="Browse calculator families from the study layer"
                summary="Open this only when you already know the topic and want the matching calculator or workspace after reviewing the lesson."
                badge={`${calculatorGroups.length} groups`}
            >
                <div className="app-card-grid-readable">
                    {calculatorGroups.map((group) => (
                        <RelatedLinksPanel
                            key={group.title}
                            title={group.title}
                            summary={
                                group.items.length > 8
                                    ? `${group.hint}. The most-used routes are surfaced first to keep browsing cleaner.`
                                    : group.hint
                            }
                            badge={`${group.items.length} tools`}
                            items={group.items.slice(0, 8).map((item) => ({
                                path: item.path,
                                label: item.shortLabel ?? item.label,
                                description: item.description,
                            }))}
                            compact
                            defaultOpen={group.items.length <= 4}
                        />
                    ))}
                </div>
            </DisclosurePanel>
        </div>
    );
}
