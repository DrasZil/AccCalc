import type { DragEvent } from "react";

type ScanDropzoneProps = {
    onFiles: (files: File[]) => void | Promise<void>;
};

export default function ScanDropzone({ onFiles }: ScanDropzoneProps) {
    function handleDrop(event: DragEvent<HTMLLabelElement>) {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files).filter((file) =>
            file.type.startsWith("image/")
        );
        void onFiles(files);
    }

    return (
        <label
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="app-panel block min-w-0 cursor-pointer rounded-[1.2rem] border-dashed p-5 text-center"
        >
            <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    void onFiles(files);
                    event.currentTarget.value = "";
                }}
            />
            <p className="app-card-title app-wrap-anywhere text-sm">Drop or choose multiple images</p>
            <p className="app-body-md app-wrap-anywhere mt-2 text-sm">
                Printed text, screenshots, textbook pages, and decent handwriting work best.
            </p>
            <p className="app-helper app-wrap-anywhere mt-2 text-xs">
                Supported: PNG, JPG, WEBP, GIF. Maximum 8 MB per image.
            </p>
        </label>
    );
}
