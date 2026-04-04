import { HashRouter, Route, Routes } from "react-router-dom";
import AppErrorBoundary from "./components/AppErrorBoundary";
import AppLayout from "./features/layout/AppLayout";
import BasicCalculatorPage from "./features/basic/BasicCalculatorPage";
import AccountingEquationPage from "./features/accounting/AccountEquationPage";
import AllowanceForDoubtfulAccountsPage from "./features/accounting/AllowanceForDoubtfulAccountsPage";
import AssetTurnoverPage from "./features/accounting/AssetTurnoverPage";
import BankReconciliationPage from "./features/accounting/BankReconciliationPage";
import BookValuePerSharePage from "./features/accounting/BookValuePerSharePage";
import CashDiscountPage from "./features/accounting/CashDiscountPage";
import CostOfGoodsManufacturedPage from "./features/accounting/CostOfGoodsManufacturedPage";
import CurrentRatioPage from "./features/accounting/CurrentRatioPage";
import DebtRatioPage from "./features/accounting/DebtRatioPage";
import DebtToEquityPage from "./features/accounting/DebtToEquityPage";
import DecliningBalanceDepreciationPage from "./features/accounting/DoubleDecliningBalancePage";
import EarningsPerSharePage from "./features/accounting/EarningsPerSharePage";
import FIFOInventoryPage from "./features/accounting/FIFOInventoryPage";
import GrossProfitMethodPage from "./features/accounting/GrossProfitMethodPage";
import HorizontalAnalysisPage from "./features/accounting/HorizontalAnalysisPage";
import InventoryTurnoverPage from "./features/accounting/InventoryTurnoverPage";
import LaborRateVariancePage from "./features/accounting/LaborRateVariancePage";
import MaterialsPriceVariancePage from "./features/accounting/MaterialsPriceVariancePage";
import NoteInterestPage from "./features/accounting/NoteInterestPage";
import PartnershipProfitSharingPage from "./features/accounting/PartnershipProfitSharingPage";
import PartnershipSalaryInterestPage from "./features/accounting/PartnershipSalaryInterestPage";
import PartnershipAdmissionBonusPage from "./features/accounting/PartnershipAdmissionBonusPage";
import PartnershipAdmissionGoodwillPage from "./features/accounting/PartnershipAdmissionGoodwillPage";
import PhilippineVATPage from "./features/accounting/PhilippineVATPage";
import PrimeConversionCostPage from "./features/accounting/PrimeConversionCostPage";
import QuickRatioPage from "./features/accounting/QuickRatioPage";
import ReceivablesTurnoverPage from "./features/accounting/ReceivablesTurnoverPage";
import ReturnOnAssetsPage from "./features/accounting/ReturnOnAssetsPage";
import ReturnOnEquityPage from "./features/accounting/ReturnOnEquityPage";
import StraightLineDepreciationPage from "./features/accounting/StraightLineDepreciationPage";
import TimesInterestEarnedPage from "./features/accounting/TimesInterestEarnedPage";
import UnitsOfProductionDepreciationPage from "./features/accounting/UnitsOfProductionDepreciationPage";
import VerticalAnalysisPage from "./features/accounting/VerticalAnalysisPage";
import WeightedAverageInventoryPage from "./features/accounting/WeightedAverageInventoryPage";
import AccountsPayableTurnoverPage from "./features/accounting/AccountsPayableTurnoverPage";
import BreakEvenPage from "./features/business/BreakEvenPage";
import ContributionMarginPage from "./features/business/ContributionMarginPage";
import MarginOfSafetyPage from "./features/business/MarginOfSafetyPage";
import MarkupMarginPage from "./features/business/MarkupMarginPage";
import NetProfitMarginPage from "./features/business/NetProfitMarginPage";
import OperatingLeveragePage from "./features/business/OperatingLeveragePage";
import ProfitLossPage from "./features/business/ProfitLossPage";
import TargetProfitPage from "./features/business/TargetProfitPage";
import EffectiveInterestRatePage from "./features/finance/EffectiveInterestRatePage";
import FutureValueAnnuityPage from "./features/finance/FutureValueAnnuityPage";
import FutureValuePage from "./features/finance/FutureValuePage";
import LoanAmortizationPage from "./features/finance/LoanAmortizationPage";
import PresentValueAnnuityPage from "./features/finance/PresentValueAnnuityPage";
import PresentValuePage from "./features/finance/PresentValuePage";
import SimpleInterestPage from "./features/finance/SimpleInterestPage";
import SinkingFundDepositPage from "./features/finance/SinkingFundDepositPage";
import CompoundInterestPage from "./features/finance/CompoundInterestPage";
import HomePage from "./features/home/HomePage";
import AppLayoutMetaAbout from "./features/meta/AboutPage";
import FeedbackPage from "./features/meta/FeedBackPage";
import HistoryPage from "./features/meta/HistoryPage";
import SettingsPage from "./features/meta/SettingsPage";
import SmartSolverPage from "./features/smart/SmartSolverPage";

