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
];
