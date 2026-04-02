import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";

export default function AboutPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                badge="About"
                title="Why AccCalc exists"
                description="AccCalc was built to make accounting and business calculations easier to understand, check, and learn."
            />

            <SectionCard>
                <div className="space-y-4 text-sm leading-7 text-gray-300 md:text-base">
                <p>
                    AccCalc started from a simple frustration: I did not like seeing
                    people struggle through calculations that could be made clearer,
                    faster, and less stressful (Personally I am not a business related major tho hehe).
                </p>

                <p>
                    I wanted to build something that could help students and learners
                    check their answers, understand the steps, and feel more confident
                    when solving accounting, finance, and business problems.
                </p>

                <p>
                    This project is still growing, but the goal stays the same: make
                    useful tools that are practical, readable, and genuinely helpful for
                    study and everyday use.
                </p>
                </div>
            </SectionCard>

            <SectionCard>
                <h2 className="text-lg font-semibold text-white">What AccCalc focuses on</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm text-gray-400">Purpose</p>
                    <p className="mt-2 font-semibold text-white">Fact-checking and learning</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm text-gray-400">Approach</p>
                    <p className="mt-2 font-semibold text-white">Step-by-step and readable</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm text-gray-400">Goal</p>
                    <p className="mt-2 font-semibold text-white">Make solving easier</p>
                </div>
                </div>
            </SectionCard>
            </div>
        );
}