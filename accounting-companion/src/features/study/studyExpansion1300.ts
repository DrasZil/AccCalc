import type {
    StudyDeepDiveSection,
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
    workedScenario: string;
    workedResult: string;
    checkpointScenario: string;
    checkpointResult: string;
    keywords: string[];
    scanSignals: string[];
    relatedCalculatorPaths: string[];
    relatedTopicIds: string[];
    quizQuestion: StudyQuizQuestion;
    deepDiveSections?: StudyDeepDiveSection[];
};

function makeTopic(seed: TopicSeed): StudyTopic {
    return {
        id: seed.id,
        title: seed.title,
        shortTitle: seed.shortTitle,
        category: seed.category,
        summary: seed.summary,
        intro: seed.intro,
        whyItMatters: [
            `It gives students a clear way to handle ${seed.focus} before solving.`,
            "It connects book-inspired academic coverage to AccCalc's learn, practice, solve, and review loop.",
            "It reduces wrong-route mistakes in mixed CPA-review style prompts.",
        ],
        classContexts: [
            `${seed.shortTitle} lesson review`,
            "CPA-review style mixed practice",
            "Calculator-linked assignment checking",
        ],
        whenToUse: [
            `Use this when the case centers on ${seed.focus}.`,
            "Use it before opening a calculator if classification, measurement, or procedure choice is uncertain.",
            "Use it after a quiz miss to identify the missing framework step.",
        ],
        formulaOverview: [
            {
                label: "Academic loop",
                expression: "Learn the issue -> practice the classification -> solve the schedule -> review the consequence",
                explanation:
                    "Version 13.0.0 topics are written to connect reviewer content, quizzes, and calculator routes instead of standing alone.",
            },
        ],
        variableDefinitions: [
            { symbol: "Issue", meaning: "The controlling accounting, tax, audit, or cost-management question" },
            { symbol: "Route", meaning: "The AccCalc lesson, quiz, calculator, or reviewer page that best supports the next step" },
        ],
        procedure: [
            "Name the controlling issue in one sentence.",
            "Separate classification or recognition logic from arithmetic.",
            "Open the linked calculator or reviewer workspace only after the issue is clear.",
            "Use the quiz explanation to repair the most likely misunderstanding.",
        ],
        workedExample: {
            title: `${seed.shortTitle} worked example`,
            scenario: seed.workedScenario,
            steps: [
                "Identify the controlling issue.",
                "Choose the matching AccCalc route.",
                "Solve or classify using the stated assumptions.",
                "Explain the consequence in classroom language.",
            ],
            result: seed.workedResult,
            interpretation:
                "The learning value comes from the connection between classification, computation, and the follow-up route.",
        },
        checkpointExample: {
            title: `${seed.shortTitle} checkpoint`,
            scenario: seed.checkpointScenario,
            steps: [
                "Stop before accepting the first familiar keyword.",
                "Check the missing recognition, measurement, evidence, tax, or strategy step.",
                "Route to the tighter lesson or calculator.",
            ],
            result: seed.checkpointResult,
            interpretation:
                "A checkpoint prevents a small classification error from turning into a full wrong solution.",
        },
        interpretation: [
            `Strong answers for ${seed.shortTitle.toLowerCase()} explain why the route fits before showing a result.`,
            "The calculator supports the academic reasoning; it does not replace it.",
            "A good review answer names assumptions and warns when law, standards, or facts could change the conclusion.",
        ],
        commonMistakes: [
            "Using a formula before identifying the governing issue.",
            "Treating cash movement as the same thing as recognition or taxable income.",
            "Ignoring disclosure, evidence, or control consequences after the computation.",
        ],
        examTraps: [
            "A familiar number may be a distractor if classification is wrong.",
            "Some topics are better solved by a reviewer workspace than by a pure formula.",
            "A mixed case may need two routes: one to classify and one to compute.",
        ],
        selfCheck: [
            "What issue controls the first step?",
            "Which linked AccCalc route should I open next?",
            "What warning or assumption should I state with the answer?",
        ],
        practiceCues: [
            "Write a one-line route reason before calculating.",
            "Answer the linked quiz after using the calculator.",
            "Review the related lesson if the result feels mechanically correct but conceptually unclear.",
        ],
        deepDiveSections:
            seed.deepDiveSections ??
            [
                {
                    id: `${seed.id}-bridge`,
                    title: "Bridge to solving",
                    summary:
                        "Use this reviewer section to keep the conceptual step connected to the calculator step.",
                    points: [
                        `Start with ${seed.focus}.`,
                        "Identify the fact that would change the answer most.",
                        "Use the related route list as the next study path after the quiz.",
                    ],
                },
            ],
        nextStepPrompts: [
            "Open the related calculator and solve a small version of the scenario.",
            "Take the topic quiz and read every explanation, including wrong-answer explanations.",
            "Return to the lesson if the route choice still feels uncertain.",
        ],
        keywords: seed.keywords,
        scanSignals: seed.scanSignals,
        relatedCalculatorPaths: seed.relatedCalculatorPaths,
        relatedTopicIds: seed.relatedTopicIds,
        quiz: {
            title: `${seed.shortTitle} practice set`,
            intro:
                "A compact CPA-review style check linked to the lesson and the recommended AccCalc solving route.",
            questions: [
                seed.quizQuestion,
                {
                    id: `${seed.id}-tf-route`,
                    kind: "true-false",
                    prompt:
                        "The best AccCalc route is the one that matches the controlling issue, not simply the first route with similar keywords.",
                    answer: true,
                    explanation:
                        "Version 13.0.0 uses linked lessons and calculators to train route discipline in mixed cases.",
                },
                {
                    id: `${seed.id}-short-route`,
                    kind: "short-answer",
                    prompt: "Before solving, what should you name in one sentence?",
                    acceptedAnswers: ["controlling issue", "primary issue", "main issue", "issue"],
                    explanation:
                        "Naming the controlling issue prevents the rest of the solution from drifting into the wrong calculator or reviewer path.",
                    placeholder: "Controlling issue",
                },
            ],
        },
    };
}

