import { Suspense, lazy, type ReactNode } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import AppErrorBoundary from "./components/AppErrorBoundary";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import AppLayout from "./features/layout/AppLayout";
import { AppNotificationProvider } from "./features/layout/AppNotifications";
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
const PettyCashReconciliationPage = lazy(
    () => import("./features/accounting/PettyCashReconciliationPage")
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
const JobOrderCostSheetPage = lazy(
    () => import("./features/accounting/JobOrderCostSheetPage")
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
const PrepaidExpenseAdjustmentPage = lazy(
    () => import("./features/accounting/PrepaidExpenseAdjustmentPage")
);
const UnearnedRevenueAdjustmentPage = lazy(
    () => import("./features/accounting/UnearnedRevenueAdjustmentPage")
);
const AccruedRevenueAdjustmentPage = lazy(
    () => import("./features/accounting/AccruedRevenueAdjustmentPage")
);
const AccruedExpenseAdjustmentPage = lazy(
    () => import("./features/accounting/AccruedExpenseAdjustmentPage")
);
const RatioAnalysisWorkspacePage = lazy(
    () => import("./features/accounting/RatioAnalysisWorkspacePage")
);
const DuPontAnalysisPage = lazy(
    () => import("./features/accounting/DuPontAnalysisPage")
);
const EarningsQualityPage = lazy(
    () => import("./features/accounting/EarningsQualityPage")
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
const NotesReceivableDiscountingPage = lazy(
    () => import("./features/accounting/NotesReceivableDiscountingPage")
);
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
const SpecialOrderDecisionPage = lazy(
    () => import("./features/business/SpecialOrderDecisionPage")
);
const MakeOrBuyDecisionPage = lazy(
    () => import("./features/business/MakeOrBuyDecisionPage")
);
const SellProcessFurtherPage = lazy(
    () => import("./features/business/SellProcessFurtherPage")
);
const ConstrainedResourceProductMixPage = lazy(
    () => import("./features/business/ConstrainedResourceProductMixPage")
);
const TransferPricingSupportPage = lazy(
    () => import("./features/business/TransferPricingSupportPage")
);
const ActivityBasedCostingPage = lazy(
    () => import("./features/business/ActivityBasedCostingPage")
);
const BudgetVarianceAnalysisPage = lazy(
    () => import("./features/business/BudgetVarianceAnalysisPage")
);
const SegmentedIncomeStatementPage = lazy(
    () => import("./features/business/SegmentedIncomeStatementPage")
);
const SalesVolumeVariancePage = lazy(
    () => import("./features/business/SalesVolumeVariancePage")
);
const SalesMixVariancePage = lazy(
    () => import("./features/business/SalesMixVariancePage")
);
const CashCollectionsSchedulePage = lazy(
    () => import("./features/business/CashCollectionsSchedulePage")
);
const CashDisbursementsSchedulePage = lazy(
    () => import("./features/business/CashDisbursementsSchedulePage")
);
const CashBudgetPage = lazy(() => import("./features/business/CashBudgetPage"));
const FlexibleBudgetPage = lazy(() => import("./features/business/FlexibleBudgetPage"));
const CapacityUtilizationPage = lazy(
    () => import("./features/business/CapacityUtilizationPage")
);
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
const AccountingRateOfReturnPage = lazy(
    () => import("./features/finance/AccountingRateOfReturnPage")
);
const CapitalBudgetingComparisonPage = lazy(
    () => import("./features/finance/CapitalBudgetingComparisonPage")
);
const EquivalentAnnualAnnuityPage = lazy(
    () => import("./features/finance/EquivalentAnnualAnnuityPage")
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
const WorkpaperStudioPage = lazy(
    () => import("./features/workpapers/WorkpaperStudioPage")
);
const ProfitabilityIndexPage = lazy(
    () => import("./features/finance/ProfitabilityIndexPage")
);
const CapitalRationingPage = lazy(
    () => import("./features/finance/CapitalRationingPage")
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
const HighLowCostEstimationPage = lazy(
    () => import("./features/business/HighLowCostEstimationPage")
);
const ProductionBudgetPage = lazy(
    () => import("./features/business/ProductionBudgetPage")
);
const DirectMaterialsPurchasesBudgetPage = lazy(
    () => import("./features/business/DirectMaterialsPurchasesBudgetPage")
);
const DirectLaborBudgetPage = lazy(
    () => import("./features/business/DirectLaborBudgetPage")
);
const FactoryOverheadBudgetPage = lazy(
    () => import("./features/business/FactoryOverheadBudgetPage")
);
const InventoryBudgetPage = lazy(
    () => import("./features/business/InventoryBudgetPage")
);
const OperatingExpenseBudgetPage = lazy(
    () => import("./features/business/OperatingExpenseBudgetPage")
);
const BudgetedIncomeStatementPage = lazy(
    () => import("./features/business/BudgetedIncomeStatementPage")
);
const SalesBudgetPage = lazy(
    () => import("./features/business/SalesBudgetPage")
);
const AdditionalFundsNeededPage = lazy(
    () => import("./features/business/AdditionalFundsNeededPage")
);
const RoiRiEvaPage = lazy(() => import("./features/business/RoiRiEvaPage"));
const LeaseMeasurementWorkspacePage = lazy(
    () => import("./features/far/LeaseMeasurementWorkspacePage")
);
const ShareBasedPaymentPage = lazy(
    () => import("./features/far/ShareBasedPaymentPage")
);
const BorrowingCostsCapitalizationPage = lazy(
    () => import("./features/far/BorrowingCostsCapitalizationPage")
);
const ProvisionExpectedValuePage = lazy(
    () => import("./features/far/ProvisionExpectedValuePage")
);
const QuasiReorganizationPage = lazy(
    () => import("./features/far/QuasiReorganizationPage")
);
const FinancialAssetAmortizedCostPage = lazy(
    () => import("./features/far/FinancialAssetAmortizedCostPage")
);
const InvestmentPropertyMeasurementPage = lazy(
    () => import("./features/far/InvestmentPropertyMeasurementPage")
);
const ImpairmentLossPage = lazy(
    () => import("./features/far/ImpairmentLossPage")
);
const AssetDisposalAnalysisPage = lazy(
    () => import("./features/far/AssetDisposalAnalysisPage")
);
const RetainedEarningsRollforwardPage = lazy(
    () => import("./features/far/RetainedEarningsRollforwardPage")
);
const CashFlowStatementBuilderPage = lazy(
    () => import("./features/far/CashFlowStatementBuilderPage")
);
const StatementOfChangesInEquityBuilderPage = lazy(
    () => import("./features/far/StatementOfChangesInEquityBuilderPage")
);
const DividendAllocationPage = lazy(
    () => import("./features/far/DividendAllocationPage")
);
const ConceptualFrameworkRecognitionPage = lazy(
    () => import("./features/far/ConceptualFrameworkRecognitionPage")
);
const RevenueAllocationWorkspacePage = lazy(
    () => import("./features/far/RevenueAllocationWorkspacePage")
);
const EoqReorderPointPage = lazy(
    () => import("./features/operations/EoqReorderPointPage")
);
const MovingAverageForecastPage = lazy(
    () => import("./features/operations/MovingAverageForecastPage")
);
const SafetyStockPlannerPage = lazy(
    () => import("./features/operations/SafetyStockPlannerPage")
);
const CostPlusPricingPage = lazy(
    () => import("./features/operations/CostPlusPricingPage")
);
const RetailMarkupMarkdownPage = lazy(
    () => import("./features/operations/RetailMarkupMarkdownPage")
);
const PertProjectEstimatePage = lazy(
    () => import("./features/operations/PertProjectEstimatePage")
);
const QualityControlChartPage = lazy(
    () => import("./features/operations/QualityControlChartPage")
);
const AuditPlanningWorkspacePage = lazy(
    () => import("./features/audit/AuditPlanningWorkspacePage")
);
const AuditSamplingPlannerPage = lazy(
    () => import("./features/audit/AuditSamplingPlannerPage")
);
const AuditMisstatementEvaluationPage = lazy(
    () => import("./features/audit/AuditMisstatementEvaluationPage")
);
const AuditAssertionEvidencePlannerPage = lazy(
    () => import("./features/audit/AuditAssertionEvidencePlannerPage")
);
const AuditCycleReviewerPage = lazy(
    () => import("./features/audit/AuditCycleReviewerPage")
);
const AuditCompletionOpinionPage = lazy(
    () => import("./features/audit/AuditCompletionOpinionPage")
);
const AuditEvidenceProgramPage = lazy(
    () => import("./features/audit/AuditEvidenceProgramPage")
);
const AuditMaterialityPlannerPage = lazy(
    () => import("./features/audit/AuditMaterialityPlannerPage")
);
const GoingConcernReviewPage = lazy(
    () => import("./features/audit/GoingConcernReviewPage")
);
const AnalyticalProceduresReviewPage = lazy(
    () => import("./features/audit/AnalyticalProceduresReviewPage")
);
const BookTaxDifferenceWorkspacePage = lazy(
    () => import("./features/tax/BookTaxDifferenceWorkspacePage")
);
const TaxableIncomeBridgePage = lazy(
    () => import("./features/tax/TaxableIncomeBridgePage")
);
const IncomeTaxPayableReviewPage = lazy(
    () => import("./features/tax/IncomeTaxPayableReviewPage")
);
const TaxRemedyTimelineReviewPage = lazy(
    () => import("./features/tax/TaxRemedyTimelineReviewPage")
);
const DeductionSubstantiationReviewPage = lazy(
    () => import("./features/tax/DeductionSubstantiationReviewPage")
);
const TaxComplianceReviewPage = lazy(
    () => import("./features/tax/TaxComplianceReviewPage")
);
const ExciseLocalAndIncentiveReviewPage = lazy(
    () => import("./features/tax/ExciseLocalAndIncentiveReviewPage")
);
const WithholdingTaxPage = lazy(
    () => import("./features/tax/WithholdingTaxPage")
);
const PercentageTaxPage = lazy(
    () => import("./features/tax/PercentageTaxPage")
);
const VatReconciliationPage = lazy(
    () => import("./features/tax/VatReconciliationPage")
);
const EstateTaxPage = lazy(() => import("./features/tax/EstateTaxPage"));
const DonorsTaxPage = lazy(() => import("./features/tax/DonorsTaxPage"));
const DocumentaryStampTaxPage = lazy(
    () => import("./features/tax/DocumentaryStampTaxPage")
);
const BusinessCombinationAnalysisPage = lazy(
    () => import("./features/afar/BusinessCombinationAnalysisPage")
);
const EquityMethodInvestmentPage = lazy(
    () => import("./features/afar/EquityMethodInvestmentPage")
);
const ForeignCurrencyTranslationPage = lazy(
    () => import("./features/afar/ForeignCurrencyTranslationPage")
);
const ConstructionRevenuePage = lazy(
    () => import("./features/afar/ConstructionRevenuePage")
);
const FranchiseRevenueWorkspacePage = lazy(
    () => import("./features/afar/FranchiseRevenueWorkspacePage")
);
const InstallmentSalesReviewPage = lazy(
    () => import("./features/afar/InstallmentSalesReviewPage")
);
const CorporateLiquidationPage = lazy(
    () => import("./features/afar/CorporateLiquidationPage")
);
const JointArrangementAnalyzerPage = lazy(
    () => import("./features/afar/JointArrangementAnalyzerPage")
);
const IntercompanyInventoryProfitPage = lazy(
    () => import("./features/afar/IntercompanyInventoryProfitPage")
);
const IntercompanyPpeTransferPage = lazy(
    () => import("./features/afar/IntercompanyPpeTransferPage")
);
const ConsignmentSettlementPage = lazy(
    () => import("./features/afar/ConsignmentSettlementPage")
);
const BranchInventoryLoadingPage = lazy(
    () => import("./features/afar/BranchInventoryLoadingPage")
);
const ItControlMatrixPage = lazy(() => import("./features/ais/ItControlMatrixPage"));
const AisLifecycleAndRecoveryPage = lazy(
    () => import("./features/ais/AisLifecycleAndRecoveryPage")
);
const EnterpriseSystemsControlMapperPage = lazy(
    () => import("./features/ais/EnterpriseSystemsControlMapperPage")
);
const AccessControlReviewPage = lazy(
    () => import("./features/ais/AccessControlReviewPage")
);
const SegregationOfDutiesConflictPage = lazy(
    () => import("./features/ais/SegregationOfDutiesConflictPage")
);
const BusinessContinuityPlannerPage = lazy(
    () => import("./features/ais/BusinessContinuityPlannerPage")
);
const RevenueCycleControlReviewPage = lazy(
    () => import("./features/ais/RevenueCycleControlReviewPage")
);
const IncidentResponseTriagePage = lazy(
    () => import("./features/ais/IncidentResponseTriagePage")
);
const RiskControlMatrixPage = lazy(
    () => import("./features/governance/RiskControlMatrixPage")
);
const ControlEnvironmentReviewPage = lazy(
    () => import("./features/governance/ControlEnvironmentReviewPage")
);
const EthicsDecisionWorkspacePage = lazy(
    () => import("./features/governance/EthicsDecisionWorkspacePage")
);
const GovernanceEscalationPlannerPage = lazy(
    () => import("./features/governance/GovernanceEscalationPlannerPage")
);
const FraudRiskResponsePlannerPage = lazy(
    () => import("./features/governance/FraudRiskResponsePlannerPage")
);
const BusinessLawReviewPage = lazy(
    () => import("./features/rfbt/BusinessLawReviewPage")
);
const ObligationsContractsFlowPage = lazy(
    () => import("./features/rfbt/ObligationsContractsFlowPage")
);
const NegotiableInstrumentsIssueSpotterPage = lazy(
    () => import("./features/rfbt/NegotiableInstrumentsIssueSpotterPage")
);
const SecurityContractsRemedyReviewPage = lazy(
    () => import("./features/rfbt/SecurityContractsRemedyReviewPage")
);
const DefectiveContractsClassifierPage = lazy(
    () => import("./features/rfbt/DefectiveContractsClassifierPage")
);
const CommercialTransactionsReviewerPage = lazy(
    () => import("./features/rfbt/CommercialTransactionsReviewerPage")
);
const SecuritiesGovernanceReviewPage = lazy(
    () => import("./features/rfbt/SecuritiesGovernanceReviewPage")
);
const IntegrativeCaseMapperPage = lazy(
    () => import("./features/strategic/IntegrativeCaseMapperPage")
);
const StrategicBusinessAnalysisPage = lazy(
    () => import("./features/strategic/StrategicBusinessAnalysisPage")
);
const BusinessCaseAnalysisPage = lazy(
    () => import("./features/strategic/BusinessCaseAnalysisPage")
);
const BalancedScorecardWorkspacePage = lazy(
    () => import("./features/strategic/BalancedScorecardWorkspacePage")
);
const TargetCostingWorkspacePage = lazy(
    () => import("./features/strategic/TargetCostingWorkspacePage")
);
const IntegratedReviewStudioPage = lazy(
    () => import("./features/strategic/IntegratedReviewStudioPage")
);
const SettingsPage = lazy(() => import("./features/meta/SettingsPage"));
const StandardDeviationPage = lazy(
    () => import("./features/statistics/StandardDeviationPage")
);
const ConfidenceIntervalPage = lazy(
    () => import("./features/statistics/ConfidenceIntervalPage")
);
const CoefficientVariationPage = lazy(
    () => import("./features/statistics/CoefficientVariationPage")
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
                    <Route
                        path="/"
                        element={
                            <AppNotificationProvider>
                                <AppLayout />
                            </AppNotificationProvider>
                        }
                    >
                        <Route index element={renderRoute("/", <HomePage />)} />
                        <Route path="history" element={renderRoute("/history", <HistoryPage />)} />
                        <Route path="workpapers" element={renderRoute("/workpapers", <WorkpaperStudioPage />)} />
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
                        <Route path="finance/accounting-rate-of-return" element={renderRoute("/finance/accounting-rate-of-return", <AccountingRateOfReturnPage />)} />
                        <Route path="finance/capital-budgeting-comparison" element={renderRoute("/finance/capital-budgeting-comparison", <CapitalBudgetingComparisonPage />)} />
                        <Route path="finance/equivalent-annual-annuity" element={renderRoute("/finance/equivalent-annual-annuity", <EquivalentAnnualAnnuityPage />)} />
                        <Route path="finance/internal-rate-of-return" element={renderRoute("/finance/internal-rate-of-return", <InternalRateOfReturnPage />)} />
                        <Route path="finance/profitability-index" element={renderRoute("/finance/profitability-index", <ProfitabilityIndexPage />)} />
                        <Route path="finance/capital-rationing-prioritizer" element={renderRoute("/finance/capital-rationing-prioritizer", <CapitalRationingPage />)} />
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
                        <Route path="business/special-order-analysis" element={renderRoute("/business/special-order-analysis", <SpecialOrderDecisionPage />)} />
                        <Route path="business/make-or-buy-analysis" element={renderRoute("/business/make-or-buy-analysis", <MakeOrBuyDecisionPage />)} />
                        <Route path="business/sell-or-process-further" element={renderRoute("/business/sell-or-process-further", <SellProcessFurtherPage />)} />
                        <Route path="business/constrained-resource-product-mix" element={renderRoute("/business/constrained-resource-product-mix", <ConstrainedResourceProductMixPage />)} />
                        <Route path="business/transfer-pricing-support" element={renderRoute("/business/transfer-pricing-support", <TransferPricingSupportPage />)} />
                        <Route path="business/activity-based-costing" element={renderRoute("/business/activity-based-costing", <ActivityBasedCostingPage />)} />
                        <Route path="business/budget-variance-analysis" element={renderRoute("/business/budget-variance-analysis", <BudgetVarianceAnalysisPage />)} />
                        <Route path="business/segmented-income-statement" element={renderRoute("/business/segmented-income-statement", <SegmentedIncomeStatementPage />)} />
                        <Route path="business/sales-volume-variance" element={renderRoute("/business/sales-volume-variance", <SalesVolumeVariancePage />)} />
                        <Route path="business/sales-mix-variance" element={renderRoute("/business/sales-mix-variance", <SalesMixVariancePage />)} />
                        <Route path="business/cash-collections-schedule" element={renderRoute("/business/cash-collections-schedule", <CashCollectionsSchedulePage />)} />
                        <Route path="business/cash-disbursements-schedule" element={renderRoute("/business/cash-disbursements-schedule", <CashDisbursementsSchedulePage />)} />
                        <Route path="business/cash-budget" element={renderRoute("/business/cash-budget", <CashBudgetPage />)} />
                        <Route path="business/flexible-budget" element={renderRoute("/business/flexible-budget", <FlexibleBudgetPage />)} />
                        <Route path="business/capacity-utilization" element={renderRoute("/business/capacity-utilization", <CapacityUtilizationPage />)} />
                        <Route path="business/additional-funds-needed" element={renderRoute("/business/additional-funds-needed", <AdditionalFundsNeededPage />)} />
                        <Route path="business/high-low-cost-estimation" element={renderRoute("/business/high-low-cost-estimation", <HighLowCostEstimationPage />)} />
                        <Route path="business/production-budget" element={renderRoute("/business/production-budget", <ProductionBudgetPage />)} />
                        <Route path="business/direct-materials-purchases-budget" element={renderRoute("/business/direct-materials-purchases-budget", <DirectMaterialsPurchasesBudgetPage />)} />
                        <Route path="business/direct-labor-budget" element={renderRoute("/business/direct-labor-budget", <DirectLaborBudgetPage />)} />
                        <Route path="business/factory-overhead-budget" element={renderRoute("/business/factory-overhead-budget", <FactoryOverheadBudgetPage />)} />
                        <Route path="business/sales-budget" element={renderRoute("/business/sales-budget", <SalesBudgetPage />)} />
                        <Route path="business/inventory-budget" element={renderRoute("/business/inventory-budget", <InventoryBudgetPage />)} />
                        <Route path="business/operating-expense-budget" element={renderRoute("/business/operating-expense-budget", <OperatingExpenseBudgetPage />)} />
                        <Route path="business/budgeted-income-statement" element={renderRoute("/business/budgeted-income-statement", <BudgetedIncomeStatementPage />)} />
                        <Route path="business/roi-ri-eva" element={renderRoute("/business/roi-ri-eva", <RoiRiEvaPage />)} />
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
                        <Route path="far/lease-measurement-workspace" element={renderRoute("/far/lease-measurement-workspace", <LeaseMeasurementWorkspacePage />)} />
                        <Route path="far/share-based-payment-workspace" element={renderRoute("/far/share-based-payment-workspace", <ShareBasedPaymentPage />)} />
                        <Route path="far/borrowing-costs-capitalization" element={renderRoute("/far/borrowing-costs-capitalization", <BorrowingCostsCapitalizationPage />)} />
                        <Route path="far/provision-expected-value" element={renderRoute("/far/provision-expected-value", <ProvisionExpectedValuePage />)} />
                        <Route path="far/quasi-reorganization" element={renderRoute("/far/quasi-reorganization", <QuasiReorganizationPage />)} />
                        <Route path="far/financial-asset-amortized-cost" element={renderRoute("/far/financial-asset-amortized-cost", <FinancialAssetAmortizedCostPage />)} />
                        <Route path="far/investment-property-measurement" element={renderRoute("/far/investment-property-measurement", <InvestmentPropertyMeasurementPage />)} />
                        <Route path="far/impairment-loss-workspace" element={renderRoute("/far/impairment-loss-workspace", <ImpairmentLossPage />)} />
                        <Route path="far/asset-disposal-analysis" element={renderRoute("/far/asset-disposal-analysis", <AssetDisposalAnalysisPage />)} />
                        <Route path="far/retained-earnings-rollforward" element={renderRoute("/far/retained-earnings-rollforward", <RetainedEarningsRollforwardPage />)} />
                        <Route path="far/cash-flow-statement-builder" element={renderRoute("/far/cash-flow-statement-builder", <CashFlowStatementBuilderPage />)} />
                        <Route path="far/statement-of-changes-in-equity-builder" element={renderRoute("/far/statement-of-changes-in-equity-builder", <StatementOfChangesInEquityBuilderPage />)} />
                        <Route path="far/dividend-allocation" element={renderRoute("/far/dividend-allocation", <DividendAllocationPage />)} />
                        <Route path="far/conceptual-framework-recognition" element={renderRoute("/far/conceptual-framework-recognition", <ConceptualFrameworkRecognitionPage />)} />
                        <Route path="far/revenue-allocation-workspace" element={renderRoute("/far/revenue-allocation-workspace", <RevenueAllocationWorkspacePage />)} />
                        <Route path="operations/eoq-and-reorder-point" element={renderRoute("/operations/eoq-and-reorder-point", <EoqReorderPointPage />)} />
                        <Route path="operations/moving-average-forecast" element={renderRoute("/operations/moving-average-forecast", <MovingAverageForecastPage />)} />
                        <Route path="operations/safety-stock-planner" element={renderRoute("/operations/safety-stock-planner", <SafetyStockPlannerPage />)} />
                        <Route path="operations/cost-plus-pricing" element={renderRoute("/operations/cost-plus-pricing", <CostPlusPricingPage />)} />
                        <Route path="operations/retail-markup-markdown" element={renderRoute("/operations/retail-markup-markdown", <RetailMarkupMarkdownPage />)} />
                        <Route path="operations/pert-project-estimate" element={renderRoute("/operations/pert-project-estimate", <PertProjectEstimatePage />)} />
                        <Route path="operations/quality-control-chart" element={renderRoute("/operations/quality-control-chart", <QualityControlChartPage />)} />
                        <Route path="audit/audit-planning-workspace" element={renderRoute("/audit/audit-planning-workspace", <AuditPlanningWorkspacePage />)} />
                        <Route path="audit/audit-sampling-planner" element={renderRoute("/audit/audit-sampling-planner", <AuditSamplingPlannerPage />)} />
                        <Route path="audit/misstatement-evaluation-workspace" element={renderRoute("/audit/misstatement-evaluation-workspace", <AuditMisstatementEvaluationPage />)} />
                        <Route path="audit/assertion-evidence-planner" element={renderRoute("/audit/assertion-evidence-planner", <AuditAssertionEvidencePlannerPage />)} />
                        <Route path="audit/audit-cycle-reviewer" element={renderRoute("/audit/audit-cycle-reviewer", <AuditCycleReviewerPage />)} />
                        <Route path="audit/audit-completion-and-opinion" element={renderRoute("/audit/audit-completion-and-opinion", <AuditCompletionOpinionPage />)} />
                        <Route path="audit/evidence-program-builder" element={renderRoute("/audit/evidence-program-builder", <AuditEvidenceProgramPage />)} />
                        <Route path="audit/materiality-and-misstatement-planner" element={renderRoute("/audit/materiality-and-misstatement-planner", <AuditMaterialityPlannerPage />)} />
                        <Route path="audit/going-concern-review" element={renderRoute("/audit/going-concern-review", <GoingConcernReviewPage />)} />
                        <Route path="audit/analytical-procedures-review" element={renderRoute("/audit/analytical-procedures-review", <AnalyticalProceduresReviewPage />)} />
                        <Route path="tax/book-tax-difference-workspace" element={renderRoute("/tax/book-tax-difference-workspace", <BookTaxDifferenceWorkspacePage />)} />
                        <Route path="tax/taxable-income-bridge" element={renderRoute("/tax/taxable-income-bridge", <TaxableIncomeBridgePage />)} />
                        <Route path="tax/income-tax-payable-review" element={renderRoute("/tax/income-tax-payable-review", <IncomeTaxPayableReviewPage />)} />
                        <Route path="tax/tax-remedy-timeline-review" element={renderRoute("/tax/tax-remedy-timeline-review", <TaxRemedyTimelineReviewPage />)} />
                        <Route path="tax/deduction-substantiation-review" element={renderRoute("/tax/deduction-substantiation-review", <DeductionSubstantiationReviewPage />)} />
                        <Route path="tax/percentage-tax" element={renderRoute("/tax/percentage-tax", <PercentageTaxPage />)} />
                        <Route path="tax/vat-reconciliation" element={renderRoute("/tax/vat-reconciliation", <VatReconciliationPage />)} />
                        <Route path="tax/withholding-tax" element={renderRoute("/tax/withholding-tax", <WithholdingTaxPage />)} />
                        <Route path="tax/estate-tax-helper" element={renderRoute("/tax/estate-tax-helper", <EstateTaxPage />)} />
                        <Route path="tax/donors-tax-helper" element={renderRoute("/tax/donors-tax-helper", <DonorsTaxPage />)} />
                        <Route path="tax/documentary-stamp-tax-helper" element={renderRoute("/tax/documentary-stamp-tax-helper", <DocumentaryStampTaxPage />)} />
                        <Route path="tax/tax-compliance-review" element={renderRoute("/tax/tax-compliance-review", <TaxComplianceReviewPage />)} />
                        <Route path="tax/excise-local-and-incentive-review" element={renderRoute("/tax/excise-local-and-incentive-review", <ExciseLocalAndIncentiveReviewPage />)} />
                        <Route path="afar/business-combination-analysis" element={renderRoute("/afar/business-combination-analysis", <BusinessCombinationAnalysisPage />)} />
                        <Route path="afar/equity-method-investment" element={renderRoute("/afar/equity-method-investment", <EquityMethodInvestmentPage />)} />
                        <Route path="afar/intercompany-inventory-profit" element={renderRoute("/afar/intercompany-inventory-profit", <IntercompanyInventoryProfitPage />)} />
                        <Route path="afar/intercompany-ppe-transfer" element={renderRoute("/afar/intercompany-ppe-transfer", <IntercompanyPpeTransferPage />)} />
                        <Route path="afar/foreign-currency-translation" element={renderRoute("/afar/foreign-currency-translation", <ForeignCurrencyTranslationPage />)} />
                        <Route path="afar/construction-revenue-workspace" element={renderRoute("/afar/construction-revenue-workspace", <ConstructionRevenuePage />)} />
                        <Route path="afar/franchise-revenue-workspace" element={renderRoute("/afar/franchise-revenue-workspace", <FranchiseRevenueWorkspacePage />)} />
                        <Route path="afar/installment-sales-review" element={renderRoute("/afar/installment-sales-review", <InstallmentSalesReviewPage />)} />
                        <Route path="afar/corporate-liquidation" element={renderRoute("/afar/corporate-liquidation", <CorporateLiquidationPage />)} />
                        <Route path="afar/joint-arrangement-analyzer" element={renderRoute("/afar/joint-arrangement-analyzer", <JointArrangementAnalyzerPage />)} />
                        <Route path="afar/consignment-settlement" element={renderRoute("/afar/consignment-settlement", <ConsignmentSettlementPage />)} />
                        <Route path="afar/branch-inventory-loading" element={renderRoute("/afar/branch-inventory-loading", <BranchInventoryLoadingPage />)} />
                        <Route path="ais/it-control-matrix" element={renderRoute("/ais/it-control-matrix", <ItControlMatrixPage />)} />
                        <Route path="ais/ais-lifecycle-and-recovery" element={renderRoute("/ais/ais-lifecycle-and-recovery", <AisLifecycleAndRecoveryPage />)} />
                        <Route path="ais/enterprise-systems-control-mapper" element={renderRoute("/ais/enterprise-systems-control-mapper", <EnterpriseSystemsControlMapperPage />)} />
                        <Route path="ais/access-control-review" element={renderRoute("/ais/access-control-review", <AccessControlReviewPage />)} />
                        <Route path="ais/segregation-of-duties-conflict-matrix" element={renderRoute("/ais/segregation-of-duties-conflict-matrix", <SegregationOfDutiesConflictPage />)} />
                        <Route path="ais/business-continuity-planner" element={renderRoute("/ais/business-continuity-planner", <BusinessContinuityPlannerPage />)} />
                        <Route path="ais/revenue-cycle-control-review" element={renderRoute("/ais/revenue-cycle-control-review", <RevenueCycleControlReviewPage />)} />
                        <Route path="ais/incident-response-triage" element={renderRoute("/ais/incident-response-triage", <IncidentResponseTriagePage />)} />
                        <Route path="governance/risk-control-matrix" element={renderRoute("/governance/risk-control-matrix", <RiskControlMatrixPage />)} />
                        <Route path="governance/control-environment-review" element={renderRoute("/governance/control-environment-review", <ControlEnvironmentReviewPage />)} />
                        <Route path="governance/ethics-decision-workspace" element={renderRoute("/governance/ethics-decision-workspace", <EthicsDecisionWorkspacePage />)} />
                        <Route path="governance/governance-escalation-planner" element={renderRoute("/governance/governance-escalation-planner", <GovernanceEscalationPlannerPage />)} />
                        <Route path="governance/fraud-risk-response-planner" element={renderRoute("/governance/fraud-risk-response-planner", <FraudRiskResponsePlannerPage />)} />
                        <Route path="rfbt/business-law-review" element={renderRoute("/rfbt/business-law-review", <BusinessLawReviewPage />)} />
                        <Route path="rfbt/obligations-contracts-flow" element={renderRoute("/rfbt/obligations-contracts-flow", <ObligationsContractsFlowPage />)} />
                        <Route path="rfbt/negotiable-instruments-issue-spotter" element={renderRoute("/rfbt/negotiable-instruments-issue-spotter", <NegotiableInstrumentsIssueSpotterPage />)} />
                        <Route path="rfbt/security-contracts-remedy-review" element={renderRoute("/rfbt/security-contracts-remedy-review", <SecurityContractsRemedyReviewPage />)} />
                        <Route path="rfbt/defective-contracts-classifier" element={renderRoute("/rfbt/defective-contracts-classifier", <DefectiveContractsClassifierPage />)} />
                        <Route path="rfbt/commercial-transactions-reviewer" element={renderRoute("/rfbt/commercial-transactions-reviewer", <CommercialTransactionsReviewerPage />)} />
                        <Route path="rfbt/securities-and-governance-review" element={renderRoute("/rfbt/securities-and-governance-review", <SecuritiesGovernanceReviewPage />)} />
                        <Route path="strategic/integrative-case-mapper" element={renderRoute("/strategic/integrative-case-mapper", <IntegrativeCaseMapperPage />)} />
                        <Route path="strategic/strategic-business-analysis" element={renderRoute("/strategic/strategic-business-analysis", <StrategicBusinessAnalysisPage />)} />
                        <Route path="strategic/business-case-analysis" element={renderRoute("/strategic/business-case-analysis", <BusinessCaseAnalysisPage />)} />
                        <Route path="strategic/balanced-scorecard-workspace" element={renderRoute("/strategic/balanced-scorecard-workspace", <BalancedScorecardWorkspacePage />)} />
                        <Route path="strategic/target-costing-workspace" element={renderRoute("/strategic/target-costing-workspace", <TargetCostingWorkspacePage />)} />
                        <Route path="strategic/cpa-integrated-review-studio" element={renderRoute("/strategic/cpa-integrated-review-studio", <IntegratedReviewStudioPage />)} />

                        <Route path="accounting/accounting-equation" element={renderRoute("/accounting/accounting-equation", <AccountingEquationPage />)} />
                        <Route path="accounting/account-classification" element={renderRoute("/accounting/account-classification", <AccountClassificationPage />)} />
                        <Route path="accounting/notes-interest" element={renderRoute("/accounting/notes-interest", <NoteInterestPage />)} />
                        <Route path="accounting/notes-receivable-discounting" element={renderRoute("/accounting/notes-receivable-discounting", <NotesReceivableDiscountingPage />)} />
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
                        <Route path="accounting/petty-cash-reconciliation" element={renderRoute("/accounting/petty-cash-reconciliation", <PettyCashReconciliationPage />)} />
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
                        <Route path="accounting/job-order-cost-sheet" element={renderRoute("/accounting/job-order-cost-sheet", <JobOrderCostSheetPage />)} />
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
                        <Route path="accounting/dupont-analysis" element={renderRoute("/accounting/dupont-analysis", <DuPontAnalysisPage />)} />
                        <Route path="accounting/earnings-quality-analysis" element={renderRoute("/accounting/earnings-quality-analysis", <EarningsQualityPage />)} />
                        <Route path="accounting/horizontal-analysis" element={renderRoute("/accounting/horizontal-analysis", <HorizontalAnalysisPage />)} />
                        <Route path="accounting/common-size-income-statement" element={renderRoute("/accounting/common-size-income-statement", <CommonSizeIncomeStatementPage />)} />
                        <Route path="accounting/common-size-balance-sheet" element={renderRoute("/accounting/common-size-balance-sheet", <CommonSizeBalanceSheetPage />)} />
                        <Route path="accounting/adjusting-entries-workspace" element={renderRoute("/accounting/adjusting-entries-workspace", <AdjustingEntriesWorkspacePage />)} />
                        <Route path="accounting/prepaid-expense-adjustment" element={renderRoute("/accounting/prepaid-expense-adjustment", <PrepaidExpenseAdjustmentPage />)} />
                        <Route path="accounting/unearned-revenue-adjustment" element={renderRoute("/accounting/unearned-revenue-adjustment", <UnearnedRevenueAdjustmentPage />)} />
                        <Route path="accounting/accrued-revenue-adjustment" element={renderRoute("/accounting/accrued-revenue-adjustment", <AccruedRevenueAdjustmentPage />)} />
                        <Route path="accounting/accrued-expense-adjustment" element={renderRoute("/accounting/accrued-expense-adjustment", <AccruedExpenseAdjustmentPage />)} />
                        <Route path="accounting/working-capital-planner" element={renderRoute("/accounting/working-capital-planner", <WorkingCapitalPlannerPage />)} />
                        <Route path="accounting/inventory-control-workspace" element={renderRoute("/accounting/inventory-control-workspace", <InventoryControlWorkspacePage />)} />
                        <Route path="accounting/vertical-analysis" element={renderRoute("/accounting/vertical-analysis", <VerticalAnalysisPage />)} />
                        <Route path="accounting/asset-turnover" element={renderRoute("/accounting/asset-turnover", <AssetTurnoverPage />)} />
                        <Route path="accounting/return-on-equity" element={renderRoute("/accounting/return-on-equity", <ReturnOnEquityPage />)} />
                        <Route path="accounting/trade-discount" element={renderRoute("/accounting/trade-discount", <TradeDiscountPage />)} />
                        <Route path="accounting/trial-balance-checker" element={renderRoute("/accounting/trial-balance-checker", <TrialBalanceCheckerPage />)} />

                        <Route path="statistics/standard-deviation" element={renderRoute("/statistics/standard-deviation", <StandardDeviationPage />)} />
                        <Route path="statistics/confidence-interval" element={renderRoute("/statistics/confidence-interval", <ConfidenceIntervalPage />)} />
                        <Route path="statistics/coefficient-of-variation" element={renderRoute("/statistics/coefficient-of-variation", <CoefficientVariationPage />)} />

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
