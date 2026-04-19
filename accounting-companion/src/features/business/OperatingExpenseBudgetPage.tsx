import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { operatingExpenseBudgetSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function OperatingExpenseBudgetPage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Operating Expense Budget"
            description="Budget variable and fixed operating expenses, then separate the total expense plan from the actual cash expense requirement."
            definition={operatingExpenseBudgetSolveDefinition}
        />
    );
}
