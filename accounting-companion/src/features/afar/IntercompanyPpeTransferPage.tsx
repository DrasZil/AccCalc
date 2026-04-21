import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { intercompanyPpeTransferSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function IntercompanyPpeTransferPage() {
    return (
        <FormulaSolveWorkspace
            badge="AFAR"
            title="Intercompany PPE Transfer"
            description="Review unrealized gain, annual excess depreciation, and remaining intercompany profit on transferred property, plant, and equipment."
            definition={intercompanyPpeTransferSolveDefinition}
        />
    );
}
