const LEGACY_THEME_FAMILY_MAP = {
    aqua: "ocean",
    graphite: "slate",
    berry: "rose",
    jade: "emerald",
};
export const THEME_FAMILY_OPTIONS = [
    {
        value: "classic",
        title: "Classic",
        description: "Warm editorial contrast with confident orange and blue accents.",
        swatches: ["#e9673d", "#5468e8", "#c88a37"],
        featured: true,
    },
    {
        value: "ocean",
        title: "Ocean",
        description: "Cool blue and teal tones for a crisp analytical workspace.",
        swatches: ["#0f8eb8", "#42b8b4", "#7cc8ff"],
        featured: true,
    },
    {
        value: "slate",
        title: "Slate",
        description: "Neutral graphite surfaces with restrained steel-blue emphasis.",
        swatches: ["#64748b", "#334155", "#94a3b8"],
        featured: true,
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
        value: "emerald",
        title: "Emerald",
        description: "Green and jade tones for a fresh planning and workbook vibe.",
        swatches: ["#10b981", "#14b8a6", "#34d399"],
        featured: true,
    },
    {
        value: "butter",
        title: "Butter",
        description: "Soft golden surfaces with a calm scholarly warmth.",
        swatches: ["#f4d892", "#c0b05b", "#b8861e"],
        featured: true,
    },
    {
        value: "moss",
        title: "Moss",
        description: "Earthy olive contrast that feels grounded and deliberate.",
        swatches: ["#c0b05b", "#657652", "#d7c980"],
    },
    {
        value: "palm",
        title: "Palm",
        description: "Deep green restraint for dense work and longer sessions.",
        swatches: ["#657652", "#8e9d77", "#d4dec0"],
    },
    {
        value: "guava",
        title: "Guava",
        description: "Muted coral warmth with friendlier study-page energy.",
        swatches: ["#f2b6a3", "#e89c73", "#c97866"],
    },
    {
        value: "sunset",
        title: "Sunset",
        description: "Apricot and amber accents for a brighter dashboard tone.",
        swatches: ["#e89c73", "#f4d892", "#d9784b"],
        featured: true,
    },
    {
        value: "sangria",
        title: "Sangria",
        description: "Bold coral-red focus with stronger wayfinding contrast.",
        swatches: ["#e36559", "#f2b6a3", "#b54a47"],
        featured: true,
    },
    {
        value: "seabreeze",
        title: "Seabreeze",
        description: "Airy mist tones with quieter chrome and softer edges.",
        swatches: ["#e5e9eb", "#94bebb", "#5f7c8b"],
    },
    {
        value: "lagoon",
        title: "Lagoon",
        description: "Balanced aqua depth with practical contrast and calm color.",
        swatches: ["#94bebb", "#23617e", "#d6efee"],
        featured: true,
    },
    {
        value: "odyssey",
        title: "Odyssey",
        description: "Deep blue navigation tones for a more premium analytical feel.",
        swatches: ["#23617e", "#94bebb", "#e5e9eb"],
        featured: true,
    },
];
export function isThemeFamily(value) {
    return THEME_FAMILY_OPTIONS.some((option) => option.value === value);
}
export function normalizeThemeFamily(value) {
    if (isThemeFamily(value)) {
        return value;
    }
    if (typeof value === "string" && value in LEGACY_THEME_FAMILY_MAP) {
        return LEGACY_THEME_FAMILY_MAP[value];
    }
    return "classic";
}
export function resolveThemeMode(preference, systemPrefersDark) {
    if (preference === "system") {
        return systemPrefersDark ? "dark" : "light";
    }
    return preference;
}
export function getThemeMetaColor(mode, family) {
    const palette = {
        classic: { light: "#f4f4f6", dark: "#0c1016" },
        ocean: { light: "#eef8fb", dark: "#09151b" },
        slate: { light: "#f2f4f7", dark: "#0f1721" },
        rose: { light: "#fff1f5", dark: "#1a0f16" },
        blossom: { light: "#fff4f8", dark: "#1a1015" },
        lavender: { light: "#f6f3ff", dark: "#120f1d" },
        emerald: { light: "#effcf6", dark: "#0b1713" },
        butter: { light: "#f6efdc", dark: "#18150f" },
        moss: { light: "#f1edd9", dark: "#171611" },
        palm: { light: "#ecf0e6", dark: "#101510" },
        guava: { light: "#fff1eb", dark: "#1a1211" },
        sunset: { light: "#fff0e7", dark: "#1b120f" },
        sangria: { light: "#fff0ed", dark: "#1b1111" },
        seabreeze: { light: "#f3f7f8", dark: "#10161a" },
        lagoon: { light: "#ecf6f5", dark: "#0d1518" },
        odyssey: { light: "#edf4f7", dark: "#0c1318" },
    };
    return palette[family][mode];
}
