import { Link } from "react-router-dom";

const tools = [
    {
        title: "Basic Calculator",
        description: "Perform everyday arithmetic operations quickly and cleanly.",
        path: "/basic",
        category: "Core",
    },
    {
        title: "Smart Solver",
        description: "Describe a problem naturally and get adaptive inputs plus the right calculator.",
        path: "/smart/solver",
        category: "Smart Tools",
    },
    {
        title: "Simple Interest Calculator",
        description: "Compute interest, total amount, and understand the full solution.",
        path: "/finance/simple-interest",
        category: "Finance",
    },
    {
        title: "Compound Interest",
        description: "Compute compound interest and total accumulated amount.",
        path: "/finance/compound-interest",
        category: "Finance",
    },
    {
        title: "Future Value",
        description: "Estimate how much a present amount will grow over time.",
        path: "/finance/future-value",
        category: "Finance",
    },
    {
        title: "Present Value",
        description: "Find the present worth of a future amount using discounting.",
        path: "/finance/present-value",
        category: "Finance",
    },
    {
        title: "Future Value of Annuity",
        description: "Compute the accumulated value of equal periodic payments.",
        path: "/finance/future-value-annuity",
        category: "Finance",
    },
    {
        title: "Present Value of Annuity",
        description: "Compute the present worth of equal periodic payments.",
        path: "/finance/present-value-annuity",
        category: "Finance",
    },
    {
        title: "Loan / Amortization",
        description: "Estimate monthly payment, total paid, and total interest for a loan.",
        path: "/finance/loan-amortization",
        category: "Finance",
    },
    {
        title: "Profit / Loss Calculator",
        description: "Compare revenue and cost to identify profit, loss, or break-even.",
        path: "/business/profit-loss",
        category: "Business",
    },
    {
        title: "Break-even Point",
        description: "Find the units and sales needed to avoid profit or loss.",
        path: "/business/break-even",
        category: "Business",
    },
    {
        title: "Contribution Margin",
        description: "Measure how much sales contribute toward fixed costs and profit.",
        path: "/business/contribution-margin",
        category: "Business",
    },
    {
        title: "Markup & Margin",
        description: "Compute profit, markup percentage, and margin percentage from cost and selling price.",
        path: "/business/markup-margin",
        category: "Business",
    },
    {
        title: "Target Profit",
        description: "Find the units and sales needed to achieve a target profit.",
        path: "/business/target-profit",
        category: "Business",
    },
    {
        title: "Margin of Safety",
        description: "Measure how much sales can drop before reaching break-even.",
        path: "/business/margin-of-safety",
        category: "Business",
    },
    {
        title: "Straight-Line Depreciation",
        description: "Compute annual depreciation using the straight-line method.",
        path: "/accounting/straight-line-depreciation",
        category: "Accounting",
    },
    {
        title: "Double Declining Balance",
        description: "Estimate depreciation expense and book value using accelerated depreciation.",
        path: "/accounting/declining-balance-depreciation",
        category: "Accounting",
    },
    {
        title: "Accounting Equation",
        description: "Enter any 2 values and solve for assets, liabilities, or equity.",
        path: "/accounting/accounting-equation",
        category: "Accounting",
    },
    {
        title: "Notes Interest",
        description: "Compute interest and maturity value for notes receivable or notes payable.",
        path: "/accounting/notes-interest",
        category: "Accounting",
    },
    {
        title: "Cash Discount / Credit Terms",
        description: "Solve payment amounts for terms like 2/10, n/30.",
        path: "/accounting/cash-discount",
        category: "Accounting",
    },
    {
        title: "FIFO Inventory",
        description: "Compute cost of goods sold and ending inventory using the FIFO method.",
        path: "/accounting/fifo-inventory",
        category: "Accounting",
    },
    {
        title: "Weighted Average Inventory",
        description: "Compute weighted average unit cost, cost of goods sold, and ending inventory.",
        path: "/accounting/weighted-average-inventory",
        category: "Accounting",
    },
    {
        title: "Gross Profit Method",
        description: "Estimate gross profit, cost of goods sold, and ending inventory.",
        path: "/accounting/gross-profit-method",
        category: "Accounting",
    },
    {
        title: "Bank Reconciliation",
        description: "Reconcile bank and book balances using common reconciling items.",
        path: "/accounting/bank-reconciliation",
        category: "Accounting",
    },
    {
        title: "Allowance for Doubtful Accounts",
        description: "Estimate uncollectible accounts and net realizable value.",
        path: "/accounting/allowance-doubtful-accounts",
        category: "Accounting",
    },
    {
        title: "Partnership Profit Sharing",
        description: "Allocate partnership profit or loss using agreed ratios.",
        path: "/accounting/partnership-profit-sharing",
        category: "Accounting",
    },
    {
        title: "Philippine VAT",
        description: "Compute output VAT, input VAT, and VAT payable using the 12% rate.",
        path: "/accounting/philippine-vat",
        category: "Accounting",
    },
    {
        title: "Cost of Goods Manufactured",
        description: "Compute total manufacturing costs and cost of goods manufactured.",
        path: "/accounting/cost-of-goods-manufactured",
        category: "Accounting",
    },
    {
        title: "Current Ratio & Working Capital",
        description: "Measure liquidity using current assets and current liabilities.",
        path: "/accounting/current-ratio",
        category: "Accounting",
    },
    {
        title: "Quick Ratio",
        description: "Measure immediate liquidity using quick assets and current liabilities.",
        path: "/accounting/quick-ratio",
        category: "Accounting",
    },
    {
        title: "Accounts Receivable Turnover",
        description: "Compute turnover and average collection period for receivables analysis.",
        path: "/accounting/receivables-turnover",
        category: "Accounting",
    },
    {
        title: "Inventory Turnover",
        description: "Compute inventory turnover and days in inventory for analysis problems.",
        path: "/accounting/inventory-turnover",
        category: "Accounting",
    },
    {
        title: "Debt to Equity Ratio",
        description: "Measure leverage using total liabilities and total equity.",
        path: "/accounting/debt-to-equity",
        category: "Accounting",
    },
    {
        title: "Return on Assets",
        description: "Compute return on assets using net income and average total assets.",
        path: "/accounting/return-on-assets",
        category: "Accounting",
    },
    {
        title: "Debt Ratio",
        description: "Measure the percentage of assets financed through liabilities.",
        path: "/accounting/debt-ratio",
        category: "Accounting",
    },
    {
        title: "Earnings Per Share",
        description: "Compute basic EPS using net income, preferred dividends, and common shares.",
        path: "/accounting/earnings-per-share",
        category: "Accounting",
    },
    {
        title: "Horizontal Analysis",
        description: "Compare a statement item across periods using amount and percentage change.",
        path: "/accounting/horizontal-analysis",
        category: "Accounting",
    },
    {
        title: "Vertical Analysis",
        description: "Express a statement item as a percentage of a selected base total.",
        path: "/accounting/vertical-analysis",
        category: "Accounting",
    },
    {
        title: "Settings",
        description: "Control navigation, Smart Solver behavior, and app preferences.",
        path: "/settings",
        category: "General",
    },
];

