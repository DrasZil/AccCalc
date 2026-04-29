import type {
    StudyQuizQuestion,
    StudyTopic,
    StudyTopicCategory,
} from "./studyContent.js";

type TopicSeed = {
    id: string;
    title: string;
    shortTitle: string;
    category: StudyTopicCategory;
    summary: string;
    intro: string;
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

function makeFinalTopic(seed: TopicSeed): StudyTopic {
    return {
        id: seed.id,
        title: seed.title,
        shortTitle: seed.shortTitle,
        category: seed.category,
        summary: seed.summary,
        intro: seed.intro,
        whyItMatters: [
            `It turns ${seed.focus} into a repeatable academic review path.`,
            "It connects reviewer judgment to a concrete AccCalc workspace instead of leaving the topic as isolated notes.",
            "It prepares students for mixed CPA-review prompts where classification, computation, and response choice appear together.",
        ],
        classContexts: [
            `${seed.shortTitle} classroom review`,
            "Board-style mixed problem routing",
            "Lesson-end practice followed by a solving workspace",
        ],
        whenToUse: [
            `Use this when the prompt centers on ${seed.focus}.`,
            "Use it before calculating if the first decision is classification, risk response, or evidence direction.",
            "Use it after a quiz miss to repair the route-choice step before reopening the calculator.",
        ],
        formulaOverview: [
            {
                label: "Integrated academic loop",
                expression: "Issue -> rule or framework -> evidence or computation -> response",
                explanation:
                    "This final expansion topic is built to move from lesson reading into a practice check and then into the linked workspace.",
            },
        ],
        variableDefinitions: [
            { symbol: "Issue", meaning: "The controlling academic question in the case" },
            { symbol: "Route", meaning: "The calculator, reviewer, or workspace that best supports the next step" },
            { symbol: "Response", meaning: "The conclusion, warning, procedure, or follow-up action after solving" },
        ],
        procedure: [
            "Name the controlling issue before using a number or rule label.",
            "Separate classification from computation.",
            "Open the linked workspace and enter only the facts that the case actually gives.",
            "Read the response signal, then state one assumption or limitation in your answer.",
            "Use the quiz explanation to decide whether to return to the lesson or continue to another route.",
        ],
        workedExample: {
            title: `${seed.shortTitle} worked example`,
            scenario: seed.workedScenario,
            steps: [
                "Identify the controlling issue.",
                "Choose the linked AccCalc route.",
                "Apply the rule, computation, or review framework.",
                "State the response and the limitation.",
            ],
            result: seed.workedResult,
            interpretation:
                "A strong answer explains why the route fits, not only what the final number or label says.",
        },
        checkpointExample: {
            title: `${seed.shortTitle} checkpoint`,
            scenario: seed.checkpointScenario,
            steps: [
                "Pause at the first uncertain label.",
                "Ask which fact would change the answer.",
                "Route to the most specific lesson, quiz, or workspace.",
            ],
            result: seed.checkpointResult,
            interpretation:
                "The checkpoint is meant to prevent a familiar keyword from sending the student to a weaker route.",
        },
        interpretation: [
            `${seed.shortTitle} answers should connect the issue, the supporting route, and the response.`,
            "When facts are missing, state the missing fact instead of pretending certainty.",
            "Use the calculator or reviewer result as evidence for a classroom explanation, not as a substitute for judgment.",
        ],
        commonMistakes: [
            "Jumping to a formula or conclusion before identifying the issue.",
            "Ignoring a qualitative fact that changes the response.",
            "Treating a review score or classification as final authority without stating assumptions.",
        ],
        examTraps: [
            "A prompt may include the right keyword for the wrong route.",
            "A small numeric difference can matter if it crosses a threshold.",
            "A classification topic may require a reviewer workspace rather than a pure calculator.",
        ],
        selfCheck: [
            "What is the first issue I must classify?",
            "Which linked route should I use next?",
            "What assumption or limitation should I write beside the answer?",
        ],
        practiceCues: [
            "Answer the quiz before opening the calculator if the topic is mostly classification.",
            "Open the route after the quiz and solve the same scenario with different facts.",
            "Write one sentence explaining why a tempting alternative route is weaker.",
        ],
        deepDiveSections: [
            {
                id: `${seed.id}-reviewer-bridge`,
                title: "Reviewer bridge",
                summary:
                    "This bridge keeps conceptual review, practice, and solving connected in one topic family.",
                points: [
                    `Start with ${seed.focus}.`,
                    "Use the linked quiz to test the route decision.",
                    "Use the workspace result to write the response and limitation.",
                ],
            },
            {
                id: `${seed.id}-mistake-repair`,
                title: "Mistake repair path",
                summary:
                    "When the first answer is wrong, repair the route choice before repeating the calculation.",
                points: [
                    "Re-read the prompt for classification language.",
                    "Mark the fact that changes the answer most.",
                    "Open the related lesson or workspace instead of retrying the same route blindly.",
                ],
                tone: "warning",
            },
        ],
        nextStepPrompts: [
            "Take the linked practice set and read every explanation.",
            "Open the related workspace and solve a small variation.",
            "Return to a related topic if the route choice still feels uncertain.",
        ],
        keywords: seed.keywords,
        scanSignals: seed.scanSignals,
        relatedCalculatorPaths: [seed.route, ...seed.relatedRoutes],
        relatedTopicIds: seed.relatedTopicIds,
        quiz: {
            title: `${seed.shortTitle} practice set`,
            intro:
                "A compact, original practice set that checks classification, response choice, and the linked solving route.",
            questions: seed.quiz,
        },
    };
}

export const STUDY_HUB_EXPANSION_1310_TOPICS: StudyTopic[] = [
    makeFinalTopic({
        id: "audit-materiality-and-misstatement-response",
        title: "Audit Materiality and Misstatement Response",
        shortTitle: "Audit Materiality",
        category: "Audit & Assurance",
        summary:
            "Review planning materiality, performance materiality, clearly trivial thresholds, and aggregate misstatement pressure.",
        intro:
            "Audit materiality questions are strongest when students separate the planning threshold, the performance threshold, and the completion-stage response to uncorrected misstatements.",
        focus: "audit materiality thresholds and misstatement pressure",
        route: "/audit/materiality-and-misstatement-planner",
        relatedRoutes: ["/audit/misstatement-evaluation-workspace", "/audit/audit-sampling-planner"],
        relatedTopicIds: ["audit-evidence-sufficiency-and-procedure-design"],
        keywords: ["audit materiality", "performance materiality", "clearly trivial", "uncorrected misstatement"],
        scanSignals: ["planning materiality", "performance materiality", "clearly trivial", "misstatement"],
        workedScenario:
            "Profit before tax is used as a benchmark. Expected misstatement plus known uncorrected items now approaches performance materiality.",
        workedResult:
            "Use the materiality planner, compare aggregate pressure with performance materiality, and expand follow-up when the cushion is thin or negative.",
        checkpointScenario:
            "A student compares misstatements only with planning materiality and ignores performance materiality.",
        checkpointResult:
            "Performance materiality is the tighter classroom threshold for reducing aggregation risk.",
        quiz: [
            {
                id: "audit-materiality-mc-threshold",
                kind: "multiple-choice",
                prompt: "Which threshold is usually tighter than overall planning materiality?",
                choices: ["Performance materiality", "Benchmark amount", "Gross revenue", "Management forecast"],
                answerIndex: 0,
                explanation:
                    "Performance materiality is set below overall materiality to reduce the risk that aggregate misstatements exceed the overall threshold.",
            },
            {
                id: "audit-materiality-tf-trivial",
                kind: "true-false",
                prompt: "Clearly trivial items can still matter if they reveal a pattern or control issue.",
                answer: true,
                explanation:
                    "Clearly trivial is not a license to ignore qualitative patterns, fraud indicators, or control implications.",
            },
            {
                id: "audit-materiality-short",
                kind: "short-answer",
                prompt: "What should be compared with performance materiality during misstatement review?",
                acceptedAnswers: ["aggregate misstatement", "aggregate misstatements", "expected and identified misstatements", "uncorrected misstatements"],
                explanation:
                    "The review looks at aggregate expected and identified misstatement pressure, not each item in isolation.",
            },
            {
                id: "audit-materiality-mc-route",
                kind: "multiple-choice",
                prompt: "Which AccCalc route is the best first stop for this topic?",
                choices: ["Audit Materiality and Misstatement Planner", "VAT Reconciliation", "Contribution Margin", "Market Equilibrium"],
                answerIndex: 0,
                explanation:
                    "The materiality planner is designed for planning thresholds, clearly trivial amounts, and misstatement cushion.",
            },
        ],
    }),
    makeFinalTopic({
        id: "income-tax-payable-credits-and-overpayment",
        title: "Income Tax Payable, Credits, and Overpayment",
        shortTitle: "Tax Payable",
        category: "Taxation",
        summary:
            "Bridge taxable income into gross tax due, credit application, final payable, or overpayment review.",
        intro:
            "Income-tax review does not stop at taxable income. Students also need to reconcile credits, payments, refundable items, and penalties before reading the final position.",
        focus: "income-tax payable and credit reconciliation",
        route: "/tax/income-tax-payable-review",
        relatedRoutes: ["/tax/taxable-income-bridge", "/tax/tax-compliance-review"],
        relatedTopicIds: ["taxable-income-book-tax-and-deferred-tax"],
        keywords: ["income tax payable", "tax credits", "withholding credits", "overpayment", "tax refund"],
        scanSignals: ["income tax payable", "withholding credits", "quarterly payments", "overpayment"],
        workedScenario:
            "A taxpayer has taxable income, withholding credits, quarterly tax payments, and a small penalty after the deadline.",
        workedResult:
            "Compute gross tax due, subtract credits and payments, add penalties, then classify the remaining amount as payable or overpayment.",
        checkpointScenario:
            "A student reports gross tax due as final tax payable even though withholding credits are provided.",
        checkpointResult:
            "Credits and payments must be applied before the final payable or overpayment is read.",
        quiz: [
            {
                id: "tax-payable-mc-order",
                kind: "multiple-choice",
                prompt: "Which item is subtracted from gross income tax due in the review workspace?",
                choices: ["Withholding credits", "Planning materiality", "Contribution margin", "Control risk"],
                answerIndex: 0,
                explanation:
                    "Withholding credits and payments reduce gross tax due before the final payable or overpayment is read.",
            },
            {
                id: "tax-payable-tf-overpayment",
                kind: "true-false",
                prompt: "If credits exceed gross tax due, the next issue is whether the overpayment is refundable, creditable, or limited.",
                answer: true,
                explanation:
                    "Overpayment classification depends on the applicable tax rules and facts.",
            },
            {
                id: "tax-payable-short",
                kind: "short-answer",
                prompt: "What is the first tax amount computed from taxable income and the tax rate?",
                acceptedAnswers: ["gross tax due", "gross income tax due", "tax due"],
                explanation:
                    "The workspace starts with gross tax due, then applies credits, payments, and penalties.",
            },
            {
                id: "tax-payable-mc-route",
                kind: "multiple-choice",
                prompt: "A problem gives taxable income, withholding credits, and quarterly payments. Which route fits best?",
                choices: ["Income Tax Payable and Credits Review", "Revenue Cycle Control Review", "Audit Evidence Program Builder", "Sales Mix Break-even"],
                answerIndex: 0,
                explanation:
                    "Those facts point to payable or overpayment reconciliation, not a general tax bridge only.",
            },
        ],
    }),
    makeFinalTopic({
        id: "ais-revenue-cycle-controls-and-assertions",
        title: "AIS Revenue Cycle Controls and Assertions",
        shortTitle: "Revenue Controls",
        category: "AIS / IT Controls",
        summary:
            "Map order-to-cash controls to occurrence, completeness, cutoff, accuracy, collectability, and monitoring concerns.",
        intro:
            "Revenue-cycle AIS questions become easier when students connect each control to the assertion or data-integrity risk it is meant to address.",
        focus: "revenue-cycle controls and assertion mapping",
        route: "/ais/revenue-cycle-control-review",
        relatedRoutes: ["/ais/access-control-review", "/audit/assertion-evidence-planner"],
        relatedTopicIds: ["audit-materiality-and-misstatement-response"],
        keywords: ["revenue cycle", "order to cash", "invoice sequence", "cash application", "exception report"],
        scanSignals: ["sales order", "invoice sequence", "shipping document", "cash application"],
        workedScenario:
            "Sales orders are approved, but credit-limit checks are manual and exception reports are not consistently reviewed.",
        workedResult:
            "Use the revenue-cycle review route to identify collectability and monitoring gaps before deciding whether reliance is supportable.",
        checkpointScenario:
            "A student treats all revenue controls as occurrence controls.",
        checkpointResult:
            "Different controls support different assertions such as occurrence, completeness, cutoff, and accuracy.",
        quiz: [
            {
                id: "revenue-controls-mc-sequence",
                kind: "multiple-choice",
                prompt: "Invoice sequence checks most directly support which concern?",
                choices: ["Completeness and cutoff", "Dividend allocation", "Tax rate selection", "Market equilibrium"],
                answerIndex: 0,
                explanation:
                    "Sequence gaps can indicate missing invoices or cutoff problems in the revenue cycle.",
            },
            {
                id: "revenue-controls-tf-evidence",
                kind: "true-false",
                prompt: "A control that exists on paper still needs walkthrough or operating evidence before reliance.",
                answer: true,
                explanation:
                    "Design alone is not enough; the reviewer needs evidence that the control is implemented and operating.",
            },
            {
                id: "revenue-controls-short",
                kind: "short-answer",
                prompt: "What cycle is also called order to cash?",
                acceptedAnswers: ["revenue cycle", "sales cycle", "order to cash"],
                explanation:
                    "The revenue or sales cycle covers order approval, shipment, invoicing, receivables, and cash application.",
            },
            {
                id: "revenue-controls-mc-route",
                kind: "multiple-choice",
                prompt: "Which AccCalc workspace maps sales controls to assertions?",
                choices: ["Revenue Cycle Control Review", "Income Tax Payable Review", "Sinking Fund Deposit", "Donor's Tax Helper"],
                answerIndex: 0,
                explanation:
                    "The Revenue Cycle Control Review is the dedicated AIS route for order-to-cash control mapping.",
            },
        ],
    }),
    makeFinalTopic({
        id: "rfbt-negotiable-instruments-issue-spotting",
        title: "RFBT Negotiable Instruments Issue Spotting",
        shortTitle: "Negotiable Instruments",
        category: "RFBT / Business Law",
        summary:
            "Practice holder status, defenses, party liability, presentment, dishonor, and notice in commercial-law review.",
        intro:
            "Negotiable-instrument questions are route-choice traps because a single fact can change the answer from holder protection to defense analysis or notice-of-dishonor analysis.",
        focus: "holder status, defenses, and notice of dishonor",
        route: "/rfbt/negotiable-instruments-issue-spotter",
        relatedRoutes: ["/rfbt/commercial-transactions-reviewer", "/rfbt/obligations-contracts-flow"],
        relatedTopicIds: ["ais-revenue-cycle-controls-and-assertions"],
        keywords: ["negotiable instruments", "holder in due course", "presentment", "dishonor", "real defense", "personal defense"],
        scanSignals: ["holder in due course", "notice of dishonor", "presentment", "indorser"],
        workedScenario:
            "A holder takes a note for value before maturity, but the maker raises failure of consideration.",
        workedResult:
            "Classify holder status first. A personal defense may be cut off if holder-in-due-course elements are proven.",
        checkpointScenario:
            "A student ignores that the party being sued is an indorser.",
        checkpointResult:
            "Secondary-party liability needs presentment, dishonor, notice, or a valid excuse analysis.",
        quiz: [
            {
                id: "ni-mc-defense",
                kind: "multiple-choice",
                prompt: "Which issue often matters most when the holder claims holder-in-due-course protection?",
                choices: ["Whether the defense is personal or real", "Whether contribution margin is positive", "Whether VAT input exceeds output", "Whether a project has positive NPV"],
                answerIndex: 0,
                explanation:
                    "Holder-in-due-course protection is strongest against personal defenses but not against real defenses.",
            },
            {
                id: "ni-tf-secondary",
                kind: "true-false",
                prompt: "Indorser liability may require attention to presentment, dishonor, and notice.",
                answer: true,
                explanation:
                    "Secondary liability is not the same as primary maker or acceptor liability.",
            },
            {
                id: "ni-short",
                kind: "short-answer",
                prompt: "What status is abbreviated HDC?",
                acceptedAnswers: ["holder in due course"],
                explanation:
                    "HDC means holder in due course.",
            },
            {
                id: "ni-mc-route",
                kind: "multiple-choice",
                prompt: "Which route is designed for holder status and dishonor issues?",
                choices: ["Negotiable Instruments Issue Spotter", "Audit Sampling Planner", "Inventory Budget", "Market Equilibrium"],
                answerIndex: 0,
                explanation:
                    "The issue spotter keeps holder status, defenses, party liability, and notice together.",
            },
        ],
    }),
    makeFinalTopic({
        id: "fraud-risk-governance-and-audit-response",
        title: "Fraud Risk, Governance, and Audit Response",
        shortTitle: "Fraud Response",
        category: "Governance / Ethics / Risk",
        summary:
            "Connect fraud-triangle signals, management override, evidence quality, and governance escalation.",
        intro:
            "Fraud-risk cases require both audit response and governance judgment. This module helps students move from risk cues to procedures and escalation.",
        focus: "fraud-risk response and governance escalation",
        route: "/governance/fraud-risk-response-planner",
        relatedRoutes: ["/audit/evidence-program-builder", "/governance/governance-escalation-planner"],
        relatedTopicIds: ["audit-materiality-and-misstatement-response"],
        keywords: ["fraud risk", "fraud triangle", "management override", "professional skepticism", "audit committee"],
        scanSignals: ["management override", "fraud risk", "journal entries", "professional skepticism"],
        workedScenario:
            "Revenue targets are aggressive, manual journal entries rise near year-end, and explanations are supported mostly by internal documents.",
        workedResult:
            "Use the fraud-risk response route, then connect the result to evidence expansion and governance escalation.",
        checkpointScenario:
            "A student lists fraud-triangle words but gives no procedure response.",
        checkpointResult:
            "Fraud-risk identification should lead to changed audit procedures or oversight communication.",
        quiz: [
            {
                id: "fraud-mc-response",
                kind: "multiple-choice",
                prompt: "High management-override risk most directly supports which response?",
                choices: ["Expanded skepticism, journal-entry testing, and escalation", "Ignoring controls because fraud is not numeric", "Only computing VAT payable", "Only changing depreciation method"],
                answerIndex: 0,
                explanation:
                    "Override risk should change audit response and may require governance visibility.",
            },
            {
                id: "fraud-tf-evidence",
                kind: "true-false",
                prompt: "Mostly internal evidence can be a reason to seek stronger corroboration in a fraud-risk case.",
                answer: true,
                explanation:
                    "Fraud-risk responses often seek more reliable, independent, or corroborative evidence.",
            },
            {
                id: "fraud-short",
                kind: "short-answer",
                prompt: "What governance body is commonly considered when override risk is high?",
                acceptedAnswers: ["audit committee", "board", "board of directors"],
                explanation:
                    "High override or stakeholder exposure may require audit committee or board-level escalation.",
            },
            {
                id: "fraud-mc-route",
                kind: "multiple-choice",
                prompt: "Which route connects fraud-triangle cues to audit and governance response?",
                choices: ["Fraud Risk Response Planner", "Weighted Mean", "Sinking Fund Deposit", "Cash Discount"],
                answerIndex: 0,
                explanation:
                    "The Fraud Risk Response Planner is the dedicated route for this mixed audit-governance issue.",
            },
        ],
    }),
    makeFinalTopic({
        id: "intermediate-accounting-route-discipline",
        title: "Intermediate Accounting Route Discipline",
        shortTitle: "Intermediate Routing",
        category: "Financial Accounting",
        summary:
            "Practice choosing between recognition, measurement, presentation, disclosure, and schedule-building routes.",
        intro:
            "Intermediate accounting problems often look numeric, but the first answer is usually a route choice: recognize, measure, present, disclose, or build a schedule.",
        focus: "recognition, measurement, presentation, and disclosure routing",
        route: "/far/conceptual-framework-recognition",
        relatedRoutes: ["/far/revenue-allocation-workspace", "/far/financial-asset-amortized-cost", "/far/impairment-loss-workspace"],
        relatedTopicIds: ["conceptual-framework-recognition-measurement-and-disclosure", "far-revenue-allocation-and-contract-balances"],
        keywords: ["intermediate accounting", "recognition", "measurement", "presentation", "disclosure"],
        scanSignals: ["recognition", "measurement basis", "presentation", "disclosure", "carrying amount"],
        workedScenario:
            "A case asks whether an item should be recognized now, disclosed only, or measured using a later schedule.",
        workedResult:
            "Use the conceptual framework route first, then open the specific measurement route only after recognition is supported.",
        checkpointScenario:
            "A student calculates an amount before deciding whether the item qualifies for recognition.",
        checkpointResult:
            "Recognition comes before measurement in the route discipline.",
        quiz: [
            {
                id: "intermediate-routing-mc-first",
                kind: "multiple-choice",
                prompt: "What should usually happen before measuring a possible asset or liability?",
                choices: ["Recognition analysis", "Rounding to the nearest peso", "Choosing a chart color", "Computing market equilibrium"],
                answerIndex: 0,
                explanation:
                    "Recognition and classification determine whether measurement belongs in the answer at all.",
            },
            {
                id: "intermediate-routing-tf-disclosure",
                kind: "true-false",
                prompt: "Some FAR cases are disclosure or presentation issues rather than calculator-first issues.",
                answer: true,
                explanation:
                    "A good route choice may be conceptual or reviewer-based when recognition or measurement is uncertain.",
            },
            {
                id: "intermediate-routing-short",
                kind: "short-answer",
                prompt: "Name one route decision in intermediate accounting.",
                acceptedAnswers: ["recognition", "measurement", "presentation", "disclosure", "classification"],
                explanation:
                    "Intermediate route discipline separates recognition, measurement, presentation, disclosure, and classification.",
            },
            {
                id: "intermediate-routing-mc-route",
                kind: "multiple-choice",
                prompt: "Which route is best when the question asks whether an item qualifies for recognition?",
                choices: ["Conceptual Framework Recognition Helper", "Direct Labor Budget", "Quality Control Chart", "Obligations Contract Flow"],
                answerIndex: 0,
                explanation:
                    "The conceptual framework helper is designed for recognition and measurement-basis discipline.",
            },
        ],
    }),
];
