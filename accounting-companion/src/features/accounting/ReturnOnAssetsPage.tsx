import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { returnOnAssetsSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function ReturnOnAssetsPage() {
    return (
        <FormulaSolveWorkspace
            badge="Accounting / Analysis"
            title="Return on Assets"
            description="Solve for ROA, net income, or average total assets from the same profitability relationship."
            definition={returnOnAssetsSolveDefinition}
        />
    );
}
