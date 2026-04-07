import { useMemo } from "react";
import { Link } from "react-router-dom";
import DisclosurePanel from "../../components/DisclosurePanel";
import ShareAppButton from "../../components/ShareAppButton";
import SectionCard from "../../components/SectionCard";
import { clearStoredActivity } from "../../utils/appActivity";
import { checkForAppUpdates, useAppUpdateState } from "../../utils/appUpdate";
import {
    DEFAULT_APP_SETTINGS,
    type AppSettings,
    type ThemePreference,
    updateAppSettings,
    useAppSettings,
} from "../../utils/appSettings";
import { SUPPORTED_CURRENCIES } from "../../utils/currency";
import { APP_RELEASE_NOTES, APP_VERSION } from "../../utils/appRelease";

type SettingsContentProps = {
    compact?: boolean;
    onNavigate?: () => void;
};

type ToggleRowProps = {
    title: string;
    description: string;
    value: boolean;
    onChange: (value: boolean) => void;
};

type ThemeOption = {
    value: ThemePreference;
    title: string;
    description: string;
};

type SolverModeOption = {
    value: AppSettings["smartSolverDefaultMode"];
    title: string;
    description: string;
};

const THEME_OPTIONS: ThemeOption[] = [
    { value: "system", title: "System", description: "Follow the device automatically." },
    { value: "dark", title: "Dark", description: "Comfortable for long study sessions." },
    { value: "light", title: "Light", description: "Bright and presentation-friendly." },
];

const SOLVER_MODE_OPTIONS: SolverModeOption[] = [
    {
        value: "compute",
        title: "Compute",
        description: "Push direct routing and next steps first.",
    },
    {
        value: "beginner",
        title: "Study",
        description: "Show more explanation and learning context.",
    },
    {
        value: "professional",
        title: "Practice",
        description: "Keep the output tighter and more work-like.",
    },
];

function ToggleRow({ title, description, value, onChange }: ToggleRowProps) {
    return (
        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                    <h3 className="app-card-title text-sm">{title}</h3>
                    <p className="app-body-md mt-1 text-sm">{description}</p>
                </div>

                <button
                    type="button"
                    onClick={() => onChange(!value)}
                    className={[
                        "rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                        value ? "app-button-primary" : "app-button-secondary",
                    ].join(" ")}
                >
                    {value ? "On" : "Off"}
                </button>
            </div>
        </div>
    );
}

function LinkTile({
    title,
    description,
    to,
    onNavigate,
}: {
    title: string;
    description: string;
    to: string;
    onNavigate?: () => void;
}) {
    return (
        <Link
            to={to}
            onClick={onNavigate}
            className="app-link-card rounded-[1rem] px-4 py-3.5"
        >
            <h3 className="app-card-title text-sm">{title}</h3>
            <p className="app-body-md mt-1.5 text-sm">{description}</p>
        </Link>
    );
}

function ThemeCard({
    option,
    active,
    onSelect,
}: {
    option: ThemeOption;
    active: boolean;
    onSelect: (value: ThemePreference) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onSelect(option.value)}
            className={[
                "rounded-[1rem] border p-4 text-left transition",
                active
                    ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] shadow-[var(--app-shadow-sm)]"
                    : "app-subtle-surface hover:border-[color:var(--app-border-strong)]",
            ].join(" ")}
        >
            <p className="app-card-title text-sm">{option.title}</p>
            <p className="app-body-md mt-2 text-sm">{option.description}</p>
        </button>
    );
}

