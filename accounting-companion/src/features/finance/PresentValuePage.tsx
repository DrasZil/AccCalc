import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { timeValueSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function PresentValuePage() {
    return (
        <FormulaSolveWorkspace
            badge="Finance"
            title="Present Value"
            description="Discount or reverse-solve the time-value relationship from the same workspace by changing which variable you need."
            definition={timeValueSolveDefinition}
            defaultTarget="presentValue"
        />
    );
}
