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
            `It helps students explain ${seed.focus} as a practical workflow instead of a vague reviewer note.`,
            "It strengthens calculator and lesson routing by making the main issue easier to classify.",
            "It keeps the answer tied to realistic coursework interpretation rather than isolated definitions.",
        ],
        classContexts: [
            `${seed.shortTitle} review sessions`,
            "Mixed-topic case analysis",
            "Short-answer, reviewer, and board-style drills",
        ],
        whenToUse: [
            `Use this topic when the case is primarily about ${seed.focus}.`,
            "Use it before opening a calculator when classification and interpretation still feel shaky.",
            "Use it after a wrong answer when the issue was routing or framing, not arithmetic.",
        ],
        formulaOverview: [
            {
                label: "Review structure",
                expression:
                    "Classify the primary issue -> apply the core framework -> explain the consequence -> route to the next tool",
                explanation:
                    "These modules are designed to make students pause and structure the answer before chasing details.",
            },
        ],
        variableDefinitions: [
            { symbol: "Primary issue", meaning: "The first concept that should control route choice" },
            { symbol: "Decision consequence", meaning: "The effect, remedy, control response, or recommendation that follows" },
        ],
        procedure: [
            "Name the primary issue before chasing a familiar keyword.",
            "Separate the framework from the supporting facts and assumptions.",
            "State the likely consequence, response, or recommendation in plain language.",
            "Open the next calculator, workpaper, or lesson only after the issue map is clear.",
        ],
        workedExample: {
            title: `${seed.shortTitle} worked example`,
            scenario: seed.workedScenario,
            steps: [
                "Classify the issue and its supporting conditions.",
                "Apply the core framework to the facts.",
                "State the likely consequence or response.",
                "Choose the most useful follow-up route in AccCalc.",
            ],
            result: seed.workedResult,
            interpretation:
                "A good result is not just the final label. It is the structured explanation that makes the route choice defensible.",
        },
        checkpointExample: {
            title: `${seed.shortTitle} checkpoint`,
            scenario: seed.checkpointScenario,
            steps: [
                "Pause the first route choice.",
                "Check whether the primary issue was misread.",
                "Redirect the answer using the better framework.",
            ],
            result: seed.checkpointResult,
            interpretation:
                "The checkpoint is here to stop the wrong route before it contaminates the whole answer.",
        },
        interpretation: [
            `Strong ${seed.shortTitle.toLowerCase()} answers start with disciplined issue framing before detail.`,
            "Students usually lose points when they jump to a familiar term before identifying the main question.",
            "The best follow-up route is the one that matches the issue, not the one with the most numbers.",
        ],
        commonMistakes: [
            "Opening a calculator too early before naming the issue clearly.",
            "Treating supporting facts as if they were the primary issue.",
            "Stopping at a label without explaining the consequence or next action.",
        ],
        examTraps: [
            "The first keyword in the problem may not point to the correct route.",
            "Several subjects may appear together, but only one should control the first answer step.",
            "A nonnumeric case can still require a practical tool or workpaper after the conceptual frame is set.",
        ],
        selfCheck: [
            "What is the main issue here?",
            "What assumption or supporting fact changes the conclusion most?",
            "Which AccCalc route best fits the next step?",
        ],
        practiceCues: [
            "State the issue in one sentence before solving.",
            "Describe one likely wrong route and why it is tempting.",
            "Say what the student should open next inside AccCalc.",
        ],
        deepDiveSections:
            seed.deepDiveSections ??
            [
                {
                    id: `${seed.id}-framework`,
                    title: "Framework view",
                    summary:
                        "Use this section to keep the idea organized before it becomes a long unstructured answer.",
                    points: [
                        `Center the answer on ${seed.focus}.`,
                        "List assumptions only when they genuinely affect the answer.",
                        "Keep the final consequence visible, not hidden under terminology.",
                    ],
                },
            ],
        nextStepPrompts:
            seed.nextStepPrompts ?? [
                "Which calculator, workpaper, or reviewer route should open next?",
                "What is the clearest one-sentence conclusion you can defend?",
                "What assumption or evidence item still needs checking?",
            ],
        keywords: seed.keywords,
        scanSignals: seed.scanSignals,
        relatedCalculatorPaths: seed.relatedCalculatorPaths,
        relatedTopicIds: seed.relatedTopicIds,
        quiz: {
            title: `${seed.shortTitle} quick check`,
            intro: "Use this short quiz to confirm that the framework and next-step route are clear.",
            questions: [
                {
                    id: `${seed.id}-mc-1`,
                    kind: "multiple-choice",
                    prompt: "What is the best first move when this topic appears in a mixed case?",
                    choices: [
                        "Classify the primary issue before choosing a detailed route",
                        "Open the first familiar calculator immediately",
                        "Ignore the assumptions and focus only on the ending number",
                        "Treat all listed issues as equally important",
                    ],
                    answerIndex: 0,
                    explanation:
                        "These topics are designed to improve classification and route choice before students commit to detailed solving.",
                },
                {
                    id: `${seed.id}-tf-1`,
                    kind: "true-false",
                    prompt: "A good answer usually needs both a classification and a consequence or next-step explanation.",
                    answer: true,
                    explanation:
                        "The strongest review answers explain what the issue means, not just what it is called.",
                },
                {
                    id: `${seed.id}-short-1`,
                    kind: "short-answer",
                    prompt: "What should a student confirm before trusting the first route that comes to mind?",
                    acceptedAnswers: ["primary issue", "main issue", "route choice", "classification"],
                    explanation:
                        "The primary issue or route choice should be checked first so the answer does not drift into the wrong tool.",
                    placeholder: "Primary issue / route choice",
                },
            ],
        },
    };
}

