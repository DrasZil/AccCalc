import type { StudyTopic, StudyTopicCategory } from "./studyContent.js";

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
            `It helps students explain ${seed.focus} as a structured process instead of a memorized fragment.`,
            "It keeps the lesson tied to board-style interpretation and not only textbook wording.",
            "It improves route selection inside AccCalc because the topic signals are clearer.",
        ],
        classContexts: [
            `${seed.shortTitle} reviewer sessions`,
            "Board-review style mixed cases",
            "Short-answer and concept-explanation drills",
        ],
        whenToUse: [
            `Use this topic when the case is primarily about ${seed.focus}.`,
            "Use it before a workspace when you need the concept map first.",
            "Use it after a mistake when wrong classification was the real problem.",
        ],
        formulaOverview: [
            {
                label: "Review structure",
                expression: `${seed.shortTitle}: classify the issue -> apply the core rule or framework -> interpret the consequence`,
                explanation:
                    "This lesson is structured as a reviewer path so the main issue becomes clear before detailed solving begins.",
            },
        ],
        variableDefinitions: [
            { symbol: "Primary issue", meaning: "The main idea or question the case is really asking" },
            { symbol: "Supporting issue", meaning: "A second idea that affects interpretation or route choice" },
        ],
        procedure: [
            "Identify the primary issue before choosing a calculator or answer path.",
            "Separate the conceptual rule from the supporting facts.",
            "State the likely effect, risk, or conclusion clearly.",
            "Link the answer to the next AccCalc tool or lesson when needed.",
        ],
        workedExample: {
            title: `${seed.shortTitle} worked example`,
            scenario: seed.workedScenario,
            steps: [
                "Classify the issue first.",
                "Apply the core framework or rule to the facts.",
                "Explain the consequence in plain language.",
                "Choose the best next calculator, lesson, or practice route.",
            ],
            result: seed.workedResult,
            interpretation:
                "The value of the lesson is the structure it gives the student before detailed solving begins.",
        },
        checkpointExample: {
            title: `${seed.shortTitle} checkpoint`,
            scenario: seed.checkpointScenario,
            steps: [
                "Pause the first instinctive route choice.",
                "Re-check the actual issue being asked.",
                "Redirect the answer using the correct framework.",
            ],
            result: seed.checkpointResult,
            interpretation:
                "The checkpoint exists to catch wrong routing or shallow interpretation before it spreads through the full answer.",
        },
        interpretation: [
            `A strong ${seed.shortTitle.toLowerCase()} answer starts with classification before detail.`,
            "A correct number can still sit inside a weak answer if the issue was framed badly.",
            "Use follow-up tools only after the lesson structure is clear.",
        ],
        commonMistakes: [
            "Jumping into a familiar formula or rule before classifying the case.",
            "Listing facts without naming the issue clearly.",
            "Ignoring the final consequence or interpretation.",
        ],
        examTraps: [
            "The first familiar keyword in a case may not point to the main issue.",
            "A question may mix two subjects, but only one is primary for the first route choice.",
            "Students often stop at computation and forget the broader conclusion.",
        ],
        selfCheck: [
            "What is the primary issue here?",
            "What supporting issue still affects the final answer?",
            "Which AccCalc route best fits the next step after this lesson?",
        ],
        practiceCues: [
            "Explain the issue in one sentence before solving.",
            "State one common wrong route for this topic.",
            "Describe the final consequence that should appear in the answer.",
        ],
        keywords: seed.keywords,
        scanSignals: seed.scanSignals,
        relatedCalculatorPaths: seed.relatedCalculatorPaths,
        relatedTopicIds: seed.relatedTopicIds,
        quiz: {
            title: `${seed.shortTitle} Check`,
            intro: `Use this short set to verify whether you can classify and interpret ${seed.shortTitle.toLowerCase()} cases accurately.`,
            questions: [
                {
                    id: `${seed.id}-q1`,
                    kind: "multiple-choice",
                    prompt: "What should usually happen before opening the most detailed route?",
                    choices: [
                        "Classify the primary issue",
                        "Skip directly to the longest calculation",
                        "Ignore the supporting facts",
                        "Answer without interpretation",
                    ],
                    answerIndex: 0,
                    explanation:
                        "The best first step is usually proper classification of the case, not premature solving.",
                },
                {
                    id: `${seed.id}-q2`,
                    kind: "true-false",
                    prompt: "A familiar keyword always tells you the correct route immediately.",
                    answer: false,
                    explanation:
                        "Mixed cases often contain misleading familiar words that are not the real primary issue.",
                },
                {
                    id: `${seed.id}-q3`,
                    kind: "short-answer",
                    prompt: "Why is issue classification important before detailed solving?",
                    acceptedAnswers: [
                        "because it helps choose the right route",
                        "because wrong routing leads to weak answers",
                        "because it keeps the interpretation accurate",
                    ],
                    explanation:
                        "Correct classification protects both the computation route and the final interpretation.",
                },
            ],
        },
    };
}

