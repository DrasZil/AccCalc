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
                    <label key={`${field.key}-${index}`} className="space-y-2">
                        <span className="app-helper text-xs uppercase tracking-[0.14em]">
                            {field.label} {field.inferred ? "• Inferred" : "• OCR"}
                        </span>
                        <input
                            value={field.value}
                            onChange={(event) =>
                                onChange(
                                    fields.map((currentField, currentIndex) =>
                                        currentIndex === index
                                            ? { ...currentField, value: event.target.value }
                                            : currentField
                                    )
                                )
                            }
                            className="app-field w-full rounded-[0.95rem] px-3 py-2 text-sm"
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}
