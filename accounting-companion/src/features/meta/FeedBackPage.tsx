import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";

const GOOGLE_FORM_URL = "https://forms.gle/WeDBquynkrQtHdp66";
const GOOGLE_FORM_EMBED_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScELR3n03VZ3tkdzRb777gH3XkpJDOKvsfPUaWTNtX7KkOauw/viewform?embedded=true";

export default function FeedbackPage() {
    const hasForm = GOOGLE_FORM_URL.trim() !== "";
    const hasEmbedForm = GOOGLE_FORM_EMBED_URL.trim() !== "";

    return (
        <div className="space-y-6">
            <PageHeader
                badge="Settings / Feedback"
                title="Help improve AccCalc"
                description="Share bugs, suggestions, missing calculators, and interface issues that can make AccCalc better for students and professionals."
            />

            <SectionCard>
                <div className="space-y-4 text-sm leading-7 text-gray-300 md:text-base">
                    <p>
                        Feedback helps prioritize the next calculators, improve Smart
                        Solver vocabulary, and refine the interface for real student and
                        professional use cases, including mobile, installed PWA, and
                        deployed-site behavior.
                    </p>

                    {hasForm ? (
                        <div className="flex flex-wrap gap-3">
                            <a
                                href={GOOGLE_FORM_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl bg-green-500/80 px-4 py-2 text-sm font-medium text-white"
                            >
                                Open Feedback Form
                            </a>
                        </div>
                    ) : null}
                </div>
            </SectionCard>

            {hasEmbedForm ? (
                <SectionCard>
                    <h2 className="text-lg font-semibold text-white">Send feedback directly</h2>
                    <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
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
                </SectionCard>
            ) : (
                <SectionCard>
                    <h2 className="text-lg font-semibold text-white">Embed not added yet</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-300">
                        To embed the form directly, open your Google Form, choose the
                        embed option, then copy the iframe `src` URL into
                        `GOOGLE_FORM_EMBED_URL`.
                    </p>
                </SectionCard>
            )}
        </div>
    );
}
