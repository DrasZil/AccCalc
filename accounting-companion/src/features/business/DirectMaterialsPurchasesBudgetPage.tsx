import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { directMaterialsPurchasesBudgetSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function DirectMaterialsPurchasesBudgetPage() {
    return (
        <FormulaSolveWorkspace
            badge="Cost & Managerial | Budgeting"
            title="Direct Materials Purchases Budget"
            description="Convert the production budget and materials inventory policy into the quantity and cost of direct materials purchases."
            definition={directMaterialsPurchasesBudgetSolveDefinition}
        />
    );
}
