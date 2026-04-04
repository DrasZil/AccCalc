import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function InventoryTurnoverPage() {
    const [costOfGoodsSold, setCostOfGoodsSold] = useState("");
    const [averageInventory, setAverageInventory] = useState("");

    useSmartSolverConnector({
        costOfGoodsSold: setCostOfGoodsSold,
        averageInventory: setAverageInventory,
    });

    const result = useMemo(() => {
        if (costOfGoodsSold.trim() === "" || averageInventory.trim() === "") {
            return null;
        }

        const parsedCostOfGoodsSold = Number(costOfGoodsSold);
        const parsedAverageInventory = Number(averageInventory);

        if (Number.isNaN(parsedCostOfGoodsSold) || Number.isNaN(parsedAverageInventory)) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedCostOfGoodsSold < 0 || parsedAverageInventory < 0) {
            return { error: "Cost of goods sold and average inventory cannot be negative." };
        }

        if (parsedCostOfGoodsSold === 0) {
            return { error: "Cost of goods sold must be greater than zero for turnover analysis." };
        }

        if (parsedAverageInventory === 0) {
            return { error: "Average inventory cannot be zero for inventory turnover analysis." };
        }

        const inventoryTurnover = parsedCostOfGoodsSold / parsedAverageInventory;
        const daysInInventory = 365 / inventoryTurnover;

        return {
            inventoryTurnover,
            daysInInventory,
            formula: (
                <>
                    Inventory Turnover = Cost of Goods Sold / Average Inventory
                    <br />
                    Days in Inventory = 365 / Inventory Turnover
                </>
            ),
            steps: [
                `Inventory Turnover = ${formatPHP(parsedCostOfGoodsSold)} / ${formatPHP(parsedAverageInventory)} = ${inventoryTurnover.toFixed(2)} times`,
                `Days in Inventory = 365 / ${inventoryTurnover.toFixed(2)} = ${daysInInventory.toFixed(2)} days`,
            ],
            glossary: [
                { term: "Cost of Goods Sold", meaning: "The cost assigned to goods actually sold during the period." },
                { term: "Average Inventory", meaning: "Average amount invested in inventory for the period." },
                { term: "Inventory Turnover", meaning: "How many times inventory is sold or used up during the period." },
                { term: "Days in Inventory", meaning: "Estimated number of days goods stay in inventory before being sold." },
            ],
            interpretation: `Inventory turns about ${inventoryTurnover.toFixed(2)} times per year, meaning goods stay in stock for around ${daysInInventory.toFixed(2)} days on average.`,
        };
    }, [averageInventory, costOfGoodsSold]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Analysis"
            title="Inventory Turnover"
            description="Compute inventory turnover and days in inventory for merchandising and financial statement analysis."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Cost of Goods Sold"
                            value={costOfGoodsSold}
                            onChange={setCostOfGoodsSold}
                            placeholder="300000"
                        />
                        <InputCard
                            label="Average Inventory"
                            value={averageInventory}
                            onChange={setAverageInventory}
                            placeholder="60000"
                        />
                    </InputGrid>
                </SectionCard>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={2}>
                        <ResultCard title="Inventory Turnover" value={`${result.inventoryTurnover.toFixed(2)} times`} />
                        <ResultCard title="Days in Inventory" value={`${result.daysInInventory.toFixed(2)} days`} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula={result.formula}
                        steps={result.steps}
                        glossary={result.glossary}
                        interpretation={result.interpretation}
                    />
                ) : null
            }
        />
    );
}
