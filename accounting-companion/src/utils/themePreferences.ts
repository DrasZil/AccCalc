export type ThemeMode = "dark" | "light";

export type ThemeFamily =
    | "classic"
    | "ocean"
    | "slate"
    | "rose"
    | "blossom"
    | "lavender"
    | "sunset"
    | "emerald";

export type ThemeFamilyOption = {
    value: ThemeFamily;
    title: string;
    description: string;
    swatches: [string, string, string];
};

export const THEME_FAMILY_OPTIONS: ThemeFamilyOption[] = [
    {
        value: "classic",
        title: "Classic",
        description: "Warm editorial contrast with confident orange and blue accents.",
        swatches: ["#e9673d", "#5468e8", "#c88a37"],
    },
    {
        value: "ocean",
        title: "Ocean",
        description: "Cool blue and teal tones for a crisp analytical workspace.",
        swatches: ["#0f8eb8", "#42b8b4", "#7cc8ff"],
    },
    {
        value: "slate",
        title: "Slate",
        description: "Neutral graphite surfaces with restrained steel-blue emphasis.",
        swatches: ["#64748b", "#334155", "#94a3b8"],
    },
    {
        value: "rose",
        title: "Rose",
        description: "Bold berry warmth with professional contrast and softer highlights.",
        swatches: ["#d9466f", "#f97393", "#fb7185"],
    },
    {
        value: "blossom",
        title: "Blossom",
        description: "Soft pink coral tones that keep dense study screens friendly.",
        swatches: ["#ec4899", "#f9a8d4", "#fb7185"],
    },
    {
        value: "lavender",
        title: "Lavender",
        description: "Calm violet and lilac accents for longer review sessions.",
        swatches: ["#8b5cf6", "#c084fc", "#a78bfa"],
    },
    {
        value: "sunset",
        title: "Sunset",
        description: "Amber-to-coral accents for a more energetic dashboard feel.",
        swatches: ["#f97316", "#fb7185", "#f59e0b"],
    },
    {
        value: "emerald",
        title: "Emerald",
        description: "Green and jade tones for a fresh planning and workbook vibe.",
        swatches: ["#10b981", "#14b8a6", "#34d399"],
    },
];

export function isThemeFamily(value: unknown): value is ThemeFamily {
    return THEME_FAMILY_OPTIONS.some((option) => option.value === value);
}

export function resolveThemeMode(
    preference: "system" | ThemeMode,
    systemPrefersDark: boolean
): ThemeMode {
    if (preference === "system") {
        return systemPrefersDark ? "dark" : "light";
    }

    return preference;
}

export function getThemeMetaColor(mode: ThemeMode, family: ThemeFamily) {
    const palette: Record<ThemeFamily, { light: string; dark: string }> = {
        classic: { light: "#f4f4f6", dark: "#0c1016" },
        ocean: { light: "#eef8fb", dark: "#09151b" },
        slate: { light: "#f2f4f7", dark: "#0f1721" },
        rose: { light: "#fff1f5", dark: "#1a0f16" },
        blossom: { light: "#fff4f8", dark: "#1a1015" },
        lavender: { light: "#f6f3ff", dark: "#120f1d" },
        sunset: { light: "#fff4ec", dark: "#1b120e" },
        emerald: { light: "#effcf6", dark: "#0b1713" },
    };

    return palette[family][mode];
}
