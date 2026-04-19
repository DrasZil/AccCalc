import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { withholdingTaxSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function WithholdingTaxPage() {
    return (
        <FormulaSolveWorkspace
            badge="Taxation"
            title="Withholding Tax"
            description="Compute tax withheld, reverse-solve the tax base or implied rate, and keep the net-after-withholding amount visible for review."
            definition={withholdingTaxSolveDefinition}
        />
    );
}
