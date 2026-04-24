import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GuidedStartPanel from "../../components/GuidedStartPanel";
import PageBackButton from "../../components/PageBackButton";
import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import { getRouteMeta } from "../../utils/appCatalog";
import {
    buildStudyQuizPath,
    buildStudyTopicPath,
    getAllStudyTopics,
    getStudyCategoryTrack,
    searchStudyTopics,
    type StudyTopic,
} from "./studyContent";
import { useStudyProgress } from "../../utils/studyProgress";

export default function StudyPracticeHubPage() {
    const [query, setQuery] = useState("");
    const [activeTrack, setActiveTrack] = useState("All");
    const deferredQuery = useDeferredValue(query);
    const studyProgress = useStudyProgress();
    const topics = useMemo(() => getAllStudyTopics(), []);
    const studyTracks = useMemo(
        () => ["All", ...Array.from(new Set(topics.map((topic) => getStudyCategoryTrack(topic.category))))],
        [topics]
    );
    const visibleTopics = useMemo(
        () =>
            (deferredQuery.trim() ? searchStudyTopics(deferredQuery) : topics).filter((topic) =>
                activeTrack === "All" ? true : getStudyCategoryTrack(topic.category) === activeTrack
            ),
        [activeTrack, deferredQuery, topics]
    );

    const recentQuizTopics = useMemo(
        () =>
            Object.values(studyProgress.quizzes)
                .sort((left, right) => right.lastCompletedAt - left.lastCompletedAt)
                .slice(0, 4)
                .map((quiz) => topics.find((topic) => topic.id === quiz.topicId))
                .filter((topic): topic is (typeof topics)[number] => Boolean(topic)),
        [studyProgress.quizzes, topics]
    );
    const weakQuizTopics = useMemo(
        () =>
            Object.values(studyProgress.quizzes)
                .map((quiz) => {
                    const topic = topics.find((entry) => entry.id === quiz.topicId);
                    if (!topic) return null;

                    const strongestScore = Math.max(quiz.bestScore, quiz.lastScore);
                    const strongestPercent =
                        quiz.totalQuestions > 0
                            ? (strongestScore / quiz.totalQuestions) * 100
                            : 0;

                    return {
                        topic,
                        strongestPercent,
                        lastPercent:
                            quiz.totalQuestions > 0
                                ? (quiz.lastScore / quiz.totalQuestions) * 100
                                : 0,
                    };
                })
                .filter(
                    (
                        entry
                    ): entry is {
                        topic: StudyTopic;
                        strongestPercent: number;
                        lastPercent: number;
                    } => entry !== null && entry.strongestPercent < 75
                )
                .sort((left, right) => left.strongestPercent - right.strongestPercent)
                .slice(0, 4),
        [studyProgress.quizzes, topics]
    );

    return (
        <div className="app-page-stack">
            <PageBackButton fallbackTo="/study" label="Back to Study Hub" />

            <PageHeader
                badge="Study Hub | Practice"
                title="Practice by topic and review with explanations"
                description="Practice mode keeps quizzes lightweight and topic-aligned. Each set is designed to help you diagnose mistakes, remember procedure, and move back into the lesson when a concept still needs review."
                actions={
                    <Link
                        to="/study"
                        className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                    >
                        Return to Study Hub
                    </Link>
                }
            />

            <GuidedStartPanel
                badge="Quiz flow"
                title="Use quizzes as self-check, not as the first place to learn the topic"
                summary="Practice works best after you already know the basic meaning of the topic. The goal is to confirm understanding, spot weak areas, and return to the lesson only where needed."
                steps={[
                    {
                        title: "Review the lesson first",
                        description:
                            "Open the topic page when the terms or procedure still feel unfamiliar.",
                    },
                    {
                        title: "Take the mini quiz",
                        description:
                            "Use the quiz to check recall, interpretation, and common mistake areas without a long test format.",
                    },
                    {
                        title: "Read the explanations",
                        description:
                            "Wrong answers should send you back to a specific weak spot, not back to the whole topic from the beginning.",
                    },
                ]}
                compact
            />

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <SectionCard>
                    <p className="app-section-kicker text-[0.68rem]">Practice flow</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">1. Read the lesson</p>
                            <p className="app-body-md mt-2 text-sm">
                                Review the topic structure first so the quiz feels like recall, not guessing.
                            </p>
                        </div>
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">2. Take the mini quiz</p>
                            <p className="app-body-md mt-2 text-sm">
                                Each topic uses a short set to keep practice focused and repeatable.
                            </p>
                        </div>
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">3. Review the explanation</p>
                            <p className="app-body-md mt-2 text-sm">
                                Wrong answers come with teaching-focused explanations so you can correct the reasoning, not only the score.
                            </p>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard>
                    <p className="app-section-kicker text-[0.68rem]">Recent quiz activity</p>
                    <div className="mt-4 space-y-3">
                        {(recentQuizTopics.length > 0 ? recentQuizTopics : topics.slice(0, 3)).map(
                            (topic) => {
                                const quizRecord = studyProgress.quizzes[topic.id];

                                return (
                                    <div
                                        key={topic.id}
                                        className="app-subtle-surface rounded-[1rem] px-4 py-3.5"
                                    >
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            {topic.title}
                                        </p>
                                        <p className="app-helper mt-1 text-xs leading-5">
                                            {quizRecord
                                                ? `Best score ${quizRecord.bestScore}/${quizRecord.totalQuestions} across ${quizRecord.attempts} attempt${quizRecord.attempts === 1 ? "" : "s"}.`
                                                : "No quiz attempt yet."}
                                        </p>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </SectionCard>
            </section>

            {weakQuizTopics.length > 0 ? (
                <SectionCard>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="app-section-kicker text-[0.68rem]">Return to weak topics</p>
                            <h2 className="app-section-title mt-2">Practice where scores still slip</h2>
                        </div>
                        <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                            {weakQuizTopics.length} review set{weakQuizTopics.length === 1 ? "" : "s"}
                        </span>
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-2">
                        {weakQuizTopics.map(({ topic, strongestPercent, lastPercent }) => {
                            const firstToolMeta = topic.relatedCalculatorPaths[0]
                                ? getRouteMeta(topic.relatedCalculatorPaths[0])
                                : null;

                            return (
                                <div
                                    key={`weak-${topic.id}`}
                                    className="app-subtle-surface rounded-[1rem] px-4 py-4"
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="app-chip-accent rounded-full px-2.5 py-1 text-[0.62rem]">
                                            {getStudyCategoryTrack(topic.category)}
                                        </span>
                                        <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                            Best {Math.round(strongestPercent)}%
                                        </span>
                                    </div>

                                    <h3 className="mt-3 text-[1rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                        {topic.shortTitle}
                                    </h3>
                                    <p className="app-helper mt-1.5 text-xs leading-5">
                                        Last attempt {Math.round(lastPercent)}%. Revisit the lesson, then retry the quiz while the weak spot is still fresh.
                                    </p>

                                    <div className="app-card-grid-readable--compact mt-4">
                                        <Link
                                            to={buildStudyTopicPath(topic.id)}
                                            className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                                        >
                                            Review lesson
                                        </Link>
                                        <Link
                                            to={buildStudyQuizPath(topic.id)}
                                            className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                                        >
                                            Retry quiz
                                        </Link>
                                        {firstToolMeta ? (
                                            <Link
                                                to={firstToolMeta.path}
                                                className="app-button-ghost rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                                            >
                                                Open {firstToolMeta.shortLabel ?? "tool"}
                                            </Link>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionCard>
            ) : null}

            <section className="space-y-4">
                <div>
                    <p className="app-section-kicker text-[0.68rem]">Available quiz sets</p>
                    <h2 className="app-section-title mt-2">Topic practice library</h2>
                </div>

                <SectionCard>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="app-section-kicker text-[0.68rem]">Find a quiz faster</p>
                            <p className="app-body-md mt-2 text-sm">
                                Narrow the library by track or keyword first so practice stays focused instead of feeling like one long list.
                            </p>
                        </div>
                        <div className="w-full max-w-xl">
                            <label className="sr-only" htmlFor="study-practice-search">
                                Search practice topics
                            </label>
                            <input
                                id="study-practice-search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search quiz topics..."
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

                {visibleTopics.length === 0 ? (
                    <SectionCard>
                        <p className="app-card-title text-sm">No quiz set matches this filter yet</p>
                        <p className="app-body-md mt-2 text-sm">
                            Try a broader track or a different keyword so you can jump back into a closer lesson or quiz set.
                        </p>
                    </SectionCard>
                ) : (
                    <div className="grid gap-4 xl:grid-cols-2">
                        {visibleTopics.map((topic) => {
                            const quizRecord = studyProgress.quizzes[topic.id];
                            const firstToolMeta = topic.relatedCalculatorPaths[0]
                                ? getRouteMeta(topic.relatedCalculatorPaths[0])
                                : null;
                            const linkedToolCount = topic.relatedCalculatorPaths.length;
                            const bestPercent =
                                quizRecord && quizRecord.totalQuestions > 0
                                    ? Math.round(
                                          (quizRecord.bestScore / quizRecord.totalQuestions) * 100
                                      )
                                    : null;

                            return (
                                <SectionCard key={topic.id}>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                            {getStudyCategoryTrack(topic.category)}
                                        </span>
                                        <span className="app-chip-accent rounded-full px-2.5 py-1 text-[0.62rem]">
                                            {topic.quiz.questions.length} questions
                                        </span>
                                    </div>

                                    <h3 className="mt-3 text-[1rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                        {topic.quiz.title}
                                    </h3>
                                    <p className="app-helper mt-1.5 text-xs leading-5">
                                        {topic.quiz.intro}
                                    </p>
                                    <p className="app-helper mt-3 text-xs leading-5">
                                        {linkedToolCount > 0
                                            ? `${linkedToolCount} linked tool${linkedToolCount === 1 ? "" : "s"}${firstToolMeta ? ` · Start with ${firstToolMeta.shortLabel ?? firstToolMeta.label}` : ""}`
                                            : "Lesson-first topic with short practice support."}
                                    </p>

                                    {quizRecord ? (
                                        <div className="app-tone-info mt-4 rounded-[1rem] px-4 py-3.5">
                                            <p className="app-card-title text-sm">Progress so far</p>
                                            <p className="app-body-md mt-2 text-sm">
                                                Last score {quizRecord.lastScore}/{quizRecord.totalQuestions}. Best score {quizRecord.bestScore}/{quizRecord.totalQuestions}{bestPercent !== null ? ` (${bestPercent}%)` : ""}.
                                            </p>
                                        </div>
                                    ) : null}

                                    <div className="app-card-grid-readable--compact mt-4">
                                        <Link
                                            to={buildStudyTopicPath(topic.id)}
                                            className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                                        >
                                            Review lesson
                                        </Link>
                                        <Link
                                            to={buildStudyQuizPath(topic.id)}
                                            className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                                        >
                                            Start practice
                                        </Link>
                                        {firstToolMeta ? (
                                            <Link
                                                to={firstToolMeta.path}
                                                className="app-button-ghost rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                                            >
                                                Open {firstToolMeta.shortLabel ?? "tool"}
                                            </Link>
                                        ) : null}
                                    </div>
                                </SectionCard>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
