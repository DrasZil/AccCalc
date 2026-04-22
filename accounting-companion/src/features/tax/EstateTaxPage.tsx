import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { estateTaxSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function EstateTaxPage() {
    return (
        <FormulaSolveWorkspace
            badge="Taxation"
            title="Estate Tax Helper"
            description="Compute the net estate and estate tax due while keeping the classroom assumptions and deduction base explicit."
            definition={estateTaxSolveDefinition}
        />
    );
}
