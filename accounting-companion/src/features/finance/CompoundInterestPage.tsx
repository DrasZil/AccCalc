import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { compoundInterestSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function CompoundInterestPage() {
    return (
        <FormulaSolveWorkspace
            badge="Finance"
            title="Compound Interest"
            description="Solve for the accumulated amount, original principal, annual rate, or time while keeping compounding frequency explicit."
            definition={compoundInterestSolveDefinition}
        />
    );
}
