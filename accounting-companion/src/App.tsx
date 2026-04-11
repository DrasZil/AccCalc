import { Suspense, lazy, type ReactNode } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import AppErrorBoundary from "./components/AppErrorBoundary";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import AppLayout from "./features/layout/AppLayout";
import { getRouteMeta } from "./utils/appCatalog";
import { useNetworkStatus } from "./utils/networkStatus";
import { useOfflineBundleStatus } from "./utils/offlineStatus";

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
const CashConversionCyclePage = lazy(
    () => import("./features/accounting/CashConversionCyclePage")
);
const BookValuePerSharePage = lazy(
    () => import("./features/accounting/BookValuePerSharePage")
);
const CashDiscountPage = lazy(() => import("./features/accounting/CashDiscountPage"));
const CostOfGoodsManufacturedPage = lazy(
    () => import("./features/accounting/CostOfGoodsManufacturedPage")
);
const FactoryOverheadVariancePage = lazy(
    () => import("./features/accounting/FactoryOverheadVariancePage")
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
const CommonSizeIncomeStatementPage = lazy(
    () => import("./features/accounting/CommonSizeIncomeStatementPage")
);
const CommonSizeBalanceSheetPage = lazy(
    () => import("./features/accounting/CommonSizeBalanceSheetPage")
);
const AdjustingEntriesWorkspacePage = lazy(
    () => import("./features/accounting/AdjustingEntriesWorkspacePage")
);
const RatioAnalysisWorkspacePage = lazy(
    () => import("./features/accounting/RatioAnalysisWorkspacePage")
);
const InventoryControlWorkspacePage = lazy(
    () => import("./features/accounting/InventoryControlWorkspacePage")
);
const LowerOfCostOrNRVPage = lazy(
    () => import("./features/accounting/LowerOfCostOrNRVPage")
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
const MaterialsQuantityVariancePage = lazy(
    () => import("./features/accounting/MaterialsQuantityVariancePage")
);
const NoteInterestPage = lazy(() => import("./features/accounting/NoteInterestPage"));
const BondAmortizationSchedulePage = lazy(
    () => import("./features/accounting/BondAmortizationSchedulePage")
);
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
const PartnershipRetirementBonusPage = lazy(
    () => import("./features/accounting/PartnershipRetirementBonusPage")
);
const PartnershipDissolutionPage = lazy(
    () => import("./features/accounting/PartnershipDissolutionPage")
);
const PartnersCapitalStatementPage = lazy(
    () => import("./features/accounting/PartnersCapitalStatementPage")
);
const PhilippineVATPage = lazy(() => import("./features/accounting/PhilippineVATPage"));
const PrimeConversionCostPage = lazy(
    () => import("./features/accounting/PrimeConversionCostPage")
);
const EquivalentUnitsWeightedAveragePage = lazy(
    () => import("./features/accounting/EquivalentUnitsWeightedAveragePage")
);
const ProcessCostingWorkspaceEntryPage = lazy(
    () => import("./features/accounting/ProcessCostingWorkspaceEntryPage")
);
const CostPerEquivalentUnitPage = lazy(
    () => import("./features/accounting/CostPerEquivalentUnitPage")
);
const CostOfProductionReportPage = lazy(
    () => import("./features/accounting/CostOfProductionReportPage")
);
const Department1ProcessCostingPage = lazy(
    () => import("./features/accounting/Department1ProcessCostingPage")
);
const DepartmentTransferredInProcessCostingPage = lazy(
    () => import("./features/accounting/DepartmentTransferredInProcessCostingPage")
);
const WeightedAverageProcessCostingPage = lazy(
    () => import("./features/accounting/WeightedAverageProcessCostingPage")
);
const FIFOProcessCostingPage = lazy(
    () => import("./features/accounting/FIFOProcessCostingPage")
);
const CostReconciliationCheckerPage = lazy(
    () => import("./features/accounting/CostReconciliationCheckerPage")
);
const TransferredInCostHelperPage = lazy(
    () => import("./features/accounting/TransferredInCostHelperPage")
);
const ProcessCostingPracticeCheckerPage = lazy(
    () => import("./features/accounting/ProcessCostingPracticeCheckerPage")
);
const QuickRatioPage = lazy(() => import("./features/accounting/QuickRatioPage"));
const ReceivablesTurnoverPage = lazy(
    () => import("./features/accounting/ReceivablesTurnoverPage")
);
const WorkingCapitalCyclePage = lazy(
    () => import("./features/accounting/WorkingCapitalCyclePage")
);
const WorkingCapitalPlannerPage = lazy(
    () => import("./features/accounting/WorkingCapitalPlannerPage")
);
const ReturnOnAssetsPage = lazy(() => import("./features/accounting/ReturnOnAssetsPage"));
const ReturnOnEquityPage = lazy(() => import("./features/accounting/ReturnOnEquityPage"));
const EquityMultiplierPage = lazy(
    () => import("./features/accounting/EquityMultiplierPage")
);
const StraightLineDepreciationPage = lazy(
    () => import("./features/accounting/StraightLineDepreciationPage")
);
const DepreciationScheduleComparisonPage = lazy(
    () => import("./features/accounting/DepreciationScheduleComparisonPage")
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
const InventoryMethodComparisonPage = lazy(
    () => import("./features/accounting/InventoryMethodComparisonPage")
);
const AccountsPayableTurnoverPage = lazy(
    () => import("./features/accounting/AccountsPayableTurnoverPage")
);
const ReceivablesAgingSchedulePage = lazy(
    () => import("./features/accounting/ReceivablesAgingSchedulePage")
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
const SalesMixBreakEvenPage = lazy(
    () => import("./features/business/SalesMixBreakEvenPage")
);
const CvpAnalysisPage = lazy(() => import("./features/business/CvpAnalysisPage"));
const CashCollectionsSchedulePage = lazy(
    () => import("./features/business/CashCollectionsSchedulePage")
);
const CashDisbursementsSchedulePage = lazy(
    () => import("./features/business/CashDisbursementsSchedulePage")
);
const CashBudgetPage = lazy(() => import("./features/business/CashBudgetPage"));
const FlexibleBudgetPage = lazy(() => import("./features/business/FlexibleBudgetPage"));
const ProfitLossPage = lazy(() => import("./features/business/ProfitLossPage"));
const TargetProfitPage = lazy(() => import("./features/business/TargetProfitPage"));
const LaborEfficiencyVariancePage = lazy(
    () => import("./features/accounting/LaborEfficiencyVariancePage")
);
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
const CapitalBudgetingComparisonPage = lazy(
    () => import("./features/finance/CapitalBudgetingComparisonPage")
);
const InternalRateOfReturnPage = lazy(
    () => import("./features/finance/InternalRateOfReturnPage")
);
const PaybackPeriodPage = lazy(() => import("./features/finance/PaybackPeriodPage"));
const DiscountedPaybackPeriodPage = lazy(
    () => import("./features/finance/DiscountedPaybackPeriodPage")
);
const HomePage = lazy(() => import("./features/home/HomePage"));
const AboutPage = lazy(() => import("./features/meta/AboutPage"));
const FeedbackPage = lazy(() => import("./features/meta/FeedBackPage"));
const HistoryPage = lazy(() => import("./features/meta/HistoryPage"));
const InstallGuidePage = lazy(() => import("./features/meta/InstallGuidePage"));
const ProfitabilityIndexPage = lazy(
    () => import("./features/finance/ProfitabilityIndexPage")
);
const PriceElasticityPage = lazy(
    () => import("./features/economics/PriceElasticityPage")
);
const MarketEquilibriumPage = lazy(
    () => import("./features/economics/MarketEquilibriumPage")
);
const SurplusAnalysisPage = lazy(
    () => import("./features/economics/SurplusAnalysisPage")
);
const RealRatePage = lazy(() => import("./features/economics/RealRatePage"));
const EconomicsAnalysisWorkspacePage = lazy(
    () => import("./features/economics/EconomicsAnalysisWorkspacePage")
);
const StartupCostPlannerPage = lazy(
    () => import("./features/entrepreneurship/StartupCostPlannerPage")
);
const EntrepreneurshipToolkitPage = lazy(
    () => import("./features/entrepreneurship/EntrepreneurshipToolkitPage")
);
const UnitEconomicsPage = lazy(
    () => import("./features/entrepreneurship/UnitEconomicsPage")
);
const SalesForecastPlannerPage = lazy(
    () => import("./features/entrepreneurship/SalesForecastPlannerPage")
);
const CashRunwayPlannerPage = lazy(
    () => import("./features/entrepreneurship/CashRunwayPlannerPage")
);
const SettingsPage = lazy(() => import("./features/meta/SettingsPage"));
const StandardDeviationPage = lazy(
    () => import("./features/statistics/StandardDeviationPage")
);
const WeightedMeanPage = lazy(() => import("./features/businessMath/WeightedMeanPage"));
const SmartSolverPage = lazy(() => import("./features/smart/SmartSolverPage"));
const ScanCheckPage = lazy(() => import("./features/scan-check/pages/ScanCheckPage"));
const StudyHubPage = lazy(() => import("./features/study/StudyHubPage"));
const StudyPracticeHubPage = lazy(() => import("./features/study/StudyPracticeHubPage"));
const StudyTopicPage = lazy(() => import("./features/study/StudyTopicPage"));
const TopicQuizPage = lazy(() => import("./features/study/TopicQuizPage"));

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

function RouteShell({
    children,
    routePath,
}: {
    children: ReactNode;
    routePath: string;
}) {
    const network = useNetworkStatus();
    const offlineBundle = useOfflineBundleStatus();
    const routeMeta = getRouteMeta(routePath);

    return (
        <RouteErrorBoundary
            routeMeta={routeMeta}
            online={network.online}
            bundleReady={offlineBundle.ready}
        >
            <Suspense fallback={<RouteFallback />}>{children}</Suspense>
        </RouteErrorBoundary>
    );
}

export default function App() {
    const renderRoute = (path: string, element: ReactNode) => (
        <RouteShell routePath={path}>{element}</RouteShell>
    );

    return (
        <AppErrorBoundary>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={renderRoute("/", <HomePage />)} />
                        <Route path="history" element={renderRoute("/history", <HistoryPage />)} />
                        <Route path="basic" element={renderRoute("/basic", <BasicCalculatorPage />)} />
                        <Route path="smart/solver" element={renderRoute("/smart/solver", <SmartSolverPage />)} />
                        <Route path="scan-check" element={renderRoute("/scan-check", <ScanCheckPage />)} />
                        <Route path="study" element={renderRoute("/study", <StudyHubPage />)} />
                        <Route path="study/practice" element={renderRoute("/study/practice", <StudyPracticeHubPage />)} />
                        <Route path="study/topics/:topicId" element={renderRoute("/study", <StudyTopicPage />)} />
                        <Route path="study/quiz/:topicId" element={renderRoute("/study/practice", <TopicQuizPage />)} />

                        <Route path="finance/simple-interest" element={renderRoute("/finance/simple-interest", <SimpleInterestPage />)} />
                        <Route path="finance/compound-interest" element={renderRoute("/finance/compound-interest", <CompoundInterestPage />)} />
                        <Route path="finance/future-value" element={renderRoute("/finance/future-value", <FutureValuePage />)} />
                        <Route path="finance/present-value" element={renderRoute("/finance/present-value", <PresentValuePage />)} />
                        <Route path="finance/future-value-annuity" element={renderRoute("/finance/future-value-annuity", <FutureValueAnnuityPage />)} />
                        <Route path="finance/present-value-annuity" element={renderRoute("/finance/present-value-annuity", <PresentValueAnnuityPage />)} />
                        <Route path="finance/effective-interest-rate" element={renderRoute("/finance/effective-interest-rate", <EffectiveInterestRatePage />)} />
                        <Route path="finance/sinking-fund-deposit" element={renderRoute("/finance/sinking-fund-deposit", <SinkingFundDepositPage />)} />
                        <Route path="finance/loan-amortization" element={renderRoute("/finance/loan-amortization", <LoanAmortizationPage />)} />
                        <Route path="finance/npv" element={renderRoute("/finance/npv", <NetPresentValuePage />)} />
                        <Route path="finance/capital-budgeting-comparison" element={renderRoute("/finance/capital-budgeting-comparison", <CapitalBudgetingComparisonPage />)} />
                        <Route path="finance/internal-rate-of-return" element={renderRoute("/finance/internal-rate-of-return", <InternalRateOfReturnPage />)} />
                        <Route path="finance/profitability-index" element={renderRoute("/finance/profitability-index", <ProfitabilityIndexPage />)} />
                        <Route path="finance/payback-period" element={renderRoute("/finance/payback-period", <PaybackPeriodPage />)} />
                        <Route path="finance/discounted-payback-period" element={renderRoute("/finance/discounted-payback-period", <DiscountedPaybackPeriodPage />)} />

                        <Route path="business/profit-loss" element={renderRoute("/business/profit-loss", <ProfitLossPage />)} />
                        <Route path="business/break-even" element={renderRoute("/business/break-even", <BreakEvenPage />)} />
                        <Route path="business/contribution-margin" element={renderRoute("/business/contribution-margin", <ContributionMarginPage />)} />
                        <Route path="business/markup-margin" element={renderRoute("/business/markup-margin", <MarkupMarginPage />)} />
                        <Route path="business/target-profit" element={renderRoute("/business/target-profit", <TargetProfitPage />)} />
                        <Route path="business/margin-of-safety" element={renderRoute("/business/margin-of-safety", <MarginOfSafetyPage />)} />
                        <Route path="business/net-profit-margin" element={renderRoute("/business/net-profit-margin", <NetProfitMarginPage />)} />
                        <Route path="business/operating-leverage" element={renderRoute("/business/operating-leverage", <OperatingLeveragePage />)} />
                        <Route path="business/sales-mix-break-even" element={renderRoute("/business/sales-mix-break-even", <SalesMixBreakEvenPage />)} />
                        <Route path="business/cvp-analysis" element={renderRoute("/business/cvp-analysis", <CvpAnalysisPage />)} />
                        <Route path="business/cash-collections-schedule" element={renderRoute("/business/cash-collections-schedule", <CashCollectionsSchedulePage />)} />
                        <Route path="business/cash-disbursements-schedule" element={renderRoute("/business/cash-disbursements-schedule", <CashDisbursementsSchedulePage />)} />
                        <Route path="business/cash-budget" element={renderRoute("/business/cash-budget", <CashBudgetPage />)} />
                        <Route path="business/flexible-budget" element={renderRoute("/business/flexible-budget", <FlexibleBudgetPage />)} />
                        <Route path="business-math/weighted-mean" element={renderRoute("/business-math/weighted-mean", <WeightedMeanPage />)} />

                        <Route path="economics/price-elasticity-demand" element={renderRoute("/economics/price-elasticity-demand", <PriceElasticityPage />)} />
                        <Route path="economics/market-equilibrium" element={renderRoute("/economics/market-equilibrium", <MarketEquilibriumPage />)} />
                        <Route path="economics/surplus-analysis" element={renderRoute("/economics/surplus-analysis", <SurplusAnalysisPage />)} />
                        <Route path="economics/real-interest-rate" element={renderRoute("/economics/real-interest-rate", <RealRatePage />)} />
                        <Route path="economics/economics-analysis-workspace" element={renderRoute("/economics/economics-analysis-workspace", <EconomicsAnalysisWorkspacePage />)} />

                        <Route path="entrepreneurship/startup-cost-planner" element={renderRoute("/entrepreneurship/startup-cost-planner", <StartupCostPlannerPage />)} />
                        <Route path="entrepreneurship/entrepreneurship-toolkit" element={renderRoute("/entrepreneurship/entrepreneurship-toolkit", <EntrepreneurshipToolkitPage />)} />
                        <Route path="entrepreneurship/unit-economics" element={renderRoute("/entrepreneurship/unit-economics", <UnitEconomicsPage />)} />
                        <Route path="entrepreneurship/sales-forecast-planner" element={renderRoute("/entrepreneurship/sales-forecast-planner", <SalesForecastPlannerPage />)} />
                        <Route path="entrepreneurship/cash-runway-planner" element={renderRoute("/entrepreneurship/cash-runway-planner", <CashRunwayPlannerPage />)} />

                        <Route path="accounting/accounting-equation" element={renderRoute("/accounting/accounting-equation", <AccountingEquationPage />)} />
                        <Route path="accounting/account-classification" element={renderRoute("/accounting/account-classification", <AccountClassificationPage />)} />
                        <Route path="accounting/notes-interest" element={renderRoute("/accounting/notes-interest", <NoteInterestPage />)} />
                        <Route path="accounting/straight-line-depreciation" element={renderRoute("/accounting/straight-line-depreciation", <StraightLineDepreciationPage />)} />
                        <Route path="accounting/declining-balance-depreciation" element={renderRoute("/accounting/declining-balance-depreciation", <DecliningBalanceDepreciationPage />)} />
                        <Route path="accounting/units-of-production-depreciation" element={renderRoute("/accounting/units-of-production-depreciation", <UnitsOfProductionDepreciationPage />)} />
                        <Route path="accounting/depreciation-schedule-comparison" element={renderRoute("/accounting/depreciation-schedule-comparison", <DepreciationScheduleComparisonPage />)} />
                        <Route path="accounting/cash-discount" element={renderRoute("/accounting/cash-discount", <CashDiscountPage />)} />
                        <Route path="accounting/debit-credit-trainer" element={renderRoute("/accounting/debit-credit-trainer", <DebitCreditTrainerPage />)} />
                        <Route path="accounting/fifo-inventory" element={renderRoute("/accounting/fifo-inventory", <FIFOInventoryPage />)} />
                        <Route path="accounting/weighted-average-inventory" element={renderRoute("/accounting/weighted-average-inventory", <WeightedAverageInventoryPage />)} />
                        <Route path="accounting/inventory-method-comparison" element={renderRoute("/accounting/inventory-method-comparison", <InventoryMethodComparisonPage />)} />
                        <Route path="accounting/gross-profit-method" element={renderRoute("/accounting/gross-profit-method", <GrossProfitMethodPage />)} />
                        <Route path="accounting/lower-of-cost-or-nrv" element={renderRoute("/accounting/lower-of-cost-or-nrv", <LowerOfCostOrNRVPage />)} />
                        <Route path="accounting/gross-profit-rate" element={renderRoute("/accounting/gross-profit-rate", <GrossProfitRatePage />)} />
                        <Route path="accounting/bank-reconciliation" element={renderRoute("/accounting/bank-reconciliation", <BankReconciliationPage />)} />
                        <Route path="accounting/allowance-doubtful-accounts" element={renderRoute("/accounting/allowance-doubtful-accounts", <AllowanceForDoubtfulAccountsPage />)} />
                        <Route path="accounting/bond-amortization-schedule" element={renderRoute("/accounting/bond-amortization-schedule", <BondAmortizationSchedulePage />)} />
                        <Route path="accounting/partnership-profit-sharing" element={renderRoute("/accounting/partnership-profit-sharing", <PartnershipProfitSharingPage />)} />
                        <Route path="accounting/partnership-salary-interest" element={renderRoute("/accounting/partnership-salary-interest", <PartnershipSalaryInterestPage />)} />
                        <Route path="accounting/partnership-admission-bonus" element={renderRoute("/accounting/partnership-admission-bonus", <PartnershipAdmissionBonusPage />)} />
                        <Route path="accounting/partnership-admission-goodwill" element={renderRoute("/accounting/partnership-admission-goodwill", <PartnershipAdmissionGoodwillPage />)} />
                        <Route path="accounting/partnership-retirement-bonus" element={renderRoute("/accounting/partnership-retirement-bonus", <PartnershipRetirementBonusPage />)} />
                        <Route path="accounting/partnership-dissolution" element={renderRoute("/accounting/partnership-dissolution", <PartnershipDissolutionPage />)} />
                        <Route path="accounting/partners-capital-statement" element={renderRoute("/accounting/partners-capital-statement", <PartnersCapitalStatementPage />)} />
                        <Route path="accounting/philippine-vat" element={renderRoute("/accounting/philippine-vat", <PhilippineVATPage />)} />
                        <Route path="accounting/cost-of-goods-manufactured" element={renderRoute("/accounting/cost-of-goods-manufactured", <CostOfGoodsManufacturedPage />)} />
                        <Route path="accounting/factory-overhead-variance" element={renderRoute("/accounting/factory-overhead-variance", <FactoryOverheadVariancePage />)} />
                        <Route path="accounting/equivalent-units-weighted-average" element={renderRoute("/accounting/equivalent-units-weighted-average", <EquivalentUnitsWeightedAveragePage />)} />
                        <Route path="accounting/process-costing-workspace" element={renderRoute("/accounting/process-costing-workspace", <ProcessCostingWorkspaceEntryPage />)} />
                        <Route path="accounting/cost-per-equivalent-unit" element={renderRoute("/accounting/cost-per-equivalent-unit", <CostPerEquivalentUnitPage />)} />
                        <Route path="accounting/cost-of-production-report" element={renderRoute("/accounting/cost-of-production-report", <CostOfProductionReportPage />)} />
                        <Route path="accounting/department-1-process-costing" element={renderRoute("/accounting/department-1-process-costing", <Department1ProcessCostingPage />)} />
                        <Route path="accounting/department-transferred-in-process-costing" element={renderRoute("/accounting/department-transferred-in-process-costing", <DepartmentTransferredInProcessCostingPage />)} />
                        <Route path="accounting/weighted-average-process-costing" element={renderRoute("/accounting/weighted-average-process-costing", <WeightedAverageProcessCostingPage />)} />
                        <Route path="accounting/fifo-process-costing" element={renderRoute("/accounting/fifo-process-costing", <FIFOProcessCostingPage />)} />
                        <Route path="accounting/cost-reconciliation-checker" element={renderRoute("/accounting/cost-reconciliation-checker", <CostReconciliationCheckerPage />)} />
                        <Route path="accounting/transferred-in-cost-helper" element={renderRoute("/accounting/transferred-in-cost-helper", <TransferredInCostHelperPage />)} />
                        <Route path="accounting/process-costing-practice-checker" element={renderRoute("/accounting/process-costing-practice-checker", <ProcessCostingPracticeCheckerPage />)} />
                        <Route path="accounting/prime-conversion-cost" element={renderRoute("/accounting/prime-conversion-cost", <PrimeConversionCostPage />)} />
                        <Route path="accounting/materials-price-variance" element={renderRoute("/accounting/materials-price-variance", <MaterialsPriceVariancePage />)} />
                        <Route path="accounting/materials-quantity-variance" element={renderRoute("/accounting/materials-quantity-variance", <MaterialsQuantityVariancePage />)} />
                        <Route path="accounting/labor-rate-variance" element={renderRoute("/accounting/labor-rate-variance", <LaborRateVariancePage />)} />
                        <Route path="accounting/labor-efficiency-variance" element={renderRoute("/accounting/labor-efficiency-variance", <LaborEfficiencyVariancePage />)} />
                        <Route path="accounting/current-ratio" element={renderRoute("/accounting/current-ratio", <CurrentRatioPage />)} />
                        <Route path="accounting/quick-ratio" element={renderRoute("/accounting/quick-ratio", <QuickRatioPage />)} />
                        <Route path="accounting/working-capital-cycle" element={renderRoute("/accounting/working-capital-cycle", <WorkingCapitalCyclePage />)} />
                        <Route path="accounting/cash-ratio" element={renderRoute("/accounting/cash-ratio", <CashRatioPage />)} />
                        <Route path="accounting/cash-conversion-cycle" element={renderRoute("/accounting/cash-conversion-cycle", <CashConversionCyclePage />)} />
                        <Route path="accounting/receivables-turnover" element={renderRoute("/accounting/receivables-turnover", <ReceivablesTurnoverPage />)} />
                        <Route path="accounting/inventory-turnover" element={renderRoute("/accounting/inventory-turnover", <InventoryTurnoverPage />)} />
                        <Route path="accounting/accounts-payable-turnover" element={renderRoute("/accounting/accounts-payable-turnover", <AccountsPayableTurnoverPage />)} />
                        <Route path="accounting/receivables-aging-schedule" element={renderRoute("/accounting/receivables-aging-schedule", <ReceivablesAgingSchedulePage />)} />
                        <Route path="accounting/debt-to-equity" element={renderRoute("/accounting/debt-to-equity", <DebtToEquityPage />)} />
                        <Route path="accounting/return-on-assets" element={renderRoute("/accounting/return-on-assets", <ReturnOnAssetsPage />)} />
                        <Route path="accounting/times-interest-earned" element={renderRoute("/accounting/times-interest-earned", <TimesInterestEarnedPage />)} />
                        <Route path="accounting/debt-ratio" element={renderRoute("/accounting/debt-ratio", <DebtRatioPage />)} />
                        <Route path="accounting/earnings-per-share" element={renderRoute("/accounting/earnings-per-share", <EarningsPerSharePage />)} />
                        <Route path="accounting/book-value-per-share" element={renderRoute("/accounting/book-value-per-share", <BookValuePerSharePage />)} />
                        <Route path="accounting/equity-multiplier" element={renderRoute("/accounting/equity-multiplier", <EquityMultiplierPage />)} />
                        <Route path="accounting/ratio-analysis-workspace" element={renderRoute("/accounting/ratio-analysis-workspace", <RatioAnalysisWorkspacePage />)} />
                        <Route path="accounting/horizontal-analysis" element={renderRoute("/accounting/horizontal-analysis", <HorizontalAnalysisPage />)} />
                        <Route path="accounting/common-size-income-statement" element={renderRoute("/accounting/common-size-income-statement", <CommonSizeIncomeStatementPage />)} />
                        <Route path="accounting/common-size-balance-sheet" element={renderRoute("/accounting/common-size-balance-sheet", <CommonSizeBalanceSheetPage />)} />
                        <Route path="accounting/adjusting-entries-workspace" element={renderRoute("/accounting/adjusting-entries-workspace", <AdjustingEntriesWorkspacePage />)} />
                        <Route path="accounting/working-capital-planner" element={renderRoute("/accounting/working-capital-planner", <WorkingCapitalPlannerPage />)} />
                        <Route path="accounting/inventory-control-workspace" element={renderRoute("/accounting/inventory-control-workspace", <InventoryControlWorkspacePage />)} />
                        <Route path="accounting/vertical-analysis" element={renderRoute("/accounting/vertical-analysis", <VerticalAnalysisPage />)} />
                        <Route path="accounting/asset-turnover" element={renderRoute("/accounting/asset-turnover", <AssetTurnoverPage />)} />
                        <Route path="accounting/return-on-equity" element={renderRoute("/accounting/return-on-equity", <ReturnOnEquityPage />)} />
                        <Route path="accounting/trade-discount" element={renderRoute("/accounting/trade-discount", <TradeDiscountPage />)} />
                        <Route path="accounting/trial-balance-checker" element={renderRoute("/accounting/trial-balance-checker", <TrialBalanceCheckerPage />)} />

                        <Route path="statistics/standard-deviation" element={renderRoute("/statistics/standard-deviation", <StandardDeviationPage />)} />

                        <Route path="settings" element={renderRoute("/settings", <SettingsPage />)} />
                        <Route path="settings/about" element={renderRoute("/settings/about", <AboutPage />)} />
                        <Route path="settings/install" element={renderRoute("/settings/install", <InstallGuidePage />)} />
                        <Route path="settings/feedback" element={renderRoute("/settings/feedback", <FeedbackPage />)} />
                    </Route>
                </Routes>
            </HashRouter>
        </AppErrorBoundary>
    );
}
