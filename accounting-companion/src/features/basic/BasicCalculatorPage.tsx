
import { useState } from "react";

export default function BasicCalculatorPage() {
    const [display, setDisplay] = useState("0");

    //helper function
    function isOperator(char: string){
        return ["+", "-", "*", "/"].includes(char);
    }

    //replace the starting 0 properly
    function handleNumberClick(value: string) {
        if (display === "0") {
            setDisplay(value);
        return;
        }
        setDisplay(display + value);
    }

    //breaks the expression into parts based on operators and checks if the current number already has a decimal point
    function handleDecimalClick() {
        const parts = display.split(/[+*/-]/);
        const currentNumber = parts[parts.length - 1];

        if (currentNumber.includes(".")) return;

        setDisplay(display + ".");
    }

    //prevents multiple operators in a row and allows changing the operator if the last character is already an operator
    function handleOperatorClick(operator: string) {
            const lastChar = display[display.length - 1];

            if (isOperator(lastChar)) {
                setDisplay(display.slice(0, -1) + operator);
                return;
            }

            setDisplay(display + operator);
    }

    function clearDisplay() {
        setDisplay("0");
    }

    //take everything except the last character and update the display, if there's only one character or if it's an error, reset to 0
    function backspace() {
        if (display.length === 1 || display === "Error") {
            setDisplay("0");
            return;
        }
        setDisplay(display.slice(0, -1));
    }

    //changes the sign of the current number
    function toggleSign() {
        if (display === "0" || display === "Error") return;

        const parts = display.split(/[+*/-]/);
        const lastPart = parts[parts.length - 1];

        if (!lastPart || isOperator(lastPart)) return;

        if (lastPart.startsWith("-")) {
            parts[parts.length - 1] = lastPart.slice(1);
        } else {
            parts[parts.length - 1] = "-" + lastPart;
        }

        setDisplay(parts.join(""));
    }

    function applyPercent() {
        if (display === "Error") return;

        const parts = display.split(/[+*/-]/);
        const lastPart = parts[parts.length - 1];

        if (!lastPart || isOperator(lastPart)) return;

        const percentValue = String(Number(lastPart) / 100);
        parts[parts.length - 1] = percentValue;

        setDisplay(parts.join(""));
    }

    function calculateResult() { 
        try {
            const lastChar = display[display.length - 1];

            if(isOperator(lastChar)) return;

            const result = eval(display);
            setDisplay(String(result));
        } catch {
            setDisplay("Error");
        }
        }

        function handleButtonClick(value: string){
            if (display === "Error") {
                if (/\d/.test(value)){
                    setDisplay(value);
                }
                return;
            }

            if (/\d/.test(value)) {
                handleNumberClick(value);
                return;
            }

            if (value === ".") {
                handleDecimalClick();
                return;
            }

            if (["+", "-", "*", "/"].includes(value)) {
                handleOperatorClick(value);
                return;
            }
        }

        const buttons = [
            ["C", "⌫", "±", "/"],
            ["7", "8", "9", "*"],
            ["4", "5", "6", "-"],
            ["1", "2", "3", "+"],
            ["%", "0", ".", "="],
        ];

        function handleSpecialButton(value: string) {
             switch (value) {
                case "C":
                    clearDisplay();
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
                case "=":
                    calculateResult();
                    break;
                case "/":
                case "*":
                case "-":
                case "+":
                case ".":
                default:
                    handleButtonClick(value);
                    break;
            }
        }

        function getButtonClass(value: string) {
            const base =
                "rounded-2xl p-4 text-lg font-semibold transition hover:opacity-90 active:scale-[0.98]";

                if (value === "C") {
                return `${base} bg-red-500/80 text-white`;
                }

                if (value === "=") {
                return `${base} bg-green-500/80 text-white`;
                }

                if (["/", "*", "-", "+", "%", "±", "⌫"].includes(value)) {
                return `${base} bg-white/10 text-white`;
                }

                return `${base} bg-white/5 text-white`;
            }

        function getOperatorDisplay(value: string) {
            if (value === "/") return "÷";
            if (value === "*") return "×";
            return value;
        }
    
        return (
            <main className="min-h-screen bg-neutral-950 text-white">
                <div className="mx-auto max-w-md p-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h1 className="text-3xl font-bold">AccCalc</h1>
                    <p className="mt-2 text-gray-300">
                        Basic calculator for quick checking and daily use.
                    </p>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
                        <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">
                            Display
                        </p>
                        <p className="min-h-12 text-right text-4xl font-bold break-all">
                            {display}
                            </p>
                    </div>

                    <div className="mt-6 grid grid-cols-4 gap-3">
                        {buttons.flat().map((button) => (
                            <button className={getButtonClass(button)}
                            key={button}
                            onClick={() => handleSpecialButton(button)}>
                                {getOperatorDisplay(button)}
                            </button>
                        ))}
                    </div>
                </div>
                </div>
            </main>
        )
}