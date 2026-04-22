import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { documentaryStampTaxSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function DocumentaryStampTaxPage() {
    return (
        <FormulaSolveWorkspace
            badge="Taxation"
            title="Documentary Stamp Tax Helper"
            description="Compute taxable units and documentary stamp tax due from the taxable base, unit rule, and per-unit rate used by the scenario."
            definition={documentaryStampTaxSolveDefinition}
        />
    );
}
