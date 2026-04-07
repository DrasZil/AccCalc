type AccountingWorksheetRow = {
    label: string;
    values: Array<string | number>;
    note?: string;
    emphasis?: "normal" | "subtotal" | "total";
};

type AccountingWorksheetTableProps = {
    title: string;
    description?: string;
    columns: string[];
    rows: AccountingWorksheetRow[];
};

export default function AccountingWorksheetTable({
    title,
    description,
    columns,
    rows,
}: AccountingWorksheetTableProps) {
    return (
        <div className="app-panel rounded-[1.25rem] p-4 md:p-5">
            <div className="max-w-2xl">
                <p className="app-card-title text-base">{title}</p>
                {description ? (
                    <p className="app-body-md mt-1 text-sm">{description}</p>
                ) : null}
            </div>

            <div className="mt-4 hidden overflow-hidden rounded-[1rem] border app-divider md:block">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-[var(--app-accent-soft)]">
                        <tr>
                            <th className="px-3 py-3 text-left font-semibold">Line</th>
                            {columns.map((column) => (
                                <th key={column} className="px-3 py-3 text-right font-semibold">
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={`${title}-${row.label}`}
                                className={[
                                    "border-t app-divider",
                                    row.emphasis === "total"
                                        ? "bg-[var(--app-accent-soft)]"
                                        : row.emphasis === "subtotal"
                                          ? "bg-[color:var(--app-surface-muted)]"
                                          : "",
                                ].join(" ")}
                            >
                                <td className="px-3 py-3 align-top">
                                    <p className="font-semibold text-[color:var(--app-text)]">
                                        {row.label}
                                    </p>
                                    {row.note ? (
                                        <p className="app-helper mt-1 text-xs">{row.note}</p>
                                    ) : null}
                                </td>
                                {row.values.map((value, index) => (
                                    <td
                                        key={`${row.label}-${index}`}
                                        className="px-3 py-3 text-right text-[color:var(--app-text)]"
                                    >
                                        {value}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 space-y-3 md:hidden">
                {rows.map((row) => (
                    <div
                        key={`${title}-${row.label}-mobile`}
                        className={[
                            "rounded-[1rem] border app-divider px-4 py-3",
                            row.emphasis === "total"
                                ? "bg-[var(--app-accent-soft)]"
                                : row.emphasis === "subtotal"
                                  ? "app-subtle-surface"
                                  : "",
                        ].join(" ")}
                    >
                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                            {row.label}
                        </p>
                        {row.note ? <p className="app-helper mt-1 text-xs">{row.note}</p> : null}
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {columns.map((column, index) => (
                                <div
                                    key={`${row.label}-${column}`}
                                    className="rounded-[0.9rem] bg-[color:var(--app-surface-muted)] px-3 py-2.5"
                                >
                                    <p className="app-helper text-[0.68rem] uppercase tracking-[0.14em]">
                                        {column}
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                                        {row.values[index]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
