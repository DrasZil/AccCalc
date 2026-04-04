import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import {
    ACCOUNT_REFERENCE_DATA,
    type AccountReference,
    type NormalBalance,
} from "../../utils/accountingReference";

function buildDeck() {
    const deck = [...ACCOUNT_REFERENCE_DATA];

    for (let index = deck.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
    }

    return deck;
}

type ScoreState = {
    correct: number;
    answered: number;
    streak: number;
    bestStreak: number;
};

const INITIAL_SCORE: ScoreState = {
    correct: 0,
    answered: 0,
    streak: 0,
    bestStreak: 0,
};

export default function DebitCreditTrainerPage() {
    const [deck, setDeck] = useState<AccountReference[]>(() => buildDeck());
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<NormalBalance | null>(null);
    const [score, setScore] = useState<ScoreState>(INITIAL_SCORE);

    const currentQuestion = deck[questionIndex % deck.length];
    const isAnswered = selectedAnswer !== null;
    const isCorrect = selectedAnswer === currentQuestion.normalBalance;
    const accuracy =
        score.answered > 0 ? ((score.correct / score.answered) * 100).toFixed(1) : "0.0";

    const quickRule = useMemo(() => {
        if (currentQuestion.type === "Asset" || currentQuestion.type === "Expense") {
            return "Assets and expenses normally increase on the debit side.";
        }

        if (
            currentQuestion.type === "Liability" ||
            currentQuestion.type === "Equity" ||
            currentQuestion.type === "Revenue"
        ) {
            return "Liabilities, equity, and revenue normally increase on the credit side.";
        }

        return "Contra accounts usually carry the opposite normal balance of the related account.";
    }, [currentQuestion.type]);

    function handleAnswer(answer: NormalBalance) {
        if (isAnswered) return;

        const correct = answer === currentQuestion.normalBalance;
        setSelectedAnswer(answer);
        setScore((previous) => {
            const nextStreak = correct ? previous.streak + 1 : 0;

            return {
                correct: previous.correct + (correct ? 1 : 0),
                answered: previous.answered + 1,
                streak: nextStreak,
                bestStreak: Math.max(previous.bestStreak, nextStreak),
            };
        });
    }

    function handleNext() {
        const nextIndex = questionIndex + 1;
        setSelectedAnswer(null);

        if (nextIndex >= deck.length) {
            setDeck(buildDeck());
            setQuestionIndex(0);
            return;
        }

        setQuestionIndex(nextIndex);
    }

    function handleReset() {
        setDeck(buildDeck());
        setQuestionIndex(0);
        setSelectedAnswer(null);
        setScore(INITIAL_SCORE);
    }

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Debit and Credit Trainer"
            description="Practice normal balances for common accounts and get immediate explanations after each answer."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.16em] text-gray-400">
                                    Current account
                                </p>
                                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                                    {currentQuestion.name}
                                </h2>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300">
                                    What is the normal balance of this account?
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                            >
                                New deck
                            </button>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {(["Debit", "Credit"] as const).map((answer) => {
                                const showState = isAnswered;
                                const buttonIsCorrect = answer === currentQuestion.normalBalance;
                                const buttonWasSelected = answer === selectedAnswer;

                                const className = showState
                                    ? buttonIsCorrect
                                        ? "border-green-400/20 bg-green-500/12 text-green-100"
                                        : buttonWasSelected
                                          ? "border-red-400/20 bg-red-500/12 text-red-100"
                                          : "border-white/10 bg-white/[0.03] text-gray-400"
                                    : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]";

                                return (
                                    <button
                                        key={answer}
                                        type="button"
                                        onClick={() => handleAnswer(answer)}
                                        className={`rounded-[1.4rem] border px-5 py-5 text-left transition ${className}`}
                                    >
                                        <p className="text-lg font-semibold">{answer}</p>
                                        <p className="mt-2 text-sm leading-6">
                                            {answer === "Debit"
                                                ? "Choose this when the account normally increases on the debit side."
                                                : "Choose this when the account normally increases on the credit side."}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        {isAnswered ? (
                            <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-black/[0.18] px-5 py-4">
                                <p className="text-sm font-medium uppercase tracking-[0.16em] text-gray-400">
                                    Feedback
                                </p>
                                <p
                                    className={`mt-3 text-lg font-semibold ${isCorrect ? "text-green-300" : "text-red-300"}`}
                                >
                                    {isCorrect ? "Correct" : "Not quite"}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-gray-300">
                                    {currentQuestion.name} is a {currentQuestion.type.toLowerCase()} account with a normal{" "}
                                    {currentQuestion.normalBalance.toLowerCase()} balance.
                                </p>
                                <p className="mt-2 text-sm leading-6 text-gray-400">
                                    {currentQuestion.note}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="mt-4 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-green-400"
                                >
                                    Next question
                                </button>
                            </div>
                        ) : null}
                    </SectionCard>
                </div>
            }
            resultSection={
                <ResultGrid columns={4}>
                    <ResultCard title="Correct" value={String(score.correct)} />
                    <ResultCard title="Answered" value={String(score.answered)} />
                    <ResultCard title="Accuracy" value={`${accuracy}%`} />
                    <ResultCard title="Best Streak" value={String(score.bestStreak)} />
                </ResultGrid>
            }
            explanationSection={
                <SectionCard>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-gray-400">
                        Study rule
                    </p>
                    <p className="mt-3 text-sm leading-6 text-gray-200">{quickRule}</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/[0.08] bg-black/[0.16] px-4 py-4">
                            <p className="text-sm font-semibold text-white">Account type</p>
                            <p className="mt-2 text-sm leading-6 text-gray-300">
                                {currentQuestion.type}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/[0.08] bg-black/[0.16] px-4 py-4">
                            <p className="text-sm font-semibold text-white">Statement</p>
                            <p className="mt-2 text-sm leading-6 text-gray-300">
                                {currentQuestion.statement}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/[0.08] bg-black/[0.16] px-4 py-4">
                            <p className="text-sm font-semibold text-white">Section</p>
                            <p className="mt-2 text-sm leading-6 text-gray-300">
                                {currentQuestion.section}
                            </p>
                        </div>
                    </div>
                </SectionCard>
            }
        />
    );
}
