import { useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import {
    buildStudyQuizPath,
    buildStudyTopicPath,
    getAllStudyTopics,
} from "./studyContent";
import { useStudyProgress } from "../../utils/studyProgress";

export default function StudyPracticeHubPage() {
    const studyProgress = useStudyProgress();
    const topics = useMemo(() => getAllStudyTopics(), []);

    const recentQuizTopics = useMemo(
        () =>
            Object.values(studyProgress.quizzes)
                .sort((left, right) => right.lastCompletedAt - left.lastCompletedAt)
                .slice(0, 4)
                .map((quiz) => topics.find((topic) => topic.id === quiz.topicId))
                .filter((topic): topic is (typeof topics)[number] => Boolean(topic)),
        [studyProgress.quizzes, topics]
    );

    return (
        <div className="app-page-stack">
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

            <section className="space-y-4">
                <div>
                    <p className="app-section-kicker text-[0.68rem]">Available quiz sets</p>
                    <h2 className="app-section-title mt-2">Topic practice library</h2>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    {topics.map((topic) => {
                        const quizRecord = studyProgress.quizzes[topic.id];

                        return (
                            <SectionCard key={topic.id}>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                        {topic.category}
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

                                {quizRecord ? (
                                    <div className="app-tone-info mt-4 rounded-[1rem] px-4 py-3.5">
                                        <p className="app-card-title text-sm">Progress so far</p>
                                        <p className="app-body-md mt-2 text-sm">
                                            Last score {quizRecord.lastScore}/{quizRecord.totalQuestions}. Best score {quizRecord.bestScore}/{quizRecord.totalQuestions}.
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
                                </div>
                            </SectionCard>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
