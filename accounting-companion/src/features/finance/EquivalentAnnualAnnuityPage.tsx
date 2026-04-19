import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { equivalentAnnualAnnuitySolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function EquivalentAnnualAnnuityPage() {
    return (
        <FormulaSolveWorkspace
            badge="Finance / Capital Budgeting"
            title="Equivalent Annual Annuity"
            description="Annualize NPV so projects with unequal lives can be compared on a more decision-friendly annual basis."
            definition={equivalentAnnualAnnuitySolveDefinition}
        />
    );
}
