import MediaViewerModal from "../../../components/media/MediaViewerModal";

type ScanImagePreviewModalProps = {
    open: boolean;
    title: string;
    imageSrc: string | null;
    helperText?: string;
    onClose: () => void;
};

export default function ScanImagePreviewModal({
    open,
    title,
    imageSrc,
    helperText,
    onClose,
}: ScanImagePreviewModalProps) {
    return (
        <MediaViewerModal
            open={open}
            title={title}
            subtitle="Tap outside or close when you are done reviewing the image."
            imageSrc={imageSrc}
            imageAlt={title}
            helperText={helperText}
            onClose={onClose}
        />
    );
}
