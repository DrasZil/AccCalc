import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import SupportAccCalcSection from "../settings/components/SupportAccCalcSection";

const FOCUS_AREAS = [
    {
        label: "Solve problems",
        text: "Open a calculator, workspace, or scan workflow when you need a clean answer path instead of rebuilding the setup from scratch.",
    },
    {
        label: "Check answers",
        text: "Use AccCalc to verify whether a result is reasonable, whether the setup matches the problem, and whether the final value still makes sense after review.",
    },
    {
        label: "Learn independently",
        text: "Read full topic lessons, formulas, worked examples, mistake checks, and study guidance so the answer becomes understandable instead of just visible.",
    },
    {
        label: "Practice on purpose",
        text: "Use short topic quizzes and self-check prompts to confirm whether you actually understand the concept before moving on.",
    },
];

export default function AboutPage() {
    return (
        <div className="app-page-stack">
            <PageHeader
                badge="Settings / About"
                title="AccCalc is built for solving, checking, and learning"
                description="AccCalc is a free solve-check-learn workspace for students. It helps users solve problems, verify answers, study topics in depth, practice with quizzes, and understand procedures without encouraging blind dependence."
            />

            <SectionCard>
                <div className="space-y-4">
                    <p className="app-body-md text-sm md:text-base">
                        AccCalc exists because many students do not only need a number. They need help deciding which tool fits the problem, checking whether an answer is believable, understanding why a formula or procedure works, and now studying the topic more fully when a short calculator hint is not enough.
                    </p>
                    <p className="app-body-md text-sm md:text-base">
                        The app is designed to support accounting, finance, business, economics, and related classroom workflows with calculators, Scan & Check, Smart Solver, a structured Study Hub, worked examples, self-check prompts, and short topic quizzes that stay free to use.
                    </p>
                    <p className="app-body-md text-sm md:text-base">
                        AccCalc should support learning, not replace thinking. The best use of the app is to solve carefully, verify inputs and outputs, and use the lessons and practice mode to understand the procedure deeply enough to work without the app when needed.
                    </p>
                </div>
            </SectionCard>

            <SectionCard>
                <p className="app-section-kicker text-[0.68rem]">Core focus</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {FOCUS_AREAS.map((area) => (
                        <div
                            key={area.label}
                            className="app-subtle-surface rounded-[1.15rem] px-4 py-4"
                        >
                            <p className="app-card-title text-sm">{area.label}</p>
                            <p className="app-body-md mt-2 text-sm">{area.text}</p>
                        </div>
                    ))}
                </div>
            </SectionCard>

            <SectionCard>
                <p className="app-section-kicker text-[0.68rem]">How to use it well</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="app-tone-info rounded-[1.15rem] px-4 py-4">
                        <p className="app-card-title text-sm">Use AccCalc when</p>
                        <div className="app-reading-content mt-2 space-y-2 text-sm">
                            <p>You need to solve faster without losing procedural clarity.</p>
                            <p>You want to fact-check your own answer before submitting or studying.</p>
                            <p>You need a cleaner explanation of variables, formulas, interpretation, or a full lesson page before you continue.</p>
                        </div>
                    </div>
                    <div className="app-tone-warning rounded-[1.15rem] px-4 py-4">
                        <p className="app-card-title text-sm">Avoid over-relying when</p>
                        <div className="app-reading-content mt-2 space-y-2 text-sm">
                            <p>You have not checked whether the inputs or scanned values are correct.</p>
                            <p>The problem depends on a method choice that still needs judgment.</p>
                            <p>You are about to copy a result without reading what it actually means or without checking the related topic lesson.</p>
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard>
                <p className="app-section-kicker text-[0.68rem]">Curriculum and practice</p>
                <div className="mt-3 space-y-3">
                    <p className="app-body-md text-sm md:text-base">
                        AccCalc is shaped around course-relevant procedures: not just formulas, but the logic students are expected to explain in accounting, managerial decision making, process costing, partnership topics, ratio analysis, capital budgeting, entrepreneurship, and related business subjects.
                    </p>
                    <p className="app-body-md text-sm md:text-base">
                        The goal is not to sound advanced while skipping procedure. The goal is to make the procedure clearer, the output easier to verify, the topic easier to study, and the connection between calculation, interpretation, and practice stronger.
                    </p>
                </div>
            </SectionCard>

            <SupportAccCalcSection compact />
        </div>
    );
}
