import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { directLaborBudgetSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function DirectLaborBudgetPage() {
    return (
        <FormulaSolveWorkspace
            badge="Managerial & Cost"
            title="Direct Labor Budget"
            description="Translate the production plan into required labor hours, hourly-rate assumptions, and total direct labor cost so the master-budget flow stays complete."
            definition={directLaborBudgetSolveDefinition}
        />
    );
}
