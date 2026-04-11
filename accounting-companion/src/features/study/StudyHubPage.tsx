import { useDeferredValue, useMemo, useState } from "react";
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
    searchStudyTopics,
    type StudyTopic,
    type StudyTopicCategory,
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
                    {topic.category}
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
    const deferredQuery = useDeferredValue(query);
    const studyProgress = useStudyProgress();

    const allTopics = useMemo(() => getAllStudyTopics(), []);
    const visibleTopics = useMemo(
        () => (deferredQuery.trim() ? searchStudyTopics(deferredQuery) : allTopics),
        [allTopics, deferredQuery]
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
            visibleTopics.reduce<Record<StudyTopicCategory, StudyTopic[]>>((groups, topic) => {
                const existing = groups[topic.category] ?? [];
                return {
                    ...groups,
                    [topic.category]: [...existing, topic],
                };
            }, {} as Record<StudyTopicCategory, StudyTopic[]>),
        [visibleTopics]
    );

    const quizCount = Object.keys(studyProgress.quizzes).length;
    const calculatorGroups = useMemo(
        () =>
            APP_NAV_GROUPS.filter(
                (group) =>
                    group.title !== "Study Hub" &&
                    group.items.length > 0
            ),
        []
    );

    return (
        <div className="app-page-stack">
            <PageHeader
                badge="Study Hub"
                title="Browse lessons, review procedures, and practice by topic"
                description="Use the Study Hub as the learning center of AccCalc. Open topic lessons, revisit bookmarked subjects, continue where you stopped, and move into quiz mode when you want active practice instead of passive reading."
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

            <section className="app-card-grid-readable--compact">
                <SectionCard>
                    <p className="app-section-kicker text-[0.68rem]">Learn</p>
                    <p className="app-body-md mt-2 text-sm">
                        Topic pages explain what a concept means, when to use it, the formula logic, the solving method, and how to interpret the result.
                    </p>
                </SectionCard>
                <SectionCard>
                    <p className="app-section-kicker text-[0.68rem]">Practice</p>
                    <p className="app-body-md mt-2 text-sm">
                        Each quiz gives a short review path with answer explanations so practice teaches instead of only scoring.
                    </p>
                </SectionCard>
                <SectionCard>
                    <p className="app-section-kicker text-[0.68rem]">Continue</p>
                    <p className="app-body-md mt-2 text-sm">
                        Your bookmarks, reviewed sections, quiz attempts, and notes stay on this device with no account or backend required.
                    </p>
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
                </div>

                {Object.entries(categoryGroups).map(([category, topics]) => (
                    <SectionCard key={category}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="max-w-3xl">
                                <p className="app-card-title text-base">{category}</p>
                                <p className="app-helper mt-1 text-xs leading-5">
                                    {STUDY_CATEGORY_DETAILS[category as StudyTopicCategory].description}
                                </p>
                                <p className="app-helper mt-2 text-xs leading-5">
                                    Focus: {STUDY_CATEGORY_DETAILS[category as StudyTopicCategory].emphasis}
                                </p>
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

            <section className="space-y-4">
                <div>
                    <p className="app-section-kicker text-[0.68rem]">Calculator coverage</p>
                    <h2 className="app-section-title mt-2">Study Hub now spans every current calculator family</h2>
                    <p className="app-body-md mt-2 text-sm">
                        Use these groups when you want to move from topic study into the exact calculator or workspace that matches your assignment, check, or review set.
                    </p>
                </div>

                <div className="app-card-grid-readable">
                    {calculatorGroups.map((group) => (
                        <RelatedLinksPanel
                            key={group.title}
                            title={group.title}
                            summary={
                                group.items.length > 8
                                    ? `${group.hint}. The most-used routes are surfaced first to keep narrow-width browsing cleaner.`
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
            </section>
        </div>
    );
}
