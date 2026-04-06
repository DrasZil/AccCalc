import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { inventoryTurnoverSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function InventoryTurnoverPage() {
    return (
        <FormulaSolveWorkspace
            badge="Accounting / Analysis"
            title="Inventory Turnover"
            description="Solve for turnover, cost of goods sold, or average inventory while keeping the days-in-inventory reading visible."
            definition={inventoryTurnoverSolveDefinition}
        />
    );
}
