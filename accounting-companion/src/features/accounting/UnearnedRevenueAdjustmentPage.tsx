import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { unearnedRevenueAdjustmentSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function UnearnedRevenueAdjustmentPage() {
    return (
        <FormulaSolveWorkspace
            badge="FAR | Adjusting Entries"
            title="Unearned Revenue Adjustment"
            description="Measure how much of an unearned revenue balance has already been earned, or reverse-solve the missing liability amount."
            definition={unearnedRevenueAdjustmentSolveDefinition}
        />
    );
}