export const STUDY_HUB_EXPANSION_1100_TOPICS: StudyTopic[] = [
    makeTopic({
        id: "ais-business-continuity-and-recovery-governance",
        title: "AIS Business Continuity and Recovery Governance",
        shortTitle: "Continuity and Recovery",
        category: "AIS / IT Controls",
        summary:
            "Review business continuity planning, disaster recovery, vendor dependence, incident response, and communication readiness in AIS cases.",
        intro:
            "AIS continuity questions often look technical, but students usually earn points by explaining recovery objectives, control readiness, and the practical response when systems fail.",
        focus: "AIS continuity posture, recovery gaps, and response readiness",
        workedScenario:
            "A company has daily backups but unclear incident escalation, weak vendor fallback, and an expected recovery time longer than the case RTO.",
        workedResult:
            "The better answer says backup design alone is not enough. The recovery gap and weak escalation path keep continuity risk elevated.",
        checkpointScenario:
            "A student concludes the continuity plan is strong because backups exist, even though communication and vendor dependence are weak.",
        checkpointResult:
            "Continuity strength comes from the full response chain, not just one technical control.",
        keywords: ["business continuity", "disaster recovery", "ais", "incident management", "rto"],
        scanSignals: ["business continuity", "disaster recovery", "recovery time objective", "incident response", "backup recovery"],
        relatedCalculatorPaths: ["/ais/business-continuity-planner", "/ais/ais-lifecycle-and-recovery", "/ais/it-control-matrix"],
        relatedTopicIds: ["it-governance-and-application-controls", "governance-control-environment-and-ethical-escalation"],
    }),
    makeTopic({
        id: "governance-control-environment-and-ethical-escalation",
        title: "Governance Control Environment and Ethical Escalation",
        shortTitle: "Control Environment",
        category: "Governance / Ethics / Risk",
        summary:
            "Review tone at the top, accountability, ethics programs, competence, and escalation logic when governance and internal-control cases need a clearer answer path.",
        intro:
            "Governance questions often stay too abstract. This module makes the control environment concrete by tying oversight, competence, escalation, and override risk together.",
        focus: "control-environment quality, override risk, and escalation readiness",
        workedScenario:
            "A finance team meets technical deadlines, but escalation channels are weak and management frequently overrides approval steps under pressure.",
        workedResult:
            "The answer should say the control environment is not strong enough because override risk and weak escalation undermine the rest of the framework.",
        checkpointScenario:
            "A student praises strong policy manuals without discussing actual enforcement or escalation behavior.",
        checkpointResult:
            "Documentation alone does not prove a strong control environment.",
        keywords: ["control environment", "good governance", "ethics", "management override", "escalation"],
        scanSignals: ["control environment", "good governance", "ethical pressure", "management override", "escalation"],
        relatedCalculatorPaths: ["/governance/control-environment-review", "/governance/risk-control-matrix", "/governance/ethics-decision-workspace"],
        relatedTopicIds: ["ais-business-continuity-and-recovery-governance", "audit-planning-materiality-risk-and-evidence"],
    }),
    makeTopic({
        id: "rfbt-defective-contracts-remedies-and-enforcement",
        title: "RFBT Defective Contracts, Remedies, and Enforcement",
        shortTitle: "Defective Contracts",
        category: "RFBT / Business Law",
        summary:
            "Review void, voidable, unenforceable, and rescissible contracts while keeping ratification, annulment, rescission, and enforcement consequences visible.",
        intro:
            "Students often memorize labels without understanding the legal consequence. This lesson keeps defect type, remedy, and enforceability tied together.",
        focus: "defect classification, enforceability, and remedy consequences",
        workedScenario:
            "A party claims intimidation affected consent, while the facts also suggest later acts that may confirm the agreement.",
        workedResult:
            "The case should be framed as potentially voidable, with ratification checked before concluding annulment is still available.",
        checkpointScenario:
            "A student immediately labels the contract void even though the issue is really vitiated consent.",
        checkpointResult:
            "The better route is to ask whether the case is voidable and whether later conduct changed the remedy.",
        keywords: ["defective contracts", "voidable", "unenforceable", "void", "rescissible"],
        scanSignals: ["defective contract", "voidable", "unenforceable", "rescissible", "annulment", "ratification"],
        relatedCalculatorPaths: ["/rfbt/defective-contracts-classifier", "/rfbt/obligations-contracts-flow", "/rfbt/business-law-review"],
        relatedTopicIds: ["commercial-law-securities-and-governance-review", "governance-control-environment-and-ethical-escalation"],
    }),
    makeTopic({
        id: "strategic-business-case-analysis-and-integration",
        title: "Strategic Business Case Analysis and Integration",
        shortTitle: "Business Case Analysis",
        category: "Strategic / Integrative",
        summary:
            "Review business-case structure by balancing market attractiveness, execution readiness, control readiness, and risk before making a recommendation.",
        intro:
            "Strategic questions feel stronger when students present an explicit recommendation supported by trade-offs instead of writing long unfocused commentary.",
        focus: "business-case recommendation quality and strategic trade-off framing",
        workedScenario:
            "A proposed expansion has strong market potential, moderate cost advantage, weak controls, and a nontrivial execution risk.",
        workedResult:
            "A solid answer recommends refining or staging the proposal instead of approving it blindly because controls and execution readiness still drag the case down.",
        checkpointScenario:
            "A student recommends full rollout just because the market signal is attractive.",
        checkpointResult:
            "Strategic cases need balanced evaluation, not one-metric enthusiasm.",
        keywords: ["business case", "strategic analysis", "consultancy", "execution readiness", "risk penalty"],
        scanSignals: ["business case", "strategic business analysis", "go no-go", "recommendation", "market attractiveness"],
        relatedCalculatorPaths: ["/strategic/business-case-analysis", "/strategic/strategic-business-analysis", "/strategic/balanced-scorecard-workspace"],
        relatedTopicIds: ["strategic-business-analysis-and-cost-management", "integrative-review-routing-and-case-prioritization"],
    }),
    {
        id: "far-receivables-estimation-and-cash-discount-discipline",
        title: "FAR: Receivables Estimation, Cash Discounts, and Notes Discipline",
        shortTitle: "Receivables and Discounts",
        category: "Financial Accounting",
        summary:
            "Connect allowance estimation, cash discounts, discounted notes, and related cash-control reading so receivables topics feel like one working family instead of isolated formulas.",
        intro:
            "Receivables problems often mix valuation, timing, and settlement language. This module keeps bad-debt estimation, cash-discount reading, and notes handling connected so students can classify the issue before choosing the tool.",
        whyItMatters: [
            "It ties receivables quality and collection incentives back to measurement and control.",
            "It helps students distinguish valuation estimates from collection-timing discounts and from note-discounting decisions.",
            "It reduces the common mistake of opening the wrong calculator just because the prompt mentions cash or interest.",
        ],
        classContexts: [
            "Allowance-for-doubtful-accounts problems",
            "Cash-discount and collection-terms drills",
            "Notes receivable and discounting reviewer cases",
        ],
        whenToUse: [
            "Use it when the case is really about collectibility, settlement terms, or note handling rather than a full bank reconciliation.",
            "Use it when the prompt mixes sales terms, bad-debt estimates, maturity value, or proceeds from discounting.",
            "Return here after a wrong calculator choice when the issue was receivable quality or settlement structure.",
        ],
        formulaOverview: [
            {
                label: "Required ending allowance",
                expression: "Required ending allowance = Receivable balance x estimated uncollectible rate",
                explanation:
                    "Use this when the case asks for the target allowance or the needed adjustment based on expected collectibility.",
            },
            {
                label: "Cash discount amount",
                expression: "Cash discount = Invoice amount x discount rate",
                explanation:
                    "Use this when the customer pays within the discount period and the issue is settlement terms, not note discounting.",
            },
            {
                label: "Bank discount",
                expression: "Bank discount = Maturity value x bank discount rate x time",
                explanation:
                    "Use this when a note is discounted before maturity and the question asks for proceeds or discount withheld.",
            },
        ],
        variableDefinitions: [
            { symbol: "Allowance", meaning: "The contra-asset estimate for expected uncollectibility" },
            { symbol: "Discount terms", meaning: "Early-payment incentive such as 2/10, n/30" },
            { symbol: "Maturity value", meaning: "Face value plus note interest at maturity" },
            { symbol: "Bank discount", meaning: "Amount withheld by the bank when a note is discounted" },
        ],
        procedure: [
            "Decide first whether the case is about valuation, settlement timing, or note discounting.",
            "If the issue is collectibility, estimate the required allowance or adjustment and explain the receivables-quality implication.",
            "If the issue is cash discount, confirm whether payment happened within the discount window before computing the discount amount.",
            "If the issue is note discounting, compute maturity value first, then the bank discount and proceeds.",
            "End with the business meaning: better collection, tighter valuation, or financing through note discounting.",
        ],
        workedExample: {
            title: "Receivables family worked example",
            scenario:
                "A company estimates 4% of a 900,000 receivable balance as uncollectible, offers 2/10, n/30 terms on a 120,000 invoice, and later discounts a note with maturity value of 210,000.",
            steps: [
                "Separate the three issues: allowance estimation, cash discount terms, and note discounting.",
                "Required allowance is 900,000 x 4% = 36,000.",
                "Cash discount on the invoice is 120,000 x 2% = 2,400 if payment is within the discount period.",
                "For the note, compute the bank discount from the maturity value and discount rate, then subtract it from maturity value to get proceeds.",
            ],
            result:
                "The lesson is not one single number. It is the ability to route allowance, discount-terms, and discounted-note questions correctly.",
            interpretation:
                "Receivables topics are safer when students stop treating every cash-related prompt as the same problem type.",
        },
        checkpointExample: {
            title: "Receivables routing checkpoint",
            scenario:
                "A student uses a cash-discount formula on a note-discounting problem because both mention a discount.",
            steps: [
                "Check whether the discount comes from customer payment terms or from discounting a note before maturity.",
                "If the case involves maturity value and bank withholding, switch to note-discounting logic.",
                "Recompute using the correct route.",
            ],
            result:
                "The correct route is note discounting, not customer cash-discount terms.",
            interpretation:
                "Terminology overlap is one of the main reasons students choose the wrong calculator for receivables problems.",
        },
        interpretation: [
            "Allowance estimation is about receivable quality and expected credit loss.",
            "Cash discounts are about collection incentives and settlement timing.",
            "Discounted notes are financing transactions that must be read through maturity value and bank discount.",
        ],
        commonMistakes: [
            "Confusing cash discounts with bank discounting of notes.",
            "Computing the allowance without stating what balance or rate was used.",
            "Opening a bank-reconciliation route when the actual issue is receivables valuation or note handling.",
        ],
        examTraps: [
            "The word discount may point to customer terms or to note discounting, and they are not solved the same way.",
            "A receivables case can ask for the needed adjustment, not just the required ending allowance.",
            "The strongest answer usually explains what the number says about collectibility or settlement, not just the arithmetic.",
        ],
        selfCheck: [
            "How do you tell a cash-discount question from a note-discounting question?",
            "What does the allowance estimate say about receivables quality?",
            "Why should maturity value be computed before bank discount on a note?",
        ],
        practiceCues: [
            "State whether the case is valuation, settlement timing, or note discounting before solving.",
            "Say which tool best fits the prompt and why.",
            "Explain the business meaning of the result in one sentence.",
        ],
        deepDiveSections: [
            {
                id: "receivables-routing",
                title: "Routing discipline",
                summary:
                    "Use this section when several receivable-related terms appear in one prompt and the correct route is getting blurry.",
                points: [
                    "Allowance problems are estimation and valuation issues.",
                    "Cash-discount problems are settlement-term issues.",
                    "Discounted-note problems are financing and proceeds issues.",
                ],
                tone: "info",
            },
        ],
        nextStepPrompts: [
            "Which receivables tool should open first for this case?",
            "Does the prompt really ask for valuation, settlement, or note-discounting logic?",
            "What part of the result should be explained after the number is computed?",
        ],
        keywords: [
            "allowance method",
            "cash discount",
            "notes receivable",
            "bank discount",
            "receivables quality",
        ],
        scanSignals: [
            "estimated uncollectible rate",
            "2/10 n/30",
            "maturity value",
            "bank discount",
            "discounted note",
        ],
        relatedCalculatorPaths: [
            "/accounting/allowance-doubtful-accounts",
            "/accounting/cash-discount",
            "/accounting/notes-receivable-discounting",
            "/accounting/bank-reconciliation",
        ],
        relatedTopicIds: [
            "bank-reconciliation-review",
            "working-capital-and-control-review",
            "accounting-foundations-review",
        ],
        quiz: {
            title: "Receivables and Discounting Check",
            intro:
                "Use this set to verify whether you can separate receivable valuation, settlement discounts, and note discounting before computing.",
            questions: [
                {
                    id: "receivables-q1",
                    kind: "multiple-choice",
                    prompt:
                        "Which issue is most likely being tested when the prompt gives a receivable balance and an estimated uncollectible rate?",
                    choices: [
                        "Allowance estimation",
                        "Bank reconciliation timing",
                        "Cash budget financing",
                        "Price elasticity",
                    ],
                    answerIndex: 0,
                    explanation:
                        "A receivable balance with an estimated uncollectible rate usually points to allowance estimation or the needed bad-debt adjustment.",
                },
                {
                    id: "receivables-q2",
                    kind: "multiple-choice",
                    prompt:
                        "The phrase 2/10, n/30 most directly points to which route?",
                    choices: [
                        "Customer cash discount terms",
                        "Bond premium amortization",
                        "Inventory write-down",
                        "Corporate liquidation",
                    ],
                    answerIndex: 0,
                    explanation:
                        "Terms such as 2/10, n/30 describe an early-payment discount for the customer, not a bank discount on a note.",
                },
                {
                    id: "receivables-q3",
                    kind: "true-false",
                    prompt:
                        "A bank discount on a note is usually computed after maturity value is identified.",
                    answer: true,
                    explanation:
                        "The note-discounting workflow typically computes maturity value first, then determines the bank discount and proceeds.",
                },
                {
                    id: "receivables-q4",
                    kind: "short-answer",
                    prompt:
                        "What should a student confirm first when both the words discount and note appear in the same problem?",
                    acceptedAnswers: [
                        "whether it is cash discount or note discounting",
                        "whether the discount is customer terms or bank discount",
                        "the type of discount",
                    ],
                    explanation:
                        "The first routing question is whether the discount comes from customer settlement terms or from discounting a note before maturity.",
                    placeholder: "Type of discount / route",
                },
            ],
        },
    },
    {
        id: "managerial-cost-behavior-and-margin-safety",
        title: "Managerial: Cost Behavior, Margin of Safety, and High-Low Estimation",
        shortTitle: "Cost Behavior and Safety",
        category: "Managerial & Cost Accounting",
        summary:
            "Connect high-low estimation, contribution thinking, margin of safety, and target-profit planning so cost-behavior problems lead into better managerial decisions.",
        intro:
            "Cost-behavior problems become more useful when students move from estimating the mixed-cost pattern into break-even, target-profit, and margin-of-safety interpretation instead of stopping at one formula.",
        whyItMatters: [
            "It ties estimation and planning together in a way that mirrors classroom managerial cases.",
            "It strengthens the link between cost-behavior assumptions and later CVP answers.",
            "It helps students explain whether the current sales plan is fragile or resilient after the estimate is made.",
        ],
        classContexts: [
            "High-low cost estimation exercises",
            "Margin-of-safety and target-profit drills",
            "Managerial planning cases that start with mixed-cost behavior",
        ],
        whenToUse: [
            "Use it when the case starts with mixed cost data and then asks for planning interpretation.",
            "Use it when you need to estimate variable and fixed cost before a CVP or margin-of-safety answer.",
            "Use it after a weak planning answer when the real problem was a shaky cost-behavior estimate.",
        ],
        formulaOverview: [
            {
                label: "Variable cost per unit from high-low",
                expression: "Variable cost per unit = Change in total cost / Change in activity",
                explanation:
                    "This estimate is the first step before building the fixed-cost portion of the mixed cost.",
            },
            {
                label: "Margin of safety",
                expression: "Margin of safety = Actual or expected sales - Break-even sales",
                explanation:
                    "This measures the buffer before sales fall to the break-even threshold.",
            },
            {
                label: "Target-profit units",
                expression: "Required units = (Fixed costs + Target profit) / Contribution margin per unit",
                explanation:
                    "Use this after the cost behavior and contribution margin have been clarified.",
            },
        ],
        variableDefinitions: [
            { symbol: "Mixed cost", meaning: "A cost that contains both fixed and variable components" },
            { symbol: "Contribution margin", meaning: "Selling price less variable cost per unit" },
            { symbol: "Break-even sales", meaning: "The sales level where operating income is zero" },
            { symbol: "Margin of safety", meaning: "The gap between expected sales and break-even sales" },
        ],
        procedure: [
            "Estimate the variable portion first if the case begins with mixed-cost observations.",
            "Back into the fixed-cost component from either the high or low activity point.",
            "Use the estimated cost behavior to compute contribution margin and break-even structure.",
            "Translate the result into margin-of-safety or target-profit language as requested.",
            "Interpret whether the plan is comfortably above break-even or still exposed.",
        ],
        workedExample: {
            title: "Cost behavior into planning example",
            scenario:
                "A mixed cost rises from 120,000 at 8,000 units to 156,000 at 14,000 units. The product sells for 45 per unit, and management wants to know whether expected sales leave enough safety margin.",
            steps: [
                "High-low variable cost = (156,000 - 120,000) / (14,000 - 8,000) = 6 per unit.",
                "Fixed cost = 120,000 - (8,000 x 6) = 72,000.",
                "Use the estimated cost behavior inside the CVP model to compute break-even and the margin-of-safety buffer.",
                "Interpret whether expected sales are comfortably above the break-even line or only slightly above it.",
            ],
            result:
                "The value of the lesson is the bridge from estimation into planning, not the estimate by itself.",
            interpretation:
                "Students should explain how a mixed-cost estimate changes the later planning answer instead of treating the topics separately.",
        },
        checkpointExample: {
            title: "Planning checkpoint",
            scenario:
                "A student computes the high-low estimate but never uses it to comment on margin of safety or target-profit pressure.",
            steps: [
                "Ask what managerial decision the estimate was supposed to support.",
                "Move from estimated fixed and variable cost into break-even or target-profit analysis.",
                "State whether the sales plan still has enough buffer.",
            ],
            result:
                "A high-low answer is incomplete if it never reaches the planning implication.",
            interpretation:
                "Managerial questions usually reward the decision meaning of the estimate, not just the estimate itself.",
        },
        interpretation: [
            "High-low estimation is a means to planning, not the final destination.",
            "Margin of safety is one of the clearest ways to explain whether a plan is fragile.",
            "A shaky cost estimate can contaminate every later CVP answer, so assumptions should be stated honestly.",
        ],
        commonMistakes: [
            "Stopping at the variable-cost estimate and forgetting to compute the fixed portion.",
            "Using the high-low estimate without explaining its assumption limits.",
            "Treating a small positive margin of safety as if it guarantees a strong plan.",
        ],
        examTraps: [
            "The data may ask for estimation first and then quietly shift into planning.",
            "A case can ask for units in one part and sales peso interpretation in another.",
            "A small buffer above break-even can still imply high operating pressure.",
        ],
        selfCheck: [
            "Why does a mixed-cost estimate matter to CVP analysis?",
            "What does margin of safety say that break-even alone does not?",
            "When should a student be cautious about a high-low estimate?",
        ],
        practiceCues: [
            "Estimate the cost behavior, then say which planning question it unlocks.",
            "Explain whether the plan is only barely safe or comfortably above break-even.",
            "State one assumption weakness in the estimate before trusting the result.",
        ],
        deepDiveSections: [
            {
                id: "cost-behavior-link",
                title: "Estimation to planning link",
                summary:
                    "Use this section when the problem feels split between cost-behavior estimation and later planning interpretation.",
                points: [
                    "High-low creates the cost structure used by later CVP analysis.",
                    "Margin of safety explains buffer, not just break-even.",
                    "Target-profit planning only becomes meaningful after contribution margin is grounded in a defensible cost estimate.",
                ],
                tone: "accent",
            },
        ],
        nextStepPrompts: [
            "Does the case stop at estimation, or is the estimate meant to support a CVP answer?",
            "How fragile is the sales plan after the estimate is used?",
            "Which managerial tool should open next: high-low, break-even, target profit, or margin of safety?",
        ],
        keywords: [
            "high-low method",
            "margin of safety",
            "mixed cost",
            "cost behavior",
            "target profit",
        ],
        scanSignals: [
            "highest activity level",
            "lowest activity level",
            "mixed cost",
            "margin of safety",
            "target profit",
        ],
        relatedCalculatorPaths: [
            "/business/high-low-cost-estimation",
            "/business/margin-of-safety",
            "/business/break-even",
            "/business/target-profit",
        ],
        relatedTopicIds: [
            "cvp-core",
            "budgeting-and-planning-review",
            "managerial-performance-reports-and-budget-variance",
        ],
        quiz: {
            title: "Cost Behavior and Margin Safety Check",
            intro:
                "Use this set to verify whether you can connect mixed-cost estimation to break-even and planning interpretation.",
            questions: [
                {
                    id: "cost-behavior-q1",
                    kind: "multiple-choice",
                    prompt:
                        "What is usually computed first in the high-low method?",
                    choices: [
                        "Variable cost per unit",
                        "Margin of safety percentage",
                        "Allowance for doubtful accounts",
                        "Net present value",
                    ],
                    answerIndex: 0,
                    explanation:
                        "The high-low method first estimates the variable portion per unit from the cost change over the activity change.",
                },
                {
                    id: "cost-behavior-q2",
                    kind: "multiple-choice",
                    prompt:
                        "Which statement best describes margin of safety?",
                    choices: [
                        "The sales buffer above break-even",
                        "The fixed cost per unit",
                        "The amount of bank discount on a note",
                        "The total expected uncollectible amount",
                    ],
                    answerIndex: 0,
                    explanation:
                        "Margin of safety measures how far expected or actual sales sit above the break-even threshold.",
                },
                {
                    id: "cost-behavior-q3",
                    kind: "true-false",
                    prompt:
                        "A weak cost-behavior estimate can distort later target-profit planning.",
                    answer: true,
                    explanation:
                        "CVP and target-profit answers rely on the estimated fixed and variable cost pattern, so a weak estimate can contaminate the later planning result.",
                },
                {
                    id: "cost-behavior-q4",
                    kind: "short-answer",
                    prompt:
                        "Why should a student move past the high-low estimate into a planning interpretation?",
                    acceptedAnswers: [
                        "because the estimate supports break-even or target profit",
                        "because it helps planning",
                        "because it shows margin of safety",
                    ],
                    explanation:
                        "Managerial cases usually use the estimate to support a planning judgment such as break-even, target profit, or margin-of-safety reading.",
                    placeholder: "Planning use of the estimate",
                },
            ],
        },
    },
];
