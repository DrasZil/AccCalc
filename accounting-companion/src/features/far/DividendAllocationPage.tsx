import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { dividendAllocationSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function DividendAllocationPage() {
    return (
        <FormulaSolveWorkspace
            badge="FAR"
            title="Dividend Allocation"
            description="Allocate declared dividends between cumulative preferred and common shareholders, including arrears and the remaining amount available to common."
            definition={dividendAllocationSolveDefinition}
        />
    );
}
