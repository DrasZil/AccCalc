import { STUDY_HUB_CURRICULUM_TOPICS } from "./studyExpansion450.js";

export type StudyTopicCategory =
    | "Financial Accounting"
    | "Managerial & Cost Accounting"
    | "Partnership Accounting"
    | "AFAR / Consolidation"
    | "CVP / Decision Support"
    | "Business Math / Finance"
    | "Statistics / Analytics"
    | "Economics"
    | "Entrepreneurship"
    | "Smart Tools / Scan Support"
    | "Audit & Assurance"
    | "Taxation"
    | "RFBT / Business Law"
    | "AIS / IT Controls"
    | "Operations / Supply Chain"
    | "Governance / Ethics / Risk"
    | "Strategic / Integrative";

export type StudyFormulaEntry = {
    label: string;
    expression: string;
    explanation: string;
};

export type StudyVariableDefinition = {
    symbol: string;
    meaning: string;
};

export type StudyDeepDiveSection = {
    id: string;
    title: string;
    summary: string;
    points: string[];
    tone?: "default" | "info" | "warning" | "accent";
};

export type StudyWorkedExample = {
    title: string;
    scenario: string;
    steps: string[];
    result: string;
    interpretation: string;
};

export type StudyQuizQuestion =
    | {
          id: string;
          kind: "multiple-choice";
          prompt: string;
          choices: string[];
          answerIndex: number;
          explanation: string;
      }
    | {
          id: string;
          kind: "true-false";
          prompt: string;
          answer: boolean;
          explanation: string;
      }
    | {
          id: string;
          kind: "short-answer";
          prompt: string;
          acceptedAnswers: string[];
          explanation: string;
          placeholder?: string;
      };

export type StudyQuiz = {
    title: string;
    intro: string;
    questions: StudyQuizQuestion[];
};

export type StudyTopic = {
    id: string;
    title: string;
    shortTitle: string;
    category: StudyTopicCategory;
    summary: string;
    intro: string;
    whyItMatters: string[];
    classContexts: string[];
    whenToUse: string[];
    formulaOverview: StudyFormulaEntry[];
    variableDefinitions: StudyVariableDefinition[];
    procedure: string[];
    workedExample: StudyWorkedExample;
    checkpointExample: StudyWorkedExample;
    interpretation: string[];
    commonMistakes: string[];
    examTraps: string[];
    selfCheck: string[];
    practiceCues: string[];
    deepDiveSections?: StudyDeepDiveSection[];
    nextStepPrompts?: string[];
    keywords: string[];
    scanSignals: string[];
    relatedCalculatorPaths: string[];
    relatedTopicIds: string[];
    quiz: StudyQuiz;
};

export type StudyTopicRecommendation = {
    id: string;
    title: string;
    shortTitle: string;
    path: string;
    quizPath: string;
    category: StudyTopicCategory;
    reason: string;
    score: number;
    confidence: "high" | "moderate" | "low";
};

export const STUDY_CATEGORY_DETAILS: Record<
    StudyTopicCategory,
    { description: string; emphasis: string }
> = {
    "Financial Accounting": {
        description:
            "Core accounting topics that support statement preparation, account analysis, and answer checking.",
        emphasis: "Concept accuracy and procedural order",
    },
    "Managerial & Cost Accounting": {
        description:
            "Cost-flow, production, budgeting, and internal decision topics where structure matters as much as arithmetic.",
        emphasis: "Schedules, assumptions, and managerial interpretation",
    },
    "Partnership Accounting": {
        description:
            "Admission, retirement, sharing, and dissolution topics that students often solve step by step in class.",
        emphasis: "Capital logic and liquidation procedure",
    },
    "AFAR / Consolidation": {
        description:
            "Business combinations, consolidated reporting, and other AFAR topics that rely on acquisition-date logic and group presentation.",
        emphasis: "Measurement basis, elimination logic, and group reporting",
    },
    "CVP / Decision Support": {
        description:
            "Contribution margin, break-even, target profit, and planning topics used in managerial decision making.",
        emphasis: "What changes the answer and why",
    },
    "Business Math / Finance": {
        description:
            "Time value, project evaluation, and quantitative business topics used for decisions and long-form problems.",
        emphasis: "Rate basis, time basis, and decision reading",
    },
    "Statistics / Analytics": {
        description:
            "Quantitative topics that help students read spread, variation, weighting, and business-use comparisons more carefully.",
        emphasis: "Dispersion, relative variability, and interpretation",
    },
    Economics: {
        description:
            "Price-response and market-relationship topics used in microeconomics problem solving.",
        emphasis: "Interpretation, direction, and model assumptions",
    },
    Entrepreneurship: {
        description:
            "Planning topics that connect classroom logic to startup and small-business decisions.",
        emphasis: "Practical feasibility and disciplined assumptions",
    },
    "Smart Tools / Scan Support": {
        description:
            "Study support for OCR review, prompt routing, and checking uncertain extracted values.",
        emphasis: "Verification before trusting automation",
    },
    "Audit & Assurance": {
        description:
            "Audit planning, evidence, risk assessment, reporting, and assurance-review support.",
        emphasis: "Assertions, evidence, and professional judgment",
    },
    Taxation: {
        description:
            "Tax principles, VAT and income-tax logic, book-tax differences, and compliance framing.",
        emphasis: "Careful labeling and legal-versus-accounting distinction",
    },
    "RFBT / Business Law": {
        description:
            "Regulatory and business-law review topics that emphasize structured issue spotting and legal consequence reading.",
        emphasis: "Issue spotting, element analysis, and remedy logic",
    },
    "AIS / IT Controls": {
        description:
            "Accounting information systems, IT governance, application controls, and IT-audit support.",
        emphasis: "Control environment, documentation, and systems reasoning",
    },
    "Operations / Supply Chain": {
        description:
            "Forecasting, inventory planning, quality, scheduling, and operations-management study support.",
        emphasis: "Flow, tradeoffs, and operating decision impact",
    },
    "Governance / Ethics / Risk": {
        description:
            "Governance, ethics, risk assessment, and internal-control design and evaluation topics.",
        emphasis: "Responsible judgment and control consequence",
    },
    "Strategic / Integrative": {
        description:
            "Cross-subject review topics that help capstone, board-review, and strategic-case interpretation.",
        emphasis: "Integration, prioritization, and decision framing",
    },
};

export function getStudyCategoryTrack(category: StudyTopicCategory) {
    switch (category) {
        case "Financial Accounting":
            return "FAR";
        case "Partnership Accounting":
        case "AFAR / Consolidation":
            return "AFAR";
        case "Managerial & Cost Accounting":
        case "CVP / Decision Support":
            return "Cost & Managerial";
        case "Business Math / Finance":
        case "Economics":
        case "Statistics / Analytics":
            return "Finance / Econ / Math";
        case "Entrepreneurship":
        case "Strategic / Integrative":
            return "Strategic & Integrative";
        case "Audit & Assurance":
            return "Audit & Assurance";
        case "Taxation":
            return "Taxation";
        case "RFBT / Business Law":
            return "RFBT & Law";
        case "AIS / IT Controls":
            return "AIS & IT Controls";
        case "Operations / Supply Chain":
            return "Operations & Supply Chain";
        case "Governance / Ethics / Risk":
            return "Governance & Ethics";
        case "Smart Tools / Scan Support":
            return "Smart Tools";
        default:
            return category;
    }
}

export function buildStudyTopicPath(topicId: string) {
    return `/study/topics/${topicId}`;
}

export function buildStudyQuizPath(topicId: string) {
    return `/study/quiz/${topicId}`;
}

