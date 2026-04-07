import { useMemo, useState } from "react";
import MediaViewerModal from "../../../components/media/MediaViewerModal";
import {
    copyPlainText,
    downloadRemoteAsset,
    shareSupportDetails,
} from "../../../utils/mediaActions";
import {
    DONATION_SUPPORT_CONFIG,
    type DonationSupportConfig,
} from "../../../utils/supportConfig";

type ActionState = "idle" | "copied" | "downloaded" | "shared" | "opened";

type SupportAccCalcSectionProps = {
    compact?: boolean;
    spotlight?: boolean;
};

function ActionFeedback({ state }: { state: ActionState }) {
    if (state === "idle") return null;

    const text =
        state === "copied"
            ? "Support details copied."
            : state === "downloaded"
              ? "QR image download started."
              : state === "shared"
                ? "Support details shared."
                : "Payment link opened.";

    return (
        <p className="app-helper rounded-full bg-[var(--app-accent-soft)] px-3 py-2 text-xs text-[color:var(--app-text)]">
            {text}
        </p>
    );
}

function SupportActions({
    config,
    onActionState,
}: {
    config: DonationSupportConfig;
    onActionState: (state: ActionState) => void;
}) {
    const copyValue = useMemo(
        () =>
            [config.paymentName, config.paymentHandle]
                .filter(Boolean)
                .join(" • "),
        [config.paymentHandle, config.paymentName]
    );

    return (
        <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => {
                        if (!config.qrImageSrc) return;
                        void downloadRemoteAsset(config.qrImageSrc, "accalc-support-qr.jpg")
                            .then(() => onActionState("downloaded"))
                            .catch(() => onActionState("idle"));
                    }}
                    className="app-button-primary rounded-xl px-4 py-3 text-sm font-semibold"
                >
                    Download QR
                </button>
                <button
                    type="button"
                    onClick={() => {
                        void shareSupportDetails({
                            title: config.title,
                            text: [config.subtitle, config.message, copyValue]
                                .filter(Boolean)
                                .join("\n"),
                            url: config.externalPaymentLink ?? undefined,
                        }).then((result) =>
                            onActionState(result === "shared" ? "shared" : "copied")
                        );
                    }}
                    className="app-button-secondary rounded-xl px-4 py-3 text-sm font-semibold"
                >
                    Share support info
                </button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
                <button
                    type="button"
                    disabled={!copyValue}
                    onClick={() => {
                        if (!copyValue) return;
                        void copyPlainText(copyValue)
                            .then(() => onActionState("copied"))
                            .catch(() => onActionState("idle"));
                    }}
                    className="app-button-ghost rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50"
                >
                    Copy payment details
                </button>
                <button
                    type="button"
                    disabled={!config.externalPaymentLink}
                    onClick={() => {
                        if (!config.externalPaymentLink || typeof window === "undefined") return;
                        window.open(config.externalPaymentLink, "_blank", "noopener,noreferrer");
                        onActionState("opened");
                    }}
                    className="app-button-ghost rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50"
                >
                    Open payment link
                </button>
            </div>
        </div>
    );
}

