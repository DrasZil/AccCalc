import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { transferPricingSupportSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function TransferPricingSupportPage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Transfer Pricing Support"
            description="Compare minimum transfer price, outside-market ceiling, and negotiation range so internal transfer-pricing cases stay explainable instead of turning into hidden arithmetic."
            definition={transferPricingSupportSolveDefinition}
        />
    );
}
