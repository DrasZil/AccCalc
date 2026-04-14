import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeBusinessCombination } from "../../utils/calculatorMath";

type MeasurementMode = "fair-value" | "proportionate-share";

export default function BusinessCombinationAnalysisPage() {
    const [considerationTransferred, setConsiderationTransferred] = useState("");
    const [netIdentifiableAssetsFairValue, setNetIdentifiableAssetsFairValue] = useState("");
    const [ownershipPercent, setOwnershipPercent] = useState("");
    const [measurementMode, setMeasurementMode] = useState<MeasurementMode>("fair-value");
    const [nonControllingInterestFairValue, setNonControllingInterestFairValue] = useState("");

    const result = useMemo(() => {
        if (
            considerationTransferred.trim() === "" ||
            netIdentifiableAssetsFairValue.trim() === "" ||
            ownershipPercent.trim() === ""
        ) {
            return null;
        }

        const consideration = Number(considerationTransferred);
        const netAssets = Number(netIdentifiableAssetsFairValue);
        const ownership = Number(ownershipPercent);
        const nciFairValue =
            nonControllingInterestFairValue.trim() === ""
                ? 0
                : Number(nonControllingInterestFairValue);

        if ([consideration, netAssets, ownership].some((value) => Number.isNaN(value))) {
            return { error: "Core business-combination inputs must be valid numbers." };
        }

        if (
            measurementMode === "fair-value" &&
            (nonControllingInterestFairValue.trim() === "" || Number.isNaN(nciFairValue))
        ) {
            return { error: "Fair-value NCI measurement needs a valid non-controlling interest fair value." };
        }

        return computeBusinessCombination({
            considerationTransferred: consideration,
            netIdentifiableAssetsFairValue: netAssets,
            ownershipPercent: ownership,
            nonControllingInterestMeasurement: measurementMode,
            nonControllingInterestFairValue: nciFairValue,
        });
    }, [
        considerationTransferred,
        measurementMode,
        netIdentifiableAssetsFairValue,
        nonControllingInterestFairValue,
        ownershipPercent,
    ]);

    return (
        <CalculatorPageLayout
            badge="AFAR"
            title="Business Combination Analysis"
            description="Estimate goodwill or bargain purchase gain and compare full-goodwill versus proportionate-share NCI measurement from one consolidation review workspace."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setMeasurementMode("fair-value")}
                                className={[
                                    "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                    measurementMode === "fair-value"
                                        ? "app-button-primary"
                                        : "app-button-ghost",
                                ].join(" ")}
                            >
                                Full goodwill
                            </button>
                            <button
                                type="button"
                                onClick={() => setMeasurementMode("proportionate-share")}
                                className={[
                                    "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                    measurementMode === "proportionate-share"
                                        ? "app-button-primary"
                                        : "app-button-ghost",
                                ].join(" ")}
                            >
                                Proportionate share
                            </button>
                        </div>
                        <p className="app-body-md mt-3 text-sm">
                            Choose how the non-controlling interest is measured before reading the
                            goodwill amount.
                        </p>
                    </SectionCard>

                    <SectionCard>
                        <InputGrid columns={2}>
                            <InputCard
                                label="Consideration Transferred"
                                value={considerationTransferred}
                                onChange={setConsiderationTransferred}
                                placeholder="4500000"
                            />
                            <InputCard
                                label="Fair Value of Net Identifiable Assets"
                                value={netIdentifiableAssetsFairValue}
                                onChange={setNetIdentifiableAssetsFairValue}
                                placeholder="5200000"
                            />
                            <InputCard
                                label="Ownership Acquired (%)"
                                value={ownershipPercent}
                                onChange={setOwnershipPercent}
                                placeholder="80"
                            />
                            {measurementMode === "fair-value" ? (
                                <InputCard
                                    label="Fair Value of NCI"
                                    value={nonControllingInterestFairValue}
                                    onChange={setNonControllingInterestFairValue}
                                    placeholder="1180000"
                                />
                            ) : (
                                <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                    <p className="app-card-title text-sm">NCI basis</p>
                                    <p className="app-body-md mt-2 text-sm">
                                        Under proportionate-share measurement, NCI is derived from the
                                        fair value of net identifiable assets.
                                    </p>
                                </div>
                            )}
                        </InputGrid>
                    </SectionCard>
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={4}>
                        <ResultCard
                            title="NCI Amount"
                            value={formatPHP(result.nonControllingInterest)}
                            tone="accent"
                        />
                        <ResultCard
                            title="Implied Acquiree Fair Value"
                            value={formatPHP(result.impliedAcquireeFairValue)}
                        />
                        <ResultCard
                            title={result.goodwill >= 0 ? "Goodwill" : "Bargain Purchase Gain"}
                            value={formatPHP(Math.abs(result.goodwill))}
                        />
                        <ResultCard title="Outcome" value={result.resultLabel} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Goodwill = Consideration transferred + NCI - Fair value of net identifiable assets"
                        steps={[
                            `NCI amount = ${formatPHP(result.nonControllingInterest)}.`,
                            `Implied acquiree fair value = ${formatPHP(Number(considerationTransferred))} + ${formatPHP(result.nonControllingInterest)} = ${formatPHP(result.impliedAcquireeFairValue)}.`,
                            `${result.goodwill >= 0 ? "Goodwill" : "Bargain purchase gain"} = ${formatPHP(result.impliedAcquireeFairValue)} - ${formatPHP(Number(netIdentifiableAssetsFairValue))} = ${formatPHP(result.goodwill)}.`,
                        ]}
                        interpretation="Use this page to study the acquisition-date logic of business combinations. The consolidation entries, intercompany eliminations, and later-period adjustments still need separate analysis."
                        warnings={[
                            "This workspace assumes acquisition-date fair values are already determined.",
                            "The result can change when contingent consideration, previously held interests, or step acquisitions are part of the case.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
