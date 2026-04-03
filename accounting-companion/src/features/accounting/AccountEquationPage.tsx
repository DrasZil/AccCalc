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

export default function AccountingEquationPage() {
    const [assets, setAssets] = useState("");
    const [liabilities, setLiabilities] = useState("");
    const [equity, setEquity] = useState("");

    useSmartSolverConnector({
        assets: setAssets,
        liabilities: setLiabilities,
        equity: setEquity
    });

    const result = useMemo(() => {
        const filledValues = [assets, liabilities, equity].filter(
        (value) => value.trim() !== ""
        ).length;

        if (filledValues === 0) return null;

        if (filledValues < 2) {
        return {
            error: "Enter any 2 values so the app can solve the missing amount.",
        };
        }

        if (filledValues > 2) {
        return {
            error: "Please enter only 2 values. Leave 1 blank so it can be solved.",
        };
        }

        const assetsNumber = assets.trim() === "" ? null : Number(assets);
        const liabilitiesNumber =
        liabilities.trim() === "" ? null : Number(liabilities);
        const equityNumber = equity.trim() === "" ? null : Number(equity);

        if (
        (assetsNumber !== null && Number.isNaN(assetsNumber)) ||
        (liabilitiesNumber !== null && Number.isNaN(liabilitiesNumber)) ||
        (equityNumber !== null && Number.isNaN(equityNumber))
        ) {
        return {
            error: "All entered values must be valid numbers.",
        };
        }

        if (assetsNumber === null) {
        const solvedAssets = (liabilitiesNumber ?? 0) + (equityNumber ?? 0);

        return {
            solvedField: "Assets",
            solvedValue: solvedAssets,
            formula: <>Assets = Liabilities + Equity</>,
            steps: [
            <>Liabilities = {liabilitiesNumber}</>,
            <>Equity = {equityNumber}</>,
            <>
                Assets = {liabilitiesNumber} + {equityNumber} = {solvedAssets}
            </>,
            ],
        };
        }

        if (liabilitiesNumber === null) {
        const solvedLiabilities = assetsNumber - (equityNumber ?? 0);

        return {
            solvedField: "Liabilities",
            solvedValue: solvedLiabilities,
            formula: <>Liabilities = Assets - Equity</>,
            steps: [
            <>Assets = {assetsNumber}</>,
            <>Equity = {equityNumber}</>,
            <>
                Liabilities = {assetsNumber} - {equityNumber} = {solvedLiabilities}
            </>,
            ],
        };
        }

        const solvedEquity = assetsNumber - (liabilitiesNumber ?? 0);

        return {
        solvedField: "Equity",
        solvedValue: solvedEquity,
        formula: <>Equity = Assets - Liabilities</>,
        steps: [
            <>Assets = {assetsNumber}</>,
            <>Liabilities = {liabilitiesNumber}</>,
            <>
            Equity = {assetsNumber} - {liabilitiesNumber} = {solvedEquity}
            </>,
        ],
        };
    }, [assets, liabilities, equity]);

    return (
        <CalculatorPageLayout
        badge="Accounting"
        title="Accounting Equation Solver"
        description="Enter any 2 values and leave 1 blank. AccCalc will solve the missing amount using the accounting equation."
        inputSection={
            <InputGrid columns={3}>
            <InputCard
                label="Assets"
                value={assets}
                onChange={setAssets}
                placeholder="150000"
            />
            <InputCard
                label="Liabilities"
                value={liabilities}
                onChange={setLiabilities}
                placeholder="60000"
            />
            <InputCard
                label="Equity"
                value={equity}
                onChange={setEquity}
                placeholder="90000"
            />
            </InputGrid>
        }
        resultSection={
            result && "error" in result ? (
            <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                <p className="text-sm font-medium text-yellow-300">Input notice</p>
                <p className="mt-2 text-sm leading-6 text-yellow-200">
                {result.error}
                </p>
            </SectionCard>
            ) : result ? (
            <ResultGrid columns={2}>
                <ResultCard title="Solved Field" value={result.solvedField} />
                <ResultCard
                title="Solved Amount"
                value={formatPHP(result.solvedValue)}
                />
            </ResultGrid>
            ) : null
        }
        explanationSection={
            result && !("error" in result) ? (
            <FormulaCard formula={result.formula} steps={result.steps} />
            ) : null
        }
        />
    );
}