import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { simpleInterestSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function SimpleInterestPage() {
    return (
        <FormulaSolveWorkspace
            badge="Finance"
            title="Simple Interest"
            description="Switch the solve target to find interest, principal, rate, or time without leaving the same simple-interest workflow."
            definition={simpleInterestSolveDefinition}
        />
    );
}
