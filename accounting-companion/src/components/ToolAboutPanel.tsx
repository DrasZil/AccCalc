import { Link } from "react-router-dom";
import DisclosurePanel from "./DisclosurePanel";
import type { RouteAvailability, RouteMeta } from "../utils/appCatalog";

type ToolAboutPanelProps = {
    route: RouteMeta;
    availability: RouteAvailability | null;
    relatedRoutes: RouteMeta[];
    compact?: boolean;
    includeDescription?: boolean;
};

type ToolLearningContent = {
    whatItIs: string;
    whatItSolves: string;
    whenToUse: string;
    whyItMatters: string;
    beginnerNote: string;
    practicalNote: string;
    commonMistake: string;
    methodNote?: string;
};

function buildLearningContent(route: RouteMeta): ToolLearningContent {
    const label = route.shortLabel ?? route.label;
    const lowerCategory = route.category.toLowerCase();
    const tagText = `${route.tags.join(" ")} ${route.keywords.join(" ")}`.toLowerCase();

    const fallback: ToolLearningContent = {
        whatItIs: `${label} is a ${lowerCategory} tool inside AccCalc's ${route.subtopic.toLowerCase()} workflow.`,
        whatItSolves: route.description,
        whenToUse: `Use this tool when you need a quick, structured answer for a ${route.subtopic.toLowerCase()} problem instead of building the formula manually.`,
        whyItMatters:
            route.category === "Accounting"
                ? "It helps turn classroom formulas and working-paper logic into a clearer answer you can interpret before posting, comparing, or reviewing the result."
                : route.category === "Finance"
                  ? "It helps connect the numeric answer to a time-value, lending, or investment decision instead of leaving the result as an isolated figure."
                  : route.category === "Economics"
                    ? "It helps explain how quantities, prices, incentives, or rates move together so the answer means something beyond one computed number."
                    : route.category === "Entrepreneurship"
                      ? "It helps connect the result to pricing, planning, feasibility, or cash decisions that matter in a real small-business setting."
                      : "It helps connect the answer to an actual decision, interpretation, or next step instead of leaving it as raw output only.",
        beginnerNote:
            "Start by identifying what each input stands for before typing values. If the wording in your problem is messy, translate it into the variables shown here one line at a time.",
        practicalNote:
            "After calculating, compare the answer with the assumptions shown on the page and with any related workflow tools listed below before using it in a report or assignment.",
        commonMistake:
            "A common mistake is mixing incompatible inputs, percentages, or periods. Double-check units, time basis, and whether the problem uses totals, per-unit values, or averages.",
    };

    if (tagText.includes("ratio")) {
        return {
            ...fallback,
            whatItIs: `${label} is a ratio-analysis tool that turns accounting balances into a fast measure of condition or performance.`,
            whenToUse:
                "Use it when you need to evaluate liquidity, turnover, leverage, or profitability from financial statement data.",
            commonMistake:
                "The most common mistake is pairing end-of-period balances with ratios that should use averages, or mixing net figures with gross figures from a different period.",
        };
    }

    if (tagText.includes("budget") || tagText.includes("forecast")) {
        return {
            ...fallback,
            whatItIs: `${label} is a planning tool that organizes expected cash, cost, sales, or operating behavior into a decision-ready view.`,
            whenToUse:
                "Use it when you need to plan ahead, compare scenarios, or prepare a structured schedule for class, review, or practical decision support.",
            practicalNote:
                "Budget-style outputs are most useful when you compare them with actual results or with a second scenario instead of reading one plan in isolation.",
            commonMistake:
                "Do not mix one-time items with recurring activity unless the method explicitly calls for it. Budget inputs should follow the same period and planning assumptions.",
        };
    }

    if (tagText.includes("depreciation") || tagText.includes("inventory") || tagText.includes("valuation")) {
        return {
            ...fallback,
            whatItIs: `${label} is a valuation-focused tool that helps measure cost allocation, carrying amount, or inventory-related effects using a specific method.`,
            whenToUse:
                "Use it when a problem asks for carrying values, periodic expense recognition, cost flow effects, or inventory-related adjustments.",
            methodNote:
                "If the page offers more than one valid method, keep the chosen method consistent with the problem statement, class treatment, or reporting context before comparing answers.",
            commonMistake:
                "The most common mistake is switching methods mid-problem or forgetting method-specific assumptions such as salvage value limits, periodic versus perpetual treatment, or averaging rules.",
        };
    }

    if (tagText.includes("elasticity") || tagText.includes("equilibrium") || tagText.includes("surplus")) {
        return {
            ...fallback,
            whatItIs: `${label} is an economics interpretation tool that turns market inputs into a clearer story about responsiveness, market clearing, or welfare.`,
            whenToUse:
                "Use it when you need to explain how prices and quantities interact, not just compute a formula for an exam item.",
            beginnerNote:
                "Before calculating, identify which variable changed and whether the problem is asking for responsiveness, a market-clearing point, or welfare above and below the equilibrium price.",
            commonMistake:
                "A common mistake is mixing up direction and magnitude. Always interpret whether the answer means more responsive, less responsive, shortage, surplus, or a shift in market balance.",
        };
    }

    if (tagText.includes("startup") || tagText.includes("runway") || tagText.includes("unit economics")) {
        return {
            ...fallback,
            whatItIs: `${label} is a planning tool for startup or small-business decisions.`,
            whenToUse:
                "Use it when you need to test feasibility, pricing, funding needs, or operating runway before committing to a plan.",
            practicalNote:
                "Treat the result as a decision aid, not a guarantee. The best use is to test assumptions, compare cases, and see which driver changes the outcome most.",
            commonMistake:
                "The most common mistake is relying on one optimistic scenario. Try conservative assumptions too, especially for sales, margins, contingency, and monthly burn.",
        };
    }

    if (tagText.includes("interest") || tagText.includes("annuity") || tagText.includes("present value") || tagText.includes("future value") || tagText.includes("capital budgeting")) {
        return {
            ...fallback,
            whatItIs: `${label} is a finance tool for time-value, investment, or lending analysis.`,
            whenToUse:
                "Use it when a problem involves timing, discounting, borrowing, compounding, or project screening rather than simple arithmetic.",
            commonMistake:
                "A common mistake is mixing the rate basis and period basis. Make sure the rate, number of periods, and cash-flow timing all use the same time frame.",
        };
    }

    return fallback;
}

