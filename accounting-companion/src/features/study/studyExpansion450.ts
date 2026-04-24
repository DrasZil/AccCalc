import type {
    StudyDeepDiveSection,
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
    deepDiveSections?: StudyDeepDiveSection[];
    nextStepPrompts?: string[];
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
        deepDiveSections:
            seed.deepDiveSections ??
            [
                {
                    id: `${seed.id}-framework`,
                    title: "Framework distinction",
                    summary: "Open this when similar labels or nearby topics are starting to blur together.",
                    points: [
                        `Keep ${seed.focus} separate from nearby but different classification issues.`,
                        "State the controlling rule or framework before moving into numbers or consequences.",
                        "Use the route that solves the primary issue first, then deal with supporting issues.",
                    ],
                    tone: "info",
                },
                {
                    id: `${seed.id}-review`,
                    title: "Reviewer emphasis",
                    summary: "Use this for board-review or short-answer framing.",
                    points: [
                        "Name the issue clearly before discussing detail.",
                        "Connect the rule to the fact pattern instead of listing memorized fragments.",
                        "End with the actual effect, conclusion, or recommended next step.",
                    ],
                    tone: "default",
                },
            ],
        nextStepPrompts:
            seed.nextStepPrompts ??
            [
                "Open the most closely related calculator only after you can explain why it fits the issue.",
                "Move into quiz mode when you can classify the case without relying on the worked example.",
                "Use an integrative or reviewer topic next if the fact pattern is mixed rather than single-topic.",
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
        id: "far-leases-share-based-payments-and-equity-special-topics",
        title: "FAR: Leases, Share-Based Payments, and Equity Special Topics",
        shortTitle: "FAR Equity Depth",
        category: "Financial Accounting",
        summary:
            "Review lease measurement, share-based payment recognition, treasury-share and retained-earnings effects, and broader equity special topics in one FAR lesson.",
        intro:
            "These FAR areas are easy to misread because they combine measurement, classification, and statement presentation. The topic works best when the issue is identified before the numbers are pushed through a worksheet.",
        focus: "lease measurement, equity-settled compensation, and special equity presentation",
        workedScenario:
            "A case gives lease payments, a vesting schedule for options, and a separate equity adjustment issue in retained earnings.",
        workedResult:
            "The strongest answer keeps lease liability logic, compensation-cost timing, and equity-presentation consequences separate instead of collapsing them into one entry.",
        checkpointScenario:
            "A student records a lease from undiscounted payments and treats share-based compensation as an immediate full expense with no service-period logic.",
        checkpointResult:
            "FAR depth answers are stronger when present-value measurement, vesting period, and equity labels are handled deliberately.",
        keywords: ["leases", "share-based payments", "treasury shares", "retained earnings", "equity"],
        scanSignals: ["right of use", "lease liability", "stock options", "retained earnings", "treasury shares"],
        relatedCalculatorPaths: ["/far/lease-measurement-workspace", "/far/share-based-payment-workspace"],
        relatedTopicIds: ["far-cash-flow-and-statement-classification", "integrative-review-and-case-mapping"],
        deepDiveSections: [
            {
                id: "far-equity-lease-distinction",
                title: "Lease versus equity presentation",
                summary: "Use this when measurement and presentation issues appear in the same fact pattern.",
                points: [
                    "Lease questions usually start with present-value measurement and later expense pattern consequences.",
                    "Share-based payment questions usually start with grant-date fair value, expected vesting, and service-period recognition.",
                    "Equity special topics become stronger when retained earnings, treasury shares, and share capital labels stay distinct.",
                ],
                tone: "info",
            },
            {
                id: "far-quasi-reorg",
                title: "Quasi-reorganization and retained-earnings caution",
                summary: "Open this for special retained-earnings and capital-structure review.",
                points: [
                    "Quasi-reorganization topics are not routine retained-earnings entries; they are special capital-structure and deficit-cleanup cases.",
                    "Always state the effect on capital accounts and presentation rather than listing adjustments only.",
                    "If the case mixes equity cleanup with valuation, identify which issue is primary first.",
                ],
                tone: "warning",
            },
        ],
        nextStepPrompts: [
            "Open the lease workspace next when the case gives payment timing, discounting, or right-of-use measurement facts.",
            "Open the share-based payment workspace next when the case is mainly about vesting, forfeiture, or cumulative compensation cost.",
            "Move into integrative review when the same fact pattern also involves cash-flow or disclosure consequences.",
        ],
    }),
    makeTopic({
        id: "far-cash-flow-and-statement-classification",
        title: "FAR: Cash Flow Statement and Statement Classification Support",
        shortTitle: "Cash Flow Support",
        category: "Financial Accounting",
        summary:
            "Study indirect-method cash-flow logic, operating-investing-financing classification, and statement-building judgment without losing the presentation meaning.",
        intro:
            "Cash-flow questions often look like arithmetic, but the real difficulty is classification. Students get stronger faster when they learn why the line belongs in operating, investing, or financing activities.",
        focus: "indirect-method cash-flow building and statement classification",
        workedScenario:
            "A case gives net income, noncash charges, working-capital changes, capital expenditures, debt flows, and dividends.",
        workedResult:
            "The strongest answer explains the operating adjustments first, then keeps investing and financing lines separate instead of netting unrelated items together.",
        checkpointScenario:
            "A student leaves gains on asset sale inside operating cash flow and classifies debt proceeds as operating activity.",
        checkpointResult:
            "Classification is the real issue in many cash-flow cases, so the answer must explain the section logic clearly.",
        keywords: ["statement of cash flows", "indirect method", "cash flow classification", "operating financing investing"],
        scanSignals: ["cash flows from operating", "indirect method", "investing activities", "financing activities"],
        relatedCalculatorPaths: ["/far/cash-flow-statement-builder"],
        relatedTopicIds: ["far-leases-share-based-payments-and-equity-special-topics", "integrative-review-and-case-mapping"],
    }),
    makeTopic({
        id: "afar-foreign-currency-branch-and-home-office",
        title: "AFAR: Foreign Currency, Branch, and Home Office Support",
        shortTitle: "AFAR FX and Branch",
        category: "AFAR / Consolidation",
        summary:
            "Review foreign-currency transactions, settlement and translation effects, and branch-home-office accounting structure in one AFAR lesson.",
        intro:
            "AFAR foreign-currency and branch cases become easier when students separate transaction-date recognition, end-of-period translation, and interoffice-account logic.",
        focus: "foreign-currency measurement and branch-home-office structure",
        workedScenario:
            "A branch records transactions in a different currency and the case asks for home-office and reporting-currency consequences.",
        workedResult:
            "A strong answer separates the exchange-rate issue from the interoffice-account issue before solving.",
        checkpointScenario:
            "A student treats every foreign-currency effect as a branch-adjustment issue.",
        checkpointResult:
            "AFAR answers improve when foreign-currency effects and interoffice structure are not mixed carelessly.",
        keywords: ["foreign currency", "branch accounting", "home office", "translation"],
        scanSignals: ["exchange rate", "home office", "branch current", "closing rate"],
        relatedCalculatorPaths: ["/afar/foreign-currency-translation"],
        relatedTopicIds: ["afar-business-combinations-and-consolidation", "integrative-review-and-case-mapping"],
    }),
    makeTopic({
        id: "afar-franchise-consignment-construction-and-subscriptions",
        title: "AFAR: Franchise, Consignment, Construction, and Subscription Cases",
        shortTitle: "AFAR Special Revenue",
        category: "AFAR / Consolidation",
        summary:
            "Review special AFAR revenue and reporting topics such as franchise, consignment, long-term construction, subscriptions, warranties, and service contracts.",
        intro:
            "These special topics look different on the surface, but many of them test the same core idea: identify what has really been earned, recognized, or retained by the reporting entity.",
        focus: "special-revenue recognition and special reporting structure",
        workedScenario:
            "A case mixes long-term construction progress, a consignment relationship, and later warranty exposure.",
        workedResult:
            "The best answer identifies who bears the reporting consequence before discussing revenue, cost, or liability timing.",
        checkpointScenario:
            "A student records consignment goods as ordinary sales inventory and treats subscription receipts as fully earned immediately.",
        checkpointResult:
            "Special AFAR cases reward careful classification of control, earning process, and later obligations.",
        keywords: ["franchise", "consignment", "construction contract", "subscriptions", "warranty", "service contract"],
        scanSignals: ["consignment", "franchise fee", "percentage of completion", "subscriptions", "warranty"],
        relatedCalculatorPaths: ["/afar/construction-revenue-workspace"],
        relatedTopicIds: ["afar-foreign-currency-branch-and-home-office", "tax-book-tax-vat-and-compliance"],
    }),
    makeTopic({
        id: "tax-withholding-transfer-and-incentive-regimes",
        title: "Tax: Withholding, Transfer Taxes, Treaty Handling, and Incentive Regimes",
        shortTitle: "Tax Special Topics",
        category: "Taxation",
        summary:
            "Review withholding taxes, documentary stamp tax, excise, estate and donor's tax, local taxation, treaty handling, and incentive-regime logic carefully and professionally.",
        intro:
            "These tax topics are classification-heavy. The issue is often not a formula first, but the legal base, triggering event, jurisdiction, or incentive status behind the case.",
        focus: "special-tax classification, compliance framing, and legal-vs-accounting distinction",
        workedScenario:
            "A case asks whether a transaction falls under withholding, local taxation overlap, or an incentive-regime exception.",
        workedResult:
            "The strongest answer starts with tax type, legal basis, and compliance consequence before moving into any tax base or rate discussion.",
        checkpointScenario:
            "A student treats all tax reduction planning as automatically improper or, in the other direction, treats any aggressive arrangement as valid planning.",
        checkpointResult:
            "Tax analysis becomes more reliable when legal compliance, ethical planning, and evasion are kept distinct.",
        keywords: ["withholding tax", "dst", "estate tax", "donor's tax", "tax treaty", "peza", "boi"],
        scanSignals: ["withholding", "documentary stamp", "estate tax", "donor's tax", "tax treaty", "peza"],
        relatedCalculatorPaths: ["/tax/tax-compliance-review", "/tax/book-tax-difference-workspace"],
        relatedTopicIds: ["tax-book-tax-vat-and-compliance", "governance-risk-ethics-and-internal-control"],
    }),
    makeTopic({
        id: "audit-transaction-cycles-and-cis",
        title: "Audit: Transaction Cycles, CIS Environment, and CAATs",
        shortTitle: "Audit Cycles and CIS",
        category: "Audit & Assurance",
        summary:
            "Study revenue, expenditure, conversion, and financing cycles together with CIS environments, general versus application controls, and CAATs support.",
        intro:
            "Audit cycle cases become clearer when assertions, controls, IT environment, and procedure choice are treated as one chain rather than separate memorized lists.",
        focus: "cycle assertions, IT-control context, and audit response selection",
        workedScenario:
            "A revenue-cycle case includes weak application controls and asks for likely audit procedures and evidence consequences.",
        workedResult:
            "The strongest answer identifies the cycle assertion first, then connects the CIS weakness to the audit response.",
        checkpointScenario:
            "A student lists CAATs as if they automatically solve weak controls without explaining the audit objective.",
        checkpointResult:
            "Audit technology tools only strengthen the answer when they are matched to the assertion and risk being tested.",
        keywords: ["audit cycle", "revenue cycle", "cais", "caats", "application controls"],
        scanSignals: ["revenue cycle", "expenditure cycle", "application controls", "caats", "cis environment"],
        relatedCalculatorPaths: ["/audit/audit-cycle-reviewer", "/ais/it-control-matrix"],
        relatedTopicIds: ["audit-planning-evidence-and-reporting", "ais-it-governance-and-controls"],
    }),
    makeTopic({
        id: "audit-completion-modified-reports-and-kams",
        title: "Audit: Completion Procedures, Modified Reports, and Key Audit Matters",
        shortTitle: "Audit Completion",
        category: "Audit & Assurance",
        summary:
            "Review completion procedures, subsequent events, going concern, representation letters, report formulation, modified opinions, and key audit matters as one closing workflow.",
        intro:
            "The closing stage of an audit is easier when students stop seeing each issue as isolated. Going concern, subsequent events, and reporting are part of the same final judgment flow.",
        focus: "completion judgment, reporting consequence, and opinion formulation",
        workedScenario:
            "A case presents late events, going-concern pressure, and a possible scope limitation near report date.",
        workedResult:
            "A strong answer distinguishes the nature of the issue first, then explains the reporting consequence and whether KAM or modification is involved.",
        checkpointScenario:
            "A student treats every serious matter as a modified opinion and every KAM as if it changes the opinion.",
        checkpointResult:
            "Completion answers improve when reporting categories are separated carefully before the final conclusion is stated.",
        keywords: ["modified report", "going concern", "subsequent events", "key audit matters"],
        scanSignals: ["going concern", "subsequent event", "modified opinion", "key audit matter"],
        relatedCalculatorPaths: ["/audit/audit-completion-and-opinion", "/audit/audit-planning-workspace"],
        relatedTopicIds: ["audit-transaction-cycles-and-cis", "integrative-review-and-case-mapping"],
    }),
    makeTopic({
        id: "rfbt-sales-credit-security-and-securities",
        title: "RFBT: Sales, Credit Transactions, Security, and Securities Regulation",
        shortTitle: "RFBT Commercial Law",
        category: "RFBT / Business Law",
        summary:
            "Review sales and credit transactions, contracts of security, securities law, insider trading, fraud, and market manipulation in one business-law lesson.",
        intro:
            "Commercial-law questions become stronger when the transaction type is classified first and the legal consequence is stated clearly afterward.",
        focus: "commercial-transaction issue spotting and regulatory consequence",
        workedScenario:
            "A case asks whether a transaction created enforceable rights, whether security exists, and whether a market-conduct rule was breached.",
        workedResult:
            "The strongest answer names the transaction or rule first, then explains the consequence instead of retelling the facts.",
        checkpointScenario:
            "A student describes what happened but never states the controlling commercial-law issue.",
        checkpointResult:
            "RFBT answers need issue, rule, application, and consequence structure to stay convincing.",
        keywords: ["sales law", "credit transactions", "security", "insider trading", "securities regulation"],
        scanSignals: ["security agreement", "insider trading", "fraud", "manipulation", "sales transaction"],
        relatedCalculatorPaths: ["/rfbt/commercial-transactions-reviewer", "/rfbt/business-law-review"],
        relatedTopicIds: ["rfbt-obligations-contracts-and-corporation-law", "governance-risk-ethics-and-internal-control"],
    }),
    makeTopic({
        id: "ais-bcp-erp-and-service-management",
        title: "AIS: Continuity, ERP, Service Management, and Disaster Recovery",
        shortTitle: "AIS Continuity",
        category: "AIS / IT Controls",
        summary:
            "Study business continuity, disaster recovery, ERP, supply chain modules, CRM, incident management, and capacity planning with an AIS and control perspective.",
        intro:
            "AIS questions are easier when the student separates platform role, continuity responsibility, and control consequence instead of treating the system as one vague black box.",
        focus: "system role, continuity planning, and control consequence",
        workedScenario:
            "An ERP-driven environment has weak backup testing, high system dependence, and unclear incident management escalation.",
        workedResult:
            "The best answer identifies the operational role of the system first, then explains why continuity and control issues matter for reporting and audit.",
        checkpointScenario:
            "A student describes disaster recovery as if it already covers full business continuity planning.",
        checkpointResult:
            "AIS answers improve when continuity, recovery, governance, and daily service management are separated clearly.",
        keywords: ["business continuity", "disaster recovery", "erp", "crm", "incident management"],
        scanSignals: ["disaster recovery", "erp", "incident management", "capacity planning", "continuity"],
        relatedCalculatorPaths: ["/ais/ais-lifecycle-and-recovery", "/ais/it-control-matrix"],
        relatedTopicIds: ["ais-it-governance-and-controls", "audit-transaction-cycles-and-cis"],
    }),
    makeTopic({
        id: "strategic-business-analysis-and-cost-management",
        title: "Strategic Business Analysis, Strategic Cost Management, and Integrative Framing",
        shortTitle: "Strategic Analysis",
        category: "Strategic / Integrative",
        summary:
            "Use a strategic lens for industry and competition analysis, strategic cost management, consultancy-style advice, and research-method framing for integrative accounting cases.",
        intro:
            "Integrative cases become more useful when students can explain the business problem first, then show how accounting, operations, governance, and tax issues fit the strategic picture.",
        focus: "strategic framing, cost-management diagnosis, and integrative decision support",
        workedScenario:
            "A company faces margin pressure, operational bottlenecks, and control concerns while the case asks for an advisory recommendation.",
        workedResult:
            "The strongest answer identifies the strategic problem, links it to the cost and control drivers, and then recommends a defensible next step.",
        checkpointScenario:
            "A student gives a ratio-heavy answer but never states the competitive or operating issue behind the numbers.",
        checkpointResult:
            "Strategic topics get stronger when the numeric evidence is turned into a business conclusion and recommendation.",
        keywords: ["strategic business analysis", "strategic cost management", "consultancy", "industry analysis"],
        scanSignals: ["industry analysis", "competitive pressure", "strategic cost management", "consultancy"],
        relatedCalculatorPaths: ["/strategic/strategic-business-analysis", "/strategic/integrative-case-mapper", "/business/roi-ri-eva"],
        relatedTopicIds: ["integrative-review-and-case-mapping", "operations-forecasting-inventory-and-quality"],
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
    makeTopic({
        id: "far-framework-accounting-cycle-and-profession",
        title: "FAR Foundations: Conceptual Framework, Accounting Cycle, and the Profession",
        shortTitle: "FAR Foundations",
        category: "Financial Accounting",
        summary:
            "Review the conceptual framework, the accounting cycle, and the Philippine accountancy-profession setting before moving into specialized FAR calculations.",
        intro:
            "Many FAR mistakes start before the numbers. Students often confuse recognition, measurement, presentation, and the accounting-cycle sequence because the framework was never made explicit.",
        focus: "recognition logic, accounting-cycle order, and professional reporting context",
        workedScenario:
            "A case asks whether an item should be recognized now, adjusted later, or only disclosed in the notes, while the student also needs to identify the step in the accounting cycle.",
        workedResult:
            "The strongest answer explains the framework issue first, then places the item in the correct cycle step and reporting consequence.",
        checkpointScenario:
            "A student treats every uncertainty like an automatic journal entry even when note disclosure or later adjustment is more appropriate.",
        checkpointResult:
            "Framework-first thinking improves both route choice and final FAR explanations.",
        keywords: ["conceptual framework", "accounting cycle", "philippine accountancy profession", "recognition"],
        scanSignals: ["recognition", "measurement", "disclosure", "adjusting entry", "closing entry"],
        relatedCalculatorPaths: ["/accounting/adjusting-entries-workspace", "/accounting/trial-balance-checker"],
        relatedTopicIds: ["far-equity-dividends-and-retained-earnings"],
    }),
    makeTopic({
        id: "far-equity-dividends-and-retained-earnings",
        title: "FAR: Equity Changes, Dividends, and Retained Earnings",
        shortTitle: "Equity Changes",
        category: "Financial Accounting",
        summary:
            "Study retained earnings, dividends, prior-period adjustments, and statement-of-changes-in-equity logic before relying on the rollforward calculator.",
        intro:
            "Equity questions are easier when students stop treating retained earnings as just a plug figure and instead read how income, distributions, and corrections change the balance.",
        focus: "retained-earnings rollforward and equity-change interpretation",
        workedScenario:
            "A problem gives beginning retained earnings, current net income, dividends, and an error correction that must be reflected in ending equity.",
        workedResult:
            "The best answer shows the rollforward cleanly and explains why some changes go through profit while others go directly to equity.",
        checkpointScenario:
            "A student subtracts dividends from net income first and forgets to reconcile the actual beginning and ending retained earnings balances.",
        checkpointResult:
            "Equity answers improve when the rollforward is read as a movement schedule, not just one formula line.",
        keywords: ["retained earnings", "dividends", "equity", "statement of changes in equity"],
        scanSignals: ["retained earnings", "dividends declared", "prior period adjustment", "equity"],
        relatedCalculatorPaths: ["/far/retained-earnings-rollforward", "/accounting/earnings-per-share"],
        relatedTopicIds: ["far-framework-accounting-cycle-and-profession"],
    }),
    makeTopic({
        id: "capital-budgeting-arr-eaa-and-ranking",
        title: "Capital Budgeting: ARR, EAA, and Project Ranking",
        shortTitle: "Capital Budgeting Depth",
        category: "Business Math / Finance",
        summary:
            "Study how ARR and EAA fit beside NPV, IRR, PI, and payback when classwork asks for ranking or interpretation across different project lives.",
        intro:
            "Students often memorize separate capital-budgeting formulas without understanding why ARR, NPV, and EAA can point to different recommendations.",
        focus: "ranking logic, unequal project lives, and accounting-versus-cash-flow measures",
        workedScenario:
            "Two projects have different useful lives and the instructor asks for both a discounted recommendation and an annualized comparison.",
        workedResult:
            "The strongest answer explains when EAA helps, why ARR is accounting-based, and which measure should control the decision.",
        checkpointScenario:
            "A student compares NPVs directly across unequal project lives without checking whether an annualized comparison is more appropriate.",
        checkpointResult:
            "Capital-budgeting interpretation gets stronger when the student can explain why the chosen ranking method fits the case.",
        keywords: ["capital budgeting", "arr", "eaa", "project ranking", "unequal lives"],
        scanSignals: ["arr", "equivalent annual annuity", "unequal project lives", "project ranking"],
        relatedCalculatorPaths: ["/finance/accounting-rate-of-return", "/finance/equivalent-annual-annuity", "/finance/capital-budgeting-comparison"],
        relatedTopicIds: ["strategic-business-analysis-and-cost-management"],
    }),
    makeTopic({
        id: "forecasting-afn-and-growth-financing",
        title: "Forecasting Growth: AFN, Retention, and Short-Term Financing Pressure",
        shortTitle: "AFN Forecasting",
        category: "Managerial & Cost Accounting",
        summary:
            "Study additional funds needed, spontaneous liability support, retained earnings support, and forecast-driven financing pressure.",
        intro:
            "AFN questions become easier when students separate asset support, spontaneous liabilities, and internally generated financing before solving for the outside gap.",
        focus: "sales growth support and financing-gap interpretation",
        workedScenario:
            "A sales forecast rises sharply and the student must explain how much support comes from working liabilities and retained earnings before asking for outside financing.",
        workedResult:
            "The strongest answer explains not only the AFN amount, but also which part of the growth plan is creating the financing pressure.",
        checkpointScenario:
            "A student treats every increase in sales as if it requires equal outside financing even when retention and spontaneous liabilities already cover part of the need.",
        checkpointResult:
            "Forecasting answers improve when the financing gap is decomposed rather than treated as one blind percentage.",
        keywords: ["afn", "additional funds needed", "forecasting", "retention ratio"],
        scanSignals: ["additional funds needed", "afn", "retention ratio", "projected sales"],
        relatedCalculatorPaths: ["/business/additional-funds-needed", "/accounting/working-capital-planner"],
        relatedTopicIds: ["strategic-business-analysis-and-cost-management"],
    }),
    makeTopic({
        id: "tax-business-regimes-and-percentage-tax",
        title: "Tax: Business Tax Regimes, VAT vs Percentage Tax, and Compliance Framing",
        shortTitle: "Business Tax Regimes",
        category: "Taxation",
        summary:
            "Review when business-tax cases belong to VAT, percentage tax, or broader compliance analysis before computing the amount due.",
        intro:
            "Business-tax errors often come from choosing the wrong regime first. Students need to classify the tax base and applicable system before pressing any calculator.",
        focus: "business-tax classification, tax base, and compliance framing",
        workedScenario:
            "A business-tax case gives gross sales and asks whether the answer belongs under percentage tax or a different tax regime.",
        workedResult:
            "The best answer identifies the tax regime first, then computes the due amount only after the correct base and rate are confirmed.",
        checkpointScenario:
            "A student computes percentage tax immediately without checking whether the facts actually describe a VAT case.",
        checkpointResult:
            "Tax answers become more accurate when regime classification happens before arithmetic.",
        keywords: ["percentage tax", "vat", "business taxation", "tax regime"],
        scanSignals: ["percentage tax", "gross receipts", "vat", "business tax"],
        relatedCalculatorPaths: ["/tax/percentage-tax", "/tax/tax-compliance-review", "/accounting/philippine-vat"],
        relatedTopicIds: ["tax-book-tax-vat-and-compliance"],
    }),
    makeTopic({
        id: "managerial-budget-flow-production-inventory-and-operating-expense",
        title: "Managerial Budget Flow: Production, Inventory, Materials, and Operating Expenses",
        shortTitle: "Budget Flow",
        category: "Managerial & Cost Accounting",
        summary:
            "Review how the sales budget flows into production, inventory, materials, operating-expense, and cash-planning support instead of memorizing each schedule in isolation.",
        intro:
            "Budget questions get easier when the schedules are treated as a chain. Sales drives production, production drives materials, inventory policy changes purchases, and the expense schedule must still be split into total versus cash impact.",
        focus: "budget-sequence logic and the difference between accounting totals and cash effects",
        workedScenario:
            "A problem gives sales expectations, finished-goods policy, beginning inventory, variable selling-expense rate, and non-cash depreciation, then asks which schedules come next and what the cash effect will be.",
        workedResult:
            "The strongest answer explains the sequence first, then computes only the schedule that fits the next budget step instead of mixing all formulas together.",
        checkpointScenario:
            "A student moves directly from sales to cash budget without preparing the inventory, materials, or operating-expense support schedules needed by the case.",
        checkpointResult:
            "Budget answers become more reliable when schedule order is respected and cash-only effects are separated from total expense.",
        keywords: ["budget flow", "production budget", "inventory budget", "operating expense budget", "cash budget"],
        scanSignals: ["production budget", "inventory budget", "operating expenses", "cash budget", "merchandise purchases"],
        relatedCalculatorPaths: [
            "/business/sales-budget",
            "/business/production-budget",
            "/business/direct-materials-purchases-budget",
            "/business/inventory-budget",
            "/business/operating-expense-budget",
            "/business/cash-budget",
        ],
        relatedTopicIds: ["forecasting-afn-and-growth-financing", "operations-forecasting-inventory-and-quality"],
    }),
    makeTopic({
        id: "tax-vat-output-input-and-remittance-logic",
        title: "Tax: VAT Output, Input, and Period Reconciliation",
        shortTitle: "VAT Reconciliation",
        category: "Taxation",
        summary:
            "Review output VAT, input VAT, VATable classification, and the net-remittance position without treating VAT as a one-step multiplication only.",
        intro:
            "VAT questions often become unreliable when classification is skipped, so this reviewer path keeps legal treatment, tax base, and period matching visible before computation.",
        focus: "output VAT, input VAT, classification, and the net-remittance position",
        workedScenario:
            "A case gives taxable sales, VATable purchases, and asks whether the period shows VAT payable or excess input VAT.",
        workedResult:
            "The strongest answer computes output and input VAT separately, then explains whether the resulting position is payable, balanced, or excess-input in nature.",
        checkpointScenario:
            "A student multiplies everything by the VAT rate without first deciding whether all amounts are actually VATable.",
        checkpointResult:
            "A correct VAT answer still depends on classification and period matching, not arithmetic alone.",
        keywords: ["vat", "output vat", "input vat", "vat payable", "vat reconciliation"],
        scanSignals: ["output vat", "input vat", "vat payable", "vatable sales", "vatable purchases"],
        relatedCalculatorPaths: ["/tax/vat-reconciliation", "/tax/percentage-tax", "/tax/tax-compliance-review"],
        relatedTopicIds: ["tax-book-tax-vat-and-compliance", "tax-withholding-transfer-and-incentive-regimes"],
    }),
    makeTopic({
        id: "afar-intercompany-inventory-and-profit-elimination",
        title: "AFAR: Intercompany Inventory and Unrealized Profit Elimination",
        shortTitle: "Intercompany Inventory",
        category: "AFAR / Consolidation",
        summary:
            "Review markup basis, unsold inventory, and consolidation elimination logic for intercompany inventory-profit cases.",
        intro:
            "These AFAR problems become much safer when students separate transfer profit, markup basis, and the still-unsold portion before attempting elimination entries.",
        focus: "markup basis, unrealized profit, and consolidation elimination support",
        workedScenario:
            "A parent transfers goods to a subsidiary at a markup, some inventory remains unsold at year-end, and the case asks for the unrealized profit requiring elimination.",
        workedResult:
            "The strongest answer isolates the internal profit first, then limits the elimination to the portion still embedded in ending inventory from the group perspective.",
        checkpointScenario:
            "A student eliminates the full transfer profit even though only part of the inventory remains unsold to outsiders.",
        checkpointResult:
            "AFAR elimination is stronger when the unrealized portion is identified precisely instead of assuming all transfer profit stays unrealized.",
        keywords: ["intercompany inventory", "unrealized profit", "consolidation elimination", "markup on cost"],
        scanSignals: ["intercompany transfer", "unsold inventory", "markup on cost", "unrealized profit"],
        relatedCalculatorPaths: ["/afar/intercompany-inventory-profit", "/afar/business-combination-analysis"],
        relatedTopicIds: ["afar-business-combinations-and-consolidation", "integrative-review-and-case-mapping"],
    }),
    makeTopic({
        id: "far-equity-rollforward-and-statement-of-changes-in-equity",
        title: "FAR: Equity Rollforward and Statement of Changes in Equity",
        shortTitle: "Equity Rollforward",
        category: "Financial Accounting",
        summary:
            "Study share capital, APIC, retained earnings, OCI, treasury shares, and the statement-of-changes-in-equity format as one coherent FAR reporting topic.",
        intro:
            "Equity questions become more reliable when each component is rolled forward separately instead of collapsing everything into one retained-earnings shortcut.",
        focus: "equity components, rollforward logic, and statement preparation",
        workedScenario:
            "A reporting case gives beginning equity balances, current income, OCI, dividends, share issuances, and treasury-share activity, then asks for ending equity presentation.",
        workedResult:
            "The strongest answer preserves each component's movement and shows how total equity changes without losing the role of treasury shares as a deduction.",
        checkpointScenario:
            "A student adds treasury shares to equity instead of treating them as a contra-equity balance.",
        checkpointResult:
            "Statement reliability improves when students distinguish positive equity components from deduction balances and disclose each movement clearly.",
        keywords: ["statement of changes in equity", "retained earnings", "apic", "treasury shares", "oci"],
        scanSignals: ["statement of changes in equity", "share capital", "retained earnings", "treasury shares", "oci"],
        relatedCalculatorPaths: [
            "/far/statement-of-changes-in-equity-builder",
            "/far/retained-earnings-rollforward",
            "/far/cash-flow-statement-builder",
        ],
        relatedTopicIds: ["far-financial-statements-and-disclosure", "integrative-review-and-case-mapping"],
    }),
    makeTopic({
        id: "far-cash-control-petty-cash-and-adjustments",
        title: "FAR: Cash Control, Petty Cash, and Adjusting-Entry Discipline",
        shortTitle: "Cash Control and Adjustments",
        category: "Financial Accounting",
        summary:
            "Study petty cash, bank reconciliation, and common adjusting-entry logic as one control-and-period-end reviewer path.",
        intro:
            "Students often know the journal entry but miss the control purpose. Cash control and period-end adjustments are stronger when you ask what was counted, what remains, what was earned or incurred, and what still belongs to the next period.",
        focus: "cash accountability, accrual-versus-deferral logic, and period-end reliability",
        workedScenario:
            "A case mixes a petty cash count, a prepaid balance, and an accrued salary item while asking which period-end adjustments are still needed.",
        workedResult:
            "The best answer separates the control issue from the timing issue, then matches each amount to the proper reconciliation or adjusting-entry tool.",
        checkpointScenario:
            "A student treats every uncovered difference as if it were the same type of adjusting entry.",
        checkpointResult:
            "Reliable FAR answers classify the difference first: reconciliation shortage or overage, deferral adjustment, or accrual adjustment.",
        keywords: ["petty cash", "bank reconciliation", "adjusting entries", "accrual", "deferral"],
        scanSignals: ["petty cash", "replenishment", "prepaid", "unearned", "accrued expense"],
        relatedCalculatorPaths: [
            "/accounting/petty-cash-reconciliation",
            "/accounting/bank-reconciliation",
            "/accounting/prepaid-expense-adjustment",
            "/accounting/unearned-revenue-adjustment",
            "/accounting/accrued-revenue-adjustment",
            "/accounting/accrued-expense-adjustment",
        ],
        relatedTopicIds: ["far-framework-accounting-cycle-and-profession"],
    }),
    makeTopic({
        id: "managerial-master-budget-completion",
        title: "Managerial: Master Budget Completion from Labor to Income Statement",
        shortTitle: "Master Budget Completion",
        category: "Managerial & Cost Accounting",
        summary:
            "Connect direct labor, factory overhead, and the budgeted income statement so the master-budget flow feels continuous instead of fragmented.",
        intro:
            "Students often learn the master budget as separate schedules. This topic shows how the later schedules connect and why the statement-level result depends on them.",
        focus: "direct labor, overhead, and budgeted income-statement completion",
        workedScenario:
            "A company already prepared sales, production, and direct-materials schedules and now needs labor, overhead, and a budgeted income statement.",
        workedResult:
            "The best answer shows how later schedules reuse earlier volume assumptions before ending in a statement-level projected profit.",
        checkpointScenario:
            "A student computes labor and overhead correctly but treats the budgeted income statement as a disconnected final page.",
        checkpointResult:
            "The budget is stronger when every later schedule is traced back to the production and sales assumptions that created it.",
        keywords: ["master budget", "direct labor budget", "factory overhead budget", "budgeted income statement"],
        scanSignals: ["direct labor hours per unit", "manufacturing overhead budget", "pro forma income statement"],
        relatedCalculatorPaths: ["/business/direct-labor-budget", "/business/factory-overhead-budget", "/business/budgeted-income-statement"],
        relatedTopicIds: ["managerial-budget-flow-production-inventory-materials-and-operating-expenses"],
    }),
    makeTopic({
        id: "far-notes-receivable-and-discounting",
        title: "FAR: Notes Receivable, Maturity Value, and Discounting",
        shortTitle: "Notes and Discounting",
        category: "Financial Accounting",
        summary:
            "Review note interest, maturity value, and bank discounting as one receivables-and-cash topic.",
        intro:
            "Discounting cases are easier when note interest and bank discount are treated as different steps instead of one compressed formula.",
        focus: "note interest, maturity value, and proceeds from discounting",
        workedScenario:
            "A company holds a note receivable, discounts it at a bank before maturity, and needs the maturity value and cash proceeds.",
        workedResult:
            "The clean answer separates note interest from bank discount and explains why proceeds are lower than maturity value.",
        checkpointScenario:
            "A student applies the bank discount directly to face value and skips the maturity-value step.",
        checkpointResult:
            "Strong notes-receivable answers keep the note's own interest separate from the bank's discount charge.",
        keywords: ["notes receivable", "discounted note", "bank discount", "maturity value"],
        scanSignals: ["promissory note", "bank discount", "proceeds from discounting"],
        relatedCalculatorPaths: ["/accounting/notes-interest", "/accounting/notes-receivable-discounting"],
        relatedTopicIds: ["far-framework-accounting-cycle-and-profession", "far-cash-control-petty-cash-and-adjustments"],
    }),
    makeTopic({
        id: "afar-equity-method-and-associate-investments",
        title: "AFAR: Equity Method and Associate Investment Rollforwards",
        shortTitle: "Equity Method",
        category: "AFAR / Consolidation",
        summary:
            "Understand why share in income increases the investment and dividends reduce it under the equity method.",
        intro:
            "Associate-investment cases become more manageable when the carrying-amount rollforward is seen as the core logic before later AFAR complications are added.",
        focus: "equity-method investment rollforward and associate accounting",
        workedScenario:
            "An investor owns significant influence in an investee and must compute its share in income, dividends, and ending investment balance.",
        workedResult:
            "The best answer treats the investment account as a rollforward rather than a simple dividend-income question.",
        checkpointScenario:
            "A student records dividends as revenue and leaves the investment carrying amount unchanged.",
        checkpointResult:
            "The equity method is clearer when dividends are treated as a reduction of the investment balance rather than a fresh revenue line.",
        keywords: ["equity method", "associate", "share in income", "dividends"],
        scanSignals: ["investment in associate", "share in income", "significant influence"],
        relatedCalculatorPaths: ["/afar/equity-method-investment", "/afar/business-combination-analysis"],
        relatedTopicIds: ["afar-business-combinations-and-consolidation"],
    }),
    makeTopic({
        id: "afar-intercompany-ppe-transfer-eliminations",
        title: "AFAR: Intercompany PPE Transfers and Excess Depreciation",
        shortTitle: "PPE Transfer Elimination",
        category: "AFAR / Consolidation",
        summary:
            "Review unrealized gain reversal and excess-depreciation adjustments on transferred PPE.",
        intro:
            "Inventory elimination is not the only intercompany-profit topic. PPE transfers add a multi-period depreciation effect that students need to track carefully.",
        focus: "intercompany PPE transfer gain elimination and excess depreciation",
        workedScenario:
            "A parent transfers equipment to a subsidiary above carrying amount and the case asks for the remaining unrealized gain after one year.",
        workedResult:
            "A strong answer reverses the unrealized gain and then measures how much of that gain has been realized through excess depreciation.",
        checkpointScenario:
            "A student eliminates the full transfer gain every year and never updates the remaining balance.",
        checkpointResult:
            "Later-period AFAR answers are stronger when excess depreciation is recognized as the mechanism that gradually releases intercompany profit.",
        keywords: ["intercompany ppe", "excess depreciation", "equipment transfer", "unamortized gain"],
        scanSignals: ["excess depreciation", "remaining useful life", "intercompany equipment transfer"],
        relatedCalculatorPaths: ["/afar/intercompany-ppe-transfer", "/afar/intercompany-inventory-profit"],
        relatedTopicIds: ["afar-intercompany-inventory-and-profit-elimination", "afar-business-combinations-and-consolidation"],
    }),
    makeTopic({
        id: "managerial-relevant-costing-short-term-decisions",
        title: "Managerial: Relevant Costing for Special Orders, Make-or-Buy, and Process-Further Decisions",
        shortTitle: "Relevant Costing Decisions",
        category: "Managerial & Cost Accounting",
        summary:
            "Study how incremental revenue, avoidable cost, and separable cost drive short-term managerial decisions.",
        intro:
            "Short-term decision problems become much safer when the answer starts by separating relevant from irrelevant costs before any arithmetic begins.",
        focus: "incremental revenue, avoidable cost, and short-term decision logic",
        workedScenario:
            "A company can accept a special order, outsource production, or process a joint product further and the case asks which choice adds profit.",
        workedResult:
            "The strongest answer identifies the revenue and cost items that actually change, computes the incremental effect, and then states the decision cleanly.",
        checkpointScenario:
            "A student includes sunk joint cost or unavoidable fixed overhead in a process-further or make-or-buy comparison.",
        checkpointResult:
            "Decision quality improves when sunk and unchanged costs are removed before the alternatives are compared.",
        keywords: ["relevant costing", "special order", "make or buy", "sell or process further"],
        scanSignals: ["special order", "avoidable fixed costs", "split-off", "separable processing cost"],
        relatedCalculatorPaths: [
            "/business/special-order-analysis",
            "/business/make-or-buy-analysis",
            "/business/sell-or-process-further",
        ],
        relatedTopicIds: ["managerial-master-budget-completion", "strategic-business-analysis-and-cost-management"],
    }),
    makeTopic({
        id: "management-services-product-mix-and-bottlenecks",
        title: "Management Services: Product Mix, Bottlenecks, and Constraint-Based Ranking",
        shortTitle: "Product Mix and Bottlenecks",
        category: "Managerial & Cost Accounting",
        summary:
            "Review contribution margin per scarce-resource unit, bottleneck ranking, and short capacity-allocation logic.",
        intro:
            "Bottleneck problems are easier when students stop ranking by unit contribution alone and shift to contribution per scarce-resource unit.",
        focus: "constraint-based ranking and bottleneck-aware output decisions",
        workedScenario:
            "A factory has limited machine hours and must decide which product deserves the constrained resource first.",
        workedResult:
            "The best answer converts unit contribution into contribution per machine hour or other scarce input before recommending output priority.",
        checkpointScenario:
            "A student chooses the product with the highest unit margin even though it consumes more of the bottleneck resource.",
        checkpointResult:
            "Management-services answers improve when the bottleneck becomes the core ranking lens instead of a side note.",
        keywords: ["product mix", "bottleneck", "constraint analysis", "management services"],
        scanSignals: ["machine hours per unit", "scarce resource", "product mix", "bottleneck"],
        relatedCalculatorPaths: ["/business/constrained-resource-product-mix", "/business/cvp-analysis"],
        relatedTopicIds: ["managerial-relevant-costing-short-term-decisions"],
    }),
    makeTopic({
        id: "managerial-performance-reports-and-budget-variance",
        title: "Managerial: Performance Reports, Flexible Budgets, and Budget Variance Reading",
        shortTitle: "Performance Reports",
        category: "Managerial & Cost Accounting",
        summary:
            "Study spending variance, activity variance, and total plan variance so performance reports are easier to explain.",
        intro:
            "Performance-report questions get cleaner when students know which comparison belongs to actual-versus-flexible and which belongs to flexible-versus-static.",
        focus: "flexible-budget benchmarking and performance-report interpretation",
        workedScenario:
            "A manager compares actual cost against flexible and static budget amounts and must explain what part of the gap is execution versus activity change.",
        workedResult:
            "The best answer separates spending variance, activity variance, and the total variance from plan before drawing conclusions.",
        checkpointScenario:
            "A student mixes the flexible and static benchmarks and labels the same gap twice.",
        checkpointResult:
            "Variance interpretation is stronger when each benchmark comparison has a clear purpose.",
        keywords: ["budget variance", "performance report", "flexible budget", "activity variance"],
        scanSignals: ["spending variance", "activity variance", "performance report", "static budget"],
        relatedCalculatorPaths: ["/business/budget-variance-analysis", "/business/flexible-budget"],
        relatedTopicIds: ["managerial-master-budget-completion"],
    }),
    makeTopic({
        id: "operations-forecasting-moving-averages-and-replenishment",
        title: "Operations: Moving-Average Forecasting and Replenishment Planning",
        shortTitle: "Forecasting and Replenishment",
        category: "Operations / Supply Chain",
        summary:
            "Connect moving-average forecasting with EOQ, reorder points, and replenishment timing decisions.",
        intro:
            "Replenishment decisions become more realistic when the demand estimate behind the order policy is visible and easy to defend.",
        focus: "short-term demand forecasting and its connection to replenishment policy",
        workedScenario:
            "A business needs a short-term demand forecast before setting a new reorder trigger and reviewing safety-stock logic.",
        workedResult:
            "The strongest answer explains why a weighted forecast may fit the current demand pattern better than an equal-weight average, then links the forecast to replenishment planning.",
        checkpointScenario:
            "A student changes the forecast weights arbitrarily without explaining why the recent periods should matter more.",
        checkpointResult:
            "Operations analysis is stronger when the weighting logic is explicit rather than decorative.",
        keywords: ["moving average", "forecasting", "reorder point", "replenishment"],
        scanSignals: ["weighted moving average", "forecast next period", "demand planning", "lead time"],
        relatedCalculatorPaths: ["/operations/moving-average-forecast", "/operations/eoq-and-reorder-point"],
        relatedTopicIds: ["operations-forecasting-inventory-and-quality"],
    }),
    makeTopic({
        id: "managerial-sales-variances-and-performance-interpretation",
        title: "Managerial: Sales Volume, Sales Mix, and Performance Interpretation",
        shortTitle: "Sales Variances",
        category: "Managerial & Cost Accounting",
        summary:
            "Review sales-volume and sales-mix variance logic so contribution-based performance reading stays consistent with the master budget.",
        intro:
            "Sales-variance cases are easier when students separate the effect of total units sold from the effect of selling a different product mix.",
        focus: "volume-versus-mix interpretation using budgeted contribution margin logic",
        workedScenario:
            "A company misses its unit target overall but shifts toward a higher-contribution product within the actual sales mix.",
        workedResult:
            "The strongest answer explains why sales-volume and sales-mix variance can move in different directions even in the same case.",
        checkpointScenario:
            "A student treats sales volume variance and sales mix variance as the same signal.",
        checkpointResult:
            "Variance reading improves when unit-volume changes are isolated from the composition of the actual mix.",
        keywords: ["sales volume variance", "sales mix variance", "performance report", "contribution margin"],
        scanSignals: ["sales volume variance", "sales mix variance", "budgeted contribution margin", "actual mix"],
        relatedCalculatorPaths: [
            "/business/sales-volume-variance",
            "/business/sales-mix-variance",
            "/business/budget-variance-analysis",
        ],
        relatedTopicIds: ["managerial-performance-reports-and-budget-variance"],
    }),
    makeTopic({
        id: "operations-safety-stock-reorder-and-buffer-policy",
        title: "Operations: Safety Stock, Reorder Points, and Buffer Policy",
        shortTitle: "Safety Stock",
        category: "Operations / Supply Chain",
        summary:
            "Study how variability in usage and lead time drives safety stock and reorder-point design.",
        intro:
            "Inventory-buffer cases become easier when students treat safety stock as protection against uncertainty instead of a random extra quantity.",
        focus: "inventory protection policy and reorder timing",
        workedScenario:
            "A company has average and maximum daily usage plus average and maximum lead time and must set a defensible reorder point.",
        workedResult:
            "The strongest answer separates expected demand during lead time from the extra safety stock buffer needed for worse-than-average conditions.",
        checkpointScenario:
            "A student uses only average demand and ignores the whole point of the buffer calculation.",
        checkpointResult:
            "Replenishment planning improves when average and worst-case conditions are both visible in the final recommendation.",
        keywords: ["safety stock", "reorder point", "buffer stock", "lead time"],
        scanSignals: ["safety stock", "buffer stock", "lead time", "reorder point"],
        relatedCalculatorPaths: [
            "/operations/safety-stock-planner",
            "/operations/eoq-and-reorder-point",
            "/operations/moving-average-forecast",
        ],
        relatedTopicIds: ["operations-forecasting-moving-averages-and-replenishment"],
    }),
    makeTopic({
        id: "managerial-transfer-pricing-and-divisional-performance",
        title: "Managerial: Transfer Pricing and Divisional Performance",
        shortTitle: "Transfer Pricing",
        category: "Managerial & Cost Accounting",
        summary:
            "Review minimum transfer price, opportunity cost, and market-based negotiation ranges for divisional transfer-pricing cases.",
        intro:
            "Transfer-pricing cases become easier when the selling division's minimum and the outside-market ceiling are separated before anyone argues about the final negotiated price.",
        focus: "minimum transfer price, outside benchmark, and negotiation-range reading",
        workedScenario:
            "A division can either sell externally or transfer internally, and management needs to know whether an internal price band still exists.",
        workedResult:
            "The strongest answer starts with variable cost plus any real opportunity cost, then compares that minimum with the external market benchmark.",
        checkpointScenario:
            "A student treats variable cost alone as the answer even though internal transfer would sacrifice an outside sale.",
        checkpointResult:
            "Divisional analysis improves when opportunity cost is treated as part of the selling division's minimum acceptable transfer price.",
        keywords: ["transfer pricing", "minimum transfer price", "opportunity cost", "market based ceiling"],
        scanSignals: ["transfer pricing", "minimum transfer price", "outside market price", "opportunity cost"],
        relatedCalculatorPaths: [
            "/business/transfer-pricing-support",
            "/business/make-or-buy-analysis",
            "/business/constrained-resource-product-mix",
        ],
        relatedTopicIds: ["managerial-performance-reports-and-budget-variance"],
    }),
    makeTopic({
        id: "far-dividends-equity-priority-and-common-share-distributions",
        title: "FAR: Dividends, Preferred Priority, and Common Share Distributions",
        shortTitle: "Dividend Priority",
        category: "Financial Accounting",
        summary:
            "Review preferred dividend requirements, cumulative arrears, and common-share allocation before building equity statements.",
        intro:
            "Dividend-allocation problems become easier when preferred requirements are satisfied first and only the remainder is assigned to common shareholders.",
        focus: "preferred-share priority and common-share distribution logic",
        workedScenario:
            "A corporation declares dividends with cumulative preferred shares in arrears and must determine how much common shareholders receive.",
        workedResult:
            "The strongest answer computes the preferred requirement first, includes arrears when appropriate, and only then allocates any remaining dividend to common shares.",
        checkpointScenario:
            "A student divides the declared dividend across all shares immediately without checking for preferred priority or arrears.",
        checkpointResult:
            "Equity analysis improves when share class rights are evaluated before per-share amounts are reported.",
        keywords: ["dividend allocation", "preferred dividends", "dividends in arrears", "common dividend per share"],
        scanSignals: ["preferred shares", "dividends in arrears", "common shares", "dividends declared"],
        relatedCalculatorPaths: [
            "/far/dividend-allocation",
            "/far/retained-earnings-rollforward",
            "/far/statement-of-changes-in-equity-builder",
        ],
        relatedTopicIds: ["far-equity-dividends-and-retained-earnings"],
    }),
    makeTopic({
        id: "tax-transfer-taxes-and-stamp-tax-support",
        title: "Tax: Estate Tax, Donor's Tax, and Documentary Stamp Tax Support",
        shortTitle: "Transfer Taxes",
        category: "Taxation",
        summary:
            "Review transfer-tax and stamp-tax classroom logic with visible assumptions, taxable bases, and unit-based charging rules.",
        intro:
            "Transfer-tax questions are easier when the tax base, exemption logic, and visible rate assumptions are separated before the final tax due is computed.",
        focus: "visible assumptions and clean taxable-base computation",
        workedScenario:
            "A tax case asks for estate tax, donor's tax, or DST due and includes values that must first be adjusted into the correct taxable base.",
        workedResult:
            "The strongest answer identifies the taxable base first, applies the configured classroom assumption visibly, and explains any unit-based DST charging rule.",
        checkpointScenario:
            "A student multiplies the gross amount directly without showing the deduction, exemption, or taxable-unit step.",
        checkpointResult:
            "Tax support is more reliable when assumptions remain visible and intermediate tax bases are explained.",
        keywords: ["estate tax", "donor's tax", "documentary stamp tax", "transfer taxes"],
        scanSignals: ["estate tax", "gross estate", "gift tax", "documentary stamp tax"],
        relatedCalculatorPaths: [
            "/tax/estate-tax-helper",
            "/tax/donors-tax-helper",
            "/tax/documentary-stamp-tax-helper",
        ],
        relatedTopicIds: ["tax-book-tax-vat-and-compliance"],
    }),
    makeTopic({
        id: "afar-consignment-and-branch-inventory-support",
        title: "AFAR: Consignment and Branch Inventory Support",
        shortTitle: "Consignment and Branch",
        category: "AFAR / Consolidation",
        summary:
            "Study consignee settlements, branch inventory loading, and home-office support logic for special AFAR cases.",
        intro:
            "These cases become easier when students separate internal markup, settlement deductions, and the final balance still due between related parties.",
        focus: "special AFAR inventory and settlement support",
        workedScenario:
            "A case asks for cash due to the consignor or for the allowance needed to remove branch inventory loading from billed-price balances.",
        workedResult:
            "The strongest answer lays out the settlement or inventory rollforward cleanly instead of mixing commission, expenses, and markup adjustments together.",
        checkpointScenario:
            "A student treats branch invoice price as final cost or forgets to deduct consignee commission before computing the cash balance due.",
        checkpointResult:
            "AFAR support improves when internal markup and settlement deductions are isolated before the final answer is read.",
        keywords: ["consignment", "branch inventory loading", "cash due consignor", "allowance for overvaluation"],
        scanSignals: ["consignment", "consignee commission", "branch inventory", "loading on cost"],
        relatedCalculatorPaths: [
            "/afar/consignment-settlement",
            "/afar/branch-inventory-loading",
            "/afar/foreign-currency-translation",
        ],
        relatedTopicIds: ["afar-franchise-consignment-construction-and-subscriptions", "afar-foreign-currency-branch-and-home-office"],
    }),
    makeTopic({
        id: "far-financial-assets-provisions-and-unearned-revenue",
        title: "FAR: Financial Assets, Provisions, and Unearned Revenue",
        shortTitle: "FAR Asset and Liability Refinements",
        category: "Financial Accounting",
        summary:
            "Review recognition, subsequent measurement, and liability timing questions that often look simple until classification errors distort the answer.",
        intro:
            "FAR cases on financial assets, provisions, and unearned revenue become easier when recognition timing is separated from later measurement and disclosure effects.",
        focus: "recognition timing, measurement basis, and liability-versus-revenue classification",
        workedScenario:
            "A case mixes financial-asset measurement, an uncertain obligation, and advance customer collection, then asks how the balances should appear at period-end.",
        workedResult:
            "The strongest answer classifies the item first, then explains the measurement basis and whether revenue is earned yet.",
        checkpointScenario:
            "A student records advance cash directly as revenue and treats a probable obligation as if nothing should be recognized until settlement.",
        checkpointResult:
            "FAR answers improve when recognition criteria and period-end presentation are explained before any adjusting entry is drafted.",
        keywords: ["financial assets", "provisions", "unearned revenue", "recognition", "measurement"],
        scanSignals: ["expected credit loss", "probable obligation", "advance collection", "unearned revenue"],
        relatedCalculatorPaths: [
            "/accounting/unearned-revenue-adjustment",
            "/accounting/accrued-expense-adjustment",
            "/tax/book-tax-difference-workspace",
        ],
        relatedTopicIds: ["accounting-foundations-review", "tax-book-tax-vat-and-compliance"],
    }),
    makeTopic({
        id: "afar-partnership-life-cycle-formation-admission-retirement",
        title: "AFAR: Partnership Formation, Admission, Retirement, and Final Exit",
        shortTitle: "Partnership Life Cycle",
        category: "Partnership Accounting",
        summary:
            "Study the full partnership life cycle so allocation, admission, retirement, and liquidation feel like one connected chapter instead of separate memorized cases.",
        intro:
            "Partnership accounting becomes far more manageable when students see formation, profit sharing, admission, retirement, and dissolution as one capital-flow story.",
        focus: "capital movement across the full partnership life cycle",
        workedScenario:
            "A partnership is formed, a new partner is admitted, one partner later retires, and the student must explain which method fits each stage before any numbers are finalized.",
        workedResult:
            "The strongest answer keeps capital logic consistent from admission through retirement instead of treating each step as an unrelated formula.",
        checkpointScenario:
            "A student applies bonus logic where goodwill logic was implied and then carries the wrong capital base into retirement.",
        checkpointResult:
            "Partnership answers become stronger when every capital change is tied back to the stage of the partnership life cycle.",
        keywords: ["partnership formation", "admission", "retirement", "goodwill method", "bonus method"],
        scanSignals: ["new partner admitted", "bonus method", "goodwill method", "retiring partner"],
        relatedCalculatorPaths: [
            "/accounting/partnership-profit-sharing",
            "/accounting/partnership-salary-interest",
            "/accounting/partnership-admission-bonus",
            "/accounting/partnership-admission-goodwill",
            "/accounting/partnership-retirement-bonus",
            "/accounting/partnership-dissolution",
        ],
        relatedTopicIds: ["partnership-dissolution", "afar-business-combinations-and-consolidation"],
    }),
    makeTopic({
        id: "audit-materiality-risk-and-evidence-linkage",
        title: "Audit: Materiality, Audit Risk, and Evidence Linkage",
        shortTitle: "Audit Risk Linkage",
        category: "Audit & Assurance",
        summary:
            "Study how planning materiality, risk assessment, assertions, and evidence choices connect before jumping into procedure lists.",
        intro:
            "Audit answers become more persuasive when students explain why a risk level changes the evidence response instead of listing procedures mechanically.",
        focus: "materiality, risk, assertions, and evidence-response linkage",
        workedScenario:
            "An audit case gives a materiality base, a risky revenue area, and mixed controls, then asks what evidence approach is appropriate.",
        workedResult:
            "The strongest answer connects materiality and assessed risk to the depth, timing, and direction of the evidence gathered.",
        checkpointScenario:
            "A student writes many procedures without explaining which assertion or risk they are meant to address.",
        checkpointResult:
            "Audit planning improves when procedure choice is tied directly to risk and assertion logic.",
        keywords: ["materiality", "audit risk model", "audit evidence", "assertions", "detection risk"],
        scanSignals: ["performance materiality", "detection risk", "assertion", "substantive procedure"],
        relatedCalculatorPaths: [
            "/audit/audit-planning-workspace",
            "/audit/misstatement-evaluation-workspace",
            "/audit/audit-cycle-reviewer",
            "/audit/audit-completion-and-opinion",
        ],
        relatedTopicIds: ["audit-planning-evidence-and-reporting", "governance-control-environment-risk-and-monitoring"],
    }),
    makeTopic({
        id: "tax-withholding-local-remedies-and-compliance",
        title: "Tax: Withholding, Local Taxation, Remedies, and Compliance",
        shortTitle: "Tax Compliance Depth",
        category: "Taxation",
        summary:
            "Review withholding, local taxation, compliance posture, and tax-remedy framing without blurring classroom assumptions and legal labels.",
        intro:
            "Tax questions become safer when students separate rate computation from compliance classification and from the remedies or ethics issue that may follow.",
        focus: "withholding logic, local tax framing, and compliance-versus-remedy distinction",
        workedScenario:
            "A case mixes a withholding computation with local tax exposure and then asks what compliance or remedy direction makes sense.",
        workedResult:
            "The strongest answer computes the tax carefully, then explains the compliance posture and the possible remedy framework separately.",
        checkpointScenario:
            "A student computes a tax amount correctly but mislabels the compliance issue or treats a remedy concept as if it were part of the rate formula.",
        checkpointResult:
            "Tax review becomes stronger when computation, compliance, and remedy framing are kept in separate layers.",
        keywords: ["withholding tax", "local taxation", "tax remedies", "tax compliance", "tax ethics"],
        scanSignals: ["withholding tax", "expanded withholding", "local business tax", "tax remedy"],
        relatedCalculatorPaths: [
            "/tax/withholding-tax",
            "/tax/percentage-tax",
            "/tax/tax-compliance-review",
        ],
        relatedTopicIds: ["tax-book-tax-vat-and-compliance", "tax-transfer-taxes-and-stamp-tax-support"],
    }),
    makeTopic({
        id: "rfbt-obligations-contracts-and-defective-agreements",
        title: "RFBT: Obligations, Contracts, and Defective Agreements",
        shortTitle: "RFBT Contracts Core",
        category: "RFBT / Business Law",
        summary:
            "Review valid, voidable, rescissible, unenforceable, and void agreements as one issue-spotting map instead of isolated legal terms.",
        intro:
            "RFBT cases become easier when the student first classifies what kind of contract issue exists before discussing remedies or enforceability.",
        focus: "contract classification and legal consequence reading",
        workedScenario:
            "A fact pattern raises consent defects, form requirements, and a remedy question, and the student must identify what kind of agreement exists.",
        workedResult:
            "The strongest answer identifies the contract defect first, then explains the consequence, remedy, and whether enforcement is still possible.",
        checkpointScenario:
            "A student recognizes that something is wrong with the agreement but cannot distinguish voidable from unenforceable or void.",
        checkpointResult:
            "Law answers improve when each defect category is tied to its legal effect and practical remedy.",
        keywords: ["obligations", "contracts", "voidable", "unenforceable", "rescissible"],
        scanSignals: ["defective contract", "consent", "rescissible", "unenforceable", "void agreement"],
        relatedCalculatorPaths: [
            "/rfbt/business-law-review",
            "/rfbt/commercial-transactions-reviewer",
        ],
        relatedTopicIds: ["rfbt-corporation-opc-merger-and-liquidation"],
    }),
    makeTopic({
        id: "rfbt-corporation-opc-merger-and-liquidation",
        title: "RFBT: Corporation Law, OPC, Merger, and Liquidation",
        shortTitle: "RFBT Corporation Law",
        category: "RFBT / Business Law",
        summary:
            "Study incorporation, single-person corporations, merger and consolidation, and liquidation as one corporate-law progression.",
        intro:
            "Corporate-law review becomes clearer when governance formation, restructuring, and dissolution are treated as stages rather than memorized islands.",
        focus: "corporate governance structure, restructuring, and liquidation consequence",
        workedScenario:
            "A case asks whether an OPC structure is allowed, what happens in a merger, and how liquidation changes rights and obligations.",
        workedResult:
            "The strongest answer distinguishes normal corporate governance rules from special OPC, merger, and liquidation consequences.",
        checkpointScenario:
            "A student treats merger, consolidation, and liquidation as if they all produce the same legal effect.",
        checkpointResult:
            "Corporate-law review improves when the legal consequence of each restructuring path is stated clearly.",
        keywords: ["corporation law", "opc", "merger", "consolidation", "liquidation"],
        scanSignals: ["one person corporation", "merger", "consolidation", "corporate liquidation"],
        relatedCalculatorPaths: [
            "/rfbt/business-law-review",
            "/rfbt/commercial-transactions-reviewer",
            "/governance/risk-control-matrix",
        ],
        relatedTopicIds: ["rfbt-obligations-contracts-and-defective-agreements"],
    }),
    makeTopic({
        id: "ais-general-vs-application-controls-and-it-audit",
        title: "AIS: General Controls, Application Controls, and IT Audit",
        shortTitle: "AIS Control Layers",
        category: "AIS / IT Controls",
        summary:
            "Review how entity-wide IT governance, general controls, application controls, and IT-audit documentation fit together.",
        intro:
            "AIS and IT-audit questions are easier when students separate the control environment from the specific application activity it supports.",
        focus: "control layering, documentation, and IT-audit consequence",
        workedScenario:
            "A case describes weak change management, strong edit checks, and a documentation request, and the student must classify the control gaps correctly.",
        workedResult:
            "The strongest answer identifies which controls are general, which are application-level, and how each weakness affects audit reliance.",
        checkpointScenario:
            "A student labels every control as ITGC or every control as application-specific without reading the actual objective of the control.",
        checkpointResult:
            "AIS answers improve when the control objective is used to classify the control before discussing its audit impact.",
        keywords: ["itgc", "application controls", "it audit", "change management", "logical access"],
        scanSignals: ["application control", "general control", "change management", "it audit"],
        relatedCalculatorPaths: [
            "/ais/it-control-matrix",
            "/ais/ais-lifecycle-and-recovery",
            "/ais/segregation-of-duties-conflict-matrix",
            "/audit/audit-planning-workspace",
        ],
        relatedTopicIds: ["governance-control-environment-risk-and-monitoring", "audit-materiality-risk-and-evidence-linkage"],
    }),
    makeTopic({
        id: "governance-control-environment-risk-and-monitoring",
        title: "Governance: Control Environment, Risk Assessment, Activities, and Monitoring",
        shortTitle: "Governance and Internal Control",
        category: "Governance / Ethics / Risk",
        summary:
            "Study governance, ethics, COSO-style control design, and monitoring so control evaluation feels like a practical framework instead of a checklist dump.",
        intro:
            "Governance and internal-control questions become clearer when the control environment and risk-assessment logic are explained before individual control activities are judged.",
        focus: "governance structure and end-to-end internal-control evaluation",
        workedScenario:
            "A business has tone-at-the-top problems, weak segregation, and little monitoring, and the student must explain both the control environment issue and the residual risk effect.",
        workedResult:
            "The strongest answer starts with the control environment, then moves into risk assessment, control activities, information flow, and monitoring consequences.",
        checkpointScenario:
            "A student lists control activities without commenting on whether the control environment or monitoring weakness makes those activities unreliable.",
        checkpointResult:
            "Internal-control evaluation improves when governance quality is treated as the foundation for later control activities.",
        keywords: ["governance", "internal control", "control environment", "risk assessment", "monitoring"],
        scanSignals: ["control environment", "monitoring", "segregation of duties", "residual risk"],
        relatedCalculatorPaths: [
            "/governance/risk-control-matrix",
            "/governance/governance-escalation-planner",
            "/audit/audit-planning-workspace",
            "/ais/it-control-matrix",
        ],
        relatedTopicIds: ["ais-general-vs-application-controls-and-it-audit", "audit-materiality-risk-and-evidence-linkage"],
    }),
    makeTopic({
        id: "operations-aggregate-planning-scheduling-and-quality-management",
        title: "Operations: Aggregate Planning, Scheduling, and Quality Management",
        shortTitle: "Operations Planning and Quality",
        category: "Operations / Supply Chain",
        summary:
            "Review aggregate planning, scheduling tradeoffs, productivity, and quality control so operations cases connect back to cost and service outcomes.",
        intro:
            "Operations review is stronger when planning, capacity, scheduling, and quality are treated as one connected operating system instead of separate buzzwords.",
        focus: "planning and quality tradeoffs in operating execution",
        workedScenario:
            "A case requires a production plan, highlights bottlenecks and overtime, and then asks how service level and quality could be affected.",
        workedResult:
            "The strongest answer compares capacity and scheduling choices while still commenting on quality and productivity implications.",
        checkpointScenario:
            "A student optimizes the schedule on paper but ignores the likely quality or productivity cost of that decision.",
        checkpointResult:
            "Operations answers improve when service, quality, and throughput are read together instead of one at a time.",
        keywords: ["aggregate planning", "scheduling", "quality management", "productivity", "capacity"],
        scanSignals: ["aggregate planning", "schedule", "quality cost", "capacity plan"],
        relatedCalculatorPaths: [
            "/operations/moving-average-forecast",
            "/operations/eoq-and-reorder-point",
            "/operations/safety-stock-planner",
            "/business/capacity-utilization",
        ],
        relatedTopicIds: ["operations-forecasting-moving-averages-and-replenishment", "operations-safety-stock-reorder-and-buffer-policy"],
    }),
    makeTopic({
        id: "strategic-planning-budgeting-forecasting-and-performance-integration",
        title: "Strategic: Planning, Budgeting, Forecasting, and Performance Integration",
        shortTitle: "Strategic Performance Integration",
        category: "Strategic / Integrative",
        summary:
            "Review how strategy, budgeting, forecasting, variance reading, and governance signals fit together in an integrative answer.",
        intro:
            "Integrative accounting review improves when students treat plans, budgets, forecasts, and control signals as one management cycle rather than separate subjects.",
        focus: "cross-topic integration from strategy to performance review",
        workedScenario:
            "A capstone case starts with strategic objectives, moves into a budget and forecast revision, and ends with a governance or control concern that changes the recommendation.",
        workedResult:
            "The strongest answer links strategy to the budget, the budget to forecast revision, and the forecast to performance and control implications.",
        checkpointScenario:
            "A student gives a correct budgeting comment but ignores how governance or risk concerns could change the final recommendation.",
        checkpointResult:
            "Strategic answers improve when planning, performance, and control observations are integrated into one coherent recommendation.",
        keywords: ["strategic management", "budgeting integration", "forecasting", "performance management", "capstone"],
        scanSignals: ["strategic objective", "forecast revision", "performance report", "board case"],
        relatedCalculatorPaths: [
            "/strategic/integrative-case-mapper",
            "/strategic/strategic-business-analysis",
            "/business/budget-variance-analysis",
            "/business/transfer-pricing-support",
        ],
        relatedTopicIds: ["managerial-performance-reports-and-budget-variance", "governance-control-environment-risk-and-monitoring"],
    }),
    makeTopic({
        id: "far-borrowing-costs-and-qualifying-assets",
        title: "FAR: Borrowing Costs and Qualifying Assets",
        shortTitle: "FAR Borrowing Costs",
        category: "Financial Accounting",
        summary:
            "Review capitalization timing, qualifying-asset logic, and avoidable-interest framing so borrowing-cost cases stop feeling like isolated rate math.",
        intro:
            "Borrowing-cost questions are easier when students separate qualifying expenditures, capitalization period, and the applicable rate base before computing avoidable interest.",
        focus: "qualifying-asset capitalization timing and avoidable-interest measurement",
        workedScenario:
            "A long-term asset is under construction for part of the year and the problem gives weighted expenditures plus a capitalization rate.",
        workedResult:
            "The strongest answer identifies the capitalization window first, then computes avoidable borrowing cost and explains any ceiling or rate assumption.",
        checkpointScenario:
            "A student capitalizes a full year of interest even though construction conditions existed for only part of the year.",
        checkpointResult:
            "Borrowing-cost answers improve when the capitalization period is treated as a real condition instead of an automatic full-year assumption.",
        keywords: ["borrowing costs", "avoidable interest", "qualifying asset", "capitalized interest"],
        scanSignals: ["qualifying asset", "avoidable interest", "capitalization period", "weighted expenditures"],
        relatedCalculatorPaths: ["/far/borrowing-costs-capitalization"],
        relatedTopicIds: ["far-financial-assets-provisions-and-unearned-revenue", "accounting-foundations-review"],
    }),
    makeTopic({
        id: "operations-costing-and-pricing-logic",
        title: "Operations and Management Services: Costing and Pricing Logic",
        shortTitle: "Costing and Pricing",
        category: "Operations / Supply Chain",
        summary:
            "Review cost-plus pricing, markup-versus-margin logic, and profit-volume links so pricing cases stay tied to cost behavior and capacity realities.",
        intro:
            "Costing-and-pricing questions become cleaner when cost base, markup, margin, and target-profit volume are separated before a price is recommended.",
        focus: "cost base selection, pricing logic, and target-profit volume support",
        workedScenario:
            "A product manager has unit cost, a target margin, and a target monthly income goal and needs a defensible starting price.",
        workedResult:
            "The best answer distinguishes target margin from markup and explains how the suggested price still needs market validation.",
        checkpointScenario:
            "A student reports markup as though it were target margin and then treats the suggested price as final without comparing market conditions.",
        checkpointResult:
            "Pricing answers improve when the math result is paired with a commercial reasonableness check.",
        keywords: ["cost plus pricing", "markup", "target margin", "pricing planner"],
        scanSignals: ["cost plus", "target margin", "markup pricing", "suggested selling price"],
        relatedCalculatorPaths: ["/operations/cost-plus-pricing", "/business/markup-margin"],
        relatedTopicIds: ["strategic-planning-budgeting-forecasting-and-performance-integration", "cvp-core"],
    }),
    makeTopic({
        id: "audit-assertions-evidence-and-working-paper-flow",
        title: "Audit: Assertions, Evidence, and Working-Paper Flow",
        shortTitle: "Audit Assertions",
        category: "Audit & Assurance",
        summary:
            "Study how assertions drive evidence choice, working-paper wording, and procedure emphasis so audit answers stop sounding like random lists.",
        intro:
            "Audit questions improve when evidence is chosen because of the assertion and risk, not because the student remembers a generic procedure name.",
        focus: "assertion-driven evidence planning and documentation logic",
        workedScenario:
            "A risky revenue area raises occurrence concerns, weak controls, and a question about what evidence should be strongest.",
        workedResult:
            "The best answer states the assertion first, then ties the audit response and workpaper explanation directly to that risk.",
        checkpointScenario:
            "A student lists inspection, inquiry, and confirmation without explaining which assertion they actually address.",
        checkpointResult:
            "Audit procedure quality improves when the assertion is visible before the evidence list begins.",
        keywords: ["audit assertions", "audit evidence", "working papers", "occurrence completeness valuation"],
        scanSignals: ["assertion", "audit evidence", "working paper", "occurrence", "completeness"],
        relatedCalculatorPaths: ["/audit/assertion-evidence-planner", "/audit/audit-planning-workspace"],
        relatedTopicIds: ["audit-materiality-risk-and-evidence-linkage", "audit-planning-evidence-and-reporting"],
    }),
    makeTopic({
        id: "tax-excise-local-and-incentive-depth",
        title: "Tax: Excise, Local Taxation, Incentives, and Remedies",
        shortTitle: "Tax Special Areas",
        category: "Taxation",
        summary:
            "Review special-tax classification, incentive-regime logic, local-tax exposure, and remedy framing so taxation coverage goes beyond VAT and withholding alone.",
        intro:
            "Tax-review depth improves when excise, local taxation, incentives, treaties, ethics, and remedies are treated as classification-and-compliance topics before any rate is applied.",
        focus: "special-tax classification and compliance posture",
        workedScenario:
            "A case mixes an incentive-regime claim with possible local-tax exposure and then asks what compliance or remedy direction fits the facts.",
        workedResult:
            "The strongest answer separates eligibility, rate effect, and remedy posture instead of collapsing all three into one sentence.",
        checkpointScenario:
            "A student assumes a preferential rate automatically applies because the case mentions an economic zone or treaty label once.",
        checkpointResult:
            "Tax answers improve when eligibility and documentation are tested before the rate is trusted.",
        keywords: ["excise tax", "local taxation", "peza", "boi", "tax treaty", "tax remedies"],
        scanSignals: ["excise", "local business tax", "peza", "boi", "tax remedy", "preferential rate"],
        relatedCalculatorPaths: ["/tax/excise-local-and-incentive-review", "/tax/tax-compliance-review"],
        relatedTopicIds: ["tax-withholding-local-remedies-and-compliance", "tax-book-tax-vat-and-compliance"],
    }),
    makeTopic({
        id: "rfbt-securities-and-corporate-governance-depth",
        title: "RFBT: Securities Regulation and Corporate Governance Depth",
        shortTitle: "RFBT Securities",
        category: "RFBT / Business Law",
        summary:
            "Review securities issuance, market conduct, insider trading, governance duties, and restructuring consequences in one issue-spotting flow.",
        intro:
            "RFBT review becomes more complete when securities and governance topics are not left as side notes after contracts and baseline corporation law.",
        focus: "securities regulation, governance duty, and restructuring consequence",
        workedScenario:
            "A case involves disclosure pressure, possible insider trading, and a later restructuring or liquidation consequence.",
        workedResult:
            "The strongest answer separates the market-conduct issue from the governance duty issue before explaining the corporate consequence.",
        checkpointScenario:
            "A student recognizes a governance problem but ignores the securities-law angle or vice versa.",
        checkpointResult:
            "Mixed law cases improve when the primary legal frame is identified before the secondary issue is added.",
        keywords: ["securities regulation", "insider trading", "market manipulation", "corporate governance"],
        scanSignals: ["insider trading", "securities", "governance", "merger", "rehabilitation"],
        relatedCalculatorPaths: ["/rfbt/securities-and-governance-review", "/rfbt/commercial-transactions-reviewer"],
        relatedTopicIds: ["rfbt-corporation-opc-merger-and-liquidation", "rfbt-obligations-contracts-and-defective-agreements"],
    }),
    makeTopic({
        id: "ais-enterprise-systems-and-data-flow-controls",
        title: "AIS: Enterprise Systems, Data Flow, and Analytics Controls",
        shortTitle: "AIS Enterprise Systems",
        category: "AIS / IT Controls",
        summary:
            "Review ERP, SCM, CRM, BI, interface controls, and documentation flow so AIS coverage includes real enterprise-system environments.",
        intro:
            "AIS topics grow more practical when students can explain how enterprise systems move data, where controls can fail, and why documentation quality changes audit reliance.",
        focus: "enterprise-system control layering and data-flow reliability",
        workedScenario:
            "An ERP environment feeds reports into BI dashboards, but access, interface, and change-control discipline are uneven.",
        workedResult:
            "The strongest answer separates access, change, interface, and documentation issues before explaining reporting or audit consequences.",
        checkpointScenario:
            "A student calls every systems problem an ITGC issue without identifying whether the real failure sits in data movement, documentation, or application logic.",
        checkpointResult:
            "AIS answers improve when the control failure is classified by its actual role in the data flow.",
        keywords: ["erp", "scm", "crm", "business intelligence", "interface controls"],
        scanSignals: ["erp", "crm", "supply chain management", "interface", "dashboard", "bi"],
        relatedCalculatorPaths: ["/ais/enterprise-systems-control-mapper", "/ais/it-control-matrix"],
        relatedTopicIds: ["ais-general-vs-application-controls-and-it-audit", "ais-it-governance-and-controls"],
    }),
    makeTopic({
        id: "governance-ethics-and-management-override",
        title: "Governance: Ethics, Stakeholder Impact, and Management Override",
        shortTitle: "Ethics and Override",
        category: "Governance / Ethics / Risk",
        summary:
            "Review ethical pressure, stakeholder harm, escalation paths, and override risk so governance topics become practical decision tools instead of abstract reminders.",
        intro:
            "Governance and ethics cases improve when the answer explains pressure, harmed stakeholders, override risk, and the right escalation channel in one sequence.",
        focus: "ethical pressure, stakeholder impact, and override response",
        workedScenario:
            "Aggressive targets, override-prone management behavior, and weak monitoring create an ethical reporting risk that management wants hidden.",
        workedResult:
            "The strongest answer identifies the stakeholders at risk and links the issue to escalation, control response, and governance oversight.",
        checkpointScenario:
            "A student says the issue is unethical but never explains what governance response should happen next.",
        checkpointResult:
            "Ethics answers improve when the escalation and control response are as clear as the moral diagnosis.",
        keywords: ["business ethics", "management override", "stakeholder impact", "ethical pressure"],
        scanSignals: ["ethical pressure", "override", "stakeholder", "escalation", "tone at the top"],
        relatedCalculatorPaths: [
            "/governance/ethics-decision-workspace",
            "/governance/risk-control-matrix",
            "/governance/governance-escalation-planner",
        ],
        relatedTopicIds: ["governance-control-environment-risk-and-monitoring", "governance-risk-ethics-and-internal-control"],
    }),
    makeTopic({
        id: "strategic-balanced-scorecard-and-strategy-maps",
        title: "Strategic: Balanced Scorecard and Strategy Maps",
        shortTitle: "Balanced Scorecard",
        category: "Strategic / Integrative",
        summary:
            "Review financial, customer, process, and learning perspectives together so strategic topics gain a practical performance-mapping workspace.",
        intro:
            "Strategic cases become easier when the student can map one objective across all four balanced-scorecard perspectives instead of relying on one metric alone.",
        focus: "strategy-to-performance mapping across all scorecard perspectives",
        workedScenario:
            "A case asks whether the company can improve profitability without damaging customer retention or operational quality.",
        workedResult:
            "The strongest answer maps the objective into each perspective and explains which signals lead the strategy and which ones lag behind it.",
        checkpointScenario:
            "A student focuses only on the financial target and ignores process or learning weaknesses that would block the plan.",
        checkpointResult:
            "Strategic answers improve when performance, capability, and governance signals are integrated instead of treated as optional extras.",
        keywords: ["balanced scorecard", "strategy map", "financial perspective", "learning and growth"],
        scanSignals: ["balanced scorecard", "strategy map", "customer perspective", "learning and growth"],
        relatedCalculatorPaths: ["/strategic/balanced-scorecard-workspace", "/strategic/strategic-business-analysis"],
        relatedTopicIds: ["strategic-planning-budgeting-forecasting-and-performance-integration", "integrative-review-and-case-mapping"],
    }),
    makeTopic({
        id: "book-driven-statement-analysis-dupont-and-earnings-quality",
        title: "Financial Statement Analysis: DuPont, Accruals, and Earnings Quality",
        shortTitle: "FSA Quality",
        category: "Financial Accounting",
        summary:
            "Review ROE decomposition and earnings-quality signals so statement analysis goes beyond isolated ratios.",
        intro:
            "Statement-analysis books emphasize that ratios should explain economic drivers. DuPont separates margin, turnover, and leverage, while accrual screens compare earnings with cash support.",
        focus: "profitability drivers and quality-of-earnings screening",
        workedScenario:
            "ROE improved, but operating cash flow lagged net income and receivables grew faster than sales.",
        workedResult:
            "A strong answer separates the DuPont driver from the accrual-quality warning instead of calling the company simply better or worse.",
        checkpointScenario:
            "A student reports ROE only and ignores whether cash flow supports the earnings.",
        checkpointResult:
            "The next step is to pair DuPont with accrual and cash-conversion analysis.",
        keywords: ["dupont", "earnings quality", "accrual ratio", "cash conversion", "financial statement analysis"],
        scanSignals: ["dupont", "roe", "operating cash flow", "accrual ratio", "quality of earnings"],
        relatedCalculatorPaths: ["/accounting/dupont-analysis", "/accounting/earnings-quality-analysis", "/accounting/ratio-analysis-workspace"],
        relatedTopicIds: ["far-financial-assets-provisions-and-unearned-revenue", "strategic-planning-budgeting-forecasting-and-performance-integration"],
    }),
    makeTopic({
        id: "book-driven-statistics-confidence-and-business-estimates",
        title: "Statistics: Confidence Intervals for Accounting and Business Estimates",
        shortTitle: "Confidence Intervals",
        category: "Statistics / Analytics",
        summary:
            "Review margin of error, standard error, and interval estimates for audit sampling, forecasting, and market-research style cases.",
        intro:
            "Statistics and research methods support accounting decisions when estimates are presented with uncertainty instead of false precision.",
        focus: "large-sample estimate range and interpretation",
        workedScenario:
            "A sample has a mean processing time, standard deviation, and sample size, and management asks for a 95% estimate range.",
        workedResult:
            "The answer calculates standard error, margin of error, and the interval, then states that the interval is an estimate rather than a guarantee.",
        checkpointScenario:
            "A student treats a sample mean as the exact population value.",
        checkpointResult:
            "Use the confidence interval to communicate uncertainty honestly.",
        keywords: ["confidence interval", "margin of error", "standard error", "sampling", "audit sampling"],
        scanSignals: ["confidence interval", "sample mean", "sample size", "standard error", "margin of error"],
        relatedCalculatorPaths: ["/statistics/confidence-interval", "/statistics/standard-deviation", "/statistics/coefficient-of-variation"],
        relatedTopicIds: ["operations-aggregate-planning-scheduling-and-quality-management", "audit-materiality-risk-and-evidence-linkage"],
    }),
    makeTopic({
        id: "book-driven-retail-pricing-and-capital-selection",
        title: "Retail Pricing and Capital Selection",
        shortTitle: "Retail and Rationing",
        category: "Managerial & Cost Accounting",
        summary:
            "Connect pricing, retail markdowns, profitability index ranking, and investment budget limits for management-services cases.",
        intro:
            "Cost, retail, and marketing-management topics become accounting-centered when pricing actions are tied to margin and investment choices are tied to capital limits.",
        focus: "pricing margin discipline and constrained project choice",
        workedScenario:
            "A product is marked down to clear inventory while management also chooses among projects under a capital ceiling.",
        workedResult:
            "The best answer calculates maintained margin for the pricing decision and ranks capital projects by profitability index for the investment decision.",
        checkpointScenario:
            "A student confuses markup on cost with margin on selling price, then ranks projects by NPV without considering the budget constraint.",
        checkpointResult:
            "Separate pricing language from project-selection logic before reaching a decision.",
        keywords: ["retail markup", "markdown", "maintained margin", "capital rationing", "profitability index"],
        scanSignals: ["retail markup", "markdown", "capital rationing", "profitability index", "investment budget"],
        relatedCalculatorPaths: ["/operations/retail-markup-markdown", "/finance/capital-rationing-prioritizer", "/finance/profitability-index"],
        relatedTopicIds: ["strategic-balanced-scorecard-and-strategy-maps", "strategic-planning-budgeting-forecasting-and-performance-integration"],
    }),
    makeTopic({
        id: "book-driven-far-afar-provisions-and-franchise-revenue",
        title: "FAR and AFAR: Provisions, Contingencies, and Franchise Revenue",
        shortTitle: "Provisions and Franchise",
        category: "AFAR / Consolidation",
        summary:
            "Review probability-weighted provisions and franchise-fee revenue recognition so liabilities and special revenue topics are easier to solve together.",
        intro:
            "Intermediate and advanced accounting cases often mix measurement uncertainty with revenue-recognition timing. The solution should separate recognition criteria, measurement, and remaining obligations.",
        focus: "uncertainty measurement and revenue obligation timing",
        workedScenario:
            "A legal obligation has several possible outcomes, while a separate franchise contract includes an initial fee and unperformed services.",
        workedResult:
            "The provision answer uses probability weighting only after recognition is justified; the franchise answer separates satisfied obligations from remaining contract liability.",
        checkpointScenario:
            "A student records the full amount immediately without checking uncertainty or unperformed obligations.",
        checkpointResult:
            "Recognition and measurement are separate steps.",
        keywords: ["provision", "contingency", "franchise accounting", "initial franchise fee", "contract liability"],
        scanSignals: ["provision", "contingent liability", "franchise fee", "performance obligation", "contract liability"],
        relatedCalculatorPaths: ["/far/provision-expected-value", "/afar/franchise-revenue-workspace", "/afar/construction-revenue-workspace"],
        relatedTopicIds: ["far-financial-assets-provisions-and-unearned-revenue", "afar-revenue-special-topics-and-foreign-currency"],
    }),
    makeTopic({
        id: "completion-segment-reporting-and-responsibility-accounting",
        title: "Completion Review: Segment Reporting and Responsibility Accounting",
        shortTitle: "Segment Reporting",
        category: "Managerial & Cost Accounting",
        summary:
            "Connect segmented income statements, traceable fixed costs, common costs, and responsibility-accounting interpretation.",
        intro:
            "Segment reports are most useful when they separate contribution margin from segment margin and avoid treating allocated common costs as controllable by the segment manager.",
        focus: "segment margin, controllability, and performance interpretation",
        workedScenario:
            "A division reports sales, variable costs, traceable fixed costs, and allocated common costs. Management asks whether the division is economically useful.",
        workedResult:
            "Compute contribution margin first, deduct traceable fixed costs for segment margin, then discuss allocated common costs separately.",
        checkpointScenario:
            "A student closes a profitable segment because allocated common costs push reported income below zero.",
        checkpointResult:
            "The better answer focuses on segment margin before making avoidable-cost conclusions.",
        keywords: ["segmented income statement", "segment margin", "traceable fixed costs", "responsibility accounting"],
        scanSignals: ["segment margin", "traceable fixed", "common fixed", "responsibility accounting"],
        relatedCalculatorPaths: ["/business/segmented-income-statement", "/business/roi-ri-eva", "/strategic/balanced-scorecard-workspace"],
        relatedTopicIds: ["book-driven-retail-pricing-and-capital-selection", "strategic-balanced-scorecard-and-strategy-maps"],
    }),
    makeTopic({
        id: "completion-audit-sampling-and-access-controls",
        title: "Completion Review: Audit Sampling and Access Controls",
        shortTitle: "Sampling and Access",
        category: "Audit & Assurance",
        summary:
            "Review sampling risk, sample size logic, logical access, privileged access, and evidence quality across audit and AIS cases.",
        intro:
            "Audit sampling and access-control review both require visible assumptions: what population is being tested, what risk is tolerated, and what evidence supports reliance.",
        focus: "sampling risk and IT access evidence",
        workedScenario:
            "An audit team has a large receivables population, tolerable misstatement, expected misstatement, and weak privileged-access monitoring.",
        workedResult:
            "Use the sampling planner for sample-size framing and the access-control workspace for control evidence and monitoring risks.",
        checkpointScenario:
            "A student computes a sample size but ignores whether access controls make the underlying report reliable.",
        checkpointResult:
            "Pair sample evidence with IT control evidence when the population comes from a system report.",
        keywords: ["audit sampling", "sample size", "logical access", "privileged access", "it controls"],
        scanSignals: ["audit sampling", "tolerable misstatement", "logical access", "privileged access"],
        relatedCalculatorPaths: ["/audit/audit-sampling-planner", "/ais/access-control-review", "/audit/audit-planning-workspace"],
        relatedTopicIds: ["audit-materiality-risk-and-evidence-linkage", "ais-general-vs-application-controls-and-it-audit"],
    }),
    makeTopic({
        id: "completion-afar-liquidation-and-far-quasi-reorganization",
        title: "Completion Review: Corporate Liquidation and Quasi-Reorganization",
        shortTitle: "Liquidation and Reorg",
        category: "AFAR / Consolidation",
        summary:
            "Connect AFAR liquidation recovery schedules with FAR deficit-cleanup and quasi-reorganization classroom framing.",
        intro:
            "Liquidation and quasi-reorganization topics both ask students to track deficit, recovery, and equity effects carefully instead of jumping to a single label.",
        focus: "estate recovery, creditor deficiency, and deficit relief",
        workedScenario:
            "A distressed company estimates asset realization, liquidation costs, priority claims, unsecured claims, and possible equity deficit relief.",
        workedResult:
            "Use corporate liquidation to estimate creditor recovery, then quasi-reorganization to show whether deficit relief is sufficient under stated assumptions.",
        checkpointScenario:
            "A student nets all claims at once and loses the priority-versus-unsecured distinction.",
        checkpointResult:
            "Separate liquidation priority from equity deficit cleanup.",
        keywords: ["corporate liquidation", "statement of affairs", "quasi reorganization", "deficit cleanup"],
        scanSignals: ["corporate liquidation", "statement of affairs", "quasi reorganization", "deficit"],
        relatedCalculatorPaths: ["/afar/corporate-liquidation", "/far/quasi-reorganization", "/accounting/partnership-dissolution"],
        relatedTopicIds: ["afar-partnership-life-cycle-formation-admission-retirement", "far-equity-dividends-and-retained-earnings"],
    }),
    makeTopic({
        id: "completion-rfbt-obligations-contracts-and-operations-pert",
        title: "Completion Review: RFBT Issue Flow and Operations PERT",
        shortTitle: "Contracts and PERT",
        category: "RFBT / Business Law",
        summary:
            "Add reviewer continuity for obligations, defective contracts, remedies, and operations project-estimate problems.",
        intro:
            "Not every curriculum topic is a pure numeric calculator. RFBT needs issue classification, while operations project management needs transparent estimate assumptions.",
        focus: "legal issue classification and project-estimate uncertainty",
        workedScenario:
            "A case mixes a defective contract fact pattern with a project-management estimate that includes optimistic, most-likely, and pessimistic times.",
        workedResult:
            "Classify the contract issue first, then use PERT for the project time estimate instead of treating both parts as one generic decision.",
        checkpointScenario:
            "A student identifies a contract defect but never states the likely remedy or next review step.",
        checkpointResult:
            "RFBT answers improve when classification, effect, and remedy are all visible.",
        keywords: ["obligations", "contracts", "defective contracts", "pert", "project management"],
        scanSignals: ["voidable", "unenforceable", "pert", "optimistic", "pessimistic"],
        relatedCalculatorPaths: ["/rfbt/obligations-contracts-flow", "/operations/pert-project-estimate", "/rfbt/business-law-review"],
        relatedTopicIds: ["rfbt-obligations-contracts-and-defective-agreements", "operations-aggregate-planning-scheduling-and-quality-management"],
    }),
    makeTopic({
        id: "completion-far-financial-assets-and-investment-property",
        title: "Completion Review: Financial Assets and Investment Property",
        shortTitle: "FAR Asset Measurement",
        category: "Financial Accounting",
        summary:
            "Review amortized-cost financial assets, effective-interest logic, ECL allowance, and investment-property measurement choices.",
        intro:
            "FAR asset-measurement cases often mix classification and measurement. The safest answer names the asset category first, then computes the measurement consequence.",
        focus: "financial asset amortized cost and investment-property measurement",
        workedScenario:
            "A debt investment is measured at amortized cost while another property is classified as investment property with fair-value information at reporting date.",
        workedResult:
            "Compute effective-interest revenue and carrying amount for the financial asset, then compare fair value and cost-model effects for the investment property.",
        checkpointScenario:
            "A student books a fair-value change without first checking whether the asset is an investment property or a financial asset.",
        checkpointResult:
            "Classification drives the measurement route before any gain, loss, or carrying amount is computed.",
        keywords: ["financial assets", "amortized cost", "effective interest", "investment property", "fair value model"],
        scanSignals: ["financial asset", "amortized cost", "effective interest", "investment property", "fair value model"],
        relatedCalculatorPaths: ["/far/financial-asset-amortized-cost", "/far/investment-property-measurement", "/accounting/bond-amortization-schedule"],
        relatedTopicIds: ["far-borrowing-costs-impairment-disposal-and-provisions", "financial-statement-analysis-and-earnings-quality"],
    }),
    makeTopic({
        id: "completion-cost-abc-and-quality-control",
        title: "Completion Review: ABC Costing and Quality Control",
        shortTitle: "ABC and SQC",
        category: "Managerial & Cost Accounting",
        summary:
            "Review activity-based costing, cost pools, cost drivers, unit product cost, and three-sigma quality-control interpretation.",
        intro:
            "Cost and operations cases become stronger when product-cost drivers and process-quality signals are both visible. ABC explains cost assignment; SQC explains whether process results look stable.",
        focus: "activity cost-driver allocation and statistical quality-control limits",
        workedScenario:
            "A product consumes setup and machine-hour activities, while recent sample means must be checked against process-control limits.",
        workedResult:
            "Use ABC to assign overhead and unit cost, then use control-chart limits to flag possible assignable causes.",
        checkpointScenario:
            "A student applies one plantwide overhead rate even though the case gives multiple cost pools and drivers.",
        checkpointResult:
            "Multiple cost pools usually signal ABC rather than a single-rate shortcut.",
        keywords: ["activity based costing", "abc", "cost pool", "cost driver", "quality control", "control chart"],
        scanSignals: ["activity based costing", "cost pool", "cost driver", "ucl", "lcl", "three sigma"],
        relatedCalculatorPaths: ["/business/activity-based-costing", "/operations/quality-control-chart", "/accounting/factory-overhead-variance"],
        relatedTopicIds: ["cost-behavior-and-mixed-cost-estimation", "operations-aggregate-planning-scheduling-and-quality-management"],
    }),
    makeTopic({
        id: "completion-afar-joint-arrangements",
        title: "Completion Review: AFAR Joint Arrangements",
        shortTitle: "Joint Arrangements",
        category: "AFAR / Consolidation",
        summary:
            "Review joint operation versus joint venture framing, participation percentages, share of statement amounts, and classification cautions.",
        intro:
            "Joint-arrangement problems are easy to misroute because percentage ownership feels familiar. The real issue is whether the parties have direct rights and obligations or an investment-style interest.",
        focus: "joint-operation share schedules and joint-venture classification cues",
        workedScenario:
            "A participant has a 40% interest in an arrangement with assets, liabilities, revenue, and expenses, but the case also asks whether direct rights exist.",
        workedResult:
            "Compute the participant's share for schedule support, then state that rights and obligations control the accounting classification.",
        checkpointScenario:
            "A student uses equity-method language even though the facts describe direct rights to assets and obligations for liabilities.",
        checkpointResult:
            "The better answer separates share math from classification.",
        keywords: ["joint arrangement", "joint operation", "joint venture", "share of assets", "share of profit"],
        scanSignals: ["joint arrangement", "joint operation", "joint venture", "rights to assets"],
        relatedCalculatorPaths: ["/afar/joint-arrangement-analyzer", "/afar/equity-method-investment", "/afar/business-combination-analysis"],
        relatedTopicIds: ["afar-business-combinations-and-consolidation", "afar-foreign-currency-and-special-revenue-topics"],
    }),
];
