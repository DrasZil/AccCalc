import { Suspense, lazy, type ReactNode } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import AppErrorBoundary from "./components/AppErrorBoundary";
import AppLayout from "./features/layout/AppLayout";

const BasicCalculatorPage = lazy(() => import("./features/basic/BasicCalculatorPage"));
const AccountingEquationPage = lazy(() => import("./features/accounting/AccountEquationPage"));
const AccountClassificationPage = lazy(
    () => import("./features/accounting/AccountClassificationPage")
);
const AllowanceForDoubtfulAccountsPage = lazy(
    () => import("./features/accounting/AllowanceForDoubtfulAccountsPage")
);
const AssetTurnoverPage = lazy(() => import("./features/accounting/AssetTurnoverPage"));
const BankReconciliationPage = lazy(
    () => import("./features/accounting/BankReconciliationPage")
);
const CashRatioPage = lazy(() => import("./features/accounting/CashRatioPage"));
const BookValuePerSharePage = lazy(
    () => import("./features/accounting/BookValuePerSharePage")
);
const CashDiscountPage = lazy(() => import("./features/accounting/CashDiscountPage"));
const CostOfGoodsManufacturedPage = lazy(
    () => import("./features/accounting/CostOfGoodsManufacturedPage")
);
const CurrentRatioPage = lazy(() => import("./features/accounting/CurrentRatioPage"));
const DebtRatioPage = lazy(() => import("./features/accounting/DebtRatioPage"));
const DebtToEquityPage = lazy(() => import("./features/accounting/DebtToEquityPage"));
const DebitCreditTrainerPage = lazy(
    () => import("./features/accounting/DebitCreditTrainerPage")
);
const DecliningBalanceDepreciationPage = lazy(
    () => import("./features/accounting/DoubleDecliningBalancePage")
);
const EarningsPerSharePage = lazy(() => import("./features/accounting/EarningsPerSharePage"));
const FIFOInventoryPage = lazy(() => import("./features/accounting/FIFOInventoryPage"));
const GrossProfitMethodPage = lazy(() => import("./features/accounting/GrossProfitMethodPage"));
const GrossProfitRatePage = lazy(() => import("./features/accounting/GrossProfitRatePage"));
const HorizontalAnalysisPage = lazy(
    () => import("./features/accounting/HorizontalAnalysisPage")
);
const InventoryTurnoverPage = lazy(
    () => import("./features/accounting/InventoryTurnoverPage")
);
const LaborRateVariancePage = lazy(
    () => import("./features/accounting/LaborRateVariancePage")
);
const MaterialsPriceVariancePage = lazy(
    () => import("./features/accounting/MaterialsPriceVariancePage")
);
const NoteInterestPage = lazy(() => import("./features/accounting/NoteInterestPage"));
const PartnershipProfitSharingPage = lazy(
    () => import("./features/accounting/PartnershipProfitSharingPage")
);
const PartnershipSalaryInterestPage = lazy(
    () => import("./features/accounting/PartnershipSalaryInterestPage")
);
const PartnershipAdmissionBonusPage = lazy(
    () => import("./features/accounting/PartnershipAdmissionBonusPage")
);
const PartnershipAdmissionGoodwillPage = lazy(
    () => import("./features/accounting/PartnershipAdmissionGoodwillPage")
);
const PhilippineVATPage = lazy(() => import("./features/accounting/PhilippineVATPage"));
const PrimeConversionCostPage = lazy(
    () => import("./features/accounting/PrimeConversionCostPage")
);
const QuickRatioPage = lazy(() => import("./features/accounting/QuickRatioPage"));
const ReceivablesTurnoverPage = lazy(
    () => import("./features/accounting/ReceivablesTurnoverPage")
);
const ReturnOnAssetsPage = lazy(() => import("./features/accounting/ReturnOnAssetsPage"));
const ReturnOnEquityPage = lazy(() => import("./features/accounting/ReturnOnEquityPage"));
const StraightLineDepreciationPage = lazy(
    () => import("./features/accounting/StraightLineDepreciationPage")
);
const TimesInterestEarnedPage = lazy(
    () => import("./features/accounting/TimesInterestEarnedPage")
);
const TradeDiscountPage = lazy(() => import("./features/accounting/TradeDiscountPage"));
const TrialBalanceCheckerPage = lazy(
    () => import("./features/accounting/TrialBalanceCheckerPage")
);
const UnitsOfProductionDepreciationPage = lazy(
    () => import("./features/accounting/UnitsOfProductionDepreciationPage")
);
const VerticalAnalysisPage = lazy(() => import("./features/accounting/VerticalAnalysisPage"));
const WeightedAverageInventoryPage = lazy(
    () => import("./features/accounting/WeightedAverageInventoryPage")
);
const AccountsPayableTurnoverPage = lazy(
    () => import("./features/accounting/AccountsPayableTurnoverPage")
);
const BreakEvenPage = lazy(() => import("./features/business/BreakEvenPage"));
const ContributionMarginPage = lazy(
    () => import("./features/business/ContributionMarginPage")
);
const MarginOfSafetyPage = lazy(() => import("./features/business/MarginOfSafetyPage"));
const MarkupMarginPage = lazy(() => import("./features/business/MarkupMarginPage"));
const NetProfitMarginPage = lazy(() => import("./features/business/NetProfitMarginPage"));
const OperatingLeveragePage = lazy(
    () => import("./features/business/OperatingLeveragePage")
);
const ProfitLossPage = lazy(() => import("./features/business/ProfitLossPage"));
const TargetProfitPage = lazy(() => import("./features/business/TargetProfitPage"));
const EffectiveInterestRatePage = lazy(
    () => import("./features/finance/EffectiveInterestRatePage")
);
const FutureValueAnnuityPage = lazy(
    () => import("./features/finance/FutureValueAnnuityPage")
);
const FutureValuePage = lazy(() => import("./features/finance/FutureValuePage"));
const LoanAmortizationPage = lazy(
    () => import("./features/finance/LoanAmortizationPage")
);
const PresentValueAnnuityPage = lazy(
    () => import("./features/finance/PresentValueAnnuityPage")
);
const PresentValuePage = lazy(() => import("./features/finance/PresentValuePage"));
const SimpleInterestPage = lazy(() => import("./features/finance/SimpleInterestPage"));
const SinkingFundDepositPage = lazy(
    () => import("./features/finance/SinkingFundDepositPage")
);
const CompoundInterestPage = lazy(() => import("./features/finance/CompoundInterestPage"));
const NetPresentValuePage = lazy(() => import("./features/finance/NetPresentValuePage"));
const PaybackPeriodPage = lazy(() => import("./features/finance/PaybackPeriodPage"));
const HomePage = lazy(() => import("./features/home/HomePage"));
const AboutPage = lazy(() => import("./features/meta/AboutPage"));
const FeedbackPage = lazy(() => import("./features/meta/FeedBackPage"));
const HistoryPage = lazy(() => import("./features/meta/HistoryPage"));
const ProfitabilityIndexPage = lazy(
    () => import("./features/finance/ProfitabilityIndexPage")
);
const SettingsPage = lazy(() => import("./features/meta/SettingsPage"));
const StandardDeviationPage = lazy(
    () => import("./features/statistics/StandardDeviationPage")
);
const WeightedMeanPage = lazy(() => import("./features/businessMath/WeightedMeanPage"));
const SmartSolverPage = lazy(() => import("./features/smart/SmartSolverPage"));

