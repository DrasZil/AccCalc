import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { quickRatioSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function QuickRatioPage() {
    return (
        <FormulaSolveWorkspace
            badge="Accounting / Analysis"
            title="Quick Ratio"
            description="Solve the acid-test ratio forward or reverse-solve one of the quick-asset components when the other pieces are known."
            definition={quickRatioSolveDefinition}
        />
    );
}
