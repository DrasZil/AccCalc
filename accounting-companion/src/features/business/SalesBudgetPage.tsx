import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { salesBudgetSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function SalesBudgetPage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Sales Budget"
            description="Translate planned unit sales and selling price into the revenue budget that drives collections, production, and broader master-budget flow."
            definition={salesBudgetSolveDefinition}
        />
    );
}
