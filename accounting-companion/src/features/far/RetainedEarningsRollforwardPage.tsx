import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { retainedEarningsRollforwardSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function RetainedEarningsRollforwardPage() {
    return (
        <FormulaSolveWorkspace
            badge="FAR / Equity"
            title="Retained Earnings Rollforward"
            description="Reconcile beginning retained earnings, net income, dividends, and prior-period adjustments into the ending balance used in equity questions and statement support."
            definition={retainedEarningsRollforwardSolveDefinition}
        />
    );
}
