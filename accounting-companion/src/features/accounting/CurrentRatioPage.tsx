import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { currentRatioSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function CurrentRatioPage() {
    return (
        <FormulaSolveWorkspace
            badge="Accounting / Analysis"
            title="Current Ratio"
            description="Solve for the ratio itself or reverse-solve current assets and current liabilities from the same liquidity equation."
            definition={currentRatioSolveDefinition}
        />
    );
}