function RouteFallback() {
    return (
        <div className="app-page-stack">
            <div className="app-panel-elevated app-hero-panel overflow-hidden rounded-[var(--app-radius-xl)] p-6 md:p-8">
                <p className="app-kicker text-xs">
                    Loading
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)] md:text-4xl">
                    Preparing the next tool
                </h1>
                <p className="app-body-lg mt-4 max-w-2xl text-sm md:text-base">
                    AccCalc is loading this page separately to keep the initial app faster on deployed and installed use.
                </p>
            </div>

            <div className="app-subtle-surface rounded-[1.5rem] p-5">
                <div className="h-2 overflow-hidden rounded-full bg-[color:var(--app-border-subtle)]">
                    <div
                        className="loading-shimmer h-full w-1/3 rounded-full"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent, var(--app-accent), var(--app-accent-secondary), transparent)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

function RouteShell({ children }: { children: ReactNode }) {
    return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

export default function App() {
    return (
        <AppErrorBoundary>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={<RouteShell><HomePage /></RouteShell>} />
                        <Route path="history" element={<RouteShell><HistoryPage /></RouteShell>} />
                        <Route path="basic" element={<RouteShell><BasicCalculatorPage /></RouteShell>} />
                        <Route path="smart/solver" element={<RouteShell><SmartSolverPage /></RouteShell>} />

                        <Route path="finance/simple-interest" element={<RouteShell><SimpleInterestPage /></RouteShell>} />
                        <Route path="finance/compound-interest" element={<RouteShell><CompoundInterestPage /></RouteShell>} />
                        <Route path="finance/future-value" element={<RouteShell><FutureValuePage /></RouteShell>} />
                        <Route path="finance/present-value" element={<RouteShell><PresentValuePage /></RouteShell>} />
                        <Route path="finance/future-value-annuity" element={<RouteShell><FutureValueAnnuityPage /></RouteShell>} />
                        <Route path="finance/present-value-annuity" element={<RouteShell><PresentValueAnnuityPage /></RouteShell>} />
                        <Route path="finance/effective-interest-rate" element={<RouteShell><EffectiveInterestRatePage /></RouteShell>} />
                        <Route path="finance/sinking-fund-deposit" element={<RouteShell><SinkingFundDepositPage /></RouteShell>} />
                        <Route path="finance/loan-amortization" element={<RouteShell><LoanAmortizationPage /></RouteShell>} />
                        <Route path="finance/npv" element={<RouteShell><NetPresentValuePage /></RouteShell>} />
                        <Route path="finance/profitability-index" element={<RouteShell><ProfitabilityIndexPage /></RouteShell>} />
                        <Route path="finance/payback-period" element={<RouteShell><PaybackPeriodPage /></RouteShell>} />

                        <Route path="business/profit-loss" element={<RouteShell><ProfitLossPage /></RouteShell>} />
                        <Route path="business/break-even" element={<RouteShell><BreakEvenPage /></RouteShell>} />
                        <Route path="business/contribution-margin" element={<RouteShell><ContributionMarginPage /></RouteShell>} />
                        <Route path="business/markup-margin" element={<RouteShell><MarkupMarginPage /></RouteShell>} />
                        <Route path="business/target-profit" element={<RouteShell><TargetProfitPage /></RouteShell>} />
                        <Route path="business/margin-of-safety" element={<RouteShell><MarginOfSafetyPage /></RouteShell>} />
                        <Route path="business/net-profit-margin" element={<RouteShell><NetProfitMarginPage /></RouteShell>} />
                        <Route path="business/operating-leverage" element={<RouteShell><OperatingLeveragePage /></RouteShell>} />
                        <Route path="business-math/weighted-mean" element={<RouteShell><WeightedMeanPage /></RouteShell>} />

                        <Route path="accounting/accounting-equation" element={<RouteShell><AccountingEquationPage /></RouteShell>} />
                        <Route path="accounting/account-classification" element={<RouteShell><AccountClassificationPage /></RouteShell>} />
                        <Route path="accounting/notes-interest" element={<RouteShell><NoteInterestPage /></RouteShell>} />
                        <Route path="accounting/straight-line-depreciation" element={<RouteShell><StraightLineDepreciationPage /></RouteShell>} />
                        <Route path="accounting/declining-balance-depreciation" element={<RouteShell><DecliningBalanceDepreciationPage /></RouteShell>} />
                        <Route path="accounting/units-of-production-depreciation" element={<RouteShell><UnitsOfProductionDepreciationPage /></RouteShell>} />
                        <Route path="accounting/cash-discount" element={<RouteShell><CashDiscountPage /></RouteShell>} />
                        <Route path="accounting/debit-credit-trainer" element={<RouteShell><DebitCreditTrainerPage /></RouteShell>} />
                        <Route path="accounting/fifo-inventory" element={<RouteShell><FIFOInventoryPage /></RouteShell>} />
                        <Route path="accounting/weighted-average-inventory" element={<RouteShell><WeightedAverageInventoryPage /></RouteShell>} />
                        <Route path="accounting/gross-profit-method" element={<RouteShell><GrossProfitMethodPage /></RouteShell>} />
                        <Route path="accounting/gross-profit-rate" element={<RouteShell><GrossProfitRatePage /></RouteShell>} />
                        <Route path="accounting/bank-reconciliation" element={<RouteShell><BankReconciliationPage /></RouteShell>} />
                        <Route path="accounting/allowance-doubtful-accounts" element={<RouteShell><AllowanceForDoubtfulAccountsPage /></RouteShell>} />
                        <Route path="accounting/partnership-profit-sharing" element={<RouteShell><PartnershipProfitSharingPage /></RouteShell>} />
                        <Route path="accounting/partnership-salary-interest" element={<RouteShell><PartnershipSalaryInterestPage /></RouteShell>} />
                        <Route path="accounting/partnership-admission-bonus" element={<RouteShell><PartnershipAdmissionBonusPage /></RouteShell>} />
                        <Route path="accounting/partnership-admission-goodwill" element={<RouteShell><PartnershipAdmissionGoodwillPage /></RouteShell>} />
                        <Route path="accounting/philippine-vat" element={<RouteShell><PhilippineVATPage /></RouteShell>} />
                        <Route path="accounting/cost-of-goods-manufactured" element={<RouteShell><CostOfGoodsManufacturedPage /></RouteShell>} />
                        <Route path="accounting/prime-conversion-cost" element={<RouteShell><PrimeConversionCostPage /></RouteShell>} />
                        <Route path="accounting/materials-price-variance" element={<RouteShell><MaterialsPriceVariancePage /></RouteShell>} />
                        <Route path="accounting/labor-rate-variance" element={<RouteShell><LaborRateVariancePage /></RouteShell>} />
                        <Route path="accounting/current-ratio" element={<RouteShell><CurrentRatioPage /></RouteShell>} />
                        <Route path="accounting/quick-ratio" element={<RouteShell><QuickRatioPage /></RouteShell>} />
                        <Route path="accounting/cash-ratio" element={<RouteShell><CashRatioPage /></RouteShell>} />
                        <Route path="accounting/receivables-turnover" element={<RouteShell><ReceivablesTurnoverPage /></RouteShell>} />
                        <Route path="accounting/inventory-turnover" element={<RouteShell><InventoryTurnoverPage /></RouteShell>} />
                        <Route path="accounting/accounts-payable-turnover" element={<RouteShell><AccountsPayableTurnoverPage /></RouteShell>} />
                        <Route path="accounting/debt-to-equity" element={<RouteShell><DebtToEquityPage /></RouteShell>} />
                        <Route path="accounting/return-on-assets" element={<RouteShell><ReturnOnAssetsPage /></RouteShell>} />
                        <Route path="accounting/times-interest-earned" element={<RouteShell><TimesInterestEarnedPage /></RouteShell>} />
                        <Route path="accounting/debt-ratio" element={<RouteShell><DebtRatioPage /></RouteShell>} />
                        <Route path="accounting/earnings-per-share" element={<RouteShell><EarningsPerSharePage /></RouteShell>} />
                        <Route path="accounting/book-value-per-share" element={<RouteShell><BookValuePerSharePage /></RouteShell>} />
                        <Route path="accounting/horizontal-analysis" element={<RouteShell><HorizontalAnalysisPage /></RouteShell>} />
                        <Route path="accounting/vertical-analysis" element={<RouteShell><VerticalAnalysisPage /></RouteShell>} />
                        <Route path="accounting/asset-turnover" element={<RouteShell><AssetTurnoverPage /></RouteShell>} />
                        <Route path="accounting/return-on-equity" element={<RouteShell><ReturnOnEquityPage /></RouteShell>} />
                        <Route path="accounting/trade-discount" element={<RouteShell><TradeDiscountPage /></RouteShell>} />
                        <Route path="accounting/trial-balance-checker" element={<RouteShell><TrialBalanceCheckerPage /></RouteShell>} />

                        <Route path="statistics/standard-deviation" element={<RouteShell><StandardDeviationPage /></RouteShell>} />

                        <Route path="settings" element={<RouteShell><SettingsPage /></RouteShell>} />
                        <Route path="settings/about" element={<RouteShell><AboutPage /></RouteShell>} />
                        <Route path="settings/feedback" element={<RouteShell><FeedbackPage /></RouteShell>} />
                    </Route>
                </Routes>
            </HashRouter>
        </AppErrorBoundary>
    );
}
