import katex from "katex";
import { formatGuideText } from "./guideTextFormatting";

type RenderMathOptions = {
    block?: boolean;
};

const renderCache = new Map<string, Promise<string | null>>();
const BASIC_OPERATORS = /([=+\-*/()])/g;
const WORD_TOKEN = /^[A-Za-z][A-Za-z0-9]*$/;
const NUMBER_TOKEN = /^-?\d[\d,.]*%?$/;
const GREEK_MAP: Record<string, string> = {
    alpha: "\\alpha",
    beta: "\\beta",
    delta: "\\Delta",
    gamma: "\\gamma",
    lambda: "\\lambda",
    mu: "\\mu",
    pi: "\\pi",
    sigma: "\\sigma",
    theta: "\\theta",
};

function escapeTextForLatex(text: string) {
    return text.replace(/([#$%&_^{}\\])/g, "\\$1");
}

function normalizeOperators(text: string) {
    return text
        .replace(/\u00d7/g, "*")
        .replace(/\u00f7/g, "/")
        .replace(/\u2212/g, "-")
        .replace(/\u2264/g, "<=")
        .replace(/\u2265/g, ">=")
        .replace(/\u2260/g, "!=");
}

function formatMathToken(token: string) {
    const trimmed = token.trim();
    if (!trimmed) return "";

    const lowered = trimmed.toLowerCase();
    if (GREEK_MAP[lowered]) return GREEK_MAP[lowered];

    if (NUMBER_TOKEN.test(trimmed)) {
        return escapeTextForLatex(trimmed);
    }

    if (WORD_TOKEN.test(trimmed) && trimmed.length <= 4 && /[A-Z]/.test(trimmed)) {
        return trimmed;
    }

    if (/^[A-Za-z][A-Za-z0-9]*_[A-Za-z0-9]+$/.test(trimmed)) {
        const [base, subscript] = trimmed.split("_");
        return `${base}_{${subscript}}`;
    }

    if (/^[A-Za-z][A-Za-z0-9]*\^[A-Za-z0-9+-]+$/.test(trimmed)) {
        const [base, exponent] = trimmed.split("^");
        return `${base}^{${exponent}}`;
    }

    return `\\text{${escapeTextForLatex(trimmed)}}`;
}

function convertPlainTextToLatex(input: string) {
    const normalized = normalizeOperators(formatGuideText(input));
    const statements = normalized
        .split(/\s*;\s*/g)
        .map((entry) => entry.trim())
        .filter(Boolean);

    if (statements.length === 0) {
        return "";
    }

    return statements
        .map((statement) => {
            const tokens = statement
                .split(BASIC_OPERATORS)
                .map((token) => token.trim())
                .filter(Boolean);

            const rendered = tokens.map((token) => {
                if (token === "*") return "\\times";
                if (token === "/") return "\\div";
                if (token === "-") return "-";
                if (token === "+") return "+";
                if (token === "=") return "=";
                if (token === "(" || token === ")") return token;
                return formatMathToken(token);
            });

            return rendered.join(" ");
        })
        .join(" \\\\ ");
}

function resolveLatexSource(input: string) {
    return /\\[A-Za-z]+|\{|\}|\$/.test(input) &&
        !/[A-Za-z]{3,}\s+[A-Za-z]{3,}/.test(input)
        ? input
        : convertPlainTextToLatex(input);
}

function createMathMarkup(latexSource: string, block: boolean) {
    return katex.renderToString(latexSource, {
        displayMode: block,
        output: "htmlAndMathml",
        throwOnError: false,
        strict: "ignore",
        trust: false,
    });
}

export function renderMathMarkupAsync(input: string, options: RenderMathOptions = {}) {
    const normalizedInput = input.trim();
    if (!normalizedInput) {
        return Promise.resolve(null);
    }

    const cacheKey = `${options.block ? "block" : "inline"}:${normalizedInput}`;
    const cached = renderCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    const latexSource = resolveLatexSource(normalizedInput);
    if (!latexSource) {
        return Promise.resolve(null);
    }

    const renderPromise = Promise.resolve().then(() => {
        try {
            return createMathMarkup(latexSource, options.block ?? false);
        } catch {
            return null;
        }
    });

    renderCache.set(cacheKey, renderPromise);
    return renderPromise;
}
