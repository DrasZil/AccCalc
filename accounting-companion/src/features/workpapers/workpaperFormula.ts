import type {
    WorkpaperSheet,
    WorkpaperValue,
    WorkpaperWorkbook,
} from "./workpaperTypes.js";
import {
    cellInputToPrimitive,
    fromColumnLabel,
    getCellKey,
    splitCellKey,
    toColumnLabel,
} from "./workpaperUtils.js";

type FormulaToken =
    | { type: "number"; value: number }
    | { type: "operator"; value: "+" | "-" | "*" | "/" }
    | { type: "paren"; value: "(" | ")" }
    | { type: "comma" }
    | { type: "colon" }
    | { type: "ref"; value: string; sheetName?: string }
    | { type: "identifier"; value: string };

type EvaluationSuccess = {
    kind: "value";
    value: WorkpaperValue | number[];
};

type EvaluationError = {
    kind: "error";
    message: string;
};

export type EvaluatedCell = {
    display: string;
    value: WorkpaperValue;
    kind: "value" | "formula" | "error";
};

type EvaluationContext = {
    workbook: WorkpaperWorkbook;
    currentSheetId: string;
    stack: Set<string>;
};

function isDigit(char: string) {
    return char >= "0" && char <= "9";
}

function isIdentifierStart(char: string) {
    return /[A-Za-z_]/.test(char);
}

function isIdentifierPart(char: string) {
    return /[A-Za-z0-9_]/.test(char);
}

function parseReferenceToken(text: string) {
    const cellMatch = /^([A-Za-z]+)(\d+)$/.exec(text);
    if (!cellMatch) return null;

    const columnIndex = fromColumnLabel(cellMatch[1]);
    const rowIndex = Number(cellMatch[2]) - 1;

    if (!Number.isFinite(columnIndex) || !Number.isFinite(rowIndex) || rowIndex < 0) {
        return null;
    }

    return { columnIndex, rowIndex };
}

function tokenizeFormula(formula: string): FormulaToken[] {
    const tokens: FormulaToken[] = [];
    let index = 0;

    while (index < formula.length) {
        const char = formula[index] ?? "";

        if (/\s/.test(char)) {
            index += 1;
            continue;
        }

        if (char === "+" || char === "-" || char === "*" || char === "/") {
            tokens.push({ type: "operator", value: char });
            index += 1;
            continue;
        }

        if (char === "(" || char === ")") {
            tokens.push({ type: "paren", value: char });
            index += 1;
            continue;
        }

        if (char === ",") {
            tokens.push({ type: "comma" });
            index += 1;
            continue;
        }

        if (char === ":") {
            tokens.push({ type: "colon" });
            index += 1;
            continue;
        }

        if (isDigit(char) || char === ".") {
            let end = index + 1;
            while (end < formula.length && /[\d.]/.test(formula[end] ?? "")) {
                end += 1;
            }

            tokens.push({
                type: "number",
                value: Number(formula.slice(index, end)),
            });
            index = end;
            continue;
        }

        if (char === "'") {
            let end = index + 1;
            while (end < formula.length && formula[end] !== "'") {
                end += 1;
            }

            const sheetName = formula.slice(index + 1, end);
            if (formula[end + 1] !== "!") {
                throw new Error("Quoted sheet references must be followed by ! and a cell.");
            }

            let refEnd = end + 2;
            while (refEnd < formula.length && /[A-Za-z0-9]/.test(formula[refEnd] ?? "")) {
                refEnd += 1;
            }

            tokens.push({
                type: "ref",
                value: formula.slice(end + 2, refEnd),
                sheetName,
            });
            index = refEnd;
            continue;
        }

        if (isIdentifierStart(char)) {
            let end = index + 1;
            while (end < formula.length && isIdentifierPart(formula[end] ?? "")) {
                end += 1;
            }

            const tokenText = formula.slice(index, end);
            if (formula[end] === "!") {
                let refEnd = end + 1;
                while (refEnd < formula.length && /[A-Za-z0-9]/.test(formula[refEnd] ?? "")) {
                    refEnd += 1;
                }

                tokens.push({
                    type: "ref",
                    value: formula.slice(end + 1, refEnd),
                    sheetName: tokenText,
                });
                index = refEnd;
                continue;
            }

            if (parseReferenceToken(tokenText)) {
                tokens.push({ type: "ref", value: tokenText });
            } else {
                tokens.push({ type: "identifier", value: tokenText.toUpperCase() });
            }

            index = end;
            continue;
        }

        throw new Error(`Unsupported formula token "${char}".`);
    }

    return tokens;
}

