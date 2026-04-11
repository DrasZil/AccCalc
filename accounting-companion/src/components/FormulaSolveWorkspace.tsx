import { useEffect, useMemo, useState } from "react";
import CalculatorPageLayout from "./CalculatorPageLayout";
import FormulaCard from "./FormulaCard";
import InputCard from "./INputCard";
import InputGrid from "./InputGrid";
import ResultCard from "./resultCard";
import ResultGrid from "./ResultGrid";
import SectionCard from "./SectionCard";
import {
    getFormulaTarget,
    getInputColumns,
    isFormulaSolveFailure,
    type FormulaCalculatorDefinition,
} from "../utils/formulaIntelligence";
import { useSmartSolverConnector } from "../features/smart/smartSolver.connector";

type FormulaSolveWorkspaceProps = {
    badge?: string;
    title: string;
    description: string;
    definition: FormulaCalculatorDefinition;
    defaultTarget?: string;
    prioritizeResultSection?: boolean;
};

export default function FormulaSolveWorkspace({
    badge,
    title,
    description,
    definition,
    defaultTarget,
    prioritizeResultSection = false,
}: FormulaSolveWorkspaceProps) {
    const [values, setValues] = useState<Record<string, string>>(() =>
        Object.keys(definition.fields).reduce<Record<string, string>>((acc, key) => {
            acc[key] = "";
            return acc;
        }, {})
    );
    const [targetKey, setTargetKey] = useState<string>(
        defaultTarget ?? definition.defaultTarget
    );

    const setters = useMemo(
        () =>
            Object.keys(definition.fields).reduce<Record<string, (value: string) => void>>(
                (acc, key) => {
                    acc[key] = (value: string) =>
                        setValues((current) => ({ ...current, [key]: value }));
                    return acc;
                },
                {}
            ),
        [definition.fields]
    );

    const routeState = useSmartSolverConnector(setters);

    useEffect(() => {
        const incomingTarget = routeState?.solveTarget;
        if (!incomingTarget) return;

        const isSupported = definition.targets.some(
            (target) => target.key === incomingTarget
        );

        if (isSupported) {
            setTargetKey(incomingTarget);
        }
    }, [definition.targets, routeState?.solveTarget]);

    const resolvedTargetKey = definition.targets.some(
        (target) => target.key === targetKey
    )
        ? targetKey
        : defaultTarget ?? definition.defaultTarget;
    const target = getFormulaTarget(definition, resolvedTargetKey);
    const inputKeys = useMemo(
        () => definition.getInputKeys(target.key),
        [definition, target.key]
    );

    const parsedInputs = useMemo(
        () =>
            inputKeys.reduce<Record<string, number | null>>((acc, key) => {
                const raw = values[key]?.trim() ?? "";
                acc[key] = raw === "" ? null : Number(raw);
                return acc;
            }, {}),
        [inputKeys, values]
    );

    const allInputsFilled = inputKeys.every((key) => values[key]?.trim() !== "");

    const result = useMemo(() => {
        if (!allInputsFilled) return null;

        const numericInputs = inputKeys.reduce<Record<string, number>>((acc, key) => {
            const value = parsedInputs[key];
            if (value === null) return acc;
            acc[key] = value;
            return acc;
        }, {});

        return definition.solve(target.key, numericInputs);
    }, [allInputsFilled, definition, inputKeys, parsedInputs, target.key]);

    const emptyState = definition.getEmptyState(target.key);

    return (
        <CalculatorPageLayout
            badge={badge}
            title={title}
            description={description}
            prioritizeResultSection={prioritizeResultSection}
            headerMeta={
                <span className="app-chip inline-flex items-center rounded-full px-3 py-1 text-xs">
                    Solve for {target.label}
                </span>
            }
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="app-label">Solve for</p>
                                    <p className="app-body-md mt-1 text-sm">{target.summary}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {definition.targets.map((option) => (
                                        <button
                                            key={option.key}
                                            type="button"
                                            onClick={() => setTargetKey(option.key)}
                                            className={[
                                                "rounded-full px-3 py-1.5 text-xs font-semibold",
                                                option.key === target.key
                                                    ? "app-button-primary"
                                                    : "app-button-ghost",
                                            ].join(" ")}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[1rem] app-subtle-surface px-3.5 py-3 text-sm leading-6">
                                Enter {inputKeys.map((key) => definition.fields[key].label).join(", ")}.
                                The selected target stays computed so the page can adapt the formula,
                                interpretation, and checking notes for this exact question instead of
                                showing a one-size-fits-all explanation.
                            </div>
                        </div>
                    </SectionCard>

                    <InputGrid columns={getInputColumns(inputKeys.length)}>
                        {inputKeys.map((key) => {
                            const field = definition.fields[key];

                            return (
                                <InputCard
                                    key={field.key}
                                    label={field.label}
                                    value={values[key] ?? ""}
                                    onChange={(value) =>
                                        setValues((current) => ({ ...current, [key]: value }))
                                    }
                                    placeholder={field.placeholder}
                                    helperText={field.helperText}
                                    step={field.step}
                                />
                            );
                        })}
                    </InputGrid>
                </div>
            }
            resultSection={
                result && isFormulaSolveFailure(result) ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid
                        columns={
                            result.supportingResults && result.supportingResults.length >= 3
                                ? 4
                                : result.supportingResults && result.supportingResults.length >= 1
                                  ? 2
                                  : 1
                        }
                    >
                        <ResultCard
                            title={result.primaryResult.title}
                            value={result.primaryResult.value}
                            supportingText={result.primaryResult.supportingText}
                            tone={result.primaryResult.tone}
                        />
                        {(result.supportingResults ?? []).map((card) => (
                            <ResultCard
                                key={`${card.title}-${card.value}`}
                                title={card.title}
                                value={card.value}
                                supportingText={card.supportingText}
                                tone={card.tone}
                            />
                        ))}
                    </ResultGrid>
                ) : (
                    <SectionCard>
                        <p className="app-card-title text-sm">{emptyState.title}</p>
                        <p className="app-body-md mt-2 text-sm">{emptyState.body}</p>
                    </SectionCard>
                )
            }
            explanationSection={
                result && !isFormulaSolveFailure(result) ? (
                    <FormulaCard
                        formula={result.formula}
                        steps={result.steps}
                        glossary={result.glossary}
                        interpretation={result.interpretation}
                        assumptions={result.assumptions}
                        notes={result.notes}
                        warnings={result.warnings}
                    />
                ) : null
            }
        />
    );
}
