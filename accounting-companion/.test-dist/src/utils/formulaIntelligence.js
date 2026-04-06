export function isFormulaSolveFailure(result) {
    return "error" in result;
}
export function getFormulaTarget(definition, targetKey) {
    return (definition.targets.find((target) => target.key === targetKey) ??
        definition.targets[0]);
}
export function getInputColumns(inputCount) {
    if (inputCount <= 1)
        return 1;
    if (inputCount === 2)
        return 2;
    return 3;
}
