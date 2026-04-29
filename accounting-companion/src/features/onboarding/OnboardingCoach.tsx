import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ViewportPortal from "../../components/ViewportPortal";
import { APP_VERSION } from "../../utils/appRelease";
import {
    finishOnboardingTour,
    resolveReturningPrompt,
    setOnboardingStep,
    startOnboardingTour,
    useOnboardingState,
} from "./onboardingState";
import { getOnboardingTour, type OnboardingStep } from "./onboardingTours";
import {
    ONBOARDING_ACTION_EVENT,
    type OnboardingActionDetail,
} from "./onboardingEvents";

type ShellAction = "open-navigation" | "open-search" | "open-settings";

type OnboardingCoachProps = {
    launches: number;
    disabled?: boolean;
    onRequestShellAction: (action: ShellAction) => void;
};

type TargetBox = {
    top: number;
    left: number;
    width: number;
    height: number;
};

type CardPlacement = {
    mode: "center" | "bottom" | "anchored";
    style: CSSProperties;
};

const STEP_TIMEOUT_MS = 8000;

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function routeMatches(currentPath: string, expectedPath: string) {
    if (expectedPath === "/") return currentPath === "/";
    return currentPath === expectedPath || currentPath.startsWith(`${expectedPath}/`);
}

function findTarget(step: OnboardingStep | null) {
    if (!step?.targetSelector || typeof document === "undefined") return null;

    try {
        const candidates = Array.from(document.querySelectorAll<HTMLElement>(step.targetSelector));
        return (
            candidates.find((candidate) => {
                const rect = candidate.getBoundingClientRect();
                const style = window.getComputedStyle(candidate);
                return (
                    rect.width > 0 &&
                    rect.height > 0 &&
                    style.visibility !== "hidden" &&
                    style.display !== "none"
                );
            }) ?? null
        );
    } catch {
        return null;
    }
}

function getTargetBox(target: HTMLElement | null): TargetBox | null {
    if (!target) return null;
    const rect = target.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
    };
}

