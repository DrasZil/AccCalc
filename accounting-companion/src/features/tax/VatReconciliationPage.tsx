import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { vatReconciliationSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function VatReconciliationPage() {
    return (
        <FormulaSolveWorkspace
            badge="Taxation"
            title="VAT Reconciliation"
            description="Compare output VAT and input VAT from one setup, then read whether the period points to a net VAT payable or excess input VAT position."
            definition={vatReconciliationSolveDefinition}
        />
    );
}