function SegmentedRow<TValue extends string>({
    title,
    description,
    value,
    onChange,
    options,
}: {
    title: string;
    description: string;
    value: TValue;
    onChange: (value: TValue) => void;
    options: Array<{ value: TValue; title: string; description: string }>;
}) {
    return (
        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
            <div className="max-w-2xl">
                <h3 className="app-card-title text-sm">{title}</h3>
                <p className="app-body-md mt-1 text-sm">{description}</p>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-3">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={[
                            "rounded-[0.95rem] border px-3.5 py-3 text-left transition",
                            value === option.value
                                ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] shadow-[var(--app-shadow-sm)]"
                                : "app-panel hover:border-[color:var(--app-border-strong)]",
                        ].join(" ")}
                    >
                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                            {option.title}
                        </p>
                        <p className="app-helper mt-1 text-xs leading-5">{option.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

function SelectRow({
    title,
    description,
    value,
    onChange,
    options,
}: {
    title: string;
    description: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
}) {
    return (
        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                    <h3 className="app-card-title text-sm">{title}</h3>
                    <p className="app-body-md mt-1 text-sm">{description}</p>
                </div>

                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="app-select min-w-[10rem] rounded-xl px-4 py-2 text-sm outline-none"
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default function SettingsContent({
    compact = false,
    onNavigate,
}: SettingsContentProps) {
    const settings = useAppSettings();
    const update = useAppUpdateState();

    const quickStats = useMemo(
        () => [
            {
                label: "Theme",
                value:
                    settings.themePreference === "system"
                        ? "Auto"
                        : settings.themePreference === "dark"
                          ? "Dark"
                          : "Light",
            },
            {
                label: "Solver",
                value:
                    settings.smartSolverDefaultMode === "compute"
                        ? "Compute"
                        : settings.smartSolverDefaultMode === "professional"
                          ? "Practice"
                          : "Study",
            },
            {
                label: "History",
                value: settings.saveOfflineHistory ? "Saved" : "Off",
            },
        ],
        [
            settings.saveOfflineHistory,
            settings.smartSolverDefaultMode,
            settings.themePreference,
        ]
    );

    function setSetting<Key extends keyof AppSettings>(
        key: Key,
        value: AppSettings[Key]
    ) {
        updateAppSettings({ [key]: value } as Partial<AppSettings>);
    }

    return (
        <div className="app-page-stack">
            <SectionCard>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="app-section-kicker">Settings</p>
                        <h2 className="app-section-title mt-2 text-lg">App controls</h2>
                        <p className="app-body-md mt-1.5 text-sm">
                            Short, grouped controls for appearance, solver behavior, offline use,
                            history, and accessibility.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => updateAppSettings(DEFAULT_APP_SETTINGS)}
                        className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                    >
                        Reset defaults
                    </button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {quickStats.map((item) => (
                        <div key={item.label} className="app-subtle-surface rounded-[1rem] px-4 py-3">
                            <p className="app-metric-label">{item.label}</p>
                            <p className="mt-2 text-base font-semibold text-[color:var(--app-text)]">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </SectionCard>

            <DisclosurePanel
                title="Account"
                summary="Profile-style entry points and support surfaces."
                badge="Overview"
                defaultOpen
                compact={compact}
            >
                <div className="grid gap-3 md:grid-cols-2">
                    <LinkTile
                        title="History"
                        description="Review saved prompts, recent tools, and resume points."
                        to="/history"
                        onNavigate={onNavigate}
                    />
                    <LinkTile
                        title="Feedback"
                        description="Open the feedback form for bugs, missing topics, or requests."
                        to="/settings/feedback"
                        onNavigate={onNavigate}
                    />
                </div>
            </DisclosurePanel>

            <DisclosurePanel
                title="Appearance"
                summary="Theme, contrast, and motion."
                badge="Visual"
                defaultOpen
                compact={compact}
            >
                <div className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-3">
                        {THEME_OPTIONS.map((option) => (
                            <ThemeCard
                                key={option.value}
                                option={option}
                                active={settings.themePreference === option.value}
                                onSelect={(value) => setSetting("themePreference", value)}
                            />
                        ))}
                    </div>
                    <ToggleRow
                        title="Premium motion"
                        description="Keep subtle transitions and movement cues active."
                        value={settings.enableMotionEffects}
                        onChange={(value) => setSetting("enableMotionEffects", value)}
                    />
                </div>
            </DisclosurePanel>

            <DisclosurePanel
                title="Calculator behavior"
                summary="Currency, mobile density, and workspace defaults."
                badge="Tools"
                compact={compact}
            >
                <div className="space-y-4">
                    <SelectRow
                        title="Display currency"
                        description="Use one shared display currency across results and notes."
                        value={settings.preferredCurrency}
                        onChange={(value) => setSetting("preferredCurrency", value)}
                        options={SUPPORTED_CURRENCIES.map((currency) => ({
                            value: currency.code,
                            label: `${currency.code} - ${currency.label}`,
                        }))}
                    />
                    <ToggleRow
                        title="Compact mobile chrome"
                        description="Keep headers, helper chrome, and page framing tighter on phones."
                        value={settings.compactMobileChrome}
                        onChange={(value) => setSetting("compactMobileChrome", value)}
                    />
                    <ToggleRow
                        title="Auto-expand active category"
                        description="Open the active sidebar group automatically while browsing."
                        value={settings.autoExpandActiveNavGroup}
                        onChange={(value) => setSetting("autoExpandActiveNavGroup", value)}
                    />
                </div>
            </DisclosurePanel>

            <DisclosurePanel
                title="AI / Smart Solver"
                summary="Prompting, explanation style, and guided setup."
                badge="AI"
                compact={compact}
            >
                <div className="space-y-4">
                    <SegmentedRow
                        title="Default solver lens"
                        description="Choose the default balance between direct calculation and explanation."
                        value={settings.smartSolverDefaultMode}
                        onChange={(value) => setSetting("smartSolverDefaultMode", value)}
                        options={SOLVER_MODE_OPTIONS}
                    />
                    <ToggleRow
                        title="Prefer guided setup"
                        description="Show structured follow-up setup more aggressively for complex prompts."
                        value={settings.smartSolverPreferGuidedSetup}
                        onChange={(value) => setSetting("smartSolverPreferGuidedSetup", value)}
                    />
                    <ToggleRow
                        title="Show study notes"
                        description="Keep review-oriented notes and cautions visible when available."
                        value={settings.smartSolverShowStudyNotes}
                        onChange={(value) => setSetting("smartSolverShowStudyNotes", value)}
                    />
                    <ToggleRow
                        title="Show prompt examples"
                        description="Keep example accounting, finance, and business prompts visible."
                        value={settings.smartSolverShowPromptExamples}
                        onChange={(value) => setSetting("smartSolverShowPromptExamples", value)}
                    />
                    <SelectRow
                        title="Suggestion count"
                        description="Control how many top Smart Solver matches are shown."
                        value={String(settings.smartSolverMaxSuggestions)}
                        onChange={(value) =>
                            setSetting("smartSolverMaxSuggestions", Number(value))
                        }
                        options={[2, 3, 4, 5, 6].map((value) => ({
                            value: String(value),
                            label: String(value),
                        }))}
                    />
                </div>
            </DisclosurePanel>

            <DisclosurePanel
                title="Saved data / History"
                summary="Local history, recommendations, and resume data."
                badge="Local"
                compact={compact}
            >
                <div className="space-y-4">
                    <ToggleRow
                        title="Save history on this device"
                        description="Keep recent routes, saved prompts, and calculator records locally."
                        value={settings.saveOfflineHistory}
                        onChange={(value) => setSetting("saveOfflineHistory", value)}
                    />
                    <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-2xl">
                                <h3 className="app-card-title text-sm">Clear local history</h3>
                                <p className="app-body-md mt-1 text-sm">
                                    Remove saved route history, recommendations, and stored prompts from this device.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={clearStoredActivity}
                                className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </DisclosurePanel>

            <DisclosurePanel
                title="Offline / PWA"
                summary="Install, share, and release-delivery behavior."
                badge="Offline"
                compact={compact}
            >
                <div className="space-y-4">
                    <ToggleRow
                        title="Show install prompt"
                        description="Allow the home screen to surface the platform-aware install card."
                        value={settings.showInstallPrompt}
                        onChange={(value) => setSetting("showInstallPrompt", value)}
                    />
                    <ToggleRow
                        title="Remember desktop sidebar"
                        description="Keep your last desktop sidebar state between visits."
                        value={settings.rememberDesktopSidebarVisibility}
                        onChange={(value) =>
                            setSetting("rememberDesktopSidebarVisibility", value)
                        }
                    />
                    <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-2xl">
                                <h3 className="app-card-title text-sm">Share link</h3>
                                <p className="app-body-md mt-1 text-sm">
                                    Open the native share sheet when supported or copy the live app link.
                                </p>
                            </div>
                            <ShareAppButton
                                label="Share link"
                                shareText="Share AccCalc's live app link for accounting, finance, economics, entrepreneurship, and business calculations."
                            />
                        </div>
                    </div>
                </div>
            </DisclosurePanel>

            <DisclosurePanel
                title="Accessibility"
                summary="Contrast and comfort controls."
                badge="Access"
                compact={compact}
            >
                <div className="space-y-4">
                    <ToggleRow
                        title="High-contrast surfaces"
                        description="Strengthen borders, tones, and focus visibility."
                        value={settings.highContrastMode}
                        onChange={(value) => setSetting("highContrastMode", value)}
                    />
                    <ToggleRow
                        title="Opening animation"
                        description="Show the short startup animation when the app opens."
                        value={settings.showOpeningAnimation}
                        onChange={(value) => setSetting("showOpeningAnimation", value)}
                    />
                </div>
            </DisclosurePanel>

            <DisclosurePanel
                title="Privacy / Security"
                summary="What stays on-device and what does not."
                badge="Privacy"
                compact={compact}
            >
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                        <p className="app-card-title text-sm">On-device data</p>
                        <p className="app-body-md mt-1.5 text-sm">
                            History, saved prompts, and interface preferences stay in local browser storage on this device.
                        </p>
                    </div>
                    <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                        <p className="app-card-title text-sm">No sign-in required</p>
                        <p className="app-body-md mt-1.5 text-sm">
                            AccCalc currently works without account creation, which keeps most routine use local and lightweight.
                        </p>
                    </div>
                </div>
            </DisclosurePanel>

            <DisclosurePanel
                title="Notifications / Prompts"
                summary="Feature badges and reminder behavior."
                badge="Prompts"
                compact={compact}
            >
                <div className="space-y-4">
                    <ToggleRow
                        title="Show feedback reminders"
                        description="Allow occasional feedback prompts for active users."
                        value={settings.showFeedbackReminders}
                        onChange={(value) => setSetting("showFeedbackReminders", value)}
                    />
                    <ToggleRow
                        title="Show new feature indicators"
                        description="Keep new badges visible until you open those tools once."
                        value={settings.showNewFeatureIndicators}
                        onChange={(value) => setSetting("showNewFeatureIndicators", value)}
                    />
                </div>
            </DisclosurePanel>

            <DisclosurePanel
                title="About / Updates"
                summary="Release status, support pages, and current shipping notes."
                badge={`v${APP_VERSION}`}
                compact={compact}
            >
                <div className="space-y-4">
                    <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-2xl">
                                <h3 className="app-card-title text-sm">Update status</h3>
                                <p className="app-body-md mt-1 text-sm">
                                    {update.updateReady
                                        ? update.waitingForReload
                                            ? `Version ${update.availableVersion ?? "latest"} is active in the background and this tab can refresh when you are ready.`
                                            : `Version ${update.availableVersion ?? "latest"} is downloaded and ready to activate.`
                                        : update.lastCheckedAt > 0
                                          ? `You are on version ${APP_VERSION}. Updates were already checked during this session.`
                                          : `You are on version ${APP_VERSION}. AccCalc will keep checking for safe production updates while you use it.`}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    void checkForAppUpdates();
                                }}
                                className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                            >
                                Check now
                            </button>
                        </div>
                    </div>

                    <div className={`grid gap-3 ${compact ? "" : "md:grid-cols-2"}`}>
                        <LinkTile
                            title="About AccCalc"
                            description="Read the product direction and purpose."
                            to="/settings/about"
                            onNavigate={onNavigate}
                        />
                        <LinkTile
                            title="Install guide"
                            description="Review browser install steps and offline limits."
                            to="/settings/install"
                            onNavigate={onNavigate}
                        />
                    </div>

                    <div className="space-y-2">
                        {APP_RELEASE_NOTES.slice(0, 5).map((note) => (
                            <div
                                key={note}
                                className="app-subtle-surface rounded-[1rem] px-4 py-3 text-sm leading-6"
                            >
                                {note}
                            </div>
                        ))}
                    </div>
                </div>
            </DisclosurePanel>
        </div>
    );
}
