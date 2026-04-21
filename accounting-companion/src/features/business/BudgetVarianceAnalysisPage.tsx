import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { budgetVarianceAnalysisSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function BudgetVarianceAnalysisPage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Budget Variance Analysis"
            description="Separate spending variance, activity variance, and the total gap from plan so flexible-budget follow-up becomes faster and easier to explain."
            definition={budgetVarianceAnalysisSolveDefinition}
        />
    );
}
