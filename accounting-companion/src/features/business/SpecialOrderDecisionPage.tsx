import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { specialOrderDecisionSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function SpecialOrderDecisionPage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Special Order Decision"
            description="Evaluate whether a special order adds incremental profit, then surface the break-even price needed to accept it without hurting operating income."
            definition={specialOrderDecisionSolveDefinition}
        />
    );
}
