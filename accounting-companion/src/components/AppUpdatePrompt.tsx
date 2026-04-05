import { Link } from "react-router-dom";
import {
    applyAppUpdateNow,
    deferAppUpdatePrompt,
    type AppUpdateState,
} from "../utils/appUpdate";

export default function AppUpdatePrompt({
    update,
}: {
    update: AppUpdateState;
}) {
    if (!update.updateReady) {
        return null;
    }

    const versionLabel = update.availableVersion
        ? `Version ${update.availableVersion}`
        : "A newer version";
    const isRefreshRequired = update.phase === "refresh-required";
    const isApplying = update.phase === "applying";
    const isDeferred = update.deferredUntil > 0 && !isRefreshRequired;

    if (isDeferred || isApplying) {
        return null;
    }

    return (
        <section className="app-panel-elevated rounded-[1.7rem] p-5 shadow-[var(--app-shadow-lg)]">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="app-kicker text-[0.68rem]">
                        {isRefreshRequired ? "Refresh ready" : "Update available"}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                        {versionLabel} is ready
                    </h2>
                    <p className="app-body-md mt-2 text-sm leading-6">
                        {isRefreshRequired
                            ? "A newer service worker is already active. Refresh when you are ready to switch this tab to the latest interface and calculator logic."
                            : "A safer build has been downloaded in the background. Refresh now to move to the latest release, or wait until you finish your current step."}
                    </p>
                </div>

                <span className="app-chip-accent rounded-full px-3 py-1 text-xs">
                    New release
                </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => {
                        applyAppUpdateNow();
                    }}
                    className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                    {isRefreshRequired ? "Refresh now" : "Update now"}
                </button>
                <button
                    type="button"
                    onClick={() => deferAppUpdatePrompt()}
                    className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-medium"
                >
                    Remind later
                </button>
                <Link
                    to="/settings/install"
                    className="app-button-ghost rounded-xl px-4 py-2.5 text-sm font-medium"
                >
                    Update details
                </Link>
            </div>
        </section>
    );
}
