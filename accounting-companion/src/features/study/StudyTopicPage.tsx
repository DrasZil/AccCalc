import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import PageBackButton from "../../components/PageBackButton";
import TransitionLink from "../../components/TransitionLink";
import FormulaBlock from "../../components/math/FormulaBlock";
import { getRouteMeta } from "../../utils/appCatalog";
import {
    buildStudyQuizPath,
    buildStudyTopicPath,
    getAdjacentStudyTopics,
    getRelatedStudyTopics,
    getStudyCategoryTrack,
    getStudyTopic,
    getStudyTopicsByTrack,
} from "./studyContent";
import {
    markStudySectionComplete,
    setStudyLastSection,
    setStudyTopicNote,
    toggleStudyBookmark,
    touchStudyTopic,
    useStudyProgress,
} from "../../utils/studyProgress";
import StudyLessonLayout, {
    type StudyLessonOutlineItem,
    useLessonSectionObserver,
} from "./components/StudyLessonLayout";

type LessonSectionProps = {
    id: string;
    title: string;
    summary: string;
    reviewed: boolean;
    onMarkReviewed: () => void;
    children: ReactNode;
};

function LessonSection({
    id,
    title,
    summary,
    reviewed,
    onMarkReviewed,
    children,
}: LessonSectionProps) {
    return (
        <section
            id={id}
            className="app-panel scroll-mt-24 rounded-[1.45rem] px-5 py-5 md:px-6 md:py-6"
        >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                    <p className="app-section-kicker text-[0.68rem]">
                        {reviewed ? "Reviewed section" : "Lesson section"}
                    </p>
                    <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)] md:text-[1.55rem]">
                        {title}
                    </h2>
                    <p className="app-body-md mt-3 text-sm leading-7">{summary}</p>
                </div>

                <button
                    type="button"
                    onClick={onMarkReviewed}
                    className={[
                        "rounded-full px-3.5 py-2 text-xs font-semibold",
                        reviewed ? "app-button-primary" : "app-button-secondary",
                    ].join(" ")}
                >
                    {reviewed ? "Reviewed" : "Mark reviewed"}
                </button>
            </div>

            <div className="mt-6 space-y-5">{children}</div>
        </section>
    );
}

function ReadingCallout({
    tone = "default",
    title,
    children,
}: {
    tone?: "default" | "info" | "warning" | "accent";
    title: string;
        children: ReactNode;
}) {
    const toneClass =
        tone === "info"
            ? "app-tone-info"
            : tone === "warning"
              ? "app-tone-warning"
              : tone === "accent"
                ? "app-tone-accent"
                : "app-subtle-surface";

    return (
        <div className={`${toneClass} rounded-[1.15rem] px-4 py-4`}>
            <p className="text-sm font-semibold text-[color:var(--app-text)]">{title}</p>
            <div className="mt-3 space-y-3 text-sm leading-7">{children}</div>
        </div>
    );
}

function computeDifficultyLabel(sectionCount: number) {
    if (sectionCount >= 7) return "Intermediate";
    if (sectionCount >= 5) return "Core";
    return "Foundation";
}

