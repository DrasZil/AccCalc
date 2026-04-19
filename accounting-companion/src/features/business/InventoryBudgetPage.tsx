import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { inventoryBudgetSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function InventoryBudgetPage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Inventory Budget"
            description="Translate budgeted cost of goods sold and ending-inventory policy into the merchandise purchases cost needed for the period."
            definition={inventoryBudgetSolveDefinition}
        />
    );
}
