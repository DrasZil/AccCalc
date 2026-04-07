import { useEffect, useRef, useState } from "react";

type ScanCameraCaptureProps = {
    onCapture: (file: File) => void;
};

export default function ScanCameraCapture({ onCapture }: ScanCameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [status, setStatus] = useState<
        "idle" | "requesting" | "live" | "unsupported" | "blocked"
    >("idle");

    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    async function startCamera() {
        if (!navigator.mediaDevices?.getUserMedia) {
            setStatus("unsupported");
            return;
        }

        try {
            setStatus("requesting");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setStatus("live");
        } catch {
            setStatus("blocked");
        }
    }

    function captureFrame() {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (!context) return;

        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
            if (!blob) return;
            onCapture(
                new File([blob], `capture-${Date.now()}.png`, {
                    type: "image/png",
                })
            );
        }, "image/png");
    }

    return (
        <div className="app-subtle-surface rounded-[1.2rem] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="app-card-title text-sm">Camera capture</p>
                    <p className="app-helper mt-1 text-xs leading-5">
                        AccCalc only requests camera access after you choose live capture here.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={startCamera}
                    className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                >
                    {status === "live" ? "Camera ready" : "Start camera"}
                </button>
            </div>

            {status === "live" ? (
                <div className="mt-4 space-y-3">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="max-h-64 w-full rounded-[1rem] object-cover"
                    />
                    <button
                        type="button"
                        onClick={captureFrame}
                        className="app-button-primary rounded-xl px-4 py-2 text-sm font-medium"
                    >
                        Capture image
                    </button>
                </div>
            ) : null}

            {status === "blocked" ? (
                <p className="app-helper mt-3 text-xs">
                    Camera access was blocked. You can still use file upload.
                </p>
            ) : null}
        </div>
    );
}

