export const STUDY_CATEGORY_DETAILS = {
    "Financial Accounting": {
        description: "Core accounting topics that support statement preparation, account analysis, and answer checking.",
        emphasis: "Concept accuracy and procedural order",
    },
    "Managerial & Cost Accounting": {
        description: "Cost-flow, production, budgeting, and internal decision topics where structure matters as much as arithmetic.",
        emphasis: "Schedules, assumptions, and managerial interpretation",
    },
    "Partnership Accounting": {
        description: "Admission, retirement, sharing, and dissolution topics that students often solve step by step in class.",
        emphasis: "Capital logic and liquidation procedure",
    },
    "CVP / Decision Support": {
        description: "Contribution margin, break-even, target profit, and planning topics used in managerial decision making.",
        emphasis: "What changes the answer and why",
    },
    "Business Math / Finance": {
        description: "Time value, project evaluation, and quantitative business topics used for decisions and long-form problems.",
        emphasis: "Rate basis, time basis, and decision reading",
    },
    Economics: {
        description: "Price-response and market-relationship topics used in microeconomics problem solving.",
        emphasis: "Interpretation, direction, and model assumptions",
    },
    Entrepreneurship: {
        description: "Planning topics that connect classroom logic to startup and small-business decisions.",
        emphasis: "Practical feasibility and disciplined assumptions",
    },
    "Smart Tools / Scan Support": {
        description: "Study support for OCR review, prompt routing, and checking uncertain extracted values.",
        emphasis: "Verification before trusting automation",
    },
};
export function buildStudyTopicPath(topicId) {
    return `/study/topics/${topicId}`;
}
export function buildStudyQuizPath(topicId) {
    return `/study/quiz/${topicId}`;
}
const STUDY_TOPICS = [
    {
        id: "cvp-core",
        title: "CVP Core Logic",
        shortTitle: "CVP Core",
        category: "CVP / Decision Support",
        summary: "Study contribution margin, break-even, target profit, margin of safety, and operating leverage as one connected planning model.",
        intro: "CVP analysis connects cost behavior, sales volume, and operating profit. Students use it to answer break-even, target-profit, and sensitivity questions without treating each formula as an isolated trick.",
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
                explanation: "This is the amount each unit contributes first toward fixed costs and then toward profit.",
            },
            {
                label: "Break-even units",
                expression: "Break-even units = Fixed costs / CM per unit",
                explanation: "This is the unit volume where operating income is zero.",
            },
            {
                label: "Target-profit units",
                expression: "Target units = (Fixed costs + Target profit) / CM per unit",
                explanation: "This extends break-even logic by adding the desired operating profit.",
            },
            {
                label: "Margin of safety",
                expression: "Margin of safety = Actual or expected sales - Break-even sales",
                explanation: "This measures how far sales can fall before the business reaches zero operating income.",
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
            scenario: "A product sells for 120 per unit, variable cost is 70 per unit, and fixed costs are 150,000. The instructor asks for break-even units and target units for a 60,000 profit.",
            steps: [
                "Compute contribution margin per unit: 120 - 70 = 50.",
                "Break-even units = 150,000 / 50 = 3,000 units.",
                "Target units = (150,000 + 60,000) / 50 = 4,200 units.",
                "Interpret the answers as planning thresholds, not just arithmetic outputs.",
            ],
            result: "The business breaks even at 3,000 units and needs 4,200 units to earn a 60,000 target operating profit.",
            interpretation: "The key managerial message is that each unit adds only 50 toward fixed-cost recovery and profit, so pricing or variable-cost changes can materially shift the required volume.",
        },
        checkpointExample: {
            title: "Quick review check",
            scenario: "Expected sales are 3,400 units under the same data. Decide whether the plan is above break-even.",
            steps: [
                "Break-even volume is already known as 3,000 units.",
                "Expected units exceed break-even by 400 units.",
                "That excess represents a positive margin of safety in unit terms.",
            ],
            result: "The plan is above break-even by 400 units.",
            interpretation: "That does not mean the plan is automatically strong; it means there is some buffer before operating income falls to zero.",
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
            intro: "This short quiz checks whether you can identify the right CVP logic before relying on a calculator.",
            questions: [
                {
                    id: "cvp-q1",
                    kind: "multiple-choice",
                    prompt: "Which value must be positive before break-even units can be computed meaningfully?",
                    choices: [
                        "Fixed costs",
                        "Contribution margin per unit",
                        "Target profit",
                        "Margin of safety",
                    ],
                    answerIndex: 1,
                    explanation: "Break-even units divide fixed costs by contribution margin per unit, so the contribution margin per unit must be positive.",
                },
                {
                    id: "cvp-q2",
                    kind: "true-false",
                    prompt: "Break-even means contribution margin has started covering profit instead of fixed costs.",
                    answer: false,
                    explanation: "At break-even, contribution margin has covered fixed costs exactly. Profit starts only beyond that point.",
                },
                {
                    id: "cvp-q3",
                    kind: "short-answer",
                    prompt: "What common input mistake happens when a student uses total variable cost instead of variable cost per unit?",
                    acceptedAnswers: [
                        "wrong unit basis",
                        "used total variable cost instead of per unit cost",
                        "mixed total and per unit cost",
                    ],
                    placeholder: "Type a short diagnosis",
                    explanation: "CVP formulas often require per-unit data. Using totals usually inflates or distorts the break-even answer.",
                },
            ],
        },
    },
    {
        id: "partnership-dissolution",
        title: "Partnership Dissolution",
        shortTitle: "Dissolution",
        category: "Partnership Accounting",
        summary: "Study realization, liability settlement, capital adjustment, and deficiency handling in the order a textbook liquidation problem expects.",
        intro: "Partnership dissolution problems are procedural. Students must not only compute a gain or loss on realization, but also follow the liquidation order carefully before distributing remaining cash to partners.",
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
                explanation: "This compares what the assets realized in cash against their carrying amount before liquidation.",
            },
            {
                label: "Adjusted capital",
                expression: "Adjusted capital = Beginning capital +/- Share of realization gain or loss",
                explanation: "Partner capitals must reflect the realization result before final cash settlement is determined.",
            },
            {
                label: "Cash available to partners",
                expression: "Cash available to partners = Realized cash - Outside liabilities settled",
                explanation: "Outside liabilities are paid before the partners receive liquidation cash.",
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
            scenario: "Noncash assets with a 420,000 book value are realized for 390,000. Liabilities of 120,000 must be paid, and the partners share profits and losses 3:2:1.",
            steps: [
                "Realization loss = 390,000 - 420,000 = 30,000 loss.",
                "Allocate the 30,000 loss to partner capitals using the 3:2:1 ratio.",
                "Pay the 120,000 outside liabilities from realized cash.",
                "Use the remaining cash only after capitals are adjusted.",
            ],
            result: "The partnership first recognizes a realization loss, then settles liabilities, and only then determines final partner distributions.",
            interpretation: "The most important idea is sequence. A correct arithmetic answer with the wrong liquidation order is still a weak dissolution solution.",
        },
        checkpointExample: {
            title: "Deficiency check",
            scenario: "One partner's adjusted capital becomes negative after allocating the realization loss. The problem does not say the partner is insolvent.",
            steps: [
                "Identify the negative adjusted capital as a deficiency.",
                "Do not automatically absorb it by other partners.",
                "State that the deficient partner is normally expected to contribute unless insolvency is given.",
            ],
            result: "The deficiency must not be absorbed automatically.",
            interpretation: "Classroom partnership problems are highly assumption-sensitive. Missing the insolvency condition changes the final cash distribution logic.",
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
            intro: "Use this quiz to confirm that you remember the liquidation order and deficiency logic, not just one formula.",
            questions: [
                {
                    id: "pd-q1",
                    kind: "multiple-choice",
                    prompt: "Which item must be handled before any partner receives final cash in liquidation?",
                    choices: [
                        "Common stock",
                        "Outside liabilities",
                        "Profit forecast",
                        "Sales mix",
                    ],
                    answerIndex: 1,
                    explanation: "Outside liabilities are settled before partner distributions in a normal liquidation order.",
                },
                {
                    id: "pd-q2",
                    kind: "true-false",
                    prompt: "A partner's deficiency should always be absorbed by the remaining partners.",
                    answer: false,
                    explanation: "Absorption depends on the problem facts. If insolvency is not given, the deficient partner is usually expected to contribute.",
                },
                {
                    id: "pd-q3",
                    kind: "short-answer",
                    prompt: "What is the usual mistake if a student jumps from realized cash directly to final partner distributions?",
                    acceptedAnswers: [
                        "skipped liability settlement",
                        "skipped allocation step",
                        "wrong procedure order",
                    ],
                    placeholder: "Type the likely mistake",
                    explanation: "The student likely skipped a required stage such as liability settlement or realization allocation before final distribution.",
                },
            ],
        },
    },
    {
        id: "process-costing",
        title: "Process Costing Foundations",
        shortTitle: "Process Costing",
        category: "Managerial & Cost Accounting",
        summary: "Study equivalent units, cost per equivalent unit, transferred-out cost, ending WIP, and reconciliation as one production-costing flow.",
        intro: "Process costing is a schedule-based topic. Students need to connect unit flow, equivalent units, cost assignment, and reconciliation instead of treating each table as separate memorization.",
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
                explanation: "Equivalent units convert partially completed work into whole-unit terms for cost assignment.",
            },
            {
                label: "Cost per equivalent unit",
                expression: "Cost per EU = Costs to account for / Equivalent units",
                explanation: "The exact numerator and denominator depend on the process-costing method and cost category.",
            },
            {
                label: "Transferred-out cost",
                expression: "Transferred-out cost = Units completed and transferred x Cost per EU",
                explanation: "Completed output receives full cost per equivalent unit in the relevant categories.",
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
            scenario: "A department completed 8,000 units and left 2,000 units in ending WIP that were 50% complete for conversion. Materials are 100% added at the start.",
            steps: [
                "Materials equivalent units = 8,000 + 2,000 = 10,000.",
                "Conversion equivalent units = 8,000 + 1,000 = 9,000.",
                "Use the method-specific costs to compute cost per equivalent unit.",
                "Assign full cost to completed units and partial cost to ending WIP.",
            ],
            result: "Equivalent units differ by cost category because completion percentages differ.",
            interpretation: "The point is not only to compute EU correctly, but to explain why ending WIP contributes differently to materials and conversion.",
        },
        checkpointExample: {
            title: "Transferred-in check",
            scenario: "A later department receives units from Department 1. The worksheet includes transferred-in cost plus current materials and conversion.",
            steps: [
                "Recognize that transferred-in cost behaves like a separate cost category.",
                "Keep current department additions separate from prior department cost.",
                "Check whether the page is Department 1 or a later department before applying the schedule.",
            ],
            result: "Later-department worksheets require transferred-in logic, not a simple Department 1 template.",
            interpretation: "Many OCR and student errors happen because transferred-in cost is treated like ordinary materials or ignored completely.",
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
        relatedTopicIds: ["cvp-core", "scan-review"],
        quiz: {
            title: "Process Costing Quick Check",
            intro: "This short set checks whether you can diagnose the structure of a process-costing problem before doing the arithmetic.",
            questions: [
                {
                    id: "pc-q1",
                    kind: "multiple-choice",
                    prompt: "What is the best description of equivalent units?",
                    choices: [
                        "Units sold during the period",
                        "Whole-unit measure of partially completed work",
                        "Total materials cost",
                        "Budgeted units for the next period",
                    ],
                    answerIndex: 1,
                    explanation: "Equivalent units convert partially completed work into whole-unit terms for cost assignment.",
                },
                {
                    id: "pc-q2",
                    kind: "true-false",
                    prompt: "A later-department process-costing worksheet may require transferred-in cost as a separate category.",
                    answer: true,
                    explanation: "Transferred-in cost is a distinct cost flow in later departments and should not be ignored.",
                },
                {
                    id: "pc-q3",
                    kind: "short-answer",
                    prompt: "If a student uses physical units instead of equivalent units in cost per EU, what type of mistake is that?",
                    acceptedAnswers: [
                        "wrong denominator",
                        "used physical units instead of equivalent units",
                        "wrong unit basis",
                    ],
                    placeholder: "Type a short diagnosis",
                    explanation: "The denominator must reflect equivalent units, not just physical counts, when calculating cost per equivalent unit.",
                },
            ],
        },
    },
    {
        id: "price-elasticity-demand",
        title: "Price Elasticity of Demand",
        shortTitle: "Elasticity",
        category: "Economics",
        summary: "Study midpoint elasticity, sign interpretation, revenue movement, and common denominator mistakes in one focused review page.",
        intro: "Price elasticity of demand measures how responsive quantity demanded is to price changes. The topic is simple to state but easy to miscompute if students reverse denominators or misread the sign.",
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
                expression: "Elasticity = (% change in quantity demanded) / (% change in price)",
                explanation: "The midpoint method uses average quantity and average price in the percentage-change calculations.",
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
            scenario: "Price falls from 120 to 100 and quantity demanded rises from 240 to 300.",
            steps: [
                "Change in quantity = 60; average quantity = 270.",
                "Quantity percentage change = 60 / 270.",
                "Change in price = -20; average price = 110.",
                "Price percentage change = -20 / 110.",
                "Elasticity is the ratio of those midpoint percentages.",
            ],
            result: "The elasticity magnitude is above 1, so demand is elastic.",
            interpretation: "Because demand is elastic, total revenue tends to move opposite the price change in this range.",
        },
        checkpointExample: {
            title: "Sign interpretation check",
            scenario: "A student reports elasticity as negative and concludes demand is 'bad' because the sign is negative.",
            steps: [
                "Recall that ordinary demand slopes downward, so the raw elasticity sign is usually negative.",
                "Use the magnitude for classification in basic classroom problems.",
                "Explain meaning instead of treating the negative sign as an error by itself.",
            ],
            result: "The sign is expected for demand. The magnitude is what classifies elasticity in most introductory problems.",
            interpretation: "A sign can carry direction, but classification still depends on responsiveness magnitude.",
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
            intro: "This short quiz checks whether you can diagnose the formula structure and interpret the result.",
            questions: [
                {
                    id: "el-q1",
                    kind: "multiple-choice",
                    prompt: "Which denominator mistake is common in elasticity work?",
                    choices: [
                        "Using fixed cost instead of price",
                        "Using total assets instead of equity",
                        "Reversing the percentage-change basis",
                        "Using market supply instead of market demand in every case",
                    ],
                    answerIndex: 2,
                    explanation: "A common classroom error is reversing the percentage-change basis or the ratio itself.",
                },
                {
                    id: "el-q2",
                    kind: "true-false",
                    prompt: "For a standard downward-sloping demand curve, a negative raw elasticity sign is usually expected.",
                    answer: true,
                    explanation: "Demand usually moves opposite price, so the raw sign is negative even though magnitude is often used for classification.",
                },
                {
                    id: "el-q3",
                    kind: "short-answer",
                    prompt: "If elasticity magnitude is above 1, what classification should the student report?",
                    acceptedAnswers: ["elastic", "elastic demand"],
                    placeholder: "Type the classification",
                    explanation: "An elasticity magnitude greater than 1 means demand is elastic in that range.",
                },
            ],
        },
    },
    {
        id: "market-equilibrium",
        title: "Market Equilibrium",
        shortTitle: "Equilibrium",
        category: "Economics",
        summary: "Study how demand and supply intersect, what shortages and surpluses mean, and how to interpret equilibrium values instead of only solving equations.",
        intro: "Market equilibrium is the price-quantity pair where planned quantity demanded equals planned quantity supplied. Students often solve the intersection correctly but skip the economic meaning of that result.",
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
                explanation: "Set the two relations equal after converting them into a consistent algebraic form.",
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
            scenario: "Demand is P = 120 - 2Q and supply is P = 20 + Q.",
            steps: [
                "Set the equations equal because equilibrium requires the same price in both relations.",
                "120 - 2Q = 20 + Q.",
                "Solve to get 100 = 3Q, so Qe = 33.33.",
                "Substitute back to find equilibrium price.",
            ],
            result: "The equilibrium quantity is about 33.33 units and the equilibrium price is about 53.33.",
            interpretation: "That point is the market-clearing combination. At other prices, quantity demanded and supplied would not balance.",
        },
        checkpointExample: {
            title: "Shortage check",
            scenario: "The actual market price is set below equilibrium.",
            steps: [
                "At a below-equilibrium price, quantity demanded rises relative to quantity supplied.",
                "That imbalance is a shortage.",
                "The shortage creates upward pressure on price in a basic competitive model.",
            ],
            result: "A below-equilibrium price produces shortage, not surplus.",
            interpretation: "Students often memorize the word but forget the logic: a low price encourages buying and discourages supplying.",
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
            intro: "Use this quiz to verify your understanding of the equation setup and the meaning of shortage or surplus.",
            questions: [
                {
                    id: "eq-q1",
                    kind: "multiple-choice",
                    prompt: "At a price below equilibrium, the market condition is usually:",
                    choices: ["Surplus", "Shortage", "Zero demand", "Perfect competition"],
                    answerIndex: 1,
                    explanation: "A below-equilibrium price makes quantity demanded exceed quantity supplied, creating shortage.",
                },
                {
                    id: "eq-q2",
                    kind: "true-false",
                    prompt: "Solving equilibrium means setting quantity demanded equal to quantity supplied in a consistent form.",
                    answer: true,
                    explanation: "That is the core solving condition in a basic market-equilibrium model.",
                },
                {
                    id: "eq-q3",
                    kind: "short-answer",
                    prompt: "What is the likely issue if a student solves only for quantity and never substitutes back into the equation?",
                    acceptedAnswers: [
                        "missing equilibrium price",
                        "incomplete answer",
                        "did not solve both equilibrium values",
                    ],
                    placeholder: "Type a short diagnosis",
                    explanation: "Many equilibrium problems need both price and quantity, so solving only one variable leaves the answer incomplete.",
                },
            ],
        },
    },
    {
        id: "capital-budgeting",
        title: "Capital Budgeting Basics",
        shortTitle: "Capital Budgeting",
        category: "Business Math / Finance",
        summary: "Study NPV, IRR, profitability index, and discounted payback as decision tools rather than isolated calculator buttons.",
        intro: "Capital budgeting decisions compare long-term cash-flow benefits against an initial investment. Students need more than formulas; they need to understand what each metric says and what it leaves out.",
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
                explanation: "A positive NPV suggests the project adds value at the required discount rate.",
            },
            {
                label: "Profitability index",
                expression: "PI = Present value of inflows / Initial investment",
                explanation: "This measures discounted inflows per unit of investment.",
            },
            {
                label: "Discounted payback",
                expression: "Discounted payback = Time needed to recover the investment using discounted cash flows",
                explanation: "This incorporates the time value of money but still focuses on recovery rather than total value created.",
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
            scenario: "A project needs a 250,000 investment and returns annual cash inflows of 70,000, 80,000, 90,000, and 85,000, with salvage value at the end.",
            steps: [
                "Discount each annual inflow and salvage value at the required rate.",
                "Add the present values of those inflows.",
                "Subtract the initial investment to get NPV.",
                "Use the sign and magnitude of NPV for the main value decision.",
            ],
            result: "If NPV is positive, the project earns above the required return under the model assumptions.",
            interpretation: "The decision logic is not 'positive means perfect.' It means the project clears the hurdle rate in present-value terms.",
        },
        checkpointExample: {
            title: "Metric comparison check",
            scenario: "Two projects have similar payback periods, but one has a clearly higher NPV.",
            steps: [
                "Notice that payback emphasizes recovery speed.",
                "NPV measures value creation after discounting.",
                "Use the stronger NPV reading when the course emphasizes wealth maximization.",
            ],
            result: "Matching payback does not guarantee matching value creation.",
            interpretation: "Students should not treat a faster payback as automatically superior if discounted value tells a different story.",
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
            intro: "This short review checks whether you can identify what the major project metrics actually say.",
            questions: [
                {
                    id: "cb-q1",
                    kind: "multiple-choice",
                    prompt: "Which metric most directly measures value created above the required return?",
                    choices: [
                        "Simple payback",
                        "Net present value",
                        "Accounting equation",
                        "Contribution margin ratio",
                    ],
                    answerIndex: 1,
                    explanation: "NPV directly measures discounted value created relative to the hurdle rate.",
                },
                {
                    id: "cb-q2",
                    kind: "true-false",
                    prompt: "Discounted payback includes the time value of money.",
                    answer: true,
                    explanation: "Discounted payback uses discounted cash flows rather than nominal recovery only.",
                },
                {
                    id: "cb-q3",
                    kind: "short-answer",
                    prompt: "What likely mistake occurs if a student uses a yearly discount rate on monthly cash flows without conversion?",
                    acceptedAnswers: [
                        "mixed period basis",
                        "wrong rate basis",
                        "mixed monthly and yearly basis",
                    ],
                    placeholder: "Type the likely issue",
                    explanation: "Discounting requires a consistent time basis, so annual and monthly data must be aligned first.",
                },
            ],
        },
    },
    {
        id: "startup-cost-planning",
        title: "Startup Cost Planning",
        shortTitle: "Startup Costs",
        category: "Entrepreneurship",
        summary: "Study launch cost grouping, contingency, opening cash needs, and how startup planning connects to feasibility decisions.",
        intro: "Startup cost planning turns scattered business-launch expenses into a structured opening budget. It is both a business-planning topic and a discipline check against underestimating cash needs.",
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
                explanation: "This includes the direct cost of getting the venture ready to open.",
            },
            {
                label: "Recommended funding need",
                expression: "Recommended funding = Startup subtotal + Contingency + Opening cash reserve",
                explanation: "A better funding estimate includes both uncertainty protection and early operating liquidity.",
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
            scenario: "A small venture needs permits, equipment, opening inventory, signage, and a contingency allowance before opening.",
            steps: [
                "Group the costs into clear launch categories.",
                "Compute the startup subtotal from identified one-time items.",
                "Add contingency and opening cash reserve to estimate safer funding.",
                "Use the final amount as a planning figure, not as a guarantee of success.",
            ],
            result: "The recommended funding need should be broader than the raw equipment-and-inventory list.",
            interpretation: "A startup that plans only for visible purchases may still fail due to underestimated setup friction or early cash strain.",
        },
        checkpointExample: {
            title: "Contingency check",
            scenario: "A student omits contingency because every visible cost already has an estimate.",
            steps: [
                "Recognize that estimates can still be incomplete or optimistic.",
                "Explain that contingency is a planning safeguard, not a random markup.",
                "Use the omission as a sign of weak feasibility discipline.",
            ],
            result: "Leaving out contingency usually makes the plan look safer than it really is.",
            interpretation: "Entrepreneurship topics often punish overconfidence more than algebra mistakes.",
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
            intro: "Use this short set to confirm whether your startup budget logic is disciplined, not just numerically tidy.",
            questions: [
                {
                    id: "su-q1",
                    kind: "multiple-choice",
                    prompt: "Which item most clearly belongs in a safer funding estimate rather than only the startup subtotal?",
                    choices: [
                        "Contingency allowance",
                        "Completed units transferred out",
                        "Elasticity magnitude",
                        "Partner capital ratio",
                    ],
                    answerIndex: 0,
                    explanation: "A safer funding estimate usually includes contingency, not only the visible startup purchases.",
                },
                {
                    id: "su-q2",
                    kind: "true-false",
                    prompt: "Recurring monthly costs should always be treated exactly the same way as one-time launch costs.",
                    answer: false,
                    explanation: "One-time setup costs and recurring operating costs serve different planning purposes and should be separated.",
                },
                {
                    id: "su-q3",
                    kind: "short-answer",
                    prompt: "What likely issue appears when a student ignores contingency in a startup plan?",
                    acceptedAnswers: [
                        "underestimation risk",
                        "budget too optimistic",
                        "ignored contingency",
                    ],
                    placeholder: "Type the planning issue",
                    explanation: "Ignoring contingency usually makes the plan too optimistic and underestimates actual funding need.",
                },
            ],
        },
    },
    {
        id: "scan-review",
        title: "Scan Review and Verification",
        shortTitle: "Scan Review",
        category: "Smart Tools / Scan Support",
        summary: "Study how to verify OCR output, review risky values first, and choose whether the scan should go to a calculator, Smart Solver, or a lesson page.",
        intro: "Scan workflows are useful only when the app is honest about uncertainty. This topic teaches students how to review OCR output, verify sensitive numbers, and use scan results as a study aid instead of blind automation.",
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
                explanation: "The scan workflow is procedural. The goal is to reduce risk before committing to a solving path.",
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
            scenario: "A dark worksheet image is detected as a process-costing page, but several numeric values are flagged because commas and decimal points are uncertain.",
            steps: [
                "Confirm the topic first: equivalent units, ending WIP, and transferred-in cost all support the route.",
                "Review the flagged numbers directly against the image.",
                "Only after that, open the process-costing workspace or lesson page.",
            ],
            result: "The scan becomes useful because review happens before solving, not after an incorrect total is accepted.",
            interpretation: "Good scan use is not fast guessing. It is efficient verification plus correct routing.",
        },
        checkpointExample: {
            title: "Mixed-topic check",
            scenario: "A page contains both a worked solution and a formula summary, so the scan suggests Smart Solver instead of one narrow tool.",
            steps: [
                "Recognize that the topic is mixed or incomplete.",
                "Use Smart Solver or a topic lesson as the safer next step.",
                "Avoid forcing a specialized route from incomplete evidence.",
            ],
            result: "A broad route can be more correct than a fake high-confidence calculator match.",
            interpretation: "Route confidence should guide the next step honestly, not cosmetically.",
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
            intro: "This short set checks whether you know how to review OCR output before trusting it.",
            questions: [
                {
                    id: "sr-q1",
                    kind: "multiple-choice",
                    prompt: "What should be reviewed first when OCR confidence is low?",
                    choices: [
                        "Only the page background color",
                        "Flagged values and high-risk operators",
                        "The donation prompt",
                        "Only the final paragraph",
                    ],
                    answerIndex: 1,
                    explanation: "High-risk values and operators are the most likely sources of meaningful OCR corruption.",
                },
                {
                    id: "sr-q2",
                    kind: "true-false",
                    prompt: "A mixed-topic scan should always force one specialized calculator route.",
                    answer: false,
                    explanation: "If the page is mixed or incomplete, Smart Solver or a lesson page can be the safer next step.",
                },
                {
                    id: "sr-q3",
                    kind: "short-answer",
                    prompt: "What is the likely issue if a user trusts cleaned OCR text without checking flagged numbers?",
                    acceptedAnswers: [
                        "unverified values",
                        "numeric corruption risk",
                        "trusted uncertain numbers",
                    ],
                    placeholder: "Type the likely issue",
                    explanation: "The user may be relying on cleaned output that still contains risky numeric uncertainty.",
                },
            ],
        },
    },
];
export const STUDY_TOPICS_BY_ID = new Map(STUDY_TOPICS.map((topic) => [topic.id, topic]));
function normalizeSearchValue(value) {
    return value.trim().toLowerCase();
}
function normalizeAnswer(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ");
}
export function getAllStudyTopics() {
    return STUDY_TOPICS;
}
export function getStudyTopic(topicId) {
    if (!topicId)
        return null;
    return STUDY_TOPICS_BY_ID.get(topicId) ?? null;
}
export function getStudyTopicByPath(pathname) {
    const normalized = pathname.replace(/\/+$/, "");
    return (STUDY_TOPICS.find((entry) => buildStudyTopicPath(entry.id) === normalized) ?? null);
}
export function getStudyQuizTopicByPath(pathname) {
    const normalized = pathname.replace(/\/+$/, "");
    return (STUDY_TOPICS.find((entry) => buildStudyQuizPath(entry.id) === normalized) ?? null);
}
export function getStudyTopicsForRoute(routePath) {
    return STUDY_TOPICS.filter((topic) => topic.relatedCalculatorPaths.includes(routePath));
}
export function getRelatedStudyTopics(topicId) {
    const topic = getStudyTopic(topicId);
    if (!topic)
        return [];
    return topic.relatedTopicIds
        .map((id) => getStudyTopic(id))
        .filter((entry) => Boolean(entry));
}
export function searchStudyTopics(query) {
    const normalized = normalizeSearchValue(query);
    if (!normalized)
        return STUDY_TOPICS;
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
            }
            else if (value.includes(normalized)) {
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
export function recommendStudyTopicsFromText(text, routeHint) {
    const normalized = normalizeSearchValue(text);
    if (!normalized && !routeHint)
        return [];
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
        const confidence = score >= 34 ? "high" : score >= 20 ? "moderate" : score >= 10 ? "low" : null;
        if (!confidence)
            return null;
        return {
            id: topic.id,
            title: topic.title,
            shortTitle: topic.shortTitle,
            path: buildStudyTopicPath(topic.id),
            quizPath: buildStudyQuizPath(topic.id),
            category: topic.category,
            reason: routeHint && topic.relatedCalculatorPaths.includes(routeHint)
                ? "This lesson matches the suggested tool and the language detected from the problem."
                : "This lesson matches topic words and classroom signals found in the problem text.",
            score,
            confidence,
        };
    })
        .filter((entry) => Boolean(entry))
        .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
        .slice(0, 3);
}
export function isStudyTopicAnswerCorrect(question, answer) {
    if (question.kind === "multiple-choice") {
        return typeof answer === "number" && Number.isFinite(answer)
            ? answer === question.answerIndex
            : false;
    }
    if (question.kind === "true-false") {
        return typeof answer === "boolean" ? answer === question.answer : false;
    }
    const normalizedAnswer = normalizeAnswer(String(answer));
    if (!normalizedAnswer)
        return false;
    return question.acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === normalizedAnswer);
}
