import { explainConfidence } from "../services/ocr/ocrConfidence";
import type { ConfidenceLevel } from "../types";

type ScanConfidenceBadgeProps = {
    level: ConfidenceLevel;
    score: number;
};

export default function ScanConfidenceBadge({
    level,
    score,
}: ScanConfidenceBadgeProps) {
    const toneClass =
        level === "high"
            ? "app-tone-success"
            : level === "medium"
              ? "app-tone-info"
              : "app-tone-warning";

    return (
        <div className={`${toneClass} rounded-full px-3 py-1 text-xs font-semibold`}>
            {Math.round(score)}% {level} confidence
            <span className="sr-only">{explainConfidence(score)}</span>
        </div>
    );
}

