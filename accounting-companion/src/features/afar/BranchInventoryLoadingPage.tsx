import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { branchInventoryLoadingSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function BranchInventoryLoadingPage() {
    return (
        <FormulaSolveWorkspace
            badge="AFAR"
            title="Branch Inventory Loading"
            description="Convert branch inventory billed at home-office price back to cost by isolating the loading allowance and adjusted inventory balance."
            definition={branchInventoryLoadingSolveDefinition}
        />
    );
}
