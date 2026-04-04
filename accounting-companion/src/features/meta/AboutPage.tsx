import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";

export default function AboutPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                badge="Settings • About"
                title="Why AccCalc exists"
                description="AccCalc was built to make accounting, finance, and business calculations easier to understand, check, and practice."
            />

            <SectionCard>
                <div className="space-y-4 text-sm leading-7 text-gray-300 md:text-base">
                    <p>
                        AccCalc started from a simple problem: many useful accounting
                        calculations are still solved through repetitive manual work even
                        when students mainly need clearer steps, faster checking, and less
                        friction while learning.
                    </p>

                    <p>
                        The app is meant to help users verify answers, understand the
                        formulas behind them, and move between classroom-style problems and
                        more practical calculations without switching tools.
                    </p>

                    <p>
                        The project is still growing, but the direction is consistent:
                        make the interface readable, the logic dependable, and the
                        calculator coverage genuinely useful for Philippine learners and
                        working users.
                    </p>
                </div>
            </SectionCard>

            <SectionCard>
                <h2 className="text-lg font-semibold text-white">What AccCalc focuses on</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-gray-400">Purpose</p>
                        <p className="mt-2 font-semibold text-white">Fact-checking and learning</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-gray-400">Approach</p>
                        <p className="mt-2 font-semibold text-white">Step-by-step and readable</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-gray-400">Goal</p>
                        <p className="mt-2 font-semibold text-white">Make solving easier</p>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
}
