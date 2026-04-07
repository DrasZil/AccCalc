export type ReminderCategory =
    | "study-motivation"
    | "struggle-motivation"
    | "comfort"
    | "focus"
    | "saved-work";

export type ReminderTone =
    | "soft"
    | "focused"
    | "motivational"
    | "comforting"
    | "practical";

export type ReminderFrequency = "rare" | "light" | "moderate";

const COPY: Record<ReminderCategory, Record<ReminderTone, string[]>> = {
    "study-motivation": {
        soft: ["A short review now is easier than a rushed review later."],
        focused: ["Pick one topic, finish one clean example, and stop there."],
        motivational: ["One solved problem today still moves your grade forward."],
        comforting: ["You do not need a perfect session. A steady one is enough."],
        practical: ["Reopen the last tool and finish one pending check."],
    },
    "struggle-motivation": {
        soft: ["If the problem feels heavy, start by listing the givens only."],
        focused: ["Recheck signs, units, and period bases before changing the formula."],
        motivational: ["Confusion usually drops after one careful recomputation."],
        comforting: ["A hard set does not mean you are behind. Slow it down."],
        practical: ["Try Scan & Check or Smart Solver to structure the next step."],
    },
    comfort: {
        soft: ["Take a small breath, then return to the next clean step."],
        focused: ["Cut the task into one variable, one formula, one result."],
        motivational: ["Consistency beats intensity for retention."],
        comforting: ["A partial answer with verified inputs is still progress."],
        practical: ["Open your saved history and continue the most recent problem."],
    },
    focus: {
        soft: ["Close one distraction and finish one result card."],
        focused: ["Check the denominator before trusting the ratio."],
        motivational: ["A focused 10-minute block can fix a whole wrong setup."],
        comforting: ["You only need the next correct step, not the entire chapter."],
        practical: ["Use the calculator or workspace that matches the exact prompt."],
    },
    "saved-work": {
        soft: ["You have saved work ready to continue when you are."],
        focused: ["Resume the last saved workflow before context goes stale."],
        motivational: ["Finishing a half-done problem is often the fastest win."],
        comforting: ["Your saved work is still here when you want to return."],
        practical: ["Open History and continue the latest saved tool."],
    },
};

export function getReminderCopy(category: ReminderCategory, tone: ReminderTone) {
    return COPY[category][tone];
}

export function getReminderPreview(category: ReminderCategory, tone: ReminderTone) {
    return getReminderCopy(category, tone)[0];
}

export function getReminderFrequencyMs(frequency: ReminderFrequency) {
    switch (frequency) {
        case "rare":
            return 1000 * 60 * 60 * 8;
        case "light":
            return 1000 * 60 * 60 * 4;
        case "moderate":
            return 1000 * 60 * 60 * 2;
    }
}

