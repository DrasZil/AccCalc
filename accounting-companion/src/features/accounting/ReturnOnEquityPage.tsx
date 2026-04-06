import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { returnOnEquitySolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function ReturnOnEquityPage() {
    return (
        <FormulaSolveWorkspace
            badge="Accounting"
            title="Return on Equity"
            description="Solve for ROE, net income, or average equity from the same profitability equation."
            definition={returnOnEquitySolveDefinition}
        />
    );
}
