import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { accountingRateOfReturnSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function AccountingRateOfReturnPage() {
    return (
        <FormulaSolveWorkspace
            badge="Finance / Capital Budgeting"
            title="Accounting Rate of Return"
            description="Compute ARR from accounting income and average investment, or reverse-solve the income and investment figures that support the required rate."
            definition={accountingRateOfReturnSolveDefinition}
        />
    );
}