const CORE_STUDY_TOPICS: StudyTopic[] = [
    {
        id: "cvp-core",
        title: "CVP Core Logic",
        shortTitle: "CVP Core",
        category: "CVP / Decision Support",
        summary:
            "Study contribution margin, break-even, target profit, margin of safety, and operating leverage as one connected planning model.",
        intro:
            "CVP analysis connects cost behavior, sales volume, and operating profit. Students use it to answer break-even, target-profit, and sensitivity questions without treating each formula as an isolated trick.",
        whyItMatters: [
            "It shows why contribution margin comes before profit planning.",
            "It helps explain whether a sales plan is merely busy or actually profitable.",
            "It gives managers and students a way to compare pricing, cost, and volume decisions from one framework.",
        ],
        classContexts: [
            "Break-even and target-profit exercises",
            "Managerial accounting recitations on contribution margin",
            "Sensitivity, margin of safety, and operating leverage questions",
        ],
        whenToUse: [
            "Use it when the problem gives selling price per unit, variable cost per unit, and fixed costs.",
            "Use it when the question asks for required units, required sales, or planning interpretation.",
            "Move to sales-mix analysis if the setting is multi-product instead of forcing a single-product model.",
        ],
        formulaOverview: [
            {
                label: "Contribution margin per unit",
                expression: "CM per unit = Selling price per unit - Variable cost per unit",
                explanation:
                    "This is the amount each unit contributes first toward fixed costs and then toward profit.",
            },
            {
                label: "Break-even units",
                expression: "Break-even units = Fixed costs / CM per unit",
                explanation:
                    "This is the unit volume where operating income is zero.",
            },
            {
                label: "Required units for target profit",
                expression: "Required units = (Fixed costs + Target profit) / CM per unit",
                explanation:
                    "This extends break-even logic by adding the desired operating profit.",
            },
            {
                label: "Margin of safety",
                expression: "Margin of safety = Actual or expected sales - Break-even sales",
                explanation:
                    "This measures how far sales can fall before the business reaches zero operating income.",
            },
        ],
        variableDefinitions: [
            { symbol: "SP", meaning: "Selling price per unit" },
            { symbol: "VC", meaning: "Variable cost per unit" },
            { symbol: "CM", meaning: "Contribution margin" },
            { symbol: "FC", meaning: "Total fixed costs for the relevant period" },
            { symbol: "OI", meaning: "Operating income" },
        ],
        procedure: [
            "Confirm that selling price and variable cost are both unit-based, not totals.",
            "Compute contribution margin per unit before using any break-even or target-profit formula.",
            "Solve for break-even or target volume depending on the question.",
            "Translate the result into units or sales revenue as requested.",
            "Interpret whether the current sales plan sits above or below break-even and what could change the answer fastest.",
        ],
        workedExample: {
            title: "Single-product planning example",
            scenario:
                "A product sells for 120 per unit, variable cost is 70 per unit, and fixed costs are 150,000. The instructor asks for break-even units and the required units for a 60,000 target profit.",
            steps: [
                "Compute contribution margin per unit: 120 - 70 = 50.",
                "Break-even units = 150,000 / 50 = 3,000 units.",
                "Required units = (150,000 + 60,000) / 50 = 4,200 units.",
                "Interpret the answers as planning thresholds, not just arithmetic outputs.",
            ],
            result:
                "The business breaks even at 3,000 units and needs 4,200 units to earn a 60,000 target operating profit.",
            interpretation:
                "The key managerial message is that each unit adds only 50 toward fixed-cost recovery and profit, so pricing or variable-cost changes can materially shift the required volume.",
        },
        checkpointExample: {
            title: "Quick review check",
            scenario:
                "Expected sales are 3,400 units under the same data. Decide whether the plan is above break-even.",
            steps: [
                "Break-even volume is already known as 3,000 units.",
                "Expected units exceed break-even by 400 units.",
                "That excess represents a positive margin of safety in unit terms.",
            ],
            result: "The plan is above break-even by 400 units.",
            interpretation:
                "That does not mean the plan is automatically strong; it means there is some buffer before operating income falls to zero.",
        },
        interpretation: [
            "A positive contribution margin is the engine of every CVP answer.",
            "Break-even is not a target to celebrate by itself. It is the zero-profit threshold.",
            "A strong margin of safety gives room for sales variation, but operating leverage still matters when fixed costs are high.",
        ],
        commonMistakes: [
            "Using total variable cost instead of variable cost per unit.",
            "Treating break-even as the same as target profit.",
            "Forgetting that operating leverage becomes unstable when operating income is very small.",
            "Answering in units when the question clearly asks for sales pesos or vice versa.",
        ],
        examTraps: [
            "Problems often hide the required basis by mixing total sales and units sold in the same paragraph.",
            "Many students compute contribution margin ratio when the question really needs unit contribution margin first.",
            "A multi-product problem can look like a normal CVP problem until the wording mentions mix or weighted contribution.",
        ],
        selfCheck: [
            "Why must contribution margin be computed before break-even units?",
            "What happens to break-even units if variable cost per unit rises while fixed cost stays the same?",
            "Why is break-even not enough for evaluating an actual sales plan?",
        ],
        practiceCues: [
            "Explain the difference between contribution margin and gross profit.",
            "Compare the effect of a lower selling price versus lower fixed costs on break-even.",
            "State when a sales-mix model is more appropriate than a single-product model.",
        ],
        keywords: [
            "cvp",
            "cost volume profit",
            "break-even",
            "target profit",
            "margin of safety",
            "operating leverage",
            "contribution margin",
        ],
        scanSignals: [
            "fixed cost",
            "variable cost",
            "selling price per unit",
            "break-even sales",
            "cm ratio",
        ],
        relatedCalculatorPaths: [
            "/business/cvp-analysis",
            "/business/break-even",
            "/business/contribution-margin",
            "/business/target-profit",
            "/business/operating-leverage",
            "/business/sales-mix-break-even",
        ],
        relatedTopicIds: ["process-costing", "startup-cost-planning", "capital-budgeting"],
        quiz: {
            title: "CVP Core Check",
            intro:
                "This short quiz checks whether you can identify the right CVP logic before relying on a calculator.",
            questions: [
                {
                    id: "cvp-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which value must be positive before break-even units can be computed meaningfully?",
                    choices: [
                        "Fixed costs",
                        "Contribution margin per unit",
                        "Target profit",
                        "Margin of safety",
                    ],
                    answerIndex: 1,
                    explanation:
                        "Break-even units divide fixed costs by contribution margin per unit, so the contribution margin per unit must be positive.",
                },
                {
                    id: "cvp-q2",
                    kind: "true-false",
                    prompt:
                        "Break-even means contribution margin has started covering profit instead of fixed costs.",
                    answer: false,
                    explanation:
                        "At break-even, contribution margin has covered fixed costs exactly. Profit starts only beyond that point.",
                },
                {
                    id: "cvp-q3",
                    kind: "short-answer",
                    prompt:
                        "What common input mistake happens when a student uses total variable cost instead of variable cost per unit?",
                    acceptedAnswers: [
                        "wrong unit basis",
                        "used total variable cost instead of per unit cost",
                        "mixed total and per unit cost",
                    ],
                    placeholder: "Type a short diagnosis",
                    explanation:
                        "CVP formulas often require per-unit data. Using totals usually inflates or distorts the break-even answer.",
                },
            ],
        },
    },
    {
        id: "partnership-dissolution",
        title: "Partnership Dissolution",
        shortTitle: "Dissolution",
        category: "Partnership Accounting",
        summary:
            "Study realization, liability settlement, capital adjustment, and deficiency handling in the order a textbook liquidation problem expects.",
        intro:
            "Partnership dissolution problems are procedural. Students must not only compute a gain or loss on realization, but also follow the liquidation order carefully before distributing remaining cash to partners.",
        whyItMatters: [
            "It trains students to separate realization, liability settlement, and partner settlement.",
            "It reinforces why outside liabilities come before any partner cash distribution.",
            "It develops judgment around capital deficiencies and insolvency assumptions.",
        ],
        classContexts: [
            "Liquidation schedules",
            "Gain or loss on realization problems",
            "Capital deficiency and insolvency cases",
        ],
        whenToUse: [
            "Use it when noncash assets are sold and the partnership is winding up operations.",
            "Use it when the problem asks for cash available to partners or final partner distributions.",
            "Do not use it for ordinary profit allocation or retirement problems unless the partnership is actually liquidating.",
        ],
        formulaOverview: [
            {
                label: "Gain or loss on realization",
                expression: "Gain or loss = Cash from realization - Book value of noncash assets",
                explanation:
                    "This compares what the assets realized in cash against their carrying amount before liquidation.",
            },
            {
                label: "Adjusted capital",
                expression: "Adjusted capital = Beginning capital +/- Share of realization gain or loss",
                explanation:
                    "Partner capitals must reflect the realization result before final cash settlement is determined.",
            },
            {
                label: "Cash available to partners",
                expression: "Cash available to partners = Realized cash - Outside liabilities settled",
                explanation:
                    "Outside liabilities are paid before the partners receive liquidation cash.",
            },
        ],
        variableDefinitions: [
            { symbol: "BV", meaning: "Book value of noncash assets being realized" },
            { symbol: "CR", meaning: "Cash from realization" },
            { symbol: "PL ratio", meaning: "Profit-and-loss ratio used for allocation" },
            { symbol: "Adjusted capital", meaning: "Capital after realization allocation" },
        ],
        procedure: [
            "Compare realized cash with the book value of noncash assets to find a realization gain or loss.",
            "Allocate that gain or loss to partners using the agreed profit-and-loss ratio.",
            "Settle outside liabilities before any partner distribution.",
            "Review each partner's adjusted capital for deficiency.",
            "Apply insolvency absorption only if the problem explicitly says a deficient partner cannot contribute.",
        ],
        workedExample: {
            title: "Liquidation sequence example",
            scenario:
                "Noncash assets with a 420,000 book value are realized for 390,000. Liabilities of 120,000 must be paid, and the partners share profits and losses 3:2:1.",
            steps: [
                "Realization loss = 390,000 - 420,000 = 30,000 loss.",
                "Allocate the 30,000 loss to partner capitals using the 3:2:1 ratio.",
                "Pay the 120,000 outside liabilities from realized cash.",
                "Use the remaining cash only after capitals are adjusted.",
            ],
            result:
                "The partnership first recognizes a realization loss, then settles liabilities, and only then determines final partner distributions.",
            interpretation:
                "The most important idea is sequence. A correct arithmetic answer with the wrong liquidation order is still a weak dissolution solution.",
        },
        checkpointExample: {
            title: "Deficiency check",
            scenario:
                "One partner's adjusted capital becomes negative after allocating the realization loss. The problem does not say the partner is insolvent.",
            steps: [
                "Identify the negative adjusted capital as a deficiency.",
                "Do not automatically absorb it by other partners.",
                "State that the deficient partner is normally expected to contribute unless insolvency is given.",
            ],
            result: "The deficiency must not be absorbed automatically.",
            interpretation:
                "Classroom partnership problems are highly assumption-sensitive. Missing the insolvency condition changes the final cash distribution logic.",
        },
        interpretation: [
            "Dissolution answers are strongest when they explain the order of liquidation, not just the final cash totals.",
            "A capital consistency gap is a warning that the entered capitals and book net assets may be incomplete or inconsistent.",
            "Deficiency treatment must follow the problem facts, not a guessed assumption.",
        ],
        commonMistakes: [
            "Paying partners before settling outside liabilities.",
            "Skipping the allocation of realization gain or loss before reading final capitals.",
            "Assuming insolvency without explicit problem support.",
            "Ignoring whether partner loans or omitted balances exist when the capitals do not reconcile cleanly.",
        ],
        examTraps: [
            "A problem can mention liquidation cash and partner capitals in the same paragraph, which tempts students to distribute cash too early.",
            "A negative capital balance does not automatically mean other partners absorb the deficiency.",
            "Students often copy the profit-and-loss ratio incorrectly when partner labels are reordered.",
        ],
        selfCheck: [
            "Why are outside liabilities settled before partner cash distributions?",
            "What changes when a deficient partner is insolvent?",
            "Why is realization gain or loss allocated before final partner distributions?",
        ],
        practiceCues: [
            "Explain the difference between a realization loss and a capital deficiency.",
            "Describe how the final schedule changes if the realization result becomes a gain instead of a loss.",
            "Check whether the problem gives enough information to justify deficiency absorption.",
        ],
        keywords: [
            "partnership dissolution",
            "liquidation",
            "realization",
            "capital deficiency",
            "liquidation schedule",
        ],
        scanSignals: [
            "gain or loss on realization",
            "cash available to partners",
            "partner capital",
            "liquidation",
            "deficiency",
        ],
        relatedCalculatorPaths: [
            "/accounting/partnership-dissolution",
            "/accounting/partnership-profit-sharing",
            "/accounting/partnership-retirement-bonus",
            "/accounting/partners-capital-statement",
        ],
        relatedTopicIds: ["cvp-core", "process-costing"],
        quiz: {
            title: "Dissolution Procedure Check",
            intro:
                "Use this quiz to confirm that you remember the liquidation order and deficiency logic, not just one formula.",
            questions: [
                {
                    id: "pd-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which item must be handled before any partner receives final cash in liquidation?",
                    choices: [
                        "Common stock",
                        "Outside liabilities",
                        "Profit forecast",
                        "Sales mix",
                    ],
                    answerIndex: 1,
                    explanation:
                        "Outside liabilities are settled before partner distributions in a normal liquidation order.",
                },
                {
                    id: "pd-q2",
                    kind: "true-false",
                    prompt:
                        "A partner's deficiency should always be absorbed by the remaining partners.",
                    answer: false,
                    explanation:
                        "Absorption depends on the problem facts. If insolvency is not given, the deficient partner is usually expected to contribute.",
                },
                {
                    id: "pd-q3",
                    kind: "short-answer",
                    prompt:
                        "What is the usual mistake if a student jumps from realized cash directly to final partner distributions?",
                    acceptedAnswers: [
                        "skipped liability settlement",
                        "skipped allocation step",
                        "wrong procedure order",
                    ],
                    placeholder: "Type the likely mistake",
                    explanation:
                        "The student likely skipped a required stage such as liability settlement or realization allocation before final distribution.",
                },
            ],
        },
    },
    {
        id: "process-costing",
        title: "Process Costing Foundations",
        shortTitle: "Process Costing",
        category: "Managerial & Cost Accounting",
        summary:
            "Study equivalent units, cost per equivalent unit, transferred-out cost, ending WIP, and reconciliation as one production-costing flow.",
        intro:
            "Process costing is a schedule-based topic. Students need to connect unit flow, equivalent units, cost assignment, and reconciliation instead of treating each table as separate memorization.",
        whyItMatters: [
            "It helps students read production departments logically from physical flow to cost flow.",
            "It supports cleaner checking of scanned worksheets and textbook schedules.",
            "It strengthens the difference between weighted average, FIFO, and transferred-in cost cases.",
        ],
        classContexts: [
            "Equivalent units schedules",
            "Cost of production reports",
            "Department 1 and later-department process costing",
        ],
        whenToUse: [
            "Use it when units move continuously through a department or production process.",
            "Use it when the problem asks for equivalent units, cost per equivalent unit, or cost assignment between transferred out and ending WIP.",
            "Check whether the method is weighted average or FIFO before starting.",
        ],
        formulaOverview: [
            {
                label: "Equivalent units",
                expression: "Equivalent units = Completed units + Equivalent work in ending WIP",
                explanation:
                    "Equivalent units convert partially completed work into whole-unit terms for cost assignment.",
            },
            {
                label: "Cost per equivalent unit",
                expression: "Cost per EU = Costs to account for / Equivalent units",
                explanation:
                    "The exact numerator and denominator depend on the process-costing method and cost category.",
            },
            {
                label: "Transferred-out cost",
                expression: "Transferred-out cost = Units completed and transferred x Cost per EU",
                explanation:
                    "Completed output receives full cost per equivalent unit in the relevant categories.",
            },
        ],
        variableDefinitions: [
            { symbol: "EU", meaning: "Equivalent units of production" },
            { symbol: "WIP", meaning: "Work in process" },
            { symbol: "TI", meaning: "Transferred-in cost from a prior department" },
            { symbol: "COPR", meaning: "Cost of production report context" },
        ],
        procedure: [
            "Map unit flow first: beginning units, started or received, completed or transferred, and ending WIP.",
            "Compute equivalent units by cost category and method.",
            "Determine costs to account for and then cost per equivalent unit.",
            "Assign costs between completed output and ending WIP.",
            "Reconcile costs to confirm the schedule is internally consistent.",
        ],
        workedExample: {
            title: "Weighted-average department example",
            scenario:
                "A department completed 8,000 units and left 2,000 units in ending WIP that were 50% complete for conversion. Materials are 100% added at the start.",
            steps: [
                "Materials equivalent units = 8,000 + 2,000 = 10,000.",
                "Conversion equivalent units = 8,000 + 1,000 = 9,000.",
                "Use the method-specific costs to compute cost per equivalent unit.",
                "Assign full cost to completed units and partial cost to ending WIP.",
            ],
            result:
                "Equivalent units differ by cost category because completion percentages differ.",
            interpretation:
                "The point is not only to compute EU correctly, but to explain why ending WIP contributes differently to materials and conversion.",
        },
        checkpointExample: {
            title: "Transferred-in check",
            scenario:
                "A later department receives units from Department 1. The worksheet includes transferred-in cost plus current materials and conversion.",
            steps: [
                "Recognize that transferred-in cost behaves like a separate cost category.",
                "Keep current department additions separate from prior department cost.",
                "Check whether the page is Department 1 or a later department before applying the schedule.",
            ],
            result:
                "Later-department worksheets require transferred-in logic, not a simple Department 1 template.",
            interpretation:
                "Many OCR and student errors happen because transferred-in cost is treated like ordinary materials or ignored completely.",
        },
        interpretation: [
            "Equivalent units measure work done, not just physical units present.",
            "Reconciliation is not an optional extra. It is the integrity check for the schedule.",
            "Method choice changes the schedule structure, so students should identify weighted average or FIFO before computing.",
        ],
        commonMistakes: [
            "Mixing Department 1 logic with later-department transferred-in logic.",
            "Using physical units instead of equivalent units in cost-per-EU denominators.",
            "Combining materials and conversion completion percentages when they should be separated.",
            "Ignoring reconciliation differences after cost assignment.",
        ],
        examTraps: [
            "A worksheet can look like a normal equivalent-units problem until transferred-in cost appears.",
            "Problems often place ending WIP percentages far from the unit-flow data.",
            "Students sometimes use beginning WIP data in weighted-average schedules the way FIFO would use it.",
        ],
        selfCheck: [
            "Why can equivalent units differ between materials and conversion?",
            "What signals that the problem is a later-department worksheet?",
            "Why is reconciliation necessary even after cost assignment appears complete?",
        ],
        practiceCues: [
            "Compare weighted-average and FIFO treatment of beginning WIP.",
            "Explain why transferred-in cost is treated as a separate category.",
            "Describe what would change if ending WIP were 75% complete instead of 50%.",
        ],
        keywords: [
            "process costing",
            "equivalent units",
            "cost per equivalent unit",
            "cost of production report",
            "transferred in",
        ],
        scanSignals: [
            "completed and transferred",
            "ending wip",
            "equivalent units",
            "transferred-in cost",
            "department",
        ],
        relatedCalculatorPaths: [
            "/accounting/process-costing-workspace",
            "/accounting/cost-per-equivalent-unit",
            "/accounting/cost-of-production-report",
            "/accounting/weighted-average-process-costing",
            "/accounting/fifo-process-costing",
            "/accounting/process-costing-practice-checker",
        ],
        relatedTopicIds: ["cvp-core", "job-order-costing", "scan-review"],
        quiz: {
            title: "Process Costing Quick Check",
            intro:
                "This short set checks whether you can diagnose the structure of a process-costing problem before doing the arithmetic.",
            questions: [
                {
                    id: "pc-q1",
                    kind: "multiple-choice",
                    prompt:
                        "What is the best description of equivalent units?",
                    choices: [
                        "Units sold during the period",
                        "Whole-unit measure of partially completed work",
                        "Total materials cost",
                        "Budgeted units for the next period",
                    ],
                    answerIndex: 1,
                    explanation:
                        "Equivalent units convert partially completed work into whole-unit terms for cost assignment.",
                },
                {
                    id: "pc-q2",
                    kind: "true-false",
                    prompt:
                        "A later-department process-costing worksheet may require transferred-in cost as a separate category.",
                    answer: true,
                    explanation:
                        "Transferred-in cost is a distinct cost flow in later departments and should not be ignored.",
                },
                {
                    id: "pc-q3",
                    kind: "short-answer",
                    prompt:
                        "If a student uses physical units instead of equivalent units in cost per EU, what type of mistake is that?",
                    acceptedAnswers: [
                        "wrong denominator",
                        "used physical units instead of equivalent units",
                        "wrong unit basis",
                    ],
                    placeholder: "Type a short diagnosis",
                    explanation:
                        "The denominator must reflect equivalent units, not just physical counts, when calculating cost per equivalent unit.",
                },
            ],
        },
    },
    {
        id: "job-order-costing",
        title: "Job Order Costing Foundations",
        shortTitle: "Job Order Costing",
        category: "Managerial & Cost Accounting",
        summary:
            "Study job cost sheets, direct tracing, overhead application, prime cost, conversion cost, and unit-cost reading as one manufacturing-cost workflow.",
        intro:
            "Job-order costing is used when production is built around specific jobs, orders, or batches rather than a continuous department flow. Students need to trace direct cost correctly, apply overhead carefully, and explain what the resulting unit cost actually means before comparing jobs or quoting prices.",
        whyItMatters: [
            "It helps students separate job-specific manufacturing cost from period-wide factory totals.",
            "It strengthens the difference between direct tracing and overhead application.",
            "It prepares students for cost-of-goods-manufactured and manufacturing decision problems built from job data.",
        ],
        classContexts: [
            "Job cost sheet exercises",
            "Prime and conversion cost review",
            "Manufacturing cost classification and unit-cost problems",
        ],
        whenToUse: [
            "Use it when the problem identifies a specific job, work order, custom batch, or customer order.",
            "Use it when direct materials, direct labor, and applied overhead are assigned to one job and the question asks for total or per-unit job cost.",
            "Move to process costing instead when production is continuous and the problem depends on departments, equivalent units, or ending WIP percentages.",
        ],
        formulaOverview: [
            {
                label: "Total job cost",
                expression: "Total job cost = Direct materials used + Direct labor + Applied manufacturing overhead",
                explanation:
                    "This collects the manufacturing costs assigned to one specific job or batch.",
            },
            {
                label: "Prime cost",
                expression: "Prime cost = Direct materials used + Direct labor",
                explanation:
                    "Prime cost captures the costs directly traceable to the product or job.",
            },
            {
                label: "Conversion cost",
                expression: "Conversion cost = Direct labor + Applied manufacturing overhead",
                explanation:
                    "Conversion cost focuses on the resources used to convert materials into finished output.",
            },
            {
                label: "Unit cost for the job",
                expression: "Unit cost = Total job cost / Units in the job",
                explanation:
                    "This translates the assigned cost of the job into a per-unit reading for pricing, valuation, or comparison.",
            },
        ],
        variableDefinitions: [
            { symbol: "DM", meaning: "Direct materials used in the specific job" },
            { symbol: "DL", meaning: "Direct labor assigned directly to the job" },
            { symbol: "MOH", meaning: "Applied manufacturing overhead assigned to the job" },
            { symbol: "Unit cost", meaning: "Assigned cost per unit within the job or batch" },
        ],
        procedure: [
            "Confirm that the problem is job-specific rather than department-wide continuous production.",
            "Identify direct materials used, direct labor, and the overhead applied to the job.",
            "Add the three manufacturing-cost elements to compute total job cost.",
            "Compute prime cost and conversion cost if the course asks for cost classification.",
            "Divide total job cost by the units in the job only after confirming the denominator belongs to that specific job or batch.",
        ],
        workedExample: {
            title: "Custom production job example",
            scenario:
                "A custom order uses 85,000 of direct materials, 54,000 of direct labor, and 48,600 of applied manufacturing overhead. The job contains 1,200 completed units.",
            steps: [
                "Prime cost = 85,000 + 54,000 = 139,000.",
                "Conversion cost = 54,000 + 48,600 = 102,600.",
                "Total job cost = 85,000 + 54,000 + 48,600 = 187,600.",
                "Unit cost = 187,600 / 1,200 = 156.33 per unit, rounded to two decimals.",
            ],
            result:
                "The job carries a total assigned manufacturing cost of 187,600 and a unit cost of 156.33.",
            interpretation:
                "The important lesson is not only the arithmetic. Students should also explain whether the unit cost is being driven mainly by materials, labor, or overhead before comparing the job to another order.",
        },
        checkpointExample: {
            title: "Overhead application check",
            scenario:
                "A student uses total actual factory overhead for the month instead of the overhead applied to the specific job.",
            steps: [
                "Check whether the problem gives applied overhead directly or a predetermined rate that must be used first.",
                "Exclude period-wide factory totals that belong to many jobs unless the case clearly says they are assigned to this one job.",
                "Rebuild the job cost sheet using only the cost assigned to the job under review.",
            ],
            result:
                "The original unit cost is overstated because the denominator is one job but the overhead input came from the whole period.",
            interpretation:
                "This is a classic wrong-basis error. The arithmetic may look neat while the cost assignment is conceptually wrong.",
        },
        interpretation: [
            "A job cost sheet explains how cost is assigned to one identifiable job, not to the whole factory process.",
            "Prime and conversion cost are classification tools that help students understand what part of the job cost is directly traced versus converted through manufacturing activity.",
            "A unit-cost answer is only as trustworthy as the job-specific denominator and the overhead application basis behind it.",
        ],
        commonMistakes: [
            "Using direct materials purchased instead of direct materials actually used in the job.",
            "Using actual total factory overhead instead of applied overhead assigned to the job.",
            "Dividing by the wrong unit base, such as planned output or total department units instead of units in the job.",
            "Treating prime cost and conversion cost as interchangeable when they classify different cost combinations.",
        ],
        examTraps: [
            "Problems often mention a predetermined overhead rate in one sentence and the activity base in another, so students may skip the overhead-application step.",
            "A case may look like process costing if it mentions production, but the presence of one specific job or batch should redirect the method.",
            "Some textbook questions ask for total job cost first and only later ask for unit cost, so premature division can create confusion.",
        ],
        selfCheck: [
            "Why is applied overhead, not total actual factory overhead, the relevant amount for a job cost sheet?",
            "How do prime cost and conversion cost differ even though both use direct labor?",
            "What clue tells you to use job-order costing instead of process costing?",
        ],
        practiceCues: [
            "Explain how you would compute applied overhead if the rate were given but the applied amount was missing.",
            "Describe why a custom-order problem usually points to job-order costing.",
            "Compare how unit cost could change if the same total job cost were spread over more units.",
        ],
        keywords: [
            "job order costing",
            "job cost sheet",
            "applied overhead",
            "prime cost",
            "conversion cost",
            "unit cost",
        ],
        scanSignals: [
            "job cost sheet",
            "work order",
            "batch cost",
            "applied overhead",
            "prime cost",
            "conversion cost",
        ],
        relatedCalculatorPaths: [
            "/accounting/job-order-cost-sheet",
            "/accounting/prime-conversion-cost",
            "/accounting/cost-of-goods-manufactured",
            "/accounting/process-costing-workspace",
        ],
        relatedTopicIds: ["process-costing", "budgeting-and-planning-review", "accounting-foundations-review"],
        quiz: {
            title: "Job Order Costing Check",
            intro:
                "Use this short set to verify whether you can identify the right cost-assignment logic before trusting the worksheet totals.",
            questions: [
                {
                    id: "joc-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which cost should normally be added with direct materials and direct labor on a job cost sheet?",
                    choices: [
                        "Applied manufacturing overhead",
                        "Consumer surplus",
                        "Preferred dividends",
                        "Deposits in transit",
                    ],
                    answerIndex: 0,
                    explanation:
                        "A job cost sheet combines direct materials, direct labor, and applied manufacturing overhead assigned to that job.",
                },
                {
                    id: "joc-q2",
                    kind: "true-false",
                    prompt:
                        "Job-order costing is generally the better fit when production is continuous and the problem focuses on equivalent units in departments.",
                    answer: false,
                    explanation:
                        "Continuous production with equivalent units points toward process costing, not job-order costing.",
                },
                {
                    id: "joc-q3",
                    kind: "short-answer",
                    prompt:
                        "If a student uses total factory overhead instead of applied overhead for one job, what kind of mistake is that?",
                    acceptedAnswers: [
                        "wrong cost basis",
                        "used total overhead instead of applied overhead",
                        "wrong overhead basis",
                    ],
                    placeholder: "Type the likely mistake",
                    explanation:
                        "The student used a period-wide factory total instead of the amount assigned to the specific job, so the cost basis is wrong.",
                },
            ],
        },
    },
    {
        id: "price-elasticity-demand",
        title: "Price Elasticity of Demand",
        shortTitle: "Elasticity",
        category: "Economics",
        summary:
            "Study midpoint elasticity, sign interpretation, revenue movement, and common denominator mistakes in one focused review page.",
        intro:
            "Price elasticity of demand measures how responsive quantity demanded is to price changes. The topic is simple to state but easy to miscompute if students reverse denominators or misread the sign.",
        whyItMatters: [
            "It connects arithmetic with economic interpretation.",
            "It helps students explain whether demand is elastic, inelastic, or unit elastic.",
            "It clarifies why the same percentage change can have different revenue effects depending on responsiveness.",
        ],
        classContexts: [
            "Elasticity formula drills",
            "Midpoint-method exercises",
            "Revenue interpretation questions",
        ],
        whenToUse: [
            "Use it when price and quantity both change and the task asks for responsiveness.",
            "Use the midpoint method when the class expects symmetry between the starting and ending values.",
            "Be careful if the problem uses percentage-change wording without explicitly naming the midpoint method.",
        ],
        formulaOverview: [
            {
                label: "Midpoint elasticity",
                expression:
                    "Elasticity = (% change in quantity demanded) / (% change in price)",
                explanation:
                    "The midpoint method uses average quantity and average price in the percentage-change calculations.",
            },
        ],
        variableDefinitions: [
            { symbol: "Q1, Q2", meaning: "Initial and final quantities demanded" },
            { symbol: "P1, P2", meaning: "Initial and final prices" },
            { symbol: "Elasticity", meaning: "Responsiveness measure, often discussed in absolute value" },
        ],
        procedure: [
            "Compute the change in quantity and the average quantity.",
            "Compute the change in price and the average price.",
            "Calculate both percentage changes using midpoint bases.",
            "Divide quantity responsiveness by price responsiveness.",
            "Interpret the magnitude and then explain the likely revenue effect.",
        ],
        workedExample: {
            title: "Midpoint elasticity example",
            scenario:
                "Price falls from 120 to 100 and quantity demanded rises from 240 to 300.",
            steps: [
                "Change in quantity = 60; average quantity = 270.",
                "Quantity percentage change = 60 / 270.",
                "Change in price = -20; average price = 110.",
                "Price percentage change = -20 / 110.",
                "Elasticity is the ratio of those midpoint percentages.",
            ],
            result:
                "The elasticity magnitude is above 1, so demand is elastic.",
            interpretation:
                "Because demand is elastic, total revenue tends to move opposite the price change in this range.",
        },
        checkpointExample: {
            title: "Sign interpretation check",
            scenario:
                "A student reports elasticity as negative and concludes demand is 'bad' because the sign is negative.",
            steps: [
                "Recall that ordinary demand slopes downward, so the raw elasticity sign is usually negative.",
                "Use the magnitude for classification in basic classroom problems.",
                "Explain meaning instead of treating the negative sign as an error by itself.",
            ],
            result:
                "The sign is expected for demand. The magnitude is what classifies elasticity in most introductory problems.",
            interpretation:
                "A sign can carry direction, but classification still depends on responsiveness magnitude.",
        },
        interpretation: [
            "Elastic demand means quantity is relatively responsive to price changes.",
            "Inelastic demand means quantity changes less proportionally than price.",
            "Revenue interpretation should follow the elasticity reading, not replace it.",
        ],
        commonMistakes: [
            "Reversing the percentage-change denominator.",
            "Using starting-value percentages when the class expects midpoint percentages.",
            "Ignoring whether the answer should be interpreted in magnitude.",
            "Confusing revenue movement with elasticity itself.",
        ],
        examTraps: [
            "Problems often give the price change first, which tempts students to flip the elasticity ratio.",
            "Students may copy the negative sign into the classification instead of discussing responsiveness.",
            "Quantity supplied and quantity demanded are not interchangeable in elasticity wording.",
        ],
        selfCheck: [
            "Why does the midpoint method reduce base-value bias?",
            "Why is the raw sign of demand elasticity often negative?",
            "How does elastic demand affect revenue when price falls?",
        ],
        practiceCues: [
            "Explain the difference between elasticity magnitude and sign.",
            "Compare midpoint and simple-base percentage methods.",
            "Describe a likely denominator mistake in elasticity work.",
        ],
        keywords: [
            "price elasticity",
            "demand elasticity",
            "midpoint method",
            "percentage change in quantity",
            "percentage change in price",
        ],
        scanSignals: [
            "elasticity",
            "quantity demanded",
            "midpoint",
            "price falls",
            "total revenue",
        ],
        relatedCalculatorPaths: [
            "/economics/price-elasticity-demand",
            "/economics/economics-analysis-workspace",
            "/economics/market-equilibrium",
        ],
        relatedTopicIds: ["market-equilibrium", "scan-review"],
        quiz: {
            title: "Elasticity Concept Check",
            intro:
                "This short quiz checks whether you can diagnose the formula structure and interpret the result.",
            questions: [
                {
                    id: "el-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which denominator mistake is common in elasticity work?",
                    choices: [
                        "Using fixed cost instead of price",
                        "Using total assets instead of equity",
                        "Reversing the percentage-change basis",
                        "Using market supply instead of market demand in every case",
                    ],
                    answerIndex: 2,
                    explanation:
                        "A common classroom error is reversing the percentage-change basis or the ratio itself.",
                },
                {
                    id: "el-q2",
                    kind: "true-false",
                    prompt:
                        "For a standard downward-sloping demand curve, a negative raw elasticity sign is usually expected.",
                    answer: true,
                    explanation:
                        "Demand usually moves opposite price, so the raw sign is negative even though magnitude is often used for classification.",
                },
                {
                    id: "el-q3",
                    kind: "short-answer",
                    prompt:
                        "If elasticity magnitude is above 1, what classification should the student report?",
                    acceptedAnswers: ["elastic", "elastic demand"],
                    placeholder: "Type the classification",
                    explanation:
                        "An elasticity magnitude greater than 1 means demand is elastic in that range.",
                },
            ],
        },
    },
    {
        id: "market-equilibrium",
        title: "Market Equilibrium",
        shortTitle: "Equilibrium",
        category: "Economics",
        summary:
            "Study how demand and supply intersect, what shortages and surpluses mean, and how to interpret equilibrium values instead of only solving equations.",
        intro:
            "Market equilibrium is the price-quantity pair where planned quantity demanded equals planned quantity supplied. Students often solve the intersection correctly but skip the economic meaning of that result.",
        whyItMatters: [
            "It links algebraic solving with market interpretation.",
            "It explains why shortages and surpluses create pressure toward equilibrium.",
            "It helps students read demand and supply equations as economic models, not just symbols.",
        ],
        classContexts: [
            "Linear demand and supply equation problems",
            "Shortage and surplus interpretation",
            "Market-clearing price exercises",
        ],
        whenToUse: [
            "Use it when both demand and supply relations are given or implied.",
            "Use it when the question asks for equilibrium price, quantity, shortage, or surplus.",
            "Check that both equations are stated with the same variable orientation before solving.",
        ],
        formulaOverview: [
            {
                label: "Equilibrium condition",
                expression: "Quantity demanded = Quantity supplied",
                explanation:
                    "Set the two relations equal after converting them into a consistent algebraic form.",
            },
        ],
        variableDefinitions: [
            { symbol: "Qd", meaning: "Quantity demanded" },
            { symbol: "Qs", meaning: "Quantity supplied" },
            { symbol: "Pe", meaning: "Equilibrium price" },
            { symbol: "Qe", meaning: "Equilibrium quantity" },
        ],
        procedure: [
            "Rewrite demand and supply so both equations are comparable.",
            "Set quantity demanded equal to quantity supplied.",
            "Solve for equilibrium quantity or price depending on the form.",
            "Substitute back to find the missing equilibrium value.",
            "Interpret whether any non-equilibrium price would create a shortage or surplus.",
        ],
        workedExample: {
            title: "Linear-equation example",
            scenario:
                "Demand is P = 120 - 2Q and supply is P = 20 + Q.",
            steps: [
                "Set the equations equal because equilibrium requires the same price in both relations.",
                "120 - 2Q = 20 + Q.",
                "Solve to get 100 = 3Q, so Qe = 33.33.",
                "Substitute back to find equilibrium price.",
            ],
            result:
                "The equilibrium quantity is about 33.33 units and the equilibrium price is about 53.33.",
            interpretation:
                "That point is the market-clearing combination. At other prices, quantity demanded and supplied would not balance.",
        },
        checkpointExample: {
            title: "Shortage check",
            scenario:
                "The actual market price is set below equilibrium.",
            steps: [
                "At a below-equilibrium price, quantity demanded rises relative to quantity supplied.",
                "That imbalance is a shortage.",
                "The shortage creates upward pressure on price in a basic competitive model.",
            ],
            result: "A below-equilibrium price produces shortage, not surplus.",
            interpretation:
                "Students often memorize the word but forget the logic: a low price encourages buying and discourages supplying.",
        },
        interpretation: [
            "Equilibrium is not a moral ideal. It is the model point where planned demand equals planned supply.",
            "Shortage and surplus interpretation matters as much as the algebra.",
            "The direction of pressure toward equilibrium is part of the concept, not just a side note.",
        ],
        commonMistakes: [
            "Mixing price-form equations with quantity-form equations without converting them carefully.",
            "Confusing shortage with surplus when the actual price is above or below equilibrium.",
            "Stopping after solving the algebra without interpreting what the point means.",
        ],
        examTraps: [
            "Demand and supply may be written in different variable forms to test algebraic setup.",
            "The question may ask for the market condition at a non-equilibrium price instead of the equilibrium point itself.",
            "Students sometimes solve for one equilibrium value and forget to substitute back for the other.",
        ],
        selfCheck: [
            "Why does a below-equilibrium price cause shortage?",
            "What must be equal at equilibrium in a basic supply-and-demand model?",
            "Why should you substitute back after solving the first equilibrium variable?",
        ],
        practiceCues: [
            "Explain the difference between solving equilibrium and interpreting a shortage.",
            "Describe what happens when supply shifts outward while demand stays unchanged.",
            "Check whether the equations are in a consistent form before solving.",
        ],
        keywords: [
            "equilibrium",
            "market equilibrium",
            "demand and supply",
            "shortage",
            "surplus",
        ],
        scanSignals: [
            "demand equation",
            "supply equation",
            "market clearing",
            "shortage",
            "surplus",
        ],
        relatedCalculatorPaths: [
            "/economics/market-equilibrium",
            "/economics/surplus-analysis",
            "/economics/economics-analysis-workspace",
        ],
        relatedTopicIds: ["price-elasticity-demand"],
        quiz: {
            title: "Equilibrium Quick Check",
            intro:
                "Use this quiz to verify your understanding of the equation setup and the meaning of shortage or surplus.",
            questions: [
                {
                    id: "eq-q1",
                    kind: "multiple-choice",
                    prompt:
                        "At a price below equilibrium, the market condition is usually:",
                    choices: ["Surplus", "Shortage", "Zero demand", "Perfect competition"],
                    answerIndex: 1,
                    explanation:
                        "A below-equilibrium price makes quantity demanded exceed quantity supplied, creating shortage.",
                },
                {
                    id: "eq-q2",
                    kind: "true-false",
                    prompt:
                        "Solving equilibrium means setting quantity demanded equal to quantity supplied in a consistent form.",
                    answer: true,
                    explanation:
                        "That is the core solving condition in a basic market-equilibrium model.",
                },
                {
                    id: "eq-q3",
                    kind: "short-answer",
                    prompt:
                        "What is the likely issue if a student solves only for quantity and never substitutes back into the equation?",
                    acceptedAnswers: [
                        "missing equilibrium price",
                        "incomplete answer",
                        "did not solve both equilibrium values",
                    ],
                    placeholder: "Type a short diagnosis",
                    explanation:
                        "Many equilibrium problems need both price and quantity, so solving only one variable leaves the answer incomplete.",
                },
            ],
        },
    },
    {
        id: "capital-budgeting",
        title: "Capital Budgeting Basics",
        shortTitle: "Capital Budgeting",
        category: "Business Math / Finance",
        summary:
            "Study NPV, IRR, profitability index, and discounted payback as decision tools rather than isolated calculator buttons.",
        intro:
            "Capital budgeting decisions compare long-term cash-flow benefits against an initial investment. Students need more than formulas; they need to understand what each metric says and what it leaves out.",
        whyItMatters: [
            "It teaches why timing matters in project decisions.",
            "It clarifies why projects with similar payback can still differ in discounted value.",
            "It helps students compare investment measures without assuming they always rank projects the same way.",
        ],
        classContexts: [
            "NPV and IRR problems",
            "Project evaluation comparisons",
            "Discounted payback and profitability-index review",
        ],
        whenToUse: [
            "Use it when the problem gives an initial investment, discount rate, and future cash flows.",
            "Use NPV when the goal is direct value creation measurement.",
            "Use multiple metrics for comparison, but explain what each metric contributes.",
        ],
        formulaOverview: [
            {
                label: "Net present value",
                expression: "NPV = Present value of inflows - Initial investment",
                explanation:
                    "A positive NPV suggests the project adds value at the required discount rate.",
            },
            {
                label: "Profitability index",
                expression: "PI = Present value of inflows / Initial investment",
                explanation:
                    "This measures discounted inflows per unit of investment.",
            },
            {
                label: "Discounted payback",
                expression: "Discounted payback = Time needed to recover the investment using discounted cash flows",
                explanation:
                    "This incorporates the time value of money but still focuses on recovery rather than total value created.",
            },
        ],
        variableDefinitions: [
            { symbol: "CF", meaning: "Cash flow for a period" },
            { symbol: "r", meaning: "Discount rate or required rate of return" },
            { symbol: "NPV", meaning: "Net present value" },
            { symbol: "IRR", meaning: "Internal rate of return" },
        ],
        procedure: [
            "List the initial investment and the timing of each future cash flow.",
            "Discount the future cash flows at the required rate.",
            "Compare the discounted inflows with the initial investment.",
            "Interpret NPV first, then use IRR, PI, or discounted payback as supporting decision views.",
            "State assumptions and limits instead of treating the metric as self-explanatory.",
        ],
        workedExample: {
            title: "NPV-first project review",
            scenario:
                "A project needs a 250,000 investment and returns annual cash inflows of 70,000, 80,000, 90,000, and 85,000, with salvage value at the end.",
            steps: [
                "Discount each annual inflow and salvage value at the required rate.",
                "Add the present values of those inflows.",
                "Subtract the initial investment to get NPV.",
                "Use the sign and magnitude of NPV for the main value decision.",
            ],
            result:
                "If NPV is positive, the project earns above the required return under the model assumptions.",
            interpretation:
                "The decision logic is not 'positive means perfect.' It means the project clears the hurdle rate in present-value terms.",
        },
        checkpointExample: {
            title: "Metric comparison check",
            scenario:
                "Two projects have similar payback periods, but one has a clearly higher NPV.",
            steps: [
                "Notice that payback emphasizes recovery speed.",
                "NPV measures value creation after discounting.",
                "Use the stronger NPV reading when the course emphasizes wealth maximization.",
            ],
            result:
                "Matching payback does not guarantee matching value creation.",
            interpretation:
                "Students should not treat a faster payback as automatically superior if discounted value tells a different story.",
        },
        interpretation: [
            "NPV is generally the strongest direct value measure in a basic capital-budgeting set.",
            "IRR can be useful, but it is not the only decision metric and can become tricky in nonstandard cash-flow patterns.",
            "Discounted payback improves on simple payback but still ignores value created after recovery.",
        ],
        commonMistakes: [
            "Ignoring the timing of cash flows.",
            "Mixing annual and monthly rates without converting the basis.",
            "Treating payback as if it captures total profitability.",
            "Using IRR without checking whether the cash-flow pattern makes that interpretation reliable.",
        ],
        examTraps: [
            "Problems often include salvage value separately so students forget to discount it.",
            "The question may ask for the best decision measure, not only the metric calculation.",
            "Students often compare metrics without stating what each one measures.",
        ],
        selfCheck: [
            "Why is NPV usually the main decision metric in introductory capital budgeting?",
            "What does discounted payback improve relative to simple payback?",
            "Why do rate basis and time basis matter before discounting?",
        ],
        practiceCues: [
            "Explain why a positive NPV matters.",
            "Compare NPV and payback for the same project.",
            "Describe when timing assumptions can distort a project answer.",
        ],
        keywords: [
            "npv",
            "irr",
            "profitability index",
            "discounted payback",
            "capital budgeting",
        ],
        scanSignals: [
            "initial investment",
            "discount rate",
            "cash flows",
            "npv",
            "irr",
        ],
        relatedCalculatorPaths: [
            "/finance/npv",
            "/finance/internal-rate-of-return",
            "/finance/profitability-index",
            "/finance/discounted-payback-period",
            "/finance/capital-budgeting-comparison",
        ],
        relatedTopicIds: ["startup-cost-planning", "cvp-core"],
        quiz: {
            title: "Capital Budgeting Check",
            intro:
                "This short review checks whether you can identify what the major project metrics actually say.",
            questions: [
                {
                    id: "cb-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which metric most directly measures value created above the required return?",
                    choices: [
                        "Simple payback",
                        "Net present value",
                        "Accounting equation",
                        "Contribution margin ratio",
                    ],
                    answerIndex: 1,
                    explanation:
                        "NPV directly measures discounted value created relative to the hurdle rate.",
                },
                {
                    id: "cb-q2",
                    kind: "true-false",
                    prompt:
                        "Discounted payback includes the time value of money.",
                    answer: true,
                    explanation:
                        "Discounted payback uses discounted cash flows rather than nominal recovery only.",
                },
                {
                    id: "cb-q3",
                    kind: "short-answer",
                    prompt:
                        "What likely mistake occurs if a student uses a yearly discount rate on monthly cash flows without conversion?",
                    acceptedAnswers: [
                        "mixed period basis",
                        "wrong rate basis",
                        "mixed monthly and yearly basis",
                    ],
                    placeholder: "Type the likely issue",
                    explanation:
                        "Discounting requires a consistent time basis, so annual and monthly data must be aligned first.",
                },
            ],
        },
    },
    {
        id: "startup-cost-planning",
        title: "Startup Cost Planning",
        shortTitle: "Startup Costs",
        category: "Entrepreneurship",
        summary:
            "Study launch cost grouping, contingency, opening cash needs, and how startup planning connects to feasibility decisions.",
        intro:
            "Startup cost planning turns scattered business-launch expenses into a structured opening budget. It is both a business-planning topic and a discipline check against underestimating cash needs.",
        whyItMatters: [
            "It helps students separate one-time launch costs from recurring operating needs.",
            "It connects budgeting logic to feasibility and runway thinking.",
            "It supports cleaner discussions of contingency and opening cash reserves.",
        ],
        classContexts: [
            "Feasibility studies",
            "Startup planning and entrepreneurship assignments",
            "Opening budget and contingency reviews",
        ],
        whenToUse: [
            "Use it when the problem asks for launch requirements, permits, equipment, opening inventory, or contingency.",
            "Use it when building a startup budget before moving into pricing or runway decisions.",
            "Avoid treating contingency as optional decoration; it is part of disciplined planning.",
        ],
        formulaOverview: [
            {
                label: "Startup subtotal",
                expression: "Startup subtotal = Sum of one-time launch costs",
                explanation:
                    "This includes the direct cost of getting the venture ready to open.",
            },
            {
                label: "Recommended funding need",
                expression:
                    "Recommended funding = Startup subtotal + Contingency + Opening cash reserve",
                explanation:
                    "A better funding estimate includes both uncertainty protection and early operating liquidity.",
            },
        ],
        variableDefinitions: [
            { symbol: "Startup subtotal", meaning: "Total of identified launch costs" },
            { symbol: "Contingency", meaning: "Allowance for underestimation or surprise costs" },
            { symbol: "Opening cash reserve", meaning: "Cash buffer available at launch" },
        ],
        procedure: [
            "List startup costs by category instead of keeping them in one unstructured total.",
            "Separate one-time launch items from early operating cash needs.",
            "Add contingency deliberately rather than guessing only at the end.",
            "Interpret whether the total funding need still looks feasible for the project size.",
        ],
        workedExample: {
            title: "Launch budget example",
            scenario:
                "A small venture needs permits, equipment, opening inventory, signage, and a contingency allowance before opening.",
            steps: [
                "Group the costs into clear launch categories.",
                "Compute the startup subtotal from identified one-time items.",
                "Add contingency and opening cash reserve to estimate safer funding.",
                "Use the final amount as a planning figure, not as a guarantee of success.",
            ],
            result:
                "The recommended funding need should be broader than the raw equipment-and-inventory list.",
            interpretation:
                "A startup that plans only for visible purchases may still fail due to underestimated setup friction or early cash strain.",
        },
        checkpointExample: {
            title: "Contingency check",
            scenario:
                "A student omits contingency because every visible cost already has an estimate.",
            steps: [
                "Recognize that estimates can still be incomplete or optimistic.",
                "Explain that contingency is a planning safeguard, not a random markup.",
                "Use the omission as a sign of weak feasibility discipline.",
            ],
            result: "Leaving out contingency usually makes the plan look safer than it really is.",
            interpretation:
                "Entrepreneurship topics often punish overconfidence more than algebra mistakes.",
        },
        interpretation: [
            "Startup cost totals are planning estimates, not guarantees.",
            "A good startup budget explains what is included, what is recurring, and what still carries uncertainty.",
            "Funding need should be read together with pricing, sales, and runway expectations.",
        ],
        commonMistakes: [
            "Mixing one-time setup costs with recurring monthly costs.",
            "Ignoring contingency or opening cash reserve.",
            "Treating a funding total as meaningful without explaining what it covers.",
        ],
        examTraps: [
            "The problem may bury a recurring cost inside a launch description.",
            "Students may double-count opening inventory and initial operating stock if categories are unclear.",
            "The clean-looking subtotal is not always the best final planning answer.",
        ],
        selfCheck: [
            "Why is contingency a planning tool rather than a random add-on?",
            "What is the difference between launch cost and recurring operating cost?",
            "Why should startup cost planning connect to runway or pricing decisions afterward?",
        ],
        practiceCues: [
            "Explain why a startup subtotal can still be incomplete.",
            "Describe how launch cost planning connects to cash runway.",
            "State which omitted item would make the budget look falsely safe.",
        ],
        keywords: [
            "startup cost",
            "launch cost",
            "contingency",
            "opening inventory",
            "funding need",
        ],
        scanSignals: [
            "startup cost",
            "launch budget",
            "permits",
            "equipment",
            "contingency",
        ],
        relatedCalculatorPaths: [
            "/entrepreneurship/startup-cost-planner",
            "/entrepreneurship/unit-economics",
            "/entrepreneurship/cash-runway-planner",
            "/entrepreneurship/entrepreneurship-toolkit",
        ],
        relatedTopicIds: ["cvp-core", "capital-budgeting"],
        quiz: {
            title: "Startup Planning Check",
            intro:
                "Use this short set to confirm whether your startup budget logic is disciplined, not just numerically tidy.",
            questions: [
                {
                    id: "su-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which item most clearly belongs in a safer funding estimate rather than only the startup subtotal?",
                    choices: [
                        "Contingency allowance",
                        "Completed units transferred out",
                        "Elasticity magnitude",
                        "Partner capital ratio",
                    ],
                    answerIndex: 0,
                    explanation:
                        "A safer funding estimate usually includes contingency, not only the visible startup purchases.",
                },
                {
                    id: "su-q2",
                    kind: "true-false",
                    prompt:
                        "Recurring monthly costs should always be treated exactly the same way as one-time launch costs.",
                    answer: false,
                    explanation:
                        "One-time setup costs and recurring operating costs serve different planning purposes and should be separated.",
                },
                {
                    id: "su-q3",
                    kind: "short-answer",
                    prompt:
                        "What likely issue appears when a student ignores contingency in a startup plan?",
                    acceptedAnswers: [
                        "underestimation risk",
                        "budget too optimistic",
                        "ignored contingency",
                    ],
                    placeholder: "Type the planning issue",
                    explanation:
                        "Ignoring contingency usually makes the plan too optimistic and underestimates actual funding need.",
                },
            ],
        },
    },
    {
        id: "scan-review",
        title: "Scan Review and Verification",
        shortTitle: "Scan Review",
        category: "Smart Tools / Scan Support",
        summary:
            "Study how to verify OCR output, review risky values first, and choose whether the scan should go to a calculator, Smart Solver, or a lesson page.",
        intro:
            "Scan workflows are useful only when the app is honest about uncertainty. This topic teaches students how to review OCR output, verify sensitive numbers, and use scan results as a study aid instead of blind automation.",
        whyItMatters: [
            "It teaches verification before solving.",
            "It reduces the risk of trusting cleaned text that may still contain sensitive OCR errors.",
            "It helps users route a scan into the right workspace or lesson instead of forcing a weak calculator guess.",
        ],
        classContexts: [
            "Scanning textbook pages or worked solutions",
            "Checking handwritten worksheets",
            "Reviewing OCR output before Smart Solver or calculator routing",
        ],
        whenToUse: [
            "Use it whenever a scanned page still contains uncertain values, broken labels, or mixed topics.",
            "Use it before sending a scan into a calculator when the numbers could materially change the answer.",
            "Use it as a bridge from OCR to study support when the topic is clear but the concept is still unclear.",
        ],
        formulaOverview: [
            {
                label: "Verification priority",
                expression: "Verify flagged values -> Confirm topic -> Open the best-fit tool or lesson",
                explanation:
                    "The scan workflow is procedural. The goal is to reduce risk before committing to a solving path.",
            },
        ],
        variableDefinitions: [
            { symbol: "Flagged value", meaning: "A number or token the OCR cleanup treated cautiously" },
            { symbol: "Route confidence", meaning: "How strongly the scanned text matches a tool or topic" },
            { symbol: "Study follow-up", meaning: "A lesson or quiz suggestion tied to the scanned topic" },
        ],
        procedure: [
            "Review flagged numbers, percentages, currency, and operators before anything else.",
            "Check whether the detected topic actually matches the language on the page.",
            "Choose the safest next route: calculator, Smart Solver, or topic lesson.",
            "Keep raw text available when confidence is low instead of pretending the cleaned version is final.",
        ],
        workedExample: {
            title: "OCR-sensitive worksheet example",
            scenario:
                "A dark worksheet image is detected as a process-costing page, but several numeric values are flagged because commas and decimal points are uncertain.",
            steps: [
                "Confirm the topic first: equivalent units, ending WIP, and transferred-in cost all support the route.",
                "Review the flagged numbers directly against the image.",
                "Only after that, open the process-costing workspace or lesson page.",
            ],
            result:
                "The scan becomes useful because review happens before solving, not after an incorrect total is accepted.",
            interpretation:
                "Good scan use is not fast guessing. It is efficient verification plus correct routing.",
        },
        checkpointExample: {
            title: "Mixed-topic check",
            scenario:
                "A page contains both a worked solution and a formula summary, so the scan suggests Smart Solver instead of one narrow tool.",
            steps: [
                "Recognize that the topic is mixed or incomplete.",
                "Use Smart Solver or a topic lesson as the safer next step.",
                "Avoid forcing a specialized route from incomplete evidence.",
            ],
            result:
                "A broad route can be more correct than a fake high-confidence calculator match.",
            interpretation:
                "Route confidence should guide the next step honestly, not cosmetically.",
        },
        interpretation: [
            "A scan is strongest when it exposes uncertainty instead of hiding it.",
            "Topic learning can be a better follow-up than immediate calculation when OCR is readable but the concept is still unclear.",
            "Verification order matters: risky values first, then solving.",
        ],
        commonMistakes: [
            "Trusting cleaned text without checking flagged values.",
            "Opening a calculator just because one keyword matched even when the page is mixed-topic.",
            "Ignoring raw OCR text when confidence is low.",
        ],
        examTraps: [
            "Blurred zeros, sixes, eights, percentage symbols, and decimal points can change the entire answer.",
            "A worked solution page may look like a clean problem statement even though the student really needs answer checking.",
            "Merged words can make a topic seem different if the routing is not reviewed carefully.",
        ],
        selfCheck: [
            "Which numbers should you verify first in a low-confidence scan?",
            "When is Smart Solver safer than a narrow calculator route?",
            "Why should raw text stay available when confidence is weak?",
        ],
        practiceCues: [
            "Explain how scan-to-learn differs from scan-to-solve.",
            "Describe why route confidence and OCR confidence are not the same thing.",
            "List the first items you would verify in a worksheet photo.",
        ],
        keywords: [
            "scan",
            "ocr",
            "review extracted values",
            "flagged values",
            "route confidence",
        ],
        scanSignals: [
            "ocr",
            "scan",
            "flagged values",
            "review extracted text",
            "camera capture",
        ],
        relatedCalculatorPaths: [
            "/scan-check",
            "/smart/solver",
            "/accounting/process-costing-practice-checker",
        ],
        relatedTopicIds: ["process-costing", "cvp-core", "price-elasticity-demand"],
        quiz: {
            title: "Scan Review Check",
            intro:
                "This short set checks whether you know how to review OCR output before trusting it.",
            questions: [
                {
                    id: "sr-q1",
                    kind: "multiple-choice",
                    prompt:
                        "What should be reviewed first when OCR confidence is low?",
                    choices: [
                        "Only the page background color",
                        "Flagged values and high-risk operators",
                        "The donation prompt",
                        "Only the final paragraph",
                    ],
                    answerIndex: 1,
                    explanation:
                        "High-risk values and operators are the most likely sources of meaningful OCR corruption.",
                },
                {
                    id: "sr-q2",
                    kind: "true-false",
                    prompt:
                        "A mixed-topic scan should always force one specialized calculator route.",
                    answer: false,
                    explanation:
                        "If the page is mixed or incomplete, Smart Solver or a lesson page can be the safer next step.",
                },
                {
                    id: "sr-q3",
                    kind: "short-answer",
                    prompt:
                        "What is the likely issue if a user trusts cleaned OCR text without checking flagged numbers?",
                    acceptedAnswers: [
                        "unverified values",
                        "numeric corruption risk",
                        "trusted uncertain numbers",
                    ],
                    placeholder: "Type the likely issue",
                    explanation:
                        "The user may be relying on cleaned output that still contains risky numeric uncertainty.",
                },
            ],
        },
    },
];

