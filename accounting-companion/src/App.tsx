import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./features/layout/AppLayout";
import HomePage from "./features/home/HomePage";
import BasicCalculatorPage from "./features/basic/BasicCalculatorPage";
import SimpleInterestPage from "./features/finance/SimpleInterestPage";
import ProfitLossPage from "./features/business/ProfitLossPage";
import BreakEvenPage from "./features/business/BreakEvenPage";
import ContributionMarginPage from "./features/business/ContributionMarginPage";
import MarkupMarginPage from "./features/business/MarkupMarginPage";
import CompoundInterestPage from "./features/finance/CompoundInterestPage";
import FutureValuePage from "./features/finance/FutureValuePage";
import PresentValuePage from "./features/finance/PresentValuePage";
import StraightLineDepreciationPage from "./features/accounting/StraightLineDepreciationPage";
import DecliningBalanceDepreciationPage from "./features/accounting/DoubleDecliningBalancePage";
import LoanAmortizationPage from "./features/finance/LoanAmortizationPage";
import SmartSolverPage from "./features/smart/SmartSolverPage";
import AccountingEquationPage from "./features/accounting/AccountEquationPage";
import NoteInterestPage from "./features/accounting/NoteInterestPage";
import CashDiscountPage from "./features/accounting/CashDiscountPage";
import FIFOInventoryPage from "./features/accounting/FIFOInventoryPage";
import WeightedAverageInventoryPage from "./features/accounting/WeightedAverageInventoryPage";
import AboutPage from "./features/meta/AboutPage";
import FeedbackPage from "./features/meta/FeedBackPage";
import GrossProfitMethodPage from "./features/accounting/GrossProfitMethodPage";
import BankReconciliationPage from "./features/accounting/BankReconciliationPage";
import AllowanceForDoubtfulAccountsPage from "./features/accounting/AllowanceForDoubtfulAccountsPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="basic" element={<BasicCalculatorPage />} />
          <Route path="finance/simple-interest" element={<SimpleInterestPage />} />
          <Route path="business/profit-loss" element={<ProfitLossPage />} />
          <Route path="business/break-even" element={<BreakEvenPage />} />
          <Route path="business/contribution-margin" element={<ContributionMarginPage />} />
          <Route path="business/markup-margin" element={<MarkupMarginPage />} />
          <Route path="finance/compound-interest" element={<CompoundInterestPage />} />
          <Route path="finance/future-value" element={<FutureValuePage />} />
          <Route path="finance/present-value" element={<PresentValuePage />} />
          <Route path="finance/loan-amortization" element={<LoanAmortizationPage />} />
          <Route path="accounting/straight-line-depreciation" element={<StraightLineDepreciationPage />} />
          <Route path="accounting/declining-balance-depreciation" element={<DecliningBalanceDepreciationPage />} />
          <Route path="accounting/accounting-equation" element={<AccountingEquationPage />} />
          <Route path="accounting/notes-interest" element={<NoteInterestPage/>}/>
          <Route path="accounting/cash-discount" element={<CashDiscountPage/>}/>
          <Route path="accounting/fifo-inventory" element={<FIFOInventoryPage/>}/>
          <Route path="accounting/weighted-average-inventory" element={<WeightedAverageInventoryPage />}/>
          <Route path="accounting/gross-profit-method" element={<GrossProfitMethodPage/>} />
          <Route path="accounting/bank-reconciliation" element={<BankReconciliationPage />}/>
          <Route path="/accounting/allowance-doubtful-accounts" element={<AllowanceForDoubtfulAccountsPage />}/>
          <Route path="smart/solver" element={<SmartSolverPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
        
        </Route>
      </Routes>
    </BrowserRouter>
  );
}