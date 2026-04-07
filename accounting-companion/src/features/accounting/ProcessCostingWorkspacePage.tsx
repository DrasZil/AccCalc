import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import WorkspaceTabs from "../../components/WorkspaceTabs";
import AccountingWorksheetTable from "../../components/accounting/AccountingWorksheetTable";
import ChartInsightPanel from "../../components/charts/ChartInsightPanel";
import CommonMistakesBlock from "../../components/notes/CommonMistakesBlock";
import InterpretationBlock from "../../components/notes/InterpretationBlock";
import PracticalMeaningBlock from "../../components/notes/PracticalMeaningBlock";
import StudyTipBlock from "../../components/notes/StudyTipBlock";
import formatPHP from "../../utils/formatPHP";
import { buildChartHighlights } from "../../utils/charts/chartHighlights";
import { buildComparisonNarrative } from "../../utils/charts/chartNarratives";
import { computeProcessCosting } from "./processCosting/processCostingMath";
import { buildProcessCostingNotes } from "./processCosting/processCostingNotes";
import type {
    CostSplitMode,
    MaterialsTimingMode,
    ProcessCostingInput,
    ProcessCostingMethod,
    ProcessCostingVariant,
} from "./processCosting/processCosting.types";

type Draft = ReturnType<typeof buildInitialDraft>;
type RouteState = {
    prefill?: Partial<Record<string, string | number | boolean | null | undefined>>;
    scanReview?: {
        summary?: string;
        structuredFields?: Array<{ label: string; value: string; inferred?: boolean }>;
        pageRoles?: Array<{ name: string; role: string }>;
    };
};

const TABS = [
    { id: "input", label: "Input" },
    { id: "worksheet", label: "Worksheet" },
    { id: "graph", label: "Graph" },
    { id: "notes", label: "Notes" },
    { id: "compare", label: "Compare" },
    { id: "scan-review", label: "Scan Review" },
];

const QUANTITY_FIELDS = [
    ["beginningWipUnits", "Beginning WIP Units", "200"],
    ["unitsStartedOrReceived", "Units started / received", "1800"],
    ["unitsCompletedAndTransferred", "Completed / transferred out", "1700"],
    ["endingWipUnits", "Ending WIP Units", "300"],
    ["beginningMaterialsCompletionPercent", "Beginning materials %", "60"],
    ["beginningConversionCompletionPercent", "Beginning conversion %", "40"],
    ["endingMaterialsCompletionPercent", "Ending materials %", "100"],
    ["endingConversionCompletionPercent", "Ending conversion %", "40"],
    ["beginningLaborCompletionPercent", "Beginning labor %", "40"],
    ["beginningOverheadCompletionPercent", "Beginning overhead %", "40"],
    ["endingLaborCompletionPercent", "Ending labor %", "40"],
    ["endingOverheadCompletionPercent", "Ending overhead %", "40"],
] as const;

const COST_FIELDS = [
    ["beginningMaterialsCost", "Beginning materials cost", "12000"],
    ["currentMaterialsCost", "Current materials cost", "54000"],
    ["beginningLaborCost", "Beginning labor cost", "8000"],
    ["currentLaborCost", "Current labor cost", "34000"],
    ["beginningOverheadCost", "Beginning overhead cost", "6000"],
    ["currentOverheadCost", "Current overhead cost", "26000"],
] as const;

