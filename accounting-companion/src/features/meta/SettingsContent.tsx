import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

type SettingsSection = {
    id: string;
    title: string;
    hint: string;
};

const THEME_OPTIONS: ThemeOption[] = [
    {
        value: "system",
        title: "System",
        description: "Follow the device preference automatically.",
    },
    {
        value: "dark",
        title: "Dark",
        description: "Comfortable for long study and review sessions.",
    },
    {
        value: "light",
        title: "Light",
        description: "Bright and presentation-friendly for class or office use.",
    },
];

const SOLVER_MODE_OPTIONS: SolverModeOption[] = [
    {
        value: "compute",
        title: "Compute first",
        description: "Push route readiness, missing values, and direct next steps first.",
    },
    {
        value: "beginner",
        title: "Study first",
        description: "Default to more guidance, learning context, and review support.",
    },
    {
        value: "professional",
        title: "Practice first",
        description: "Keep the reading tighter and closer to workplace interpretation.",
    },
];

const SETTINGS_SECTIONS: SettingsSection[] = [
    { id: "appearance", title: "Appearance", hint: "Theme, motion, and contrast." },
    { id: "calculator", title: "Calculator", hint: "Currency, mobile density, and behavior." },
    { id: "solver", title: "AI / Solver", hint: "Prompting, guidance, and setup style." },
    { id: "saved", title: "Saved Data", hint: "History and local storage." },
    { id: "offline", title: "Offline / PWA", hint: "Install, share, and update behavior." },
    { id: "accessibility", title: "Accessibility", hint: "Comfort and clarity settings." },
    { id: "about", title: "About / Updates", hint: "Release status and support pages." },
];

