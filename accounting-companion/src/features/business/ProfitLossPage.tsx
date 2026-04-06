import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { profitLossSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function ProfitLossPage() {
    return (
        <FormulaSolveWorkspace
            badge="Business"
            title="Profit / Loss"
            description="Solve for profit, revenue, or cost from the same clean worksheet instead of treating each variation as a separate calculator."
            definition={profitLossSolveDefinition}
        />
    );
}
