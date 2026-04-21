import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { movingAverageForecastSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function MovingAverageForecastPage() {
    return (
        <FormulaSolveWorkspace
            badge="Operations & Supply Chain"
            title="Moving Average Forecast"
            description="Forecast short-term demand using simple and weighted moving averages so replenishment and planning decisions can react to recent demand without overcomplicating the model."
            definition={movingAverageForecastSolveDefinition}
        />
    );
}
