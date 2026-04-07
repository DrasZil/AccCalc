export function detectPromptMistakes(prompt: string) {
    const notes: string[] = [];

    if (/\bper month\b/i.test(prompt) && /\bper year\b/i.test(prompt)) {
        notes.push("The prompt mixes monthly and yearly bases. Confirm the period basis before solving.");
    }

    if (/\bminus\b/i.test(prompt) && /\bplus\b/i.test(prompt)) {
        notes.push("Mixed plus/minus wording can hide a sign error.");
    }

    if (/\bunits?\b/i.test(prompt) && /%/.test(prompt)) {
        notes.push("A unit amount and a percentage appear together. Check whether the final answer should be quantity, rate, or amount.");
    }

    return notes;
}

