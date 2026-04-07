import { useEffect, useEffectEvent, useMemo, useState } from "react";
import Decimal from "decimal.js";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import DisclosurePanel from "../../components/DisclosurePanel";
import FormulaCard from "../../components/FormulaCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { saveToolRecord } from "../../utils/appActivity";
import { useAppSettings } from "../../utils/appSettings";

type CalcOperator = "+" | "-" | "*" | "/" | "^";
type Token = string;
type CalculatorMode = "basic" | "scientific";
type AngleMode = "DEG" | "RAD";

type ButtonSpec = {
    label: string;
    value: string;
    kind?: "number" | "operator" | "action" | "accent";
};

type HistoryEntry = {
    expression: string;
    result: string;
    mode: CalculatorMode;
};

type BasicCalculatorDraft = {
    currentInput: string;
    tokens: Token[];
    memoryValue: string | null;
    justEvaluated: boolean;
    statusMessage: string;
    mode: CalculatorMode;
    angleMode: AngleMode;
    lastAnswer: string | null;
};

const BASIC_CALCULATOR_DRAFT_KEY = "accalc-basic-draft";

function readBasicCalculatorDraft(): BasicCalculatorDraft | null {
    if (typeof window === "undefined") return null;

    try {
        const raw = window.localStorage.getItem(BASIC_CALCULATOR_DRAFT_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as Partial<BasicCalculatorDraft>;
        return {
            currentInput:
                typeof parsed.currentInput === "string" ? parsed.currentInput : "0",
            tokens: Array.isArray(parsed.tokens)
                ? parsed.tokens.filter((token): token is Token => typeof token === "string")
                : [],
            memoryValue:
                typeof parsed.memoryValue === "string" ? parsed.memoryValue : null,
            justEvaluated: Boolean(parsed.justEvaluated),
            statusMessage:
                typeof parsed.statusMessage === "string" ? parsed.statusMessage : "Ready",
            mode: parsed.mode === "scientific" ? "scientific" : "basic",
            angleMode: parsed.angleMode === "RAD" ? "RAD" : "DEG",
            lastAnswer: typeof parsed.lastAnswer === "string" ? parsed.lastAnswer : null,
        };
    } catch {
        return null;
    }
}

const BUTTON_ROWS: ButtonSpec[][] = [
    [
        { label: "MC", value: "MC", kind: "action" },
        { label: "MR", value: "MR", kind: "action" },
        { label: "M+", value: "M+", kind: "action" },
        { label: "M-", value: "M-", kind: "action" },
        { label: "MS", value: "MS", kind: "action" },
    ],
    [
        { label: "AC", value: "AC", kind: "action" },
        { label: "CE", value: "CE", kind: "action" },
        { label: "Back", value: "BACKSPACE", kind: "action" },
        { label: "(", value: "(", kind: "operator" },
        { label: ")", value: ")", kind: "operator" },
    ],
    [
        { label: "x^2", value: "SQUARE", kind: "action" },
        { label: "sqrt", value: "SQRT", kind: "action" },
        { label: "1/x", value: "RECIPROCAL", kind: "action" },
        { label: "%", value: "%", kind: "operator" },
        { label: "/", value: "/", kind: "operator" },
    ],
    [
        { label: "7", value: "7", kind: "number" },
        { label: "8", value: "8", kind: "number" },
        { label: "9", value: "9", kind: "number" },
        { label: "*", value: "*", kind: "operator" },
        { label: "-", value: "-", kind: "operator" },
    ],
    [
        { label: "4", value: "4", kind: "number" },
        { label: "5", value: "5", kind: "number" },
        { label: "6", value: "6", kind: "number" },
        { label: "+", value: "+", kind: "operator" },
        { label: "+/-", value: "SIGN", kind: "action" },
    ],
    [
        { label: "1", value: "1", kind: "number" },
        { label: "2", value: "2", kind: "number" },
        { label: "3", value: "3", kind: "number" },
        { label: ".", value: ".", kind: "number" },
        { label: "=", value: "=", kind: "accent" },
    ],
    [{ label: "0", value: "0", kind: "number" }],
];

const SCIENTIFIC_ROWS: ButtonSpec[][] = [
    [
        { label: "sin", value: "SIN", kind: "action" },
        { label: "cos", value: "COS", kind: "action" },
        { label: "tan", value: "TAN", kind: "action" },
        { label: "ln", value: "LN", kind: "action" },
        { label: "log", value: "LOG10", kind: "action" },
    ],
    [
        { label: "x^y", value: "^", kind: "operator" },
        { label: "pi", value: "PI", kind: "action" },
        { label: "e", value: "E_CONST", kind: "action" },
        { label: "abs", value: "ABS", kind: "action" },
        { label: "n!", value: "FACTORIAL", kind: "action" },
    ],
];

function isOperator(token: string): token is CalcOperator {
    return token === "+" || token === "-" || token === "*" || token === "/" || token === "^";
}

function formatForDisplay(value: Decimal): string {
    const fixed = value
        .toFixed(12)
        .replace(/(\.\d*?[1-9])0+$/u, "$1")
        .replace(/\.0+$/u, "");
    if (fixed.length <= 16) return fixed;
    return value.toSignificantDigits(10).toString();
}

function renderToken(token: string): string {
    if (token === "*") return "×";
    if (token === "/") return "÷";
    return token;
}

function precedence(operator: CalcOperator): number {
    if (operator === "^") return 3;
    return operator === "+" || operator === "-" ? 1 : 2;
}

function isRightAssociative(operator: CalcOperator) {
    return operator === "^";
}

function applyOperator(left: Decimal, right: Decimal, operator: CalcOperator): Decimal {
    switch (operator) {
        case "+":
            return left.plus(right);
        case "-":
            return left.minus(right);
        case "*":
            return left.times(right);
        case "/":
            if (right.isZero()) throw new Error("Cannot divide by zero.");
            return left.div(right);
        case "^":
            return left.pow(right.toNumber());
    }
}

function evaluateTokens(tokens: Token[]): Decimal {
    const outputQueue: Token[] = [];
    const operatorStack: Token[] = [];

    tokens.forEach((token) => {
        if (token === "(") {
            operatorStack.push(token);
            return;
        }

        if (token === ")") {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue.push(operatorStack.pop() as Token);
            }

            if (!operatorStack.length) {
                throw new Error("Unmatched closing parenthesis.");
            }

            operatorStack.pop();
            return;
        }

        if (isOperator(token)) {
            while (operatorStack.length) {
                const lastToken = operatorStack[operatorStack.length - 1];
                if (!isOperator(lastToken)) {
                    break;
                }
                const shouldPop = isRightAssociative(token)
                    ? precedence(lastToken) > precedence(token)
                    : precedence(lastToken) >= precedence(token);
                if (!shouldPop) break;
                outputQueue.push(operatorStack.pop() as Token);
            }

            operatorStack.push(token);
            return;
        }

        outputQueue.push(token);
    });

    while (operatorStack.length) {
        const operator = operatorStack.pop() as Token;
        if (operator === "(" || operator === ")") {
            throw new Error("Unmatched opening parenthesis.");
        }
        outputQueue.push(operator);
    }

    const evaluationStack: Decimal[] = [];

    outputQueue.forEach((token) => {
        if (!isOperator(token)) {
            evaluationStack.push(new Decimal(token));
            return;
        }

        const right = evaluationStack.pop();
        const left = evaluationStack.pop();

        if (!left || !right) {
            throw new Error("Invalid expression.");
        }

        evaluationStack.push(applyOperator(left, right, token));
    });

    if (evaluationStack.length !== 1) {
        throw new Error("Invalid expression.");
    }

    return evaluationStack[0];
}

