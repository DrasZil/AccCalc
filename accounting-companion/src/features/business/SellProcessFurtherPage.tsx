import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { sellProcessFurtherSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function SellProcessFurtherPage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Sell or Process Further"
            description="Compare split-off value against further-processing value using only incremental revenue and separable cost so joint-cost decisions stay conceptually clean."
            definition={sellProcessFurtherSolveDefinition}
        />
    );
}