export const STUDY_HUB_CURRICULUM_TOPICS: StudyTopic[] = [
    makeTopic({
        id: "afar-business-combinations-and-consolidation",
        title: "AFAR: Business Combinations and Consolidation",
        shortTitle: "AFAR Combination",
        category: "AFAR / Consolidation",
        summary:
            "Review goodwill, NCI measurement, and consolidation purpose before moving into more detailed AFAR cases.",
        intro:
            "AFAR cases are easier when acquisition-date logic and consolidation purpose are understood before later-period adjustments are attempted.",
        focus: "goodwill, NCI, and consolidation-at-acquisition logic",
        workedScenario:
            "A parent acquires a controlling interest, the case gives fair values, and the student must explain goodwill and the role of consolidation entries.",
        workedResult:
            "The strongest answer explains both the acquisition-date measurement and why the group is presented as one reporting entity.",
        checkpointScenario:
            "A student leaves the parent's investment account untouched in the consolidated statement.",
        checkpointResult:
            "Consolidation answers are stronger when the purpose of elimination is clear and not treated as a mechanical rule only.",
        keywords: ["afar", "business combination", "goodwill", "nci", "consolidation"],
        scanSignals: ["consideration transferred", "goodwill", "non controlling interest", "consolidated"],
        relatedCalculatorPaths: ["/afar/business-combination-analysis"],
        relatedTopicIds: ["integrative-review-and-case-mapping"],
    }),
    makeTopic({
        id: "audit-planning-evidence-and-reporting",
        title: "Audit Planning, Evidence, and Reporting Flow",
        shortTitle: "Audit Flow",
        category: "Audit & Assurance",
        summary:
            "Study materiality, audit risk, evidence, completion procedures, and report formulation as one assurance workflow.",
        intro:
            "Audit topics become easier when they are treated as one flow from planning through evidence and finally reporting.",
        focus: "materiality, risk assessment, evidence, and reporting consequence",
        workedScenario:
            "A case gives a materiality benchmark, high revenue risk, weak controls, and then asks what procedures and report implications follow.",
        workedResult:
            "The answer should connect planning choices to evidence response and then to the final reporting implication.",
        checkpointScenario:
            "A student lists many audit procedures but cannot explain why they fit the assessed risk.",
        checkpointResult:
            "Audit procedures are stronger when they are linked to assertions, risk, and final reporting effect.",
        keywords: ["audit planning", "materiality", "audit risk", "audit evidence", "audit report"],
        scanSignals: ["inherent risk", "control risk", "detection risk", "audit report", "audit evidence"],
        relatedCalculatorPaths: ["/audit/audit-planning-workspace", "/ais/it-control-matrix"],
        relatedTopicIds: ["ais-it-governance-and-controls", "governance-risk-ethics-and-internal-control"],
    }),
    makeTopic({
        id: "tax-book-tax-vat-and-compliance",
        title: "Tax Logic: Income, VAT, and Book-Tax Differences",
        shortTitle: "Tax Logic",
        category: "Taxation",
        summary:
            "Review taxable-income logic, VAT structure, and book-tax differences without mixing legal and accounting labels.",
        intro:
            "Tax questions often look numeric, but the real challenge is keeping the labels, legal basis, and accounting effects separate.",
        focus: "taxable-income bridging, VAT structure, and careful compliance framing",
        workedScenario:
            "A case gives accounting income, permanent and temporary differences, and asks for current tax plus a deferred effect.",
        workedResult:
            "The strongest answer labels the type of difference clearly before interpreting the tax effect.",
        checkpointScenario:
            "A student treats tax evasion as a stronger form of normal tax planning.",
        checkpointResult:
            "Tax analysis must keep legal and ethical compliance distinctions explicit, not implied.",
        keywords: ["taxation", "taxable income", "book tax differences", "vat", "deferred tax"],
        scanSignals: ["taxable income", "temporary difference", "permanent difference", "vat payable"],
        relatedCalculatorPaths: ["/tax/book-tax-difference-workspace", "/accounting/philippine-vat"],
        relatedTopicIds: ["governance-risk-ethics-and-internal-control", "integrative-review-and-case-mapping"],
    }),
    makeTopic({
        id: "rfbt-obligations-contracts-and-corporation-law",
        title: "RFBT: Obligations, Contracts, and Corporation Law",
        shortTitle: "RFBT Core",
        category: "RFBT / Business Law",
        summary:
            "Use a structured issue-spotting map for obligations, contracts, remedies, and corporation-law review questions.",
        intro:
            "RFBT questions become much easier when the answer is organized around issue, rule, application, and consequence.",
        focus: "legal issue spotting, rule application, and consequence reading",
        workedScenario:
            "A case asks whether a contract is enforceable, who had authority to act, and what remedy follows a failure to perform.",
        workedResult:
            "The answer becomes stronger when the issue is named clearly before the rule and remedy are discussed.",
        checkpointScenario:
            "A student retells the facts at length but never states the controlling issue or legal effect.",
        checkpointResult:
            "A business-law answer is weak if it never moves from fact summary into consequence analysis.",
        keywords: ["rfbt", "contracts", "obligations", "corporation law", "remedies"],
        scanSignals: ["remedy", "obligation", "contract", "board", "corporation"],
        relatedCalculatorPaths: ["/rfbt/business-law-review"],
        relatedTopicIds: ["governance-risk-ethics-and-internal-control", "integrative-review-and-case-mapping"],
    }),
    makeTopic({
        id: "ais-it-governance-and-controls",
        title: "AIS, IT Governance, and Control Environment",
        shortTitle: "AIS and IT Controls",
        category: "AIS / IT Controls",
        summary:
            "Review IT governance, general controls, application controls, documentation, and IT-audit relevance in one AIS study path.",
        intro:
            "AIS topics become clearer when governance, general controls, and application controls are kept distinct and then tied back to reporting reliability.",
        focus: "IT governance, control layers, documentation, and IT-audit consequence",
        workedScenario:
            "A case describes weak access review, undocumented program changes, and incomplete backup testing in a financial system environment.",
        workedResult:
            "The strongest answer separates the control layers, explains the weakness, and links it to reliability and audit response.",
        checkpointScenario:
            "A student describes every system weakness as an application-control issue.",
        checkpointResult:
            "Correct control classification improves both AIS understanding and IT-audit interpretation.",
        keywords: ["ais", "it governance", "it controls", "application controls", "it audit"],
        scanSignals: ["access controls", "change management", "backup", "application controls", "itgc"],
        relatedCalculatorPaths: ["/ais/it-control-matrix", "/audit/audit-planning-workspace"],
        relatedTopicIds: ["audit-planning-evidence-and-reporting", "governance-risk-ethics-and-internal-control"],
    }),
    makeTopic({
        id: "operations-forecasting-inventory-and-quality",
        title: "Operations: Forecasting, Inventory, and Quality",
        shortTitle: "Operations Review",
        category: "Operations / Supply Chain",
        summary:
            "Connect forecasting, EOQ, reorder points, capacity, and quality review into one operations-management study path.",
        intro:
            "Operations tools are most useful when students see how demand planning, replenishment, capacity, and quality decisions affect one another.",
        focus: "forecasting, replenishment, capacity, and quality tradeoffs",
        workedScenario:
            "A manufacturer needs an inventory policy while supplier lead time, plant capacity, and service expectations all matter at once.",
        workedResult:
            "The best answer combines the computed policy with a practical explanation of operations tradeoffs.",
        checkpointScenario:
            "A student treats the cheapest inventory policy as automatically the best operational answer.",
        checkpointResult:
            "Operations answers improve when quality, service, and capacity are evaluated alongside cost.",
        keywords: ["operations management", "eoq", "reorder point", "quality", "forecasting"],
        scanSignals: ["economic order quantity", "reorder point", "lead time", "safety stock", "quality"],
        relatedCalculatorPaths: [
            "/operations/eoq-and-reorder-point",
            "/business/capacity-utilization",
            "/accounting/inventory-control-workspace",
        ],
        relatedTopicIds: ["operating-capacity-and-planning-review", "integrative-review-and-case-mapping"],
    }),
    makeTopic({
        id: "governance-risk-ethics-and-internal-control",
        title: "Governance, Ethics, Risk, and Internal Control",
        shortTitle: "Governance and Risk",
        category: "Governance / Ethics / Risk",
        summary:
            "Study ethics, governance structure, risk assessment, and internal-control design and evaluation as one professional-judgment pathway.",
        intro:
            "Governance and internal-control topics become more useful when risk, ethics, and oversight are treated as connected ideas instead of isolated definitions.",
        focus: "risk identification, control response, ethical pressure, and governance consequence",
        workedScenario:
            "A case describes aggressive targets, weak approvals, and poor monitoring of exceptions in a sensitive reporting area.",
        workedResult:
            "The strongest answer identifies the risk, explains the control weakness, and states the residual governance exposure clearly.",
        checkpointScenario:
            "A student says trusted managers make documentation and formal controls unnecessary.",
        checkpointResult:
            "Good governance does not rely on trust alone; it still requires structure, evidence, and accountability.",
        keywords: ["governance", "ethics", "risk management", "internal control", "residual risk"],
        scanSignals: ["internal control", "ethics", "risk assessment", "control weakness", "residual risk"],
        relatedCalculatorPaths: ["/governance/risk-control-matrix", "/audit/audit-planning-workspace"],
        relatedTopicIds: ["audit-planning-evidence-and-reporting", "ais-it-governance-and-controls"],
    }),
    makeTopic({
        id: "integrative-review-and-case-mapping",
        title: "Integrative Review and Case Mapping",
        shortTitle: "Integrative Review",
        category: "Strategic / Integrative",
        summary:
            "Use a capstone-style study topic to map mixed cases across FAR, AFAR, managerial, audit, tax, law, AIS, and governance before solving.",
        intro:
            "Capstone and board-review cases are often mixed-topic by design. Strong performance depends on classifying the case correctly before solving.",
        focus: "primary-issue mapping, secondary-issue awareness, and route selection",
        workedScenario:
            "A case mixes inventory measurement, control weakness, and a possible reporting consequence in one fact pattern.",
        workedResult:
            "The best route is the one that solves the primary issue first while keeping the secondary issue visible for the final interpretation.",
        checkpointScenario:
            "A student chooses a tax workspace because of one familiar word even though the main issue is inventory measurement.",
        checkpointResult:
            "Wrong initial routing can produce neat arithmetic inside the wrong overall answer.",
        keywords: ["integrative review", "board review", "case mapping", "capstone"],
        scanSignals: ["mixed topic", "board review", "integrated case", "capstone"],
        relatedCalculatorPaths: ["/strategic/integrative-case-mapper", "/smart/solver", "/scan-check"],
        relatedTopicIds: [
            "audit-planning-evidence-and-reporting",
            "tax-book-tax-vat-and-compliance",
            "operations-forecasting-inventory-and-quality",
        ],
    }),
];