function getLastExplicitNumber(tokens: Token[]): Decimal | null {
    for (let index = tokens.length - 1; index >= 0; index -= 1) {
        const token = tokens[index];
        if (token === ")" || token === "(" || isOperator(token)) continue;

        try {
            return new Decimal(token);
        } catch {
            return null;
        }
    }

    return null;
}

function factorial(value: Decimal) {
    if (!value.isInteger() || value.isNegative()) {
        throw new Error("Factorial needs a non-negative whole number.");
    }

    if (value.greaterThan(170)) {
        throw new Error("Factorial is limited to 170 to avoid overflow.");
    }

    let result = new Decimal(1);
    for (let index = 2; index <= value.toNumber(); index += 1) {
        result = result.times(index);
    }
    return result;
}

function toRadians(value: Decimal, angleMode: AngleMode) {
    return angleMode === "DEG" ? value.times(Math.PI).div(180) : value;
}

function getButtonClass(kind: ButtonSpec["kind"] = "number", value?: string) {
    const baseClass =
        "flex min-h-14 items-center justify-center rounded-[1.2rem] px-3 py-3 text-base font-semibold transition active:scale-[0.98]";

    if (value === "=") {
        return `${baseClass} bg-green-500/90 text-black hover:bg-green-400`;
    }

    if (kind === "operator") {
        return `${baseClass} border border-green-400/10 bg-green-500/[0.12] text-green-200 hover:bg-green-500/[0.18]`;
    }

    if (kind === "action") {
        return `${baseClass} border border-white/10 bg-white/[0.08] text-gray-100 hover:bg-white/[0.12]`;
    }

    return `${baseClass} border border-white/10 bg-black/25 text-white hover:bg-black/35`;
}

