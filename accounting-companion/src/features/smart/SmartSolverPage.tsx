import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";

export default function SmartSolverPage() {
    const [principal, setPrincipal] = useState("");
    const [rate, setRate] = useState("");
    const [time, setTime] = useState("");
    const [cost, setCost] = useState("");
    const [revenue, setRevenue] = useState("");

    const result = useMemo(() => {
        const hasPrincipal = principal !== "";
        const hasRate = rate !== "";
        const hasTime = time !== "";
        const hasCost = cost !== "";
        const hasRevenue = revenue !== "";

        if (hasPrincipal && hasRate && hasTime) {
        return {
            tool: "Simple Interest Calculator",
            reason: "You entered principal, rate, and time, which matches simple interest.",
        };
        }

        if (hasCost && hasRevenue) {
        return {
            tool: "Profit / Loss Calculator",
            reason: "You entered cost and revenue, which matches profit/loss analysis.",
        };
        }

        return {
        tool: "No strong match yet",
        reason: "Enter more fields so the app can suggest the most suitable calculator.",
        };
    }, [principal, rate, time, cost, revenue]);

    return (
        <CalculatorPageLayout
        badge="Smart Tools"
        title="Smart Solver"
        description="Enter what values you already know, and AccCalc will suggest the most suitable calculator."
        inputSection={
            <InputGrid columns={3}>
            <InputCard
                label="Principal"
                value={principal}
                onChange={setPrincipal}
                placeholder="10000"
            />
            <InputCard
                label="Rate (%)"
                value={rate}
                onChange={setRate}
                placeholder="5"
            />
            <InputCard
                label="Time"
                value={time}
                onChange={setTime}
                placeholder="2"
            />
            <InputCard
                label="Cost"
                value={cost}
                onChange={setCost}
                placeholder="5000"
            />
            <InputCard
                label="Revenue"
                value={revenue}
                onChange={setRevenue}
                placeholder="8000"
            />
            </InputGrid>
        }
        resultSection={
            <ResultGrid columns={2}>
            <ResultCard title="Suggested Tool" value={result.tool} />
            <ResultCard title="Why" value={result.reason} />
            </ResultGrid>
        }
        />
    );
}