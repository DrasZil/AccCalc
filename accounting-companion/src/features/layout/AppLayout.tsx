import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import InstallPrompt from "../../components/InstallPrompt";

type NavItem = {
    label: string;
    path: string;
};

type NavGroup = {
    title: string;
    items: NavItem[];
};

type OpenGroupsState = {
    General: boolean;
    "Core Tools": boolean;
    "Smart Tools": boolean;
    Finance: boolean;
    Business: boolean;
    Accounting: boolean;
};

const navGroups: NavGroup[] = [
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
            { label: "Partnership Profit Sharing", path: "/accounting/partnership-profit-sharing" },
            { label: "Philippine VAT", path: "/accounting/philippine-vat" },
            { label: "Cost of Goods Manufactured", path: "/accounting/cost-of-goods-manufactured" },
            { label: "Current Ratio & Working Capital", path: "/accounting/current-ratio" },
            { label: "Quick Ratio", path: "/accounting/quick-ratio" },
            { label: "Accounts Receivable Turnover", path: "/accounting/receivables-turnover" },
            { label: "Inventory Turnover", path: "/accounting/inventory-turnover" },
            { label: "Debt to Equity Ratio", path: "/accounting/debt-to-equity" },
            { label: "Return on Assets", path: "/accounting/return-on-assets" },
        ],
    },
];

const bottomNavItems: NavItem[] = [
    { label: "About", path: "/about" },
    { label: "Feedback", path: "/feedback" },
];

type SidebarContentProps = {
    locationPathname: string;
    openGroups: OpenGroupsState;
    toggleGroup: (groupTitle: keyof OpenGroupsState) => void;
    closeMobileSidebar: () => void;
};

function SidebarContent({
    locationPathname,
    openGroups,
    toggleGroup,
    closeMobileSidebar,
}: SidebarContentProps) {
    return (
        <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(12,18,15,0.96),rgba(7,10,8,0.98))]">
            <div className="border-b border-white/10 px-4 py-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <Link to="/" onClick={closeMobileSidebar} className="block">
                            <h1 className="truncate text-2xl font-bold tracking-tight text-green-300">
                                AccCalc
                            </h1>
                        </Link>

                        <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
                            Structured tools for accounting study, classroom drills, and
                            practical calculation work.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={closeMobileSidebar}
                        className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm md:hidden"
                    >
                        Close
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 scrollbar-premium">
                <nav className="space-y-4">
                    {navGroups.map((group) => {
                        const groupKey = group.title as keyof OpenGroupsState;
                        const groupIsOpen = openGroups[groupKey];

                        return (
                            <div key={group.title}>
                                <button
                                    type="button"
                                    onClick={() => toggleGroup(groupKey)}
                                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/[0.07]"
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

                                {groupIsOpen ? (
                                    <div className="mt-2 space-y-2">
                                        {group.items.map((item) => {
                                            const isActive = locationPathname === item.path;

                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={closeMobileSidebar}
                                                    className={[
                                                        "block rounded-2xl px-4 py-3 text-sm font-medium leading-5 transition",
                                                        isActive
                                                            ? "bg-green-500/15 text-green-300 ring-1 ring-green-400/20"
                                                            : "bg-white/[0.03] text-white hover:bg-white/[0.06]",
                                                    ].join(" ")}
                                                >
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </nav>

                <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
                    {bottomNavItems.map((item) => {
                        const isActive = locationPathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={closeMobileSidebar}
                                className={[
                                    "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                                    isActive
                                        ? "bg-green-500/15 text-green-300 ring-1 ring-green-400/20"
                                        : "bg-white/[0.03] text-white hover:bg-white/[0.06]",
                                ].join(" ")}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="border-t border-white/10 p-4">
                <p className="text-xs leading-6 text-gray-500">
                    Built for students, reviewees, and working professionals who need
                    clear and reliable calculations.
                </p>
            </div>
        </div>
    );
}

export default function AppLayout() {
    const location = useLocation();

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
    const [desktopSidebarVisible, setDesktopSidebarVisible] = useState<boolean>(true);
    const [openGroups, setOpenGroups] = useState<OpenGroupsState>({
        General: true,
        "Core Tools": true,
        "Smart Tools": true,
        Finance: true,
        Business: false,
        Accounting: true,
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const saved = window.localStorage.getItem("accalc-desktop-sidebar-visible");
        if (saved !== null) {
            setDesktopSidebarVisible(saved === "true");
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        window.localStorage.setItem(
            "accalc-desktop-sidebar-visible",
            String(desktopSidebarVisible)
        );
    }, [desktopSidebarVisible]);

    useEffect(() => {
        setOpenGroups((current) => {
            const nextOpenGroups: OpenGroupsState = { ...current };

            navGroups.forEach((group) => {
                const groupKey = group.title as keyof OpenGroupsState;
                const hasActiveItem = group.items.some((item) => item.path === location.pathname);

                if (hasActiveItem) {
                    nextOpenGroups[groupKey] = true;
                }
            });

            return nextOpenGroups;
        });
    }, [location.pathname]);

    function toggleGroup(groupTitle: keyof OpenGroupsState) {
        setOpenGroups((current) => ({
            ...current,
            [groupTitle]: !current[groupTitle],
        }));
    }

    return (
        <div className="min-h-screen bg-transparent text-white">
            <div className="flex min-h-screen items-start">
                {desktopSidebarVisible ? (
                    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 border-r border-white/10 bg-[#0a0a0a]/85 backdrop-blur-xl md:block">
                        <SidebarContent
                            locationPathname={location.pathname}
                            openGroups={openGroups}
                            toggleGroup={toggleGroup}
                            closeMobileSidebar={() => setMobileSidebarOpen(false)}
                        />
                    </aside>
                ) : null}

                <aside
                    className={[
                        "fixed inset-y-0 left-0 z-40 w-[88vw] max-w-80 border-r border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl transition-transform duration-300 md:hidden",
                        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
                    ].join(" ")}
                >
                    <SidebarContent
                        locationPathname={location.pathname}
                        openGroups={openGroups}
                        toggleGroup={toggleGroup}
                        closeMobileSidebar={() => setMobileSidebarOpen(false)}
                    />
                </aside>

                {mobileSidebarOpen ? (
                    <button
                        type="button"
                        onClick={() => setMobileSidebarOpen(false)}
                        aria-label="Close sidebar overlay"
                        className="fixed inset-0 z-30 bg-black/60 md:hidden"
                    />
                ) : null}

                <div className="min-w-0 flex-1">
                    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050505]/72 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-6">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-300 md:text-sm">
                                    Accounting companion
                                </p>
                                <h2 className="mt-1 text-lg font-bold tracking-tight text-white md:text-2xl">
                                    Learn faster. Calculate with confidence.
                                </h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDesktopSidebarVisible((current) => !current)}
                                    className="hidden rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium transition hover:bg-white/[0.08] md:inline-flex"
                                >
                                    {desktopSidebarVisible ? "Hide sidebar" : "Show sidebar"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMobileSidebarOpen(true)}
                                    className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium md:hidden"
                                >
                                    Menu
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="px-4 py-6 md:px-6 md:py-8">
                        <div className="mx-auto w-full max-w-7xl">
                            <Outlet />
                        </div>
                    </main>

                    <div className="px-4 pb-6 md:px-6">
                        <div className="mx-auto w-full max-w-7xl">
                            <InstallPrompt />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