function parseNumber(value: string) {
    const parsed = Number(value.replaceAll(",", "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
}

function variantMeta(variant: ProcessCostingVariant) {
    const base = {
        badge: "Accounting / Process Costing",
        title: "Process Costing Workspace",
        description:
            "A configurable process-costing workspace for weighted-average or FIFO schedules, departmental flow, transferred-in cost, and reconciliation.",
    };
    if (variant === "equivalent-units") return { ...base, title: "Equivalent Units of Production" };
    if (variant === "cost-per-eu") return { ...base, title: "Cost per Equivalent Unit" };
    if (variant === "report") return { ...base, title: "Cost of Production Report Generator" };
    if (variant === "department-1") return { ...base, title: "Department 1 Process Costing Workspace" };
    if (variant === "department-2") return { ...base, title: "Department 2+ Process Costing Workspace" };
    if (variant === "weighted-average") return { ...base, title: "Weighted Average Process Costing" };
    if (variant === "fifo") return { ...base, title: "FIFO Process Costing Workspace" };
    if (variant === "reconciliation") return { ...base, title: "Cost Reconciliation Checker" };
    if (variant === "practice-checker") return { badge: "Accounting / Scan Review", title: "Practice Problem Checker", description: "Review OCR-derived worksheet values beside the system-computed answer and likely issue categories." };
    if (variant === "transferred-in") return { ...base, title: "Transferred-In Cost Helper" };
    return base;
}

function buildInitialDraft(variant: ProcessCostingVariant) {
    return {
        departmentLabel: variant === "department-2" || variant === "transferred-in" ? "Department 2" : "Department 1",
        method: variant === "fifo" ? "fifo" : "weighted-average",
        materialsTimingMode: "beginning",
        costSplitMode: "conversion",
        includeTransferredIn: variant === "department-2" || variant === "transferred-in" || variant === "practice-checker",
        beginningWipUnits: "",
        unitsStartedOrReceived: "",
        unitsCompletedAndTransferred: "",
        endingWipUnits: "",
        beginningMaterialsCompletionPercent: "0",
        beginningConversionCompletionPercent: "0",
        beginningLaborCompletionPercent: "0",
        beginningOverheadCompletionPercent: "0",
        endingMaterialsCompletionPercent: "100",
        endingConversionCompletionPercent: "40",
        endingLaborCompletionPercent: "40",
        endingOverheadCompletionPercent: "40",
        customMaterialsCompletionPercent: "100",
        beginningTransferredInCost: "",
        beginningMaterialsCost: "",
        beginningLaborCost: "",
        beginningOverheadCost: "",
        currentTransferredInCost: "",
        currentMaterialsCost: "",
        currentLaborCost: "",
        currentOverheadCost: "",
        extractedCompletedCost: "",
        extractedEndingWipCost: "",
        extractedCostPerEquivalentUnit: "",
    };
}

function toInput(draft: Draft): ProcessCostingInput {
    return {
        departmentLabel: draft.departmentLabel,
        method: draft.method as ProcessCostingMethod,
        materialsTimingMode: draft.materialsTimingMode as MaterialsTimingMode,
        costSplitMode: draft.costSplitMode as CostSplitMode,
        includeTransferredIn: draft.includeTransferredIn,
        beginningWipUnits: parseNumber(draft.beginningWipUnits),
        unitsStartedOrReceived: parseNumber(draft.unitsStartedOrReceived),
        unitsCompletedAndTransferred: parseNumber(draft.unitsCompletedAndTransferred),
        endingWipUnits: parseNumber(draft.endingWipUnits),
        beginningMaterialsCompletionPercent: parseNumber(draft.beginningMaterialsCompletionPercent),
        beginningConversionCompletionPercent: parseNumber(draft.beginningConversionCompletionPercent),
        beginningLaborCompletionPercent: parseNumber(draft.beginningLaborCompletionPercent),
        beginningOverheadCompletionPercent: parseNumber(draft.beginningOverheadCompletionPercent),
        endingMaterialsCompletionPercent: parseNumber(draft.endingMaterialsCompletionPercent),
        endingConversionCompletionPercent: parseNumber(draft.endingConversionCompletionPercent),
        endingLaborCompletionPercent: parseNumber(draft.endingLaborCompletionPercent),
        endingOverheadCompletionPercent: parseNumber(draft.endingOverheadCompletionPercent),
        customMaterialsCompletionPercent: parseNumber(draft.customMaterialsCompletionPercent),
        beginningTransferredInCost: parseNumber(draft.beginningTransferredInCost),
        beginningMaterialsCost: parseNumber(draft.beginningMaterialsCost),
        beginningLaborCost: parseNumber(draft.beginningLaborCost),
        beginningOverheadCost: parseNumber(draft.beginningOverheadCost),
        currentTransferredInCost: parseNumber(draft.currentTransferredInCost),
        currentMaterialsCost: parseNumber(draft.currentMaterialsCost),
        currentLaborCost: parseNumber(draft.currentLaborCost),
        currentOverheadCost: parseNumber(draft.currentOverheadCost),
        extractedCompletedCost: draft.extractedCompletedCost ? parseNumber(draft.extractedCompletedCost) : null,
        extractedEndingWipCost: draft.extractedEndingWipCost ? parseNumber(draft.extractedEndingWipCost) : null,
        extractedCostPerEquivalentUnit: draft.extractedCostPerEquivalentUnit ? parseNumber(draft.extractedCostPerEquivalentUnit) : null,
    };
}

function componentLabel(key: string) {
    return key === "transferredIn" ? "Transferred-In" : key === "materials" ? "Materials" : key === "labor" ? "Labor" : key === "overhead" ? "Overhead" : "Conversion";
}

export default function ProcessCostingWorkspacePage({ variant = "workspace" }: { variant?: ProcessCostingVariant }) {
    const location = useLocation();
    const [tab, setTab] = useState(variant === "practice-checker" ? "compare" : "worksheet");
    const [draft, setDraft] = useState(() => buildInitialDraft(variant));
    const meta = variantMeta(variant);

    useEffect(() => {
        const state = location.state as RouteState | null;
        if (!state?.prefill) return;
        setDraft((current) => {
            const next = { ...current };
            Object.entries(state.prefill ?? {}).forEach(([key, value]) => {
                if (!(key in next) || value === null || value === undefined) return;
                (next as Record<string, string | boolean>)[key] = typeof value === "boolean" ? value : String(value);
            });
            return next;
        });
    }, [location.state]);

    const input = useMemo(() => toInput(draft), [draft]);
    const result = useMemo(() => computeProcessCosting(input), [input]);
    const notes = useMemo(() => buildProcessCostingNotes(input, result), [input, result]);
    const scanReview = (location.state as RouteState | null)?.scanReview ?? null;
    const warnings = [...result.validationWarnings, ...result.comparisonWarnings];
    const activeComponents = Object.entries(result.costPerEquivalentUnit).filter(([, value]) => value !== 0);

    const quantityRows = [
        { label: "Beginning WIP", values: [input.beginningWipUnits.toLocaleString()] },
        { label: input.includeTransferredIn ? "Units received" : "Units started", values: [input.unitsStartedOrReceived.toLocaleString()] },
        { label: "Total units to account for", values: [result.totalUnitsToAccountFor.toLocaleString()], emphasis: "subtotal" as const },
        { label: "Completed and transferred out", values: [input.unitsCompletedAndTransferred.toLocaleString()] },
        { label: "Ending WIP", values: [input.endingWipUnits.toLocaleString()] },
        { label: "Total units accounted for", values: [result.totalUnitsAccountedFor.toLocaleString()], note: Math.abs(result.unitReconciliationDifference) > 0.005 ? "Unit flow does not reconcile yet." : "Units reconcile.", emphasis: "total" as const },
    ];

    const euRows = activeComponents.map(([component, value]) => ({
        label: componentLabel(component),
        values: [result.equivalentUnits[component as keyof typeof result.equivalentUnits].toFixed(2), formatPHP(value)],
    }));

    const costRows = [
        ...activeComponents.map(([component]) => ({
            label: `${componentLabel(component)} cost`,
            values: [
                formatPHP(result.costsToBeAccountedFor[component as keyof typeof result.costsToBeAccountedFor]),
                formatPHP(result.transferredOutBreakdown[component as keyof typeof result.transferredOutBreakdown]),
                formatPHP(result.endingWipBreakdown[component as keyof typeof result.endingWipBreakdown]),
            ],
        })),
        { label: "Total", values: [formatPHP(result.totalCostsToAccountFor), formatPHP(result.totalTransferredOutCost), formatPHP(result.totalEndingWipCost)], note: Math.abs(result.costReconciliationDifference) > 0.5 ? "Costs do not reconcile yet." : "Costs reconcile.", emphasis: "total" as const },
    ];

    const chartItems = [
        { label: "Transferred out", value: result.totalTransferredOutCost, accent: "primary" as const },
        { label: "Ending WIP", value: result.totalEndingWipCost, accent: "secondary" as const },
        ...(input.includeTransferredIn ? [{ label: "Transferred-in pool", value: result.costsToBeAccountedFor.transferredIn, accent: "highlight" as const }] : []),
    ];

    function setField(key: keyof Draft, value: string | boolean) {
        setDraft((current) => ({ ...current, [key]: value }));
    }

    const renderNumericGrid = (fields: readonly (readonly [keyof Draft, string, string])[]) => (
        <InputGrid columns={3}>
            {fields.map(([key, label, placeholder]) => (
                <InputCard key={String(key)} label={label} value={String(draft[key])} onChange={(value) => setField(key, value)} placeholder={placeholder} />
            ))}
        </InputGrid>
    );

    return (
        <CalculatorPageLayout
            badge={meta.badge}
            title={meta.title}
            description={meta.description}
            inputSection={
                <div className="space-y-4">
                    <WorkspaceTabs value={tab} onChange={setTab} tabs={TABS} />
                    <SectionCard>
                        <div className="flex flex-wrap gap-3">
                            <label className="space-y-1"><span className="app-helper text-xs uppercase tracking-[0.16em]">Method</span><select value={draft.method} onChange={(event) => setField("method", event.target.value)} className="app-select rounded-xl px-3 py-2 text-sm"><option value="weighted-average">Weighted Average</option><option value="fifo">FIFO</option></select></label>
                            <label className="space-y-1"><span className="app-helper text-xs uppercase tracking-[0.16em]">Materials timing</span><select value={draft.materialsTimingMode} onChange={(event) => setField("materialsTimingMode", event.target.value)} className="app-select rounded-xl px-3 py-2 text-sm"><option value="beginning">At beginning</option><option value="end">At end</option><option value="custom">Custom completion point</option></select></label>
                            <label className="space-y-1"><span className="app-helper text-xs uppercase tracking-[0.16em]">Cost split</span><select value={draft.costSplitMode} onChange={(event) => setField("costSplitMode", event.target.value)} className="app-select rounded-xl px-3 py-2 text-sm"><option value="conversion">Materials + conversion</option><option value="separate">Separate materials / labor / overhead</option></select></label>
                            <label className="space-y-1"><span className="app-helper text-xs uppercase tracking-[0.16em]">Department</span><input value={draft.departmentLabel} onChange={(event) => setField("departmentLabel", event.target.value)} className="app-field rounded-xl px-3 py-2 text-sm" /></label>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button type="button" onClick={() => setField("includeTransferredIn", !draft.includeTransferredIn)} className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium">{draft.includeTransferredIn ? "Transferred-in mode on" : "Enable transferred-in mode"}</button>
                        </div>
                    </SectionCard>
                    <SectionCard><p className="app-card-title text-base">Quantity and completion inputs</p><div className="mt-4">{renderNumericGrid(QUANTITY_FIELDS)}{draft.materialsTimingMode === "custom" ? <div className="mt-3"><InputGrid columns={3}><InputCard label="Custom material completion %" value={draft.customMaterialsCompletionPercent} onChange={(value) => setField("customMaterialsCompletionPercent", value)} placeholder="75" /></InputGrid></div> : null}</div></SectionCard>
                    <SectionCard><p className="app-card-title text-base">Cost pools</p><div className="mt-4">{renderNumericGrid(COST_FIELDS)}{draft.includeTransferredIn ? <div className="mt-3"><InputGrid columns={3}><InputCard label="Beginning transferred-in cost" value={draft.beginningTransferredInCost} onChange={(value) => setField("beginningTransferredInCost", value)} placeholder="42000" /><InputCard label="Current transferred-in cost" value={draft.currentTransferredInCost} onChange={(value) => setField("currentTransferredInCost", value)} placeholder="190000" /></InputGrid></div> : null}</div></SectionCard>
                    <SectionCard><p className="app-card-title text-base">Optional scan-compare targets</p><div className="mt-4"><InputGrid columns={3}><InputCard label="Scanned completed/transferred total" value={draft.extractedCompletedCost} onChange={(value) => setField("extractedCompletedCost", value)} placeholder="210450" /><InputCard label="Scanned ending WIP total" value={draft.extractedEndingWipCost} onChange={(value) => setField("extractedEndingWipCost", value)} placeholder="34380" /><InputCard label="Scanned cost per EU" value={draft.extractedCostPerEquivalentUnit} onChange={(value) => setField("extractedCostPerEquivalentUnit", value)} placeholder="18.42" /></InputGrid></div></SectionCard>
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <ResultGrid columns={4}>
                        <ResultCard title="Units to account for" value={result.totalUnitsToAccountFor.toLocaleString()} />
                        <ResultCard title="Tracked cost pools" value={activeComponents.length.toString()} />
                        <ResultCard title="Transferred out cost" value={formatPHP(result.totalTransferredOutCost)} />
                        <ResultCard title="Ending WIP cost" value={formatPHP(result.totalEndingWipCost)} />
                    </ResultGrid>
                    {tab === "worksheet" || tab === "input" ? (
                        <>
                            <AccountingWorksheetTable title="Quantity schedule" description="Start by reconciling physical units before checking any equivalent-unit denominator." columns={["Units"]} rows={quantityRows} />
                            <AccountingWorksheetTable title="Equivalent units and cost per equivalent unit" description="The denominator changes with method, materials timing, and transferred-in handling." columns={["Equivalent units", "Cost per EU"]} rows={euRows} />
                            <AccountingWorksheetTable title="Cost reconciliation" description="Compare costs to be accounted for with completed/transferred and ending-WIP allocation." columns={["To account for", "Transferred out", "Ending WIP"]} rows={costRows} />
                        </>
                    ) : null}
                    {tab === "graph" ? (
                        <div className="space-y-4">
                            <ComparisonBarsChart title="Cost split" description="Completed units and ending WIP should stay economically plausible after the method and materials timing are selected." items={chartItems} formatter={(value) => formatPHP(value)} />
                            <ChartInsightPanel title="What the cost flow means" meaning={buildComparisonNarrative(chartItems.map((item) => ({ label: item.label, value: item.value })))} importance="Process-costing mistakes usually start with the denominator or with transferred-in cost treatment, not with final arithmetic alone." highlights={buildChartHighlights(chartItems.map((item) => ({ label: item.label, value: item.value })))} />
                        </div>
                    ) : null}
                    {tab === "compare" ? (
                        <SectionCard><p className="app-card-title text-base">Practice-check compare</p><div className="mt-4 space-y-2">{warnings.length > 0 ? warnings.map((warning) => <div key={warning} className="rounded-[1rem] border app-divider px-4 py-3 text-sm">{warning}</div>) : <div className="rounded-[1rem] border app-divider px-4 py-3 text-sm">No comparison warning is active. The structure and totals appear internally consistent.</div>}</div></SectionCard>
                    ) : null}
                    {tab === "scan-review" ? (
                        <SectionCard><p className="app-card-title text-base">Scan-linked review</p><p className="app-body-md mt-2 text-sm">{scanReview?.summary ?? "Route this page from Scan & Check to review extracted page roles and structured worksheet fields here."}</p>{scanReview?.pageRoles?.length ? <div className="mt-4 grid gap-3 md:grid-cols-2">{scanReview.pageRoles.map((role) => <div key={`${role.name}-${role.role}`} className="app-subtle-surface rounded-[1rem] px-4 py-3"><p className="app-card-title text-sm">{role.name}</p><p className="app-helper mt-1 text-xs">{role.role}</p></div>)}</div> : null}{scanReview?.structuredFields?.length ? <div className="mt-4 grid gap-3 md:grid-cols-2">{scanReview.structuredFields.map((field) => <div key={`${field.label}-${field.value}`} className="rounded-[1rem] border app-divider px-4 py-3"><p className="app-helper text-xs uppercase tracking-[0.16em]">{field.label}</p><p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">{field.value}</p>{field.inferred ? <p className="app-helper mt-1 text-xs">Inferred from merged OCR context</p> : null}</div>)}</div> : null}</SectionCard>
                    ) : null}
                </div>
            }
            explanationSection={
                <div className="space-y-4">
                    {tab === "notes" ? (
                        <>
                            <InterpretationBlock body={notes.meaning} />
                            <PracticalMeaningBlock body={notes.practicalMeaning} />
                            <CommonMistakesBlock mistakes={notes.commonMistakes} />
                            <StudyTipBlock body={notes.studyTip} />
                            <SectionCard><p className="app-card-title text-sm">Why this denominator is used</p><p className="app-body-md mt-2 text-sm">{notes.whyThisDenominator}</p></SectionCard>
                        </>
                    ) : (
                        <ChartInsightPanel title="Process-costing reading guide" meaning={notes.meaning} importance={notes.practicalMeaning} highlights={buildChartHighlights(chartItems.map((item) => ({ label: item.label, value: item.value })))} />
                    )}
                </div>
            }
            headerMeta={<span className="app-chip inline-flex items-center rounded-full px-3 py-1 text-xs">{input.method === "fifo" ? "FIFO" : "Weighted Average"}</span>}
        />
    );
}
