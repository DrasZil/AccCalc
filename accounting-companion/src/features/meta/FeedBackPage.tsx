import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import { useNetworkStatus } from "../../utils/networkStatus";

const GOOGLE_FORM_URL = "https://forms.gle/WeDBquynkrQtHdp66";
const GOOGLE_FORM_EMBED_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScELR3n03VZ3tkdzRb777gH3XkpJDOKvsfPUaWTNtX7KkOauw/viewform?embedded=true";

export default function FeedbackPage() {
    const network = useNetworkStatus();
    const hasForm = GOOGLE_FORM_URL.trim() !== "";
    const hasEmbedForm = GOOGLE_FORM_EMBED_URL.trim() !== "";

    return (
        <div className="app-page-stack">
            <PageHeader
                badge="Settings / Feedback"
                title="Help improve AccCalc"
                description="Share bugs, suggestions, missing calculators, and interface issues that can make AccCalc better for students and professionals."
            />

            {!network.online ? (
                <SectionCard className="app-tone-warning">
                    <h2 className="app-section-title text-lg">Feedback needs internet access</h2>
                    <p className="app-body-md mt-2 text-sm">
                        The calculator workspace still works offline, but the feedback form and embedded Google Form are intentionally unavailable until you reconnect.
                    </p>
                </SectionCard>
            ) : null}

            <SectionCard>
                <div className="space-y-4 text-sm leading-7 text-[color:var(--app-text-secondary)] md:text-base">
                    <p>
                        Feedback helps prioritize the next calculators, improve Smart Solver
                        vocabulary, and refine the interface for real student and professional use
                        cases, including mobile, installed PWA, and deployed-site behavior.
                    </p>

                    {hasForm ? (
                        <div className="flex flex-wrap gap-3">
                            <a
                                href={GOOGLE_FORM_URL}
                                target="_blank"
                                rel="noreferrer"
                                aria-disabled={!network.online}
                                className={[
                                    "app-button-primary rounded-xl px-4 py-2 text-sm font-medium",
                                    !network.online ? "pointer-events-none opacity-60" : "",
                                ].join(" ")}
                            >
                                Open Feedback Form
                            </a>
                        </div>
                    ) : null}
                </div>
            </SectionCard>

            {hasEmbedForm ? (
                <SectionCard>
                    <h2 className="app-section-title text-lg">Send feedback directly</h2>
                    {network.online ? (
                        <div className="mt-4 overflow-hidden rounded-[1.5rem] border app-divider bg-[var(--app-field-bg)]">
                            <iframe
                                src={GOOGLE_FORM_EMBED_URL}
                                width="100%"
                                height="900"
                                className="w-full"
                                title="AccCalc Feedback Form"
                            >
                                Loading...
                            </iframe>
                        </div>
                    ) : (
                        <div className="app-subtle-surface mt-4 rounded-[1.3rem] px-4 py-4">
                            <p className="app-body-md text-sm">
                                Reconnect to the internet to load the embedded feedback form.
                            </p>
                        </div>
                    )}
                </SectionCard>
            ) : (
                <SectionCard>
                    <h2 className="app-section-title text-lg">Embed not added yet</h2>
                    <p className="app-body-md mt-2 text-sm">
                        To embed the form directly, open your Google Form, choose the embed option,
                        then copy the iframe `src` URL into `GOOGLE_FORM_EMBED_URL`.
                    </p>
                </SectionCard>
            )}
        </div>
    );
}