const STUDY_HUB_EXPANSION_TOPICS: StudyTopic[] = [
    {
        id: "accounting-foundations-review",
        title: "Accounting Foundations Review",
        shortTitle: "Accounting Foundations",
        category: "Financial Accounting",
        summary:
            "Study the accounting equation, account classification, trial-balance logic, and adjusting entries as one connected review flow.",
        intro:
            "Foundational accounting problems are really classification and timing problems. This lesson connects transaction effects, normal balances, and end-of-period adjustments so students can explain why an entry is correct instead of memorizing debit-credit patterns blindly.",
        whyItMatters: [
            "These ideas support later reporting, worksheet, and error-checking topics.",
            "A strong foundation makes trial-balance and adjustment errors easier to diagnose.",
            "Students who understand period-end logic usually make fewer concept mistakes later.",
        ],
        classContexts: [
            "Accounting equation exercises",
            "Trial balance and account classification drills",
            "Adjusting entries for prepaids, accruals, and unearned items",
        ],
        whenToUse: [
            "Use this topic when the problem asks how a transaction affects assets, liabilities, or equity.",
            "Use it when you need to classify an account before posting or checking normal balance.",
            "Use it when the instructor asks for the period-end adjustment rather than the original entry.",
        ],
        formulaOverview: [
            {
                label: "Accounting equation",
                expression: "Assets = Liabilities + Owner's Equity",
                explanation:
                    "Every transaction analysis should still preserve this relationship after the entry is recorded.",
            },
            {
                label: "Adjusted balance logic",
                expression:
                    "Ending balance = Unadjusted balance + Increase adjustments - Decrease adjustments",
                explanation:
                    "This helps explain why the adjustment entry changes the reported ending amount.",
            },
        ],
        variableDefinitions: [
            { symbol: "A", meaning: "Assets controlled by the business" },
            { symbol: "L", meaning: "Liabilities or obligations owed" },
            { symbol: "OE", meaning: "Owner's or stockholders' equity" },
            { symbol: "Adj.", meaning: "End-of-period adjustment needed for proper reporting" },
        ],
        procedure: [
            "Read the fact pattern and identify the accounts involved.",
            "Classify each account before deciding whether it normally increases on the debit or credit side.",
            "Decide whether the event is an original transaction or an adjusting entry at period-end.",
            "Check the effect on the accounting equation and verify that debits still equal credits.",
            "Interpret the corrected balance as a reporting decision, not only a bookkeeping step.",
        ],
        workedExample: {
            title: "Prepaid insurance adjustment",
            scenario:
                "A company paid 24,000 for a one-year insurance policy on October 1. At December 31, the student must prepare the adjustment.",
            steps: [
                "The original payment created Prepaid Insurance, which is an asset.",
                "Three of twelve months have expired by December 31, so expired cost is 24,000 x 3 / 12 = 6,000.",
                "Debit Insurance Expense for 6,000 and credit Prepaid Insurance for 6,000.",
            ],
            result:
                "The correct adjustment recognizes 6,000 of insurance expense and reduces prepaid insurance by the same amount.",
            interpretation:
                "The entry does not create new cash movement. It corrects reporting so the remaining asset reflects only the unexpired portion.",
        },
        checkpointExample: {
            title: "Trial-balance quick check",
            scenario:
                "A student lists Accounts Receivable as a credit balance and Unearned Revenue as an asset. Decide what to review first.",
            steps: [
                "Classify Accounts Receivable as an asset with a normal debit balance.",
                "Classify Unearned Revenue as a liability, not an asset.",
                "Correct classification before checking arithmetic totals.",
            ],
            result: "The first issue is conceptual classification, not addition.",
            interpretation:
                "A worksheet can look balanced while still being wrong if the accounts are classified incorrectly.",
        },
        interpretation: [
            "Foundational accounting answers should be read as classification-and-reporting decisions, not only as debit-credit routines.",
            "Adjustments improve statement accuracy by matching revenues and expenses to the correct period.",
            "Trial-balance problems can fail because of wrong direction, omitted balances, or classification errors.",
        ],
        commonMistakes: [
            "Writing an adjusting entry that duplicates the original cash transaction.",
            "Checking totals before fixing account classification errors.",
            "Confusing unearned revenue with accrued revenue because both involve timing.",
        ],
        examTraps: [
            "Teachers often mix original transaction facts with period-end adjustment language in the same paragraph.",
            "Normal-balance errors can look small but usually signal a deeper classification misunderstanding.",
            "A balanced trial balance does not guarantee correct statements.",
        ],
        selfCheck: [
            "Why is an adjusting entry different from the original cash transaction entry?",
            "What should you verify before trusting a trial balance that adds correctly?",
            "How does an accrued expense affect the accounting equation?",
        ],
        practiceCues: [
            "Explain how a prepaid asset becomes expense over time.",
            "List three accounts and state their classification and normal balance.",
            "Describe why a trial-balance error can be conceptual before it becomes arithmetic.",
        ],
        keywords: [
            "accounting equation",
            "adjusting entries",
            "trial balance",
            "account classification",
            "normal balance",
        ],
        scanSignals: ["debit", "credit", "trial balance", "prepaid", "accrued", "unearned"],
        relatedCalculatorPaths: [
            "/accounting/accounting-equation",
            "/accounting/account-classification",
            "/accounting/trial-balance-checker",
            "/accounting/debit-credit-trainer",
            "/accounting/adjusting-entries-workspace",
        ],
        relatedTopicIds: ["bank-reconciliation-review", "scan-review"],
        quiz: {
            title: "Accounting Foundations Check",
            intro:
                "Use this set to verify whether you can connect transaction logic, account type, and period-end adjustments.",
            questions: [
                {
                    id: "afr-q1",
                    kind: "multiple-choice",
                    prompt: "Which account normally carries a credit balance?",
                    choices: [
                        "Prepaid Insurance",
                        "Accounts Receivable",
                        "Unearned Revenue",
                        "Supplies",
                    ],
                    answerIndex: 2,
                    explanation:
                        "Unearned Revenue is a liability, and liabilities normally carry credit balances.",
                },
                {
                    id: "afr-q2",
                    kind: "true-false",
                    prompt:
                        "An adjusting entry usually records new cash received or paid on the adjustment date.",
                    answer: false,
                    explanation:
                        "Most adjusting entries reclassify timing effects so balances match the correct period; they usually do not create new cash movement.",
                },
                {
                    id: "afr-q3",
                    kind: "short-answer",
                    prompt: "What is the main purpose of an end-of-period adjustment?",
                    acceptedAnswers: [
                        "proper period reporting",
                        "match revenues and expenses",
                        "correct balances for the period",
                    ],
                    placeholder: "Type the main purpose",
                    explanation:
                        "Adjustments make reported amounts reflect the correct accounting period and improve statement accuracy.",
                },
            ],
        },
    },
    {
        id: "inventory-and-ratio-review",
        title: "Inventory, Liquidity, and Ratio Review",
        shortTitle: "Inventory and Ratios",
        category: "Financial Accounting",
        summary:
            "Connect inventory valuation, working-capital logic, liquidity ratios, turnover measures, and statement analysis in one review lesson.",
        intro:
            "Many accounting problems ask for a ratio or inventory amount, but the deeper skill is understanding what the value says about control, liquidity, and operating efficiency. This lesson ties inventory methods and ratio analysis back to decision reading.",
        whyItMatters: [
            "Inventory method choices affect cost of goods sold, ending inventory, and gross profit.",
            "Liquidity and turnover ratios help explain whether short-term operations are healthy or strained.",
            "Statement analysis becomes stronger when calculations are linked to what changed operationally.",
        ],
        classContexts: [
            "FIFO versus weighted-average inventory exercises",
            "Working capital and operating-cycle analysis",
            "Liquidity, solvency, profitability, and turnover ratio assignments",
        ],
        whenToUse: [
            "Use this topic when the problem asks for inventory valuation, NRV comparison, or method effects.",
            "Use it when ratio outputs need explanation instead of only computation.",
            "Use it when working capital, operating cycle, or cash conversion cycle must be read together.",
        ],
        formulaOverview: [
            {
                label: "Current ratio",
                expression: "Current ratio = Current assets / Current liabilities",
                explanation:
                    "This measures short-term coverage, but it is stronger when read with inventory quality and receivable speed.",
            },
            {
                label: "Inventory turnover",
                expression: "Inventory turnover = Cost of goods sold / Average inventory",
                explanation:
                    "This shows how quickly inventory is sold relative to its average carrying amount.",
            },
            {
                label: "Cash conversion cycle",
                expression:
                    "Cash conversion cycle = Days in inventory + Collection period - Payment period",
                explanation:
                    "This estimates how long cash stays tied up in operating activity.",
            },
        ],
        variableDefinitions: [
            { symbol: "CA", meaning: "Current assets" },
            { symbol: "CL", meaning: "Current liabilities" },
            { symbol: "COGS", meaning: "Cost of goods sold" },
            { symbol: "Avg Inv", meaning: "Average inventory for the period" },
            { symbol: "CCC", meaning: "Cash conversion cycle" },
        ],
        procedure: [
            "Identify whether the question is about valuation, turnover speed, or short-term solvency.",
            "Use the correct inventory amount basis before calculating a ratio: beginning, ending, or average as required.",
            "Check whether the ratio should be interpreted as stronger or weaker based on context, not in isolation.",
            "For working-capital analysis, connect inventory days, collection period, and payment period instead of reading one metric alone.",
            "Explain what changed operationally to produce the computed value.",
        ],
        workedExample: {
            title: "Working-capital reading example",
            scenario:
                "A business has current assets of 420,000, current liabilities of 210,000, days in inventory of 58, collection period of 34 days, and payment period of 26 days.",
            steps: [
                "Current ratio = 420,000 / 210,000 = 2.00.",
                "Cash conversion cycle = 58 + 34 - 26 = 66 days.",
                "Read the ratio and the cycle together instead of treating them as unrelated outputs.",
            ],
            result:
                "The company reports a current ratio of 2.00 and a cash conversion cycle of 66 days.",
            interpretation:
                "Short-term coverage looks reasonable, but cash is still tied up in operations for more than two months, so inventory and collection discipline still matter.",
        },
        checkpointExample: {
            title: "Inventory method checkpoint",
            scenario:
                "Under rising costs, compare FIFO with weighted average for ending inventory and cost of goods sold.",
            steps: [
                "FIFO tends to leave newer, higher costs in ending inventory.",
                "That usually produces lower cost of goods sold than a later average that blends more recent costs into units sold.",
                "Interpret the difference through gross profit and asset valuation, not just inventory amount.",
            ],
            result:
                "Under rising prices, FIFO typically reports higher ending inventory and lower cost of goods sold than weighted average.",
            interpretation:
                "That can improve gross profit and liquidity-looking figures, but it does not automatically mean operations improved.",
        },
        interpretation: [
            "A ratio becomes useful only when linked to operating meaning, not just benchmark memorization.",
            "Inventory valuation methods affect reported profit and balance-sheet amounts, especially when costs are changing.",
            "Working capital is healthiest when liquidity, turnover, and payment timing are read together.",
        ],
        commonMistakes: [
            "Using ending balances when the question requires average balances for turnover ratios.",
            "Calling a ratio good or bad without considering inventory quality or collection speed.",
            "Treating NRV write-down questions like ordinary cost-flow assumptions.",
        ],
        examTraps: [
            "Some problems hide average-balance requirements inside the narrative instead of the formula line.",
            "A stronger current ratio can still coexist with weak operating cash discipline.",
            "Inventory comparison questions often expect qualitative interpretation after the numbers.",
        ],
        selfCheck: [
            "Why should current ratio and cash conversion cycle often be read together?",
            "What usually happens to FIFO ending inventory during rising costs?",
            "Which turnover formulas usually need average balances rather than ending balances?",
        ],
        practiceCues: [
            "Explain what a long cash conversion cycle says about operations.",
            "Compare inventory method effects on COGS and ending inventory in one paragraph.",
            "Describe why turnover ratios lose value when the wrong inventory basis is used.",
        ],
        keywords: [
            "inventory methods",
            "current ratio",
            "cash conversion cycle",
            "ratio analysis",
            "working capital",
        ],
        scanSignals: [
            "fifo",
            "weighted average inventory",
            "current ratio",
            "quick ratio",
            "operating cycle",
            "working capital",
        ],
        relatedCalculatorPaths: [
            "/accounting/fifo-inventory",
            "/accounting/weighted-average-inventory",
            "/accounting/inventory-method-comparison",
            "/accounting/gross-profit-method",
            "/accounting/lower-of-cost-or-nrv",
            "/accounting/current-ratio",
            "/accounting/quick-ratio",
            "/accounting/working-capital-cycle",
            "/accounting/cash-ratio",
            "/accounting/cash-conversion-cycle",
            "/accounting/receivables-turnover",
            "/accounting/inventory-turnover",
            "/accounting/accounts-payable-turnover",
            "/accounting/debt-to-equity",
            "/accounting/debt-ratio",
            "/accounting/return-on-assets",
            "/accounting/asset-turnover",
            "/accounting/return-on-equity",
            "/accounting/ratio-analysis-workspace",
            "/accounting/times-interest-earned",
            "/accounting/earnings-per-share",
            "/accounting/book-value-per-share",
            "/accounting/equity-multiplier",
            "/accounting/horizontal-analysis",
            "/accounting/common-size-income-statement",
            "/accounting/common-size-balance-sheet",
            "/accounting/vertical-analysis",
            "/accounting/working-capital-planner",
            "/accounting/inventory-control-workspace",
        ],
        relatedTopicIds: [
            "accounting-foundations-review",
            "bank-reconciliation-review",
            "capital-budgeting",
            "scan-review",
        ],
        quiz: {
            title: "Inventory and Ratio Review Check",
            intro:
                "Use this quiz to check whether you can connect valuation and analysis instead of treating them as separate chapters.",
            questions: [
                {
                    id: "irr-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which ratio most directly measures short-term coverage using current assets and current liabilities?",
                    choices: [
                        "Debt ratio",
                        "Current ratio",
                        "Return on assets",
                        "Asset turnover",
                    ],
                    answerIndex: 1,
                    explanation:
                        "The current ratio is the standard short-term coverage measure using current assets over current liabilities.",
                },
                {
                    id: "irr-q2",
                    kind: "true-false",
                    prompt: "Inventory turnover usually uses ending inventory only.",
                    answer: false,
                    explanation:
                        "Inventory turnover is typically based on average inventory, not just the ending balance.",
                },
                {
                    id: "irr-q3",
                    kind: "short-answer",
                    prompt: "What operating idea does a long cash conversion cycle usually signal?",
                    acceptedAnswers: [
                        "cash tied up in operations",
                        "cash remains tied up longer",
                        "slower operating cash recovery",
                    ],
                    placeholder: "Type the operating idea",
                    explanation:
                        "A longer cycle usually means operating cash stays committed for a longer period before it returns through collections.",
                },
            ],
        },
    },
    {
        id: "bank-reconciliation-review",
        title: "Bank Reconciliation and Cash Control Review",
        shortTitle: "Bank Reconciliation",
        category: "Financial Accounting",
        summary:
            "Study adjusted bank balance, adjusted book balance, timing differences, bank-side items, and cash-control interpretation as one disciplined reconciliation workflow.",
        intro:
            "Bank reconciliation is not just a mechanical check. It is a cash-control process that explains why the bank statement and the company's cash record differ, which items are only timing differences, and which items require immediate book adjustment.",
        whyItMatters: [
            "It protects the reliability of cash balances before financial statements are finalized.",
            "It separates timing differences from errors and unrecorded bank activity.",
            "It helps students justify adjusting entries instead of only copying the final reconciled amount.",
        ],
        classContexts: [
            "Bank reconciliation worksheets",
            "Cash-control and internal-control discussions",
            "Adjusting-entry questions tied to bank statements",
        ],
        whenToUse: [
            "Use this topic when the problem gives balance per bank and balance per books with reconciling items.",
            "Use it when the question asks which items affect the bank side, the book side, or both.",
            "Use it when the result must be explained in terms of cash control instead of only a final adjusted balance.",
        ],
        formulaOverview: [
            {
                label: "Adjusted bank balance",
                expression:
                    "Adjusted bank balance = Bank statement balance + Deposits in transit - Outstanding checks +/- Bank error",
                explanation:
                    "The bank side is corrected for timing differences and any identified bank error.",
            },
            {
                label: "Adjusted book balance",
                expression:
                    "Adjusted book balance = Book cash balance - Bank charges - NSF checks + Interest income + Notes collected by bank +/- Book error",
                explanation:
                    "The book side includes items the bank already knows about but the company has not yet recorded correctly.",
            },
            {
                label: "Reconciled cash",
                expression: "Reconciled cash = Adjusted bank balance = Adjusted book balance",
                explanation:
                    "A finished reconciliation ends with one corrected cash amount that both sides support.",
            },
        ],
        variableDefinitions: [
            { symbol: "Balance per bank", meaning: "Cash balance shown by the bank statement." },
            { symbol: "Balance per books", meaning: "Cash balance in the company's accounting records." },
            { symbol: "DIT", meaning: "Deposits in transit that the company recorded before the bank did." },
            { symbol: "OC", meaning: "Outstanding checks already issued but not yet cleared by the bank." },
            { symbol: "NSF", meaning: "A dishonored customer check that reduces the book-side cash balance." },
        ],
        procedure: [
            "Start with the bank statement balance and the book cash balance separately.",
            "Place deposits in transit and outstanding checks on the bank side because they explain timing differences between the statement and the company's record.",
            "Place service charges, NSF checks, interest income, and notes collected by the bank on the book side because they require updating the accounting records.",
            "Apply any error adjustment to the side where the error happened.",
            "Compare the adjusted bank and adjusted book balances. If they do not match, a reconciling item is missing or a sign was reversed.",
        ],
        workedExample: {
            title: "Monthly cash-control example",
            scenario:
                "Balance per bank is 52,000 and balance per books is 49,800. Deposits in transit are 6,000, outstanding checks are 4,200, service charges are 300, NSF checks are 700, interest income is 450, and notes collected by the bank are 1,750.",
            steps: [
                "Adjusted bank balance = 52,000 + 6,000 - 4,200 = 53,800.",
                "Adjusted book balance = 49,800 - 300 - 700 + 450 + 1,750 = 51,000.",
                "The two adjusted balances do not yet agree, so a reconciling item or error adjustment is still missing.",
            ],
            result:
                "The preliminary reconciliation shows that the current item list is incomplete because the adjusted balances still differ.",
            interpretation:
                "A mismatch after adjustment is useful evidence. It means the worksheet is still protecting the integrity of cash by forcing another review before the balance is trusted.",
        },
        checkpointExample: {
            title: "Timing versus book-entry checkpoint",
            scenario:
                "A deposit was recorded by the company on June 30 but did not appear on the bank statement until July 2.",
            steps: [
                "This is a timing difference rather than a mistake.",
                "The item belongs on the bank side as a deposit in transit.",
                "No new book entry is needed just because the bank statement is later.",
            ],
            result: "The item is a bank-side timing difference, not a new book adjustment.",
            interpretation:
                "The key distinction is whether the company already recorded the item correctly. If it did, the bank side explains the difference.",
        },
        interpretation: [
            "A completed reconciliation supports the reliability of cash, not just a worksheet requirement.",
            "Timing differences do not automatically require journal entries, but book-side omissions and errors usually do.",
            "If the adjusted balances still disagree, the correct response is review and verification, not forced acceptance of one side.",
        ],
        commonMistakes: [
            "Placing deposits in transit or outstanding checks on the book side instead of the bank side.",
            "Adding service charges or NSF checks instead of subtracting them from the book side.",
            "Forgetting that a note collected by the bank increases the book-side balance.",
        ],
        examTraps: [
            "Problems often mix timing differences and actual book adjustments in one list to test classification skill.",
            "An item described as 'recorded by the bank' usually affects the book side because the company still has to update its records.",
            "Some worksheets hide an error adjustment inside the narrative instead of labeling it directly.",
        ],
        selfCheck: [
            "Which reconciling items usually belong on the bank side only?",
            "Why do service charges and NSF checks affect the book side?",
            "What does a remaining difference after adjustment usually mean?",
        ],
        practiceCues: [
            "Classify each reconciling item first before calculating.",
            "Explain whether the item is a timing difference, an omitted book entry, or an error correction.",
            "State whether the reconciliation is complete or still missing support.",
        ],
        keywords: [
            "bank reconciliation",
            "cash control",
            "deposits in transit",
            "outstanding checks",
            "adjusted cash balance",
        ],
        scanSignals: [
            "balance per bank",
            "balance per books",
            "deposits in transit",
            "outstanding checks",
            "nsf",
            "service charges",
        ],
        relatedCalculatorPaths: [
            "/accounting/bank-reconciliation",
            "/accounting/working-capital-planner",
            "/accounting/adjusting-entries-workspace",
            "/accounting/inventory-control-workspace",
        ],
        relatedTopicIds: [
            "accounting-foundations-review",
            "inventory-and-ratio-review",
            "scan-review",
        ],
        quiz: {
            title: "Bank Reconciliation Check",
            intro:
                "Use this short set to verify whether you can classify reconciling items correctly before trusting the adjusted cash balance.",
            questions: [
                {
                    id: "br-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which item normally appears on the bank side of a reconciliation because it is a timing difference already recorded by the company?",
                    choices: [
                        "Service charges",
                        "Deposits in transit",
                        "NSF checks",
                        "Interest income collected by the bank",
                    ],
                    answerIndex: 1,
                    explanation:
                        "Deposits in transit were already recorded by the company but not yet by the bank, so they explain the bank-side difference.",
                },
                {
                    id: "br-q2",
                    kind: "true-false",
                    prompt: "Notes collected by the bank usually increase the adjusted book balance.",
                    answer: true,
                    explanation:
                        "The bank already added the collection, so the company usually needs to increase its book-side cash balance for the same item.",
                },
                {
                    id: "br-q3",
                    kind: "short-answer",
                    prompt:
                        "If the adjusted bank and adjusted book balances still do not match, what does that usually mean?",
                    acceptedAnswers: [
                        "a reconciling item is missing",
                        "an error is still uncorrected",
                        "the reconciliation is incomplete",
                    ],
                    placeholder: "State the likely issue",
                    explanation:
                        "A remaining difference usually means at least one reconciling item or error adjustment is still missing or signed incorrectly.",
                },
            ],
        },
    },
    {
        id: "finance-time-value-review",
        title: "Time Value, Loans, and Investment Review",
        shortTitle: "Time Value Review",
        category: "Business Math / Finance",
        summary:
            "Review simple interest, compound growth, present value, future value, annuities, loans, and investment-decision logic as one finance pathway.",
        intro:
            "Finance questions often look different on the surface, but many of them are still time-value questions. This lesson links single-sum growth, discounting, annuity cash flows, loan schedules, and project evaluation so the student sees one coherent framework.",
        whyItMatters: [
            "It helps students choose the correct factor logic instead of memorizing disconnected formulas.",
            "Loan, annuity, and project answers all depend on understanding time and rate bases correctly.",
            "Small mistakes in compounding frequency or cash-flow timing can change the answer materially.",
        ],
        classContexts: [
            "Simple and compound interest exercises",
            "Present-value and future-value word problems",
            "Loan payment, annuity, NPV, IRR, and payback assignments",
        ],
        whenToUse: [
            "Use this topic when the problem involves growth, discounting, loan payments, or recurring deposits.",
            "Use it when a project evaluation requires reading discounted cash flows instead of simple arithmetic totals.",
            "Use it when the rate basis, compounding frequency, or annuity timing is easy to misread.",
        ],
        formulaOverview: [
            {
                label: "Simple interest",
                expression: "I = P r t",
                explanation:
                    "Simple interest uses principal, rate, and time without compounding between subperiods.",
            },
            {
                label: "Future value of a single sum",
                expression: "FV = PV (1 + i)^n",
                explanation:
                    "This measures how one present amount grows across compounding periods.",
            },
            {
                label: "Present value of a single sum",
                expression: "PV = FV / (1 + i)^n",
                explanation:
                    "This discounts a future amount back to today's value.",
            },
            {
                label: "Net present value",
                expression: "NPV = Present value of inflows - Initial investment",
                explanation:
                    "A positive NPV means the project adds value at the chosen discount rate.",
            },
        ],
        variableDefinitions: [
            { symbol: "P or PV", meaning: "Present value or principal today" },
            { symbol: "FV", meaning: "Future value after compounding" },
            { symbol: "i", meaning: "Periodic interest or discount rate" },
            { symbol: "n", meaning: "Number of compounding or payment periods" },
            { symbol: "NPV", meaning: "Net present value of the project" },
        ],
        procedure: [
            "Determine whether the cash flow is a single sum, a series, a loan, or a project decision.",
            "Convert the stated rate and time into a consistent periodic basis before calculating.",
            "Identify whether the problem requires growth forward or discounting backward.",
            "Use annuity logic for equal recurring payments, then move to loan or sinking-fund interpretation if relevant.",
            "For project decisions, interpret the discounted result instead of stopping at the computed amount.",
        ],
        workedExample: {
            title: "Present-value decision example",
            scenario:
                "A project requires an initial investment of 180,000 and is expected to generate discounted inflows totaling 212,000 at the required rate.",
            steps: [
                "Compute NPV as 212,000 - 180,000 = 32,000.",
                "Read the sign of the result before trying to interpret it.",
                "Connect the positive NPV to value creation at the required return.",
            ],
            result: "The project has a positive NPV of 32,000.",
            interpretation:
                "At the chosen discount rate, the inflows more than recover the investment and required return, so the project is financially acceptable under NPV logic.",
        },
        checkpointExample: {
            title: "Rate-basis checkpoint",
            scenario:
                "A nominal annual rate is quoted with monthly compounding, but the student uses the annual rate directly for a monthly annuity formula.",
            steps: [
                "The annual rate must be converted to a monthly periodic rate.",
                "The number of periods must match the same monthly basis.",
                "Recompute only after rate basis and time basis agree.",
            ],
            result:
                "The original answer is unreliable because the rate and period bases are inconsistent.",
            interpretation:
                "Many finance mistakes are not arithmetic errors. They are basis errors involving time and compounding.",
        },
        interpretation: [
            "Time-value results explain whether money is being grown or discounted across periods.",
            "Loan and annuity answers should always be interpreted with timing and payment structure in mind.",
            "Capital-budgeting outputs are decision tools, not just finance formulas.",
        ],
        commonMistakes: [
            "Using an annual rate with monthly periods without conversion.",
            "Confusing ordinary annuity timing with an annuity-due setup.",
            "Treating payback or NPV as if they answer the same question.",
        ],
        examTraps: [
            "Problems often hide compounding frequency in a phrase rather than a visible variable line.",
            "Loan payment questions may mix total payments, periodic payments, and total interest in the same paragraph.",
            "A project can have attractive payback but still fail a discounted measure.",
        ],
        selfCheck: [
            "When should present value be used instead of future value?",
            "Why must rate basis and period basis match?",
            "What does a positive NPV say at the required rate of return?",
        ],
        practiceCues: [
            "Explain the difference between compounding and discounting.",
            "Describe how an annuity differs from a single-sum problem.",
            "State why NPV is a decision measure rather than a raw arithmetic total.",
        ],
        keywords: [
            "simple interest",
            "present value",
            "future value",
            "loan amortization",
            "npv",
        ],
        scanSignals: ["interest", "discount rate", "annuity", "loan payment", "npv", "irr"],
        relatedCalculatorPaths: [
            "/finance/simple-interest",
            "/finance/compound-interest",
            "/finance/future-value",
            "/finance/present-value",
            "/finance/future-value-annuity",
            "/finance/present-value-annuity",
            "/finance/effective-interest-rate",
            "/finance/sinking-fund-deposit",
            "/finance/loan-amortization",
            "/finance/npv",
            "/finance/capital-budgeting-comparison",
            "/finance/internal-rate-of-return",
            "/finance/profitability-index",
            "/finance/payback-period",
            "/finance/discounted-payback-period",
        ],
        relatedTopicIds: ["capital-budgeting", "cvp-core", "startup-cost-planning"],
        quiz: {
            title: "Time Value Review Check",
            intro:
                "Use this set to check your rate-basis discipline and investment interpretation.",
            questions: [
                {
                    id: "tvr-q1",
                    kind: "multiple-choice",
                    prompt: "Which formula best represents a single-sum future value model?",
                    choices: [
                        "FV = PV (1 + i)^n",
                        "I = P + r + t",
                        "NPV = Initial investment - FV",
                        "CCC = Days in inventory + Collection period - Payment period",
                    ],
                    answerIndex: 0,
                    explanation:
                        "A single present amount grows to future value through compounding: FV = PV (1 + i)^n.",
                },
                {
                    id: "tvr-q2",
                    kind: "true-false",
                    prompt:
                        "A positive NPV usually means the project fails to earn the required return.",
                    answer: false,
                    explanation:
                        "A positive NPV means the project exceeds the required return at the discount rate used.",
                },
                {
                    id: "tvr-q3",
                    kind: "short-answer",
                    prompt: "What must match before applying a time-value formula correctly?",
                    acceptedAnswers: [
                        "rate basis and period basis",
                        "rate and time basis",
                        "periodic rate and number of periods",
                    ],
                    placeholder: "Type what must match",
                    explanation:
                        "Time-value formulas are reliable only when the interest-rate basis and the period basis are consistent.",
                },
            ],
        },
    },
    {
        id: "budgeting-and-planning-review",
        title: "Budgeting, Forecasting, and Planning Review",
        shortTitle: "Budgeting Review",
        category: "Managerial & Cost Accounting",
        summary:
            "Study cash collections, cash disbursements, cash budgets, flexible budgets, and planning-based entrepreneurship tools from one structured lesson.",
        intro:
            "Planning tools are connected because each one turns assumptions about sales, collections, payments, and operating activity into a decision-ready plan. This lesson ties those flows together instead of treating each schedule as an isolated form.",
        whyItMatters: [
            "Students need to see how sales assumptions move into collections, disbursements, and financing needs.",
            "Budgeting topics are more accurate when connected to timing patterns instead of isolated schedules.",
            "Planning logic also supports entrepreneurship tools such as startup budgets, forecasts, and cash runway.",
        ],
        classContexts: [
            "Cash-collections and cash-disbursements schedules",
            "Cash-budget and flexible-budget assignments",
            "Startup planning, sales forecasting, and runway estimation",
        ],
        whenToUse: [
            "Use this topic when the question asks for a schedule, budget, or planning interpretation over time.",
            "Use it when sales are given in one period but cash moves in later periods.",
            "Use it when a startup or small-business case needs cash-planning interpretation rather than only arithmetic output.",
        ],
        formulaOverview: [
            {
                label: "Cash budget ending balance",
                expression:
                    "Ending cash = Beginning cash + Cash collections - Cash disbursements +/- Financing",
                explanation:
                    "This is the final planning view after operating receipts, payments, and required financing are considered.",
            },
            {
                label: "Flexible budget cost pattern",
                expression:
                    "Flexible budget = Fixed cost + (Variable rate x Actual activity)",
                explanation:
                    "This separates activity-driven changes from pure spending variance.",
            },
            {
                label: "Cash runway",
                expression: "Runway = Available cash / Net monthly cash burn",
                explanation:
                    "This estimates how long current cash can support operations when outflows exceed inflows.",
            },
        ],
        variableDefinitions: [
            { symbol: "Beg Cash", meaning: "Cash available at the start of the period" },
            { symbol: "Collections", meaning: "Cash expected from current and prior sales" },
            { symbol: "Disbursements", meaning: "Cash payments expected for purchases and expenses" },
            { symbol: "Activity", meaning: "Actual units, hours, or other driver used in a flexible budget" },
            { symbol: "Burn", meaning: "Net monthly cash outflow when a venture spends more than it receives" },
        ],
        procedure: [
            "Identify the time structure first: month-based schedules, activity-based budgets, or startup planning horizon.",
            "Separate sales or expense assumptions from actual cash timing before preparing a cash figure.",
            "Build supporting schedules first when the cash budget depends on collection or payment lags.",
            "Interpret whether the plan shows surplus cash, financing need, or weak operating flexibility.",
            "For startup or forecasting problems, connect the budget result to viability and decision follow-up.",
        ],
        workedExample: {
            title: "Cash-budget planning example",
            scenario:
                "A company starts the month with 40,000 cash, expects 180,000 collections, 205,000 disbursements, and wants a minimum cash balance of 25,000.",
            steps: [
                "Preliminary ending cash = 40,000 + 180,000 - 205,000 = 15,000.",
                "Compare the preliminary balance with the required minimum of 25,000.",
                "Required financing is 10,000 to restore the ending balance to the minimum.",
            ],
            result: "The budget shows a 10,000 financing need for the period.",
            interpretation:
                "The issue is timing. Collections and disbursements do not line up closely enough to maintain the required cash floor.",
        },
        checkpointExample: {
            title: "Flexible-budget checkpoint",
            scenario:
                "Actual units are lower than planned, and the student compares actual total variable cost only to the static budget.",
            steps: [
                "Static-budget comparison mixes activity change with spending discipline.",
                "Restate variable cost at actual activity using the flexible budget.",
                "Only then judge whether cost control was favorable or unfavorable.",
            ],
            result:
                "The original comparison is incomplete because it ignores activity-level adjustment.",
            interpretation:
                "Flexible budgets separate volume effects from spending performance, which is why they are more useful for control.",
        },
        interpretation: [
            "Schedules explain cash timing, while budgets explain planning sufficiency and control.",
            "A financing need can arise from timing pressure even when total sales appear healthy.",
            "Forecast and runway tools should be interpreted as planning discipline, not guaranteed prediction.",
        ],
        commonMistakes: [
            "Treating sales as if they equal collections in the same month.",
            "Comparing actual cost only to a static budget when activity changed materially.",
            "Ignoring minimum cash requirements or financing assumptions in a budget question.",
        ],
        examTraps: [
            "Collection and payment lags are often buried in the narrative instead of shown in a table.",
            "A cash budget may require supporting schedules before any final cash answer is possible.",
            "Startup forecast questions may mix growth assumptions and cash-burn logic in one case.",
        ],
        selfCheck: [
            "Why should cash collections be prepared before the cash budget when timing lags exist?",
            "What is the main purpose of a flexible budget?",
            "What does runway measure in a startup or planning setting?",
        ],
        practiceCues: [
            "Explain why strong sales do not always prevent a cash shortage.",
            "Describe how a flexible budget improves interpretation over a static budget.",
            "State what a short runway implies for planning urgency.",
        ],
        keywords: [
            "cash budget",
            "cash collections",
            "cash disbursements",
            "flexible budget",
            "runway",
        ],
        scanSignals: [
            "cash budget",
            "collections schedule",
            "disbursements schedule",
            "flexible budget",
            "sales forecast",
            "cash runway",
        ],
        relatedCalculatorPaths: [
            "/business/cash-collections-schedule",
            "/business/cash-disbursements-schedule",
            "/business/cash-budget",
            "/business/flexible-budget",
            "/entrepreneurship/startup-cost-planner",
            "/entrepreneurship/unit-economics",
            "/entrepreneurship/sales-forecast-planner",
            "/entrepreneurship/cash-runway-planner",
            "/entrepreneurship/entrepreneurship-toolkit",
        ],
        relatedTopicIds: ["cvp-core", "finance-time-value-review", "startup-cost-planning"],
        quiz: {
            title: "Budgeting and Planning Review Check",
            intro:
                "Use this set to check whether you can connect timing, control, and planning interpretation.",
            questions: [
                {
                    id: "bpr-q1",
                    kind: "multiple-choice",
                    prompt:
                        "What should usually be prepared before a final cash budget when sales are collected over time?",
                    choices: [
                        "Statement of partners' capital",
                        "Cash collections schedule",
                        "Depreciation method comparison",
                        "Price elasticity table",
                    ],
                    answerIndex: 1,
                    explanation:
                        "A cash collections schedule is usually needed first because sales and cash receipts often occur in different periods.",
                },
                {
                    id: "bpr-q2",
                    kind: "true-false",
                    prompt:
                        "A flexible budget is designed to separate activity effects from spending effects.",
                    answer: true,
                    explanation:
                        "That separation is the main reason a flexible budget is more useful for control than a static plan alone.",
                },
                {
                    id: "bpr-q3",
                    kind: "short-answer",
                    prompt: "What does a short cash runway usually suggest?",
                    acceptedAnswers: [
                        "limited time before cash runs out",
                        "urgent cash planning need",
                        "cash may run out soon",
                    ],
                    placeholder: "Type what it suggests",
                    explanation:
                        "A short runway usually means available cash can support operations for only a limited period unless conditions change.",
                },
            ],
        },
    },
    {
        id: "working-capital-and-control-review",
        title: "Working Capital, Inventory Control, and Cash Cycle Review",
        shortTitle: "Working Capital Control",
        category: "Financial Accounting",
        summary:
            "Study working capital, cash-cycle timing, inventory shrinkage, receivables and payables discipline, and why control-oriented schedules matter before a liquidity problem appears in the statements.",
        intro:
            "Working capital topics connect liquidity, inventory discipline, receivables collection, and supplier payment timing. This lesson keeps those pieces together so students can explain not only what a ratio or control amount is, but why weak turnover, shrinkage, or payment discipline changes cash pressure.",
        whyItMatters: [
            "Students often compute liquidity measures correctly but still miss the operational reason cash pressure exists.",
            "Inventory shrinkage, slow collection, and delayed supplier payment all affect working-capital quality differently.",
            "Control-oriented topics become easier when cash-cycle timing is tied back to statements, schedules, and corrective action.",
        ],
        classContexts: [
            "Working capital and liquidity analysis exercises",
            "Inventory-control, shrinkage, and cash-discount review problems",
            "Cash conversion cycle, receivables, and payables discussion cases",
        ],
        whenToUse: [
            "Use this topic when the question asks what is driving cash pressure or operating liquidity.",
            "Use it when inventory, receivables, payables, or cash-control items appear together in one problem set.",
            "Use it when a teacher expects interpretation of control weaknesses, not only the computed metric.",
        ],
        formulaOverview: [
            {
                label: "Working capital",
                expression: "Working capital = Current assets - Current liabilities",
                explanation:
                    "This shows the short-term asset cushion available to support current obligations.",
            },
            {
                label: "Cash conversion cycle",
                expression:
                    "Cash conversion cycle = Receivables days + Inventory days - Payables days",
                explanation:
                    "This estimates how long cash stays tied up in operating activity before it returns through customer collections.",
            },
            {
                label: "Inventory shrinkage amount",
                expression: "Shrinkage amount = (Book units - Physical units) x Cost per unit",
                explanation:
                    "This measures the value of inventory missing from the count relative to the records.",
            },
        ],
        variableDefinitions: [
            { symbol: "CA", meaning: "Current assets available within the operating cycle" },
            { symbol: "CL", meaning: "Current liabilities due within the short-term horizon" },
            { symbol: "Receivables days", meaning: "Average collection period from credit sales" },
            { symbol: "Inventory days", meaning: "Average number of days inventory remains before sale" },
            { symbol: "Payables days", meaning: "Average payment period allowed by suppliers" },
            { symbol: "Book units", meaning: "Units recorded in the inventory records before count adjustment" },
        ],
        procedure: [
            "Identify whether the problem is measuring liquidity position, operating timing, or control weakness.",
            "Separate record-based values from physical or statement-based values before computing any difference.",
            "Build the control measure first, such as shrinkage, receivables timing, payables timing, or working capital.",
            "Interpret whether the result points to collection pressure, inventory inefficiency, supplier dependence, or record inaccuracy.",
            "Connect the result to the next likely schedule, reconciliation, or planning tool when follow-up action is needed.",
        ],
        workedExample: {
            title: "Cash-cycle control example",
            scenario:
                "A company shows receivables days of 42, inventory days of 58, and payables days of 35 while current assets exceed current liabilities by 240,000.",
            steps: [
                "Compute the cash conversion cycle: 42 + 58 - 35 = 65 days.",
                "Interpret the 240,000 working capital together with the 65-day cycle instead of reading them separately.",
                "Recognize that a positive working-capital balance does not automatically mean collections and inventory are moving efficiently.",
            ],
            result: "The business still has 65 days of operating cash tied up even though working capital is positive.",
            interpretation:
                "Liquidity looks acceptable on the statement, but turnover discipline still matters because operating cash remains committed for more than two months.",
        },
        checkpointExample: {
            title: "Inventory-control checkpoint",
            scenario:
                "Book units are 1,200, physical units are 1,160, and cost per unit is 145.",
            steps: [
                "Shrinkage units = 1,200 - 1,160 = 40 units.",
                "Shrinkage amount = 40 x 145 = 5,800.",
                "Interpret whether the issue is only valuation or a control signal that needs follow-up count or handling review.",
            ],
            result: "Inventory records are overstated by 5,800 at cost.",
            interpretation:
                "The amount is not just a valuation change. It is a control warning that book records and physical custody are no longer aligned.",
        },
        interpretation: [
            "Positive working capital should still be tested against turnover quality and cash-cycle timing.",
            "Inventory shrinkage points to control weakness, not only a lower ending-inventory amount.",
            "Long receivables and inventory days usually increase financing pressure unless payables timing offsets them.",
        ],
        commonMistakes: [
            "Assuming strong current assets automatically mean strong cash management.",
            "Treating shrinkage as a bookkeeping correction without asking what caused the loss or miscount.",
            "Reading payables days as purely favorable even when supplier stretching signals pressure elsewhere.",
        ],
        examTraps: [
            "Problems may mix a ratio, a shrinkage amount, and a schedule follow-up in one case.",
            "A control question may hide the important signal in wording like delayed collections, stock loss, or missed discount terms.",
            "Working capital and cash-cycle measures should be interpreted together when both are given.",
        ],
        selfCheck: [
            "Why can positive working capital still hide operating cash pressure?",
            "What does inventory shrinkage usually suggest beyond the valuation adjustment itself?",
            "How does a longer cash conversion cycle change short-term financing pressure?",
        ],
        practiceCues: [
            "Explain why a company can look liquid on paper but still struggle with operating cash timing.",
            "Describe what management should review after detecting inventory shrinkage.",
            "State which follow-up tool you would open after identifying slow collections or a long operating cycle.",
        ],
        keywords: [
            "working capital",
            "cash conversion cycle",
            "inventory control",
            "inventory shrinkage",
            "receivables",
            "payables",
        ],
        scanSignals: [
            "working capital",
            "cash conversion cycle",
            "inventory shrinkage",
            "book units",
            "physical units",
            "receivables",
            "payables",
        ],
        relatedCalculatorPaths: [
            "/accounting/working-capital-planner",
            "/accounting/cash-conversion-cycle",
            "/accounting/inventory-control-workspace",
            "/accounting/receivables-aging-schedule",
            "/business/cash-disbursements-schedule",
            "/business/cash-budget",
        ],
        relatedTopicIds: [
            "bank-reconciliation-review",
            "budgeting-and-planning-review",
            "accounting-foundations-review",
        ],
        quiz: {
            title: "Working Capital Control Check",
            intro:
                "Use this set to test whether you can read liquidity, timing, and control signals together instead of as isolated numbers.",
            questions: [
                {
                    id: "wcc-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which formula best represents the cash conversion cycle?",
                    choices: [
                        "Receivables days + Inventory days - Payables days",
                        "Current assets - Current liabilities",
                        "Sales - Variable costs - Fixed costs",
                        "Cash collections + Cash disbursements - Financing",
                    ],
                    answerIndex: 0,
                    explanation:
                        "The cash conversion cycle combines collection time, inventory holding time, and supplier-payment delay into one operating-timing measure.",
                },
                {
                    id: "wcc-q2",
                    kind: "true-false",
                    prompt:
                        "Inventory shrinkage is only a valuation issue and does not suggest any control concern.",
                    answer: false,
                    explanation:
                        "Shrinkage changes valuation, but it also signals a control issue because records and physical inventory no longer agree.",
                },
                {
                    id: "wcc-q3",
                    kind: "short-answer",
                    prompt:
                        "What does a longer cash conversion cycle usually imply?",
                    acceptedAnswers: [
                        "more cash tied up in operations",
                        "longer operating cash commitment",
                        "greater short term financing pressure",
                    ],
                    placeholder: "Type what it implies",
                    explanation:
                        "A longer cycle usually means cash stays committed to operations longer before collections convert it back into liquid funds.",
                },
            ],
        },
    },
    {
        id: "entrepreneurship-planning-review",
        title: "Entrepreneurship and Unit Economics Review",
        shortTitle: "Entrepreneurship Review",
        category: "Entrepreneurship",
        summary:
            "Study startup cost planning, unit economics, pricing, sales forecasting, owner splits, and cash runway as one entrepreneurial decision set.",
        intro:
            "Startup planning still depends on disciplined contribution logic, pricing assumptions, forecast structure, and cash survival. This lesson connects those ideas into one review path instead of treating entrepreneurship as soft narrative content.",
        whyItMatters: [
            "It helps users explain whether a business idea is financially workable, not only interesting.",
            "It connects startup decisions to contribution, pricing, and runway discipline already used in other calculators.",
            "It makes entrepreneurship tools feel like decision aids instead of disconnected checklists.",
        ],
        classContexts: [
            "Startup cost and feasibility exercises",
            "Unit economics and pricing decision questions",
            "Sales forecasting, owner-split, and runway planning cases",
        ],
        whenToUse: [
            "Use this topic when a business case asks whether a venture can launch, scale, or survive financially.",
            "Use it when contribution and pricing logic must be tied to customer or unit-level interpretation.",
            "Use it when forecast, cash runway, or founder-split decisions need explanation, not just output.",
        ],
        formulaOverview: [
            {
                label: "Unit contribution",
                expression: "Unit contribution = Selling price per unit - Variable cost per unit",
                explanation:
                    "This shows what each sale contributes toward fixed costs, owner return, or growth capacity.",
            },
            {
                label: "Gross margin percentage",
                expression: "Gross margin % = Gross profit / Sales",
                explanation:
                    "This gives a quick view of pricing strength after direct cost coverage.",
            },
            {
                label: "Cash runway",
                expression: "Runway = Available cash / Net monthly burn",
                explanation:
                    "This estimates survival time when current cash must support ongoing operations.",
            },
        ],
        variableDefinitions: [
            { symbol: "SP", meaning: "Selling price per unit or per customer" },
            { symbol: "VC", meaning: "Variable or directly attributable cost per unit" },
            { symbol: "CM", meaning: "Contribution margin available after variable costs" },
            { symbol: "Burn", meaning: "Net cash outflow per month" },
            { symbol: "Runway", meaning: "Estimated months before cash is exhausted" },
        ],
        procedure: [
            "Clarify whether the question is about launch cost, ongoing unit economics, forecast growth, or cash survival.",
            "Compute unit contribution before making pricing or customer-value interpretations.",
            "Check whether the forecast assumptions are realistic and internally consistent with capacity and cash needs.",
            "Review owner-split or toolkit outputs in light of fairness and sustainability, not only arithmetic division.",
            "Interpret the final result as a viability or planning signal, then decide what assumption matters most.",
        ],
        workedExample: {
            title: "Unit-economics viability example",
            scenario:
                "A small venture sells a service package for 1,200 and incurs variable cost of 720 per customer. Fixed monthly costs are 48,000.",
            steps: [
                "Unit contribution = 1,200 - 720 = 480 per customer.",
                "Break-even customer volume = 48,000 / 480 = 100 customers.",
                "Interpret whether current forecasted volume is strong enough to support the business.",
            ],
            result:
                "The venture needs about 100 customers per month to cover fixed costs.",
            interpretation:
                "The key decision is not only whether 100 customers is possible, but whether the forecast, acquisition effort, and available cash make that target realistic.",
        },
        checkpointExample: {
            title: "Forecast realism checkpoint",
            scenario:
                "A startup forecast shows rapid revenue growth, but cash runway is under three months and fixed costs are rising.",
            steps: [
                "Compare the optimistic sales forecast with the short runway.",
                "Check whether pricing and contribution logic support the growth assumption.",
                "Flag the need to verify cash timing and customer acquisition assumptions before trusting the forecast.",
            ],
            result:
                "The forecast may be too optimistic relative to current cash survival limits.",
            interpretation:
                "Planning is not only about projected sales. It is also about whether the business can stay alive long enough to reach those sales.",
        },
        interpretation: [
            "Entrepreneurship outputs are strongest when tied to pricing realism, contribution quality, and cash survival.",
            "A strong sales forecast is weak evidence if unit economics and runway do not support it.",
            "Startup planning should move from feasibility to verification, not from optimism to overconfidence.",
        ],
        commonMistakes: [
            "Treating revenue growth as if it automatically means a strong cash position.",
            "Ignoring customer-level or unit-level variable costs when pricing.",
            "Using startup totals without separating one-time launch cost from recurring operating cost.",
        ],
        examTraps: [
            "Cases often mix launch spending and recurring monthly spending in one paragraph.",
            "Students may focus on sales growth while ignoring whether contribution is actually strong enough.",
            "Owner-split or pricing questions may still require fairness or sustainability interpretation after the numbers.",
        ],
        selfCheck: [
            "Why is unit contribution important before interpreting a startup forecast?",
            "What does runway add that a sales forecast alone does not show?",
            "Why should one-time startup cost be separated from recurring operating cost?",
        ],
        practiceCues: [
            "Explain how unit economics supports startup feasibility.",
            "Describe why a short runway can weaken a strong-looking forecast.",
            "State how pricing, contribution, and burn rate interact in a startup case.",
        ],
        keywords: [
            "startup cost",
            "unit economics",
            "sales forecast",
            "cash runway",
            "pricing",
        ],
        scanSignals: ["startup", "launch cost", "forecast", "runway", "unit economics", "owner split"],
        relatedCalculatorPaths: [
            "/entrepreneurship/startup-cost-planner",
            "/entrepreneurship/unit-economics",
            "/entrepreneurship/sales-forecast-planner",
            "/entrepreneurship/cash-runway-planner",
            "/entrepreneurship/entrepreneurship-toolkit",
            "/business/markup-margin",
            "/business/profit-loss",
            "/business/net-profit-margin",
        ],
        relatedTopicIds: ["budgeting-and-planning-review", "cvp-core", "finance-time-value-review"],
        quiz: {
            title: "Entrepreneurship Review Check",
            intro:
                "Use this set to verify whether you can connect pricing, contribution, and runway into one business reading.",
            questions: [
                {
                    id: "epr-q1",
                    kind: "multiple-choice",
                    prompt:
                        "What should usually be computed before deciding whether pricing can support a startup?",
                    choices: [
                        "Unit contribution",
                        "Consumer surplus",
                        "Inventory turnover",
                        "Bond premium amortization",
                    ],
                    answerIndex: 0,
                    explanation:
                        "Unit contribution is a core starting point because it shows how much each sale leaves after variable cost coverage.",
                },
                {
                    id: "epr-q2",
                    kind: "true-false",
                    prompt: "A fast sales forecast always guarantees a healthy runway.",
                    answer: false,
                    explanation:
                        "Runway depends on cash burn and timing, not just on projected sales growth.",
                },
                {
                    id: "epr-q3",
                    kind: "short-answer",
                    prompt: "Why should startup launch cost be separated from recurring monthly cost?",
                    acceptedAnswers: [
                        "they affect planning differently",
                        "one-time and recurring costs are different",
                        "launch cost is not the same as operating cost",
                    ],
                    placeholder: "Type why they should be separated",
                    explanation:
                        "One-time launch spending and recurring operating costs affect feasibility, pricing, and runway in different ways, so they should not be merged carelessly.",
                },
            ],
        },
    },
    {
        id: "partnership-cycle-review",
        title: "Partnership Capital Cycle Review",
        shortTitle: "Partnership Cycle",
        category: "Partnership Accounting",
        summary:
            "Review profit sharing, salary and interest allowances, admission, retirement, dissolution, and capital rollforward as one partnership workflow.",
        intro:
            "Partnership accounting is easiest to understand when capital balances are treated as a living cycle. Partners share profit, admit or retire members, and eventually liquidate the business through procedures that all affect capital logic in different ways.",
        whyItMatters: [
            "It helps students stop memorizing isolated bonus and goodwill cases without understanding capital continuity.",
            "It connects partnership allocation rules to later admission, retirement, and liquidation procedures.",
            "It makes dissolution easier because the earlier capital logic is already clear.",
        ],
        classContexts: [
            "Profit-sharing and salary-interest allowance exercises",
            "Admission and retirement bonus or goodwill cases",
            "Statement of partners' capital and dissolution review",
        ],
        whenToUse: [
            "Use this topic when a partnership problem changes ownership, capital balances, or sharing rules.",
            "Use it when the case mentions salary allowances, interest on capital, bonus, goodwill, or deficiency handling.",
            "Use it when the instructor expects procedural reasoning instead of only one final capital amount.",
        ],
        formulaOverview: [
            {
                label: "Remainder allocation logic",
                expression:
                    "Net income - Salary allowances - Interest allowances = Remainder to be shared",
                explanation:
                    "The remainder is distributed using the agreed residual ratio after stated allowances are applied.",
            },
            {
                label: "Capital settlement logic",
                expression:
                    "Ending capital = Beginning capital + Investments + Share of income - Drawings +/- Admission or retirement effects",
                explanation:
                    "This summarizes how capital changes across the partnership life cycle before final liquidation.",
            },
        ],
        variableDefinitions: [
            { symbol: "Beg Cap", meaning: "Beginning capital balance of the partner" },
            { symbol: "Allowances", meaning: "Salary or interest amounts used in income sharing" },
            { symbol: "Remainder ratio", meaning: "Residual profit or loss sharing ratio after allowances" },
            { symbol: "Settlement", meaning: "Cash or capital adjustment upon admission, retirement, or liquidation" },
        ],
        procedure: [
            "Identify whether the problem is about income sharing, admission, retirement, capital statement, or dissolution.",
            "Compute income-sharing allowances first when salary and interest provisions exist.",
            "Track capital continuity before and after any bonus, goodwill, settlement, or realization effect.",
            "For dissolution, separate realization gain or loss, liquidation cash, and deficiency handling in the correct order.",
            "Interpret the result as a capital-allocation procedure, not only as a final cash figure.",
        ],
        workedExample: {
            title: "Salary and interest allocation example",
            scenario:
                "Partners A and B divide net income of 180,000 with salary allowances of 30,000 and 20,000, interest allowances of 10,000 and 8,000, and a remainder ratio of 3:2.",
            steps: [
                "Total allowances = 30,000 + 20,000 + 10,000 + 8,000 = 68,000.",
                "Remainder = 180,000 - 68,000 = 112,000.",
                "Share the remainder 3:2, then add each partner's salary and interest allowance to get final income share.",
            ],
            result:
                "The partners first receive stated allowances, then divide the remaining 112,000 using the residual ratio.",
            interpretation:
                "This structure prevents students from distributing the entire income by ratio before honoring the agreement's salary and interest provisions.",
        },
        checkpointExample: {
            title: "Admission versus dissolution checkpoint",
            scenario:
                "A student uses liquidation logic in a partner-admission case because the capital balances are changing.",
            steps: [
                "Admission changes ownership but does not automatically mean realization and liquidation are occurring.",
                "Check whether the business continues after the new partner enters.",
                "Use bonus or goodwill logic only if the case is an admission or retirement scenario, not final liquidation.",
            ],
            result:
                "The original approach is incorrect because the procedure depends on whether the partnership continues or liquidates.",
            interpretation:
                "Capital change alone does not determine the method. The continuity of the partnership matters.",
        },
        interpretation: [
            "Partnership answers are strongest when capital continuity is visible from start to finish.",
            "Allowances affect profit-sharing order, while admission and retirement affect ownership structure and capital settlement.",
            "Dissolution is the final procedural stage, not the default method for every capital change.",
        ],
        commonMistakes: [
            "Splitting total income by ratio before applying salary and interest allowances.",
            "Using dissolution logic in an admission or retirement problem.",
            "Forgetting that capital statements track drawings, investments, and allocated income together.",
        ],
        examTraps: [
            "Partnership problems often hide whether the business continues after a capital change.",
            "Students may confuse partner bonus with goodwill because both change capital balances.",
            "Deficiency and liquidation cases require procedural order, not just a ratio.",
        ],
        selfCheck: [
            "Why should salary and interest allowances be applied before the residual ratio?",
            "What tells you that a problem is dissolution instead of admission?",
            "Why is capital continuity important in partnership accounting?",
        ],
        practiceCues: [
            "Explain the difference between admission and dissolution.",
            "Describe how a capital statement helps check partnership changes across a period.",
            "State why allowance order matters in profit-sharing problems.",
        ],
        keywords: [
            "partnership",
            "salary allowance",
            "interest allowance",
            "admission",
            "retirement",
            "capital statement",
        ],
        scanSignals: [
            "partners capital",
            "bonus method",
            "goodwill method",
            "salary allowance",
            "interest on capital",
            "dissolution",
        ],
        relatedCalculatorPaths: [
            "/accounting/partnership-profit-sharing",
            "/accounting/partnership-salary-interest",
            "/accounting/partnership-admission-bonus",
            "/accounting/partnership-admission-goodwill",
            "/accounting/partnership-retirement-bonus",
            "/accounting/partnership-dissolution",
            "/accounting/partners-capital-statement",
        ],
        relatedTopicIds: ["partnership-dissolution", "accounting-foundations-review", "scan-review"],
        quiz: {
            title: "Partnership Cycle Review Check",
            intro:
                "Use this set to verify whether you can distinguish sharing, capital changes, and final liquidation.",
            questions: [
                {
                    id: "pcr-q1",
                    kind: "multiple-choice",
                    prompt:
                        "What should be applied before the residual profit-sharing ratio in a salary-and-interest agreement?",
                    choices: [
                        "Consumer surplus",
                        "Salary and interest allowances",
                        "Depreciation expense only",
                        "Cash budget financing",
                    ],
                    answerIndex: 1,
                    explanation:
                        "The agreement's salary and interest allowances are applied first, then the remaining profit or loss is shared by ratio.",
                },
                {
                    id: "pcr-q2",
                    kind: "true-false",
                    prompt:
                        "Every partnership capital change should automatically be handled as a dissolution problem.",
                    answer: false,
                    explanation:
                        "Admission and retirement can change capital without liquidating the business. Dissolution is a specific final procedure.",
                },
                {
                    id: "pcr-q3",
                    kind: "short-answer",
                    prompt: "Why is a statement of partners' capital useful?",
                    acceptedAnswers: [
                        "it shows capital changes over the period",
                        "it tracks capital continuity",
                        "it summarizes investments drawings and income shares",
                    ],
                    placeholder: "Type why it is useful",
                    explanation:
                        "The statement helps students and instructors follow how each partner's capital changes across the period.",
                },
            ],
        },
    },
    {
        id: "descriptive-statistics-review",
        title: "Descriptive Statistics and Relative Variation Review",
        shortTitle: "Statistics Review",
        category: "Statistics / Analytics",
        summary:
            "Study mean, weighted mean, standard deviation, and coefficient of variation as one analytics toolkit for business comparisons.",
        intro:
            "Descriptive statistics become more useful when students connect the average, the spread, and the relative size of that spread. This topic keeps those measures together so results are interpreted instead of recited.",
        whyItMatters: [
            "It helps compare datasets that differ in both average level and volatility.",
            "It keeps weighted averages separate from simple averages when observations do not carry equal importance or frequency.",
            "It turns standard deviation into a decision aid instead of a memorized formula.",
        ],
        classContexts: [
            "Business analytics and introductory statistics exercises",
            "Weighted-score and weighted-price review sets",
            "Comparing variation across products, branches, or scenarios",
        ],
        whenToUse: [
            "Use weighted mean when the observations do not all carry the same importance or frequency.",
            "Use standard deviation when the question asks how far values typically spread around the mean.",
            "Use coefficient of variation when two datasets have different means and you need a relative comparison of spread.",
        ],
        formulaOverview: [
            {
                label: "Weighted mean",
                expression: "Weighted mean = Sum of value x weight / Sum of weights",
                explanation:
                    "This average gives larger influence to values with larger assigned weights or frequencies.",
            },
            {
                label: "Standard deviation",
                expression: "Standard deviation = Square root of variance",
                explanation:
                    "This turns average squared spread back into the original unit of measure.",
            },
            {
                label: "Coefficient of variation",
                expression: "Coefficient of variation = (Standard deviation / Mean) x 100",
                explanation:
                    "This compares variation relative to the average level instead of only in raw units.",
            },
        ],
        variableDefinitions: [
            { symbol: "x", meaning: "Observed value in the dataset" },
            { symbol: "w", meaning: "Assigned weight or frequency of a value" },
            { symbol: "x̄", meaning: "Arithmetic mean of the dataset" },
            { symbol: "s or σ", meaning: "Sample or population standard deviation" },
            { symbol: "CV", meaning: "Coefficient of variation" },
        ],
        procedure: [
            "Decide whether the dataset needs a simple average, a weighted average, or both.",
            "Compute the mean first because every spread measure depends on the center of the dataset.",
            "Compute variance and standard deviation when the question asks about spread.",
            "Use coefficient of variation only after confirming the mean is not zero and a relative comparison is needed.",
            "Interpret what the statistic says about consistency, volatility, or comparison quality.",
        ],
        workedExample: {
            title: "Relative-variation comparison example",
            scenario:
                "Branch A has a mean weekly sale of 500 with a standard deviation of 50. Branch B has a mean weekly sale of 200 with a standard deviation of 30. The instructor asks which branch is relatively more variable.",
            steps: [
                "Compute coefficient of variation for Branch A: 50 / 500 x 100 = 10%.",
                "Compute coefficient of variation for Branch B: 30 / 200 x 100 = 15%.",
                "Compare the percentages instead of only the raw standard deviations.",
            ],
            result:
                "Branch B is relatively more variable because 15% exceeds 10%.",
            interpretation:
                "Even though Branch B has a smaller raw standard deviation, its variation is larger relative to its average level.",
        },
        checkpointExample: {
            title: "Weighted-average checkpoint",
            scenario:
                "A student averages exam scores equally even though the exams carry different weights.",
            steps: [
                "Check whether each observation has the same importance.",
                "If weights differ, multiply each score by its weight before summing.",
                "Divide by total weight, not by the number of items alone.",
            ],
            result:
                "The simple average is inappropriate because the observations do not carry equal weight.",
            interpretation:
                "Weighted mean protects the result from being distorted by unequal importance.",
        },
        interpretation: [
            "The mean describes the center, while standard deviation describes spread around that center.",
            "Coefficient of variation is especially useful when comparing variability across different scales.",
            "A weighted mean answers a different question from a simple average.",
        ],
        commonMistakes: [
            "Using a simple average when the values clearly have different weights.",
            "Comparing raw standard deviations across datasets with very different means.",
            "Using coefficient of variation when the mean is zero or near zero.",
        ],
        examTraps: [
            "Weights may be hidden as frequencies, percentages, or contribution shares instead of being labeled directly.",
            "A question may ask for sample dispersion, not population dispersion.",
            "The dataset with the bigger standard deviation is not always the relatively more variable dataset.",
        ],
        selfCheck: [
            "Why is coefficient of variation more informative than standard deviation in some comparisons?",
            "When should weighted mean replace a simple average?",
            "What does standard deviation measure in plain language?",
        ],
        practiceCues: [
            "Explain why relative variation matters for comparing different branches or products.",
            "State the difference between a raw spread measure and a relative spread measure.",
            "Describe how weights change the meaning of an average.",
        ],
        keywords: [
            "statistics",
            "weighted mean",
            "standard deviation",
            "coefficient of variation",
            "relative variability",
        ],
        scanSignals: [
            "weighted average",
            "standard deviation",
            "variance",
            "coefficient of variation",
            "relative variability",
        ],
        relatedCalculatorPaths: [
            "/statistics/standard-deviation",
            "/statistics/coefficient-of-variation",
            "/business-math/weighted-mean",
        ],
        relatedTopicIds: ["pricing-and-weighted-mean-review"],
        quiz: {
            title: "Descriptive Statistics Check",
            intro:
                "Use this short set to confirm whether you can choose the right statistic before touching the calculator.",
            questions: [
                {
                    id: "stats-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which measure is best when two datasets have different means and you want a relative comparison of spread?",
                    choices: [
                        "Weighted mean",
                        "Coefficient of variation",
                        "Median only",
                        "Total frequency",
                    ],
                    answerIndex: 1,
                    explanation:
                        "Coefficient of variation scales the spread to the mean, making relative comparison possible.",
                },
                {
                    id: "stats-q2",
                    kind: "true-false",
                    prompt:
                        "A weighted mean should be used only when the values are already percentages.",
                    answer: false,
                    explanation:
                        "Weighted means are used whenever observations have different importance or frequency, not only when the values are percentages.",
                },
                {
                    id: "stats-q3",
                    kind: "short-answer",
                    prompt:
                        "What does standard deviation describe?",
                    acceptedAnswers: [
                        "how far values spread around the mean",
                        "spread around the mean",
                        "dispersion around the mean",
                    ],
                    placeholder: "Type what it describes",
                    explanation:
                        "Standard deviation describes how far the values typically spread around the mean.",
                },
            ],
        },
    },
    {
        id: "pricing-and-weighted-mean-review",
        title: "Pricing, Margin, and Weighted Mean Review",
        shortTitle: "Pricing Review",
        category: "Business Math / Finance",
        summary:
            "Connect profit and loss, markup, margin, net profit margin, and weighted mean to the pricing decisions students actually face in classwork.",
        intro:
            "Business math topics are easiest to remember when price, cost, margin, and weighted averages are treated as one connected decision set. This topic ties those formulas to the meaning behind pricing and performance results.",
        whyItMatters: [
            "It prevents students from mixing up markup and margin even when the arithmetic is close.",
            "It shows how weighted averages can support sales mix, grade weighting, or price-comparison work.",
            "It links simple profit formulas to more meaningful profitability interpretation.",
        ],
        classContexts: [
            "Pricing and commercial-math exercises",
            "Weighted-score and weighted-price problems",
            "Profitability and net-margin interpretation questions",
        ],
        whenToUse: [
            "Use it when a question asks for selling price, cost, markup, margin, or net profit percentage.",
            "Use weighted mean when several values contribute unequally to one combined result.",
            "Use net profit margin when the question asks how much of net sales remains as final profit.",
        ],
        formulaOverview: [
            {
                label: "Profit",
                expression: "Profit = Revenue - Cost",
                explanation:
                    "This basic relationship supports pricing, margin, and break-even style reasoning.",
            },
            {
                label: "Markup",
                expression: "Markup % = Profit / Cost x 100",
                explanation:
                    "Markup uses cost as the base, which is why it differs from margin.",
            },
            {
                label: "Margin",
                expression: "Margin % = Profit / Selling price x 100",
                explanation:
                    "Margin uses selling price as the base and is therefore not interchangeable with markup.",
            },
        ],
        variableDefinitions: [
            { symbol: "Revenue", meaning: "Selling amount or total sales generated" },
            { symbol: "Cost", meaning: "Amount sacrificed to obtain or produce the item" },
            { symbol: "Profit", meaning: "Excess of revenue over cost" },
            { symbol: "Markup", meaning: "Profit relative to cost" },
            { symbol: "Margin", meaning: "Profit relative to selling price or sales" },
        ],
        procedure: [
            "Decide whether the base is cost, selling price, or net sales before selecting a percentage formula.",
            "Compute profit first whenever markup or margin depends on the same price-cost relationship.",
            "Use weighted mean when multiple prices, scores, or contributions must be combined unequally.",
            "Interpret the result as a pricing or profitability signal, not only as a percentage.",
            "Check whether the question uses gross-profit language or net-profit language before naming the answer.",
        ],
        workedExample: {
            title: "Markup-versus-margin example",
            scenario:
                "An item costs 500 and sells for 800. The instructor asks for profit, markup, and margin.",
            steps: [
                "Profit = 800 - 500 = 300.",
                "Markup = 300 / 500 x 100 = 60%.",
                "Margin = 300 / 800 x 100 = 37.5%.",
            ],
            result:
                "The item earns 300 in profit, a 60% markup, and a 37.5% margin.",
            interpretation:
                "Markup and margin are both correct, but they answer different base questions and must not be reported interchangeably.",
        },
        checkpointExample: {
            title: "Weighted-price checkpoint",
            scenario:
                "Three product groups have different sales shares, and the teacher asks for one combined average price.",
            steps: [
                "Use each group's price and sales share as a weighted-mean pair.",
                "Multiply each price by its weight, then sum the products.",
                "Divide by total weight to avoid over- or underrepresenting a group.",
            ],
            result:
                "The correct answer is a weighted average, not a simple arithmetic average.",
            interpretation:
                "The larger groups should influence the combined price more heavily than the smaller groups.",
        },
        interpretation: [
            "Markup explains how much profit sits on top of cost, while margin explains how much of the selling price remains as profit.",
            "Weighted means are often hidden inside business problems that ask for one combined rate, price, or score.",
            "Net profit margin should be read as a profitability outcome, not as a pricing formula by itself.",
        ],
        commonMistakes: [
            "Using selling price as the base when markup is requested.",
            "Using cost as the base when margin is requested.",
            "Applying a simple average when a weighted average is the correct business reading.",
        ],
        examTraps: [
            "Questions often use the word margin when they actually mean markup, so students must read the base carefully.",
            "Gross profit and net profit are not interchangeable.",
            "Weighted questions may hide the weights as proportions, contribution shares, or category sizes.",
        ],
        selfCheck: [
            "Why are markup and margin different even when the same profit amount is used?",
            "When should weighted mean be used in pricing work?",
            "What does net profit margin tell you about a business result?",
        ],
        practiceCues: [
            "Explain the base difference between markup and margin.",
            "Describe how weighted mean helps in sales-mix or weighted-grade settings.",
            "State what net profit margin says about final profitability.",
        ],
        keywords: [
            "markup",
            "margin",
            "profit and loss",
            "weighted mean",
            "net profit margin",
        ],
        scanSignals: [
            "markup",
            "margin",
            "weighted average",
            "profit and loss",
            "net profit margin",
        ],
        relatedCalculatorPaths: [
            "/business/profit-loss",
            "/business/markup-margin",
            "/business/net-profit-margin",
            "/business-math/weighted-mean",
        ],
        relatedTopicIds: ["descriptive-statistics-review", "startup-cost-planning"],
        quiz: {
            title: "Pricing and Margin Check",
            intro:
                "Use this set to verify whether you can identify the right base before relying on the calculator.",
            questions: [
                {
                    id: "pricing-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which base is used when markup percentage is requested?",
                    choices: ["Cost", "Selling price", "Net sales", "Net income"],
                    answerIndex: 0,
                    explanation:
                        "Markup uses cost as the denominator, while margin uses selling price or sales as the denominator.",
                },
                {
                    id: "pricing-q2",
                    kind: "true-false",
                    prompt:
                        "A weighted mean is appropriate only when every observation has the same importance.",
                    answer: false,
                    explanation:
                        "A weighted mean is used precisely because the observations do not all carry equal importance.",
                },
                {
                    id: "pricing-q3",
                    kind: "short-answer",
                    prompt: "Why is margin not the same as markup?",
                    acceptedAnswers: [
                        "they use different bases",
                        "markup uses cost and margin uses selling price",
                        "they have different denominators",
                    ],
                    placeholder: "Type the reason",
                    explanation:
                        "Markup uses cost as the base, while margin uses selling price or sales as the base.",
                },
            ],
        },
    },
    {
        id: "annuity-and-loan-review",
        title: "Annuities, Loans, and Periodic-Payment Review",
        shortTitle: "Annuities & Loans",
        category: "Business Math / Finance",
        summary:
            "Review loan amortization, present and future value of annuities, sinking funds, and effective-rate logic as one payment-planning family.",
        intro:
            "Many finance problems change only one thing: whether the regular cash flow is being accumulated, discounted, repaid, or compared across compounding methods. This topic keeps those ideas in one place.",
        whyItMatters: [
            "It helps students distinguish lump-sum time-value work from periodic-payment work.",
            "It reduces confusion between loan repayment and investment accumulation formulas.",
            "It keeps rate basis and period basis consistent across annuity problems.",
        ],
        classContexts: [
            "Loan amortization and installment-payment exercises",
            "Present-value and future-value annuity problems",
            "Sinking-fund and effective-rate comparisons",
        ],
        whenToUse: [
            "Use it when cash flows repeat each month, quarter, or year instead of occurring only once.",
            "Use it when the question asks for payment amount, present worth, accumulation amount, or required deposit.",
            "Check that the interest rate and the number of periods use the same time basis before solving.",
        ],
        formulaOverview: [
            {
                label: "Future value of an ordinary annuity",
                expression: "FV of annuity = Payment x [((1 + i)^n - 1) / i]",
                explanation:
                    "Use this when equal deposits accumulate forward in time.",
            },
            {
                label: "Present value of an ordinary annuity",
                expression: "PV of annuity = Payment x [1 - (1 + i)^(-n)] / i",
                explanation:
                    "Use this when equal future payments are discounted back to today.",
            },
            {
                label: "Effective annual rate",
                expression: "EAR = (1 + nominal rate / m)^m - 1",
                explanation:
                    "Use this to compare compounding structures on one annual basis.",
            },
        ],
        variableDefinitions: [
            { symbol: "Payment", meaning: "Equal cash flow each period" },
            { symbol: "i", meaning: "Periodic interest rate" },
            { symbol: "n", meaning: "Number of periods" },
            { symbol: "EAR", meaning: "Effective annual rate" },
        ],
        procedure: [
            "Identify whether the problem is a loan repayment, an annuity accumulation, or an annuity discounting problem.",
            "Convert the nominal rate into a periodic rate when compounding is more frequent than annually.",
            "Match the number of periods to the payment frequency.",
            "Apply the appropriate ordinary-annuity or amortization relationship.",
            "Interpret the result as a payment-planning decision, not just a formula output.",
        ],
        workedExample: {
            title: "Loan-versus-sinking-fund example",
            scenario:
                "A student wants to understand why a sinking-fund deposit and a loan payment are not the same even when the amount and rate are similar.",
            steps: [
                "A loan payment must cover both interest and principal reduction on an existing balance.",
                "A sinking-fund deposit grows forward toward a future target instead of paying down a present obligation.",
                "Because the cash-flow direction differs, the formulas and interpretations also differ.",
            ],
            result:
                "Loan payments and sinking-fund deposits solve different finance questions even when the inputs look similar.",
            interpretation:
                "Students should identify the direction of the cash-flow problem before choosing a formula.",
        },
        checkpointExample: {
            title: "Rate-basis checkpoint",
            scenario:
                "A nominal annual rate is paired with monthly payments, but the student uses the annual rate directly in the annuity formula.",
            steps: [
                "Check whether the payment frequency matches the rate basis.",
                "Convert the nominal annual rate into a monthly periodic rate before using monthly periods.",
                "Recompute using the aligned rate and period basis.",
            ],
            result:
                "The original answer is incorrect because the rate basis and period basis were inconsistent.",
            interpretation:
                "Rate-basis errors are among the most common reasons otherwise-correct annuity work fails.",
        },
        interpretation: [
            "Annuity problems are strongest when payment timing and rate timing are aligned first.",
            "Loan amortization explains repayment structure, while annuity formulas explain value equivalence across time.",
            "Effective rate exists to make compounding comparisons fair and readable.",
        ],
        commonMistakes: [
            "Using an annual rate directly with monthly periods.",
            "Using a loan formula for a sinking-fund problem or vice versa.",
            "Treating present value and future value annuities as the same direction of cash-flow problem.",
        ],
        examTraps: [
            "The problem may mention ordinary annuity implicitly without naming it directly.",
            "Compounding frequency can be hidden in wording such as monthly installment or quarterly deposit.",
            "A question may ask for the rate comparison rather than the payment amount.",
        ],
        selfCheck: [
            "Why must rate basis and period basis match in annuity problems?",
            "What is the difference between a loan payment and a sinking-fund deposit?",
            "Why is effective annual rate useful?",
        ],
        practiceCues: [
            "Explain the difference between discounting an annuity and accumulating an annuity.",
            "State why the nominal rate usually needs conversion before use.",
            "Describe what an amortization schedule is trying to show.",
        ],
        keywords: [
            "annuity",
            "loan amortization",
            "sinking fund",
            "effective annual rate",
            "payment planning",
        ],
        scanSignals: [
            "installment",
            "monthly payment",
            "annuity",
            "sinking fund",
            "effective annual rate",
        ],
        relatedCalculatorPaths: [
            "/finance/loan-amortization",
            "/finance/future-value-annuity",
            "/finance/present-value-annuity",
            "/finance/sinking-fund-deposit",
            "/finance/effective-interest-rate",
        ],
        relatedTopicIds: ["finance-time-value-review", "capital-budgeting"],
        quiz: {
            title: "Annuities and Loans Check",
            intro:
                "Use this set to verify whether you can choose the correct periodic-payment model before solving.",
            questions: [
                {
                    id: "annuity-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which issue should be checked first in a monthly annuity problem?",
                    choices: [
                        "Whether the rate basis matches the payment period",
                        "Whether the dataset is weighted",
                        "Whether the balance sheet balances",
                        "Whether profit margin is above markup",
                    ],
                    answerIndex: 0,
                    explanation:
                        "Monthly payments require a monthly-period rate basis before the formula can be used correctly.",
                },
                {
                    id: "annuity-q2",
                    kind: "true-false",
                    prompt:
                        "A sinking-fund deposit and a loan payment solve the same cash-flow direction problem.",
                    answer: false,
                    explanation:
                        "A sinking fund accumulates toward a future target, while a loan payment repays a present obligation.",
                },
                {
                    id: "annuity-q3",
                    kind: "short-answer",
                    prompt: "Why is effective annual rate useful?",
                    acceptedAnswers: [
                        "it compares compounding fairly",
                        "it puts different compounding methods on one annual basis",
                        "it shows the true annual rate",
                    ],
                    placeholder: "Type why it is useful",
                    explanation:
                        "Effective annual rate converts compounding structures into one comparable annual reading.",
                },
            ],
        },
    },
    {
        id: "cash-planning-and-runway-review",
        title: "Cash Planning, Runway, and Forecast Review",
        shortTitle: "Cash Planning",
        category: "Entrepreneurship",
        summary:
            "Study startup cost planning, sales forecasting, unit economics, and cash runway as one early-stage planning sequence.",
        intro:
            "Entrepreneurship tools are most useful when startup cost, sales forecast, unit economics, and cash runway are read as one planning chain. This topic keeps those ideas connected so feasibility stays disciplined.",
        whyItMatters: [
            "It shows that early growth plans fail when cash timing is ignored.",
            "It helps students connect pricing, contribution, and runway instead of reading each result in isolation.",
            "It turns entrepreneurship tools into planning logic rather than guesswork.",
        ],
        classContexts: [
            "Startup feasibility and launch-planning exercises",
            "Sales forecast and runway review",
            "Small-business planning and pitch-style assignments",
        ],
        whenToUse: [
            "Use startup-cost planning when launch spending must be structured before operations begin.",
            "Use sales forecasting and unit economics when the question asks whether the model can scale sensibly.",
            "Use cash runway when the key concern is how long current cash can support planned operations.",
        ],
        formulaOverview: [
            {
                label: "Monthly net cash flow",
                expression: "Monthly net cash flow = Average inflows - Average outflows",
                explanation:
                    "This is the operating cash movement that drives runway interpretation.",
            },
            {
                label: "Cash runway",
                expression: "Runway (months) = Opening cash / Monthly burn",
                explanation:
                    "Use this only when monthly burn is positive and recurring.",
            },
            {
                label: "Unit contribution",
                expression: "Unit contribution = Selling price - Variable cost per unit",
                explanation:
                    "This links startup pricing to whether growth adds cash or only activity.",
            },
        ],
        variableDefinitions: [
            { symbol: "Opening cash", meaning: "Available cash at the start of the planning horizon" },
            { symbol: "Burn", meaning: "Net cash outflow per month" },
            { symbol: "Forecast sales", meaning: "Projected sales based on a planning assumption" },
            { symbol: "Unit contribution", meaning: "Contribution available from each sale before fixed costs" },
        ],
        procedure: [
            "Separate one-time startup spending from recurring operating cash flow.",
            "Build a sales forecast that is grounded in an explicit growth assumption.",
            "Check whether unit economics remain positive before assuming scale solves the problem.",
            "Estimate runway using recurring inflows, recurring outflows, and current cash.",
            "Interpret whether the plan is feasible, fragile, or undercapitalized.",
        ],
        workedExample: {
            title: "Runway interpretation example",
            scenario:
                "A startup has 600,000 in opening cash, expected monthly inflows of 120,000, and monthly outflows of 180,000.",
            steps: [
                "Monthly burn = 180,000 - 120,000 = 60,000.",
                "Runway = 600,000 / 60,000 = 10 months.",
                "Interpret whether that runway is comfortable given launch risk and forecast uncertainty.",
            ],
            result:
                "The plan has 10 months of runway under the current assumptions.",
            interpretation:
                "The number is only useful if the inflow and outflow assumptions are realistic and updated as new information arrives.",
        },
        checkpointExample: {
            title: "Forecast caution checkpoint",
            scenario:
                "A student projects aggressive sales growth without checking whether unit economics remain positive.",
            steps: [
                "Review unit contribution before assuming higher sales fix the problem.",
                "If each unit contributes weakly or negatively, more volume can worsen cash stress.",
                "Pair the forecast with runway and contribution checks before accepting the plan.",
            ],
            result:
                "The plan is incomplete because growth alone does not guarantee sustainability.",
            interpretation:
                "Forecasts must be tested against contribution and cash logic, not only optimism.",
        },
        interpretation: [
            "Cash runway is a timing measure, not a profitability measure by itself.",
            "Good unit economics can still fail under poor cash timing.",
            "A sales forecast is useful only when it stays tied to defensible assumptions.",
        ],
        commonMistakes: [
            "Combining startup costs and recurring monthly costs as if they were the same planning variable.",
            "Treating forecast growth as proof of feasibility without checking cash burn.",
            "Ignoring unit contribution when interpreting runway or funding need.",
        ],
        examTraps: [
            "Problems may bury one-time launch costs inside recurring expenses.",
            "Runway can look long only because inflows are unrealistically assumed.",
            "Students may confuse contribution with net profit after all fixed costs.",
        ],
        selfCheck: [
            "Why should startup costs be separated from monthly operating costs?",
            "Why is runway not the same as profitability?",
            "How do unit economics support or weaken a forecast?",
        ],
        practiceCues: [
            "Explain why cash timing matters even when profit looks positive.",
            "State what a strong runway interpretation should still verify.",
            "Describe how forecast quality affects planning quality.",
        ],
        keywords: [
            "cash runway",
            "startup planning",
            "sales forecast",
            "unit economics",
            "cash planning",
        ],
        scanSignals: [
            "runway",
            "burn rate",
            "sales forecast",
            "startup cost",
            "monthly cash flow",
        ],
        relatedCalculatorPaths: [
            "/entrepreneurship/startup-cost-planner",
            "/entrepreneurship/sales-forecast-planner",
            "/entrepreneurship/unit-economics",
            "/entrepreneurship/cash-runway-planner",
            "/entrepreneurship/entrepreneurship-toolkit",
        ],
        relatedTopicIds: ["startup-cost-planning", "cvp-core"],
        quiz: {
            title: "Cash Planning and Runway Check",
            intro:
                "Use this set to confirm whether you can read runway and forecast outputs as planning signals instead of isolated numbers.",
            questions: [
                {
                    id: "runway-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which value is most directly used to compute runway months?",
                    choices: [
                        "Monthly burn",
                        "Markup percentage",
                        "Debt ratio",
                        "Price elasticity",
                    ],
                    answerIndex: 0,
                    explanation:
                        "Runway depends on opening cash and the monthly burn or net outflow assumption.",
                },
                {
                    id: "runway-q2",
                    kind: "true-false",
                    prompt:
                        "A long runway always means the business model is profitable.",
                    answer: false,
                    explanation:
                        "Runway measures time supported by cash assumptions. Profitability and cash timing are related but not identical.",
                },
                {
                    id: "runway-q3",
                    kind: "short-answer",
                    prompt: "Why should forecast growth be checked against unit economics?",
                    acceptedAnswers: [
                        "growth can fail if unit economics are weak",
                        "more sales do not help if contribution is weak",
                        "volume alone does not guarantee sustainability",
                    ],
                    placeholder: "Type the reason",
                    explanation:
                        "Growth should be tested against contribution and cash logic because more volume does not automatically improve viability.",
                },
            ],
        },
    },
    {
        id: "operating-capacity-and-planning-review",
        title: "Operating Capacity and Planning Review",
        shortTitle: "Capacity Planning",
        category: "Managerial & Cost Accounting",
        summary:
            "Review capacity utilization, idle capacity, flexible budgets, and cash-planning follow-up as one operations-sensitive planning path.",
        intro:
            "Managers do not only ask whether output happened. They ask whether the operation used capacity wisely, whether cost behavior adjusted properly, and whether the plan should be revised. This topic ties those decisions together.",
        whyItMatters: [
            "It connects operating volume with planning interpretation instead of treating utilization as a raw percentage only.",
            "It helps explain why idle capacity and activity variance are related but not identical ideas.",
            "It links operations-sensitive readings to the next budgeting step a student should review.",
        ],
        classContexts: [
            "Capacity utilization and production planning review",
            "Flexible-budget interpretation questions",
            "Operations and managerial-accounting control discussions",
        ],
        whenToUse: [
            "Use capacity utilization when actual output must be compared with practical capacity.",
            "Use flexible budgets when the problem asks whether cost differences came from activity level or spending behavior.",
            "Move to cash planning when capacity decisions influence near-term financing or operating cash needs.",
        ],
        formulaOverview: [
            {
                label: "Capacity utilization",
                expression: "Capacity utilization = Actual output / Practical capacity",
                explanation:
                    "This shows how much of realistic available capacity the operation used.",
            },
            {
                label: "Idle capacity",
                expression: "Idle capacity = Practical capacity - Actual output",
                explanation:
                    "This shows the portion of available capacity that stayed unused.",
            },
            {
                label: "Flexible budget",
                expression: "Flexible budget = Fixed costs + (Actual units x Variable cost per unit)",
                explanation:
                    "This updates the cost expectation to the actual activity level before spending is judged.",
            },
        ],
        variableDefinitions: [
            { symbol: "Actual output", meaning: "Units actually produced or serviced during the period" },
            { symbol: "Practical capacity", meaning: "Realistic available capacity after allowing for normal downtime" },
            { symbol: "Idle capacity", meaning: "Unused portion of practical capacity" },
            { symbol: "Flexible budget", meaning: "Cost expectation adjusted to actual activity level" },
        ],
        procedure: [
            "Measure actual output against practical capacity first.",
            "Read whether the operation is lightly used, moderately used, or near strain.",
            "If cost interpretation is required, rebuild the budget to the actual activity level.",
            "Separate activity effects from spending effects before calling a variance favorable or unfavorable.",
            "Suggest the next planning action, such as schedule adjustment, cost review, or cash planning.",
        ],
        workedExample: {
            title: "Utilization and budget example",
            scenario:
                "Actual output is 8,400 units against practical capacity of 10,000 units. The teacher then asks whether a flexible-budget review is the right next step.",
            steps: [
                "Capacity utilization = 8,400 / 10,000 = 84%.",
                "Idle capacity = 10,000 - 8,400 = 1,600 units.",
                "Because output differs from available capacity, a flexible budget can help explain whether cost behavior matched the activity level.",
            ],
            result:
                "The operation used 84% of practical capacity and still has 1,600 units of idle capacity.",
            interpretation:
                "The next useful question is not only how much capacity is unused, but whether costs behaved appropriately at that activity level.",
        },
        checkpointExample: {
            title: "Idle-capacity checkpoint",
            scenario:
                "A student treats unused capacity as automatically unfavorable performance in every context.",
            steps: [
                "Check demand conditions and strategic reserve capacity before judging the result.",
                "Some idle capacity can be planned or temporary instead of wasteful.",
                "Pair utilization with budget and demand interpretation before making a conclusion.",
            ],
            result:
                "Idle capacity is a signal that requires context, not an automatic verdict.",
            interpretation:
                "A utilization result becomes meaningful only after demand, cost, and planning context are considered together.",
        },
        interpretation: [
            "Capacity utilization is a planning signal, not a standalone performance grade.",
            "Idle capacity and flexible-budget variance answer different questions and should not be merged casually.",
            "Operations review becomes stronger when the next budgeting or cash-planning step is explicit.",
        ],
        commonMistakes: [
            "Treating practical capacity like a guaranteed target instead of an available operating ceiling.",
            "Calling idle capacity automatically bad without context.",
            "Using static-budget interpretation when the question requires flexible-budget logic.",
        ],
        examTraps: [
            "Problems may hide practical capacity under wording such as available operating hours or service capacity.",
            "Students may compare actual cost directly with static budget without adjusting to actual activity.",
            "A utilization percentage alone may look strong while the operation still faces bottlenecks or poor scheduling.",
        ],
        selfCheck: [
            "Why does capacity utilization not automatically tell you whether the operation performed well?",
            "When should flexible budgeting follow a utilization result?",
            "What is the difference between idle capacity and spending variance?",
        ],
        practiceCues: [
            "Explain why practical capacity is a better comparison base than ideal capacity in many classroom settings.",
            "Describe the next budgeting question after reading utilization.",
            "State why unused capacity can still require context before judgment.",
        ],
        keywords: [
            "capacity utilization",
            "idle capacity",
            "flexible budget",
            "activity variance",
            "planning review",
        ],
        scanSignals: [
            "practical capacity",
            "idle capacity",
            "capacity utilization",
            "activity variance",
            "flexible budget",
        ],
        relatedCalculatorPaths: [
            "/business/capacity-utilization",
            "/business/flexible-budget",
            "/business/cash-budget",
            "/business/cash-collections-schedule",
            "/business/cash-disbursements-schedule",
        ],
        relatedTopicIds: ["budgeting-and-planning-review", "working-capital-and-control-review"],
        quiz: {
            title: "Operating Capacity Check",
            intro:
                "Use this set to verify whether you can interpret utilization as part of a planning process instead of reading it in isolation.",
            questions: [
                {
                    id: "capacity-q1",
                    kind: "multiple-choice",
                    prompt:
                        "What does idle capacity represent?",
                    choices: [
                        "The portion of available capacity not used during the period",
                        "Only the number of defective units",
                        "Profit divided by sales",
                        "The total fixed cost budget",
                    ],
                    answerIndex: 0,
                    explanation:
                        "Idle capacity is the available practical capacity that stayed unused during the period.",
                },
                {
                    id: "capacity-q2",
                    kind: "true-false",
                    prompt:
                        "A high utilization rate always means the operation is in the best possible condition.",
                    answer: false,
                    explanation:
                        "Very high utilization can also signal strain, bottlenecks, or weak operational slack.",
                },
                {
                    id: "capacity-q3",
                    kind: "short-answer",
                    prompt: "Why can a flexible budget be the right next step after a utilization reading?",
                    acceptedAnswers: [
                        "it adjusts cost expectations to actual activity",
                        "it separates activity and spending effects",
                        "it helps explain cost behavior at the actual volume",
                    ],
                    placeholder: "Type the reason",
                    explanation:
                        "Flexible budgets update the cost expectation to actual activity so cost interpretation becomes fairer.",
                },
            ],
        },
    },
];

