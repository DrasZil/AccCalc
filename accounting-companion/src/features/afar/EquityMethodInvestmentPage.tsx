import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { equityMethodInvestmentSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function EquityMethodInvestmentPage() {
    return (
        <FormulaSolveWorkspace
            badge="AFAR"
            title="Equity Method Investment"
            description="Track the investment carrying amount through share in income and dividends using a clean equity-method rollforward."
            definition={equityMethodInvestmentSolveDefinition}
        />
    );
}