export default function BasicCalculatorPage() {
    const settings = useAppSettings();
    const savedDraft = useMemo(() => readBasicCalculatorDraft(), []);
    const [currentInput, setCurrentInput] = useState(savedDraft?.currentInput ?? "0");
    const [tokens, setTokens] = useState<Token[]>(savedDraft?.tokens ?? []);
    const [memoryValue, setMemoryValue] = useState<Decimal | null>(() => {
        if (!savedDraft?.memoryValue) return null;

        try {
            return new Decimal(savedDraft.memoryValue);
        } catch {
            return null;
        }
    });
    const [history, setHistory] = useState<HistoryEntry[]>(() => {
        if (typeof window === "undefined") return [];

        try {
            const raw = window.localStorage.getItem("accalc-basic-history");
            if (!raw) return [];
            const parsed = JSON.parse(raw) as HistoryEntry[];
            return Array.isArray(parsed) ? parsed.slice(0, 12) : [];
        } catch {
            return [];
        }
    });
    const [justEvaluated, setJustEvaluated] = useState(savedDraft?.justEvaluated ?? false);
    const [statusMessage, setStatusMessage] = useState(savedDraft?.statusMessage ?? "Ready");
    const [mode, setMode] = useState<CalculatorMode>(savedDraft?.mode ?? "scientific");
    const [angleMode, setAngleMode] = useState<AngleMode>(savedDraft?.angleMode ?? "DEG");
    const [lastAnswer, setLastAnswer] = useState<string | null>(savedDraft?.lastAnswer ?? null);

    const expressionDisplay = useMemo(() => {
        const displayTokens = [...tokens];

        if (
            currentInput !== "0" ||
            displayTokens.length === 0 ||
            isOperator(displayTokens[displayTokens.length - 1]) ||
            displayTokens[displayTokens.length - 1] === "("
        ) {
            if (!(displayTokens.length === 0 && currentInput === "0" && !justEvaluated)) {
                displayTokens.push(currentInput);
            }
        }

        return displayTokens.map(renderToken).join(" ");
    }, [currentInput, justEvaluated, tokens]);

    function clearAll() {
        setCurrentInput("0");
        setTokens([]);
        setJustEvaluated(false);
        setStatusMessage("Cleared");
    }

    function clearEntry() {
        setCurrentInput("0");
        setStatusMessage("Entry cleared");
    }

    function resetForFreshInput(nextValue: string) {
        setTokens([]);
        setCurrentInput(nextValue);
        setJustEvaluated(false);
    }

    function inputDigit(digit: string) {
        if (justEvaluated && tokens.length === 0) {
            resetForFreshInput(digit);
            return;
        }

        setCurrentInput((previousValue) => {
            if (previousValue === "0") return digit;
            if (previousValue === "-0") return `-${digit}`;
            return previousValue + digit;
        });
        setJustEvaluated(false);
    }

    function inputDecimal() {
        if (justEvaluated && tokens.length === 0) {
            resetForFreshInput("0.");
            return;
        }

        setCurrentInput((previousValue) => {
            if (previousValue.includes(".")) return previousValue;
            return `${previousValue}.`;
        });
        setJustEvaluated(false);
    }

    function toggleSign() {
        setCurrentInput((previousValue) => {
            if (previousValue === "0") return previousValue;
            return previousValue.startsWith("-")
                ? previousValue.slice(1)
                : `-${previousValue}`;
        });
        setJustEvaluated(false);
    }

    function backspace() {
        if (justEvaluated) {
            setCurrentInput("0");
            setJustEvaluated(false);
            return;
        }

        setCurrentInput((previousValue) => {
            if (
                previousValue.length <= 1 ||
                (previousValue.length === 2 && previousValue.startsWith("-"))
            ) {
                return "0";
            }
            return previousValue.slice(0, -1);
        });
    }

    function applyUnaryOperation(transform: (value: Decimal) => Decimal, label: string) {
        try {
            const transformedValue = transform(new Decimal(currentInput));
            setCurrentInput(formatForDisplay(transformedValue));
            setStatusMessage(label);
            setJustEvaluated(false);
        } catch (error) {
            setCurrentInput("0");
            setTokens([]);
            setStatusMessage(error instanceof Error ? error.message : "Calculation error");
        }
    }

    function applyPercent() {
        try {
            const currentValue = new Decimal(currentInput);
            const lastNumber = getLastExplicitNumber(tokens);
            const lastToken = tokens[tokens.length - 1];

            const percentValue =
                lastNumber && isOperator(lastToken) && (lastToken === "+" || lastToken === "-")
                    ? lastNumber.times(currentValue).div(100)
                    : currentValue.div(100);

            setCurrentInput(formatForDisplay(percentValue));
            setStatusMessage("Percent applied");
            setJustEvaluated(false);
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : "Calculation error");
        }
    }

    function pushOperator(operator: CalcOperator) {
        setTokens((previousTokens) => {
            const nextTokens = [...previousTokens];

            if (justEvaluated) {
                setJustEvaluated(false);
            }

            if (
                currentInput !== "0" ||
                nextTokens.length === 0 ||
                nextTokens[nextTokens.length - 1] === ")"
            ) {
                if (!(nextTokens[nextTokens.length - 1] === ")" && currentInput === "0")) {
                    nextTokens.push(currentInput);
                }
            }

            if (isOperator(nextTokens[nextTokens.length - 1])) {
                nextTokens[nextTokens.length - 1] = operator;
            } else {
                nextTokens.push(operator);
            }

            return nextTokens;
        });

        setCurrentInput("0");
        setStatusMessage(`Operator ${renderToken(operator)} selected`);
    }

    function openParenthesis() {
        setTokens((previousTokens) => {
            const nextTokens = [...previousTokens];

            if (justEvaluated) {
                setJustEvaluated(false);
            }

            if (
                (currentInput !== "0" && nextTokens[nextTokens.length - 1] !== "(") ||
                nextTokens[nextTokens.length - 1] === ")"
            ) {
                if (currentInput !== "0") {
                    nextTokens.push(currentInput);
                }
                nextTokens.push("*");
            }

            nextTokens.push("(");
            return nextTokens;
        });

        setCurrentInput("0");
        setStatusMessage("Opened parenthesis");
    }

    function closeParenthesis() {
        setTokens((previousTokens) => {
            const openCount = previousTokens.filter((token) => token === "(").length;
            const closeCount = previousTokens.filter((token) => token === ")").length;

            if (openCount <= closeCount) return previousTokens;

            const nextTokens = [...previousTokens];
            const lastToken = nextTokens[nextTokens.length - 1];

            if (!isOperator(lastToken) && lastToken !== "(" && currentInput !== "0") {
                nextTokens.push(currentInput);
            } else if (currentInput !== "0" && lastToken !== "(") {
                nextTokens.push(currentInput);
            }

            nextTokens.push(")");
            return nextTokens;
        });

        setCurrentInput("0");
        setStatusMessage("Closed parenthesis");
    }

    function evaluateExpression() {
        try {
            const finalTokens = [...tokens];
            const lastToken = finalTokens[finalTokens.length - 1];

            if (
                currentInput !== "0" ||
                finalTokens.length === 0 ||
                isOperator(lastToken) ||
                lastToken === "("
            ) {
                if (!(finalTokens.length === 0 && currentInput === "0")) {
                    finalTokens.push(currentInput);
                }
            }

            if (!finalTokens.length) return;

            const result = evaluateTokens(finalTokens);
            const formattedResult = formatForDisplay(result);
            const expression = finalTokens.map(renderToken).join(" ");

            setHistory((previousHistory) =>
                [{ expression, result: formattedResult, mode }, ...previousHistory].slice(0, 12)
            );
            saveToolRecord({
                title: "Scientific Calculator",
                path: "/basic",
                input: expression,
                result: formattedResult,
            });
            setTokens([]);
            setCurrentInput(formattedResult);
            setLastAnswer(formattedResult);
            setJustEvaluated(true);
            setStatusMessage("Calculated");
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : "Calculation error");
        }
    }

    function updateMemory(mode: "MC" | "MR" | "M+" | "M-" | "MS") {
        try {
            const currentValue = new Decimal(currentInput);

            if (mode === "MC") {
                setMemoryValue(null);
                setStatusMessage("Memory cleared");
                return;
            }

            if (mode === "MR") {
                if (memoryValue) {
                    setCurrentInput(formatForDisplay(memoryValue));
                    setJustEvaluated(false);
                    setStatusMessage("Memory recalled");
                }
                return;
            }

            if (mode === "MS") {
                setMemoryValue(currentValue);
                setStatusMessage("Stored to memory");
                return;
            }

            if (mode === "M+") {
                setMemoryValue((previousValue) =>
                    previousValue ? previousValue.plus(currentValue) : currentValue
                );
                setStatusMessage("Added to memory");
                return;
            }

            if (mode === "M-") {
                setMemoryValue((previousValue) =>
                    previousValue ? previousValue.minus(currentValue) : currentValue.negated()
                );
                setStatusMessage("Subtracted from memory");
            }
        } catch {
            setStatusMessage("Memory action failed");
        }
    }

    function insertConstant(value: Decimal, label: string) {
        setCurrentInput(formatForDisplay(value));
        setJustEvaluated(false);
        setStatusMessage(`${label} inserted`);
    }

    function handleAction(value: string) {
        if (/^\d$/u.test(value)) {
            inputDigit(value);
            return;
        }

        switch (value) {
            case ".":
                inputDecimal();
                return;
            case "AC":
                clearAll();
                return;
            case "CE":
                clearEntry();
                return;
            case "BACKSPACE":
                backspace();
                return;
            case "SIGN":
                toggleSign();
                return;
            case "SQUARE":
                applyUnaryOperation((input) => input.times(input), "Squared");
                return;
            case "SQRT":
                applyUnaryOperation((input) => {
                    if (input.isNegative()) {
                        throw new Error("Cannot take square root of a negative number.");
                    }
                    return input.sqrt();
                }, "Square root applied");
                return;
            case "RECIPROCAL":
                applyUnaryOperation((input) => {
                    if (input.isZero()) throw new Error("Cannot divide by zero.");
                    return new Decimal(1).div(input);
                }, "Reciprocal applied");
                return;
            case "ABS":
                applyUnaryOperation((input) => input.abs(), "Absolute value");
                return;
            case "SIN":
                applyUnaryOperation(
                    (input) => new Decimal(Math.sin(toRadians(input, angleMode).toNumber())),
                    `Sine in ${angleMode}`
                );
                return;
            case "COS":
                applyUnaryOperation(
                    (input) => new Decimal(Math.cos(toRadians(input, angleMode).toNumber())),
                    `Cosine in ${angleMode}`
                );
                return;
            case "TAN":
                applyUnaryOperation(
                    (input) => new Decimal(Math.tan(toRadians(input, angleMode).toNumber())),
                    `Tangent in ${angleMode}`
                );
                return;
            case "LN":
                applyUnaryOperation((input) => {
                    if (input.lte(0)) throw new Error("Natural log needs a positive number.");
                    return new Decimal(Math.log(input.toNumber()));
                }, "Natural log");
                return;
            case "LOG10":
                applyUnaryOperation((input) => {
                    if (input.lte(0)) throw new Error("Common log needs a positive number.");
                    return new Decimal(Math.log10(input.toNumber()));
                }, "Common log");
                return;
            case "FACTORIAL":
                applyUnaryOperation((input) => factorial(input), "Factorial");
                return;
            case "%":
                applyPercent();
                return;
            case "(":
                openParenthesis();
                return;
            case ")":
                closeParenthesis();
                return;
            case "+":
            case "-":
            case "*":
            case "/":
            case "^":
                pushOperator(value);
                return;
            case "=":
                evaluateExpression();
                return;
            case "MC":
            case "MR":
            case "M+":
            case "M-":
            case "MS":
                updateMemory(value);
                return;
            case "PI":
                insertConstant(new Decimal(Math.PI), "π");
                return;
            case "E_CONST":
                insertConstant(new Decimal(Math.E), "e");
                return;
            case "ANS":
                if (lastAnswer) {
                    setCurrentInput(lastAnswer);
                    setJustEvaluated(false);
                    setStatusMessage("Last answer recalled");
                }
                return;
            default:
                return;
        }
    }

    useEffect(() => {
        if (typeof window === "undefined") return;

        if (!settings.saveOfflineHistory) {
            window.localStorage.removeItem(BASIC_CALCULATOR_DRAFT_KEY);
            return;
        }

        window.localStorage.setItem(
            BASIC_CALCULATOR_DRAFT_KEY,
            JSON.stringify({
                currentInput,
                tokens,
                memoryValue: memoryValue?.toString() ?? null,
                justEvaluated,
                statusMessage,
                mode,
                angleMode,
                lastAnswer,
            } satisfies BasicCalculatorDraft)
        );
    }, [
        angleMode,
        currentInput,
        justEvaluated,
        lastAnswer,
        memoryValue,
        mode,
        settings.saveOfflineHistory,
        statusMessage,
        tokens,
    ]);

    useEffect(() => {
        if (!settings.saveOfflineHistory || typeof window === "undefined") return;
        window.localStorage.setItem("accalc-basic-history", JSON.stringify(history));
    }, [history, settings.saveOfflineHistory]);

    const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
        const { key } = event;

        if (/^\d$/u.test(key)) {
            handleAction(key);
            return;
        }

        if (key === ".") {
            handleAction(".");
            return;
        }

        if (key === "^") {
            handleAction("^");
            return;
        }

        if (key === "Backspace") {
            event.preventDefault();
            handleAction("BACKSPACE");
            return;
        }

        if (key === "Delete") {
            event.preventDefault();
            handleAction("CE");
            return;
        }

        if (key === "Escape") {
            event.preventDefault();
            handleAction("AC");
            return;
        }

        if (key === "Enter" || key === "=") {
            event.preventDefault();
            handleAction("=");
            return;
        }

        if (key === "(" || key === ")") {
            handleAction(key);
            return;
        }

        if (key === "%") {
            handleAction("%");
            return;
        }

        if (["+", "-", "*", "/"].includes(key)) {
            handleAction(key);
        }
    });

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <CalculatorPageLayout
            badge="Core Tools"
            title="Scientific Calculator"
            description="A stronger general calculator with scientific functions, memory controls, expression handling, keyboard support, and reusable recent results."
            inputSection={
                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <SectionCard className="overflow-hidden">
                        <div className="rounded-[1.7rem] border app-divider bg-[linear-gradient(180deg,var(--app-elevated),var(--app-surface))] p-4 md:p-5">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap gap-2">
                                    {(["basic", "scientific"] as const).map((calculatorMode) => (
                                        <button
                                            key={calculatorMode}
                                            type="button"
                                            onClick={() => setMode(calculatorMode)}
                                            className={[
                                                "rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]",
                                                mode === calculatorMode
                                                    ? "app-button-primary"
                                                    : "app-button-ghost",
                                            ].join(" ")}
                                        >
                                            {calculatorMode}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {(["DEG", "RAD"] as const).map((currentMode) => (
                                        <button
                                            key={currentMode}
                                            type="button"
                                            onClick={() => setAngleMode(currentMode)}
                                            className={[
                                                "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]",
                                                angleMode === currentMode
                                                    ? "app-button-secondary"
                                                    : "app-button-ghost",
                                            ].join(" ")}
                                        >
                                            {currentMode}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="app-subtle-surface rounded-[1.5rem] p-4 md:p-5">
                                <p className="app-label min-h-6 text-right">
                                    {statusMessage}
                                </p>
                                <p className="app-body-md app-numeric mt-2 min-h-10 break-all text-right text-sm">
                                    {expressionDisplay || "0"}
                                </p>
                                <p className="app-value-display min-h-16 break-all text-right md:text-[3.35rem]">
                                    {currentInput}
                                </p>
                            </div>

                            <div className="mt-4 space-y-3">
                                {mode === "scientific"
                                    ? SCIENTIFIC_ROWS.map((row, rowIndex) => (
                                          <div
                                              key={`scientific-${rowIndex}`}
                                              className="grid grid-cols-5 gap-3"
                                          >
                                              {row.map((button) => (
                                                  <button
                                                      key={`${button.value}-${button.label}`}
                                                      type="button"
                                                      onClick={() => handleAction(button.value)}
                                                      className={getButtonClass(
                                                          button.kind,
                                                          button.value
                                                      )}
                                                  >
                                                      {button.label}
                                                  </button>
                                              ))}
                                          </div>
                                      ))
                                    : null}

                                {BUTTON_ROWS.map((row, rowIndex) => (
                                    <div key={`row-${rowIndex}`} className="grid grid-cols-5 gap-3">
                                        {row.map((button) => (
                                            <button
                                                key={`${button.value}-${button.label}`}
                                                type="button"
                                                onClick={() => handleAction(button.value)}
                                                className={[
                                                    getButtonClass(button.kind, button.value),
                                                    button.value === "0"
                                                        ? "col-span-5 md:col-span-1"
                                                        : "",
                                                ].join(" ")}
                                            >
                                                {button.label}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SectionCard>

                    <div className="space-y-6">
                        <ResultGrid columns={4}>
                            <ResultCard title="Mode" value={mode} />
                            <ResultCard title="Angle" value={angleMode} />
                            <ResultCard
                                title="Memory"
                                value={memoryValue ? formatForDisplay(memoryValue) : "Empty"}
                            />
                            <ResultCard
                                title="Last Answer"
                                value={lastAnswer ?? "None"}
                                supportingText={`History: ${history.length}`}
                                tone="accent"
                            />
                        </ResultGrid>

                        <SectionCard>
                            <h2 className="app-section-title text-base">Recent Calculations</h2>

                            {history.length > 0 ? (
                                <div className="mt-4 space-y-3">
                                    {history.map((entry) => (
                                        <button
                                            key={`${entry.expression}-${entry.result}-${entry.mode}`}
                                            type="button"
                                            onClick={() => {
                                                setCurrentInput(entry.result);
                                                setTokens([]);
                                                setJustEvaluated(true);
                                                setStatusMessage("Loaded from history");
                                            }}
                                            className="app-list-link block w-full rounded-[1.35rem] px-4 py-3 text-left transition"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="app-section-kicker text-xs">
                                                    {entry.mode}
                                                </p>
                                                <p className="app-helper text-xs">
                                                    {entry.expression}
                                                </p>
                                            </div>
                                            <p className="app-value-display mt-2 text-[1.45rem]">
                                                {entry.result}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="app-body-md mt-4 text-sm">
                                    Your recent calculations will appear here once you start using the calculator.
                                </p>
                            )}
                        </SectionCard>

                        <SectionCard>
                            <DisclosurePanel
                                title="Scientific controls"
                                summary="Functions, constants, and desktop shortcuts."
                                badge="Guide"
                            >
                                <div className="space-y-4">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="app-subtle-surface rounded-[1rem] p-4">
                                            <p className="app-card-title text-sm">Input</p>
                                            <p className="app-body-md mt-2 text-sm">
                                                Use `0-9`, `.`, `+`, `-`, `*`, `/`, `^`, `(`, and `)`.
                                            </p>
                                        </div>
                                        <div className="app-subtle-surface rounded-[1rem] p-4">
                                            <p className="app-card-title text-sm">Control</p>
                                            <p className="app-body-md mt-2 text-sm">
                                                Use `Enter` for equals, `Backspace` to delete, `Delete` for CE, and `Esc` for AC.
                                            </p>
                                        </div>
                                    </div>

                                    <FormulaCard
                                        formula="Scientific mode keeps expression solving separate from one-value scientific functions."
                                        steps={[
                                            "Build the expression first when you need parentheses or order of operations.",
                                            "Use sin, cos, tan, ln, log, abs, factorial, pi, and e on the current display value.",
                                            "Use Ans or memory keys when you need to reuse a result quickly.",
                                        ]}
                                        interpretation="This calculator now behaves more like a real study or desk calculator: arithmetic stays deterministic, scientific functions stay explicit, and reused answers remain close at hand."
                                        warnings={[
                                            "Trig functions follow the DEG or RAD toggle.",
                                            "Factorial only works for non-negative whole numbers.",
                                            "Logarithms require positive input values.",
                                        ]}
                                    />
                                </div>
                            </DisclosurePanel>
                        </SectionCard>
                    </div>
                </div>
            }
        />
    );
}





