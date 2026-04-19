import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { prepaidExpenseAdjustmentSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function PrepaidExpenseAdjustmentPage() {
    return (
        <FormulaSolveWorkspace
            badge="FAR | Adjusting Entries"
            title="Prepaid Expense Adjustment"
            description="Translate beginning and ending prepaid balances into the expense recognized for the period, or reverse-solve the missing balance cleanly."
            definition={prepaidExpenseAdjustmentSolveDefinition}
        />
    );
}
