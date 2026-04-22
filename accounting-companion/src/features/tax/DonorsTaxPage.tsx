import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { donorsTaxSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function DonorsTaxPage() {
    return (
        <FormulaSolveWorkspace
            badge="Taxation"
            title="Donor's Tax Helper"
            description="Compute the taxable gift and donor's tax due while making the deduction base and tax-rate assumption visible."
            definition={donorsTaxSolveDefinition}
        />
    );
}
