import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { constrainedResourceProductMixSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function ConstrainedResourceProductMixPage() {
    return (
        <FormulaSolveWorkspace
            badge="Management Services"
            title="Constrained Resource Product Mix"
            description="Rank a product by contribution margin per scarce-resource unit so bottleneck decisions emphasize the limiting factor instead of raw unit margin."
            definition={constrainedResourceProductMixSolveDefinition}
        />
    );
}
