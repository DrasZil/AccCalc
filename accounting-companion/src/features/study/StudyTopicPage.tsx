import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import DisclosurePanel from "../../components/DisclosurePanel";
import GuidedStartPanel from "../../components/GuidedStartPanel";
import PageBackButton from "../../components/PageBackButton";
import PageHeader from "../../components/PageHeader";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";
import TransitionLink from "../../components/TransitionLink";
import FormulaBlock from "../../components/math/FormulaBlock";
import { getRouteMeta } from "../../utils/appCatalog";
import {
    buildStudyQuizPath,
    buildStudyTopicPath,
    getRelatedStudyTopics,
    getStudyCategoryTrack,
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
    summary?: string;
    defaultOpen?: boolean;
    children: ReactNode;
    reviewed: boolean;
};

function getDeepDiveToneClass(tone: "default" | "info" | "warning" | "accent" = "default") {
    if (tone === "info") return "app-tone-info";
    if (tone === "warning") return "app-tone-warning";
    if (tone === "accent") return "app-tone-accent";
    return "app-subtle-surface";
}

function TopicSectionCard({
    topicId,
    topicPath,
    topicTitle,
    sectionKey,
    title,
    summary,
    defaultOpen = false,
    children,
    reviewed,
}: TopicSectionCardProps) {
    return (
        <DisclosurePanel
            title={title}
            summary={summary}
            defaultOpen={defaultOpen}
            badge={reviewed ? "Reviewed" : "Lesson"}
            headerActions={
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        markStudySectionComplete(
                            { id: topicId, path: topicPath, title: topicTitle },
                            sectionKey
                        );
                    }}
                    className={[
                        "rounded-full px-3 py-1 text-[0.62rem] font-semibold",
                        reviewed ? "app-button-primary" : "app-button-secondary",
                    ].join(" ")}
                >
                    {reviewed ? "Reviewed" : "Mark reviewed"}
                </button>
            }
        >
            <div className="app-reading-content space-y-3">{children}</div>
        </DisclosurePanel>
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
            <PageBackButton fallbackTo="/study" label="Back to Study Hub" />

            <PageHeader
                badge={`${getStudyCategoryTrack(topic.category)} | Study Hub`}
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
                        <TransitionLink
                            to={buildStudyQuizPath(topic.id)}
                            className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            Start quiz
                        </TransitionLink>
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

            <GuidedStartPanel
                badge="Lesson flow"
                title="Start with the big picture, then open the deeper panels only when needed"
                summary="This lesson is intentionally layered so beginners do not have to read everything at once. Use the overview first, then move into formulas, procedure, mistakes, and practice only as needed."
                steps={[
                    {
                        title: "Read the overview first",
                        description:
                            "Start with what the topic means, why it matters, and where it usually appears in class.",
                    },
                    {
                        title: "Open formulas and procedure next",
                        description:
                            "Use the method sections only after the big picture already makes sense in plain language.",
                    },
                    {
                        title: "Finish with mistakes and quiz",
                        description:
                            "Use the self-check prompts, common traps, and mini quiz to see whether the topic is actually sticking.",
                    },
                ]}
                compact
            />

            <section className="app-study-layout">
                <TopicSectionCard
                    topicId={topic.id}
                    topicPath={topicPath}
                    topicTitle={topic.title}
                    sectionKey="overview"
                    title="Topic overview"
                    summary="Keep the big picture visible first, then open the detail panels only when you need them."
                    defaultOpen
                    reviewed={reviewedSections.has("overview")}
                >
                    <p className="app-body-md text-sm">{topic.intro}</p>
                    <DisclosurePanel
                        title="Why it matters"
                        summary="Use this for the high-value reasons the topic shows up in class, review, and practical interpretation."
                        defaultOpen
                        compact
                    >
                        <ul className="list-disc space-y-2 pl-5 text-sm">
                            {topic.whyItMatters.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </DisclosurePanel>
                    <DisclosurePanel
                        title="Where it appears"
                        summary="Open this for board-review, class, and case contexts where the topic commonly appears."
                        compact
                    >
                        <ul className="list-disc space-y-2 pl-5 text-sm">
                            {topic.classContexts.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </DisclosurePanel>
                </TopicSectionCard>

                <TopicSectionCard
                    topicId={topic.id}
                    topicPath={topicPath}
                    topicTitle={topic.title}
                    sectionKey="study-tools"
                    title="Study tools and next steps"
                    summary="Use this as the guidance layer: when to open the topic, where to go next, and what local reminders to keep."
                    defaultOpen
                    reviewed={reviewedSections.has("study-tools")}
                >
                    <DisclosurePanel
                        title="When to use this topic"
                        summary="Open this when you need the right route before choosing a calculator or quiz."
                        defaultOpen
                        compact
                    >
                        <div className="app-tone-info rounded-[1rem] px-4 py-3.5">
                            <ul className="list-disc space-y-2 pl-5 text-sm">
                                {topic.whenToUse.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </DisclosurePanel>

                    {topic.nextStepPrompts && topic.nextStepPrompts.length > 0 ? (
                        <DisclosurePanel
                            title="What to review next"
                            summary="Use these prompts when the topic is clear but you still need the next review move."
                            compact
                        >
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <ul className="list-disc space-y-2 pl-5 text-sm">
                                    {topic.nextStepPrompts.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </DisclosurePanel>
                    ) : null}

                    <DisclosurePanel
                        title="Local notes"
                        summary="Keep short reminders, formula cautions, or mistakes to avoid on this device only."
                        compact
                    >
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
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
                                className="app-input-shell min-h-28 w-full rounded-[1rem] px-4 py-3 text-sm"
                            />
                            <p className="app-helper mt-2 text-xs">
                                Notes are stored only on this device.
                            </p>
                        </div>
                    </DisclosurePanel>

                    <RelatedLinksPanel
                        title="Study next"
                        summary="Move from this lesson into practice, a nearby lesson, or the most relevant calculator without losing the study flow."
                        badge={`${Math.min(1 + relatedTopics.length, 4)} study moves`}
                        items={[
                            {
                                path: buildStudyQuizPath(topic.id),
                                label: `${topic.shortTitle} practice`,
                                description: topic.quiz.intro,
                            },
                            ...relatedTopics.slice(0, 3).map((relatedTopic) => ({
                                path: buildStudyTopicPath(relatedTopic.id),
                                label: relatedTopic.title,
                                description: relatedTopic.summary,
                            })),
                        ]}
                        compact
                        showDescriptions
                    />

                    <RelatedLinksPanel
                        title="Related calculators"
                        summary="Keep calculator follow-ups tucked away until you need the exact workspace for this topic."
                        badge={`${topic.relatedCalculatorPaths.length} tools`}
                        items={topic.relatedCalculatorPaths.map((path) => {
                            const routeMeta = getRouteMeta(path);
                            return {
                                path,
                                label:
                                    routeMeta?.shortLabel ??
                                    routeMeta?.label ??
                                    "Open related calculator",
                                description: routeMeta?.description,
                            };
                        })}
                        compact
                    />
                </TopicSectionCard>
            </section>

            <TopicSectionCard
                topicId={topic.id}
                topicPath={topicPath}
                topicTitle={topic.title}
                sectionKey="formula"
                title="Formula overview"
                summary="Open the key equations, variable meaning, and what each formula is actually measuring."
                reviewed={reviewedSections.has("formula")}
            >
                <DisclosurePanel
                    title="Key formulas and review structures"
                    summary="Open the formula cards when you need the exact expression, structure, or measurement focus."
                    defaultOpen
                    compact
                >
                    <div className="grid gap-3 xl:grid-cols-2">
                        {topic.formulaOverview.map((formula) => (
                            <div
                                key={formula.label}
                                className="app-subtle-surface rounded-[1rem] px-4 py-3.5"
                            >
                                <p className="app-card-title text-sm">{formula.label}</p>
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
                </DisclosurePanel>

                <DisclosurePanel
                    title="Variable meanings"
                    summary="Use this when symbols or labels are familiar but their role in the topic is still fuzzy."
                    compact
                >
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
                </DisclosurePanel>
            </TopicSectionCard>

            <TopicSectionCard
                topicId={topic.id}
                topicPath={topicPath}
                topicTitle={topic.title}
                sectionKey="procedure"
                title="Procedure and solving method"
                summary="Use this when you need the order of operations, not just the final formula."
                reviewed={reviewedSections.has("procedure")}
            >
                <DisclosurePanel
                    title="Main procedure"
                    summary="Open the solving order when you want the cleanest sequence before applying details."
                    defaultOpen
                    compact
                >
                    <ol className="list-decimal space-y-2 pl-5 text-sm">
                        {topic.procedure.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                </DisclosurePanel>

                {topic.deepDiveSections && topic.deepDiveSections.length > 0 ? (
                    <DisclosurePanel
                        title="Deep-dive reviewer panels"
                        summary="Use these narrower panels for the detailed rules, exceptions, and board-review distinctions that do not need to stay open all the time."
                        compact
                    >
                        <div className="grid gap-3 xl:grid-cols-2">
                            {topic.deepDiveSections.map((section) => (
                                <DisclosurePanel
                                    key={section.id}
                                    title={section.title}
                                    summary={section.summary}
                                    compact
                                >
                                    <div className={`${getDeepDiveToneClass(section.tone)} rounded-[1rem] px-4 py-3.5`}>
                                        <ul className="list-disc space-y-2 pl-5 text-sm">
                                            {section.points.map((point) => (
                                                <li key={point}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </DisclosurePanel>
                            ))}
                        </div>
                    </DisclosurePanel>
                ) : null}
            </TopicSectionCard>

            <section className="app-card-grid-readable">
                <TopicSectionCard
                    topicId={topic.id}
                    topicPath={topicPath}
                    topicTitle={topic.title}
                    sectionKey="worked-example"
                    title={topic.workedExample.title}
                    summary="A full worked example for the topic, with the reasoning attached to each step."
                    reviewed={reviewedSections.has("worked-example")}
                >
                    <DisclosurePanel
                        title="Scenario and steps"
                        summary="Open this to walk through the full fact pattern and the recommended solving sequence."
                        defaultOpen
                        compact
                    >
                        <p className="text-sm">{topic.workedExample.scenario}</p>
                        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
                            {topic.workedExample.steps.map((step) => (
                                <li key={step}>{step}</li>
                            ))}
                        </ol>
                    </DisclosurePanel>
                    <DisclosurePanel
                        title="Worked interpretation"
                        summary="Keep the result and its meaning tucked away until you want to compare your own reading."
                        compact
                    >
                        <div className="app-tone-info rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">Result</p>
                            <p className="app-body-md mt-2 text-sm">{topic.workedExample.result}</p>
                            <p className="app-helper mt-2 text-xs leading-5">
                                {topic.workedExample.interpretation}
                            </p>
                        </div>
                    </DisclosurePanel>
                </TopicSectionCard>

                <TopicSectionCard
                    topicId={topic.id}
                    topicPath={topicPath}
                    topicTitle={topic.title}
                    sectionKey="checkpoint"
                    title={topic.checkpointExample.title}
                    summary="A shorter checkpoint example to confirm whether the method still holds with different numbers."
                    reviewed={reviewedSections.has("checkpoint")}
                >
                    <DisclosurePanel
                        title="Checkpoint setup"
                        summary="Open this for the shorter variation that tests whether the method still holds."
                        defaultOpen
                        compact
                    >
                        <p className="text-sm">{topic.checkpointExample.scenario}</p>
                        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
                            {topic.checkpointExample.steps.map((step) => (
                                <li key={step}>{step}</li>
                            ))}
                        </ol>
                    </DisclosurePanel>
                    <DisclosurePanel
                        title="Checkpoint meaning"
                        summary="Use this to compare your checkpoint interpretation after you have tried it yourself."
                        compact
                    >
                        <div className="app-tone-accent rounded-[1rem] px-4 py-3.5">
                            <p className="app-card-title text-sm">Checkpoint meaning</p>
                            <p className="app-body-md mt-2 text-sm">{topic.checkpointExample.result}</p>
                            <p className="app-helper mt-2 text-xs leading-5">
                                {topic.checkpointExample.interpretation}
                            </p>
                        </div>
                    </DisclosurePanel>
                </TopicSectionCard>
            </section>

            <section className="app-card-grid-readable">
                <TopicSectionCard
                    topicId={topic.id}
                    topicPath={topicPath}
                    topicTitle={topic.title}
                    sectionKey="mistakes"
                    title="Common mistakes and exam traps"
                    summary="Use this before quizzes or answer-checking so recurring errors do not survive into the final result."
                    reviewed={reviewedSections.has("mistakes")}
                >
                    <div className="grid gap-3 lg:grid-cols-2">
                        <DisclosurePanel
                            title="Likely mistakes"
                            summary="Open this before solving if you want the fastest way to avoid the most common wrong turns."
                            defaultOpen
                            compact
                        >
                            <div className="app-tone-warning rounded-[1rem] px-4 py-3.5">
                                <ul className="list-disc space-y-2 pl-5 text-sm">
                                    {topic.commonMistakes.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </DisclosurePanel>
                        <DisclosurePanel
                            title="Exam traps"
                            summary="Use this for the misleading clues or framing tricks that often appear in quizzes and review sets."
                            compact
                        >
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <ul className="list-disc space-y-2 pl-5 text-sm">
                                    {topic.examTraps.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </DisclosurePanel>
                    </div>
                </TopicSectionCard>

                <TopicSectionCard
                    topicId={topic.id}
                    topicPath={topicPath}
                    topicTitle={topic.title}
                    sectionKey="interpretation"
                    title="Interpretation, self-check, and practice cues"
                    summary="Keep the meaning first, then open the self-check and practice prompts when you want active review."
                    reviewed={reviewedSections.has("interpretation")}
                >
                    <DisclosurePanel
                        title="How to read the result"
                        summary="Open this when you want the meaning and consequence before you move into self-check or quiz mode."
                        defaultOpen
                        compact
                    >
                        <div className="app-tone-info rounded-[1rem] px-4 py-3.5">
                            <ul className="list-disc space-y-2 pl-5 text-sm">
                                {topic.interpretation.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </DisclosurePanel>
                    <div className="grid gap-3 lg:grid-cols-2">
                        <DisclosurePanel
                            title="Self-check prompts"
                            summary="Use these questions when you want to actively recall the lesson without opening the quiz yet."
                            compact
                        >
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <ul className="list-disc space-y-2 pl-5 text-sm">
                                    {topic.selfCheck.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </DisclosurePanel>
                        <DisclosurePanel
                            title="Practice cues"
                            summary="Open this when you want a quick prompt for oral review, flashcard use, or written practice."
                            compact
                        >
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <ul className="list-disc space-y-2 pl-5 text-sm">
                                    {topic.practiceCues.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </DisclosurePanel>
                    </div>
                </TopicSectionCard>
            </section>

            <section className="app-card-grid-readable">
                <SectionCard>
                    <p className="app-section-kicker text-[0.68rem]">Practice next</p>
                    <h2 className="app-section-title mt-2">Mini quiz for this topic</h2>
                    <p className="app-body-md mt-2 text-sm">{topic.quiz.intro}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <TransitionLink
                            to={buildStudyQuizPath(topic.id)}
                            className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            Open {topic.quiz.title}
                        </TransitionLink>
                        {quizRecord ? (
                            <span className="app-chip rounded-full px-3 py-1 text-xs">
                                Last score {quizRecord.lastScore}/{quizRecord.totalQuestions}
                            </span>
                        ) : null}
                    </div>
                </SectionCard>

                <RelatedLinksPanel
                    title="Related topics"
                    summary="Open connected lessons only when you want the next concept bridge or review path."
                    badge={`${relatedTopics.length} topics`}
                    items={relatedTopics.map((relatedTopic) => ({
                        path: `/study/topics/${relatedTopic.id}`,
                        label: relatedTopic.title,
                        description: relatedTopic.summary,
                    }))}
                    showDescriptions
                />
            </section>
        </div>
    );
}
