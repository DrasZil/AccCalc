import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { grossProfitRateSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function GrossProfitRatePage() {
    return (
        <FormulaSolveWorkspace
            badge="Accounting / Merchandising"
            title="Gross Profit Rate"
            description="Solve for gross profit rate, net sales, or cost of goods sold from one merchandising analysis workspace."
            definition={grossProfitRateSolveDefinition}
        />
    );
}