export const STUDY_HUB_EXPANSION_1300_TOPICS: StudyTopic[] = [
    makeTopic({
        id: "conceptual-framework-recognition-measurement-and-disclosure",
        title: "Conceptual Framework: Recognition, Measurement, and Disclosure",
        shortTitle: "Framework Recognition",
        category: "Financial Accounting",
        summary:
            "Review element classification, recognition support, measurement-basis selection, and disclosure judgment before FAR computation.",
        intro:
            "Conceptual framework questions often control the route for intermediate accounting. This module makes students decide whether the item is an asset, liability, income, expense, or disclosure issue before measuring it.",
        focus: "element classification, recognition support, and measurement basis",
        workedScenario:
            "A case asks whether a signed supply arrangement creates an asset, liability, expense, or disclosure-only matter before any amount is computed.",
        workedResult:
            "Use the Conceptual Framework Recognition Helper first, then route to the matching FAR measurement workspace only if recognition is supportable.",
        checkpointScenario:
            "A student records an asset because management expects future benefit, but the entity does not control the resource yet.",
        checkpointResult:
            "Control and past-event discipline should be checked before recognition.",
        keywords: ["conceptual framework", "recognition", "measurement basis", "asset", "liability", "disclosure"],
        scanSignals: ["conceptual framework", "recognition criteria", "measurement basis", "present obligation"],
        relatedCalculatorPaths: ["/far/conceptual-framework-recognition", "/far/revenue-allocation-workspace", "/far/financial-asset-amortized-cost"],
        relatedTopicIds: ["far-borrowing-costs-impairment-disposal-and-provisions"],
        quizQuestion: {
            id: "framework-recognition-mc",
            kind: "multiple-choice",
            prompt: "Which check should usually happen before measuring a possible asset?",
            choices: [
                "Whether the entity controls a present economic resource from a past event",
                "Whether cash was paid during the period",
                "Whether management wants to report higher total assets",
                "Whether the item sounds useful to future operations",
            ],
            answerIndex: 0,
            explanation:
                "Asset recognition starts with control of a present economic resource from a past event, then moves to measurement support.",
        },
    }),
    makeTopic({
        id: "far-revenue-allocation-and-contract-balances",
        title: "FAR Revenue Allocation and Contract Balances",
        shortTitle: "Revenue Allocation",
        category: "Financial Accounting",
        summary:
            "Practice transaction-price allocation, performance-obligation satisfaction, and contract asset or liability interpretation.",
        intro:
            "Revenue questions become safer when students separate performance obligations, allocate using relative standalone selling prices, then compare recognized revenue with consideration received.",
        focus: "performance-obligation allocation and contract balance reading",
        workedScenario:
            "A bundled contract includes equipment and service support with separate standalone selling prices and different satisfaction progress.",
        workedResult:
            "Use the Revenue Allocation Workspace to allocate the transaction price, recognize revenue by satisfaction percentage, and identify a contract asset or liability.",
        checkpointScenario:
            "A student recognizes all cash received as revenue even though one service obligation is only partly satisfied.",
        checkpointResult:
            "Cash collection and revenue recognition must be separated.",
        keywords: ["revenue recognition", "performance obligation", "transaction price", "contract liability"],
        scanSignals: ["standalone selling price", "performance obligation", "contract asset", "contract liability"],
        relatedCalculatorPaths: ["/far/revenue-allocation-workspace", "/afar/franchise-revenue-workspace", "/afar/construction-revenue-workspace"],
        relatedTopicIds: ["afar-foreign-currency-and-special-revenue-topics"],
        quizQuestion: {
            id: "revenue-allocation-mc",
            kind: "multiple-choice",
            prompt: "A customer pays before a service obligation is fully satisfied. What should the student check?",
            choices: [
                "Whether the unsatisfied portion creates a contract liability",
                "Whether all cash received is automatically revenue",
                "Whether the standalone selling prices can be ignored",
                "Whether the contract should be treated as inventory",
            ],
            answerIndex: 0,
            explanation:
                "Advance consideration often creates a contract liability for the unsatisfied performance obligation.",
        },
    }),
    makeTopic({
        id: "income-taxation-taxable-income-bridge",
        title: "Income Taxation: Taxable Income Bridge",
        shortTitle: "Taxable Income",
        category: "Taxation",
        summary:
            "Bridge accounting income to taxable income using permanent differences, temporary differences, loss deductions, current tax, and deferred-tax signals.",
        intro:
            "Income taxation problems require careful labeling. The bridge prevents students from mixing financial-reporting income, taxable income, and deferred-tax effects.",
        focus: "accounting income to taxable income reconciliation",
        workedScenario:
            "Accounting income includes nondeductible expense, nontaxable income, accelerated tax depreciation, and a deductible accrued expense reversing later.",
        workedResult:
            "Use the Taxable Income Bridge to separate permanent and temporary items before reading current tax and deferred-tax signals.",
        checkpointScenario:
            "A student treats every difference as temporary and creates deferred tax for a permanent nondeductible expense.",
        checkpointResult:
            "Permanent differences affect taxable income but do not reverse.",
        keywords: ["income taxation", "taxable income", "permanent difference", "temporary difference", "deferred tax"],
        scanSignals: ["taxable income", "permanent difference", "temporary difference", "current tax", "deferred tax"],
        relatedCalculatorPaths: ["/tax/taxable-income-bridge", "/tax/book-tax-difference-workspace", "/tax/tax-compliance-review"],
        relatedTopicIds: ["tax-vat-book-tax-and-compliance-review"],
        quizQuestion: {
            id: "taxable-income-mc",
            kind: "multiple-choice",
            prompt: "Which item should not normally create deferred tax?",
            choices: [
                "A permanent nondeductible expense",
                "A taxable temporary difference",
                "A deductible temporary difference",
                "A timing difference that reverses next year",
            ],
            answerIndex: 0,
            explanation:
                "Permanent differences affect taxable income for the current computation but do not reverse in future periods.",
        },
    }),
    makeTopic({
        id: "strategic-cost-management-target-costing-and-kaizen",
        title: "Strategic Cost Management: Target Costing and Kaizen Review",
        shortTitle: "Target Costing",
        category: "Strategic / Integrative",
        summary:
            "Connect market-driven price, required profit, allowable cost, cost gap, and follow-up cost-reduction actions.",
        intro:
            "Strategic cost management is not just cost-plus pricing. Target costing begins with the market and asks whether the product can be designed into an allowable cost.",
        focus: "target profit, allowable cost, and strategic cost gap",
        workedScenario:
            "A proposed product has a market price, required margin, expected volume, estimated design cost, and planned supplier savings.",
        workedResult:
            "Use the Target Costing Workspace to compute allowable cost and decide whether further design, process, or supplier work is needed.",
        checkpointScenario:
            "A student adds a markup to estimated cost even though the case gives a market ceiling price.",
        checkpointResult:
            "Target costing works backward from market price and target profit, not forward from current cost.",
        keywords: ["target costing", "strategic cost management", "allowable cost", "kaizen", "cost gap"],
        scanSignals: ["target cost", "allowable cost", "target profit", "cost gap", "kaizen"],
        relatedCalculatorPaths: ["/strategic/target-costing-workspace", "/operations/cost-plus-pricing", "/strategic/business-case-analysis"],
        relatedTopicIds: ["strategic-cost-management-and-balanced-scorecard"],
        quizQuestion: {
            id: "target-costing-mc",
            kind: "multiple-choice",
            prompt: "What is the correct starting point in a target-costing problem?",
            choices: [
                "Market price less required target profit",
                "Current cost plus any desired markup",
                "Total fixed cost divided by units sold",
                "Prior-year cost plus inflation",
            ],
            answerIndex: 0,
            explanation:
                "Target costing starts with the price customers are expected to accept and subtracts the required profit.",
        },
    }),
    makeTopic({
        id: "audit-evidence-procedure-program-and-contradictions",
        title: "Audit Evidence, Procedure Programs, and Contradictory Findings",
        shortTitle: "Evidence Program",
        category: "Audit & Assurance",
        summary:
            "Review assertion risk, evidence reliability, relevance, coverage, contradictions, and audit-procedure intensity.",
        intro:
            "Audit evidence questions are stronger when students connect assertions to procedure design and explain why contradictory evidence changes the response.",
        focus: "assertion risk and sufficient appropriate evidence",
        workedScenario:
            "Inventory valuation has high assertion risk, internally generated reports, limited test coverage, and one contradiction from supplier confirmation.",
        workedResult:
            "Use the Audit Evidence Program Builder to identify the residual evidence gap and plan stronger procedures.",
        checkpointScenario:
            "A student says evidence is enough because several documents exist, even though they are weakly relevant and contradictory.",
        checkpointResult:
            "Quantity of documents does not replace relevance, reliability, and contradiction resolution.",
        keywords: ["audit evidence", "assertions", "reliability", "relevance", "contradictory evidence"],
        scanSignals: ["sufficient appropriate evidence", "reliability", "relevance", "contradictory evidence"],
        relatedCalculatorPaths: ["/audit/evidence-program-builder", "/audit/assertion-evidence-planner", "/audit/audit-planning-workspace"],
        relatedTopicIds: ["audit-materiality-risk-and-evidence-linkage"],
        quizQuestion: {
            id: "audit-evidence-mc",
            kind: "multiple-choice",
            prompt: "Why does contradictory evidence matter in an audit program?",
            choices: [
                "It must be resolved or corroborated before a clean conclusion is supportable",
                "It can always be ignored if most evidence agrees",
                "It automatically proves fraud",
                "It only matters during tax planning",
            ],
            answerIndex: 0,
            explanation:
                "Contradictory evidence affects sufficiency and appropriateness; the auditor needs follow-up before concluding.",
        },
    }),
    makeTopic({
        id: "cpa-practical-financial-accounting-integrated-review",
        title: "CPA Practical Financial Accounting Integrated Review",
        shortTitle: "Practical FAR Review",
        category: "Strategic / Integrative",
        summary:
            "Map practical financial accounting cases into conceptual framework, FAR measurement, tax, audit, and workpaper follow-up routes.",
        intro:
            "Practical financial accounting review often mixes recognition, measurement, tax effects, and audit evidence. This topic trains students to route the case rather than treating it as one flat computation.",
        focus: "integrated practical financial accounting route selection",
        workedScenario:
            "A review case combines revenue allocation, receivable collectability, income-tax difference, and audit evidence around the same customer contract.",
        workedResult:
            "Map the case first, solve revenue allocation, review allowance or tax bridge only if facts require it, then use audit evidence support for the assurance angle.",
        checkpointScenario:
            "A student solves a revenue number but ignores the audit evidence and tax difference asked in the final requirement.",
        checkpointResult:
            "Integrated cases need a route map before individual computations.",
        keywords: ["practical financial accounting", "cpa review", "integrated case", "far", "audit", "tax"],
        scanSignals: ["practical accounting", "cpa review", "integrated case", "audit evidence", "taxable income"],
        relatedCalculatorPaths: ["/strategic/integrative-case-mapper", "/far/revenue-allocation-workspace", "/tax/taxable-income-bridge", "/audit/evidence-program-builder"],
        relatedTopicIds: ["far-revenue-allocation-and-contract-balances", "income-taxation-taxable-income-bridge", "audit-evidence-procedure-program-and-contradictions"],
        quizQuestion: {
            id: "practical-far-review-mc",
            kind: "multiple-choice",
            prompt: "What is the best first step in a mixed practical accounting case?",
            choices: [
                "Map the requirements into routes before computing individual parts",
                "Solve only the first numeric requirement",
                "Ignore nonnumeric audit and tax prompts",
                "Use one formula for all requirements",
            ],
            answerIndex: 0,
            explanation:
                "Mixed CPA-style cases reward route mapping because the requirements may cross FAR, tax, audit, and reviewer topics.",
        },
    }),
];