export default function SupportAccCalcSection({
    compact = false,
    spotlight = false,
}: SupportAccCalcSectionProps) {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [expandedWhy, setExpandedWhy] = useState(false);
    const [actionState, setActionState] = useState<ActionState>("idle");
    const config = DONATION_SUPPORT_CONFIG;
    const copyDetails = [config.paymentName, config.paymentHandle].filter(Boolean);

    return (
        <>
            <div
                className={[
                    "overflow-hidden rounded-[1.6rem] border app-divider",
                    spotlight
                        ? "bg-[linear-gradient(135deg,rgba(245,247,250,0.96),rgba(255,255,255,0.9))] p-0"
                        : "app-panel p-0",
                ].join(" ")}
            >
                <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1.1fr)]">
                    <div className="border-b app-divider px-5 py-5 lg:border-b-0 lg:border-r lg:px-6 lg:py-6">
                        <p className="app-section-kicker text-[0.68rem]">Optional support</p>
                        <h3 className="mt-2 text-[1.45rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                            {config.title}
                        </h3>
                        <p className="app-body-md mt-2 text-sm">{config.subtitle}</p>
                        <p className="app-body-md mt-3 text-sm">{config.message}</p>

                        {copyDetails.length > 0 ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {copyDetails.map((detail) => (
                                    <span
                                        key={detail}
                                        className="app-chip rounded-full px-3 py-1 text-xs"
                                    >
                                        {detail}
                                    </span>
                                ))}
                            </div>
                        ) : null}

                        <div className="mt-5 flex flex-wrap gap-2.5">
                            <button
                                type="button"
                                onClick={() => setViewerOpen(true)}
                                className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                            >
                                Open support QR
                            </button>
                            <button
                                type="button"
                                onClick={() => setExpandedWhy((current) => !current)}
                                className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                            >
                                {expandedWhy ? "Hide why support helps" : "Why support helps"}
                            </button>
                        </div>

                        {expandedWhy ? (
                            <div className="app-subtle-surface mt-4 rounded-[1.15rem] px-4 py-4">
                                <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                    Why support helps
                                </p>
                                <p className="app-body-md mt-2 text-sm">
                                    Support helps cover OCR tuning, accounting worksheet expansion,
                                    testing across phones and browsers, and the slower work needed to
                                    keep explanations accurate instead of rushed.
                                </p>
                            </div>
                        ) : null}

                        <div className="mt-4">
                            <ActionFeedback state={actionState} />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setViewerOpen(true)}
                        className="group relative flex min-h-[18rem] items-center justify-center overflow-hidden bg-white px-6 py-6 text-left"
                    >
                        {config.qrImageSrc ? (
                            <img
                                src={config.qrImageSrc}
                                alt={config.qrAltText}
                                className={[
                                    "max-h-[19rem] w-full max-w-[19rem] rounded-[1.6rem] object-contain shadow-[0_24px_60px_rgba(15,23,42,0.12)] transition duration-300",
                                    compact ? "max-h-[13rem] max-w-[13rem]" : "",
                                    "group-hover:scale-[1.02]",
                                ].join(" ")}
                            />
                        ) : (
                            <div className="max-w-sm text-center text-slate-600">
                                <p className="text-base font-semibold text-slate-900">
                                    No support QR configured
                                </p>
                                <p className="mt-2 text-sm">
                                    Add a QR source in the centralized support config to enable the full donation flow.
                                </p>
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.05))] px-5 py-4">
                            <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                                Tap for full view, download, share, or copy details
                            </p>
                        </div>
                    </button>
                </div>
            </div>

            <MediaViewerModal
                open={viewerOpen}
                onClose={() => setViewerOpen(false)}
                title={config.viewerTitle}
                subtitle={config.subtitle}
                imageSrc={config.qrImageSrc}
                imageAlt={config.qrAltText}
                helperText={config.footnote}
                footer={
                    <div className="space-y-4">
                        <div className="app-panel rounded-[1.25rem] p-4">
                            <p className="app-card-title text-sm">Support details</p>
                            <p className="app-body-md mt-2 text-sm">{config.message}</p>
                            {config.paymentName ? (
                                <p className="app-helper mt-3 text-xs uppercase tracking-[0.16em]">
                                    Payment name
                                </p>
                            ) : null}
                            {config.paymentName ? (
                                <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                                    {config.paymentName}
                                </p>
                            ) : null}
                            {config.paymentHandle ? (
                                <p className="app-helper mt-3 text-xs uppercase tracking-[0.16em]">
                                    Payment handle
                                </p>
                            ) : null}
                            {config.paymentHandle ? (
                                <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                                    {config.paymentHandle}
                                </p>
                            ) : null}
                        </div>

                        <SupportActions
                            config={config}
                            onActionState={(state) => setActionState(state)}
                        />

                        <ActionFeedback state={actionState} />
                    </div>
                }
            />
        </>
    );
}
