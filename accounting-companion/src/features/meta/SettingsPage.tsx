import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import {
    DEFAULT_APP_SETTINGS,
    type AppSettings,
    updateAppSettings,
    useAppSettings,
} from "../../utils/appSettings";

type ToggleRowProps = {
    title: string;
    description: string;
    value: boolean;
    onChange: (value: boolean) => void;
};

function ToggleRow({ title, description, value, onChange }: ToggleRowProps) {
    return (
        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-400">{description}</p>
            </div>

            <button
                type="button"
                onClick={() => onChange(!value)}
                className={[
                    "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition",
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
}: {
    title: string;
    description: string;
    to: string;
}) {
    return (
        <Link
            to={to}
            className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 transition hover:bg-white/8"
        >
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
            <p className="mt-4 text-sm font-medium text-green-300">Open →</p>
        </Link>
    );
}

export default function SettingsPage() {
    const settings = useAppSettings();

    function setSetting<Key extends keyof AppSettings>(key: Key, value: AppSettings[Key]) {
        updateAppSettings({ [key]: value } as Partial<AppSettings>);
    }

    return (
        <div className="space-y-6">
            <PageHeader
                badge="Settings"
                title="App Preferences"
                description="Control navigation behavior, Smart Solver presentation, and home-screen install prompts. These settings are saved on this device."
            />

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
                        onChange={(value) => setSetting("rememberDesktopSidebarVisibility", value)}
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

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <LinkTile
                        title="About AccCalc"
                        description="Read the purpose, direction, and goals behind the app."
                        to="/settings/about"
                    />
                    <LinkTile
                        title="Feedback"
                        description="Open the feedback form and send bugs, requests, or suggestions."
                        to="/settings/feedback"
                    />
                </div>
            </SectionCard>
        </div>
    );
}
