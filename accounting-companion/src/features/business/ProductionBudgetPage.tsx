import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { productionBudgetSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function ProductionBudgetPage() {
    return (
        <FormulaSolveWorkspace
            badge="Cost & Managerial | Budgeting"
            title="Production Budget"
            description="Turn the sales plan and finished-goods inventory policy into the required production units for the budget period."
            definition={productionBudgetSolveDefinition}
        />
    );
}
