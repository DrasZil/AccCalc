import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { makeOrBuyDecisionSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function MakeOrBuyDecisionPage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Make or Buy Decision"
            description="Compare relevant internal production cost against the outside purchase cost so short-term sourcing decisions stay grounded in relevant costing instead of full-cost noise."
            definition={makeOrBuyDecisionSolveDefinition}
        />
    );
}
