export type OnboardingTourId = "first-run" | "quick";

export type OnboardingCompletion =
    | { type: "manual" }
    | { type: "route"; path: string }
    | { type: "action"; action: string }
    | { type: "input" };

export type OnboardingStep = {
    id: string;
    title: string;
    body: string;
    targetSelector?: string;
    completion: OnboardingCompletion;
    primaryLabel?: string;
    requestAction?: "open-navigation" | "open-search" | "open-settings";
    routeTo?: string;
    fallback?: string;
};

export type OnboardingTour = {
    id: OnboardingTourId;
    title: string;
    summary: string;
    steps: OnboardingStep[];
};

const FIRST_RUN_STEPS: OnboardingStep[] = [
    {
        id: "welcome",
        title: "Welcome to AccCalc",
        body: "Use AccCalc to solve accounting problems, study the method, practice with quizzes, and keep workpapers close by.",
        completion: { type: "manual" },
        primaryLabel: "Start tour",
    },
    {
        id: "home",
        title: "Start from the next task",
        body: "Home keeps the main choices together: solve a typed prompt, scan work, continue study, or open workpapers.",
        targetSelector: '[data-onboarding-target="home-hero"]',
        completion: { type: "route", path: "/" },
        routeTo: "/",
        primaryLabel: "Open Home",
    },
    {
        id: "navigation",
        title: "Open navigation when you need the full map",
        body: "The menu groups calculators, lessons, review tools, and workspaces by subject family. Open it once so you know where the library lives.",
        targetSelector:
            '[data-onboarding-target="mobile-menu"], [data-onboarding-target="desktop-sidebar-toggle"], [data-onboarding-target="sidebar"]',
        completion: { type: "action", action: "navigation-opened" },
        requestAction: "open-navigation",
        primaryLabel: "Open navigation",
        fallback: "If the sidebar is already visible on desktop, you can continue after checking the subject groups.",
    },
    {
        id: "search",
        title: "Search is the fastest route when you know the topic",
        body: "Type aliases like FIFO, CVP, VAT, materiality, or bonds. Search checks route titles, abbreviations, categories, tags, and close misspellings.",
        targetSelector:
            '[data-onboarding-target="global-search"], [data-onboarding-target="home-search"], [data-onboarding-target="mobile-search"]',
        completion: { type: "action", action: "search-opened" },
        requestAction: "open-search",
        primaryLabel: "Try search",
    },
    {
        id: "solver",
        title: "Use Smart Solver when the starting point is unclear",
        body: "Smart Solver reads a problem-style prompt and recommends the best calculator, lesson, or review route before you browse manually.",
        targetSelector: '[data-onboarding-target="smart-solver-entry"]',
        completion: { type: "route", path: "/smart/solver" },
        routeTo: "/smart/solver",
        primaryLabel: "Open Solver",
    },
    {
        id: "calculator",
        title: "Calculators are built around the problem data",
        body: "Open a calculator, enter the values you know, then read the result and study support. The tour will wait until you interact with an input.",
        targetSelector: "#section-inputs",
        completion: { type: "input" },
        routeTo: "/business/break-even",
        primaryLabel: "Open a calculator",
        fallback: "If this page has no visible input yet, open any calculator and focus one field.",
    },
    {
        id: "study",
        title: "Study Hub is for learning before solving",
        body: "Lessons, reviewer notes, quizzes, and follow-up routes help you understand the method instead of only getting an answer.",
        targetSelector: '[data-onboarding-target="study-entry"]',
        completion: { type: "route", path: "/study" },
        routeTo: "/study",
        primaryLabel: "Open Study Hub",
    },
    {
        id: "workpapers",
        title: "Workpapers keep longer assignments organized",
        body: "Use Workpaper Studio for templates, support schedules, and mixed review sheets when the answer needs documentation.",
        targetSelector: '[data-onboarding-target="workpapers-entry"]',
        completion: { type: "route", path: "/workpapers" },
        routeTo: "/workpapers",
        primaryLabel: "Open Workpapers",
    },
    {
        id: "settings",
        title: "Replay help from Settings",
        body: "Settings now includes replay controls for the full tutorial, the quick tour, and onboarding state reset.",
        targetSelector: '[data-onboarding-target="settings"]',
        completion: { type: "action", action: "settings-opened" },
        requestAction: "open-settings",
        primaryLabel: "Open Settings",
    },
    {
        id: "finish",
        title: "You are ready to use the app",
        body: "Use the loop that fits the task: learn the topic, practice it, solve it, then save or review your work.",
        completion: { type: "manual" },
        primaryLabel: "Finish",
    },
];

const QUICK_STEPS: OnboardingStep[] = [
    {
        id: "quick-welcome",
        title: "Welcome back",
        body: "Here is the short version: search when you know the topic, Smart Solver when you do not, and Study Hub when you need review before solving.",
        completion: { type: "manual" },
        primaryLabel: "Start quick tour",
    },
    {
        id: "quick-search",
        title: "Search or Solver first",
        body: "Use search for known tools and Smart Solver for problem-style prompts. Both lead into calculators, lessons, and practice routes.",
        targetSelector:
            '[data-onboarding-target="global-search"], [data-onboarding-target="home-search"], [data-onboarding-target="smart-solver-entry"]',
        completion: { type: "action", action: "search-opened" },
        requestAction: "open-search",
        primaryLabel: "Open search",
        fallback: "You can also open Smart Solver from the Home page or bottom navigation.",
    },
    {
        id: "quick-study",
        title: "Use Study Hub when the method matters",
        body: "Lessons and quizzes now connect back to calculators so practice does not become a dead end.",
        targetSelector: '[data-onboarding-target="study-entry"]',
        completion: { type: "route", path: "/study" },
        routeTo: "/study",
        primaryLabel: "Open Study Hub",
    },
    {
        id: "quick-settings",
        title: "Replay this any time",
        body: "Settings has the tutorial controls, including full replay, quick replay, and reset.",
        targetSelector: '[data-onboarding-target="settings"]',
        completion: { type: "action", action: "settings-opened" },
        requestAction: "open-settings",
        primaryLabel: "Open Settings",
    },
    {
        id: "quick-finish",
        title: "You are set",
        body: "Dismiss this short tour and keep working. It will not keep coming back unless you replay it from Settings.",
        completion: { type: "manual" },
        primaryLabel: "Finish",
    },
];

export const ONBOARDING_TOURS: Record<OnboardingTourId, OnboardingTour> = {
    "first-run": {
        id: "first-run",
        title: "First-time tutorial",
        summary: "A guided walk through Home, navigation, search, Smart Solver, calculators, Study Hub, Workpapers, and Settings.",
        steps: FIRST_RUN_STEPS,
    },
    quick: {
        id: "quick",
        title: "Quick reintroduction",
        summary: "A compact refresher for returning users after this release.",
        steps: QUICK_STEPS,
    },
};

export function getOnboardingTour(tourId: OnboardingTourId) {
    return ONBOARDING_TOURS[tourId];
}