export default function App() {
    return (
        <AppErrorBoundary>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="history" element={<HistoryPage />} />
                        <Route path="basic" element={<BasicCalculatorPage />} />
                        <Route path="smart/solver" element={<SmartSolverPage />} />

                        <Route path="finance/simple-interest" element={<SimpleInterestPage />} />
                        <Route path="finance/compound-interest" element={<CompoundInterestPage />} />
                        <Route path="finance/future-value" element={<FutureValuePage />} />
                        <Route path="finance/present-value" element={<PresentValuePage />} />
                        <Route path="finance/future-value-annuity" element={<FutureValueAnnuityPage />} />
                        <Route path="finance/present-value-annuity" element={<PresentValueAnnuityPage />} />
                        <Route path="finance/effective-interest-rate" element={<EffectiveInterestRatePage />} />
                        <Route path="finance/sinking-fund-deposit" element={<SinkingFundDepositPage />} />
                        <Route path="finance/loan-amortization" element={<LoanAmortizationPage />} />

                        <Route path="business/profit-loss" element={<ProfitLossPage />} />
                        <Route path="business/break-even" element={<BreakEvenPage />} />
                        <Route path="business/contribution-margin" element={<ContributionMarginPage />} />
                        <Route path="business/markup-margin" element={<MarkupMarginPage />} />
                        <Route path="business/target-profit" element={<TargetProfitPage />} />
                        <Route path="business/margin-of-safety" element={<MarginOfSafetyPage />} />
                        <Route path="business/net-profit-margin" element={<NetProfitMarginPage />} />
                        <Route path="business/operating-leverage" element={<OperatingLeveragePage />} />

                        <Route path="accounting/accounting-equation" element={<AccountingEquationPage />} />
                        <Route path="accounting/notes-interest" element={<NoteInterestPage />} />
                        <Route path="accounting/straight-line-depreciation" element={<StraightLineDepreciationPage />} />
                        <Route path="accounting/declining-balance-depreciation" element={<DecliningBalanceDepreciationPage />} />
                        <Route path="accounting/units-of-production-depreciation" element={<UnitsOfProductionDepreciationPage />} />
                        <Route path="accounting/cash-discount" element={<CashDiscountPage />} />
                        <Route path="accounting/fifo-inventory" element={<FIFOInventoryPage />} />
                        <Route path="accounting/weighted-average-inventory" element={<WeightedAverageInventoryPage />} />
                        <Route path="accounting/gross-profit-method" element={<GrossProfitMethodPage />} />
                        <Route path="accounting/bank-reconciliation" element={<BankReconciliationPage />} />
                        <Route path="accounting/allowance-doubtful-accounts" element={<AllowanceForDoubtfulAccountsPage />} />
                        <Route path="accounting/partnership-profit-sharing" element={<PartnershipProfitSharingPage />} />
                        <Route path="accounting/partnership-salary-interest" element={<PartnershipSalaryInterestPage />} />
                        <Route path="accounting/partnership-admission-bonus" element={<PartnershipAdmissionBonusPage />} />
                        <Route path="accounting/partnership-admission-goodwill" element={<PartnershipAdmissionGoodwillPage />} />
                        <Route path="accounting/philippine-vat" element={<PhilippineVATPage />} />
                        <Route path="accounting/cost-of-goods-manufactured" element={<CostOfGoodsManufacturedPage />} />
                        <Route path="accounting/prime-conversion-cost" element={<PrimeConversionCostPage />} />
                        <Route path="accounting/materials-price-variance" element={<MaterialsPriceVariancePage />} />
                        <Route path="accounting/labor-rate-variance" element={<LaborRateVariancePage />} />
                        <Route path="accounting/current-ratio" element={<CurrentRatioPage />} />
                        <Route path="accounting/quick-ratio" element={<QuickRatioPage />} />
                        <Route path="accounting/receivables-turnover" element={<ReceivablesTurnoverPage />} />
                        <Route path="accounting/inventory-turnover" element={<InventoryTurnoverPage />} />
                        <Route path="accounting/accounts-payable-turnover" element={<AccountsPayableTurnoverPage />} />
                        <Route path="accounting/debt-to-equity" element={<DebtToEquityPage />} />
                        <Route path="accounting/return-on-assets" element={<ReturnOnAssetsPage />} />
                        <Route path="accounting/times-interest-earned" element={<TimesInterestEarnedPage />} />
                        <Route path="accounting/debt-ratio" element={<DebtRatioPage />} />
                        <Route path="accounting/earnings-per-share" element={<EarningsPerSharePage />} />
                        <Route path="accounting/book-value-per-share" element={<BookValuePerSharePage />} />
                        <Route path="accounting/horizontal-analysis" element={<HorizontalAnalysisPage />} />
                        <Route path="accounting/vertical-analysis" element={<VerticalAnalysisPage />} />
                        <Route path="accounting/asset-turnover" element={<AssetTurnoverPage />} />
                        <Route path="accounting/return-on-equity" element={<ReturnOnEquityPage />} />

                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="settings/about" element={<AppLayoutMetaAbout />} />
                        <Route path="settings/feedback" element={<FeedbackPage />} />
                    </Route>
                </Routes>
            </HashRouter>
        </AppErrorBoundary>
    );
}
