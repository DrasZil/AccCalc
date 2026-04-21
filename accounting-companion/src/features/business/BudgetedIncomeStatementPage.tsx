import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { budgetedIncomeStatementSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function BudgetedIncomeStatementPage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Budgeted Income Statement"
            description="Pull revenue, cost of goods sold, operating expenses, interest, and tax into one budgeted income statement view with clear statement-level interpretation."
            definition={budgetedIncomeStatementSolveDefinition}
        />
    );
}
