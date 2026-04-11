export function detectPromptMistakes(prompt: string) {
    const notes: string[] = [];
    const normalized = prompt.toLowerCase();

    if (/\bper month\b/i.test(prompt) && /\bper year\b/i.test(prompt)) {
        notes.push("The prompt mixes monthly and yearly bases. Confirm the period basis before solving.");
    }

    if (/\bminus\b/i.test(prompt) && /\bplus\b/i.test(prompt)) {
        notes.push("Mixed plus/minus wording can hide a sign error.");
    }

    if (/\bunits?\b/i.test(prompt) && /%/.test(prompt)) {
        notes.push("A unit amount and a percentage appear together. Check whether the final answer should be quantity, rate, or amount.");
    }

    if (
        /\bfixed costs?\b/.test(normalized) &&
        /\bvariable costs?\b/.test(normalized) &&
        /\bcontribution margin\b/.test(normalized) &&
        !/\bper unit\b/.test(normalized)
    ) {
        notes.push("This looks like a CVP-style problem. Check whether the prompt is mixing total costs with per-unit costs.");
    }

    if (
        /\btarget profit\b/.test(normalized) &&
        /\bbreak[- ]?even\b/.test(normalized)
    ) {
        notes.push("Break-even and target-profit wording both appear. Make sure the result you want is not zero-profit break-even by mistake.");
    }

    if (
        /\bpartnership\b/.test(normalized) &&
        /\bdeficiency\b/.test(normalized) &&
        !/\binsolvent|insolvency\b/.test(normalized)
    ) {
        notes.push("A partnership deficiency appears without an insolvency cue. Check whether the deficient partner is actually assumed unable to contribute.");
    }

    if (
        /\belasticity\b/.test(normalized) &&
        /\bquantity\b/.test(normalized) &&
        /\bprice\b/.test(normalized)
    ) {
        notes.push("Elasticity wording appears. Check that the denominator and midpoint basis are not reversed.");
    }

    if (
        /\bequilibrium\b/.test(normalized) &&
        /\bdemand\b/.test(normalized) &&
        /\bsupply\b/.test(normalized)
    ) {
        notes.push("Market-equilibrium wording appears. Make sure both equations are in a consistent form before you solve.");
    }

    if (
        /\bequivalent units?\b/.test(normalized) ||
        /\btransferred[- ]in\b/.test(normalized) ||
        /\bending wip\b/.test(normalized)
    ) {
        notes.push("This looks like process costing. Check that physical units, equivalent units, and transferred-in cost are not being treated as the same thing.");
    }

    if (
        /\bnpv\b/.test(normalized) ||
        /\birr\b/.test(normalized) ||
        /\bdiscount(?:ed)? payback\b/.test(normalized)
    ) {
        notes.push("Capital-budgeting wording appears. Verify that the discount-rate basis matches the timing of the cash flows.");
    }

    return Array.from(new Set(notes));
}
