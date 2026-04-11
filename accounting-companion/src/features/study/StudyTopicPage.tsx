import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import { getRouteMeta } from "../../utils/appCatalog";
import {
    buildStudyQuizPath,
    getRelatedStudyTopics,
    getStudyTopic,
} from "./studyContent";
import {
    markStudySectionComplete,
    setStudyTopicNote,
    toggleStudyBookmark,
    touchStudyTopic,
    useStudyProgress,
} from "../../utils/studyProgress";

type TopicSectionCardProps = {
    topicId: string;
    topicPath: string;
    topicTitle: string;
    sectionKey: string;
    title: string;
    children: ReactNode;
    reviewed: boolean;
};

function TopicSectionCard({
    topicId,
    topicPath,
    topicTitle,
    sectionKey,
    title,
    children,
    reviewed,
}: TopicSectionCardProps) {
    return (
        <SectionCard>
            <div className="flex items-start justify-between gap-3">
                <p className="app-card-title text-base">{title}</p>
                <button
                    type="button"
                    onClick={() =>
                        markStudySectionComplete(
                            { id: topicId, path: topicPath, title: topicTitle },
                            sectionKey
                        )
                    }
                    className={[
                        "rounded-full px-3 py-1 text-[0.62rem] font-semibold",
                        reviewed ? "app-button-primary" : "app-button-secondary",
                    ].join(" ")}
                >
                    {reviewed ? "Reviewed" : "Mark reviewed"}
                </button>
            </div>
            <div className="app-reading-content mt-4 space-y-3">{children}</div>
        </SectionCard>
    );
}

