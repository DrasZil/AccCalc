import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { priceCostMarginSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function MarkupMarginPage() {
    return (
        <FormulaSolveWorkspace
            badge="Business"
            title="Price / Cost / Margin Planner"
            description="Switch between profit, selling price, cost, and margin targets while keeping markup and profit meaning visible."
            definition={priceCostMarginSolveDefinition}
        />
    );
}
