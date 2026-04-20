import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { intercompanyInventoryProfitSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function IntercompanyInventoryProfitPage() {
    return (
        <FormulaSolveWorkspace
            badge="AFAR"
            title="Intercompany Inventory Profit Elimination"
            description="Estimate the unrealized intercompany profit still embedded in ending inventory so consolidation-support work can start from a reliable amount."
            definition={intercompanyInventoryProfitSolveDefinition}
        />
    );
}
