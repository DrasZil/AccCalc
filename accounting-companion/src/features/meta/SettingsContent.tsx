import { Link } from "react-router-dom";
import SectionCard from "../../components/SectionCard";
import { clearStoredActivity } from "../../utils/appActivity";
import {
    DEFAULT_APP_SETTINGS,
    type AppSettings,
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

function ToggleRow({ title, description, value, onChange }: ToggleRowProps) {
    return (
        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.05] md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-400">{description}</p>
            </div>

            <button
                type="button"
                onClick={() => onChange(!value)}
                className={[
                    "inline-flex min-w-20 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-300",
                    value
                        ? "bg-green-500/90 text-black"
                        : "border border-white/10 bg-white/5 text-gray-200",
                ].join(" ")}
            >
                {value ? "On" : "Off"}
            </button>
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
            className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.08]"
        >
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
            <p className="mt-4 text-sm font-medium text-green-300">Open</p>
        </Link>
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
        <div className="space-y-6">
            <SectionCard>
                <h2 className="text-lg font-semibold text-white">Navigation</h2>
                <div className="mt-4 space-y-4">
                    <ToggleRow
                        title="Auto-expand the active navigation group"
                        description="When on, the sidebar opens the group containing the current page. When off, all groups stay collapsed until you open them manually."
                        value={settings.autoExpandActiveNavGroup}
                        onChange={(value) => setSetting("autoExpandActiveNavGroup", value)}
                    />
                    <ToggleRow
                        title="Remember desktop sidebar visibility"
                        description="Keeps your last desktop sidebar state between visits. Turn this off to always show the desktop sidebar on load."
                        value={settings.rememberDesktopSidebarVisibility}
                        onChange={(value) =>
                            setSetting("rememberDesktopSidebarVisibility", value)
                        }
                    />
                    <ToggleRow
                        title="Enable premium motion"
                        description="Keeps the interface transitions, drawer animations, and hover lifts active. Turn this off for the most static experience."
                        value={settings.enableMotionEffects}
                        onChange={(value) => setSetting("enableMotionEffects", value)}
                    />
                    <ToggleRow
                        title="Play opening animation"
                        description="Shows the short startup sequence when the app opens, including installed PWA launches."
                        value={settings.showOpeningAnimation}
                        onChange={(value) => setSetting("showOpeningAnimation", value)}
                    />
                    <ToggleRow
                        title="Show new feature indicators"
                        description="Displays a small new badge beside recently added tools until you open them once."
                        value={settings.showNewFeatureIndicators}
                        onChange={(value) => setSetting("showNewFeatureIndicators", value)}
                    />
                </div>
            </SectionCard>

            <SectionCard>
                <h2 className="text-lg font-semibold text-white">Smart Solver</h2>
                <div className="mt-4 space-y-4">
                    <ToggleRow
                        title="Show prompt examples"
                        description="Displays sample accounting prompts to help users phrase problems naturally."
                        value={settings.smartSolverShowPromptExamples}
                        onChange={(value) => setSetting("smartSolverShowPromptExamples", value)}
                    />

                    <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-2xl">
                                <h3 className="text-base font-semibold text-white">
                                    Suggested calculator count
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-gray-400">
                                    Controls how many top Smart Solver matches are shown in the suggestion list.
                                </p>
                            </div>

                            <select
                                value={String(settings.smartSolverMaxSuggestions)}
                                onChange={(event) =>
                                    setSetting(
                                        "smartSolverMaxSuggestions",
                                        Number(event.target.value)
                                    )
                                }
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none"
                            >
                                {[2, 3, 4, 5, 6].map((value) => (
                                    <option key={value} value={value} className="bg-neutral-950">
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard>
                <h2 className="text-lg font-semibold text-white">Home Experience</h2>
                <div className="mt-4 space-y-4">
                    <ToggleRow
                        title="Show install and share prompt on the home page"
                        description="Displays the install or share prompt when the app is opened on the home page."
                        value={settings.showInstallPrompt}
                        onChange={(value) => setSetting("showInstallPrompt", value)}
                    />
                    <ToggleRow
                        title="Save history offline on this device"
                        description="Keeps recent activity, recommendations, Smart Solver saves, and calculator history even after the app is closed."
                        value={settings.saveOfflineHistory}
                        onChange={(value) => setSetting("saveOfflineHistory", value)}
                    />
                    <ToggleRow
                        title="Show feedback reminders"
                        description="Allows the app to occasionally remind active users to send feedback. You can still dismiss each reminder when it appears."
                        value={settings.showFeedbackReminders}
                        onChange={(value) => setSetting("showFeedbackReminders", value)}
                    />
                </div>
            </SectionCard>

            <SectionCard>
                <h2 className="text-lg font-semibold text-white">Currency</h2>
                <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-2xl">
                            <h3 className="text-base font-semibold text-white">
                                Display currency
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-gray-400">
                                Used across result cards, formulas, and interpretations. Smart Solver can also update this automatically when it detects a currency in your prompt.
                            </p>
                        </div>

                        <select
                            value={settings.preferredCurrency}
                            onChange={(event) =>
                                setSetting("preferredCurrency", event.target.value)
                            }
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none"
                        >
                            {SUPPORTED_CURRENCIES.map((currency) => (
                                <option
                                    key={currency.code}
                                    value={currency.code}
                                    className="bg-neutral-950"
                                >
                                    {currency.code} • {currency.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </SectionCard>

            <SectionCard>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-400">
                            About the project, feedback form, and a quick reset if you want to restore defaults.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => updateAppSettings(DEFAULT_APP_SETTINGS)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
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

                <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-2xl">
                            <h3 className="text-base font-semibold text-white">Offline history</h3>
                            <p className="mt-1 text-sm leading-6 text-gray-400">
                                Clears saved route history, recommendations, recent prompts, and offline activity stored on this device.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={clearStoredActivity}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                            Clear history
                        </button>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
}
