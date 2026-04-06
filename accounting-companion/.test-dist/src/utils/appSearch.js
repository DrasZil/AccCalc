import { APP_ROUTE_META } from "./appCatalog.js";
function normalizeText(value) {
    return value
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function compactText(value) {
    return normalizeText(value).replace(/\s+/g, "");
}
function tokenize(value) {
    return normalizeText(value).split(" ").filter(Boolean);
}
function initialism(value) {
    return tokenize(value)
        .map((token) => token[0])
        .join("");
}
function levenshteinDistance(left, right) {
    if (left === right)
        return 0;
    if (!left.length)
        return right.length;
    if (!right.length)
        return left.length;
    const rows = Array.from({ length: left.length + 1 }, () => new Array(right.length + 1).fill(0));
    for (let i = 0; i <= left.length; i += 1)
        rows[i][0] = i;
    for (let j = 0; j <= right.length; j += 1)
        rows[0][j] = j;
    for (let i = 1; i <= left.length; i += 1) {
        for (let j = 1; j <= right.length; j += 1) {
            const cost = left[i - 1] === right[j - 1] ? 0 : 1;
            rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
        }
    }
    return rows[left.length][right.length];
}
function isTypoMatch(queryToken, candidateToken) {
    if (queryToken.length < 4 || candidateToken.length < 4)
        return false;
    const distance = levenshteinDistance(queryToken, candidateToken);
    return queryToken.length >= 7 || candidateToken.length >= 7
        ? distance <= 2
        : distance <= 1;
}
function candidateTexts(route) {
    const direct = [
        route.label,
        route.description,
        route.category,
        route.subtopic,
        ...route.aliases,
        ...route.keywords,
        ...route.tags,
    ];
    return Array.from(new Set(direct.flatMap((item) => {
        const normalized = normalizeText(item);
        if (!normalized)
            return [];
        return [normalized, compactText(item), initialism(item)];
    }))).filter(Boolean);
}
function scoreRoute(route, rawQuery) {
    const query = normalizeText(rawQuery);
    const compactQuery = compactText(rawQuery);
    const queryTokens = tokenize(rawQuery);
    if (!query) {
        return { score: 0, matchLabel: "metadata" };
    }
    let score = 0;
    let matchLabel = "metadata";
    const label = normalizeText(route.label);
    const compactLabel = compactText(route.label);
    const aliasTexts = route.aliases.map(normalizeText);
    const tagTexts = route.tags.map(normalizeText);
    const keywordTexts = route.keywords.map(normalizeText);
    const candidates = candidateTexts(route);
    if (label === query) {
        return { score: 200, matchLabel: "exact title" };
    }
    if (compactLabel === compactQuery || initialism(route.label) === compactQuery) {
        return { score: 185, matchLabel: "abbreviation" };
    }
    if (label.startsWith(query)) {
        score += 145;
        matchLabel = "title prefix";
    }
    else if (label.includes(query)) {
        score += 120;
        matchLabel = "title";
    }
    if (aliasTexts.some((alias) => alias === query)) {
        score += 110;
        matchLabel = "alias";
    }
    else if (aliasTexts.some((alias) => alias.startsWith(query))) {
        score += 95;
        matchLabel = "alias prefix";
    }
    if (tagTexts.some((tag) => tag === query) || keywordTexts.some((keyword) => keyword === query)) {
        score += 80;
        matchLabel = "tag";
    }
    if (normalizeText(route.category) === query) {
        score += 60;
        matchLabel = "category";
    }
    queryTokens.forEach((queryToken) => {
        candidates.forEach((candidate) => {
            if (!candidate)
                return;
            if (candidate === queryToken) {
                score += 26;
                return;
            }
            if (candidate.startsWith(queryToken)) {
                score += 20;
                return;
            }
            if (candidate.includes(queryToken)) {
                score += 12;
                return;
            }
            if (isTypoMatch(queryToken, candidate)) {
                score += 8;
            }
        });
    });
    if (route.isNew)
        score += 4;
    if (route.category === "Accounting")
        score += 3;
    return { score, matchLabel };
}
export function searchAppRoutes(query, limit = 8) {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery)
        return [];
    return APP_ROUTE_META.map((route) => {
        const { score, matchLabel } = scoreRoute(route, normalizedQuery);
        return { ...route, score, matchLabel };
    })
        .filter((route) => route.score > 0)
        .sort((left, right) => right.score - left.score || left.label.localeCompare(right.label))
        .slice(0, limit);
}
export function getSuggestedRoutes(limit = 8) {
    return APP_ROUTE_META.filter((route) => route.path !== "/settings/about" &&
        route.path !== "/settings/install" &&
        route.path !== "/settings/feedback")
        .map((route) => ({
        ...route,
        score: route.isNew ? 120 : route.category === "Accounting" ? 90 : 70,
        matchLabel: route.isNew ? "new" : "popular",
    }))
        .sort((left, right) => right.score - left.score || left.label.localeCompare(right.label))
        .slice(0, limit);
}
export function groupSearchResults(results) {
    return results.reduce((groups, result) => {
        groups[result.category] = [...(groups[result.category] ?? []), result];
        return groups;
    }, {});
}
