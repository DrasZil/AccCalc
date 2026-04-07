export type DonationSupportConfig = {
    title: string;
    message: string;
    qrImageSrc: string | null;
    qrAltText: string;
    footnote: string;
};

export const DONATION_SUPPORT_CONFIG: DonationSupportConfig = {
    title: "Support AccCalc",
    message:
        "Support AccCalc's continued development. Donations help cover time, improvements, testing, and new features that make the app more accurate, useful, and student-friendly. Any amount helps.",
    qrImageSrc: import.meta.env.VITE_DONATION_QR_SRC || "/DonationQr.jpg",
    qrAltText: "Support AccCalc QR code",
    footnote:
        import.meta.env.VITE_DONATION_QR_SRC
            ? "This QR image is loaded from your configured support source."
            : "Replace the placeholder QR by setting VITE_DONATION_QR_SRC to your live donation image.",
};
