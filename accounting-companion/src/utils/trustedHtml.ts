let trustedMathPolicy:
    | {
          createHTML: (html: string) => string;
      }
    | null = null;

declare global {
    interface Window {
        trustedTypes?: {
            createPolicy: (
                name: string,
                rules: {
                    createHTML: (html: string) => string;
                }
            ) => {
                createHTML: (html: string) => string;
            };
        };
    }
}

function getTrustedMathPolicy() {
    if (trustedMathPolicy || typeof window === "undefined" || !window.trustedTypes) {
        return trustedMathPolicy;
    }

    try {
        trustedMathPolicy = window.trustedTypes.createPolicy("accalc-math-render", {
            createHTML: (html) => html,
        });
    } catch {
        trustedMathPolicy = null;
    }

    return trustedMathPolicy;
}

export function createSafeMarkup(html: string) {
    const policy = getTrustedMathPolicy();
    return {
        __html: policy ? policy.createHTML(html) : html,
    };
}
