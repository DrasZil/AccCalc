import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DisclosurePanel from "../../components/DisclosurePanel";
import GuidedStartPanel from "../../components/GuidedStartPanel";
import PageHeader from "../../components/PageHeader";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";
import TransitionLink from "../../components/TransitionLink";
import { APP_NAV_GROUPS } from "../../utils/appCatalog";
import { buildCurriculumTrackSnapshots } from "../../utils/appExperience";
import {
    STUDY_CATEGORY_DETAILS,
    buildStudyQuizPath,
    buildStudyTopicPath,
    getAllStudyTopics,
    getStudyCategoryTrack,
    getStudyTopicsByTrack,
    searchStudyTopics,
    type StudyTopic,
} from "./studyContent";
import { useStudyProgress } from "../../utils/studyProgress";

function TopicCard({
    topic,
    reviewedCount,
    bookmarked,
    bestScore,
    continueLabel,
}: {
    topic: StudyTopic;
    reviewedCount: number;
    bookmarked: boolean;
    bestScore: number | null;
    continueLabel?: string;
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
                {continueLabel ? (
                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                        {continueLabel}
                    </span>
                ) : null}
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

type ModuleSummary = {
    track: string;
    lessonCount: number;
    startedTopics: number;
    bookmarkCount: number;
    reviewedSections: number;
    linkedCalculatorCount: number;
    firstTopic: StudyTopic | null;
    resumeTopic: StudyTopic | null;
    completionPercent: number;
    summary: string;
};

function ModuleCard({
    summary,
    active,
    onActivate,
}: {
    summary: ModuleSummary;
    active: boolean;
    onActivate: () => void;
}) {
    return (
        <div
            className={[
                "app-panel min-w-0 rounded-[1.3rem] p-4 transition",
                active
                    ? "border-[color:var(--app-border-strong)] shadow-[var(--app-shadow-md)]"
                    : "hover:border-[color:var(--app-border-strong)]",
            ].join(" ")}
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="app-section-kicker text-[0.68rem]">Module</p>
                    <h3 className="mt-2 text-lg font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                        {summary.track}
                    </h3>
                    <p className="app-helper mt-2 text-xs leading-5">{summary.summary}</p>
                </div>
                <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                    {summary.lessonCount} lessons
                </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="app-subtle-surface rounded-[1rem] px-3.5 py-3">
                    <p className="app-metric-label">Started</p>
                    <p className="app-metric-value mt-2">{summary.startedTopics}</p>
                </div>
                <div className="app-subtle-surface rounded-[1rem] px-3.5 py-3">
                    <p className="app-metric-label">Progress</p>
                    <p className="app-metric-value mt-2">{summary.completionPercent}%</p>
                </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[color:var(--app-border)]/60">
                <div
                    className="h-full rounded-full bg-[color:var(--app-accent)] transition-all"
                    style={{ width: `${summary.completionPercent}%` }}
                />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                    {summary.linkedCalculatorCount} linked tools
                </span>
                <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                    {summary.reviewedSections} reviewed sections
                </span>
                <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                    {summary.bookmarkCount} bookmarks
                </span>
            </div>

            <div className="mt-4 app-card-grid-readable--compact">
                <button
                    type="button"
                    onClick={onActivate}
                    className={[
                        "rounded-xl px-4 py-2.5 text-sm font-semibold",
                        active ? "app-button-primary" : "app-button-secondary",
                    ].join(" ")}
                >
                    {active ? "Viewing this module" : "Focus this module"}
                </button>
                {summary.resumeTopic ? (
                    <TransitionLink
                        to={buildStudyTopicPath(summary.resumeTopic.id)}
                        className="app-button-ghost rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                    >
                        Resume {summary.resumeTopic.shortTitle}
                    </TransitionLink>
                ) : summary.firstTopic ? (
                    <TransitionLink
                        to={buildStudyTopicPath(summary.firstTopic.id)}
                        className="app-button-ghost rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                    >
                        Start module
                    </TransitionLink>
                ) : null}
            </div>
        </div>
    );
}

export default function StudyHubPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [activeTrack, setActiveTrack] = useState<string>("All");
    const deferredQuery = useDeferredValue(query);
    const studyProgress = useStudyProgress();

    const allTopics = useMemo(() => getAllStudyTopics(), []);
    const studyTracks = useMemo(
        () => ["All", ...Array.from(new Set(allTopics.map((topic) => getStudyCategoryTrack(topic.category))))],
        [allTopics]
    );

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const requestedTrack = params.get("track");
        if (requestedTrack && studyTracks.includes(requestedTrack)) {
            setActiveTrack(requestedTrack);
            return;
        }
        if (!requestedTrack) {
            setActiveTrack((current) => (studyTracks.includes(current) ? current : "All"));
        }
    }, [location.search, studyTracks]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (activeTrack === "All") {
            if (!params.has("track")) return;
            params.delete("track");
        } else if (params.get("track") !== activeTrack) {
            params.set("track", activeTrack);
        } else {
            return;
        }

        navigate(
            {
                pathname: location.pathname,
                search: params.toString() ? `?${params.toString()}` : "",
            },
            { replace: true }
        );
    }, [activeTrack, location.pathname, location.search, navigate]);

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
        () => {
            const groups: Record<string, StudyTopic[]> = {};
            visibleTopics.forEach((topic) => {
                const track = getStudyCategoryTrack(topic.category);
                (groups[track] ??= []).push(topic);
            });
            return groups;
        },
        [visibleTopics]
    );
    const categoryCoverage = useMemo(
        () => {
            const groups: Record<
                string,
                { topicCount: number; calculatorCount: number; quizCount: number }
            > = {};

            allTopics.forEach((topic) => {
                const track = getStudyCategoryTrack(topic.category);
                const current = groups[track] ??= {
                    topicCount: 0,
                    calculatorCount: 0,
                    quizCount: 0,
                };

                current.topicCount += 1;
                current.calculatorCount += topic.relatedCalculatorPaths.length;
                current.quizCount += 1;
            });

            return groups;
        },
        [allTopics]
    );
    const moduleSummaries = useMemo<ModuleSummary[]>(
        () =>
            studyTracks
                .filter((track) => track !== "All")
                .map((track) => {
                    const topics = getStudyTopicsByTrack(track);
                    const startedTopics = topics.filter((topic) => studyProgress.topics[topic.id]).length;
                    const bookmarkCount = topics.filter(
                        (topic) => studyProgress.topics[topic.id]?.bookmarked
                    ).length;
                    const reviewedSections = topics.reduce(
                        (sum, topic) =>
                            sum + (studyProgress.topics[topic.id]?.completedSections.length ?? 0),
                        0
                    );
                    const linkedCalculatorCount = topics.reduce(
                        (sum, topic) => sum + topic.relatedCalculatorPaths.length,
                        0
                    );
                    const lastViewedTopic = [...topics]
                        .filter((topic) => studyProgress.topics[topic.id])
                        .toSorted(
                            (left, right) =>
                                (studyProgress.topics[right.id]?.lastViewedAt ?? 0) -
                                (studyProgress.topics[left.id]?.lastViewedAt ?? 0)
                        )[0] ?? null;
                    const completionPercent =
                        topics.length === 0
                            ? 0
                            : Math.round((startedTopics / topics.length) * 100);

                    return {
                        track,
                        lessonCount: topics.length,
                        startedTopics,
                        bookmarkCount,
                        reviewedSections,
                        linkedCalculatorCount,
                        firstTopic: topics[0] ?? null,
                        resumeTopic: lastViewedTopic,
                        completionPercent,
                        summary:
                            topics[0]
                                ? STUDY_CATEGORY_DETAILS[topics[0].category].description
                                : "Structured textbook-style lessons, calculator links, and quick checks.",
                    };
                })
                .filter((summary) => summary.lessonCount > 0),
        [studyProgress.topics, studyTracks]
    );
    const activeModuleSummary = useMemo(
        () =>
            moduleSummaries.find((summary) => summary.track === activeTrack) ??
            moduleSummaries[0] ??
            null,
        [activeTrack, moduleSummaries]
    );
    const curriculumSnapshots = useMemo(
        () =>
            buildCurriculumTrackSnapshots().filter(
                (snapshot) =>
                    snapshot.track !== "Study Hub" &&
                    snapshot.track !== "Smart Tools" &&
                    snapshot.track !== "General"
            ),
        []
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

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                <SectionCard>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="app-section-kicker text-[0.68rem]">Module shelf</p>
                            <h2 className="app-section-title mt-2">Curriculum tracks with lesson depth</h2>
                            <p className="app-helper mt-2 text-xs leading-5">
                                Each track now reads more like a shelf: lessons, linked tools, and progress cues stay grouped instead of feeling like one long mixed list.
                            </p>
                        </div>
                        <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                            {curriculumSnapshots.length} tracks
                        </span>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {curriculumSnapshots.map((snapshot) => (
                            <button
                                key={snapshot.track}
                                type="button"
                                onClick={() => setActiveTrack(snapshot.track)}
                                className={[
                                    "rounded-[1.05rem] border px-4 py-3.5 text-left transition",
                                    activeTrack === snapshot.track
                                        ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] shadow-[var(--app-shadow-sm)]"
                                        : "app-subtle-surface hover:border-[color:var(--app-border-strong)]",
                                ].join(" ")}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                        {snapshot.track}
                                    </p>
                                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                        {snapshot.status}
                                    </span>
                                </div>
                                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                                    <div className="app-panel rounded-[0.95rem] px-2.5 py-2.5">
                                        <p className="app-helper text-[0.62rem]">Lessons</p>
                                        <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                                            {snapshot.lessonCount}
                                        </p>
                                    </div>
                                    <div className="app-panel rounded-[0.95rem] px-2.5 py-2.5">
                                        <p className="app-helper text-[0.62rem]">Routes</p>
                                        <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                                            {snapshot.routeCount}
                                        </p>
                                    </div>
                                    <div className="app-panel rounded-[0.95rem] px-2.5 py-2.5">
                                        <p className="app-helper text-[0.62rem]">Guided</p>
                                        <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                                            {snapshot.workspaceCount}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard>
                    <p className="app-section-kicker text-[0.68rem]">Study trust</p>
                    <h2 className="app-section-title mt-2">What stays saved on this device</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <p className="app-metric-label">Lessons started</p>
                            <p className="app-metric-value mt-2">
                                {Object.keys(studyProgress.topics).length}
                            </p>
                            <p className="app-helper mt-1 text-xs">Resume flow stays local.</p>
                        </div>
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <p className="app-metric-label">Quiz sets touched</p>
                            <p className="app-metric-value mt-2">{quizCount}</p>
                            <p className="app-helper mt-1 text-xs">Scores stay tied to topics.</p>
                        </div>
                    </div>
                    <div className="app-tone-info mt-4 rounded-[1rem] px-4 py-3.5">
                        <p className="app-card-title text-sm">Reading flow rule</p>
                        <p className="app-body-md mt-2 text-sm">
                            Open one track, keep the lesson shelf focused, then move into quizzes and calculators only after the topic framing is clear enough to trust your next step.
                        </p>
                    </div>
                </SectionCard>
            </section>

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

                {activeModuleSummary ? (
                    <div className="app-tone-info mt-4 rounded-[1rem] px-4 py-3.5">
                        <p className="app-card-title text-sm">
                            {activeTrack === "All"
                                ? "Full library open"
                                : `${activeModuleSummary.track} module focus`}
                        </p>
                        <p className="app-body-md mt-2 text-sm">
                            {activeTrack === "All"
                                ? "Browse every module when you are still deciding what to review next. Switch to one module when you want the reading flow to feel more like a chapter shelf than a giant mixed list."
                                : `${activeModuleSummary.track} currently contains ${activeModuleSummary.lessonCount} lessons, ${activeModuleSummary.linkedCalculatorCount} linked tools, and ${activeModuleSummary.reviewedSections} reviewed sections on this device.`}
                        </p>
                    </div>
                ) : null}
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
                                    continueLabel={
                                        topicRecord?.lastSectionKey
                                            ? `Resume ${topicRecord.lastSectionKey.replaceAll("-", " ")}`
                                            : undefined
                                    }
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
                        {activeModuleSummary ? (
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <p className="app-card-title text-sm">Focused module</p>
                                <p className="app-body-md mt-2 text-sm">
                                    {activeTrack === "All"
                                        ? "Switch to one module when you want the lesson list to feel like a real chapter run instead of a mixed search table."
                                        : `${activeModuleSummary.track} is active, so the lesson shelf and category sections stay narrowed to that module while you study.`}
                                </p>
                            </div>
                        ) : null}
                    </div>
                </SectionCard>
            </section>

            {deferredQuery.trim() === "" ? (
                <section className="space-y-4">
                    <div>
                        <p className="app-section-kicker text-[0.68rem]">Module library</p>
                        <h2 className="app-section-title mt-2">Textbook-style shelves by track</h2>
                        <p className="app-helper mt-2 text-xs">
                            Use module cards when you want the Study Hub to behave more like a chapter shelf: one curriculum track at a time, with progress, next lesson, and linked calculators kept together.
                        </p>
                    </div>

                    <div className="app-card-grid-readable">
                        {moduleSummaries.map((summary) => (
                            <ModuleCard
                                key={summary.track}
                                summary={summary}
                                active={summary.track === activeTrack}
                                onActivate={() => setActiveTrack(summary.track)}
                            />
                        ))}
                    </div>
                </section>
            ) : null}

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
                    <SectionCard
                        key={category}
                        style={{
                            contentVisibility: "auto",
                            containIntrinsicSize: "900px",
                        }}
                    >
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
                                        continueLabel={
                                            topicRecord?.lastSectionKey
                                                ? `Resume ${topicRecord.lastSectionKey.replaceAll("-", " ")}`
                                                : undefined
                                        }
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
