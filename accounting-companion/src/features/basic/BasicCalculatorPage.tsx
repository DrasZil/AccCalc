import { useEffect, useMemo, useState } from "react";
import Decimal from "decimal.js";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";

type CalcOperator = "+" | "-" | "*" | "/";
type Token = string;

type ButtonSpec = {
    label: string;
    value: string;
    kind?: "number" | "operator" | "action" | "accent";
};

type HistoryEntry = {
    expression: string;
    result: string;
};

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
        { label: "⌫", value: "BACKSPACE", kind: "action" },
        { label: "(", value: "(", kind: "operator" },
        { label: ")", value: ")", kind: "operator" },
    ],
    [
        { label: "x²", value: "SQUARE", kind: "action" },
        { label: "√", value: "SQRT", kind: "action" },
        { label: "1/x", value: "RECIPROCAL", kind: "action" },
        { label: "%", value: "%", kind: "operator" },
        { label: "÷", value: "/", kind: "operator" },
    ],
    [
        { label: "7", value: "7", kind: "number" },
        { label: "8", value: "8", kind: "number" },
        { label: "9", value: "9", kind: "number" },
        { label: "×", value: "*", kind: "operator" },
        { label: "−", value: "-", kind: "operator" },
    ],
    [
        { label: "4", value: "4", kind: "number" },
        { label: "5", value: "5", kind: "number" },
        { label: "6", value: "6", kind: "number" },
        { label: "+", value: "+", kind: "operator" },
        { label: "±", value: "SIGN", kind: "action" },
    ],
    [
        { label: "1", value: "1", kind: "number" },
        { label: "2", value: "2", kind: "number" },
        { label: "3", value: "3", kind: "number" },
        { label: ".", value: ".", kind: "number" },
        { label: "=", value: "=", kind: "accent" },
    ],
    [
        { label: "0", value: "0", kind: "number" },
    ],
];

function isOperator(token: string): token is CalcOperator {
    return token === "+" || token === "-" || token === "*" || token === "/";
}

function formatForDisplay(value: Decimal): string {
    const fixed = value.toFixed(12).replace(/(\.\d*?[1-9])0+$/u, "$1").replace(/\.0+$/u, "");
    if (fixed.length <= 16) return fixed;
    return value.toSignificantDigits(10).toString();
}

function renderToken(token: string): string {
    if (token === "*") return "×";
    if (token === "/") return "÷";
    return token;
}

