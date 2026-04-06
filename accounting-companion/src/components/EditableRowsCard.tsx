import type { ReactNode } from "react";
import SectionCard from "./SectionCard";

type EditableRowsColumn = {
    key: string;
    label: string;
    placeholder: string;
    step?: string;
    inputMode?: "decimal" | "numeric" | "text";
};

type EditableRow = {
    id: string;
    [key: string]: string;
};

type EditableRowsCardProps = {
    title: string;
    description?: string;
    rows: EditableRow[];
    columns: EditableRowsColumn[];
    addLabel: string;
    onAdd: () => void;
    onRemove: (id: string) => void;
    onChange: (id: string, key: string, value: string) => void;
    footer?: ReactNode;
};

export default function EditableRowsCard({
    title,
    description,
    rows,
    columns,
    addLabel,
    onAdd,
    onRemove,
    onChange,
    footer,
}: EditableRowsCardProps) {
    return (
        <SectionCard>
            <div className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="app-card-title text-base">{title}</p>
                        {description ? (
                            <p className="app-body-md mt-1 text-sm">{description}</p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={onAdd}
                        className="app-button-ghost rounded-full px-3 py-1.5 text-xs font-semibold"
                    >
                        {addLabel}
                    </button>
                </div>

                <div className="space-y-3">
                    {rows.map((row, index) => (
                        <div
                            key={row.id}
                            className="app-subtle-surface rounded-[1.1rem] px-3.5 py-3.5"
                        >
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <p className="app-label">Line {index + 1}</p>
                                {rows.length > 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => onRemove(row.id)}
                                        className="app-button-ghost rounded-full px-3 py-1 text-xs font-semibold"
                                    >
                                        Remove
                                    </button>
                                ) : null}
                            </div>

                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {columns.map((column) => (
                                    <div key={`${row.id}-${column.key}`} className="space-y-2">
                                        <label className="app-label block">
                                            {column.label}
                                        </label>
                                        <input
                                            type={column.key === "label" ? "text" : "number"}
                                            value={row[column.key] ?? ""}
                                            onChange={(event) =>
                                                onChange(row.id, column.key, event.target.value)
                                            }
                                            placeholder={column.placeholder}
                                            inputMode={
                                                column.inputMode ??
                                                (column.key === "label" ? "text" : "decimal")
                                            }
                                            step={column.step ?? "any"}
                                            aria-label={`${column.label} ${index + 1}`}
                                            className={[
                                                "app-field w-full rounded-[1rem] px-3.5 py-2.5 text-[0.95rem] outline-none",
                                                column.key === "label" ? "" : "app-numeric",
                                            ].join(" ")}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {footer}
            </div>
        </SectionCard>
    );
}