export default function HomePage() {
    return (
        <div className="space-y-8 md:space-y-10">
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(88,196,135,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)] md:p-10">
                <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr] xl:items-end">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-300">
                            Smart Accounting Toolkit
                        </p>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl xl:text-6xl">
                            Premium accounting tools for study, drills, and real problem solving.
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                            AccCalc helps students, reviewees, and professionals solve
                            finance, business, and accounting calculations with a cleaner
                            workflow and curriculum-aligned coverage.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                            <p className="text-sm text-gray-400">Purpose</p>
                            <p className="mt-2 text-lg font-semibold">Study + practical use</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                            <p className="text-sm text-gray-400">Focus</p>
                            <p className="mt-2 text-lg font-semibold">Readable, accurate, guided</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                            <p className="text-sm text-gray-400">Audience</p>
                            <p className="mt-2 text-lg font-semibold">Students to professionals</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Quick access</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Open a calculator directly or start from Smart Solver when you only
                        know the problem in plain language.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {tools.map((tool) => (
                        <Link
                            key={tool.path}
                            to={tool.path}
                            className="group rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-green-400/20 hover:bg-white/10"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-gray-300">
                                    {tool.category}
                                </span>
                                <span className="text-sm text-gray-500 transition group-hover:text-gray-300">
                                    Open →
                                </span>
                            </div>

                            <h3 className="mt-4 text-xl font-semibold leading-snug text-white">
                                {tool.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-gray-300">
                                {tool.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
