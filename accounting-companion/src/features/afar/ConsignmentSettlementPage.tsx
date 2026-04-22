import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { consignmentSettlementSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function ConsignmentSettlementPage() {
    return (
        <FormulaSolveWorkspace
            badge="AFAR"
            title="Consignment Settlement"
            description="Separate commission, reimbursable charges, advances, and the cash still due to the consignor in one AFAR support page."
            definition={consignmentSettlementSolveDefinition}
        />
    );
}
