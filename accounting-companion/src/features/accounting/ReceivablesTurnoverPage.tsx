import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { receivablesTurnoverSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function ReceivablesTurnoverPage() {
    return (
        <FormulaSolveWorkspace
            badge="Accounting / Receivables"
            title="Receivables Turnover"
            description="Solve for turnover, net credit sales, or average receivables from one collection-efficiency workspace."
            definition={receivablesTurnoverSolveDefinition}
        />
    );
}
