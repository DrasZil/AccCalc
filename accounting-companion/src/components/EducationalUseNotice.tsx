type EducationalUseNoticeProps = {
    area: "tax" | "audit" | "legal" | "governance";
    compact?: boolean;
};

const COPY: Record<EducationalUseNoticeProps["area"], { title: string; body: string }> = {
    tax: {
        title: "Educational tax review only",
        body: "Use this as classroom support for assumptions, formulas, and issue spotting. Verify current rates, forms, taxpayer classification, deadlines, and official tax-authority guidance before real filing or advice.",
    },
    audit: {
        title: "Educational audit support only",
        body: "Use this to organize planning, evidence, materiality, and response thinking. It does not replace current auditing standards, firm methodology, professional judgment, or an engagement-specific audit opinion.",
    },
    legal: {
        title: "Educational legal/RFBT review only",
        body: "Use this for classroom issue spotting and reviewer practice. It is not legal advice and should be checked against current law, regulations, jurisprudence, and qualified professional guidance.",
    },
    governance: {
        title: "Educational governance review only",
        body: "Use this to structure risk, ethics, control, and escalation analysis. Real organizations still need current policies, applicable standards, and professional judgment.",
    },
};

export default function EducationalUseNotice({
    area,
    compact = false,
}: EducationalUseNoticeProps) {
    const copy = COPY[area];

    return (
        <div
            className={[
                "app-tone-info rounded-[1rem] border border-[color:var(--app-border-subtle)]",
                compact ? "px-3.5 py-3 text-xs leading-5" : "px-4 py-3.5 text-sm leading-6",
            ].join(" ")}
        >
            <p className="app-label text-[0.66rem]">{copy.title}</p>
            <p className="mt-2 text-[color:var(--app-text)]">{copy.body}</p>
        </div>
    );
}
