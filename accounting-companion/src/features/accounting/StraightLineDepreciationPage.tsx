import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { straightLineDepreciationSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function StraightLineDepreciationPage() {
    return (
        <FormulaSolveWorkspace
            badge="Accounting"
            title="Straight-Line Depreciation"
            description="Solve for annual depreciation, cost, salvage value, or useful life while keeping the straight-line assumptions explicit."
            definition={straightLineDepreciationSolveDefinition}
        />
    );
}
