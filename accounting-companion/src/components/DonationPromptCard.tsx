import { Link } from "react-router-dom";

export default function DonationPromptCard({
    visible,
    onDismiss,
}: {
    visible: boolean;
    onDismiss: (mode: "later" | "forever") => void;
}) {
    if (!visible) return null;

    return (
        <section className="app-panel-elevated rounded-[1.7rem] p-4 sm:p-5 shadow-[var(--app-shadow-lg)]">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="app-kicker text-[0.68rem]">Optional support</p>
                    <h2 className="mt-2 text-lg font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                        Support future AccCalc upgrades
                    </h2>
                    <p className="app-body-md mt-2 text-sm leading-6">
                        If AccCalc has been useful for solving, checking, or studying,
                        optional support helps fund OCR tuning, testing, and new
                        learning-focused tools. This is always optional and never blocks
                        your work.
                    </p>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <Link
                    to="/settings#support-accalc"
                    className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                    Open support section
                </Link>
                <button
                    type="button"
                    onClick={() => onDismiss("later")}
                    className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-medium"
                >
                    Dismiss
                </button>
                <button
                    type="button"
                    onClick={() => onDismiss("forever")}
                    className="app-button-ghost rounded-xl px-4 py-2.5 text-sm font-medium"
                >
                    Don&apos;t show again
                </button>
            </div>
        </section>
    );
}