const STUDY_TOPICS: StudyTopic[] = [
    ...CORE_STUDY_TOPICS,
    ...STUDY_HUB_EXPANSION_TOPICS,
    ...STUDY_HUB_CURRICULUM_TOPICS,
];

export const STUDY_TOPICS_BY_ID = new Map(STUDY_TOPICS.map((topic) => [topic.id, topic]));

function normalizeSearchValue(value: string) {
    return value.trim().toLowerCase();
}

function normalizeAnswer(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ");
}

export function getAllStudyTopics() {
    return STUDY_TOPICS;
}

export function getStudyTopic(topicId?: string | null) {
    if (!topicId) return null;
    return STUDY_TOPICS_BY_ID.get(topicId) ?? null;
}

export function getStudyTopicByPath(pathname: string) {
    const normalized = pathname.replace(/\/+$/, "");
    return (
        STUDY_TOPICS.find((entry) => buildStudyTopicPath(entry.id) === normalized) ?? null
    );
}

export function getStudyQuizTopicByPath(pathname: string) {
    const normalized = pathname.replace(/\/+$/, "");
    return (
        STUDY_TOPICS.find((entry) => buildStudyQuizPath(entry.id) === normalized) ?? null
    );
}

export function getStudyTopicsForRoute(routePath: string) {
    return STUDY_TOPICS.filter((topic) => topic.relatedCalculatorPaths.includes(routePath));
}

