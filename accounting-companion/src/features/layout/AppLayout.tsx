import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import InstallPrompt from "../../components/InstallPrompt";

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
            { label: "Accounting Equation", path: "/accounting/accounting-equation" },
            { label: "Notes Interest", path: "/accounting/notes-interest" },
            { label: "Straight-line Depreciation", path: "/accounting/straight-line-depreciation" },
            { label: "Declining Balance Depreciation", path: "/accounting/declining-balance-depreciation" },
            { label: "Cash Discount", path: "/accounting/cash-discount" },
            { label: "FIFO Inventory", path: "/accounting/fifo-inventory" },
            { label: "Weighted Average Inventory", path: "/accounting/weighted-average-inventory" },
            { label: "Gross Profit Method", path: "/accounting/gross-profit-method" },
            { label: "Bank Reconciliation", path: "/accounting/bank-reconciliation" },
            { label: "Allowance for Doubtful Accounts", path: "/accounting/allowance-doubtful-accounts" },
        ],
    },
];

const bottomNavItems = [
    { label: "About", path: "/about" },
    { label: "Feedback", path: "/feedback" },
];

function getInitials(label: string) {
    return label
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function AppLayout() {
    const location = useLocation();

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(true);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        General: true,
        "Core Tools": true,
        "Smart Tools": true,
        Finance: true,
        Business: false,
        Accounting: true,
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

    const sidebarBaseClass = desktopSidebarExpanded ? "md:w-80" : "md:w-24";

    return (
        <div className="min-h-screen bg-[#07111f] text-white">
            <div className="flex min-h-screen">
                <aside
                    className={[
                        "fixed inset-y-0 left-0 z-40 w-80 border-r border-white/10 bg-[#0b1627]/95 backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0",
                        sidebarBaseClass,
                        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
                    ].join(" ")}
                >
                    <div className="flex h-full flex-col">
                        <div className="border-b border-white/10 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <Link
                                        to="/"
                                        onClick={() => setMobileSidebarOpen(false)}
                                        className="block"
                                    >
                                        <h1 className="truncate text-xl font-bold tracking-tight text-green-300">
                                            {desktopSidebarExpanded ? "AccCalc" : "AC"}
                                        </h1>
                                    </Link>

                                    {desktopSidebarExpanded ? (
                                        <p className="mt-2 text-sm leading-6 text-gray-400">
                                            Smart calculator for study, checking, and practical
                                            accounting use.
                                        </p>
                                    ) : null}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDesktopSidebarExpanded((prev) => !prev)
                                        }
                                        className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10 md:inline-flex"
                                    >
                                        {desktopSidebarExpanded ? "Collapse" : "Expand"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setMobileSidebarOpen(false)}
                                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm md:hidden"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3">
                            <nav className="space-y-4">
                                {navGroups.map((group) => {
                                    const groupIsOpen = openGroups[group.title];

                                    return (
                                        <div key={group.title}>
                                            {desktopSidebarExpanded ? (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleGroup(group.title)}
                                                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                                                >
                                                    <span>{group.title}</span>
                                                    <span
                                                        className={`transition-transform ${
                                                            groupIsOpen ? "rotate-0" : "-rotate-90"
                                                        }`}
                                                    >
                                                        ▼
                                                    </span>
                                                </button>
                                            ) : (
                                                <div className="px-1 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                                                    {group.title.slice(0, 3)}
                                                </div>
                                            )}

                                            {(groupIsOpen || !desktopSidebarExpanded) && (
                                                <div className="mt-2 space-y-2">
                                                    {group.items.map((item) => {
                                                        const isActive =
                                                            location.pathname === item.path;

                                                        return (
                                                            <Link
                                                                key={item.path}
                                                                to={item.path}
                                                                onClick={() => setMobileSidebarOpen(false)}
                                                                title={item.label}
                                                                className={[
                                                                    "block rounded-2xl text-sm font-medium transition",
                                                                    desktopSidebarExpanded
                                                                        ? "px-4 py-3"
                                                                        : "px-2 py-3 text-center",
                                                                    isActive
                                                                        ? "bg-green-500/20 text-green-300 ring-1 ring-green-400/20"
                                                                        : "bg-white/5 text-white hover:bg-white/10",
                                                                ].join(" ")}
                                                            >
                                                                {desktopSidebarExpanded
                                                                    ? item.label
                                                                    : getInitials(item.label)}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </nav>

                            <div className="mt-6 border-t border-white/10 pt-4 space-y-2">
                                {bottomNavItems.map((item) => {
                                    const isActive = location.pathname === item.path;

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMobileSidebarOpen(false)}
                                            title={item.label}
                                            className={[
                                                "block rounded-2xl text-sm font-medium transition",
                                                desktopSidebarExpanded
                                                    ? "px-4 py-3"
                                                    : "px-2 py-3 text-center",
                                                isActive
                                                    ? "bg-green-500/20 text-green-300 ring-1 ring-green-400/20"
                                                    : "bg-white/5 text-white hover:bg-white/10",
                                            ].join(" ")}
                                        >
                                            {desktopSidebarExpanded
                                                ? item.label
                                                : getInitials(item.label)}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {desktopSidebarExpanded ? (
                            <div className="border-t border-white/10 p-4">
                                <p className="text-xs leading-6 text-gray-400">
                                    Built for students and professionals who need fast,
                                    clear, reliable calculations.
                                </p>
                            </div>
                        ) : null}
                    </div>
                </aside>

                {mobileSidebarOpen ? (
                    <button
                        type="button"
                        onClick={() => setMobileSidebarOpen(false)}
                        aria-label="Close sidebar overlay"
                        className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    />
                ) : null}

                <div className="min-w-0 flex-1">
                    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07111f]/80 backdrop-blur">
                        <div className="flex items-center justify-between px-4 py-4 md:px-6">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.18em] text-green-300">
                                    Accounting companion
                                </p>
                                <h2 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">
                                    Learn faster. Calculate better.
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setMobileSidebarOpen(true)}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium md:hidden"
                            >
                                Menu
                            </button>
                        </div>
                    </header>

                    <main className="px-4 py-6 md:px-6">
                        <Outlet />
                    </main>

                    <div className="px-4 pb-6 md:px-6">
                        <InstallPrompt />
                    </div>
                </div>
            </div>
        </div>
    );
}