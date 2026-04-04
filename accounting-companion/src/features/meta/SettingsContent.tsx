import { Link } from "react-router-dom";
import SectionCard from "../../components/SectionCard";
import { clearStoredActivity } from "../../utils/appActivity";
import {
    DEFAULT_APP_SETTINGS,
    type AppSettings,
    type ThemePreference,
    updateAppSettings,
    useAppSettings,
} from "../../utils/appSettings";
import { SUPPORTED_CURRENCIES } from "../../utils/currency";

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

const THEME_OPTIONS: ThemeOption[] = [
    {
        value: "system",
        title: "System",
        description: "Follow the device preference automatically.",
    },
    {
        value: "dark",
        title: "Dark",
        description: "Comfortable, premium, and low-glare for long sessions.",
    },
    {
        value: "light",
        title: "Light",
        description: "Bright, polished, and clean for classroom or office use.",
    },
];

function ToggleRow({ title, description, value, onChange }: ToggleRowProps) {
    return (
        <div className="app-subtle-surface rounded-[var(--app-radius-lg)] p-4 md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                    <h3 className="app-card-title text-base">
                        {title}
                    </h3>
                    <p className="app-body-md mt-1 text-sm">
                        {description}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => onChange(!value)}
                    className={[
                        "rounded-full px-4 py-2 text-sm font-semibold transition",
                        value
                            ? "app-button-primary"
                            : "app-button-secondary",
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
            <p className="app-body-md mt-2 text-sm">
                {description}
            </p>
            <p className="mt-4 text-sm font-medium text-[color:var(--app-accent-secondary)]">Open</p>
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
            <p className="app-body-md mt-2 text-sm">
                {option.description}
            </p>
        </button>
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                    <h3 className="app-card-title text-base">
                        {title}
                    </h3>
                    <p className="app-body-md mt-1 text-sm">
                        {description}
                    </p>
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

    function setSetting<Key extends keyof AppSettings>(key: Key, value: AppSettings[Key]) {
        updateAppSettings({ [key]: value } as Partial<AppSettings>);
    }

    return (
        <div className="app-page-stack">
            <SectionCard>
                <p className="app-section-kicker">
                    Appearance
                </p>
                <h2 className="app-section-title mt-3 text-xl">
                    Theme and visual comfort
                </h2>
                <p className="app-body-md mt-2 text-sm">
                    Choose how the app should look across desktop, tablet, and mobile.
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
                        description="Keep transitions, drawer animations, hover lifts, and subtle visual polish active."
                        value={settings.enableMotionEffects}
                        onChange={(value) => setSetting("enableMotionEffects", value)}
                    />
                    <ToggleRow
                        title="Play opening animation"
                        description="Show the short startup sequence when the app opens, including installed launches."
                        value={settings.showOpeningAnimation}
                        onChange={(value) => setSetting("showOpeningAnimation", value)}
                    />
                </div>
            </SectionCard>

            <SectionCard>
                <h2 className="app-section-title text-lg">Navigation</h2>
                <div className="mt-4 space-y-4">
                    <ToggleRow
                        title="Auto-expand the active navigation group"
                        description="Open the group containing the current page automatically while browsing."
                        value={settings.autoExpandActiveNavGroup}
                        onChange={(value) => setSetting("autoExpandActiveNavGroup", value)}
                    />
                    <ToggleRow
                        title="Remember desktop sidebar visibility"
                        description="Keep your last desktop sidebar state between visits."
                        value={settings.rememberDesktopSidebarVisibility}
                        onChange={(value) =>
                            setSetting("rememberDesktopSidebarVisibility", value)
                        }
                    />
                    <ToggleRow
                        title="Show new feature indicators"
                        description="Display a new badge beside recently added tools until you open them once."
                        value={settings.showNewFeatureIndicators}
                        onChange={(value) => setSetting("showNewFeatureIndicators", value)}
                    />
                </div>
            </SectionCard>

            <SectionCard>
                <h2 className="app-section-title text-lg">Smart Solver</h2>
                <div className="mt-4 space-y-4">
                    <ToggleRow
                        title="Show prompt examples"
                        description="Display sample accounting prompts to help users phrase problems naturally."
                        value={settings.smartSolverShowPromptExamples}
                        onChange={(value) => setSetting("smartSolverShowPromptExamples", value)}
                    />

                    <SelectRow
                        title="Suggested calculator count"
                        description="Control how many top Smart Solver matches are shown in the suggestion list."
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

            <SectionCard>
                <h2 className="text-lg font-semibold text-[color:var(--app-text)]">Home experience</h2>
                <div className="mt-4 space-y-4">
                    <ToggleRow
                        title="Show install and share prompt on the home page"
                        description="Display the install or share panel on the home page when appropriate."
                        value={settings.showInstallPrompt}
                        onChange={(value) => setSetting("showInstallPrompt", value)}
                    />
                    <ToggleRow
                        title="Save history offline on this device"
                        description="Keep recent activity, recommendations, Smart Solver saves, and calculator history on this device."
                        value={settings.saveOfflineHistory}
                        onChange={(value) => setSetting("saveOfflineHistory", value)}
                    />
                    <ToggleRow
                        title="Show feedback reminders"
                        description="Allow the app to occasionally remind active users to send feedback."
                        value={settings.showFeedbackReminders}
                        onChange={(value) => setSetting("showFeedbackReminders", value)}
                    />
                </div>
            </SectionCard>

            <SectionCard>
                <h2 className="text-lg font-semibold text-[color:var(--app-text)]">Currency</h2>
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
                </div>
            </SectionCard>

            <SectionCard>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-[color:var(--app-text)]">
                            Information and reset
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                            Open supporting pages or restore settings when you want a clean slate.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => updateAppSettings(DEFAULT_APP_SETTINGS)}
                        className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                    >
                        Reset settings
                    </button>
                </div>

                <div className={`mt-5 grid gap-4 ${compact ? "" : "md:grid-cols-2"}`}>
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
                        title="Feedback"
                        description="Open the feedback form and send bugs, requests, or suggestions."
                        to="/settings/feedback"
                        onNavigate={onNavigate}
                    />
                </div>

                <div className="app-subtle-surface mt-4 rounded-[var(--app-radius-lg)] p-4 md:p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-2xl">
                            <h3 className="text-base font-semibold text-[color:var(--app-text)]">
                                Offline history
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                                Clear saved route history, recommendations, recent prompts, and
                                offline activity stored on this device.
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
            </SectionCard>
        </div>
    );
}
