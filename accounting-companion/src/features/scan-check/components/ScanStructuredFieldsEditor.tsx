import type { StructuredScanField } from "../types";

type ScanStructuredFieldsEditorProps = {
    fields: StructuredScanField[];
    onChange: (nextFields: StructuredScanField[]) => void;
};

export default function ScanStructuredFieldsEditor({
    fields,
    onChange,
}: ScanStructuredFieldsEditorProps) {
    if (fields.length === 0) return null;

    return (
        <div className="rounded-[1rem] border app-divider px-3 py-3">
            <p className="app-helper text-xs uppercase tracking-[0.16em]">
                Structured field review
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
                {fields.map((field, index) => (
                    <label
                        key={`${field.key}-${index}`}
                        className={[
                            "space-y-2 rounded-[1rem] border px-3 py-3",
                            field.needsReview
                                ? "border-[color:var(--app-warning)] bg-[color:var(--app-warning-soft)]/45"
                                : "app-divider",
                        ].join(" ")}
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="app-helper text-xs uppercase tracking-[0.14em]">
                                {field.label} {field.inferred ? "- Inferred" : "- OCR"}
                            </span>
                            {field.valueKind ? (
                                <span className="app-chip rounded-full px-2 py-0.5 text-[0.58rem]">
                                    {field.valueKind}
                                </span>
                            ) : null}
                            <span className="app-chip rounded-full px-2 py-0.5 text-[0.58rem]">
                                {Math.round(field.confidence)}%
                            </span>
                            {field.needsReview ? (
                                <span className="app-chip-accent rounded-full px-2 py-0.5 text-[0.58rem]">
                                    Review
                                </span>
                            ) : null}
                        </div>
                        <input
                            value={field.value}
                            onChange={(event) =>
                                onChange(
                                    fields.map((currentField, currentIndex) =>
                                        currentIndex === index
                                            ? {
                                                  ...currentField,
                                                  value: event.target.value,
                                                  needsReview: true,
                                              }
                                            : currentField
                                    )
                                )
                            }
                            className="app-field w-full rounded-[0.95rem] px-3 py-2 text-sm"
                        />
                        {field.normalizedValue && field.normalizedValue !== field.value ? (
                            <p className="app-helper text-xs">
                                Suggested normalized value: {field.normalizedValue}
                            </p>
                        ) : null}
                        {field.sourceLine ? (
                            <p className="app-helper text-xs leading-5">
                                Source line: {field.sourceLine}
                            </p>
                        ) : null}
                    </label>
                ))}
            </div>
        </div>
    );
}
