import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { impairmentLossSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function ImpairmentLossPage() {
    return (
        <FormulaSolveWorkspace
            badge="FAR | Assets"
            title="Impairment Loss Workspace"
            description="Compare carrying amount with recoverable amount using fair value less costs to sell and value in use, then read the resulting impairment clearly."
            definition={impairmentLossSolveDefinition}
        />
    );
}
