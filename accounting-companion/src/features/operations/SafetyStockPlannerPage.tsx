import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { safetyStockPlannerSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function SafetyStockPlannerPage() {
    return (
        <FormulaSolveWorkspace
            badge="Operations & Supply Chain"
            title="Safety Stock Planner"
            description="Compute safety stock and reorder points from demand and lead-time assumptions so inventory buffers stay visible before stockouts happen."
            definition={safetyStockPlannerSolveDefinition}
        />
    );
}
