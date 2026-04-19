import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DisclosurePanel from "../../components/DisclosurePanel";
import GuidedStartPanel from "../../components/GuidedStartPanel";
import MathText from "../../components/math/MathText";
import PageBackButton from "../../components/PageBackButton";
import PageHeader from "../../components/PageHeader";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";
import TransitionLink from "../../components/TransitionLink";
import {
    buildStudyTopicPath,
    getStudyTopic,
    isStudyTopicAnswerCorrect,
    type StudyQuizQuestion,
} from "./studyContent";
import { recordStudyQuizAttempt, touchStudyTopic, useStudyProgress } from "../../utils/studyProgress";

type AnswerState = Record<string, string>;

function getDefaultAnswerValue(question: StudyQuizQuestion) {
    if (question.kind === "multiple-choice") return "";
    if (question.kind === "true-false") return "";
    return "";
}

export default function TopicQuizPage() {
    const { topicId } = useParams();
    const topic = getStudyTopic(topicId);
    const studyProgress = useStudyProgress();
    const [answers, setAnswers] = useState<AnswerState>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    const topicPath = topic ? buildStudyTopicPath(topic.id) : "/study";

    useEffect(() => {
        if (!topic) return;
        touchStudyTopic({ id: topic.id, path: topicPath, title: topic.title });
    }, [topic, topicPath]);

    if (!topic) {
        return (
            <div className="app-page-stack">
                <PageHeader
                    badge="Practice"
                    title="Quiz not found"
                    description="This quiz does not exist in the current study catalog."
                    actions={
                        <Link
                            to="/study/practice"
                            className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            Return to practice hub
                        </Link>
                    }
                />
            </div>
        );
    }

    const activeTopic = topic;
    const quizRecord = studyProgress.quizzes[activeTopic.id];

    function handleChange(questionId: string, value: string) {
        setAnswers((current) => ({ ...current, [questionId]: value }));
    }

    function handleSubmit() {
        let nextScore = 0;

        activeTopic.quiz.questions.forEach((question) => {
            const currentValue = answers[question.id] ?? getDefaultAnswerValue(question);
            const normalizedAnswer =
                question.kind === "multiple-choice"
                    ? currentValue === ""
                        ? ""
                        : Number(currentValue)
                    : question.kind === "true-false"
                      ? currentValue === ""
                          ? ""
                          : currentValue === "true"
                      : currentValue;

            if (isStudyTopicAnswerCorrect(question, normalizedAnswer)) {
                nextScore += 1;
            }
        });

        setScore(nextScore);
        setSubmitted(true);
        recordStudyQuizAttempt(
            { id: activeTopic.id, path: topicPath, title: activeTopic.title },
            { score: nextScore, totalQuestions: activeTopic.quiz.questions.length }
        );
    }

    function handleRetake() {
        setSubmitted(false);
        setScore(null);
        setAnswers({});
    }

    return (
        <div className="app-page-stack">
            <PageBackButton fallbackTo={topicPath} label="Back to lesson" />

            <PageHeader
                badge={`${activeTopic.category} | Practice`}
                title={activeTopic.quiz.title}
                description={activeTopic.quiz.intro}
                actions={
                    <>
                        <TransitionLink
                            to={topicPath}
                            className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            Return to lesson
                        </TransitionLink>
                        <button
                            type="button"
                            onClick={submitted ? handleRetake : handleSubmit}
                            className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            {submitted ? "Retake quiz" : "Submit answers"}
                        </button>
                    </>
                }
                meta={
                    quizRecord ? (
                        <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                            Best score {quizRecord.bestScore}/{quizRecord.totalQuestions}
                        </span>
                    ) : null
                }
            />

            <GuidedStartPanel
                badge="Before you submit"
                title="Try your own reasoning first, then use the explanations to correct it"
                summary="These questions are meant to feel like a guided self-check. Answer them first from memory, then open the explanation panels only after you commit to an answer."
                steps={[
                    {
                        title: "Read the question carefully",
                        description:
                            "Focus on what is being asked before scanning the options for familiar words.",
                    },
                    {
                        title: "Choose the best answer on your own",
                        description:
                            "Use the quiz to test recall and interpretation, not to hunt for clues inside the explanations.",
                    },
                    {
                        title: "Review why after submitting",
                        description:
                            "Open the explanation only after submission so the mistake becomes a learning point instead of a guess.",
                    },
                ]}
                compact
            />

            {submitted && score !== null ? (
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">Quiz result</p>
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <div className="app-tone-accent rounded-[1rem] px-4 py-3.5">
                                <p className="app-metric-label">Score</p>
                                <p className="app-metric-value mt-2">
                                    {score}/{activeTopic.quiz.questions.length}
                                </p>
                            </div>
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <p className="app-metric-label">Accuracy</p>
                                <p className="app-metric-value mt-2">
                                    {Math.round((score / activeTopic.quiz.questions.length) * 100)}%
                                </p>
                            </div>
                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <p className="app-metric-label">Study next</p>
                                <p className="app-body-md mt-2 text-sm">
                                    Review explanations below, then return to the lesson if the logic still feels weak.
                                </p>
                            </div>
                        </div>
                    </SectionCard>

                    <RelatedLinksPanel
                        title="Review and revisit"
                        summary="Use the lesson for weak concepts, then return to Study Hub if you want another topic instead of rereading everything here."
                        badge="Next steps"
                        compact
                        showDescriptions
                        defaultOpen
                        items={[
                            {
                                path: topicPath,
                                label: `Return to ${activeTopic.shortTitle} lesson`,
                                description: "Review the explanation, formulas, and worked examples for the questions that still felt weak.",
                            },
                            {
                                path: "/study/practice",
                                label: "Open practice mode",
                                description: "Switch to another short quiz if you want a fresh self-check after this topic.",
                            },
                            {
                                path: "/study",
                                label: "Back to Study Hub",
                                description: "Browse another lesson track without scrolling back through this quiz.",
                            },
                        ]}
                    />
                </div>
            ) : null}

            <section className="space-y-4">
                {activeTopic.quiz.questions.map((question, index) => {
                    const currentValue = answers[question.id] ?? getDefaultAnswerValue(question);
                    const normalizedAnswer =
                        question.kind === "multiple-choice"
                            ? currentValue === ""
                                ? ""
                                : Number(currentValue)
                            : question.kind === "true-false"
                              ? currentValue === ""
                                  ? ""
                                  : currentValue === "true"
                              : currentValue;
                    const isCorrect =
                        submitted && isStudyTopicAnswerCorrect(question, normalizedAnswer);

                    return (
                        <SectionCard key={question.id}>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="app-chip-accent rounded-full px-2.5 py-1 text-[0.62rem]">
                                    Question {index + 1}
                                </span>
                                <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                    {question.kind.replace("-", " ")}
                                </span>
                                {submitted ? (
                                    <span
                                        className={[
                                            "rounded-full px-2.5 py-1 text-[0.62rem] font-semibold",
                                            isCorrect ? "app-button-primary" : "app-tone-warning",
                                        ].join(" ")}
                                    >
                                        {isCorrect ? "Correct" : "Review"}
                                    </span>
                                ) : null}
                            </div>

                            <div className="mt-4 text-sm font-semibold text-[color:var(--app-text)]">
                                <MathText text={question.prompt} renderMode="auto" />
                            </div>

                            {question.kind === "multiple-choice" ? (
                                <div className="mt-4 grid gap-2">
                                    {question.choices.map((choice, choiceIndex) => (
                                        <label
                                            key={`${question.id}-${choice}`}
                                            className="app-list-link flex items-center gap-3 rounded-[1rem] px-4 py-3 text-sm"
                                        >
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value={String(choiceIndex)}
                                                checked={currentValue === String(choiceIndex)}
                                                onChange={(event) =>
                                                    handleChange(question.id, event.target.value)
                                                }
                                            />
                                            <span>{choice}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : null}

                            {question.kind === "true-false" ? (
                                <div className="app-card-grid-readable--compact mt-4">
                                    {[
                                        { value: "true", label: "True" },
                                        { value: "false", label: "False" },
                                    ].map((choice) => (
                                        <label
                                            key={`${question.id}-${choice.value}`}
                                            className="app-list-link flex items-center gap-3 rounded-[1rem] px-4 py-3 text-sm"
                                        >
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value={choice.value}
                                                checked={currentValue === choice.value}
                                                onChange={(event) =>
                                                    handleChange(question.id, event.target.value)
                                                }
                                            />
                                            <span>{choice.label}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : null}

                            {question.kind === "short-answer" ? (
                                <div className="mt-4">
                                    <input
                                        value={currentValue}
                                        onChange={(event) => handleChange(question.id, event.target.value)}
                                        placeholder={question.placeholder ?? "Type your answer"}
                                        className="app-input-shell w-full rounded-[1rem] px-4 py-3 text-sm"
                                    />
                                </div>
                            ) : null}

                            {submitted ? (
                                <DisclosurePanel
                                    title={isCorrect ? "Why this is correct" : "Why this needs review"}
                                    summary="Open the explanation after you have checked your own reasoning first."
                                    defaultOpen
                                    className="mt-4"
                                >
                                    <div
                                        className={[
                                            "rounded-[1rem] px-4 py-3.5",
                                            isCorrect ? "app-tone-info" : "app-tone-warning",
                                        ].join(" ")}
                                    >
                                        <div className="app-body-md text-sm">
                                            <MathText text={question.explanation} renderMode="auto" />
                                        </div>
                                    </div>
                                </DisclosurePanel>
                            ) : null}
                        </SectionCard>
                    );
                })}
            </section>
        </div>
    );
}
