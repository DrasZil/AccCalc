import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { timeValueSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function FutureValuePage() {
    return (
        <FormulaSolveWorkspace
            badge="Finance"
            title="Future Value"
            description="Use one time-value workspace to solve for future value, present value, rate, or time without switching calculators."
            definition={timeValueSolveDefinition}
            defaultTarget="futureValue"
        />
    );
}