function valueToNumber(value: WorkpaperValue | number[]) {
    if (Array.isArray(value)) return value.reduce((sum, item) => sum + item, 0);
    if (typeof value === "number") return value;
    if (typeof value === "boolean") return value ? 1 : 0;
    if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
        return Number(value);
    }
    return 0;
}

function valueToDisplay(value: WorkpaperValue) {
    if (value === null || value === "") return "";
    if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
    if (typeof value === "number") {
        if (Number.isInteger(value)) return value.toString();
        return value.toFixed(4).replace(/\.?0+$/, "");
    }
    return String(value);
}

function resolveSheet(context: EvaluationContext, sheetName?: string) {
    if (!sheetName) {
        return context.workbook.sheets[context.currentSheetId] ?? null;
    }

    return (
        Object.values(context.workbook.sheets).find(
            (sheet) => sheet.title.toLowerCase() === sheetName.toLowerCase()
        ) ?? null
    );
}

function evaluateCellByRef(
    context: EvaluationContext,
    currentSheet: WorkpaperSheet,
    refText: string,
    refSheetName?: string
): EvaluationSuccess | EvaluationError {
    const parsed = parseReferenceToken(refText);
    if (!parsed) {
        return { kind: "error", message: `Invalid cell reference ${refText}.` };
    }

    const targetSheet = resolveSheet(context, refSheetName) ?? currentSheet;
    const sheetKey = `${targetSheet.id}:${parsed.columnIndex}:${parsed.rowIndex}`;
    if (context.stack.has(sheetKey)) {
        return { kind: "error", message: "Circular reference detected." };
    }

    context.stack.add(sheetKey);
    try {
        const targetCell = targetSheet.cells[getCellKey(parsed.rowIndex, parsed.columnIndex)];
        if (!targetCell || !targetCell.input.trim()) {
            return { kind: "value", value: 0 };
        }

        if (targetCell.input.trim().startsWith("=")) {
            return evaluateFormulaInput(targetCell.input, {
                ...context,
                currentSheetId: targetSheet.id,
            });
        }

        return { kind: "value", value: cellInputToPrimitive(targetCell.input) };
    } finally {
        context.stack.delete(sheetKey);
    }
}

function collectRangeValues(
    context: EvaluationContext,
    currentSheet: WorkpaperSheet,
    startRef: string,
    endRef: string,
    refSheetName?: string
) {
    const start = parseReferenceToken(startRef);
    const end = parseReferenceToken(endRef);
    if (!start || !end) {
        return { kind: "error", message: "Invalid range reference." } satisfies EvaluationError;
    }

    const rowStart = Math.min(start.rowIndex, end.rowIndex);
    const rowEnd = Math.max(start.rowIndex, end.rowIndex);
    const columnStart = Math.min(start.columnIndex, end.columnIndex);
    const columnEnd = Math.max(start.columnIndex, end.columnIndex);
    const values: number[] = [];

    for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex += 1) {
        for (let columnIndex = columnStart; columnIndex <= columnEnd; columnIndex += 1) {
            const cellValue = evaluateCellByRef(
                context,
                currentSheet,
                `${toColumnLabel(columnIndex)}${rowIndex + 1}`,
                refSheetName
            );
            if (cellValue.kind === "error") {
                return cellValue;
            }
            values.push(valueToNumber(cellValue.value));
        }
    }

    return { kind: "value", value: values } as const;
}

function flattenFunctionValues(values: Array<WorkpaperValue | number[]>) {
    return values.flatMap((value) => (Array.isArray(value) ? value : [valueToNumber(value)]));
}

