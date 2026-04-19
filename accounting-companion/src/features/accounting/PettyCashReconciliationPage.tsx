import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { pettyCashReconciliationSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function PettyCashReconciliationPage() {
    return (
        <FormulaSolveWorkspace
            badge="FAR | Cash Control"
            title="Petty Cash Reconciliation"
            description="Check whether the petty cash fund is balanced, short, or over, while keeping the count, vouchers, and replenishment amount in one control-focused workflow."
            definition={pettyCashReconciliationSolveDefinition}
        />
    );
}
