type ScanPreprocessPreviewProps = {
    originalUrl: string;
    processedUrl: string | null;
};

export default function ScanPreprocessPreview({
    originalUrl,
    processedUrl,
}: ScanPreprocessPreviewProps) {
    return (
        <div className="grid gap-3 md:grid-cols-2">
            <div className="app-subtle-surface rounded-[1rem] p-3">
                <p className="app-helper text-xs uppercase tracking-[0.16em]">Original</p>
                <img
                    src={originalUrl}
                    alt="Original scan preview"
                    className="mt-2 w-full rounded-[0.9rem]"
                />
            </div>
            <div className="app-subtle-surface rounded-[1rem] p-3">
                <p className="app-helper text-xs uppercase tracking-[0.16em]">Preprocessed</p>
                {processedUrl ? (
                    <img
                        src={processedUrl}
                        alt="Preprocessed scan preview"
                        className="mt-2 w-full rounded-[0.9rem]"
                    />
                ) : (
                    <p className="app-body-md mt-2 text-sm">
                        Preprocessing preview appears after OCR starts.
                    </p>
                )}
            </div>
        </div>
    );
}