function parseFormulaExpression(
    tokens: FormulaToken[],
    context: EvaluationContext,
    currentSheet: WorkpaperSheet
): EvaluationSuccess | EvaluationError {
    let index = 0;

    function peek() {
        return tokens[index];
    }

    function consume() {
        const token = tokens[index];
        index += 1;
        return token;
    }

    function parsePrimary(): EvaluationSuccess | EvaluationError {
        const token = peek();
        if (!token) {
            return { kind: "error", message: "Formula ended unexpectedly." };
        }

        if (token.type === "number") {
            consume();
            return { kind: "value", value: token.value };
        }

        if (token.type === "paren" && token.value === "(") {
            consume();
            const value = parseExpression();
            const closing = peek();
            if (!closing || closing.type !== "paren" || closing.value !== ")") {
                return { kind: "error", message: "Missing closing parenthesis." };
            }
            consume();
            return value;
        }

        if (token.type === "ref") {
            consume();
            if (peek()?.type === "colon") {
                consume();
                const endToken = consume();
                if (!endToken || endToken.type !== "ref") {
                    return { kind: "error", message: "Ranges need an ending cell reference." };
                }
                return collectRangeValues(
                    context,
                    currentSheet,
                    token.value,
                    endToken.value,
                    token.sheetName
                );
            }

            return evaluateCellByRef(context, currentSheet, token.value, token.sheetName);
        }

        if (token.type === "identifier") {
            const identifier = token.value;
            consume();

            const opening = peek();
            if (!opening || opening.type !== "paren" || opening.value !== "(") {
                return { kind: "error", message: `Unknown identifier ${identifier}.` };
            }

            consume();
            const args: Array<WorkpaperValue | number[]> = [];

            while (true) {
                const nextToken = peek();
                if (!nextToken || (nextToken.type === "paren" && nextToken.value === ")")) {
                    break;
                }

                const value = parseExpression();
                if (value.kind === "error") return value;
                args.push(value.value);

                const separator = peek();
                if (separator?.type === "comma") {
                    consume();
                } else {
                    break;
                }
            }

            const closing = peek();
            if (!closing || closing.type !== "paren" || closing.value !== ")") {
                return { kind: "error", message: `Missing closing parenthesis for ${identifier}.` };
            }
            consume();

            const flattened = flattenFunctionValues(args);

            switch (identifier) {
                case "SUM":
                    return {
                        kind: "value",
                        value: flattened.reduce((sum, value) => sum + value, 0),
                    };
                case "AVERAGE":
                    return {
                        kind: "value",
                        value:
                            flattened.length > 0
                                ? flattened.reduce((sum, value) => sum + value, 0) / flattened.length
                                : 0,
                    };
                case "MIN":
                    return { kind: "value", value: flattened.length ? Math.min(...flattened) : 0 };
                case "MAX":
                    return { kind: "value", value: flattened.length ? Math.max(...flattened) : 0 };
                case "ABS":
                    return { kind: "value", value: Math.abs(flattened[0] ?? 0) };
                default:
                    return {
                        kind: "error",
                        message: `Function ${identifier} is not supported in this workpaper yet.`,
                    };
            }
        }

        return { kind: "error", message: "Unsupported formula expression." };
    }

    function parseUnary(): EvaluationSuccess | EvaluationError {
        const token = peek();
        if (token?.type === "operator" && (token.value === "+" || token.value === "-")) {
            consume();
            const value = parseUnary();
            if (value.kind === "error") return value;
            return {
                kind: "value",
                value: token.value === "-" ? -valueToNumber(value.value) : valueToNumber(value.value),
            };
        }

        return parsePrimary();
    }

    function parseTerm(): EvaluationSuccess | EvaluationError {
        let left = parseUnary();

        while (true) {
            const nextToken = peek();
            if (
                !nextToken ||
                nextToken.type !== "operator" ||
                (nextToken.value !== "*" && nextToken.value !== "/")
            ) {
                break;
            }

            const operator = consume();
            if (!operator || operator.type !== "operator") {
                return { kind: "error", message: "Expected a multiplication operator." };
            }
            const right = parseUnary();
            if (left.kind === "error") return left;
            if (right.kind === "error") return right;

            const leftValue = valueToNumber(left.value);
            const rightValue = valueToNumber(right.value);

            left = {
                kind: "value",
                value:
                    operator.value === "*"
                        ? leftValue * rightValue
                        : rightValue === 0
                          ? Number.NaN
                          : leftValue / rightValue,
            };
        }

        return left;
    }

    function parseExpression(): EvaluationSuccess | EvaluationError {
        let left = parseTerm();

        while (true) {
            const nextToken = peek();
            if (
                !nextToken ||
                nextToken.type !== "operator" ||
                (nextToken.value !== "+" && nextToken.value !== "-")
            ) {
                break;
            }

            const operator = consume();
            if (!operator || operator.type !== "operator") {
                return { kind: "error", message: "Expected an addition operator." };
            }
            const right = parseTerm();
            if (left.kind === "error") return left;
            if (right.kind === "error") return right;

            const leftValue = valueToNumber(left.value);
            const rightValue = valueToNumber(right.value);

            left = {
                kind: "value",
                value: operator.value === "+" ? leftValue + rightValue : leftValue - rightValue,
            };
        }

        return left;
    }

    const result = parseExpression();
    if (result.kind === "error") return result;
    if (index < tokens.length) {
        return { kind: "error", message: "The formula has extra trailing tokens." };
    }
    return result;
}