function InsightBlock({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="app-subtle-surface rounded-[1rem] px-3.5 py-3">
            <p className="app-label text-[0.66rem]">{label}</p>
            <p className="app-body-md mt-1.5 text-sm leading-6">{value}</p>
        </div>
    );
}

export default function ToolAboutPanel({
    route,
    availability,
    relatedRoutes,
    compact = false,
    includeDescription = true,
}: ToolAboutPanelProps) {
    const learning = buildLearningContent(route);
    const summary = availability
        ? `${learning.whatItIs} ${availability.label.toLowerCase()} availability is still shown inside.`
        : learning.whatItIs;

    return (
        <DisclosurePanel
            title="About this tool"
            summary={summary}
            badge={route.subtopic}
            compact={compact}
        >
            <div className="space-y-4">
                {includeDescription ? (
                    <InsightBlock label="What it solves" value={learning.whatItSolves} />
                ) : null}

                <div className="app-card-grid-readable--compact">
                    <InsightBlock label="What this tool is" value={learning.whatItIs} />
                    <InsightBlock label="When to use it" value={learning.whenToUse} />
                    <InsightBlock label="Why it matters" value={learning.whyItMatters} />
                    <InsightBlock label="Beginner note" value={learning.beginnerNote} />
                    <InsightBlock label="Practical note" value={learning.practicalNote} />
                    <InsightBlock label="Common mistake" value={learning.commonMistake} />
                </div>

                {learning.methodNote ? (
                    <InsightBlock label="Method note" value={learning.methodNote} />
                ) : null}

                {availability ? (
                    <div
                        className={[
                            "rounded-[1rem] px-3.5 py-3 text-sm leading-6",
                            availability.canOpen ? "app-subtle-surface" : "app-tone-warning",
                        ].join(" ")}
                    >
                        <p className="app-label text-[0.66rem]">Offline and availability</p>
                        <p className="app-body-md mt-1.5 text-sm leading-6">{availability.reason}</p>
                    </div>
                ) : null}

                {relatedRoutes.length > 0 ? (
                    <div className="space-y-2">
                        <p className="app-label text-[0.66rem]">Related tools</p>
                        <div className="flex flex-wrap gap-2">
                            {relatedRoutes.map((relatedRoute) => (
                                <Link
                                    key={relatedRoute.path}
                                    to={relatedRoute.path}
                                    className="app-list-link rounded-full px-3 py-1.5 text-sm font-medium"
                                >
                                    {relatedRoute.shortLabel ?? relatedRoute.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </DisclosurePanel>
    );
}
