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
        description: "Enter known values and get a suggested calculator.",
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
        description: "Enter any 2 values and solve for Assets, Liabilities, or Equity using the fundamental accounting equation.",
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
        description:
            "Estimate gross profit, cost of goods sold, and ending inventory using net sales, gross profit rate, and cost of goods available for sale.",
        path: "/accounting/gross-profit-method",
        category: "Accounting",
    },
    {
        title: "Bank Reconciliation",
        description:
            "Reconcile bank and book balances using deposits in transit, outstanding checks, service charges, NSF checks, and errors.",
        path: "/accounting/bank-reconciliation",
        category: "Accounting",
    },
    {
        title: "Allowance for Doubtful Accounts",
        description:
            "Estimate uncollectible accounts and net realizable value using accounts receivable and an estimated uncollectible rate.",
        path: "/accounting/allowance-doubtful-accounts",
        category: "Accounting",
    },
    {
        title: "Partnership Profit Sharing",
        description:
            "Allocate partnership profit or loss among partners using agreed profit-and-loss ratios.",
        path: "/accounting/partnership-profit-sharing",
        category: "Accounting",
    },
    {
        title: "Philippine VAT",
        description:
            "Compute output VAT, input VAT, and VAT payable using the standard Philippine 12% VAT rate.",
        path: "/accounting/philippine-vat",
        category: "Accounting",
    },
    {
        title: "Cost of Goods Manufactured",
        description:
            "Compute total manufacturing costs and cost of goods manufactured for cost accounting problems.",
        path: "/accounting/cost-of-goods-manufactured",
        category: "Accounting",
    },
    {
        title: "Current Ratio & Working Capital",
        description:
            "Measure liquidity using current assets and current liabilities.",
        path: "/accounting/current-ratio",
        category: "Accounting",
    },
    {
        title: "Quick Ratio",
        description:
            "Measure immediate liquidity using quick assets and current liabilities.",
        path: "/accounting/quick-ratio",
        category: "Accounting",
    },
    {
        title: "Accounts Receivable Turnover",
        description:
            "Compute turnover and average collection period for receivables analysis.",
        path: "/accounting/receivables-turnover",
        category: "Accounting",
    },
];

export default function HomePage() {
    return (
        <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
                <div className="max-w-3xl">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-300">
                        Smart Accounting Toolkit
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
                        Make studying and solving calculations easier.
                    </h1>
                    <p className="mt-4 text-base leading-7 text-gray-300 md:text-lg">
                        AccCalc is designed to help students and professionals solve core
                        financial, business, and accounting calculations with clarity,
                        speed, and confidence, including topics commonly encountered by
                        Philippine accounting students.
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-gray-400">Purpose</p>
                        <p className="mt-2 text-lg font-semibold">Study + practical use</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-gray-400">Focus</p>
                        <p className="mt-2 text-lg font-semibold">Readable, accurate, guided</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-gray-400">Users</p>
                        <p className="mt-2 text-lg font-semibold">Students and professionals</p>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Quick access</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Start with the most useful tools, then browse everything from the sidebar.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {tools.map((tool) => (
                        <Link
                            key={tool.path}
                            to={tool.path}
                            className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-gray-300">
                                    {tool.category}
                                </span>
                                <span className="text-sm text-gray-500 transition group-hover:text-gray-300">
                                    Open →
                                </span>
                            </div>

                            <h3 className="mt-4 text-xl font-semibold leading-snug">
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