export function getRelatedStudyTopics(topicId: string) {
    const topic = getStudyTopic(topicId);
    if (!topic) return [];
    return topic.relatedTopicIds
        .map((id) => getStudyTopic(id))
        .filter((entry): entry is StudyTopic => Boolean(entry));
}

export function searchStudyTopics(query: string) {
    const normalized = normalizeSearchValue(query);
    if (!normalized) return STUDY_TOPICS;

    return STUDY_TOPICS.map((topic) => {
        const haystacks = [
            topic.title,
            topic.shortTitle,
            topic.category,
            topic.summary,
            topic.intro,
            ...topic.keywords,
            ...topic.scanSignals,
        ].map((value) => value.toLowerCase());

        let score = 0;

        haystacks.forEach((value) => {
            if (value === normalized) {
                score += 18;
            } else if (value.includes(normalized)) {
                score += 8;
            }
        });

        if (topic.title.toLowerCase().startsWith(normalized)) {
            score += 10;
        }

        return { topic, score };
    })
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score || left.topic.title.localeCompare(right.topic.title))
        .map((entry) => entry.topic);
}

export function recommendStudyTopicsFromText(text: string, routeHint?: string | null) {
    const normalized = normalizeSearchValue(text);
    if (!normalized && !routeHint) return [];

    return STUDY_TOPICS.map((topic) => {
        let score = 0;

        if (routeHint && topic.relatedCalculatorPaths.includes(routeHint)) {
            score += 28;
        }

        topic.keywords.forEach((keyword) => {
            if (normalized.includes(keyword.toLowerCase())) {
                score += 7;
            }
        });

        topic.scanSignals.forEach((signal) => {
            if (normalized.includes(signal.toLowerCase())) {
                score += 5;
            }
        });

        if (normalized.includes(topic.shortTitle.toLowerCase())) {
            score += 10;
        }

        if (normalized.includes(topic.title.toLowerCase())) {
            score += 12;
        }

        const confidence =
            score >= 34 ? "high" : score >= 20 ? "moderate" : score >= 10 ? "low" : null;

        if (!confidence) return null;

        return {
            id: topic.id,
            title: topic.title,
            shortTitle: topic.shortTitle,
            path: buildStudyTopicPath(topic.id),
            quizPath: buildStudyQuizPath(topic.id),
            category: topic.category,
            reason:
                routeHint && topic.relatedCalculatorPaths.includes(routeHint)
                    ? "This lesson matches the suggested tool and the language detected from the problem."
                    : "This lesson matches topic words and classroom signals found in the problem text.",
            score,
            confidence,
        } satisfies StudyTopicRecommendation;
    })
        .filter((entry): entry is StudyTopicRecommendation => Boolean(entry))
        .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
        .slice(0, 3);
}

export function isStudyTopicAnswerCorrect(
    question: StudyQuizQuestion,
    answer: string | number | boolean
) {
    if (question.kind === "multiple-choice") {
        return typeof answer === "number" && Number.isFinite(answer)
            ? answer === question.answerIndex
            : false;
    }

    if (question.kind === "true-false") {
        return typeof answer === "boolean" ? answer === question.answer : false;
    }

    const normalizedAnswer = normalizeAnswer(String(answer));
    if (!normalizedAnswer) return false;
    return question.acceptedAnswers.some(
        (accepted) => normalizeAnswer(accepted) === normalizedAnswer
    );
}
