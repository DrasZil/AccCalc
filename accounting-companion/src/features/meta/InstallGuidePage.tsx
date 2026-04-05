import { useState } from "react";
import { Link } from "react-router-dom";
import AppBrandMark from "../../components/AppBrandMark";
import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import ShareAppButton from "../../components/ShareAppButton";
import { checkForAppUpdates, useAppUpdateState } from "../../utils/appUpdate";
import { useNetworkStatus } from "../../utils/networkStatus";
import {
    clearInstallPromptDismissal,
    getInstallGuidance,
    triggerNativeInstallPrompt,
    useInstallExperience,
} from "../../utils/installExperience";

type StatusTone = "default" | "success" | "warning";

function StatusPill({
    label,
    tone = "default",
}: {
    label: string;
    tone?: StatusTone;
}) {
    const toneClass =
        tone === "success"
            ? "app-chip-accent"
            : tone === "warning"
              ? "app-tone-warning"
              : "app-chip";

    return (
        <span className={`${toneClass} rounded-full px-3 py-1 text-xs font-semibold`}>
            {label}
        </span>
    );
}

export default function InstallGuidePage() {
    const install = useInstallExperience();
    const network = useNetworkStatus();
    const update = useAppUpdateState();
    const [installMessage, setInstallMessage] = useState("");
    const guidance = getInstallGuidance(install);

    const platformBadge =
        install.platform === "installed"
            ? { label: "Installed", tone: "success" as const }
            : install.canNativePrompt
              ? { label: "Native prompt available", tone: "success" as const }
              : install.platform === "ios-safari" || install.platform === "ios-other"
                ? { label: "Guided iOS install", tone: "warning" as const }
                : { label: "Browser-based guidance", tone: "default" as const };

    async function handleNativeInstall() {
        const outcome = await triggerNativeInstallPrompt();

        if (outcome === "accepted") {
            setInstallMessage("Install prompt accepted. The browser will finish the platform-native flow.");
            return;
        }

        if (outcome === "dismissed") {
            setInstallMessage("Install prompt dismissed. You can try again later from this page.");
            return;
        }

        setInstallMessage("This browser is not exposing a native install prompt right now.");
    }

    return (
        <div className="app-page-stack">
            <PageHeader
                badge="Settings / Install"
                title="Install and Offline Guide"
                description="Platform-aware installation guidance, browser-based offline limits, and update-safety rules for AccCalc."
            />

            <SectionCard>
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-3xl">
                        <AppBrandMark className="mb-4" />
                        <div className="flex flex-wrap gap-2">
                            <StatusPill label={platformBadge.label} tone={platformBadge.tone} />
                            <StatusPill
                                label={network.online ? "Online now" : "Offline now"}
                                tone={network.online ? "success" : "warning"}
                            />
                        </div>
                        <h2 className="app-section-title mt-4 text-2xl">{guidance.headline}</h2>
                        <p className="app-body-md mt-2 text-sm">{guidance.summary}</p>
                        <p className="app-helper mt-3 text-xs">
                            Current context: {install.browserLabel}
                        </p>
                        {install.platform === "ios-other" ? (
                            <p className="app-tone-warning mt-4 rounded-[1.2rem] px-4 py-3 text-sm leading-6">
                                Installation on iPhone and iPad still needs <strong>Safari</strong>.
                                Open the same AccCalc link there, then use{" "}
                                <strong>Share &gt; Add to Home Screen</strong>.
                            </p>
                        ) : null}
                    </div>

                    <div className="w-full max-w-sm space-y-3">
                        {install.canNativePrompt ? (
                            <button
                                type="button"
                                onClick={handleNativeInstall}
                                className="app-button-primary w-full rounded-xl px-4 py-3 text-sm font-semibold"
                            >
                                Install app
                            </button>
                        ) : null}

                        <ShareAppButton
                            className="w-full justify-center"
                            label="Share app link"
                            shareText="Share the live AccCalc app so others can open the calculators, install guide, and offline-safe browser experience."
                        />

                        <button
                            type="button"
                            onClick={clearInstallPromptDismissal}
                            className="app-button-secondary w-full rounded-xl px-4 py-3 text-sm font-medium"
                        >
                            Re-enable home install card
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                void checkForAppUpdates();
                            }}
                            className="app-button-secondary w-full rounded-xl px-4 py-3 text-sm font-medium"
                        >
                            Check for updates
                        </button>

                        <Link
                            to="/"
                            className="app-button-ghost block w-full rounded-xl px-4 py-3 text-center text-sm font-medium"
                        >
                            Back to dashboard
                        </Link>
                    </div>
                </div>

                {installMessage ? (
                    <div className="app-subtle-surface mt-4 rounded-[1.25rem] px-4 py-3.5">
                        <p className="app-body-md text-sm">{installMessage}</p>
                    </div>
                ) : null}
            </SectionCard>

            <SectionCard>
                <p className="app-section-kicker text-xs">Release freshness</p>
                <h2 className="app-section-title mt-3 text-xl">Update lifecycle status</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="app-subtle-surface rounded-[1.2rem] px-4 py-3.5">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--app-text-muted)]">
                            Current code
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[color:var(--app-text)]">
                            Version {update.currentVersion || "Unknown"}
                        </p>
                    </div>
                    <div className="app-subtle-surface rounded-[1.2rem] px-4 py-3.5">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--app-text-muted)]">
                            Update state
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[color:var(--app-text)]">
                            {update.updateReady
                                ? update.waitingForReload
                                    ? "Refresh pending in this tab"
                                    : "New version downloaded"
                                : "Up to date or still checking"}
                        </p>
                    </div>
                </div>
            </SectionCard>

            <SectionCard>
                <p className="app-section-kicker text-xs">Install steps</p>
                <h2 className="app-section-title mt-3 text-xl">What to do on this device</h2>
                <div className="mt-4 grid gap-3">
                    {guidance.steps.map((step, index) => (
                        <div key={step} className="app-subtle-surface rounded-[1.25rem] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--app-text-muted)]">
                                Step {index + 1}
                            </p>
                            <p className="app-body-md mt-2 text-sm">{step}</p>
                        </div>
                    ))}
                </div>
            </SectionCard>

            <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                <SectionCard>
                    <p className="app-section-kicker text-xs">Offline coverage</p>
                    <h2 className="app-section-title mt-3 text-xl">
                        What works without installation
                    </h2>
                    <p className="app-body-md mt-2 text-sm">
                        AccCalc is built so the browser version can still be useful offline after the app shell and the necessary route assets have been cached at least once online.
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {[
                            "Core local calculators and formula panels",
                            "Smart Solver local routing and suggestion logic",
                            "Pinned tools, recent history, and saved drafts on this device",
                            "Static shell assets such as icons, manifest, and previously fetched UI chunks",
                        ].map((item) => (
                            <div key={item} className="app-subtle-surface rounded-[1.2rem] px-4 py-3.5">
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">{item}</p>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard>
                    <p className="app-section-kicker text-xs">Limits</p>
                    <h2 className="app-section-title mt-3 text-xl">
                        What still needs internet
                    </h2>
                    <div className="mt-4 space-y-3">
                        {[
                            "Feedback submission and the embedded Google Form",
                            "External links or third-party destinations opened from the app",
                            "Fresh deployment updates until the browser reconnects and downloads the new version",
                            "Any route chunk that was never fetched before going offline",
                        ].map((item) => (
                            <div key={item} className="app-subtle-surface rounded-[1.2rem] px-4 py-3.5">
                                <p className="app-body-md text-sm">{item}</p>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </section>

            <SectionCard>
                <p className="app-section-kicker text-xs">Update safety</p>
                <h2 className="app-section-title mt-3 text-xl">
                    How stale-cache risk is controlled
                </h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {[
                        "Versioned cache names separate each release so old logic is not kept forever.",
                        "Old caches are deleted during service-worker activation.",
                        "Navigation requests use a network-first strategy, then fall back to cached shell content.",
                        "Static assets use stale-while-revalidate so cached files still refresh once the browser reconnects.",
                    ].map((item) => (
                        <div key={item} className="app-subtle-surface rounded-[1.2rem] px-4 py-3.5">
                            <p className="app-body-md text-sm">{item}</p>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    );
}
