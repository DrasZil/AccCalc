import type {
    StudyQuizQuestion,
    StudyTopic,
    StudyTopicCategory,
} from "./studyContent.js";

type GapClosureSeed = {
    id: string;
    title: string;
    shortTitle: string;
    category: StudyTopicCategory;
    summary: string;
    focus: string;
    route: string;
    relatedRoutes: string[];
    relatedTopicIds: string[];
    keywords: string[];
    scanSignals: string[];
    workedScenario: string;
    workedResult: string;
    checkpointScenario: string;
    checkpointResult: string;
    quiz: StudyQuizQuestion[];
};

function makeGapClosureTopic(seed: GapClosureSeed): StudyTopic {
    return {
        id: seed.id,
        title: seed.title,
        shortTitle: seed.shortTitle,
        category: seed.category,
        summary: seed.summary,
        intro: `This 13.4 gap-closure topic turns ${seed.focus} into a complete learn-practice-solve-review sequence.`,
        whyItMatters: [
            "It closes a category gap that is common in board-style review but hard to support with one formula.",
            "It gives students a route decision before they compute, classify, or write a conclusion.",
            "It connects the lesson, practice quiz, workspace, and workpaper follow-up into one survivable loop.",
        ],
        classContexts: [
            `${seed.shortTitle} reviewer drill`,
            "Category mini-test repair",
            "CPA-style mixed-case routing and follow-up",
        ],
        whenToUse: [
            `Use this when the prompt centers on ${seed.focus}.`,
            "Use it when a case gives facts from more than one category and you need the first route.",
            "Use it after a wrong quiz answer to repair the exact step that failed.",
        ],
        formulaOverview: [
            {
                label: "Gap-closure loop",
                expression: "Identify -> Route -> Solve -> Explain -> Repair",
                explanation:
                    "The route choice is part of the answer. The calculator or workspace should support the conclusion, not replace it.",
            },
        ],
        variableDefinitions: [
            { symbol: "Identify", meaning: "Name the controlling subject and issue" },
            { symbol: "Route", meaning: "Choose the linked lesson, quiz, workspace, or workpaper" },
            { symbol: "Repair", meaning: "Use feedback to fix the weak step before adding a harder case" },
        ],
        procedure: [
            "Classify the issue family before opening a tool.",
            "Separate facts that drive computation from facts that drive judgment.",
            "Open the linked workspace and enter only the facts the case gives.",
            "Write the result with a limitation or assumption.",
            "Use the quiz explanation or workpaper template to plan the next repair step.",
        ],
        workedExample: {
            title: `${seed.shortTitle} worked example`,
            scenario: seed.workedScenario,
            steps: [
                "Identify the controlling issue.",
                "Select the linked route.",
                "Use the workspace to structure the answer.",
                "State the result, limitation, and next review step.",
            ],
            result: seed.workedResult,
            interpretation: "A strong review answer shows the path from issue to route to conclusion.",
        },
        checkpointExample: {
            title: `${seed.shortTitle} checkpoint`,
            scenario: seed.checkpointScenario,
            steps: [
                "Find the tempting shortcut.",
                "Name the missing fact or support.",
                "Choose the repair route before repeating the problem.",
            ],
            result: seed.checkpointResult,
            interpretation:
                "The checkpoint prevents a familiar keyword from hiding a weak category decision.",
        },
        interpretation: [
            `${seed.shortTitle} work should show issue, route, result, and limitation.`,
            "For audit, tax, legal/RFBT, AIS, and governance topics, AccCalc is educational support only.",
            "The best next action should be specific: retake a quiz, solve a variation, or record the assumption.",
        ],
        commonMistakes: [
            "Treating a reviewer workspace as official authority.",
            "Skipping the route-choice step in mixed cases.",
            "Writing a number without the assumption that controls it.",
        ],
        examTraps: [
            "A case may include a familiar word from the wrong category.",
            "Non-numeric facts can control the final answer.",
            "A weak explanation can make a correct number incomplete.",
        ],
        selfCheck: [
            "Which category controls this issue?",
            "Which route should I open next?",
            "What weak step should I repair before harder mixed review?",
        ],
        practiceCues: [
            "Take the topic quiz before using a harder mixed set.",
            "Change one input or fact and explain how the conclusion changes.",
            "Use the 13.4 workpaper template to preserve the result and limitation.",
        ],
        deepDiveSections: [
            {
                id: `${seed.id}-category-closure`,
                title: "Category gap closure",
                summary: "This topic exists to fill a rounded-review gap rather than inflate content count.",
                points: [
                    `The controlling issue is ${seed.focus}.`,
                    "The linked route handles the solve or review step.",
                    "The quiz tests whether the route choice was understood.",
                ],
            },
            {
                id: `${seed.id}-mixed-review`,
                title: "Mixed-review repair",
                summary: "Use this topic as a repair stop after mixed practice.",
                points: [
                    "Identify the weak step.",
                    "Open the exact route that repairs it.",
                    "Return to mixed review only after the explanation is clear.",
                ],
                tone: "accent",
            },
        ],
        nextStepPrompts: [
            "Take the linked quiz.",
            "Open the workspace and solve a variation.",
            "Record the route and limitation in the v13.4 workpaper template.",
        ],
        keywords: seed.keywords,
        scanSignals: seed.scanSignals,
        relatedCalculatorPaths: [seed.route, ...seed.relatedRoutes],
        relatedTopicIds: seed.relatedTopicIds,
        quiz: {
            title: `${seed.shortTitle} category-gap practice`,
            intro:
                "A focused original practice set that checks issue identification, route choice, and next repair action.",
            questions: seed.quiz,
        },
    };
}

