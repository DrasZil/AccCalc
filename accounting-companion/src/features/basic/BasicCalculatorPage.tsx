import { useEffect, useMemo, useState } from "react";
import Decimal from "decimal.js";

type Operator = "+" | "-" | "*" | "/" | null;

function operate(
    left: Decimal,
    right: Decimal,
    operator: Exclude<Operator, null>
    ) {
    switch (operator) {
        case "+":
        return left.plus(right);
        case "-":
        return left.minus(right);
        case "*":
        return left.times(right);
        case "/":
        if (right.isZero()) {
            throw new Error("Cannot divide by zero");
        }
        return left.div(right);
    }
    }

    function normalizeDisplay(value: string): string {
    if (value === "Error") return value;
    if (!value.includes(".")) return value;
    return value.replace(/(\.\d*?[1-9])0+$/u, "$1").replace(/\.0+$/u, "");
    }

    function formatDecimal(value: Decimal): string {
    const normalized = normalizeDisplay(value.toFixed(12));
    if (normalized.length <= 14) return normalized;
    return value.toExponential(8).replace(/\.?0+e/u, "e");
    }

    export default function BasicCalculatorPage() {
    const [display, setDisplay] = useState("0");
    const [storedValue, setStoredValue] = useState<Decimal | null>(null);
    const [pendingOperator, setPendingOperator] = useState<Operator>(null);
    const [waitingForNextValue, setWaitingForNextValue] = useState(false);
    const [expression, setExpression] = useState("");
    const [lastOperand, setLastOperand] = useState<Decimal | null>(null);

    const buttons = useMemo(
        () => [
        ["AC", "⌫", "±", "/"],
        ["7", "8", "9", "*"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "+"],
        ["%", "0", ".", "="],
        ],
        []
    );

    function getOperatorDisplay(value: string) {
        if (value === "/") return "÷";
        if (value === "*") return "×";
        return value;
    }

    function getButtonClass(value: string) {
        const base =
        "rounded-2xl p-4 text-lg font-semibold transition hover:opacity-90 active:scale-[0.98]";

        if (value === "AC") return `${base} bg-red-500/80 text-white`;
        if (value === "=") return `${base} bg-green-500/80 text-white`;

        if (["/", "*", "-", "+", "%", "±", "⌫"].includes(value)) {
        return `${base} bg-white/10 text-white`;
        }

        return `${base} bg-white/5 text-white`;
    }

    function clearAll() {
        setDisplay("0");
        setStoredValue(null);
        setPendingOperator(null);
        setWaitingForNextValue(false);
        setExpression("");
        setLastOperand(null);
    }

    function inputDigit(digit: string) {
        if (display === "Error") {
        setDisplay(digit);
        setWaitingForNextValue(false);
        return;
        }

        if (waitingForNextValue) {
        setDisplay(digit);
        setWaitingForNextValue(false);
        return;
        }

        setDisplay((prev) => (prev === "0" ? digit : prev + digit));
    }

    function inputDecimal() {
        if (display === "Error") {
        setDisplay("0.");
        setWaitingForNextValue(false);
        return;
        }

        if (waitingForNextValue) {
        setDisplay("0.");
        setWaitingForNextValue(false);
        return;
        }

        if (!display.includes(".")) {
        setDisplay((prev) => prev + ".");
        }
    }

    function backspace() {
        if (display === "Error") {
        clearAll();
        return;
        }

        if (waitingForNextValue) return;

        setDisplay((prev) => {
        if (prev.length <= 1 || (prev.length === 2 && prev.startsWith("-"))) {
            return "0";
        }
        return prev.slice(0, -1);
        });
    }

    function toggleSign() {
        if (display === "Error") return;
        if (display === "0") return;

        setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : `-${prev}`));
    }

    function applyPercent() {
        if (display === "Error") return;

        try {
        const currentValue = new Decimal(display);

        if (storedValue !== null && pendingOperator) {
            let percentValue: Decimal;

            if (pendingOperator === "+" || pendingOperator === "-") {
            percentValue = storedValue.times(currentValue).div(100);
            } else {
            percentValue = currentValue.div(100);
            }

            setDisplay(formatDecimal(percentValue));
            setWaitingForNextValue(false);
            return;
        }

        const percent = currentValue.div(100);
        setDisplay(formatDecimal(percent));
        } catch {
        setDisplay("Error");
        }
    }

    function performCalculation(nextOperator: Exclude<Operator, null>) {
        if (display === "Error") return;

        try {
        const currentValue = new Decimal(display);

        if (storedValue === null) {
            setStoredValue(currentValue);
            setPendingOperator(nextOperator);
            setExpression(
            `${formatDecimal(currentValue)} ${getOperatorDisplay(nextOperator)}`
            );
            setWaitingForNextValue(true);
            setLastOperand(null);
            return;
        }

        if (waitingForNextValue) {
            setPendingOperator(nextOperator);
            setExpression(
            `${formatDecimal(storedValue)} ${getOperatorDisplay(nextOperator)}`
            );
            return;
        }

        if (pendingOperator) {
            const result = operate(storedValue, currentValue, pendingOperator);
            const formatted = formatDecimal(result);

            setDisplay(formatted);
            setStoredValue(result);
            setPendingOperator(nextOperator);
            setExpression(`${formatted} ${getOperatorDisplay(nextOperator)}`);
            setWaitingForNextValue(true);
            setLastOperand(currentValue);
        }
        } catch {
        setDisplay("Error");
        setStoredValue(null);
        setPendingOperator(null);
        setWaitingForNextValue(false);
        setExpression("");
        setLastOperand(null);
        }
    }

    function calculateResult() {
        if (display === "Error") return;

        try {
        if (pendingOperator && storedValue !== null && !waitingForNextValue) {
            const currentValue = new Decimal(display);
            const result = operate(storedValue, currentValue, pendingOperator);
            const formatted = formatDecimal(result);

            setExpression(
            `${formatDecimal(storedValue)} ${getOperatorDisplay(
                pendingOperator
            )} ${formatDecimal(currentValue)} =`
            );
            setDisplay(formatted);
            setStoredValue(result);
            setLastOperand(currentValue);
            setWaitingForNextValue(true);
            return;
        }

        if (pendingOperator && storedValue !== null && waitingForNextValue && lastOperand !== null) {
            const result = operate(storedValue, lastOperand, pendingOperator);
            const formatted = formatDecimal(result);

            setExpression(
            `${formatDecimal(storedValue)} ${getOperatorDisplay(
                pendingOperator
            )} ${formatDecimal(lastOperand)} =`
            );
            setDisplay(formatted);
            setStoredValue(result);
            setWaitingForNextValue(true);
        }
        } catch {
        setDisplay("Error");
        setStoredValue(null);
        setPendingOperator(null);
        setWaitingForNextValue(false);
        setExpression("");
        setLastOperand(null);
        }
    }

    function handleButtonClick(value: string) {
        if (/^\d$/u.test(value)) {
        inputDigit(value);
        return;
        }

        switch (value) {
        case ".":
            inputDecimal();
            break;
        case "AC":
            clearAll();
            break;
        case "⌫":
            backspace();
            break;
        case "±":
            toggleSign();
            break;
        case "%":
            applyPercent();
            break;
        case "+":
        case "-":
        case "*":
        case "/":
            performCalculation(value);
            break;
        case "=":
            calculateResult();
            break;
        default:
            break;
        }
    }

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
        const { key } = event;

        if (/^\d$/u.test(key)) {
            handleButtonClick(key);
            return;
        }

        if (key === ".") {
            handleButtonClick(".");
            return;
        }

        if (key === "Backspace") {
            event.preventDefault();
            handleButtonClick("⌫");
            return;
        }

        if (key === "Escape") {
            handleButtonClick("AC");
            return;
        }

        if (key === "Enter" || key === "=") {
            event.preventDefault();
            handleButtonClick("=");
            return;
        }

        if (["+", "-", "*", "/"].includes(key)) {
            handleButtonClick(key);
        }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-md p-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h1 className="text-3xl font-bold">AccCalc</h1>
            <p className="mt-2 text-gray-300">
                A Basic calculator for daily use and quick checking.
            </p>

            <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="min-h-6 text-right text-sm text-gray-500 break-all">
                {expression || " "}
                </p>
                <p className="mt-2 min-h-14 text-right text-4xl font-bold break-all">
                {normalizeDisplay(display)}
                </p>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-3">
                {buttons.flat().map((button) => (
                <button
                    key={button}
                    className={getButtonClass(button)}
                    onClick={() => handleButtonClick(button)}
                >
                    {getOperatorDisplay(button)}
                </button>
                ))}
            </div>
            </div>
        </div>
        </main>
    );
}