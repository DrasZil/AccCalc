import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { accruedRevenueAdjustmentSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function AccruedRevenueAdjustmentPage() {
    return (
        <FormulaSolveWorkspace
            badge="FAR | Adjusting Entries"
            title="Accrued Revenue Adjustment"
            description="Compute the earned-but-uncollected revenue at period-end, or reverse-solve the missing earned or collected amount."
            definition={accruedRevenueAdjustmentSolveDefinition}
        />
    );
}
