import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { contributionMarginSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function ContributionMarginPage() {
    return (
        <FormulaSolveWorkspace
            badge="Business"
            title="Contribution Margin"
            description="Move between sales, variable costs, and contribution margin without leaving the same decision-support page."
            definition={contributionMarginSolveDefinition}
        />
    );
}
