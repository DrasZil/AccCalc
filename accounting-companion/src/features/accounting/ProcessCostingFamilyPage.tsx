import ProcessCostingWorkspacePage from "./ProcessCostingWorkspacePage";
import type { ProcessCostingVariant } from "./processCosting/processCosting.types";

export default function ProcessCostingFamilyPage({
    variant,
}: {
    variant: ProcessCostingVariant;
}) {
    return <ProcessCostingWorkspacePage variant={variant} />;
}
