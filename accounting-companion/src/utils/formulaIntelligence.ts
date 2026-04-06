import type { ReactNode } from "react";

export type FormulaFieldKind =
    | "money"
    | "percent"
    | "number"
    | "time"
    | "ratio"
    | "days";

export type FormulaFieldDefinition = {
    key: string;
    label: string;
    placeholder: string;
    kind: FormulaFieldKind;
    step?: string;
    helperText?: string;
};

export type FormulaTargetDefinition = {
    key: string;
    label: string;
    summary: string;
};

export type FormulaGlossaryItem = {
    term: string;
    meaning: ReactNode | string;
};

export type FormulaResultCard = {
    title: string;
    value: string;
    supportingText?: string;
    tone?: "default" | "accent" | "success" | "warning";
};

export type FormulaSolveSuccess = {
    primaryResult: FormulaResultCard;
    supportingResults?: FormulaResultCard[];
    formula: ReactNode | string;
    steps: Array<ReactNode | string>;
    glossary?: FormulaGlossaryItem[];
    interpretation: ReactNode | string;
    assumptions?: Array<ReactNode | string>;
    notes?: Array<ReactNode | string>;
    warnings?: Array<ReactNode | string>;
};

export type FormulaSolveFailure = {
    error: string;
};

export type FormulaSolveResult = FormulaSolveSuccess | FormulaSolveFailure;

export type FormulaCalculatorDefinition = {
    id: string;
    fields: Record<string, FormulaFieldDefinition>;
    targets: FormulaTargetDefinition[];
    defaultTarget: string;
    getInputKeys: (targetKey: string) => string[];
    getEmptyState: (targetKey: string) => { title: string; body: string };
    solve: (targetKey: string, values: Record<string, number>) => FormulaSolveResult;
};

export function isFormulaSolveFailure(
    result: FormulaSolveResult
): result is FormulaSolveFailure {
    return "error" in result;
}

export function getFormulaTarget(
    definition: FormulaCalculatorDefinition,
    targetKey: string
) {
    return (
        definition.targets.find((target) => target.key === targetKey) ??
        definition.targets[0]
    );
}

export function getInputColumns(inputCount: number) {
    if (inputCount <= 1) return 1;
    if (inputCount === 2) return 2;
    return 3;
}
