import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { breakEvenSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function BreakEvenPage() {
    return (
        <FormulaSolveWorkspace
            badge="Business"
            title="Break-even"
            description="Solve for units, fixed costs, selling price, or variable cost from the same CVP relationship."
            definition={breakEvenSolveDefinition}
        />
    );
}
