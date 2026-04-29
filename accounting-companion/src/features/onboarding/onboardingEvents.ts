export const ONBOARDING_ACTION_EVENT = "accalc-onboarding-action";

export type OnboardingActionDetail = {
    action: string;
};

export function emitOnboardingAction(action: string) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
        new CustomEvent<OnboardingActionDetail>(ONBOARDING_ACTION_EVENT, {
            detail: { action },
        })
    );
}
