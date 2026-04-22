import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { salesMixVarianceSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function SalesMixVariancePage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Sales Mix Variance"
            description="Measure how the actual product mix changes profit when compared with the budgeted mix and contribution margin assumptions."
            definition={salesMixVarianceSolveDefinition}
        />
    );
}
