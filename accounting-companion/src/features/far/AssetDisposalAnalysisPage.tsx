import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { assetDisposalSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function AssetDisposalAnalysisPage() {
    return (
        <FormulaSolveWorkspace
            badge="FAR | Assets"
            title="Asset Disposal Analysis"
            description="Separate book value, net proceeds, and gain-or-loss recognition for retirement and disposal questions without leaving the same workspace."
            definition={assetDisposalSolveDefinition}
        />
    );
}
