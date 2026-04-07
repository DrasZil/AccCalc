export type NoteTone = "default" | "info" | "warning" | "success" | "accent";

export function toneClassName(tone: NoteTone) {
    switch (tone) {
        case "info":
            return "app-tone-info";
        case "warning":
            return "app-tone-warning";
        case "success":
            return "app-tone-success";
        case "accent":
            return "app-tone-accent";
        default:
            return "app-subtle-surface";
    }
}

