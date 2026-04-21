import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { factoryOverheadBudgetSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function FactoryOverheadBudgetPage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Factory Overhead Budget"
            description="Separate variable and fixed factory overhead, then roll them into a clean total-overhead budget for manufacturing planning."
            definition={factoryOverheadBudgetSolveDefinition}
        />
    );
}
