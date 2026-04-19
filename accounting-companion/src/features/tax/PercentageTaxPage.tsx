import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { percentageTaxSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function PercentageTaxPage() {
    return (
        <FormulaSolveWorkspace
            badge="Taxation / Business Tax"
            title="Percentage Tax"
            description="Check percentage-tax due, taxable sales, or the implied rate for business-tax drills where the correct tax regime is already identified."
            definition={percentageTaxSolveDefinition}
        />
    );
}