function precedence(operator: CalcOperator): number {
    return operator === "+" || operator === "-" ? 1 : 2;
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
                if (!isOperator(lastToken) || precedence(lastToken) < precedence(token)) {
                    break;
                }
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

function getButtonClass(kind: ButtonSpec["kind"] = "number", value?: string) {
    const baseClass =
        "flex min-h-14 items-center justify-center rounded-[1.2rem] px-3 py-3 text-base font-semibold transition active:scale-[0.98]";

    if (value === "=") {
        return `${baseClass} bg-green-500/90 text-black hover:bg-green-400`;
    }

    if (kind === "operator") {
        return `${baseClass} border border-green-400/10 bg-green-500/12 text-green-200 hover:bg-green-500/18`;
    }

    if (kind === "action") {
        return `${baseClass} border border-white/10 bg-white/8 text-gray-100 hover:bg-white/12`;
    }

    return `${baseClass} border border-white/10 bg-black/25 text-white hover:bg-black/35`;
}

export default function BasicCalculatorPage() {
    const [currentInput, setCurrentInput] = useState("0");
    const [tokens, setTokens] = useState<Token[]>([]);
    const [memoryValue, setMemoryValue] = useState<Decimal | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [justEvaluated, setJustEvaluated] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Ready");

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
            if (previousValue.length <= 1 || (previousValue.length === 2 && previousValue.startsWith("-"))) {
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

            if (currentInput !== "0" || nextTokens.length === 0 || nextTokens[nextTokens.length - 1] === ")") {
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
                [{ expression, result: formattedResult }, ...previousHistory].slice(0, 8)
            );
            setTokens([]);
            setCurrentInput(formattedResult);
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
                    if (input.isNegative()) throw new Error("Cannot take square root of a negative number.");
                    return input.sqrt();
                }, "Square root applied");
                return;
            case "RECIPROCAL":
                applyUnaryOperation((input) => {
                    if (input.isZero()) throw new Error("Cannot divide by zero.");
                    return new Decimal(1).div(input);
                }, "Reciprocal applied");
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
            default:
                return;
        }
    }

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const { key } = event;

            if (/^\d$/u.test(key)) {
                handleAction(key);
                return;
            }

            if (key === ".") {
                handleAction(".");
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
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <CalculatorPageLayout
            badge="Core Tools"
            title="Basic Calculator"
            description="A fuller calculator with expression logic, parentheses, memory controls, keyboard support, and recent history for quick checking."
            inputSection={
                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <SectionCard className="overflow-hidden">
                        <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(2,8,6,0.94),rgba(3,4,4,0.98))] p-4 md:p-5">
                            <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-4 md:p-5">
                                <p className="min-h-6 text-right text-xs uppercase tracking-[0.18em] text-gray-500">
                                    {statusMessage}
                                </p>
                                <p className="mt-2 min-h-10 text-right text-sm text-gray-400 break-all">
                                    {expressionDisplay || "0"}
                                </p>
                                <p className="mt-3 min-h-16 text-right text-4xl font-bold tracking-tight text-white break-all md:text-5xl">
                                    {currentInput}
                                </p>
                            </div>

                            <div className="mt-4 grid grid-cols-5 gap-3">
                                {BUTTON_ROWS.flat().map((button) => (
                                    <button
                                        key={`${button.value}-${button.label}`}
                                        type="button"
                                        onClick={() => handleAction(button.value)}
                                        className={[
                                            getButtonClass(button.kind, button.value),
                                            button.value === "0" ? "col-span-5 md:col-span-1" : "",
                                        ].join(" ")}
                                    >
                                        {button.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </SectionCard>

                    <div className="space-y-6">
                        <ResultGrid columns={2}>
                            <ResultCard
                                title="Memory"
                                value={memoryValue ? formatForDisplay(memoryValue) : "Empty"}
                            />
                            <ResultCard
                                title="History Count"
                                value={String(history.length)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <h2 className="text-base font-semibold text-white">Recent Calculations</h2>

                            {history.length > 0 ? (
                                <div className="mt-4 space-y-3">
                                    {history.map((entry) => (
                                        <button
                                            key={`${entry.expression}-${entry.result}`}
                                            type="button"
                                            onClick={() => {
                                                setCurrentInput(entry.result);
                                                setTokens([]);
                                                setJustEvaluated(true);
                                                setStatusMessage("Loaded from history");
                                            }}
                                            className="block w-full rounded-[1.35rem] border border-white/10 bg-black/20 px-4 py-3 text-left transition hover:bg-white/6"
                                        >
                                            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                                                {entry.expression}
                                            </p>
                                            <p className="mt-2 text-lg font-semibold text-white">
                                                {entry.result}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 text-sm leading-6 text-gray-400">
                                    Your recent calculations will appear here once you start using the calculator.
                                </p>
                            )}
                        </SectionCard>

                        <SectionCard>
                            <h2 className="text-base font-semibold text-white">Keyboard Support</h2>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
                                    <p className="text-sm font-medium text-gray-300">Input</p>
                                    <p className="mt-2 text-sm leading-6 text-gray-400">
                                        Use `0-9`, `.`, `+`, `-`, `*`, `/`, `(`, and `)`.
                                    </p>
                                </div>
                                <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
                                    <p className="text-sm font-medium text-gray-300">Control</p>
                                    <p className="mt-2 text-sm leading-6 text-gray-400">
                                        Use `Enter` for equals, `Backspace` to delete, `Delete` for CE, and `Esc` for AC.
                                    </p>
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                </div>
            }
        />
    );
}