function getCardPlacement(box: TargetBox | null): CardPlacement {
    if (typeof window === "undefined") {
        return { mode: "center", style: {} };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cardWidth = Math.min(420, Math.max(300, viewportWidth - 32));
    const safeTop = 16;
    const safeBottom = 16;

    if (viewportWidth < 768) {
        return {
            mode: "bottom",
            style: {
                left: "0.75rem",
                width: `${Math.max(280, Math.min(340, viewportWidth - 24))}px`,
                bottom: "calc(var(--app-mobile-nav-height, 0px) + env(safe-area-inset-bottom, 0px) + 0.85rem)",
            },
        };
    }

    if (!box) {
        return {
            mode: "center",
            style: {
                width: `${cardWidth}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
            },
        };
    }

    const gap = 18;
    const cardHeightEstimate = 270;
    const useRightSide = box.left + box.width + gap + cardWidth <= viewportWidth - 16;
    const useLeftSide = box.left - gap - cardWidth >= 16;
    const top = clamp(
        box.top + box.height / 2 - cardHeightEstimate / 2,
        safeTop,
        Math.max(safeTop, viewportHeight - cardHeightEstimate - safeBottom)
    );

    if (useRightSide || !useLeftSide) {
        return {
            mode: "anchored",
            style: {
                width: `${cardWidth}px`,
                left: `${clamp(box.left + box.width + gap, 16, viewportWidth - cardWidth - 16)}px`,
                top: `${top}px`,
            },
        };
    }

    return {
        mode: "anchored",
        style: {
            width: `${cardWidth}px`,
            left: `${clamp(box.left - cardWidth - gap, 16, viewportWidth - cardWidth - 16)}px`,
            top: `${top}px`,
        },
    };
}

function StepProgress({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: total }).map((_, index) => (
                <span
                    key={index}
                    className={[
                        "h-1.5 rounded-full transition-all",
                        index === current
                            ? "w-7 bg-[color:var(--app-accent)]"
                            : index < current
                              ? "w-3 bg-[color:var(--app-accent)]/70"
                              : "w-3 bg-[color:var(--app-border)]",
                    ].join(" ")}
                />
            ))}
        </div>
    );
}

export default function OnboardingCoach({
    launches,
    disabled = false,
    onRequestShellAction,
}: OnboardingCoachProps) {
    const state = useOnboardingState();
    const location = useLocation();
    const navigate = useNavigate();
    const promptShownRef = useRef(false);
    const [returningPromptOpen, setReturningPromptOpen] = useState(false);
    const [completedActions, setCompletedActions] = useState<Set<string>>(() => new Set());
    const [inputTouched, setInputTouched] = useState(false);
    const [targetBox, setTargetBox] = useState<TargetBox | null>(null);
    const [targetMissing, setTargetMissing] = useState(false);
    const [stepTimedOut, setStepTimedOut] = useState(false);

    const activeTour = state.activeTourId ? getOnboardingTour(state.activeTourId) : null;
    const activeStep = activeTour?.steps[state.activeStepIndex] ?? null;
    const totalSteps = activeTour?.steps.length ?? 0;
    const placement = useMemo(() => getCardPlacement(targetBox), [targetBox]);
    const isLastStep = activeTour ? state.activeStepIndex >= activeTour.steps.length - 1 : false;

    const stepComplete = useMemo(() => {
        if (!activeStep) return false;
        if (activeStep.completion.type === "manual") return false;
        if (activeStep.completion.type === "route") {
            return routeMatches(location.pathname, activeStep.completion.path);
        }
        if (activeStep.completion.type === "action") {
            return completedActions.has(activeStep.completion.action);
        }
        return inputTouched;
    }, [activeStep, completedActions, inputTouched, location.pathname]);

    const advance = useCallback(() => {
        if (!activeTour) return;

        if (isLastStep) {
            finishOnboardingTour("completed");
            return;
        }

        setInputTouched(false);
        setStepTimedOut(false);
        setOnboardingStep(state.activeStepIndex + 1);
    }, [activeTour, isLastStep, state.activeStepIndex]);

    useEffect(() => {
        if (disabled || state.activeTourId || promptShownRef.current) return;

        const firstTourFresh = state.firstTourStatus === "not-started";
        if (firstTourFresh && launches <= 1) {
            promptShownRef.current = true;
            startOnboardingTour("first-run");
            return;
        }

        const returningPromptDue =
            launches > 1 &&
            !state.returningDismissedForever &&
            state.returningPromptVersion !== APP_VERSION &&
            state.returningPromptStatus !== "completed";

        if (returningPromptDue) {
            promptShownRef.current = true;
            setReturningPromptOpen(true);
        }
    }, [
        launches,
        state.activeTourId,
        state.firstTourStatus,
        state.returningDismissedForever,
        state.returningPromptStatus,
        state.returningPromptVersion,
        disabled,
    ]);

    useEffect(() => {
        setCompletedActions(new Set());
        setInputTouched(false);
        setStepTimedOut(false);
    }, [activeStep?.id]);

    useEffect(() => {
        function recordAction(action: string) {
            setCompletedActions((current) => {
                if (current.has(action)) return current;
                const next = new Set(current);
                next.add(action);
                return next;
            });
        }

        function handleCustomAction(event: Event) {
            const action = (event as CustomEvent<OnboardingActionDetail>).detail?.action;
            if (action) recordAction(action);
        }

        function handleClick(event: MouseEvent) {
            const target = event.target as Element | null;
            const action = target?.closest<HTMLElement>("[data-onboarding-action]")?.dataset
                .onboardingAction;
            if (action) recordAction(action);
        }

        function handleInput(event: Event) {
            const target = event.target as Element | null;
            if (target?.matches("input, textarea, select")) {
                setInputTouched(true);
            }
        }

        window.addEventListener(ONBOARDING_ACTION_EVENT, handleCustomAction);
        document.addEventListener("click", handleClick, true);
        document.addEventListener("focusin", handleInput, true);
        document.addEventListener("input", handleInput, true);

        return () => {
            window.removeEventListener(ONBOARDING_ACTION_EVENT, handleCustomAction);
            document.removeEventListener("click", handleClick, true);
            document.removeEventListener("focusin", handleInput, true);
            document.removeEventListener("input", handleInput, true);
        };
    }, []);

    useEffect(() => {
        if (!activeStep) return;
        const step = activeStep;

        function refreshTarget() {
            const target = findTarget(step);
            const nextBox = getTargetBox(target);
            setTargetBox(nextBox);
            setTargetMissing(Boolean(step.targetSelector) && !nextBox);

            if (target && step.targetSelector) {
                target.scrollIntoView({
                    block: "center",
                    inline: "nearest",
                    behavior: "smooth",
                });
            }
        }

        refreshTarget();
        const resizeObserver =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(refreshTarget)
                : null;
        if (resizeObserver && document.body) resizeObserver.observe(document.body);

        window.addEventListener("resize", refreshTarget);
        window.addEventListener("scroll", refreshTarget, true);
        const timeout = window.setTimeout(refreshTarget, 450);

        return () => {
            window.clearTimeout(timeout);
            resizeObserver?.disconnect();
            window.removeEventListener("resize", refreshTarget);
            window.removeEventListener("scroll", refreshTarget, true);
        };
    }, [activeStep, location.pathname]);

    useEffect(() => {
        if (!activeStep || activeStep.completion.type === "manual") return;
        const timeout = window.setTimeout(() => setStepTimedOut(true), STEP_TIMEOUT_MS);
        return () => window.clearTimeout(timeout);
    }, [activeStep]);

    useEffect(() => {
        if (!stepComplete || !activeStep) return;
        const timeout = window.setTimeout(advance, 520);
        return () => window.clearTimeout(timeout);
    }, [activeStep, advance, stepComplete]);

    function handlePrimary() {
        if (!activeStep) return;

        if (activeStep.routeTo && !routeMatches(location.pathname, activeStep.routeTo)) {
            navigate(activeStep.routeTo);
            return;
        }

        if (activeStep.requestAction) {
            onRequestShellAction(activeStep.requestAction);
            return;
        }

        advance();
    }

    function handleContinueAnyway() {
        advance();
    }

    function handleSkip() {
        finishOnboardingTour("skipped");
    }

    function handleDismiss() {
        finishOnboardingTour("dismissed");
    }

    function startQuickTour() {
        setReturningPromptOpen(false);
        startOnboardingTour("quick");
    }

    function skipReturningPrompt() {
        setReturningPromptOpen(false);
        resolveReturningPrompt("skipped");
    }

    function dismissReturningPrompt() {
        setReturningPromptOpen(false);
        resolveReturningPrompt("dismissed");
    }

    if (!activeTour && !returningPromptOpen) return null;

    return (
        <ViewportPortal>
            <>
                {returningPromptOpen ? (
                    <div className="acc-onboarding-prompt fixed z-[130]">
                        <div className="app-panel-elevated rounded-[1.35rem] p-4.5 shadow-[var(--app-shadow-lg)]">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="app-kicker text-[0.66rem]">AccCalc {APP_VERSION}</p>
                                    <h2 className="mt-2 text-lg font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                        Want the quick tour?
                                    </h2>
                                    <p className="app-body-md mt-2 text-sm leading-6">
                                        A short reintroduction can show the best entry points without replaying the full beginner flow.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={skipReturningPrompt}
                                    className="app-icon-button rounded-xl p-2"
                                    aria-label="Close quick tour prompt"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={startQuickTour}
                                    className="app-button-primary rounded-xl px-4 py-2 text-sm font-semibold"
                                >
                                    Start quick tour
                                </button>
                                <button
                                    type="button"
                                    onClick={skipReturningPrompt}
                                    className="app-button-secondary rounded-xl px-4 py-2 text-sm font-semibold"
                                >
                                    Skip
                                </button>
                                <button
                                    type="button"
                                    onClick={dismissReturningPrompt}
                                    className="app-button-ghost rounded-xl px-4 py-2 text-sm font-semibold"
                                >
                                    Do not show again
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}

                {activeTour && activeStep ? (
                    <div className="acc-onboarding-layer fixed inset-0 z-[125] pointer-events-none">
                        {targetBox ? (
                            <div
                                className="acc-onboarding-spotlight"
                                style={{
                                    top: `${Math.max(8, targetBox.top - 8)}px`,
                                    left: `${Math.max(8, targetBox.left - 8)}px`,
                                    width: `${targetBox.width + 16}px`,
                                    height: `${targetBox.height + 16}px`,
                                }}
                            />
                        ) : null}

                        <section
                            className={[
                                "acc-onboarding-card app-panel-elevated pointer-events-auto fixed rounded-[1.35rem] p-4.5 shadow-[var(--app-shadow-lg)]",
                                placement.mode === "bottom" ? "acc-onboarding-card--bottom" : "",
                            ].join(" ")}
                            style={placement.style}
                            role="dialog"
                            aria-modal="false"
                            aria-label={`${activeTour.title}: ${activeStep.title}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="app-kicker text-[0.66rem]">
                                        {activeTour.title} · {state.activeStepIndex + 1} of {totalSteps}
                                    </p>
                                    <h2 className="mt-2 text-lg font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                        {activeStep.title}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleDismiss}
                                    className="app-icon-button rounded-xl p-2"
                                    aria-label="Close tutorial"
                                >
                                    ×
                                </button>
                            </div>

                            <p className="app-body-md mt-3 text-sm leading-6">{activeStep.body}</p>

                            {targetMissing || stepTimedOut ? (
                                <div className="app-tone-warning mt-3 rounded-[1rem] px-3.5 py-3 text-xs leading-5">
                                    {targetMissing
                                        ? activeStep.fallback ??
                                          "This target is not visible in the current layout. You can continue without losing the tour."
                                        : "Still waiting for that action. You can continue if you already know where this lives."}
                                </div>
                            ) : null}

                            {stepComplete ? (
                                <div className="app-tone-success mt-3 rounded-[1rem] px-3.5 py-3 text-xs font-semibold">
                                    Nice. AccCalc detected the action and will continue.
                                </div>
                            ) : null}

                            <div className="mt-4">
                                <StepProgress current={state.activeStepIndex} total={totalSteps} />
                            </div>

                            <div className="acc-onboarding-actions mt-4 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={handlePrimary}
                                        className="app-button-primary rounded-xl px-4 py-2 text-sm font-semibold"
                                    >
                                        {isLastStep
                                            ? "Finish"
                                            : activeStep.primaryLabel ?? "Continue"}
                                    </button>
                                    {activeStep.completion.type !== "manual" &&
                                    (stepTimedOut || targetMissing) ? (
                                        <button
                                            type="button"
                                            onClick={handleContinueAnyway}
                                            className="app-button-secondary rounded-xl px-4 py-2 text-sm font-semibold"
                                        >
                                            Continue anyway
                                        </button>
                                    ) : null}
                                    {state.activeStepIndex > 0 ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOnboardingStep(state.activeStepIndex - 1)
                                            }
                                            className="app-button-ghost rounded-xl px-4 py-2 text-sm font-semibold"
                                        >
                                            Back
                                        </button>
                                    ) : null}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSkip}
                                    className="app-button-ghost rounded-xl px-4 py-2 text-sm font-semibold"
                                >
                                    Skip
                                </button>
                            </div>
                        </section>
                    </div>
                ) : null}
            </>
        </ViewportPortal>
    );
}