function ToggleRow({ title, description, value, onChange }: ToggleRowProps) {
    return (
        <div className="app-subtle-surface rounded-[var(--app-radius-lg)] p-4 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                    <h3 className="app-card-title text-base">{title}</h3>
                    <p className="app-body-md mt-1 text-sm">{description}</p>
                </div>

                <button
                    type="button"
                    onClick={() => onChange(!value)}
                    className={[
                        "rounded-full px-4 py-2 text-sm font-semibold transition",
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
            className="app-panel app-card-hover rounded-[var(--app-radius-lg)] p-5"
        >
            <h3 className="app-section-title text-lg">{title}</h3>
            <p className="app-body-md mt-2 text-sm">{description}</p>
            <p className="mt-4 text-sm font-medium text-[color:var(--app-accent-secondary)]">
                Open
            </p>
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
                "rounded-[var(--app-radius-lg)] border p-4 text-left transition",
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
        <div className="app-subtle-surface rounded-[var(--app-radius-lg)] p-4 md:p-5">
            <div className="max-w-2xl">
                <h3 className="app-card-title text-base">{title}</h3>
                <p className="app-body-md mt-1 text-sm">{description}</p>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={[
                            "rounded-[1rem] border px-4 py-3 text-left transition",
                            value === option.value
                                ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] shadow-[var(--app-shadow-sm)]"
                                : "app-panel hover:border-[color:var(--app-border-strong)]",
                        ].join(" ")}
                    >
                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                            {option.title}
                        </p>
                        <p className="app-helper mt-1 text-xs leading-5">
                            {option.description}
                        </p>
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
        <div className="app-subtle-surface rounded-[var(--app-radius-lg)] p-4 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                    <h3 className="app-card-title text-base">{title}</h3>
                    <p className="app-body-md mt-1 text-sm">{description}</p>
                </div>

                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="app-select min-w-[11rem] rounded-xl px-4 py-2 text-sm outline-none"
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
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [activeSection, setActiveSection] = useState<string>("appearance");

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
                label: "Solver mode",
                value:
                    settings.smartSolverDefaultMode === "compute"
                        ? "Compute"
                        : settings.smartSolverDefaultMode === "professional"
                          ? "Practice"
                          : "Study",
            },
            {
                label: "Offline history",
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

    function jumpToSection(sectionId: string) {
        setActiveSection(sectionId);
        sectionRefs.current[sectionId]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    return (
        <div className="app-page-stack">
            <SectionCard>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="app-section-kicker">Settings</p>
                        <h2 className="app-section-title mt-3 text-xl">
                            Organized app controls
                        </h2>
                        <p className="app-body-md mt-2 text-sm">
                            Adjust appearance, calculator behavior, AI guidance, saved data,
                            offline behavior, and release settings from one category-driven panel.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => updateAppSettings(DEFAULT_APP_SETTINGS)}
                        className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                    >
                        Reset all settings
                    </button>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {quickStats.map((item) => (
                        <div
                            key={item.label}
                            className="app-subtle-surface rounded-[1rem] px-4 py-3"
                        >
                            <p className="app-metric-label">{item.label}</p>
                            <p className="mt-2 text-base font-semibold text-[color:var(--app-text)]">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-premium">
                    {SETTINGS_SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => jumpToSection(section.id)}
                            className={[
                                "shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold",
                                activeSection === section.id
                                    ? "app-button-primary"
                                    : "app-button-ghost",
                            ].join(" ")}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>
            </SectionCard>

            <div
                ref={(node) => {
                    sectionRefs.current.appearance = node;
                }}
            >
                <SectionCard>
                    <p className="app-section-kicker">Appearance</p>
                    <h2 className="app-section-title mt-3 text-lg">Theme and visual comfort</h2>
                    <p className="app-body-md mt-2 text-sm">
                        Keep the shell calm, readable, and consistent across desktop and mobile.
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                        {THEME_OPTIONS.map((option) => (
                            <ThemeCard
                                key={option.value}
                                option={option}
                                active={settings.themePreference === option.value}
                                onSelect={(value) => setSetting("themePreference", value)}
                            />
                        ))}
                    </div>

                    <div className="mt-5 space-y-4">
                        <ToggleRow
                            title="Enable premium motion"
                            description="Keep subtle transitions, drawer movement, and hover feedback active."
                            value={settings.enableMotionEffects}
                            onChange={(value) => setSetting("enableMotionEffects", value)}
                        />
                        <ToggleRow
                            title="Use high-contrast surfaces"
                            description="Strengthen borders, tones, and focus visibility for more demanding reading conditions."
                            value={settings.highContrastMode}
                            onChange={(value) => setSetting("highContrastMode", value)}
                        />
                    </div>
                </SectionCard>
            </div>

            <div
                ref={(node) => {
                    sectionRefs.current.calculator = node;
                }}
            >
                <SectionCard>
                    <p className="app-section-kicker">Calculator behavior</p>
                    <h2 className="app-section-title mt-3 text-lg">Working surface defaults</h2>
                    <div className="mt-4 space-y-4">
                        <SelectRow
                            title="Display currency"
                            description="Use one shared display currency across results, formulas, and interpretations."
                            value={settings.preferredCurrency}
                            onChange={(value) => setSetting("preferredCurrency", value)}
                            options={SUPPORTED_CURRENCIES.map((currency) => ({
                                value: currency.code,
                                label: `${currency.code} - ${currency.label}`,
                            }))}
                        />
                        <ToggleRow
                            title="Compact mobile chrome"
                            description="Shorten mobile page headers, reduce helper chrome, and bring the tool closer to the top."
                            value={settings.compactMobileChrome}
                            onChange={(value) => setSetting("compactMobileChrome", value)}
                        />
                        <ToggleRow
                            title="Auto-expand active navigation group"
                            description="Keep the current category open automatically while browsing the sidebar."
                            value={settings.autoExpandActiveNavGroup}
                            onChange={(value) =>
                                setSetting("autoExpandActiveNavGroup", value)
                            }
                        />
                    </div>
                </SectionCard>
            </div>

            <div
                ref={(node) => {
                    sectionRefs.current.solver = node;
                }}
            >
                <SectionCard>
                    <p className="app-section-kicker">AI / Smart Solver</p>
                    <h2 className="app-section-title mt-3 text-lg">Guidance and prompt behavior</h2>

                    <div className="mt-4 space-y-4">
                        <SegmentedRow
                            title="Default solver lens"
                            description="Choose whether Smart Solver should feel more compute-first, study-first, or practice-first by default."
                            value={settings.smartSolverDefaultMode}
                            onChange={(value) => setSetting("smartSolverDefaultMode", value)}
                            options={SOLVER_MODE_OPTIONS}
                        />

                        <ToggleRow
                            title="Prefer guided setup"
                            description="Surface expandable manual fields and structured setup suggestions more aggressively for complex prompts."
                            value={settings.smartSolverPreferGuidedSetup}
                            onChange={(value) =>
                                setSetting("smartSolverPreferGuidedSetup", value)
                            }
                        />
                        <ToggleRow
                            title="Show study notes"
                            description="Keep learning-oriented tips, cautions, and review notes visible in Smart Solver when available."
                            value={settings.smartSolverShowStudyNotes}
                            onChange={(value) =>
                                setSetting("smartSolverShowStudyNotes", value)
                            }
                        />
                        <ToggleRow
                            title="Show prompt examples"
                            description="Display example prompts to help users phrase accounting, finance, and business problems naturally."
                            value={settings.smartSolverShowPromptExamples}
                            onChange={(value) =>
                                setSetting("smartSolverShowPromptExamples", value)
                            }
                        />
                        <SelectRow
                            title="Suggested calculator count"
                            description="Control how many top Smart Solver matches appear in the suggestion list."
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
                </SectionCard>
            </div>

            <div
                ref={(node) => {
                    sectionRefs.current.saved = node;
                }}
            >
                <SectionCard>
                    <p className="app-section-kicker">Saved data</p>
                    <h2 className="app-section-title mt-3 text-lg">History and local storage</h2>
                    <div className="mt-4 space-y-4">
                        <ToggleRow
                            title="Save history offline on this device"
                            description="Keep recent activity, recommendations, Smart Solver saves, and calculator history locally for offline reuse."
                            value={settings.saveOfflineHistory}
                            onChange={(value) => setSetting("saveOfflineHistory", value)}
                        />
                        <div className="app-subtle-surface rounded-[var(--app-radius-lg)] p-4 md:p-5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="max-w-2xl">
                                    <h3 className="app-card-title text-base">Clear local history</h3>
                                    <p className="app-body-md mt-1 text-sm">
                                        Remove saved route history, recommendations, recent prompts,
                                        and offline activity from this device.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={clearStoredActivity}
                                    className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                                >
                                    Clear history
                                </button>
                            </div>
                        </div>
                    </div>
                </SectionCard>
            </div>

            <div
                ref={(node) => {
                    sectionRefs.current.offline = node;
                }}
            >
                <SectionCard>
                    <p className="app-section-kicker">Offline / PWA</p>
                    <h2 className="app-section-title mt-3 text-lg">Install, share, and release delivery</h2>
                    <div className="mt-4 space-y-4">
                        <ToggleRow
                            title="Show install prompt on the home page"
                            description="Allow the home screen to surface the platform-aware install card when this device is a good candidate."
                            value={settings.showInstallPrompt}
                            onChange={(value) => setSetting("showInstallPrompt", value)}
                        />
                        <ToggleRow
                            title="Remember desktop sidebar visibility"
                            description="Keep your last desktop sidebar state between visits."
                            value={settings.rememberDesktopSidebarVisibility}
                            onChange={(value) =>
                                setSetting("rememberDesktopSidebarVisibility", value)
                            }
                        />
                        <div className="app-subtle-surface rounded-[var(--app-radius-lg)] p-4 md:p-5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="max-w-2xl">
                                    <h3 className="app-card-title text-base">Share the live app</h3>
                                    <p className="app-body-md mt-1 text-sm">
                                        Open the native share sheet when the browser supports it,
                                        or fall back to copying the live app link.
                                    </p>
                                </div>

                                <ShareAppButton
                                    label="Share AccCalc"
                                    shareText="Share AccCalc's live app link for accounting, finance, economics, entrepreneurship, and business calculations."
                                />
                            </div>
                        </div>
                    </div>
                </SectionCard>
            </div>

            <div
                ref={(node) => {
                    sectionRefs.current.accessibility = node;
                }}
            >
                <SectionCard>
                    <p className="app-section-kicker">Accessibility</p>
                    <h2 className="app-section-title mt-3 text-lg">Comfort and clarity</h2>
                    <div className="mt-4 space-y-4">
                        <ToggleRow
                            title="Show feedback reminders"
                            description="Allow the app to occasionally remind active users to send feedback."
                            value={settings.showFeedbackReminders}
                            onChange={(value) => setSetting("showFeedbackReminders", value)}
                        />
                        <ToggleRow
                            title="Show new feature indicators"
                            description="Display a new badge beside recently added tools until you open them once."
                            value={settings.showNewFeatureIndicators}
                            onChange={(value) =>
                                setSetting("showNewFeatureIndicators", value)
                            }
                        />
                        <ToggleRow
                            title="Play opening animation"
                            description="Show the short startup sequence when the app opens."
                            value={settings.showOpeningAnimation}
                            onChange={(value) => setSetting("showOpeningAnimation", value)}
                        />
                    </div>
                </SectionCard>
            </div>

            <div
                ref={(node) => {
                    sectionRefs.current.about = node;
                }}
            >
                <SectionCard>
                    <p className="app-section-kicker">About / Updates</p>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="app-section-title mt-3 text-lg">AccCalc {APP_VERSION}</h2>
                            <p className="app-body-md mt-2 text-sm">
                                Review the current release, check for updates, and open support pages.
                            </p>
                        </div>
                        <span className="app-chip-accent rounded-full px-3 py-1 text-xs">
                            Release {APP_VERSION}
                        </span>
                    </div>

                    <div className="app-subtle-surface mt-4 rounded-[var(--app-radius-lg)] p-4 md:p-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-2xl">
                                <h3 className="app-card-title text-base">Update status</h3>
                                <p className="app-body-md mt-1 text-sm">
                                    {update.updateReady
                                        ? update.waitingForReload
                                            ? `Version ${update.availableVersion ?? "latest"} is active in the background and this tab can refresh when you are ready.`
                                            : `Version ${update.availableVersion ?? "latest"} is downloaded and ready to activate.`
                                        : update.lastCheckedAt > 0
                                          ? `You are on version ${APP_VERSION}. The app already checked for updates during this session.`
                                          : `You are on version ${APP_VERSION}. The app will keep checking for safe production updates while you use it.`}
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

                    <div
                        className={`mt-5 grid gap-4 ${compact ? "" : "md:grid-cols-2"}`}
                    >
                        <LinkTile
                            title="History"
                            description="Review saved prompts, recent routes, and personalized recommendations."
                            to="/history"
                            onNavigate={onNavigate}
                        />
                        <LinkTile
                            title="About AccCalc"
                            description="Read the purpose, direction, and goals behind the app."
                            to="/settings/about"
                            onNavigate={onNavigate}
                        />
                        <LinkTile
                            title="Install and Offline Guide"
                            description="See Android and iOS install steps, browser limits, and what stays safely available offline."
                            to="/settings/install"
                            onNavigate={onNavigate}
                        />
                        <LinkTile
                            title="Feedback"
                            description="Open the feedback form and send bugs, requests, or suggestions."
                            to="/settings/feedback"
                            onNavigate={onNavigate}
                        />
                    </div>

                    <div className="mt-5 space-y-3">
                        {APP_RELEASE_NOTES.slice(0, 5).map((note) => (
                            <div
                                key={note}
                                className="app-subtle-surface rounded-[1rem] px-4 py-3 text-sm leading-6"
                            >
                                {note}
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}