export default function StudyTopicPage() {
    const { topicId } = useParams();
    const topic = getStudyTopic(topicId);
    const studyProgress = useStudyProgress();
    const [note, setNote] = useState("");
    const [activeSectionId, setActiveSectionId] = useState("overview");

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
        const topicRecord = studyProgress.topics[topic.id];
        setNote(topicRecord?.note ?? "");
        setActiveSectionId(topicRecord?.lastSectionKey ?? "overview");
    }, [studyProgress.topics, topic]);

    const lessonOutline = useMemo<StudyLessonOutlineItem[]>(
        () => [
            {
                id: "overview",
                title: "Overview and chapter framing",
                summary: "What this lesson is about, why it matters, and where it appears.",
            },
            {
                id: "formula",
                title: "Key formulas and glossary",
                summary: "The main equations, variables, and key terms for the topic.",
            },
            {
                id: "procedure",
                title: "Procedure and reviewer logic",
                summary: "The solving sequence and the deeper distinctions worth remembering.",
            },
            {
                id: "worked-example",
                title: "Worked example",
                summary: "A guided example with steps and meaning attached to each move.",
            },
            {
                id: "checkpoint",
                title: "Checkpoint example",
                summary: "A shorter variation to check whether the framework still holds.",
            },
            {
                id: "mistakes",
                title: "Mistakes, traps, and interpretation",
                summary: "Common wrong turns, exam traps, and what the result actually means.",
            },
            {
                id: "practice",
                title: "Practice next and connected tools",
                summary: "What to do next, what to review next, and which tools fit this lesson.",
            },
        ],
        []
    );

    const sectionIds = lessonOutline.map((section) => section.id);
    const topicPath = topic ? `/study/topics/${topic.id}` : "";
    const topicRecord = topic ? studyProgress.topics[topic.id] : undefined;
    const quizRecord = topic ? studyProgress.quizzes[topic.id] : undefined;
    const reviewedSections = new Set(topicRecord?.completedSections ?? []);
    const reviewedCount = lessonOutline.filter((section) =>
        reviewedSections.has(section.id)
    ).length;
    const progressPercent =
        lessonOutline.length === 0 ? 0 : Math.round((reviewedCount / lessonOutline.length) * 100);
    const relatedTopics = useMemo(
        () => (topic ? getRelatedStudyTopics(topic.id) : []),
        [topic]
    );
    const moduleTopics = useMemo(
        () => (topic ? getStudyTopicsByTrack(getStudyCategoryTrack(topic.category)) : []),
        [topic]
    );
    const adjacentTopics = useMemo(
        () => (topic ? getAdjacentStudyTopics(topic.id) : { previousTopic: null, nextTopic: null }),
        [topic]
    );

    const handleSectionVisible = useCallback(
        (sectionId: string) => {
            setActiveSectionId(sectionId);
            if (!topic) return;
            setStudyLastSection({ id: topic.id, path: topicPath, title: topic.title }, sectionId);
        },
        [topic, topicPath]
    );

    useLessonSectionObserver(sectionIds, handleSectionVisible);

    if (!topic) {
        return (
            <div className="app-page-stack">
                <PageBackButton fallbackTo="/study" label="Back to Study Hub" />
                <div className="app-panel app-hero-panel rounded-[1.5rem] p-6">
                    <p className="app-kicker text-xs">Study Hub</p>
                    <h1 className="mt-3 text-3xl font-bold text-[color:var(--app-text)]">
                        Topic not found
                    </h1>
                    <p className="app-body-md mt-3 text-sm">
                        This lesson does not exist in the current study catalog.
                    </p>
                    <TransitionLink
                        to="/study"
                        className="app-button-primary mt-5 inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold"
                    >
                        Return to Study Hub
                    </TransitionLink>
                </div>
            </div>
        );
    }

    const estimatedMinutes = Math.max(
        12,
        topic.procedure.length * 2 + (topic.deepDiveSections?.length ?? 0) * 3
    );
    const progressLabel = `${reviewedCount}/${lessonOutline.length} sections reviewed`;
    const completionLabel =
        progressPercent === 100
            ? "Module complete on this device"
            : topicRecord?.lastSectionKey
              ? `Continue from ${lessonOutline.find((section) => section.id === topicRecord.lastSectionKey)?.title ?? "your last section"}`
              : "Start with the overview section";

    return (
        <div className="app-page-stack">
            <PageBackButton fallbackTo="/study" label="Back to Study Hub" />

            <StudyLessonLayout
                badge={`${getStudyCategoryTrack(topic.category)} textbook mode`}
                title={topic.title}
                summary={topic.summary}
                breadcrumbs={[
                    { label: "Study Hub", path: "/study" },
                    {
                        label: getStudyCategoryTrack(topic.category),
                        path: `/study?track=${encodeURIComponent(getStudyCategoryTrack(topic.category))}`,
                    },
                    { label: topic.shortTitle },
                ]}
                outline={lessonOutline}
                activeSectionId={activeSectionId}
                progressPercent={progressPercent}
                progressLabel={progressLabel}
                difficultyLabel={computeDifficultyLabel(lessonOutline.length)}
                estimatedTimeLabel={`${estimatedMinutes} min`}
                prerequisiteLabel={topic.whenToUse[0]}
                completionLabel={completionLabel}
                headerActions={
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
                            {topicRecord?.bookmarked ? "Bookmarked" : "Bookmark"}
                        </button>
                        <TransitionLink
                            to={buildStudyQuizPath(topic.id)}
                            className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            Practice quiz
                        </TransitionLink>
                    </>
                }
                sidebarTop={
                    <div className="app-panel rounded-[1.35rem] p-4">
                        <p className="app-section-kicker text-[0.68rem]">Current module</p>
                        <h2 className="app-section-title mt-2">
                            {getStudyCategoryTrack(topic.category)} chapter flow
                        </h2>
                        <div className="mt-4 space-y-2">
                            {moduleTopics.slice(0, 8).map((moduleTopic) => (
                                <Link
                                    key={moduleTopic.id}
                                    to={buildStudyTopicPath(moduleTopic.id)}
                                    className={[
                                        "block rounded-[1rem] border px-3.5 py-3 transition",
                                        moduleTopic.id === topic.id
                                            ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] shadow-[var(--app-shadow-sm)]"
                                            : "app-divider hover:border-[color:var(--app-border-strong)]",
                                    ].join(" ")}
                                >
                                    <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                        {moduleTopic.shortTitle}
                                    </p>
                                    <p className="app-helper mt-1 text-xs leading-5">
                                        {moduleTopic.summary}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                }
                sidebarBottom={
                    <div className="space-y-4">
                        <div className="app-panel rounded-[1.35rem] p-4">
                            <p className="app-section-kicker text-[0.68rem]">Continue reading</p>
                            <div className="mt-3 space-y-3">
                                {topicRecord?.lastSectionKey ? (
                                    <a
                                        href={`#${topicRecord.lastSectionKey}`}
                                        className="app-button-secondary block rounded-xl px-4 py-2.5 text-sm font-semibold text-center"
                                    >
                                        Resume last section
                                    </a>
                                ) : null}
                                {adjacentTopics.previousTopic ? (
                                    <TransitionLink
                                        to={buildStudyTopicPath(adjacentTopics.previousTopic.id)}
                                        className="app-list-link block rounded-xl px-4 py-3"
                                    >
                                        <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--app-text-muted)]">
                                            Previous lesson
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                                            {adjacentTopics.previousTopic.title}
                                        </p>
                                    </TransitionLink>
                                ) : null}
                                {adjacentTopics.nextTopic ? (
                                    <TransitionLink
                                        to={buildStudyTopicPath(adjacentTopics.nextTopic.id)}
                                        className="app-list-link block rounded-xl px-4 py-3"
                                    >
                                        <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--app-text-muted)]">
                                            Next lesson
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                                            {adjacentTopics.nextTopic.title}
                                        </p>
                                    </TransitionLink>
                                ) : null}
                            </div>
                        </div>

                        <div className="app-panel rounded-[1.35rem] p-4">
                            <p className="app-section-kicker text-[0.68rem]">Lesson signals</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {topic.keywords.slice(0, 8).map((keyword) => (
                                    <span
                                        key={keyword}
                                        className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                            {quizRecord ? (
                                <p className="app-helper mt-3 text-xs">
                                    Best quiz score:{" "}
                                    {Math.round((quizRecord.bestScore / quizRecord.totalQuestions) * 100)}%
                                </p>
                            ) : null}
                        </div>
                    </div>
                }
            >
                <LessonSection
                    id="overview"
                    title="Overview and chapter framing"
                    summary="Start with the big picture first. This section tells you what the topic is, why it matters, and where it usually appears before you dive into formulas or procedures."
                    reviewed={reviewedSections.has("overview")}
                    onMarkReviewed={() =>
                        markStudySectionComplete(
                            { id: topic.id, path: topicPath, title: topic.title },
                            "overview"
                        )
                    }
                >
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
                        <ReadingCallout title="Topic introduction" tone="info">
                            <p>{topic.intro}</p>
                        </ReadingCallout>
                        <ReadingCallout title="When to open this lesson" tone="accent">
                            <ul className="list-disc space-y-2 pl-5">
                                {topic.whenToUse.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </ReadingCallout>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <ReadingCallout title="Why it matters">
                            <ul className="list-disc space-y-2 pl-5">
                                {topic.whyItMatters.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </ReadingCallout>
                        <ReadingCallout title="Where this appears in class or review">
                            <ul className="list-disc space-y-2 pl-5">
                                {topic.classContexts.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </ReadingCallout>
                    </div>
                </LessonSection>

                <LessonSection
                    id="formula"
                    title="Key formulas and glossary"
                    summary="Use this chapter when you need the exact expressions, variable meanings, and the terms that anchor the lesson."
                    reviewed={reviewedSections.has("formula")}
                    onMarkReviewed={() =>
                        markStudySectionComplete(
                            { id: topic.id, path: topicPath, title: topic.title },
                            "formula"
                        )
                    }
                >
                    <div className="grid gap-4 xl:grid-cols-2">
                        {topic.formulaOverview.map((formula) => (
                            <div
                                key={formula.label}
                                className="app-subtle-surface rounded-[1.15rem] px-4 py-4"
                            >
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    {formula.label}
                                </p>
                                <div className="mt-3">
                                    <FormulaBlock
                                        text={formula.expression}
                                        supportingText={
                                            <p className="app-helper text-xs leading-5">
                                                {formula.explanation}
                                            </p>
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <ReadingCallout title="Glossary and variable meanings">
                        <div className="grid gap-3 md:grid-cols-2">
                            {topic.variableDefinitions.map((variable) => (
                                <div
                                    key={variable.symbol}
                                    className="rounded-[1rem] border app-divider px-3.5 py-3"
                                >
                                    <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                        {variable.symbol}
                                    </p>
                                    <p className="app-helper mt-2 text-xs leading-5">
                                        {variable.meaning}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ReadingCallout>
                </LessonSection>

                <LessonSection
                    id="procedure"
                    title="Procedure and reviewer logic"
                    summary="This section acts like the chapter method. It tells you the order of work, then adds the deeper reviewer distinctions that usually trip students up."
                    reviewed={reviewedSections.has("procedure")}
                    onMarkReviewed={() =>
                        markStudySectionComplete(
                            { id: topic.id, path: topicPath, title: topic.title },
                            "procedure"
                        )
                    }
                >
                    <ReadingCallout title="Main procedure" tone="info">
                        <ol className="list-decimal space-y-2 pl-5">
                            {topic.procedure.map((step) => (
                                <li key={step}>{step}</li>
                            ))}
                        </ol>
                    </ReadingCallout>

                    {topic.deepDiveSections && topic.deepDiveSections.length > 0 ? (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {topic.deepDiveSections.map((section) => (
                                <ReadingCallout
                                    key={section.id}
                                    title={section.title}
                                    tone={section.tone}
                                >
                                    <p className="app-helper text-xs leading-5">
                                        {section.summary}
                                    </p>
                                    <ul className="list-disc space-y-2 pl-5">
                                        {section.points.map((point) => (
                                            <li key={point}>{point}</li>
                                        ))}
                                    </ul>
                                </ReadingCallout>
                            ))}
                        </div>
                    ) : null}
                </LessonSection>

                <LessonSection
                    id="worked-example"
                    title={topic.workedExample.title}
                    summary="Read this like a guided solution in a textbook. The goal is not only to reach the result, but to see why each step belongs in that order."
                    reviewed={reviewedSections.has("worked-example")}
                    onMarkReviewed={() =>
                        markStudySectionComplete(
                            { id: topic.id, path: topicPath, title: topic.title },
                            "worked-example"
                        )
                    }
                >
                    <ReadingCallout title="Scenario" tone="accent">
                        <p>{topic.workedExample.scenario}</p>
                    </ReadingCallout>
                    <ReadingCallout title="Worked steps">
                        <ol className="list-decimal space-y-2 pl-5">
                            {topic.workedExample.steps.map((step) => (
                                <li key={step}>{step}</li>
                            ))}
                        </ol>
                    </ReadingCallout>
                    <ReadingCallout title="Result and interpretation" tone="info">
                        <p>{topic.workedExample.result}</p>
                        <p className="app-helper text-xs leading-6">
                            {topic.workedExample.interpretation}
                        </p>
                    </ReadingCallout>
                </LessonSection>

                <LessonSection
                    id="checkpoint"
                    title={topic.checkpointExample.title}
                    summary="Use the checkpoint as a short chapter-end pause. If the method still makes sense here, the lesson is sticking."
                    reviewed={reviewedSections.has("checkpoint")}
                    onMarkReviewed={() =>
                        markStudySectionComplete(
                            { id: topic.id, path: topicPath, title: topic.title },
                            "checkpoint"
                        )
                    }
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        <ReadingCallout title="Checkpoint setup">
                            <p>{topic.checkpointExample.scenario}</p>
                            <ol className="mt-3 list-decimal space-y-2 pl-5">
                                {topic.checkpointExample.steps.map((step) => (
                                    <li key={step}>{step}</li>
                                ))}
                            </ol>
                        </ReadingCallout>
                        <ReadingCallout title="Checkpoint reading" tone="accent">
                            <p>{topic.checkpointExample.result}</p>
                            <p className="app-helper text-xs leading-6">
                                {topic.checkpointExample.interpretation}
                            </p>
                        </ReadingCallout>
                    </div>
                </LessonSection>

                <LessonSection
                    id="mistakes"
                    title="Mistakes, traps, and interpretation"
                    summary="This chapter is where you slow down. Use it before quizzes or answer checking so recurring errors do not survive into the final result."
                    reviewed={reviewedSections.has("mistakes")}
                    onMarkReviewed={() =>
                        markStudySectionComplete(
                            { id: topic.id, path: topicPath, title: topic.title },
                            "mistakes"
                        )
                    }
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        <ReadingCallout title="Common mistakes" tone="warning">
                            <ul className="list-disc space-y-2 pl-5">
                                {topic.commonMistakes.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </ReadingCallout>
                        <ReadingCallout title="Exam traps">
                            <ul className="list-disc space-y-2 pl-5">
                                {topic.examTraps.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </ReadingCallout>
                    </div>

                    <ReadingCallout title="Interpret the lesson like a reviewer" tone="info">
                        <ul className="list-disc space-y-2 pl-5">
                            {topic.interpretation.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </ReadingCallout>
                </LessonSection>

                <LessonSection
                    id="practice"
                    title="Practice next and connected tools"
                    summary="This final chapter separates practice, notes, related lessons, and related calculators so the page still reads like a module instead of a card wall."
                    reviewed={reviewedSections.has("practice")}
                    onMarkReviewed={() =>
                        markStudySectionComplete(
                            { id: topic.id, path: topicPath, title: topic.title },
                            "practice"
                        )
                    }
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        <ReadingCallout title="Self-check prompts">
                            <ul className="list-disc space-y-2 pl-5">
                                {topic.selfCheck.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </ReadingCallout>
                        <ReadingCallout title="Practice cues" tone="accent">
                            <ul className="list-disc space-y-2 pl-5">
                                {topic.practiceCues.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </ReadingCallout>
                    </div>

                    {topic.nextStepPrompts && topic.nextStepPrompts.length > 0 ? (
                        <ReadingCallout title="What to review next" tone="info">
                            <ul className="list-disc space-y-2 pl-5">
                                {topic.nextStepPrompts.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </ReadingCallout>
                    ) : null}

                    <ReadingCallout title="Local lesson notes">
                        <textarea
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            onBlur={() =>
                                setStudyTopicNote(
                                    { id: topic.id, path: topicPath, title: topic.title },
                                    note
                                )
                            }
                            placeholder="Write a reminder, a trap to avoid, or your own short summary of the topic."
                            className="app-input-shell min-h-28 w-full rounded-[1rem] px-4 py-3 text-sm"
                        />
                        <p className="app-helper text-xs">Notes are saved only on this device.</p>
                    </ReadingCallout>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <ReadingCallout title="Related calculators">
                            <div className="space-y-2">
                                {topic.relatedCalculatorPaths.map((path) => {
                                    const routeMeta = getRouteMeta(path);
                                    return (
                                        <TransitionLink
                                            key={path}
                                            to={path}
                                            className="app-list-link block rounded-xl px-4 py-3"
                                        >
                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                {routeMeta?.shortLabel ?? routeMeta?.label ?? "Open tool"}
                                            </p>
                                            <p className="app-helper mt-1 text-xs leading-5">
                                                {routeMeta?.description}
                                            </p>
                                        </TransitionLink>
                                    );
                                })}
                            </div>
                        </ReadingCallout>

                        <ReadingCallout title="Related lessons">
                            <div className="space-y-2">
                                {relatedTopics.length > 0 ? (
                                    relatedTopics.map((relatedTopic) => (
                                        <TransitionLink
                                            key={relatedTopic.id}
                                            to={buildStudyTopicPath(relatedTopic.id)}
                                            className="app-list-link block rounded-xl px-4 py-3"
                                        >
                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                {relatedTopic.title}
                                            </p>
                                            <p className="app-helper mt-1 text-xs leading-5">
                                                {relatedTopic.summary}
                                            </p>
                                        </TransitionLink>
                                    ))
                                ) : (
                                    <p className="app-helper text-xs leading-5">
                                        This lesson currently acts as a main anchor topic for its area.
                                    </p>
                                )}
                            </div>
                        </ReadingCallout>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        <TransitionLink
                            to={buildStudyQuizPath(topic.id)}
                            className="app-button-primary rounded-xl px-4 py-3 text-sm font-semibold text-center"
                        >
                            Start mini quiz
                        </TransitionLink>
                        {adjacentTopics.previousTopic ? (
                            <TransitionLink
                                to={buildStudyTopicPath(adjacentTopics.previousTopic.id)}
                                className="app-button-secondary rounded-xl px-4 py-3 text-sm font-semibold text-center"
                            >
                                Previous lesson
                            </TransitionLink>
                        ) : (
                            <div className="app-panel rounded-xl px-4 py-3 text-center text-sm text-[color:var(--app-text-muted)]">
                                Start of this module
                            </div>
                        )}
                        {adjacentTopics.nextTopic ? (
                            <TransitionLink
                                to={buildStudyTopicPath(adjacentTopics.nextTopic.id)}
                                className="app-button-secondary rounded-xl px-4 py-3 text-sm font-semibold text-center"
                            >
                                Next lesson
                            </TransitionLink>
                        ) : (
                            <div className="app-panel rounded-xl px-4 py-3 text-center text-sm text-[color:var(--app-text-muted)]">
                                End of current sequence
                            </div>
                        )}
                    </div>
                </LessonSection>
            </StudyLessonLayout>
        </div>
    );
}