export function evaluateFormulaInput(
    input: string,
    context: EvaluationContext
): EvaluationSuccess | EvaluationError {
    const currentSheet = context.workbook.sheets[context.currentSheetId];
    if (!currentSheet) {
        return { kind: "error", message: "Active workpaper sheet was not found." };
    }

    try {
        const tokens = tokenizeFormula(input.trim().replace(/^=/, ""));
        return parseFormulaExpression(tokens, context, currentSheet);
    } catch (error) {
        const evaluationError: EvaluationError = {
            kind: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "This formula could not be evaluated.",
        };
        return evaluationError;
    }
}

export function evaluateCellInput(
    workbook: WorkpaperWorkbook,
    sheetId: string,
    input: string
): EvaluatedCell {
    const normalized = input.trim();
    if (!normalized) {
        return { display: "", value: "", kind: "value" };
    }

    if (!normalized.startsWith("=")) {
        const primitive = cellInputToPrimitive(normalized);
        return {
            display: valueToDisplay(primitive),
            value: primitive,
            kind: "value",
        };
    }

    const result = evaluateFormulaInput(normalized, {
        workbook,
        currentSheetId: sheetId,
        stack: new Set<string>(),
    });

    if (result.kind === "error") {
        return {
            display: `#ERROR ${result.message}`,
            value: result.message,
            kind: "error",
        };
    }

    return {
        display: valueToDisplay(result.value as WorkpaperValue),
        value: result.value as WorkpaperValue,
        kind: "formula",
    };
}

export function buildSheetValueGrid(workbook: WorkpaperWorkbook, sheetId: string) {
    const sheet = workbook.sheets[sheetId];
    if (!sheet) return [];

    return Array.from({ length: sheet.rowCount }, (_, rowIndex) =>
        Array.from({ length: sheet.columnCount }, (_, columnIndex) => {
            const input = sheet.cells[getCellKey(rowIndex, columnIndex)]?.input ?? "";
            return evaluateCellInput(workbook, sheetId, input);
        })
    );
}

export function buildSheetValueMap(workbook: WorkpaperWorkbook, sheetId: string) {
    const sheet = workbook.sheets[sheetId];
    if (!sheet) return {};

    return Object.fromEntries(
        Object.entries(sheet.cells).map(([cellKey, cell]) => [
            cellKey,
            evaluateCellInput(workbook, sheetId, cell.input),
        ])
    );
}

export function describeSheetFormulaCoverage(sheet: WorkpaperSheet) {
    let formulas = 0;
    let values = 0;

    for (const cell of Object.values(sheet.cells)) {
        if (cell.input.trim().startsWith("=")) {
            formulas += 1;
        } else if (cell.input.trim()) {
            values += 1;
        }
    }

    return { formulas, values };
}

export function getLastUsedRowIndex(sheet: WorkpaperSheet) {
    const keys = Object.keys(sheet.cells);
    if (!keys.length) return -1;
    return Math.max(...keys.map((key) => splitCellKey(key).rowIndex));
}
