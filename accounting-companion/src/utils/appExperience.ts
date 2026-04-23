import {
    APP_NAV_GROUPS,
    getRouteMeta,
    type AppNavGroupTitle,
    type RouteMeta,
} from "./appCatalog.js";
import { getAllStudyTopics, getStudyCategoryTrack } from "../features/study/studyContent.js";

export type RouteSurface =
    | "smart"
    | "study"
    | "workspace"
    | "calculator"
    | "system";

export type CurriculumTrackSnapshot = {
    track: AppNavGroupTitle;
    routeCount: number;
    lessonCount: number;
    workspaceCount: number;
    calculatorCount: number;
    status: "dense" | "growing" | "emerging";
    highlightPaths: string[];
};

export function inferRouteSurface(path: string, label = "", description = ""): RouteSurface {
    const haystack = `${path} ${label} ${description}`.toLowerCase();

    if (
        path === "/" ||
        path === "/history" ||
        path === "/settings" ||
        path === "/about" ||
        path === "/install-guide" ||
        path === "/workpapers"
    ) {
        return "system";
    }

    if (path.startsWith("/smart/") || path.startsWith("/scan-check")) {
        return "smart";
    }

    if (path.startsWith("/study")) {
        return "study";
    }

    if (
        haystack.includes("workspace") ||
        haystack.includes("review") ||
        haystack.includes("reviewer") ||
        haystack.includes("analysis") ||
        haystack.includes("builder") ||
        haystack.includes("mapper") ||
        haystack.includes("planner") ||
        haystack.includes("comparison") ||
        haystack.includes("dashboard") ||
        haystack.includes("studio") ||
        haystack.includes("flow")
    ) {
        return "workspace";
    }

    return "calculator";
}

export function getRouteSurfaceLabel(surface: RouteSurface) {
    switch (surface) {
        case "smart":
            return "Smart tool";
        case "study":
            return "Lesson";
        case "workspace":
            return "Analyzer / workspace";
        case "system":
            return "System surface";
        default:
            return "Calculator";
    }
}

export function getRouteSurfaceTone(surface: RouteSurface) {
    switch (surface) {
        case "smart":
            return "app-tone-accent";
        case "study":
            return "app-subtle-surface";
        case "workspace":
            return "app-tone-info";
        case "system":
            return "app-tone-success";
        default:
            return "app-subtle-surface";
    }
}

export function getSuggestedSiblingRoutes(currentPath: string, limit = 3): RouteMeta[] {
    const currentRoute = getRouteMeta(currentPath);
    if (!currentRoute) return [];

    const currentSurface = inferRouteSurface(
        currentRoute.path,
        currentRoute.label,
        currentRoute.description
    );

    return APP_NAV_GROUPS.flatMap((group) => group.items)
        .map((item) => getRouteMeta(item.path))
        .filter((route): route is RouteMeta => Boolean(route))
        .filter((route) => route.path !== currentRoute.path)
        .map((route) => {
            const surface = inferRouteSurface(route.path, route.label, route.description);
            let score = 0;

            if (route.category === currentRoute.category) score += 6;
            if (route.subtopic === currentRoute.subtopic) score += 5;
            if (surface === currentSurface) score += 2;
            score += route.tags.filter((tag) => currentRoute.tags.includes(tag)).length * 3;
            score += route.keywords.filter((keyword) =>
                currentRoute.keywords.includes(keyword)
            ).length;

            return { route, score };
        })
        .filter((entry) => entry.score > 0)
        .sort(
            (left, right) =>
                right.score - left.score ||
                left.route.label.localeCompare(right.route.label)
        )
        .slice(0, limit)
        .map((entry) => entry.route);
}

export function buildCurriculumTrackSnapshots(): CurriculumTrackSnapshot[] {
    const lessonCounts = getAllStudyTopics().reduce<Map<string, number>>((map, topic) => {
        const track = getStudyCategoryTrack(topic.category);
        map.set(track, (map.get(track) ?? 0) + 1);
        return map;
    }, new Map());

    return APP_NAV_GROUPS.filter(
        (group) => group.title !== "General" && group.title !== "Smart Tools"
    ).map((group) => {
        const workspaceCount = group.items.filter((item) =>
            inferRouteSurface(
                item.path,
                item.shortLabel ?? item.label,
                item.description ?? ""
            ) === "workspace"
        ).length;
        const calculatorCount = group.items.filter((item) =>
            inferRouteSurface(
                item.path,
                item.shortLabel ?? item.label,
                item.description ?? ""
            ) === "calculator"
        ).length;
        const lessonCount = lessonCounts.get(group.title) ?? 0;
        const routeCount = group.items.length;
        const coverageScore = routeCount + lessonCount + workspaceCount;

        return {
            track: group.title,
            routeCount,
            lessonCount,
            workspaceCount,
            calculatorCount,
            status:
                coverageScore >= 18
                    ? "dense"
                    : coverageScore >= 10
                      ? "growing"
                      : "emerging",
            highlightPaths: group.items.slice(0, 3).map((item) => item.path),
        };
    });
}
