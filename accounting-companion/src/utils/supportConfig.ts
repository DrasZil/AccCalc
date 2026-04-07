export type DonationSupportConfig = {
    title: string;
    subtitle: string;
    message: string;
    viewerTitle: string;
    qrImageSrc: string | null;
    qrAltText: string;
    paymentName: string;
    paymentHandle: string;
    externalPaymentLink: string | null;
    footnote: string;
};

export const DONATION_SUPPORT_CONFIG: DonationSupportConfig = {
    title: "Support AccCalc",
    subtitle: "Optional support that keeps the app improving without cluttering the main workflow.",
    message:
        "Support AccCalc's continued development. Donations help cover time, improvements, testing, OCR enhancements, and new student-friendly features. Any amount helps.",
    viewerTitle: "Support AccCalc",
    qrImageSrc: import.meta.env.VITE_DONATION_QR_SRC || "/DonationQr.jpg",
    qrAltText: "Support AccCalc QR code",
    paymentName: import.meta.env.VITE_DONATION_PAYMENT_NAME || "AccCalc Support",
    paymentHandle: import.meta.env.VITE_DONATION_PAYMENT_HANDLE || "@accalc",
    externalPaymentLink: import.meta.env.VITE_DONATION_PAYMENT_LINK || null,
    footnote:
        import.meta.env.VITE_DONATION_QR_SRC
            ? "This QR image is loaded from your configured support source."
            : "Replace the placeholder QR by setting VITE_DONATION_QR_SRC to your live donation image.",
};
