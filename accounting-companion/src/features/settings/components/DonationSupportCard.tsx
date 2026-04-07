import { DONATION_SUPPORT_CONFIG } from "../../../utils/supportConfig";

export default function DonationSupportCard() {
    return (
        <div className="space-y-4 rounded-[1rem] border app-divider px-4 py-4">
            <div>
                <p className="app-card-title text-sm">{DONATION_SUPPORT_CONFIG.title}</p>
                <p className="app-body-md mt-1 text-sm">{DONATION_SUPPORT_CONFIG.message}</p>
            </div>

            {DONATION_SUPPORT_CONFIG.qrImageSrc ? (
                <div className="grid gap-4 md:grid-cols-[10rem_minmax(0,1fr)] md:items-center">
                    <div className="app-subtle-surface overflow-hidden rounded-[1rem] p-3">
                        <img
                            src={DONATION_SUPPORT_CONFIG.qrImageSrc}
                            alt={DONATION_SUPPORT_CONFIG.qrAltText}
                            className="h-auto w-full rounded-[0.85rem]"
                        />
                    </div>
                    <p className="app-helper text-xs leading-5">{DONATION_SUPPORT_CONFIG.footnote}</p>
                </div>
            ) : (
                <p className="app-helper text-xs leading-5">
                    No QR code is configured yet. Add one through VITE_DONATION_QR_SRC when you are ready.
                </p>
            )}
        </div>
    );
}