export default function StudyTopicPage() {
    const { topicId } = useParams();
    const topic = getStudyTopic(topicId);
    const studyProgress = useStudyProgress();
    const [note, setNote] = useState("");

    useEffect(() => {
        if (!topic) return;
        touchStudyTopic({
            id: topic.id,
            path: `/study/topics/${topic.id}`,
            title: topic.title,
        });
    }, [topic]);

    useEffect(() => {
        if (!topic) return;
        setNote(studyProgress.topics[topic.id]?.note ?? "");
    }, [studyProgress.topics, topic]);

    const relatedTopics = useMemo(
        () => (topic ? getRelatedStudyTopics(topic.id) : []),
        [topic]
    );

    if (!topic) {
        return (
            <div className="app-page-stack">
                <PageHeader
                    badge="Study Hub"
                    title="Topic not found"
                    description="This lesson does not exist in the current study catalog."
                    actions={
                        <Link
                            to="/study"
                            className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            Return to Study Hub
                        </Link>
                    }
                />
            </div>
        );
    }

    const topicPath = `/study/topics/${topic.id}`;
    const topicRecord = studyProgress.topics[topic.id];
    const quizRecord = studyProgress.quizzes[topic.id];
    const reviewedSections = new Set(topicRecord?.completedSections ?? []);
    const progressLabel = `${reviewedSections.size} reviewed`;

    return (
        <div className="app-page-stack">
            <PageHeader
                badge={`${topic.category} | Study Hub`}
                title={topic.title}
                description={topic.summary}
                actions={
                    <>
                        <button
                            type="button"
                            onClick={() =>
                                toggleStudyBookmark({
                                    id: topic.id,
                                    path: topicPath,
                                    title: topic.title,
                                })
                            }
                            className={[
                                "rounded-xl px-4 py-2.5 text-sm font-semibold",
                                topicRecord?.bookmarked
                                    ? "app-button-primary"
                                    : "app-button-secondary",
                            ].join(" ")}
                        >
                            {topicRecord?.bookmarked ? "Bookmarked" : "Bookmark topic"}
                        </button>
                        <Link
                            to={buildStudyQuizPath(topic.id)}
                            className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            Start quiz
                        </Link>
                    </>
                }
                meta={
                    <>
                        <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                            {progressLabel}
                        </span>
                        {quizRecord ? (
                            <span className="app-chip-accent rounded-full px-2.5 py-1 text-[0.62rem]">
                                Best quiz {Math.round((quizRecord.bestScore / quizRecord.totalQuestions) * 100)}%
                            </span>
                        ) : null}
                    </>
                }
            />

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <SectionCard>
                    <p className="app-section-kicker text-[0.68rem]">Topic overview</p>
                    <div className="mt-4 space-y-3">
                        <p className="app-body-md text-sm">{topic.intro}</p>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <p className="app-card-title text-sm">Why it matters</p>
                                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                                    {topic.whyItMatters.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <p className="app-card-title text-sm">Where it appears</p>
                                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                                    {topic.classContexts.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard>
                    <p className="app-section-kicker text-[0.68rem]">Study tools</p>
                    <div className="mt-4 space-y-3">
                        <div className="app-tone-info rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">When to use this topic</p>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                                {topic.whenToUse.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">Local notes</p>
                            <textarea
                                value={note}
                                onChange={(event) => setNote(event.target.value)}
                                onBlur={() =>
                                    setStudyTopicNote(
                                        { id: topic.id, path: topicPath, title: topic.title },
                                        note
                                    )
                                }
                                placeholder="Write a quick reminder, formula note, or mistake to avoid."
                                className="app-input-shell mt-3 min-h-28 w-full rounded-[1rem] px-4 py-3 text-sm"
                            />
                            <p className="app-helper mt-2 text-xs">
                                Notes are stored only on this device.
                            </p>
                        </div>

                        <div className="app-card-grid-readable--compact">
                            {topic.relatedCalculatorPaths.map((path) => {
                                const routeMeta = getRouteMeta(path);
                                return (
                                    <Link
                                        key={path}
                                        to={path}
                                        className="app-list-link rounded-[1rem] px-4 py-3 text-sm font-medium"
                                    >
                                        {routeMeta?.shortLabel ?? routeMeta?.label ?? "Open related calculator"}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </SectionCard>
            </section>

            <TopicSectionCard
                topicId={topic.id}
                topicPath={topicPath}
                topicTitle={topic.title}
                sectionKey="formula"
                title="Formula overview"
                reviewed={reviewedSections.has("formula")}
            >
                <div className="grid gap-3 xl:grid-cols-2">
                    {topic.formulaOverview.map((formula) => (
                        <div
                            key={formula.label}
                            className="app-subtle-surface rounded-[1rem] px-4 py-3.5"
                        >
                            <p className="app-card-title text-sm">{formula.label}</p>
                            <p className="app-reading-content mt-2 text-sm font-semibold">
                                {formula.expression}
                            </p>
                            <p className="app-helper mt-2 text-xs leading-5">
                                {formula.explanation}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-3 xl:grid-cols-2">
                    {topic.variableDefinitions.map((variable) => (
                        <div
                            key={variable.symbol}
                            className="app-tone-accent rounded-[1rem] px-4 py-3.5"
                        >
                            <p className="app-card-title text-sm">{variable.symbol}</p>
                            <p className="app-body-md mt-2 text-sm">{variable.meaning}</p>
                        </div>
                    ))}
                </div>
            </TopicSectionCard>

            <TopicSectionCard
                topicId={topic.id}
                topicPath={topicPath}
                topicTitle={topic.title}
                sectionKey="procedure"
                title="Procedure and solving method"
                reviewed={reviewedSections.has("procedure")}
            >
                <ol className="list-decimal space-y-2 pl-5 text-sm">
                    {topic.procedure.map((step) => (
                        <li key={step}>{step}</li>
                    ))}
                </ol>
            </TopicSectionCard>

            <section className="grid gap-4 xl:grid-cols-2">
                <TopicSectionCard
                    topicId={topic.id}
                    topicPath={topicPath}
                    topicTitle={topic.title}
                    sectionKey="worked-example"
                    title={topic.workedExample.title}
                    reviewed={reviewedSections.has("worked-example")}
                >
                    <p className="text-sm">{topic.workedExample.scenario}</p>
                    <ol className="list-decimal space-y-2 pl-5 text-sm">
                        {topic.workedExample.steps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                    <div className="app-tone-info rounded-[1rem] px-4 py-3.5">
                        <p className="app-card-title text-sm">Result</p>
                        <p className="app-body-md mt-2 text-sm">{topic.workedExample.result}</p>
                        <p className="app-helper mt-2 text-xs leading-5">
                            {topic.workedExample.interpretation}
                        </p>
                    </div>
                </TopicSectionCard>

                <TopicSectionCard
                    topicId={topic.id}
                    topicPath={topicPath}
                    topicTitle={topic.title}
                    sectionKey="checkpoint"
                    title={topic.checkpointExample.title}
                    reviewed={reviewedSections.has("checkpoint")}
                >
                    <p className="text-sm">{topic.checkpointExample.scenario}</p>
                    <ol className="list-decimal space-y-2 pl-5 text-sm">
                        {topic.checkpointExample.steps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                    <div className="app-tone-accent rounded-[1rem] px-4 py-3.5">
                        <p className="app-card-title text-sm">Checkpoint meaning</p>
                        <p className="app-body-md mt-2 text-sm">{topic.checkpointExample.result}</p>
                        <p className="app-helper mt-2 text-xs leading-5">
                            {topic.checkpointExample.interpretation}
                        </p>
                    </div>
                </TopicSectionCard>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                <TopicSectionCard
                    topicId={topic.id}
                    topicPath={topicPath}
                    topicTitle={topic.title}
                    sectionKey="mistakes"
                    title="Common mistakes and exam traps"
                    reviewed={reviewedSections.has("mistakes")}
                >
                    <div className="grid gap-3 lg:grid-cols-2">
                        <div className="app-tone-warning rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">Likely mistakes</p>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                                {topic.commonMistakes.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">Exam traps</p>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                                {topic.examTraps.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </TopicSectionCard>

                <TopicSectionCard
                    topicId={topic.id}
                    topicPath={topicPath}
                    topicTitle={topic.title}
                    sectionKey="interpretation"
                    title="Interpretation, self-check, and practice cues"
                    reviewed={reviewedSections.has("interpretation")}
                >
                    <div className="app-tone-info rounded-[1rem] px-4 py-3.5">
                        <p className="app-card-title text-sm">How to read the result</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            {topic.interpretation.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-2">
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">Self-check prompts</p>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                                {topic.selfCheck.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">Practice cues</p>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                                {topic.practiceCues.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </TopicSectionCard>
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <SectionCard>
                    <p className="app-section-kicker text-[0.68rem]">Practice next</p>
                    <h2 className="app-section-title mt-2">Mini quiz for this topic</h2>
                    <p className="app-body-md mt-2 text-sm">{topic.quiz.intro}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                            to={buildStudyQuizPath(topic.id)}
                            className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            Open {topic.quiz.title}
                        </Link>
                        {quizRecord ? (
                            <span className="app-chip rounded-full px-3 py-1 text-xs">
                                Last score {quizRecord.lastScore}/{quizRecord.totalQuestions}
                            </span>
                        ) : null}
                    </div>
                </SectionCard>

                <SectionCard>
                    <p className="app-section-kicker text-[0.68rem]">Related topics</p>
                    <div className="mt-4 grid gap-3">
                        {relatedTopics.map((relatedTopic) => (
                            <Link
                                key={relatedTopic.id}
                                to={`/study/topics/${relatedTopic.id}`}
                                className="app-link-card rounded-[1rem] px-4 py-3.5"
                            >
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    {relatedTopic.title}
                                </p>
                                <p className="app-helper mt-1 text-xs leading-5">
                                    {relatedTopic.summary}
                                </p>
                            </Link>
                        ))}
                    </div>
                </SectionCard>
            </section>
        </div>
    );
}
