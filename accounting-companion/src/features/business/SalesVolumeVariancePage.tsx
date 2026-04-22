import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { salesVolumeVarianceSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function SalesVolumeVariancePage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Sales Volume Variance"
            description="Measure the profit effect of selling more or fewer units than planned using the budgeted contribution margin per unit."
            definition={salesVolumeVarianceSolveDefinition}
        />
    );
}
