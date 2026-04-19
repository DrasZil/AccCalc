import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { accruedExpenseAdjustmentSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function AccruedExpenseAdjustmentPage() {
    return (
        <FormulaSolveWorkspace
            badge="FAR | Adjusting Entries"
            title="Accrued Expense Adjustment"
            description="Compute the incurred-but-unpaid expense at period-end, or reverse-solve the missing incurred or paid amount."
            definition={accruedExpenseAdjustmentSolveDefinition}
        />
    );
}
