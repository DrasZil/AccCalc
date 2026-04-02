
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const navGroups = [
    {
        title: "General",
        items: [{ label: "Home", path: "/" }],
    },
    {
        title: "Core Tools",
        items: [{ label: "Basic Calculator", path: "/basic" }],
    },
    {
        title: "Smart Tools",
        items: [{ label: "Smart Solver", path: "/smart/solver" }],
    },
    {
        title: "Finance",
        items: [
        { label: "Simple Interest", path: "/finance/simple-interest" },
        { label: "Compound Interest", path: "/finance/compound-interest" },
        { label: "Future Value", path: "/finance/future-value" },
        { label: "Present Value", path: "/finance/present-value" },
        { label: "Loan Amortization", path: "/finance/loan-amortization" },
        ],
    },
    {
        title: "Business",
        items: [
        { label: "Profit / Loss", path: "/business/profit-loss" },
        { label: "Break-even Point", path: "/business/break-even" },
        { label: "Contribution Margin", path: "/business/contribution-margin" },
        { label: "Markup & Margin", path: "/business/markup-margin" },
        ],
    },
    {
        title: "Accounting",
        items: [
        {
            label: "Accounting Equation",
            path: "/accounting/accounting-equation",
        },
        {
            label: "Notes Interest", path: "/accounting/notes-interest"
        },
        {
            label: "Straight-line Depreciation",
            path: "/accounting/straight-line-depreciation",
        },
        {
            label: "Declining Balance Depreciation",
            path: "/accounting/declining-balance-depreciation",
        },
        ],
    },
];

    export default function AppLayout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        General: true,
        "Core Tools": true,
        Finance: true,
        Business: true,
    });

    useEffect(() => {
        const nextOpenGroups: Record<string, boolean> = { ...openGroups };

        navGroups.forEach((group) => {
        const hasActiveItem = group.items.some(
            (item) => item.path === location.pathname
        );

        if (hasActiveItem) {
            nextOpenGroups[group.title] = true;
        }
        });

        setOpenGroups(nextOpenGroups);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    function toggleGroup(groupTitle: string) {
        setOpenGroups((prev) => ({
        ...prev,
        [groupTitle]: !prev[groupTitle],
        }));
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white">
        <div className="flex min-h-screen">
            <aside
            className={`
                fixed inset-y-0 left-0 z-40 w-72 transform border-r border-white/10 bg-neutral-900/95 backdrop-blur
                transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:static md:translate-x-0
            `}
            >
            <div className="flex h-full flex-col">
                <div className="border-b border-white/10 p-5">
                <div className="flex items-center justify-between md:block">
                    <div>
                    <h1 className="text-2xl font-bold tracking-tight">AccCalc</h1>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                        Smart calculator for study, checking, and practical
                        accounting use.
                    </p>
                    </div>

                    <button
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm md:hidden"
                    >
                    Close
                    </button>
                </div>
                </div>

                <nav className="flex-1 space-y-4 overflow-y-auto p-4">
                {navGroups.map((group) => {
                    const groupIsOpen = openGroups[group.title];

                    return (
                    <div key={group.title} className="space-y-2">
                        <button
                        onClick={() => toggleGroup(group.title)}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                        <span>{group.title}</span>
                        <span
                            className={`text-xs text-gray-400 transition-transform duration-200 ${
                            groupIsOpen ? "rotate-180" : ""
                            }`}
                        >
                            ▼
                        </span>
                        </button>

                        {groupIsOpen && (
                        <div className="space-y-2 pl-2">
                            {group.items.map((item) => {
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                    isActive
                                    ? "bg-green-500/20 text-green-300 ring-1 ring-green-400/20"
                                    : "bg-white/5 text-white hover:bg-white/10"
                                }`}
                                >
                                {item.label}
                                </Link>
                            );
                            })}
                        </div>
                        )}
                    </div>
                    );
                })}
                </nav>

                <div className="border-t border-white/10 p-4 text-xs leading-5 text-gray-500">
                Built for students and professionals who need fast, clear,
                reliable calculations.
                </div>
            </div>
            </aside>

            {sidebarOpen && (
            <button
                className="fixed inset-0 z-30 bg-black/50 md:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar overlay"
            />
            )}

            <div className="flex min-h-screen flex-1 flex-col">
            <header className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
                <div className="flex items-center justify-between px-4 py-4 md:px-6">
                <div>
                    <p className="text-sm text-gray-400">Accounting companion</p>
                    <h2 className="text-lg font-semibold tracking-tight">
                    Learn faster. Calculate better.
                    </h2>
                </div>

                <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium md:hidden"
                >
                    Menu
                </button>
                </div>
            </header>

            <section className="flex-1 px-4 py-6 md:px-8 md:py-8">
                <div className="mx-auto w-full max-w-6xl">
                <Outlet />
                </div>
            </section>
            </div>
        </div>
        </main>
    );
}