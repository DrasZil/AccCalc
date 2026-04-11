import { formatGuideText } from "./guideTextFormatting";

type RenderMathOptions = {
    block?: boolean;
};

type MathJaxTexSvgResult = {
    outerHTML?: string;
};

type MathJaxBrowserGlobal = {
    startup?: {
        promise?: Promise<unknown>;
        typeset?: boolean;
    };
    tex?: Record<string, unknown>;
    svg?: Record<string, unknown>;
    options?: Record<string, unknown>;
    tex2svgPromise?: (
        tex: string,
        options?: { display?: boolean }
    ) => Promise<MathJaxTexSvgResult>;
    tex2svg?: (tex: string, options?: { display?: boolean }) => MathJaxTexSvgResult;
};

declare global {
    interface Window {
        MathJax?: MathJaxBrowserGlobal;
    }
}

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

let mathJaxReadyPromise: Promise<MathJaxBrowserGlobal | null> | null = null;

function escapeTextForMathJax(text: string) {
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
        return escapeTextForMathJax(trimmed);
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

    return `\\text{${escapeTextForMathJax(trimmed)}}`;
}

function convertPlainTextToMathJax(input: string) {
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

function resolveTexSource(input: string) {
    return /\\[A-Za-z]+|\{|\}|\$/.test(input) &&
        !/[A-Za-z]{3,}\s+[A-Za-z]{3,}/.test(input)
        ? input
        : convertPlainTextToMathJax(input);
}

function buildMathJaxConfig(existing?: MathJaxBrowserGlobal | null): MathJaxBrowserGlobal {
    return {
        ...(existing ?? {}),
        startup: {
            ...(existing?.startup ?? {}),
            typeset: false,
        },
        options: {
            ...(existing?.options ?? {}),
            enableMenu: false,
        },
        tex: {
            ...(existing?.tex ?? {}),
            inlineMath: [["\\(", "\\)"]],
            displayMath: [
                ["$$", "$$"],
                ["\\[", "\\]"],
            ],
            packages: {
                "[+]": ["base", "ams", "newcommand", "textmacros", "html", "noerrors", "noundefined"],
            },
        },
        svg: {
            ...(existing?.svg ?? {}),
            fontCache: "none",
        },
    };
}

async function loadMathJaxBrowser() {
    if (typeof window === "undefined") {
        return null;
    }

    const existing = window.MathJax;
    if (existing?.tex2svgPromise || existing?.tex2svg) {
        await existing.startup?.promise?.catch(() => undefined);
        return existing;
    }

    if (!mathJaxReadyPromise) {
        window.MathJax = buildMathJaxConfig(existing);
        mathJaxReadyPromise = import("mathjax-full/es5/tex-svg.js")
            .then(async () => {
                const nextMathJax = window.MathJax ?? null;
                await nextMathJax?.startup?.promise?.catch(() => undefined);
                return nextMathJax;
            })
            .catch(() => null);
    }

    return mathJaxReadyPromise;
}

async function createMathMarkup(texSource: string, block: boolean) {
    const mathJax = await loadMathJaxBrowser();
    if (!mathJax) return null;

    const renderedNode = mathJax.tex2svgPromise
        ? await mathJax.tex2svgPromise(texSource, { display: block })
        : mathJax.tex2svg?.(texSource, { display: block });

    return renderedNode?.outerHTML ?? null;
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

    const texSource = resolveTexSource(normalizedInput);
    if (!texSource) {
        return Promise.resolve(null);
    }

    const renderPromise = createMathMarkup(texSource, options.block ?? false).catch(() => null);
    renderCache.set(cacheKey, renderPromise);
    return renderPromise;
}
