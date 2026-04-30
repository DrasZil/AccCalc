import type {
    StudyQuizQuestion,
    StudyTopic,
    StudyTopicCategory,
} from "./studyContent.js";

type SuperCompletionSeed = {
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

function makeSuperCompletionTopic(seed: SuperCompletionSeed): StudyTopic {
    return {
        id: seed.id,
        title: seed.title,
        shortTitle: seed.shortTitle,
        category: seed.category,
        summary: seed.summary,
        intro:
            `This 13.3 completion topic turns ${seed.focus} into a learn-practice-solve path with a linked AccCalc workspace and mistake-repair cues.`,
        whyItMatters: [
            "It fills a curriculum area where students often know definitions but miss the route choice.",
            "It connects reviewer judgment to a concrete workspace, quiz, or related topic.",
            "It supports CPA-style review where classification, computation, and explanation are mixed together.",
        ],
        classContexts: [
            `${seed.shortTitle} reviewer discussion`,
            "Mixed CPA-review drills",
            "Lesson-end practice followed by calculator or workspace verification",
        ],
        whenToUse: [
            `Use this when a prompt centers on ${seed.focus}.`,
            "Use it before computing if the first step is classification or response design.",
            "Use it after a quiz miss to identify the exact fact that changed the answer.",
        ],
        formulaOverview: [
            {
                label: "Completion loop",
                expression: "Learn -> Practice -> Solve -> Review -> Continue",
                explanation:
                    "The lesson defines the issue, the quiz checks route choice, the workspace structures the answer, and the review step records assumptions.",
            },
        ],
        variableDefinitions: [
            { symbol: "Issue", meaning: "The controlling fact pattern or academic question" },
            { symbol: "Route", meaning: "The AccCalc lesson, quiz, workspace, or nearby tool that best supports it" },
            { symbol: "Limit", meaning: "The assumption, classroom simplification, or authority boundary beside the answer" },
        ],
        procedure: [
            "Name the controlling issue in one sentence.",
            "Separate classification, computation, and conclusion.",
            "Use the linked workspace only after the required facts are identified.",
            "Write the result together with one assumption or limitation.",
            "Use the quiz explanation to decide whether to continue or revisit a related lesson.",
        ],
        workedExample: {
            title: `${seed.shortTitle} worked example`,
            scenario: seed.workedScenario,
            steps: [
                "Identify the controlling issue.",
                "Choose the linked route.",
                "Apply the reviewer rule, computation, or triage model.",
                "State the result and the limitation.",
            ],
            result: seed.workedResult,
            interpretation:
                "A complete answer explains why the route fits the facts, not only the final number or label.",
        },
        checkpointExample: {
            title: `${seed.shortTitle} checkpoint`,
            scenario: seed.checkpointScenario,
            steps: [
                "Find the fact that changes the route.",
                "Reject the tempting but weaker shortcut.",
                "Open the related quiz or workspace for a variation.",
            ],
            result: seed.checkpointResult,
            interpretation:
                "The checkpoint is a small mistake-repair drill before moving to broader mixed review.",
        },
        interpretation: [
            `${seed.shortTitle} answers should show the issue, route, response, and limitation.`,
            "When legal, tax, or audit authority may change the answer, treat AccCalc as educational support only.",
            "For numeric topics, read the result as a structured calculation under the page assumptions.",
        ],
        commonMistakes: [
            "Starting with a memorized keyword instead of the controlling fact.",
            "Using a calculation when the case first needs classification.",
            "Leaving out the limitation that keeps the answer academically honest.",
        ],
        examTraps: [
            "A prompt may include a familiar word from a different topic family.",
            "A score or schedule may need a qualitative conclusion before it is useful.",
            "Official tax, law, and audit requirements must be verified when the prompt moves beyond classroom review.",
        ],
        selfCheck: [
            "What fact controls the route choice?",
            "Which AccCalc workspace or lesson should I open next?",
            "What assumption would I write beside the result?",
        ],
        practiceCues: [
            "Take the quiz before reopening the workspace if the topic is mostly classification.",
            "Change one fact in the worked example and solve again.",
            "Record the result in a workpaper when the prompt has multiple linked topics.",
        ],
        deepDiveSections: [
            {
                id: `${seed.id}-route-map`,
                title: "Route map",
                summary: "Use the topic as a small decision tree before solving.",
                points: [
                    `Start with ${seed.focus}.`,
                    "Open the linked route for computation or response scoring.",
                    "Use related routes when the prompt expands into an adjacent topic.",
                ],
            },
            {
                id: `${seed.id}-survivability`,
                title: "Survivability note",
                summary: "This topic keeps the app usable even after time away from the material.",
                points: [
                    "The first action is visible in the lesson and workspace.",
                    "The quiz explanation points back to the missed step.",
                    "The linked workpaper template can preserve assumptions and next actions.",
                ],
                tone: "info",
            },
        ],
        nextStepPrompts: [
            "Take the linked practice quiz.",
            "Open the related workspace and solve a variation.",
            "Use the v13.3 Super-Completion Review Map workpaper for multi-topic cases.",
        ],
        keywords: seed.keywords,
        scanSignals: seed.scanSignals,
        relatedCalculatorPaths: [seed.route, ...seed.relatedRoutes],
        relatedTopicIds: seed.relatedTopicIds,
        quiz: {
            title: `${seed.shortTitle} guided practice`,
            intro:
                "A compact original practice set that checks route choice, interpretation, and the next solve step.",
            questions: seed.quiz,
        },
    };
}

export const STUDY_HUB_EXPANSION_1330_TOPICS: StudyTopic[] = [
    makeSuperCompletionTopic({
        id: "afar-installment-sales-deferred-gross-profit",
        title: "AFAR Installment Sales and Deferred Gross Profit",
        shortTitle: "Installment Sales",
        category: "AFAR / Consolidation",
        summary:
            "Connect gross profit rate, cash collections, realized gross profit, deferred gross profit, and repossession review.",
        focus: "installment sales and deferred gross profit",
        route: "/afar/installment-sales-review",
        relatedRoutes: ["/afar/franchise-revenue-workspace", "/afar/consignment-settlement"],
        relatedTopicIds: ["revenue-allocation-performance-obligations"],
        keywords: ["installment sales", "deferred gross profit", "cash collections", "repossession"],
        scanSignals: ["installment sales", "realized gross profit", "deferred gross profit", "collections"],
        workedScenario:
            "A sale has a contract price, cost, and current collections. The prompt asks for realized gross profit and ending deferred gross profit.",
        workedResult:
            "Use the installment-sales review page, compute the gross profit rate, apply it to collections, and carry the unsatisfied gross profit as deferred.",
        checkpointScenario:
            "A student recognizes the entire gross profit immediately because the contract was signed.",
        checkpointResult:
            "In installment-sales review, cash collections drive realized gross profit under the classroom model.",
        quiz: [
            {
                id: "installment-mc-driver",
                kind: "multiple-choice",
                prompt: "In the installment-sales review model, what drives realized gross profit?",
                choices: ["Cash collections", "Contract signing date", "Inventory shipment only", "Total credit sales"],
                answerIndex: 0,
                explanation: "The model applies the gross profit rate to cash collected in the period.",
            },
            {
                id: "installment-tf-deferred",
                kind: "true-false",
                prompt: "Deferred gross profit is the portion not yet realized under the collection-based classroom model.",
                answer: true,
                explanation: "The uncollected portion remains deferred until collections support recognition.",
            },
            {
                id: "installment-short-route",
                kind: "short-answer",
                prompt: "Which AccCalc workspace should you open for this topic?",
                acceptedAnswers: ["installment sales review", "installment sales", "installment sales gross profit review"],
                explanation: "The Installment Sales Gross Profit Review page is wired to this lesson and quiz.",
            },
        ],
    }),
    makeSuperCompletionTopic({
        id: "audit-going-concern-completion-review",
        title: "Going Concern and Audit Completion Review",
        shortTitle: "Going Concern",
        category: "Audit & Assurance",
        summary:
            "Structure adverse conditions, management plans, evidence support, and completion-stage reporting direction.",
        focus: "going-concern review and audit completion response",
        route: "/audit/going-concern-review",
        relatedRoutes: ["/audit/audit-completion-and-opinion", "/audit/evidence-program-builder"],
        relatedTopicIds: ["audit-materiality-and-misstatement-response"],
        keywords: ["going concern", "substantial doubt", "management plan", "subsequent events"],
        scanSignals: ["going concern", "substantial doubt", "liquidity", "management plan"],
        workedScenario:
            "The entity has recurring losses and covenant pressure, but management presents financing plans with limited support.",
        workedResult:
            "Score adverse conditions against evidence-backed plans, then expand procedures and disclosure review if residual doubt remains.",
        checkpointScenario:
            "A student accepts management's plan because it is written in the audit file.",
        checkpointResult:
            "Plans reduce doubt only when feasible and supported by evidence.",
        quiz: [
            {
                id: "gc-mc-best-evidence",
                kind: "multiple-choice",
                prompt: "Which fact most strengthens a going-concern mitigation plan?",
                choices: ["Supported financing evidence", "Management optimism", "A longer narrative", "Prior-year profitability only"],
                answerIndex: 0,
                explanation: "The auditor needs evidence that the plan is feasible, not only management intent.",
            },
            {
                id: "gc-tf-disclosure",
                kind: "true-false",
                prompt: "A going-concern review can require disclosure and reporting analysis even after procedures are expanded.",
                answer: true,
                explanation: "Completion review includes procedures, disclosure, and reporting consequences.",
            },
            {
                id: "gc-short-risk",
                kind: "short-answer",
                prompt: "Name one adverse condition that can raise going-concern doubt.",
                acceptedAnswers: ["liquidity pressure", "recurring losses", "debt covenant pressure", "negative cash flow"],
                explanation: "Liquidity pressure, recurring losses, covenant problems, and negative cash flows are common signals.",
            },
        ],
    }),
    makeSuperCompletionTopic({
        id: "tax-remedies-and-deadline-triage",
        title: "Tax Remedies and Deadline Triage",
        shortTitle: "Tax Remedies",
        category: "Taxation",
        summary:
            "Organize educational tax-remedy prompts around entered deadline pressure, evidence completeness, materiality, and procedural complexity.",
        focus: "tax remedies and deadline triage",
        route: "/tax/tax-remedy-timeline-review",
        relatedRoutes: ["/tax/tax-compliance-review", "/tax/income-tax-payable-review"],
        relatedTopicIds: ["income-tax-payable-credits-and-overpayment"],
        keywords: ["tax remedies", "tax protest", "refund claim", "assessment", "deadline"],
        scanSignals: ["tax remedy", "assessment", "refund claim", "deadline", "evidence"],
        workedScenario:
            "A taxpayer review prompt gives an assessment issue, partial records, and a tight entered deadline for response.",
        workedResult:
            "Use the remedy timeline review to prioritize evidence gathering and procedural verification before the deadline tightens.",
        checkpointScenario:
            "A student treats a remedy prompt as a tax-payable computation only.",
        checkpointResult:
            "The first route is procedural triage; computation is secondary unless the remedy depends on amount calculation.",
        quiz: [
            {
                id: "tax-remedy-mc-first",
                kind: "multiple-choice",
                prompt: "What should be verified first in a tax-remedy case?",
                choices: ["The procedural route and deadline", "Only the gross tax rate", "The app theme", "The number of quiz attempts"],
                answerIndex: 0,
                explanation: "Remedy problems are procedural; deadline and route verification come before computation.",
            },
            {
                id: "tax-remedy-tf-official",
                kind: "true-false",
                prompt: "AccCalc's remedy review page supplies official current tax authority deadlines.",
                answer: false,
                explanation: "The page is educational support only and uses user-entered timeline assumptions.",
            },
            {
                id: "tax-remedy-short",
                kind: "short-answer",
                prompt: "Name one input used by the Tax Remedy Timeline Review page.",
                acceptedAnswers: ["days until deadline", "evidence completeness", "amount materiality", "procedural complexity"],
                explanation: "The triage model uses entered deadline pressure, evidence completeness, amount materiality, and complexity.",
            },
        ],
    }),
    makeSuperCompletionTopic({
        id: "ais-incident-response-and-it-audit",
        title: "AIS Incident Response and IT-Audit Triage",
        shortTitle: "Incident Response",
        category: "AIS / IT Controls",
        summary:
            "Bridge CIA impact, containment, evidence readiness, escalation, and IT-audit documentation.",
        focus: "AIS incident response and IT-audit triage",
        route: "/ais/incident-response-triage",
        relatedRoutes: ["/ais/business-continuity-planner", "/ais/access-control-review"],
        relatedTopicIds: ["ais-revenue-cycle-controls-and-application-controls"],
        keywords: ["incident response", "CIA triad", "containment", "IT audit", "evidence readiness"],
        scanSignals: ["incident response", "security incident", "confidentiality", "integrity", "availability"],
        workedScenario:
            "A security incident affects data availability and may have exposed customer records, but logs are incomplete.",
        workedResult:
            "Score CIA impact against containment and evidence readiness, then escalate if residual incident risk remains elevated.",
        checkpointScenario:
            "A student closes the incident because systems are back online.",
        checkpointResult:
            "Recovery alone is not closure; evidence, root cause, and control weakness review still matter.",
        quiz: [
            {
                id: "ais-incident-mc-cia",
                kind: "multiple-choice",
                prompt: "Which set belongs to the CIA impact frame?",
                choices: ["Confidentiality, integrity, availability", "Cash, inventory, assets", "Cost, income, amortization", "Control, invoice, approval"],
                answerIndex: 0,
                explanation: "CIA means confidentiality, integrity, and availability.",
            },
            {
                id: "ais-incident-tf-evidence",
                kind: "true-false",
                prompt: "Evidence readiness matters because incident response also supports later review and accountability.",
                answer: true,
                explanation: "Logs, ownership, and documentation help prove what happened and whether controls failed.",
            },
            {
                id: "ais-incident-short-route",
                kind: "short-answer",
                prompt: "Which AccCalc route supports this topic?",
                acceptedAnswers: ["incident response triage", "ais incident response", "incident triage"],
                explanation: "The Incident Response Triage workspace is linked directly from this topic.",
            },
        ],
    }),
    makeSuperCompletionTopic({
        id: "far-notes-disclosure-and-presentation-map",
        title: "FAR Notes, Disclosure, and Presentation Map",
        shortTitle: "Disclosure Map",
        category: "Financial Accounting",
        summary:
            "Organize presentation and disclosure thinking for financial statements, notes, estimates, policies, contingencies, and statement links.",
        focus: "financial statement presentation and notes disclosure",
        route: "/far/cash-flow-statement-builder",
        relatedRoutes: ["/far/statement-of-changes-in-equity-builder", "/far/provision-expected-value"],
        relatedTopicIds: ["financial-statement-analysis-quality-signals"],
        keywords: ["notes to financial statements", "disclosure", "presentation", "accounting policies"],
        scanSignals: ["notes to financial statements", "disclosure", "presentation", "accounting policy"],
        workedScenario:
            "A case asks whether a contingent obligation should be recognized, disclosed, or explained in notes.",
        workedResult:
            "Separate recognition from disclosure, then connect the item to the statement affected and the related note explanation.",
        checkpointScenario:
            "A student records every uncertainty as a liability.",
        checkpointResult:
            "Some uncertainties require disclosure instead of recognition depending on probability, measurability, and framework logic.",
        quiz: [
            {
                id: "far-disclosure-mc",
                kind: "multiple-choice",
                prompt: "What should be separated before answering a disclosure case?",
                choices: ["Recognition and disclosure", "Debit and theme color", "Only cash and sales", "Quiz and settings"],
                answerIndex: 0,
                explanation: "A strong answer distinguishes whether an item is recognized, disclosed, or both.",
            },
            {
                id: "far-disclosure-tf",
                kind: "true-false",
                prompt: "Notes can explain accounting policies, estimates, contingencies, and statement details.",
                answer: true,
                explanation: "Notes support statement understanding when users need context not visible on the face of the statements.",
            },
            {
                id: "far-disclosure-short",
                kind: "short-answer",
                prompt: "Name one item often explained in notes.",
                acceptedAnswers: ["accounting policy", "estimate", "contingency", "commitment", "related party"],
                explanation: "Policies, estimates, contingencies, commitments, and related parties are common note topics.",
            },
        ],
    }),
    makeSuperCompletionTopic({
        id: "bookkeeping-closing-reversing-cycle",
        title: "Bookkeeping Closing and Reversing Cycle",
        shortTitle: "Closing Cycle",
        category: "Financial Accounting",
        summary:
            "Strengthen the accounting-cycle bridge from adjusting entries into closing, post-closing trial balance, and reversing-entry logic.",
        focus: "closing and reversing entries after adjustments",
        route: "/accounting/adjusting-entries-workspace",
        relatedRoutes: ["/accounting/trial-balance-checker", "/accounting/debit-credit-trainer"],
        relatedTopicIds: ["accounting-foundations-review"],
        keywords: ["closing entries", "reversing entries", "post-closing trial balance", "worksheet"],
        scanSignals: ["closing entries", "reversing entries", "post-closing trial balance"],
        workedScenario:
            "Adjusted balances are ready, and the task asks which temporary accounts close and whether an accrual should reverse.",
        workedResult:
            "Close temporary accounts to equity or income summary, keep real accounts open, and reverse selected accruals only when the next period entry would be simplified.",
        checkpointScenario:
            "A student closes asset and liability balances with revenue and expense accounts.",
        checkpointResult:
            "Assets and liabilities are real accounts; they carry forward to the next period.",
        quiz: [
            {
                id: "closing-mc-temporary",
                kind: "multiple-choice",
                prompt: "Which accounts are normally closed at period end?",
                choices: ["Temporary accounts", "All asset accounts", "All liability accounts", "Only cash"],
                answerIndex: 0,
                explanation: "Revenues, expenses, and withdrawals/dividends are temporary accounts.",
            },
            {
                id: "closing-tf-real",
                kind: "true-false",
                prompt: "Real accounts carry forward after closing.",
                answer: true,
                explanation: "Assets, liabilities, and equity accounts continue into the next period.",
            },
            {
                id: "closing-short",
                kind: "short-answer",
                prompt: "What trial balance comes after closing entries?",
                acceptedAnswers: ["post-closing trial balance", "post closing trial balance"],
                explanation: "The post-closing trial balance contains real accounts after temporary accounts are closed.",
            },
        ],
    }),
    makeSuperCompletionTopic({
        id: "rfbt-corporation-lifecycle-and-remedies",
        title: "RFBT Corporation Lifecycle and Remedies",
        shortTitle: "Corp Law",
        category: "RFBT / Business Law",
        summary:
            "Map incorporation, governance, foreign corporation issues, merger, dissolution, liquidation, securities, and remedies into a review sequence.",
        focus: "corporation law lifecycle and remedies",
        route: "/rfbt/business-law-review",
        relatedRoutes: ["/rfbt/securities-and-governance-review", "/rfbt/commercial-transactions-reviewer"],
        relatedTopicIds: ["rfbt-negotiable-instruments-issue-spotter"],
        keywords: ["corporation law", "one person corporation", "foreign corporation", "dissolution", "merger"],
        scanSignals: ["corporation", "one person corporation", "foreign corporation", "dissolution", "merger"],
        workedScenario:
            "A case mixes board approval, foreign corporation activity, and possible dissolution consequences.",
        workedResult:
            "Classify the lifecycle stage first, then route into governance, securities, or remedies instead of answering from one keyword.",
        checkpointScenario:
            "A student treats a securities issue as ordinary contract breach only.",
        checkpointResult:
            "Securities and governance facts may require specialized RFBT review before remedies are selected.",
        quiz: [
            {
                id: "corp-mc-first",
                kind: "multiple-choice",
                prompt: "What is the best first step in a corporation-law lifecycle case?",
                choices: ["Identify the lifecycle stage", "Compute gross profit", "Open VAT first", "Ignore governance facts"],
                answerIndex: 0,
                explanation: "Formation, operation, merger, dissolution, and liquidation lead to different rule families.",
            },
            {
                id: "corp-tf-governance",
                kind: "true-false",
                prompt: "Governance facts can change the route in a corporation-law problem.",
                answer: true,
                explanation: "Authority, board action, securities, and stakeholder facts affect the legal issue path.",
            },
            {
                id: "corp-short",
                kind: "short-answer",
                prompt: "Name one corporation-law lifecycle stage.",
                acceptedAnswers: ["formation", "operation", "merger", "dissolution", "liquidation"],
                explanation: "Lifecycle stage drives the next legal review route.",
            },
        ],
    }),
    makeSuperCompletionTopic({
        id: "integrated-cpa-case-method",
        title: "Integrated CPA Case Method",
        shortTitle: "CPA Case Method",
        category: "Strategic / Integrative",
        summary:
            "Use a stable method for mixed FAR, AFAR, MS, Audit, Tax, RFBT, AIS, governance, and strategy prompts.",
        focus: "integrated CPA-review case routing",
        route: "/strategic/integrative-case-mapper",
        relatedRoutes: ["/workpapers", "/smart/solver", "/study/practice"],
        relatedTopicIds: ["far-notes-disclosure-and-presentation-map"],
        keywords: ["integrated case", "CPA review", "mixed problem", "case mapper"],
        scanSignals: ["case", "integrated", "review", "mixed problem"],
        workedScenario:
            "A long case includes revenue recognition, internal controls, possible tax difference, and a governance issue.",
        workedResult:
            "Use the case mapper to split facts by subject, solve the numeric part, then record assumptions and next actions in workpapers.",
        checkpointScenario:
            "A student tries to solve the first number and ignores the audit and governance facts.",
        checkpointResult:
            "Mixed cases need subject routing before calculation; otherwise the final answer is incomplete.",
        quiz: [
            {
                id: "case-mc-method",
                kind: "multiple-choice",
                prompt: "What should come before computation in a mixed CPA-review case?",
                choices: ["Subject routing", "Changing settings", "Skipping assumptions", "Choosing the longest answer"],
                answerIndex: 0,
                explanation: "Subject routing prevents one topic from swallowing the whole case.",
            },
            {
                id: "case-tf-workpaper",
                kind: "true-false",
                prompt: "A workpaper can help preserve assumptions and next actions in mixed cases.",
                answer: true,
                explanation: "Workpapers are useful when a case has multiple subject threads and limitations.",
            },
            {
                id: "case-short-loop",
                kind: "short-answer",
                prompt: "What is the 13.3 completion loop?",
                acceptedAnswers: ["learn practice solve review continue", "learn -> practice -> solve -> review -> continue"],
                explanation: "The completion loop keeps lessons, quizzes, workspaces, review, and continuation connected.",
            },
        ],
    }),
];
