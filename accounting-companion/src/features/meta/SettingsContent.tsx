import { startTransition, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DisclosurePanel from "../../components/DisclosurePanel";
import ShareAppButton from "../../components/ShareAppButton";
import SectionCard from "../../components/SectionCard";
import DonationSupportCard from "../settings/components/DonationSupportCard";
import PermissionCenter from "../settings/components/PermissionCenter";
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
import {
    THEME_FAMILY_OPTIONS,
    type ThemeFamily,
    type ThemeFamilyOption as ThemeFamilyDefinition,
} from "../../utils/themePreferences";
import { useLocalNotifications } from "../../hooks/useLocalNotifications";
import { usePermissionState } from "../../hooks/usePermissionState";
import { updateScanRetentionConsent } from "../../services/storage/storageConsent";

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

const SETTINGS_CATEGORY_LINKS = [
    {
        id: "settings-account",
        label: "Account",
        description: "History, feedback, and support entry points.",
    },
    {
        id: "settings-appearance",
        label: "Appearance",
        description: "Theme, contrast, motion, and reading comfort.",
    },
    {
        id: "settings-workflow",
        label: "Workflow",
        description: "Calculator defaults, Smart Solver, and prompts.",
    },
    {
        id: "settings-data",
        label: "Data",
        description: "Saved history, permissions, offline, and privacy.",
    },
    {
        id: "settings-updates",
        label: "Updates",
        description: "Version status, install guidance, and release notes.",
    },
] as const;

function ToggleRow({ title, description, value, onChange }: ToggleRowProps) {
    return (
        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                <div className="min-w-0 max-w-3xl">
                    <h3 className="app-card-title text-sm">{title}</h3>
                    <p className="app-body-md mt-1 text-sm">{description}</p>
                </div>

                <button
                    type="button"
                    onClick={() => onChange(!value)}
                    className={[
                        "w-full rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:w-auto lg:justify-self-end",
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
            className="app-link-card min-w-0 rounded-[1rem] px-4 py-3.5"
        >
            <h3 className="app-card-title text-sm">{title}</h3>
            <p className="app-body-md mt-1.5 text-sm">{description}</p>
        </Link>
    );
}

function ThemeSwatchRow({
    swatches,
    size = "md",
}: {
    swatches: [string, string, string];
    size?: "sm" | "md";
}) {
    const swatchClass =
        size === "sm"
            ? "h-3.5 w-8 first:ml-0 -ml-2.5"
            : "h-4 w-10 first:ml-0 -ml-3";

    return (
        <div className="inline-flex min-w-0 flex-nowrap items-center overflow-visible pl-0.5">
            {swatches.map((swatch, index) => (
                <span
                    key={`${swatch}-${index}`}
                    className={`${swatchClass} rounded-full border border-white/60 shadow-sm ring-1 ring-black/5`}
                    style={{ backgroundColor: swatch }}
                />
            ))}
        </div>
    );
}

function ThemeSummaryCard({
    option,
    preference,
    highContrastMode,
    motionEnabled,
    onToggleGallery,
    galleryOpen,
}: {
    option: ThemeFamilyDefinition;
    preference: ThemePreference;
    highContrastMode: boolean;
    motionEnabled: boolean;
    onToggleGallery: () => void;
    galleryOpen: boolean;
}) {
    const modeLabel =
        preference === "system"
            ? "System"
            : preference === "dark"
              ? "Dark"
              : "Light";

    return (
        <div className="app-panel rounded-[1.15rem] p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 max-w-2xl">
                    <p className="app-card-title text-sm">Appearance summary</p>
                    <p className="app-body-md mt-1.5 text-sm">
                        {option.title} is active with {modeLabel.toLowerCase()} mode. Open
                        the gallery only when you want to browse the full palette set.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {[
                            `${option.title} family`,
                            `${modeLabel} mode`,
                            highContrastMode ? "High contrast" : "Standard contrast",
                            motionEnabled ? "Motion on" : "Motion reduced",
                        ].map((label) => (
                            <span
                                key={label}
                                className="rounded-full border border-[color:var(--app-border-subtle)] bg-[color:var(--app-chip-bg)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--app-chip-text)]"
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onToggleGallery}
                    className="app-button-secondary rounded-full px-4 py-2 text-sm font-medium"
                >
                    {galleryOpen ? "Hide theme gallery" : "Open theme gallery"}
                </button>
            </div>

            <div className="mt-4 rounded-[1rem] border border-[color:var(--app-border-subtle)] bg-[color:var(--app-surface)] p-3">
                <div className="flex min-w-0 items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--app-text-muted)]">
                            Live sample
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                            {option.title} workspace chrome
                        </p>
                    </div>
                    <ThemeSwatchRow swatches={option.swatches} />
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-[1.35fr_0.65fr]">
                    <div className="rounded-[0.9rem] border border-[color:var(--app-border-subtle)] bg-[color:var(--app-panel-bg-soft)] p-3">
                        <div
                            className="h-2.5 rounded-full"
                            style={{
                                background: `linear-gradient(90deg, ${option.swatches[0]}, ${option.swatches[1]})`,
                            }}
                        />
                        <div className="mt-3 grid gap-2">
                            <div className="h-2.5 rounded-full bg-[color:var(--app-border)]/70" />
                            <div className="h-2.5 w-3/4 rounded-full bg-[color:var(--app-border)]/50" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <div className="rounded-[0.9rem] border border-[color:var(--app-border-subtle)] bg-[color:var(--app-panel-bg-soft)] p-3">
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: option.swatches[1] }}
                                />
                                <div className="h-2 w-20 rounded-full bg-[color:var(--app-border)]/60" />
                            </div>
                        </div>
                        <div className="rounded-[0.9rem] border border-[color:var(--app-border-subtle)] bg-[color:var(--app-panel-bg-soft)] p-3">
                            <div className="flex items-end gap-1">
                                {[44, 60, 72, 52].map((height, index) => (
                                    <span
                                        key={`${option.value}-${height}-${index}`}
                                        className="w-4 rounded-t-full"
                                        style={{
                                            height: `${height / 4}px`,
                                            backgroundColor:
                                                option.swatches[index % option.swatches.length],
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ThemeFamilyStripButton({
    option,
    active,
    onSelect,
}: {
    option: ThemeFamilyDefinition;
    active: boolean;
    onSelect: (value: ThemeFamily) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onSelect(option.value)}
            className={[
                "min-w-[11rem] rounded-[0.95rem] border px-3.5 py-3 text-left transition md:min-w-0",
                active
                    ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] shadow-[var(--app-shadow-sm)]"
                    : "app-subtle-surface hover:border-[color:var(--app-border-strong)]",
            ].join(" ")}
        >
            <div className="flex min-w-0 flex-col gap-2">
                <div className="min-w-0">
                    <p className="app-card-title text-sm">{option.title}</p>
                    <p className="app-helper mt-1 text-xs">Quick switch</p>
                </div>
                <ThemeSwatchRow swatches={option.swatches} size="sm" />
            </div>
        </button>
    );
}

function ThemeFamilyCard({
    option,
    active,
    onSelect,
}: {
    option: ThemeFamilyDefinition;
    active: boolean;
    onSelect: (value: ThemeFamily) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onSelect(option.value)}
            className={[
                "h-full min-w-0 rounded-[1rem] border px-4 py-3.5 text-left transition",
                active
                    ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] shadow-[var(--app-shadow-sm)]"
                    : "app-subtle-surface hover:border-[color:var(--app-border-strong)]",
            ].join(" ")}
        >
            <div className="flex min-w-0 flex-col gap-2.5">
                <div className="min-w-0">
                    <p className="app-card-title text-sm">{option.title}</p>
                    <p className="app-helper mt-1 text-xs">
                        Saved across light, dark, and system mode.
                    </p>
                </div>
                <ThemeSwatchRow swatches={option.swatches} />
            </div>
            <p className="app-body-md app-wrap-anywhere mt-2 text-sm">{option.description}</p>
            {active ? (
                <span className="mt-3 inline-flex rounded-full bg-[color:var(--app-chip-bg)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--app-chip-text)]">
                    Selected
                </span>
            ) : null}
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

            <div className="mt-3 grid gap-2 lg:grid-cols-3">
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
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(11rem,16rem)] lg:items-start">
                <div className="min-w-0 max-w-3xl">
                    <h3 className="app-card-title text-sm">{title}</h3>
                    <p className="app-body-md mt-1 text-sm">{description}</p>
                </div>

                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="app-select w-full min-w-0 rounded-xl px-4 py-2 text-sm outline-none lg:justify-self-end"
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
    const [themeGalleryOpen, setThemeGalleryOpen] = useState(false);
    const update = useAppUpdateState();
    const permissions = usePermissionState();
    const notifications = useLocalNotifications({
        enabled: settings.reminderNotificationsEnabled,
        category: settings.reminderCategory,
        tone: settings.reminderTone,
        frequency: settings.reminderFrequency,
    });
    const currentThemeFamily = useMemo(
        () =>
            THEME_FAMILY_OPTIONS.find((option) => option.value === settings.themeFamily) ??
            THEME_FAMILY_OPTIONS[0],
        [settings.themeFamily]
    );
    const featuredThemeFamilies = useMemo(() => {
        const next: ThemeFamilyDefinition[] = [];
        const seen = new Set<ThemeFamily>();

        const pushOption = (option: ThemeFamilyDefinition | undefined) => {
            if (!option || seen.has(option.value)) return;
            seen.add(option.value);
            next.push(option);
        };

        pushOption(currentThemeFamily);
        THEME_FAMILY_OPTIONS.filter((option) => option.featured).forEach(pushOption);

        return next.slice(0, 6);
    }, [currentThemeFamily]);

    const quickStats = useMemo(
        () => [
            {
                label: "Theme",
                value: `${currentThemeFamily.title} / ${
                    settings.themePreference === "system"
                        ? "Auto"
                        : settings.themePreference === "dark"
                          ? "Dark"
                          : "Light"
                }`,
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
            currentThemeFamily.title,
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

    const storageSummary = permissions.persistentStorage.supported
        ? permissions.persistentStorage.persisted
            ? "Persistent browser storage is already available on this device."
            : "Browser storage is available, but the browser may still clear cached data under pressure."
        : "This browser does not expose persistent-storage status, so local history and scan retention should be treated as best-effort.";

    async function requestCameraPermission() {
        if (!navigator.mediaDevices?.getUserMedia) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false,
            });
            stream.getTracks().forEach((track) => track.stop());
        } catch {
            // Camera state is reflected by the permission hook and browser behavior.
        }
    }

    function jumpToCategory(id: (typeof SETTINGS_CATEGORY_LINKS)[number]["id"]) {
        if (typeof document === "undefined") return;
        document.getElementById(id)?.scrollIntoView({
            block: "start",
            behavior: "smooth",
        });
    }

    return (
        <div className="app-page-stack">
            <SectionCard>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="app-section-kicker">Settings</p>
                        <h2 className="app-section-title mt-2 text-lg">App controls</h2>
                        <p className="app-body-md mt-1.5 text-sm">
                            Short, grouped controls for appearance, Scan & Check behavior, solver defaults, offline use, history, and accessibility.
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

                <div className="mt-4 grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
                    {quickStats.map((item) => (
                        <div key={item.label} className="app-subtle-surface min-w-0 rounded-[1rem] px-4 py-3">
                            <p className="app-metric-label">{item.label}</p>
                            <p className="app-wrap-anywhere mt-2 text-base font-semibold text-[color:var(--app-text)]">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </SectionCard>

            <SectionCard>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="app-section-kicker">Category map</p>
                        <h2 className="app-section-title mt-2 text-lg">Jump to the settings category you need</h2>
                        <p className="app-helper mt-2 text-sm leading-6">
                            Settings are grouped below by job so you can move straight to
                            appearance, workflow, privacy, or update controls.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]">
                    {SETTINGS_CATEGORY_LINKS.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => jumpToCategory(category.id)}
                            className="app-link-card rounded-[1rem] px-4 py-3.5 text-left"
                        >
                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                {category.label}
                            </p>
                            <p className="app-helper mt-1.5 text-xs leading-5">
                                {category.description}
                            </p>
                        </button>
                    ))}
                </div>
            </SectionCard>

            <section id="settings-account" className="scroll-mt-28 space-y-4">
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
            </section>

            <section id="settings-appearance" className="scroll-mt-28 space-y-4">
            <DisclosurePanel
                title="Appearance"
                summary="Theme, contrast, and motion."
                badge="Visual"
                defaultOpen
                compact={compact}
            >
                <div className="space-y-4">
                    <ThemeSummaryCard
                        option={currentThemeFamily}
                        preference={settings.themePreference}
                        highContrastMode={settings.highContrastMode}
                        motionEnabled={settings.enableMotionEffects}
                        galleryOpen={themeGalleryOpen}
                        onToggleGallery={() =>
                            startTransition(() => {
                                setThemeGalleryOpen((current) => !current);
                            })
                        }
                    />
                    <SegmentedRow
                        title="Color mode"
                        description="Keep the everyday control simple: follow the device or stay fixed in light or dark mode."
                        value={settings.themePreference}
                        onChange={(value) => setSetting("themePreference", value)}
                        options={THEME_OPTIONS}
                    />
                    <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 max-w-3xl">
                                <h3 className="app-card-title text-sm">Theme family</h3>
                                <p className="app-body-md mt-1 text-sm">
                                    Keep a few strong options visible for fast switching, then
                                    open the full gallery only when you want to browse.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    startTransition(() => {
                                        setThemeGalleryOpen((current) => !current);
                                    })
                                }
                                className="app-button-secondary rounded-full px-4 py-2 text-sm font-medium"
                            >
                                {themeGalleryOpen ? "Hide gallery" : "More themes"}
                            </button>
                        </div>

                        <div className="-mx-1 mt-3 overflow-x-auto pb-1">
                            <div className="flex min-w-max gap-2 px-1 md:grid md:min-w-0 md:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
                                {featuredThemeFamilies.map((option) => (
                                    <ThemeFamilyStripButton
                                        key={`strip-${option.value}`}
                                        option={option}
                                        active={settings.themeFamily === option.value}
                                        onSelect={(value) => setSetting("themeFamily", value)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    {themeGalleryOpen ? (
                        <div className="app-panel rounded-[1.15rem] p-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div className="min-w-0 max-w-2xl">
                                    <p className="app-card-title text-sm">Theme gallery</p>
                                    <p className="app-body-md mt-1 text-sm">
                                        Palette-led families inspired by butter, moss, palm,
                                        guava, sunset, sangria, seabreeze, lagoon, and odyssey.
                                    </p>
                                </div>
                                <p className="app-helper text-xs">
                                    The selected family persists across reloads and mode changes.
                                </p>
                            </div>

                            <div className="mt-4 grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {THEME_FAMILY_OPTIONS.map((option) => (
                                <ThemeFamilyCard
                                    key={option.value}
                                    option={option}
                                    active={settings.themeFamily === option.value}
                                    onSelect={(value) => setSetting("themeFamily", value)}
                                />
                            ))}
                            </div>
                        </div>
                    ) : null}
                    <div className="grid gap-4 xl:grid-cols-2">
                        <ToggleRow
                            title="High contrast support"
                            description="Strengthen borders and text contrast for denser study sessions and accessibility-sensitive screens."
                            value={settings.highContrastMode}
                            onChange={(value) => setSetting("highContrastMode", value)}
                        />
                        <ToggleRow
                            title="Premium motion"
                            description="Keep subtle transitions and movement cues active."
                            value={settings.enableMotionEffects}
                            onChange={(value) => setSetting("enableMotionEffects", value)}
                        />
                    </div>
                </div>
            </DisclosurePanel>
            </section>

            <section id="settings-workflow" className="scroll-mt-28 space-y-4">
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

            <section id="settings-data" className="scroll-mt-28 space-y-4">
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
                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                            <div className="min-w-0 max-w-3xl">
                                <h3 className="app-card-title text-sm">Clear local history</h3>
                                <p className="app-body-md mt-1 text-sm">
                                    Remove saved route history, recommendations, and stored prompts from this device.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={clearStoredActivity}
                                className="app-button-secondary w-full rounded-xl px-4 py-2 text-sm font-medium sm:w-auto lg:justify-self-end"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </DisclosurePanel>

            <DisclosurePanel
                title="Permissions / Privacy"
                summary="Explain permissions first, then request only when needed."
                badge="Consent"
                compact={compact}
            >
                <PermissionCenter
                    cameraState={permissions.camera}
                    notificationsState={
                        permissions.notifications === "enabled"
                            ? "enabled"
                            : notifications.permission === "denied"
                              ? "blocked"
                              : permissions.notifications
                    }
                    storageState={permissions.storage}
                    scanRetentionEnabled={settings.scanRetentionEnabled}
                    reminderEnabled={settings.reminderNotificationsEnabled}
                    reminderCategory={settings.reminderCategory}
                    reminderTone={settings.reminderTone}
                    reminderFrequency={settings.reminderFrequency}
                    reminderPreview={notifications.preview}
                    storageSummary={storageSummary}
                    onRequestCamera={() => {
                        void requestCameraPermission();
                    }}
                    onToggleScanRetention={(value) => {
                        setSetting("scanRetentionEnabled", value);
                        updateScanRetentionConsent(value);
                    }}
                    onToggleReminder={(value) =>
                        setSetting("reminderNotificationsEnabled", value)
                    }
                    onRequestNotifications={() => {
                        void notifications.requestPermission();
                    }}
                    onSendPreview={() => {
                        notifications.sendPreview();
                    }}
                    onChangeReminderCategory={(value) =>
                        setSetting("reminderCategory", value)
                    }
                    onChangeReminderTone={(value) => setSetting("reminderTone", value)}
                    onChangeReminderFrequency={(value) =>
                        setSetting("reminderFrequency", value)
                    }
                />
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
                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                            <div className="min-w-0 max-w-3xl">
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
            </section>

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
                    <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                        <p className="app-card-title text-sm">Reminder limits</p>
                        <p className="app-body-md mt-1 text-sm">
                            Browser reminders are opt-in and most reliable while AccCalc is open or recently active. They are not a replacement for full push notifications on every browser.
                        </p>
                    </div>
                </div>
            </DisclosurePanel>
            </section>

            <section id="settings-updates" className="scroll-mt-28 space-y-4">
            <DisclosurePanel
                title="Support"
                summary="Optional support details, full-screen QR viewing, and share/download actions that match the newer premium support flow."
                badge="Support"
                compact={compact}
            >
                <div id="support-accalc">
                    <DonationSupportCard />
                </div>
            </DisclosurePanel>

            <DisclosurePanel
                title="About / Updates"
                summary="Release status, support pages, and the latest shipping notes for the current build."
                badge={`v${APP_VERSION}`}
                compact={compact}
            >
                <div className="space-y-4">
                    <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                            <div className="min-w-0 max-w-3xl">
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
                                className="app-button-secondary w-full rounded-xl px-4 py-2 text-sm font-medium sm:w-auto lg:justify-self-end"
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
                        {APP_RELEASE_NOTES.slice(0, 6).map((note) => (
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
            </section>
        </div>
    );
}