export const STUDY_HUB_EXPANSION_1340_TOPICS: StudyTopic[] = [
    makeGapClosureTopic({
        id: "audit-analytical-procedures-and-follow-up",
        title: "Audit Analytical Procedures and Follow-Up",
        shortTitle: "Audit Analytics",
        category: "Audit & Assurance",
        summary:
            "Review expectations, unexplained differences, tolerable thresholds, risk pressure, and follow-up procedures.",
        focus: "audit analytical procedures and unexplained fluctuations",
        route: "/audit/analytical-procedures-review",
        relatedRoutes: ["/audit/evidence-program-builder", "/audit/audit-planning-workspace"],
        relatedTopicIds: ["audit-going-concern-completion-review", "audit-materiality-and-misstatement-response"],
        keywords: ["analytical procedures", "expected amount", "unexplained difference", "audit follow-up"],
        scanSignals: ["analytical procedures", "expectation", "unexplained", "fluctuation"],
        workedScenario:
            "Current revenue exceeds the expected amount by more than the entered tolerable difference, and management gives only a vague explanation.",
        workedResult:
            "Use the analytical procedures review page and design follow-up because the unexplained difference and explanation quality create audit pressure.",
        checkpointScenario:
            "A student accepts a management explanation because the current amount increased in the expected direction.",
        checkpointResult:
            "Direction alone is not enough; explanations need corroboration and risk-sensitive follow-up.",
        quiz: [
            {
                id: "audit-analytics-mc-purpose",
                kind: "multiple-choice",
                prompt: "What is a key purpose of analytical procedures?",
                choices: ["Identify unusual relationships that need explanation", "Replace all substantive testing", "Set tax deadlines", "Classify contracts"],
                answerIndex: 0,
                explanation: "Analytical procedures identify relationships or fluctuations that may need follow-up.",
            },
            {
                id: "audit-analytics-tf-corroborate",
                kind: "true-false",
                prompt: "A plausible explanation should still be corroborated when risk is high.",
                answer: true,
                explanation: "Audit evidence quality matters; an explanation is not enough by itself.",
            },
            {
                id: "audit-analytics-short",
                kind: "short-answer",
                prompt: "Name one input used by the Analytical Procedures Review page.",
                acceptedAnswers: ["prior amount", "current amount", "expected amount", "tolerable difference", "inherent risk", "explanation quality"],
                explanation: "The page compares actual and expected results while considering risk and explanation quality.",
            },
        ],
    }),
    makeGapClosureTopic({
        id: "tax-deductions-substantiation-and-support",
        title: "Tax Deductions, Substantiation, and Support",
        shortTitle: "Tax Deductions",
        category: "Taxation",
        summary:
            "Separate claimed deductions, disallowed items, substantiation support, taxable income, and tax-effect exposure.",
        focus: "deduction eligibility and documentation support",
        route: "/tax/deduction-substantiation-review",
        relatedRoutes: ["/tax/taxable-income-bridge", "/tax/income-tax-payable-review"],
        relatedTopicIds: ["tax-remedies-and-deadline-triage", "taxable-income-book-tax-and-deferred-tax"],
        keywords: ["deductions", "substantiation", "disallowed items", "taxable income"],
        scanSignals: ["deduction", "substantiation", "disallowed", "documentation"],
        workedScenario:
            "A taxpayer claims expenses, but part is disallowed and part lacks documentation support.",
        workedResult:
            "Use the deduction review page to separate allowable, substantiated, unsupported, and disallowed amounts before computing tax effect.",
        checkpointScenario:
            "A student subtracts every claimed expense because it appears in the list of deductions.",
        checkpointResult:
            "Deductibility and substantiation are separate review gates.",
        quiz: [
            {
                id: "tax-deduction-mc-gates",
                kind: "multiple-choice",
                prompt: "Which two questions should be separated in deduction review?",
                choices: ["Deductibility and substantiation", "Assets and liabilities only", "Revenue and cash only", "Theme and layout"],
                answerIndex: 0,
                explanation: "A deduction may be conceptually allowable but still unsupported.",
            },
            {
                id: "tax-deduction-tf-official",
                kind: "true-false",
                prompt: "AccCalc's deduction page is official tax authority guidance.",
                answer: false,
                explanation: "It is educational support only and must be checked against current official sources for real use.",
            },
            {
                id: "tax-deduction-short",
                kind: "short-answer",
                prompt: "Name one item that can reduce supported deductions.",
                acceptedAnswers: ["disallowed items", "unsupported deductions", "lack of documentation", "substantiation gap"],
                explanation: "Disallowance and documentation gaps both reduce the supported deduction amount.",
            },
        ],
    }),
    makeGapClosureTopic({
        id: "rfbt-security-contracts-and-remedies",
        title: "RFBT Security Contracts and Remedies",
        shortTitle: "Security Remedies",
        category: "RFBT / Business Law",
        summary:
            "Review secured credit cases through obligation amount, collateral coverage, priority claims, documentation, remedy cost, and deficiency.",
        focus: "security contracts, credit transactions, and remedy exposure",
        route: "/rfbt/security-contracts-remedy-review",
        relatedRoutes: ["/rfbt/commercial-transactions-reviewer", "/rfbt/obligations-contracts-flow"],
        relatedTopicIds: ["rfbt-corporation-lifecycle-and-remedies"],
        keywords: ["security contracts", "credit transactions", "collateral", "deficiency", "remedy"],
        scanSignals: ["security contract", "collateral", "deficiency", "credit transaction"],
        workedScenario:
            "A debtor defaults, collateral value is below the obligation after priority claims and remedy costs, and documentation is incomplete.",
        workedResult:
            "Use the security-contract review page to identify deficiency exposure and documentation risk before selecting a remedy frame.",
        checkpointScenario: "A student assumes collateral always satisfies the obligation.",
        checkpointResult: "Priority claims, costs, and collateral value can leave a deficiency.",
        quiz: [
            {
                id: "security-mc-deficiency",
                kind: "multiple-choice",
                prompt: "What can create a deficiency in a secured-credit case?",
                choices: ["Net recovery below the obligation", "A perfect recovery ratio", "No obligation", "A fully supported collateral surplus"],
                answerIndex: 0,
                explanation: "A deficiency exists when net recovery does not cover the obligation.",
            },
            {
                id: "security-tf-docs",
                kind: "true-false",
                prompt: "Weak documentation can matter even when collateral value looks sufficient.",
                answer: true,
                explanation: "Documentation can affect enforcement and remedy choice.",
            },
            {
                id: "security-short",
                kind: "short-answer",
                prompt: "Name one fact used in the Security Contracts Remedy Review page.",
                acceptedAnswers: ["obligation amount", "collateral fair value", "priority claims", "documentation strength", "default severity", "remedy cost"],
                explanation: "The page combines amount, collateral, priority, documentation, default severity, and remedy cost.",
            },
        ],
    }),
    makeGapClosureTopic({
        id: "integrated-review-readiness-and-route-repair",
        title: "Integrated Review Readiness and Route Repair",
        shortTitle: "Mixed Review",
        category: "Strategic / Integrative",
        summary:
            "Use mixed-review scoring to identify whether the next repair should focus on topic identification, computation, explanation, assumptions, or follow-up.",
        focus: "CPA-style mixed review and route repair",
        route: "/strategic/cpa-integrated-review-studio",
        relatedRoutes: ["/strategic/integrative-case-mapper", "/smart/solver", "/workpapers"],
        relatedTopicIds: ["integrated-cpa-case-method", "audit-analytical-procedures-and-follow-up"],
        keywords: ["integrated review", "mixed practice", "CPA review", "topic identification", "route repair"],
        scanSignals: ["integrated review", "mixed practice", "case routing", "topic identification"],
        workedScenario:
            "A mixed set includes FAR, audit, tax, and RFBT facts. The score was low because the student computed first and routed later.",
        workedResult:
            "Use the integrated review studio to identify topic routing as the weak step, then repair with Smart Solver and the related lesson before another mixed set.",
        checkpointScenario:
            "A student retakes a mixed set without reviewing why the first attempt failed.",
        checkpointResult: "Mixed review should repair one weak step before increasing difficulty.",
        quiz: [
            {
                id: "mixed-review-mc-first",
                kind: "multiple-choice",
                prompt: "What should be checked first after a weak mixed-review attempt?",
                choices: ["The weakest step", "Only the final score", "The longest question", "The app settings"],
                answerIndex: 0,
                explanation: "The next study action should repair the weakest step, not simply repeat the whole set.",
            },
            {
                id: "mixed-review-tf-route",
                kind: "true-false",
                prompt: "Topic identification is part of the answer in a mixed CPA-style case.",
                answer: true,
                explanation: "Wrong routing can make every later computation or explanation weaker.",
            },
            {
                id: "mixed-review-short",
                kind: "short-answer",
                prompt: "Name one readiness area scored by the CPA Integrated Review Studio.",
                acceptedAnswers: ["topic identification", "computation accuracy", "explanation quality", "assumption discipline", "follow-up completion"],
                explanation: "The studio scores route choice, computation, explanation, assumptions, and follow-up.",
            },
        ],
    }),
];
